import { getPagination, getMeta } from "../../../services/pagination.js";


import { errorResponse } from "../../../services/errorResponse.js";
import Return_order from "../models/return_order.js";

export async function create(req, res) {
  try {

    const returns = await Return_order.create(req.body);
    return res.status(200).send(returns);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to create a returns" });
  }
}

// Controller function to get all posts
export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const returnss = await Return_order.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });
    const meta = await getMeta(pagination, returnss.count);
    return res.status(200).send({ data: returnss.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch returnss" });
  }
}

export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const returns = await Return_order.findByPk(id);
    if (!returns) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    return res.status(200).send({ data: returns });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch returns" });
  }
}


export async function update(req, res) {
  try {

    const { id } = req.params;
    const getreturns = await Return_order.findByPk(id);

    if (!getreturns) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    const returns = await Return_order.update(req.body, { where: { id }, returning: true });
    return res.status(200).send({ message: "returns updated", data: returns[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch returns" });
  }
}


const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getreturns = await Return_order.findByPk(id);

    if (!getreturns) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    const returns = await Return_order.destroy({ where: { id } });
    return res.status(200).send({ message: "returns deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch returns" });
  }
};
export { _delete as _delete };
