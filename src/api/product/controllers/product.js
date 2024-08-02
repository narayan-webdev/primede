import fs from "fs";
import path, { join } from "path";
import { launch } from "puppeteer";
import { Op, json, literal, or, where } from "sequelize";
import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import bulkTag from "../services/blukTag.js";
import priceFilter from "../services/priceFilter.js";
import productMetrics from "../../../services/productMetrics.js";
import orderBy from "../../../services/orderBy.js";
import tenantMetric from "../../../services/tenantMetric.js";
import { tenant_metric_fields } from "../../../constants/tenant_metric.js";
import { product_metric_field } from "../../../constants/productMetric.js";
import pdfGenerator from "../services/pdfGenerator.js";
import excelExport from "../../../services/excelExport.js";
import shopify from "../services/shopify.js";
import importProduct from "../services/importProduct.js";
import { IntraktNotify } from "../../../services/notification.js";
import { verify } from "../../../services/jwt.js";
import User_product from './../models/user_product.js';
import Product from "../models/product.js";
import Variant from "../../variant/models/variant.js";
import sequelize from "../../../../database/index.js";
import Media from "../../upload/models/media.js";
import Category from "../../category/models/category.js";
import Collection from "../../collection/models/collection.js";
import Product_metric from "../../product_metrics/models/product_metrics.js";
import User from "../../user/models/user.js";
import Product_review from "../../product_review/models/product_review.js";
import Attribute from "../../variant/models/attribute.js";
import AttributeValue from "../../variant/models/attributevalue.js";
import Coupon from "../../coupon/models/coupon.js";
import Tag from "../../tag/models/tag.js";
import { converToJson, convertToOriginalStructure } from "../services/converter.js";
const Product_gallery = sequelize.models.Product_gallery;
const Variant_gallery = sequelize.models.Variant_gallery;
const CollectionProduct = sequelize.models.CollectionProduct;

export async function create(req, res) {
  const t = await sequelize.transaction();
  try {

    const body = req.body;

    const product = await Product.create(req.body, { transaction: t });
    for (const variant of body.variants) {
      //primary attribute 
      const primary_attribute = await Attribute.create({ name: variant.primary.name }, { transaction: t })
      const primary_attribute_value = await AttributeValue.create({
        value: variant.primary.values.value,
        hex_code: variant.primary.values.hex_code,
        AttributeId: primary_attribute.id
      }, { transaction: t })

      // secondary attribute 
      const secondary_attribute = await Attribute.create({ name: variant.secondary.name }, { transaction: t })
      const secondary_attribute_value = await AttributeValue.create({
        value: variant.secondary.values.value,
        hex_code: variant.secondary.values.hex_code,
        AttributeId: secondary_attribute.id
      }, { transaction: t })

      //variant
      const newVariant = await Variant.create({
        name: variant.name,
        price: variant.price,
        strike_price: variant.strike_price,
        quantity: variant.quantity,
        ProductId: product.id,
        from: variant.from,
        to: variant.to,
        ThumbnailId: variant.ThumbnailId,
        PrimaryAttributeId: primary_attribute_value.id,
        SecondaryAttributeId: secondary_attribute_value.id
      }, { transaction: t })

      // variants gallery 
      if (variant.gallery && variant.gallery.length) {
        const VGarray = variant.gallery.map((item) => {
          return { MediaId: item, VariantId: newVariant.id };
        })
        await Variant_gallery.bulkCreate(VGarray, { transaction: t })
      }
    }

    if (body.CollectionId) {
      await CollectionProduct.create({ ProductId: product.id, CollectionId: body.CollectionId }, { transaction: t })
    }
    await Product_metric.create({ ProductId: product.id }, { transaction: t })

    // product gellery
    if (body.gallery.length) {
      const obj = body.gallery.flatMap((item) => {
        return { MediaId: item, ProductId: product.id };
      });
      await Product_gallery.bulkCreate(obj, { transaction: t });
    }
    const tags = body.tags;
    let createdTags;
    if (tags && tags.length > 0) {
      createdTags = await bulkTag({
        sequelize,
        tags,
        ProductId: product.id,
        transaction: t,
      });
    }
    if (body.reviews && body.reviews.length) {
      const reviewArray = body.reviews.map((item) => {
        return {
          ...item, ProductId: product.id
        }
      })
      const product_review = await Product_review.bulkCreate(reviewArray, { transaction: t });
    }
    await t.commit();
    // const productThumbnail = await Media.findByPk(body.thumbnail)
    const data = {
      containsImage: true, body: [body.name, "1299"], hasButton: false, phoneNumber: "8349988146",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
    }
    IntraktNotify(data, sequelize, "PRODUCT")

    return res.status(200).send({
      message: "Product and variants created successfully!",
      data: { product, },
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const category = req.query.category;
    const minPrice = (query.price && parseFloat(query.price.min)) || 0;
    const maxPrice = (query.price && parseFloat(query.price.max)) || Number.MAX_SAFE_INTEGER;

    let whereClauseProduct = { is_active: true };
    let whereClauseVariant = {}
    if (query.hasOwnProperty("status") && ["true", "false"].includes(query.status)) {
      whereClauseProduct.is_active = query.status === "true" ? true : false
    }

    if (query.hasOwnProperty("status") && ["all"].includes(query.status)) {
      whereClauseProduct = {}
    }

    if (query.hasOwnProperty("status") && ["out-of-stock"].includes(query.status)) {
      whereClauseVariant.quantity = 0;
    }

    const pagination = await getPagination(query.pagination);
    const order = priceFilter(query, sequelize);

    const products = await Product.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      ...(category ? { where: { CategoryId: { [Op.in]: JSON.parse(category) } } } : {}),
      distinct: true,
      include: [
        {
          model: Variant,
          as: "variants",
          where: {
            ...whereClauseVariant,
            ...(query.price && {
              price: {
                [Op.between]: [minPrice, maxPrice],
              },
            }),
          },
          attributes: ["name", "id", "price", "strike_price", "quantity", "is_active"],
          include: ["gallery", "thumbnail", "primary_attribute", "secondary_attribute"],
        },
        // "tags",
        "gallery",
        "thumbnail",
        "sub_category",
        "category",
        "collections",
        "product_metrics",
        "size_chart"
        // {
        //   model:  Product_review, as: "product_reviews",
        //   attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'average_rating']],
        // }
      ],
      where: {
        ...whereClauseProduct
      },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "ratings"],
        ],
      },
    });

    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    }));
  }
}

