import { getPagination, getMeta } from "../../../services/pagination.js";

// Controller function to create a new post
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

import { errorResponse } from "../../../services/errorResponse.js";

export async function create(req, res) {
  try {

    const order_status_tracker = await order_status_tracker.create(req.body);
    return res.status(200).send(order_status_tracker);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to create a order_status_tracker" });
  }
}
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
// Controller function to get all posts
export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const order_status_trackers = await Order_status_tracker.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });
    const meta = await getMeta(pagination, order_status_trackers.count);
    return res.status(200).send({ data: order_status_trackers.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch order_status_trackers" });
  }
}
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const order_status_tracker = await order_status_tracker.findByPk(id);
    if (!order_status_tracker) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    return res.status(200).send(order_status_tracker);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch order_status_tracker" });
  }
}
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

export async function update(req, res) {
  try {

    const { id } = req.params;
    const getorder_status_tracker = await order_status_tracker.findByPk(id);

    if (!getorder_status_tracker) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    const order_status_tracker = await order_status_tracker.update(req.body, { where: { id }, returning: true });
    return res.status(200).send({ message: "order_status_tracker updated", data: order_status_tracker[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch order_status_tracker" });
  }
}
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getorder_status_tracker = await order_status_tracker.findByPk(id);

    if (getorder_status_tracker) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    const order_status_tracker = await order_status_tracker.destroy({ where: { id } });
    return res.status(200).send({ message: "order_status_tracker deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch order_status_tracker" });
  }
};
export { _delete as _delete };
