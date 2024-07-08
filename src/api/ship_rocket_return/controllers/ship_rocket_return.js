import { errorResponse } from "../../../services/errorResponse.js";
import * as jwt from "../../../services/jwt.js";
import { getPagination, getMeta } from "../../../services/pagination.js";
import orderBy from "../../../services/orderBy.js";
import Ship_rocket_return from "../models/ship_rocket_return.js";

export async function create(req, res) {
  try {

    const body = req.body;

    const Ship_rocket_return = await Ship_rocket_return.create(body);

    return res.status(200).send(Ship_rocket_return);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);

    const Ship_rocket_returns = await Ship_rocket_return.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
    });

    const meta = await getMeta(pagination, Ship_rocket_returns.count);

    return res.status(200).send({ data: Ship_rocket_returns.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

export async function findOne(req, res) {
  try {

    const { id } = req.params;

    const Ship_rocket_return = await Ship_rocket_return.findOne({
      where: { id },
    });

    if (Ship_rocket_return) {
      return res.status(200).send({ data: Ship_rocket_return });
    } else {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Invalid Ship Rocket Order Return ID",
        })
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;

    const getShip_rocket_return = await Ship_rocket_return.findByPk(id);

    if (!getShip_rocket_return) {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Invalid Ship Rocket Order Return ID",
        })
      );
    }

    const Ship_rocket_return = await Ship_rocket_return.update(req.body, {
      where: { id },
      returning: true,
    });

    return res.status(200).send({
      message: "Ship_rocket_return Updated",
      data: Ship_rocket_return[1][0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

const _delete = async (req, res) => {
  try {

    const { id } = req.params;

    const getShip_rocket_return = await Ship_rocket_return.findByPk(id);

    if (getShip_rocket_return) {
      const Ship_rocket_return = await Ship_rocket_return.destroy({
        where: { id },
      });

      return res.status(200).send({
        status: 201,
        message: "Ship_rocket_return Deleted Successfully",
      });
    } else {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Invalid Ship Rocket Order Return ID",
        })
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
};
export { _delete as _delete };
