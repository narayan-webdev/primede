import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import orderBy from "../../../services/orderBy.js";
import Activity_log from "../models/activity_log.js";


export async function create(req, res) {
  try {

    const activity_log = await Activity_log.create(req.body);
    return res.status(200).send({
      message: "Activity Log Created Successfully!",
      data: activity_log,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some error occured while creating activity log",
      })
    );
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const logs = await Activity_log.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
    });
    const meta = await getMeta(pagination, logs.count);
    return res.status(200).send({ data: logs.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function findOne(req, res) {
  try {

    const id = req.params.id;
    const log = await Activity_log.findOne({
      where: { id: id },
    });
    if (!log) {
      return res.status(404).send(errorResponse({ message: "Invalid Activity Log ID" }));
    }
    return res.status(200).send({ data: log });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Failed to fetch the activity log",
      })
    );
  }
}

export async function update(req, res) {
  try {

    const id = req.params.id;
    const [updatedRowsCount, updatedLog] = await Activity_log.update(req.body, {
      where: { id: id },
      returning: true,
    });
    if (updatedRowsCount === 0) {
      return res.status(404).send(
        errorResponse({
          status: 400,
          message: "Invalid Activity Log Id",
          details: "Invalid id to fetch activity log",
        })
      );
    }
    return res.status(200).send({
      message: "Activity Log Updated Successfully!",
      data: updatedLog[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "some internal server error occured",
      })
    );
  }
}

export const _delete = async (req, res) => {
  try {

    const id = req.params.id;
    const deletedRowCount = await Activity_log.destroy({
      where: { id: id },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send(
        errorResponse({
          message: "Invalid Id To delete",
          details: "activity log id is invalid",
        })
      );
    }
    return res.status(200).send({ message: "Activity Log Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Failed to delete the activity log",
      })
    );
  }
};