export async function findOne(req, res) {
  const t = await sequelize.transaction();
  try {

    const { id } = req.params;
    let product = await Product.findOne({
      where: {
        id: id,
        is_active: true,
      },
      include: [
        {
          model: Variant,
          as: "variants",
          attributes: {
            exclude: ["is_active", "createdAt", "updatedAt"]
          },
          include: [
            {
              model: Media,
              as: "thumbnail",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: Media,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              as: "gallery",
              through: { attributes: [] }
            },
            {
              model: AttributeValue,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              as: "primary_attribute",
              include: [
                {
                  model: Attribute,
                  as: "attribute",
                  attributes: { exclude: ["createdAt", "updatedAt"] }
                }
              ]
            },
            {
              model: AttributeValue,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              as: "secondary_attribute",
              include: [
                {
                  model: Attribute,
                  as: "attribute",
                  attributes: { exclude: ["createdAt", "updatedAt"] }
                }
              ]
            },],
        },

        {
          model: Media,
          as: "thumbnail",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Media,
          as: "size_chart",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Tag,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          as: "tags",
          through: { attributes: [] }
        },
        {
          model: Media,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          as: "gallery",
          through: { attributes: [] }
        },
        "sub_category",
        {
          model: Collection,
          as: "collections",
          through: { attributes: [] },
          include: [{
            model: Coupon,
            as: "coupons",
          }],
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'
            ),
            "ratings",
          ],
        ],
      },
    });

    if (!product) {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Product not found!",
          details: "product id seems to be invalid",
        })
      );
    }

    const coupons = product.collections.flatMap((item) => {
      return item.coupons.flatMap((item) => item)
    })

    const randomProducts = await Product.findAll({
      where: {
        id: {
          [Op.ne]: id,
        },
        is_active: true,
        ...(product.dataValues.CategoryId
          ? {
            CategoryId: product.dataValues.CategoryId,
          }
          : {})
      },

      order: sequelize.literal("RANDOM()"),
      limit: 6,
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'
            ),
            "rating",
          ],
        ],
      },
      include: [
        {
          model: Variant,
          as: "variants",
          attributes: ["id", "price"],
          // include: ["thumbnail", "gallery", "primary_attribute", "secondary_attribute"],
        },
        {
          model: Media,
          as: "thumbnail",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    await productMetrics({
      sequelize,
      product_id: [product.id],
      field_name: product_metric_field.view_count,
      transaction: t,
    });
    await t.commit();
    return res.status(200).send({ data: { product: { ...product.dataValues, coupons }, randomProducts } });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const body = req.body;

    const getProduct = await Product.findByPk(id);
    if (!getProduct) {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Product ID seems to be invalid!",
          details: "Requested Product Id does not exist",
        })
      );
    }

    const [rows, [product]] = await Product.update(body, {
      where: { id },
      returning: true,
      transaction: t,
    });

    if (body.gallery && body.gallery.length) {
      const productMedia = await Product_gallery.findAll({
        where: { ProductId: id },
      });

      const oldArray = productMedia.map((entry) => entry.MediaId);
      const newArray = body.gallery;

      const newElements = newArray.filter((item) => !oldArray.includes(item));
      const removedElements = oldArray.filter((item) => !newArray.includes(item));

      const addArray = newElements.map((item) => ({
        ProductId: id,
        MediaId: item,
      }));

      await Product_gallery.destroy({
        where: { MediaId: removedElements },
        transaction: t,
      });

      await Product_gallery.bulkCreate(addArray, { transaction: t });
    }

    await t.commit();

    return res.status(200).send({
      message: "Product updated successfully!",
      data: product,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getProduct = await Product.findByPk(id);
    if (!getProduct) {
      return res.status(400).send(errorResponse({
        status: 400,
        message: "Product ID seems to be invalid!",
        details: "Requested Product Id Does not exists",
      }));
    }
    const product = await Product.destroy({ is_active: false }, { where: { id } });
    const variants = await Variant.destroy({ is_active: false }, { where: { ProductId: id } });
    return res.status(200).send({ message: "product deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
export { _delete as _delete };

export async function search(req, res) {
  try {

    const query = req.query;
    const qs = query.qs.trim();
    const pagination = await getPagination(query.pagination);
    const tags = query?.tags?.toLowerCase().split("_");
    const order = orderBy(req.query);
    const products = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${qs}%` } },
          { description: { [Op.iLike]: `%${qs}%` } },
          literal(
            `EXISTS (SELECT * FROM "Variants" AS "variants" WHERE "Product"."id" = "variants"."ProductId" AND "variants"."name" ILIKE '%${qs}%')`
          ),
        ],
        is_active: true
      },
      order: order,
      offset: pagination.offset,
      limit: pagination.limit,
      distinct: true,
      include: [
        {
          model: Variant,
          as: "variants",
          include: ["thumbnail", "gallery", "primary_attribute", "secondary_attribute"],
        },
        {
          model: Category,
          as: "category",
        },
        "thumbnail",
        {
          model: Tag,
          as: "tags",
          ...(query.tags && {
            where: {
              name: {
                [Op.iLike]: { [Op.any]: tags.map((item) => `%${item}%`) },
              },
            },
          }),
        },
      ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "rating"],
        ],
      },
    });
    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function findByPrice(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const price = query.price;
    const products = await Product.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: [order],
      distinct: true,
      include: [
        {
          model: Variant,
          as: "variants",
          include: ["thumbnail", "gallery", "primary_attribute", "secondary_attribute"],
          where: {
            [Op.and]: [
              {
                price: {
                  [Op.gte]: price.min,
                },
              },
              {
                price: {
                  [Op.lte]: price.max,
                },
              },
            ],
          },
        },
        {
          model: Media,
          as: "thumbnail",
        },
        {
          model: Category,
          as: "category",
        },
        "tags",
        "gallery",
      ],
      where: {
        is_active: true
      },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "rating"],
        ],
      },
    });
    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function findNRandom(req, res) {
  try {

    const n = req.params.n;

    const products = await Product.findAll({
      order: sequelize.literal("RANDOM()"),
      limit: n,
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "ratings"],
        ],
      },
      include: [
        {
          model: Variant,
          as: "variants",
          where: {
            [Op.and]: [
              {
                price: {
                  [Op.gte]: price.min,
                },
              },
              {
                price: {
                  [Op.lte]: price.max,
                },
              },
            ],
          },
        },
        {
          model: Media,
          as: "thumbnail",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
      ],
      where: {
        is_active: true
      }
    });

    return res.status(200).send({ data: products });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function findNRandomInCategory(req, res) {
  try {

    const n = req.params.n;
    const category_id = req.params.id;
    const products = await Product.findAll({
      where: {
        CategoryId: category_id,
        is_active: true
      },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "ratings"],
        ],
      },
      order: sequelize.literal("RANDOM()"),
      limit: n,
      include: [
        {
          model: Variant,
          as: "variants",
          include: ["thumbnail",],
          where: {
            [Op.and]: [
              {
                price: {
                  [Op.gte]: price.min,
                },
              },
              {
                price: {
                  [Op.lte]: price.max,
                },
              },
            ],
          },
        },
        {
          model: Media,
          as: "thumbnail",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
      ],
    });

    return res.status(200).send({ data: products });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function catalouge(req, res) {
  try {
    console.log("entered in Puppeteer");

    const id = req.params.id;

    const products = await Product.findAll({ where: { id: id }, include: ["thumbnail", "variants"] })

    const pdfpath = await pdfGenerator(JSON.parse(JSON.stringify(products)).map((item) => {
      item.thumbnail.url = `http://${"lavisha"}.api.mtl.hangs.in/${item.thumbnail.url}`;
      console.log(item.thumbnail.url)
      return item.dataValues
    }))

    const url = `https://${req.subdomain}.store.api.mtl.hangs.in/catalouge/${products}`;
    // const url = `https://192.168.3.82.store.api.mtl.hangs.in/catalouge/${products}`;
    const outputfile = join(process.cwd(), "public", "uploads", "example.pdf");

    // Launch the browser
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" }); // or "domcontentloaded"
    await page.setViewport({ width: 1080, height: 1024 });

    // Generate a PDF with background and save to public/uploads directory
    const pdf = await page.pdf({ path: outputfile, format: "A4", printBackground: true });

    // const pdf = fs.readFileSync(path.join(process.cwd(), "output.pdf"), "base64")
    // const pdfBuffer = Buffer.from(pdf, "base64")

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

    await browser.close();

    // res.status(201).sendFile(pdfpath.filename);
    res.status(201).send(pdf);
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function findNTrending(req, res) {
  try {

    const n = req.params.n;
    const productMetrics = await Product_metric.findAll({
      limit: n,
      order: [["view_count", "DESC"]],
      raw: true,
      include: [{
        model: Product, where: { is_active: true }, as: "product"
      }]
    });

    const productIds = productMetrics.map((item) => item.ProductId);
    const products = await Product.findAll({
      where: { id: productIds },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "ratings"],
        ],
      },
      include: [
        {
          model: Variant,
          as: "variants",
          include: ["thumbnail"],
        },
        {
          model: Media,
          as: "thumbnail",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
        "gallery",
      ],
    });

    return res.status(200).send({ data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server error",
        details: error.message,
      })
    );
  }
}

