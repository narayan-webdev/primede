
import { Sequelize, UnknownConstraintError, Op } from "sequelize";
import { errorResponse } from "../../../services/errorResponse.js";
import { getPagination, getMeta } from "../../../services/pagination.js";
import orderBy from "../../../services/orderBy.js";
import blukTag from "../../product/services/blukTag.js";


export async function create(req, res) {
  const t = await req.db.transaction();
  try {

    const createdTags = blukTag({ tags: req.body.tags, ProductId: req.body.ProductId, transaction: t })
    await t.commit();
    return res.status(200).send({ data: createdTags });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message }));
  }
}

export async function createMany(req, res) {
  try {

    const tag = await Tag.create(req.body);
    return res.status(200).send({ data: tag });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const tags = await Tag.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
    });
    const meta = await getMeta(pagination, tags.count);
    return res.status(200).send({ data: tags.rows, meta });
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
  try {

    const { id } = req.params;
    const tag = await Tag.findOne({ where: { id } });
    if (!tag) return res.status(400).send(errorResponse({ message: "Invalid Tag ID" }));
    return res.status(200).send({ data: tag });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


export async function update(req, res) {
  try {

    const { id } = req.params;
    const [gettag] = await Tag.findByPk(id);

    if (!gettag) return res.status(400).send(errorResponse({ message: "Invalid Tag ID" }));
    const tag = await Tag.update(req.body, {
      where: { id },
      returning: true,
    });
    return res.status(200).send({ message: "Tag Updated!", data: tag[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const gettag = await Tag.findByPk(id);

    if (!gettag) return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    await Tag.destroy({ where: { id } });
    return res.status(200).send({ message: `Tag with id ${id} deleted successfully!` });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};

export async function search(req, res) {
  try {

    const query = req.query;
    const qs = query.qs;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const tags = await Tag.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      where: { name: { [Op.iLike]: `%${qs}%` } },
    });
    const meta = await getMeta(pagination, tags.count);
    return res.status(200).send({ data: tags.rows, meta });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}
