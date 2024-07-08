import { createActivityLog as _createActivityLog } from "../../../services/createActivityLog.js";
import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import Group from "../models/group.js";

export async function create(req, res) {
  try {

    const { name, url } = req.body;
    const group = await Group.create({ name, url });
    const groupActivityLog = await _createActivityLog(req, res, "NEW_GROUP_ADDED", "New group created successfully!");
    return res.status(201).send({
      message: "Group created successfully!",
      data: group,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      status: 500,
      message: "Internal server error",
      details: "Failed to create a group",
    });
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);

    const groups = await Group.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, groups.count);

    return res.status(200).send({ data: groups.rows, meta });
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

export async function findOne(req, res) {
  try {

    const { id } = req.params;

    const group = await Group.findByPk(id);

    if (!group) {
      return errorResponse(res, {
        status: 404,
        message: "Group not found",
        details: "The specified group does not exist",
      });
    }

    return res.status(200).send({ data: group });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      status: 500,
      message: "Internal server error",
      details: "Failed to fetch group",
    });
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;

    const group = await Group.findByPk(id);

    if (!group) {
      return errorResponse(res, {
        status: 404,
        message: "Group not found",
        details: "The specified group does not exist",
      });
    }

    await group.update(req.body);

    return res.status(200).send({
      message: "Group updated successfully!",
      data: group,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      status: 500,
      message: "Internal server error",
      details: "Failed to update group",
    });
  }
}

const _delete = async (req, res) => {
  try {

    const { id } = req.params;

    const group = await Group.findByPk(id);

    if (!group) {
      return errorResponse(res, {
        status: 404,
        message: "Group not found",
        details: "The specified group does not exist",
      });
    }

    await group.destroy();

    return res.status(200).send({ message: "Group deleted successfully!" });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      status: 500,
      message: "Internal server error",
      details: "Failed to delete group",
    });
  }
};
export { _delete as _delete };