export async function findNSelling(req, res) {
  try {

    const n = req.params.n;

    const productMetrics = await Product_metric.findAll({
      limit: n,
      order: [["ordered_count", "DESC"]],
      raw: true,
      include: [{
        model: Product, where: { is_active: true }, as: "product"
      }]
    });

    const productIds = productMetrics.map((item) => item.ProductId);

    const products = await Product.findAll({
      where: { id: productIds },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "ratings"],
        ],
      },
      include: [
        {
          model: Variant,
          as: "variants",
          include: ["thumbnail"],
        },
        {
          model: Media,
          as: "thumbnail",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
        "gallery",
      ],
    });

    return res.status(200).send({ data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).send(errorResponse({
      status: 500,
      message: "Internal server error",
      details: error.message,
    }));
  }
}

export async function exportToExcel(req, res) {
  try {

    const query = req.query;
    const body = req.body;
    const whereClause = {};
    if (body.items.length && Array.isArray(body.items)) {
      whereClause.id = { [Op.in]: body.items }
    }
    const order = orderBy(query);
    const products = await Product.findAll({
      where: whereClause,
      order: order,
      include: [{ model: Variant, as: "variants", include: ["thumbnail", "gallery"] }],
      raw: true
    });
    if (!products.length) {
      return res.status(400).send({ message: `No data found for last ${query.days}` })
    }

    const excelFile = await excelExport(products)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"')
    return res.status(200).send(excelFile);
  } catch (error) {
    return res.status(500).send(errorResponse({ status: 500, message: error.message, details: error }))
  }
}

