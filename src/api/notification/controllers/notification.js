import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import Notification from "../models/notification.js";

export async function create(req, res) {
  try {
    const notification = await Notification.create(req.body);
    return res.status(200).send({ data: notification });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to create a notification" });
  }
}

export async function find(req, res) {
  try {
    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const notifications = await Notification.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });
    const meta = await getMeta(pagination, notifications.count);
    return res.status(200).send({ data: notifications.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch notifications" });
  }
}

export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    return res.status(200).send({ data: notification });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch notification" });
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;
    const getnotification = await Notification.findByPk(id);

    if (!getnotification) {
      return res.status(404).send(errorResponse({ message: "Invalid ID", details: `notification with id ${id} not found` }));
    }
    const notification = await Notification.update(req.body, { where: { id }, returning: true });
    return res.status(200).send({ message: "notification updated", data: notification[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch notification" });
  }
}

export const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getnotification = await Notification.findByPk(id);

    if (!getnotification) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    const notification = await Notification.destroy({ where: { id } });
    return res.status(200).send({ message: "notification deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch notification" });
  }
};
