import { createActivityLog } from "../../../services/createActivityLog.js";
import { getPagination, getMeta } from "../../../services/pagination.js";
import { Op, col } from "sequelize";
import { errorResponse } from "../../../services/errorResponse.js";
import { verify } from "../../../services/jwt.js";
import { activity_event } from "../../../constants/activity_log.js";
import priceFilter from "../../product/services/priceFilter.js";
import { IntraktNotify } from "../../../services/notification.js";
import Collection from "../models/collection.js";
import sequelize from './../../../../database/index.js';
import Product from "../../product/models/product.js";
import Variant from "../../variant/models/variant.js";

const CollectionProduct = sequelize.models.CollectionProduct;

export async function create(req, res) {
  const t = await sequelize.transaction();
  try {

    const token = verify(req);
    const body = req.body;
    const collection = await Collection.create(req.body, { transaction: t });

    if (body.products && body.products.length) {
      const productIds = req.body.products;
      const collectionProduct = productIds.map((productId) => ({
        CollectionId: collection.id,
        ProductId: productId,
      }));
      const createProdCollection = await CollectionProduct.bulkCreate(collectionProduct, { transaction: t });
    }

    const data = {
      containsImage: true, body: [body.name, "sale"], hasButton: false, phoneNumber: "8349988146",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
    }
    IntraktNotify(data, sequelize, "COLLECTION")
    await createActivityLog({ event: activity_event.NEW_COLLECTION_ADDED, UserId: token.id, transaction: t });
    await t.commit();
    return res.status(200).send({ message: "Collection Created Successfully!", data: collection });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "failed to perform action", details: "Some internal server error occured!" }));
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const collections = await Collection.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      include: "thumbnail",
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "CollectionProduct" WHERE "CollectionProduct"."CollectionId" = "Collection"."id")'), "products"],
        ],
      },
    });
    const meta = await getMeta(pagination, collections.count);
    return res.status(200).send({ data: collections.rows, meta });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "failed to perform action", details: "Some internal server error occured!" }));
  }
}

export async function findOne(req, res) {
  try {

    const id = req.params.id;
    const collection = await Collection.findByPk(id, {
      include: ["thumbnail", { model: Product, as: "products", attributes: ["id", "name"] }],
    });
    if (!collection) {
      return res.status(404).send(errorResponse({ message: "Invalid Collection ID" }));
    }

    return res.status(200).send({ data: collection });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: error.message, details: "Some internal server error occured!" }));
  }
}

export async function update(req, res) {
  const t = await sequelize.transaction();
  try {

    const id = req.params.id;
    const [updatedRowsCount, updatedCollection] = await Collection.update(req.body, {
      where: { id: id },
      returning: true,
      transaction: t
    });
    if (updatedRowsCount === 0) {
      return res.status(404).send(errorResponse({ message: "Invalid Collection ID" }));
    }
    if (req.body.products && Array.isArray(req.body.products)) {
      const collectionProduct = await CollectionProduct.findAll({
        where: { CollectionId: id },
      });

      const oldArray = collectionProduct.map((entry) => entry.dataValues.ProductId);
      const newArray = req.body.products;

      let newElements = [];
      let removedElements = [];

      for (let i = 0; i < newArray.length; i++) {
        if (!oldArray.includes(newArray[i])) {
          newElements.push(newArray[i]);
        }
      }

      for (let i = 0; i < oldArray.length; i++) {
        if (!newArray.includes(oldArray[i])) {
          removedElements.push(oldArray[i]);
        }
      }

      const addArray = newElements.map((item) => ({
        CollectionId: id,
        ProductId: item,
      }));

      const destroyedCollection = await CollectionProduct.destroy({
        where: {
          ProductId: removedElements,
        }
      }, { transaction: t });

      await CollectionProduct.bulkCreate(addArray, { transaction: t });
    }

    await t.commit()

    return res.status(200).send({
      message: "Collection Updated Successfully!",
      data: updatedCollection[0],
    });
  } catch (error) {
    console.log(error);
    await t.rollback()
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "failed to perform action", details: "Some internal server error occured!" }));
  }
}

const _delete = async (req, res) => {
  try {

    const collectionId = req.params.id;
    const deletedRowCount = await Collection.destroy({
      where: { id: collectionId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send(errorResponse({ message: "Collection Not Found!", details: "Collection id seems to be invalid" }));
    }

    const destroyedCollection = await CollectionProduct.destroy({
      where: {
        CollectionId: collectionId,
      },
    });

    return res.status(200).send({ message: "Collection Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "failed to perform action", details: "Some internal server error occured!" }));
  }
};
export { _delete as _delete };



export async function getProductsByCollection(req, res) {
  try {

    const { id } = req.params;
    const query = req.query;
    const minPrice = (query.price && parseFloat(query.price.min)) || 0;
    const maxPrice = (query.price && parseFloat(query.price.max)) || Number.MAX_SAFE_INTEGER;

    const order = priceFilter(query, sequelize);
    const pagination = await getPagination(query.pagination);
    const collection = await Collection.findByPk(id, {
      include: ["thumbnail"],
    });
    if (!collection) {
      return res.status(404).send(errorResponse({ message: "Invalid Collection ID" }));
    }

    const products = await Product.findAndCountAll({
      order: order,
      distinct: true,
      include: [
        {
          model: Collection, as: "collections",
          where: { id: id },
          attributes: []
        },
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
          include: ["gallery", "thumbnail",],
        },
        "tags",
        "gallery",
        "thumbnail",
        "sub_category",
        "category"
      ],
      limit: pagination.limit,
      offset: pagination.offset,
      where: {
        is_active: true
      },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "rating"],
        ],
      },
    })

    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: { collection, products: products.rows }, meta });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "failed to perform action", details: "Some internal server error occured!" }));
  }
}


export async function searchProductsInCollection(req, res) {
  try {

    const { id } = req.params;
    const query = req.query;

    const collection = await Collection.findByPk(id)

    const pagination = await getPagination(query.pagination);
    const qs = query.qs.trim();

    const products = await Product.findAndCountAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${qs}%` } }, { description: { [Op.iLike]: `%${qs}%` } }],
      },
      offset: pagination.offset,
      limit: pagination.limit,
      include: ["thumbnail", {
        model: Collection, as: "collections",
        where: { id: id },
        attributes: []
      }],
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
        message: "failed to perform action",
        details: "Some internal server error occurred!",
      })
    );
  }
}