export async function importFromShopify(req, res) {
  try {

    const { access_token, api_key, api_secret, domain } = req.body;
    const products = await importProduct({ access_token, api_key, api_secret, domain })
    if (products) {
      return res.status(200).send({ message: "Products Imported Successfully!" });
    } else {
      return res.status(500).send(errorResponse({ message: "internal server error", }))
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(errorResponse({ status: 500, message: error.message, details: error }))
  }
}

export async function simpleData(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const order = priceFilter(query, sequelize);
    const products = await Product.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      attributes: ['id', 'name']
    });
    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    }));
  }
}

export async function shareProduct(req, res) {
  try {
    const { id } = req.params;
    console.log(id)
    const createMetric = await productMetrics({ field_name: product_metric_field.shares_count, product_id: [id] })
    return res.status(200).send({ message: "product share count updated" })
  } catch (error) {
    return res.status(500).send(errorResponse({ status: 500, message: error.message }))
  }
}

export async function productsByReview(req, res) {
  try {
    console.log("sdf")

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const products = await Product.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: orderBy(query),
      attributes: ['id', 'name',
        [sequelize.literal('(select count(*) from "Product_reviews" where "Product_reviews"."ProductId" = "Product"."id")'), "reviewCount"]
      ],
      distinct: true,
      include: [
        { model: Media, as: "thumbnail", attributes: ["id", "url"] },
        {
          model: Product_review,
          as: 'product_reviews', // Assuming the name of your review association is 'reviews'
          attributes: [], // Exclude attributes from the Review model
          required: true, // This ensures that only products with reviews are included
        }],
    });
    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    }));
  }
}

