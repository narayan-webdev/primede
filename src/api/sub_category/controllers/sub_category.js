import { errorResponse } from "../../../services/errorResponse.js";
import { getMeta, getPagination } from "../../../services/pagination.js";
import Product from "../../product/models/product.js";
import priceFilter from "../../product/services/priceFilter.js";
import Sub_category from "../models/sub_category.js";
import sequelize from './../../../../database/index.js';

export async function create(req, res) {
  try {

    const subCategory = await Sub_category.create(req.body);
    return res.status(200).send({
      message: "Sub-category created successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  try {


    const { id } = req.params;
    const subCategory = await Sub_category.findByPk(id);

    if (!subCategory) {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid  ID" }));
    }

    await subCategory.update(req.body);

    return res.status(200).send({
      message: "Sub-category updated successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function find(req, res) {
  try {


    const subCategories = await Sub_category.findAll({
      include: ["thumbnail", "category"],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "Products" WHERE "Products"."SubCategoryId" = "Sub_category"."id")'), "products"],
        ],
      }
    });
    return res.status(200).send({ data: subCategories });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}
export async function findProducts(req, res) {
  try {
    const id = req.params.id
    const query = req.query;
    const sub_category = await Sub_category.findByPk(id);
    // const minPrice = (query.price && parseFloat(query.price.min)) || 0;
    // const maxPrice = (query.price && parseFloat(query.price.max)) || Number.MAX_SAFE_INTEGER;
    const order = priceFilter(query);
    const pagination = await getPagination(query.pagination);
    const products = await Product.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      where: { SubCategoryId: id, is_active: true },
      attributes: {
        include: [
          [sequelize.literal('(SELECT ROUND(AVG("rating"), 2) FROM "Product_reviews" WHERE "Product_reviews"."ProductId" = "Product"."id")'), "rating"],
        ],
      },
      order: order,
      distinct: true,
      include: [
        "thumbnail",
      ]
    })
    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: { sub_category, products: products.rows }, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function findOne(req, res) {
  try {


    const { id } = req.params;
    const subCategory = await Sub_category.findByPk(id, {
      include: ["thumbnail", "category"],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "Products" WHERE "Products"."SubCategoryId" = "Sub_category"."id")'), "products"],
        ],
      }
    });

    if (!subCategory) {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid  ID" }));
    }

    return res.status(200).send({ data: subCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export const _delete = async (req, res) => {
  try {


    const { id } = req.params;
    const subCategory = await Sub_category.findByPk(id);

    if (!subCategory) {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid  ID" }));
    }

    await subCategory.destroy();

    return res.status(200).send({ message: "Sub-category deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
