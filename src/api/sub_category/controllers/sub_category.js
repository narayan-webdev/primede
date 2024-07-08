import { errorResponse } from "../../../services/errorResponse.js";
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