export async function stats(req, res) {
  try {

    const [allProducts, inActiveProducts, activeProduct, outOfStock] = await Promise.all([
      await Product.count(),
      await Product.count({ where: { is_active: false } }),
      await Product.count({ where: { is_active: true } }),
      await Product.count({
        distinct: true,
        include: [{
          model: Variant,
          as: "variants",
          where: {
            quantity: 0
          }
        }]
      }),

    ])

    return res.status(200).send({
      data: {
        allProducts: allProducts,
        activeProduct: activeProduct,
        inActiveProducts: inActiveProducts,
        outOfStock: outOfStock
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

export async function productImport(req, res) {
  try {

    const body = req.body;
    if (!body.products || !body.products.length) {
      return res.status(400).send(errorResponse({ message: "invalid body payload", details: "please send products in the body" }))
    }
    const products_ids = body.products;

    const resellerId = verify(req)
    const productsArray = products_ids.map((item) => {
      return { ProductId: item, UserId: resellerId.id }
    })
    console.log(productsArray)
    const userProdcts = await User_product.bulkCreate(productsArray, { updateOnDuplicate: ["UserId", "ProductId"] })
    return res.status(200).send({ message: "product imported" })
  } catch (error) {
    return res.status(500).send(errorResponse({ message: error.message, status: 500 }))
  }
}

export async function bulkUpdate(req, res) {
  const t = await sequelize.transaction();
  try {
    const body = req.body;
    const [rows, [updated]] = await Product.update(body, {
      where: { id: { [Op.in]: body.products } },
      returning: true,
      transaction: t,
    });
    await t.commit();
    return res.status(200).send({
      message: "Product updated successfully!",
      data: updated,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function bulkUpload(req, res) {
  const t = await sequelize.transaction();
  try {

    const jsonoutput = await converToJson(path.join(process.cwd(), req.file.path))
    const outputArray = convertToOriginalStructure(jsonoutput)
    console.log(jsonoutput)
    const array = [
      {
        "name": "WNESY Women's Rayon Nyra Cut Printed Embrodery Dark Blue Flared Kurti Pant With Dupatta Set",
        "description": "urta Set Fabric: Cotton Blend || Kurta Set Color :- Blue Style: Straight || Length: Calf Length || Sleeves: 3/4 Sleeves",
        "short_description": "",
        "is_active": "true",
        "cod_enabled": "true",
        "product_return": "true",
        "shipping_value": "100",
        "enquiry_enabled": "true",
        "show_price": "true",
        "shipping_value_type": "SHIPPING_PRICE",
        "yt_video_link": "",
        "rating": "4.5",
        "createdAt": "2024-07-03T10:19:45.474Z",
        "updatedAt": "2024-07-19T07:47:34.602Z",
        "CategoryId": "1",
        "SubCategoryId": "1",
        "ThumbnailId": "1",
        "SizeChartId": "",
        "ratings": "null",
        "variants": [
          {
            "name": "GoSriKi Women's Cotton Blend Straight Printed Kurta",
            "price": "1900",
            "strike_price": "1900",
            "quantity": "10",
            "ProductId": "10",
            "PrimaryAttributeId": "29",
            "SecondaryAttributeId": "31",
            "ThumbnailId": "4",
            "thumbnail": {
              "name": "",
              "url": "null"
            },
            "gallery": [
              {
                "name": "asdf",
                "url": "null"
              },
              {
                "name": "adsfs",
                "url": "null"
              },
              {
                "name": "ss",
                "url": "null"
              }
            ],
            "primary_attribute": {
              "value": "blue",
              "hex_code": "#FFFFFF",
              "AttributeId": "29",
              "attribute": {
                "name": "color"
              }
            },
            "secondary_attribute": {
              "value": "M",
              "hex_code": "null",
              "AttributeId": "31",
              "attribute": {
                "name": "size"
              }
            }
          },
          {
            "name": "GoSriKi Women's Cotton Blend Straight Printed Kurta",
            "price": "1900",
            "strike_price": "1900",
            "quantity": "10",
            "ProductId": "10",
            "PrimaryAttributeId": "29",
            "SecondaryAttributeId": "32",
            "ThumbnailId": "4",
            "thumbnail": {
              "name": "",
              "url": "null"
            },
            "gallery": [
              {
                "name": "asdf",
                "url": "null"
              },
              {
                "name": "adsfs",
                "url": "null"
              },
              {
                "name": "ss",
                "url": "null"
              }
            ],
            "primary_attribute": {
              "value": "blue",
              "hex_code": "#FFFFFF",
              "AttributeId": "29",
              "attribute": {
                "name": "color"
              }
            },
            "secondary_attribute": {
              "value": "L",
              "hex_code": "null",
              "AttributeId": "32",
              "attribute": {
                "name": "size"
              }
            }
          }
        ],
        "thumbnail": {
          "name": "",
          "url": "null"
        },
        "category": {
          "name": "apple"
        },
        "sub_category": {
          "name": "shirt"
        },
        "tags": [
          {
            "name": "kurta"
          },
          {
            "name": "women"
          }
        ],
        "gallery": [
          {
            "name": "asdf",
            "url": "null"
          },
          {
            "name": "adsfs",
            "url": "null"
          },
          {
            "name": "ss",
            "url": "null"
          }
        ]
      }
    ]
    for (const body of array) {
      const product = await Product.create(body, { transaction: t });
      for (const variant of body.variants) {
        //primary attribute 
        const primary_attribute = await Attribute.create({ name: variant.primary_attribute.attribute.name }, { transaction: t })
        const primary_attribute_value = await AttributeValue.create({
          value: variant.primary_attribute.value,
          hex_code: variant.primary_attribute.hex_code,
          AttributeId: primary_attribute.id
        }, { transaction: t })

        // secondary attribute 
        const secondary_attribute = await Attribute.create({ name: variant.secondary_attribute.attribute.name }, { transaction: t })
        const secondary_attribute_value = await AttributeValue.create({
          value: variant.secondary_attribute.value,
          hex_code: variant.secondary_attribute.hex_code,
          AttributeId: secondary_attribute.id
        }, { transaction: t })

        //variant
        const newVariant = await Variant.create({
          name: variant.name,
          price: +variant.price,
          strike_price: variant.price,
          quantity: +variant.quantity,
          ProductId: product.id,
          from: variant.from,
          to: variant.to,
          ThumbnailId: +variant.ThumbnailId,
          PrimaryAttributeId: primary_attribute_value.id,
          SecondaryAttributeId: secondary_attribute_value.id
        }, { transaction: t })

        // variants gallery 
        if (variant.gallery && variant.gallery.length) {
          const VGarray = variant.gallery.map((item) => {
            return { MediaId: item, VariantId: newVariant.id };
          })
          await Variant_gallery.bulkCreate(VGarray, { transaction: t })
        }
      }

      if (body?.CollectionId) {
        await CollectionProduct.create({ ProductId: product.id, CollectionId: body.CollectionId }, { transaction: t })
      }
      await Product_metric.create({ ProductId: product.id }, { transaction: t })

      // product gellery
      if (body.gallery.length) {
        const obj = body.gallery.flatMap((item) => {
          return { MediaId: item, ProductId: product.id };
        });
        await Product_gallery.bulkCreate(obj, { transaction: t });
      }
      const tags = body.tags;
      let createdTags;
      if (tags && tags.length > 0) {
        createdTags = await bulkTag({
          sequelize,
          tags,
          ProductId: product.id,
          transaction: t,
        });
      }

    }
    await t.commit();

    return res.status(200).send({
      message: "Product updated successfully!",
      data: JSON.parse(JSON.stringify(outputArray)),
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}