
import { getPagination, getMeta } from "../../../services/pagination.js";
import { Op, literal, or } from "sequelize";
import { errorResponse } from "../../../services/errorResponse.js";
import priceFilter from "../../product/services/priceFilter.js";
import Category_type from "../models/category_type.js";
import Media from "../../upload/models/media.js";
import Product from "../../product/models/product.js";
import Variant from "../../variant/models/variant.js";
import sequelize from "../../../../database/index.js";
import Category from './../../category/models/category.js';
const Variant_gallery = sequelize.models.Variant_gallery;
const Product_gallery = sequelize.models.Product_gallery;

export async function create(req, res) {
  try {
    const body = req.body;
    const category_type = await Category_type.create(body);
    if (body?.categories?.length) {
      await Category.update({ CategoryTypeId: category_type.id }, {
        where: {
          id: { [Op.in]: body.categories }
        }
      })
    }
    return res.status(200).send({ message: "Category created successfully", data: category_type });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "some internal server error occured!" }));
  }
}

export async function find(req, res) {
  try {
    const category_types = await Category_type.findAll({
      include: [
        {
          model: Media, as: "thumbnail", attributes: ["id", "url"]
        },
        {
          model: Category, as: "categories",
          include: ["subCategories"]
        }
      ],
      // attributes: {
      //   include: [
      //     [sequelize.literal('(SELECT COUNT(*) FROM "Categories" WHERE "Categories"."CategoryTypeId" = "Category_type"."id")'), "categories"],
      //     // [sequelize.literal('(SELECT COUNT(*) FROM "Sub_categories" WHERE "Sub_categories"."CategoryId" = "Category"."id")'), "sub_categories"],
      //   ],
      // },

    });
    return res.status(200).send({ data: category_types });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "some internal server error occured!" }));
  }
}

export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const category = await Category_type.findByPk(id, {
      // include: [
      //   {
      //     model: Media, as: "thumbnail", attributes: ["id", "url"]
      //   },
      //   {
      //     model: Sub_category, as: "subCategories", include: [{ model: Media, as: "thumbnail", attributes: ["id", "url"] }]
      //   }
      // ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "Categories" WHERE "Categories"."CategoryTypeId" = "Category_type"."id")'), "categories"],
        ],
      },
    });
    if (!category) {
      return res.status(404).send(errorResponse({ status: 404, message: "Category not found!", details: "Category ID seems to be invalid" }));
    }
    return res.status(200).send({ data: category });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "some internal server error occured!" }));
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;
    const body = req.body;
    const getcategorytype = await Category_type.findByPk(id);

    if (getcategorytype) {
      const body = req.body;
      const category_type = await Category_type.update(body, { where: { id: id }, returning: true });
      if (body?.categories?.length) {
        await Category.update({ CategoryTypeId: category_type.id }, {
          where: {
            id: { [Op.in]: body.categories }
          }
        })
      }
      return res.status(200).send({ message: "category updated successfully!", data: category_type[1][0] });
    } else {
      return res.status(404).send(errorResponse({ message: "category not found", details: "category id seems to be invalid , please do check" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "some internal server error occured!" }));
  }
}

export const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getcategory = await Category_type.findByPk(id);

    if (getcategory) {
      const category = await Category_type.destroy({
        where: { id },
      });
      return res.status(200).send({ message: "category deleted successfully!" });
    } else {
      return res.status(404).send(errorResponse({ message: "category not found!", details: "category id seems to be invalid" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "some internal server error occured!" }));
  }
};

export async function getProducts(req, res) {
  try {

    const { id } = req.params;
    const query = req.query;
    const minPrice = (query.price && parseFloat(query.price.min)) || 0;
    const maxPrice = (query.price && parseFloat(query.price.max)) || Number.MAX_SAFE_INTEGER;
    const order = priceFilter(query, sequelize);
    const pagination = await getPagination(query.pagination);
    const category = await Category_type.findByPk(id, {
      include: ['thumbnail']
    });
    if (!category) {
      return res.status(404).send(errorResponse({ message: "category not found", "details": "cateogory id seems to be invalid" }))
    }
    const products = await Product.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      where: { CategoryId: id, is_active: true },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "rating"],
        ],
      },
      order: order,
      distinct: true,
      include: [
        {
          model: Variant,
          as: "variants",
          ...(query.price && {
            where: {
              price: {
                [Op.between]: [minPrice, maxPrice],
              },
            },
          }),
          include: ["gallery",
            { model: Media, as: "thumbnail", attributes: ["id", "url"] },],
        },
        "tags",
        { model: Media, as: "thumbnail", attributes: ["id", "url"] },
        "gallery",
        "sub_category",
        "category",
        "collections"
      ],
      limit: pagination.limit,
      offset: pagination.offset,
    })

    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: { category, Product: products.rows }, meta });

  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "some internal server error occured!" }));
  }
}

export async function searchInCategory(req, res) {
  try {

    const { id } = req.params;
    const query = req.query;
    const qs = query.qs.trim();

    const pagination = await getPagination(query.pagination);
    const products = await Product.findAll({
      where: {
        CategoryId: id,
        [Op.or]: [
          { name: { [Op.iLike]: `%${qs}%` } },
          { description: { [Op.iLike]: `%${qs}%` } },
        ],
      },
      offset: pagination.offset,
      limit: pagination.limit,
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "rating"],
        ],
      },
    });

    const meta = await getMeta(pagination, products.length);
    return res.status(200).send({ data: products, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "some internal server error occured!" }))
  }
}
