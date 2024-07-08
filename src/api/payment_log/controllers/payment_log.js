import { errorResponse } from "../../../services/errorResponse.js";
import { getPagination, getMeta } from "../../../services/pagination.js";
import Payment_log from "../models/payment_log.js";


export async function create(req, res) {
  try {

    const payment_log = await Payment_log.create(req.body);
    return res.status(201).send(payment_log);
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


export async function find(req, res) {
  try {

    const query = req.query;

    const pagination = await getPagination(query.pagination);

    const payment_logs = await Payment_log.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, payment_logs.count);

    return res.status(200).send({ data: payment_logs.rows, meta });
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
    const payment_log = await Payment_log.findOne({
      where: { id },
    });

    if (payment_log) {
      return res.status(200).send({ data: payment_log });
    } else {
      return res.status(400).send(errorResponse({ message: "Invalid Payment Log ID" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;
    const getpayment_log = await Payment_log.findByPk(id);

    if (getpayment_log) {
      const payment_log = await Payment_log.update(req.body, {
        where: { id },
      });
      return res.status(200).send(payment_log);
    } else {
      return res.status(400).send(errorResponse({ message: "Invalid Payment Log ID" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getpayment_log = await Payment_log.findByPk(id);

    if (getpayment_log) {
      const payment_log = await Payment_log.destroy({
        where: { id },
      });
      return res.status(200).send({ data: payment_log });
    } else {
      return res.status(400).send(errorResponse({ message: "Payment log not found" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
export { _delete as _delete };
