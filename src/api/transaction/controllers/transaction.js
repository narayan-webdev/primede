// controllers/transactionController.js
import { Op, Transaction } from "sequelize";
import { getPreviousDates } from "../../../services/date.js";
import { errorResponse } from "../../../services/errorResponse.js";
import excelExport from "../../../services/excelExport.js";
import orderBy from "../../../services/orderBy.js";
import { getPagination, getMeta } from "../../../services/pagination.js";


export async function create(req, res) {
  try {

    const transaction = await Transaction.create(req.body);
    return res.status(200).send({
      message: "Transaction created successfully!",
      data: transaction,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to create a transaction" });
  }
}


export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    return res.status(200).send({ data: transaction });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


export async function find(req, res) {
  try {

    const query = req.query;
    let whereClause = {};



    // code to validate query filters
    if (query.hasOwnProperty("purpose")) {
      whereClause.purpose = query.purpose;
    }
    if (query.hasOwnProperty("txn_type")) {
      whereClause.txn_type = query.txn_type;
    }
    if (query.hasOwnProperty("mode")) {
      whereClause.mode = query.mode;
    }
    console.log(whereClause)
    const pagination = await getPagination(query.pagination);

    const transactions = await Transaction.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      where: whereClause
    });
    const meta = await getMeta(pagination, transactions.count);
    return res.status(200).send({ data: transactions.rows, meta });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(
        errorResponse({
          status: 500,
          message: "Internal server Error",
          details: error.message,
        })
      );
  }
}
export async function exportToExcel(req, res) {
  try {

    const query = req.query;
    const order = orderBy(query);

    const lastDate = getPreviousDates(query.days ? parseInt(query.days) : 7)
    const leads = await Transaction.findAll({
      where: {
        createdAt: { [Op.gte]: lastDate }
      },
      order: order,
      include: [{ model: User, as: "user", attributes: ["email", "username"] }],
      raw: true
    });
    if (!leads.length) {
      return res.status(400).send({ message: `No data found for last ${query.days}` })
    }

    const excelFile = await excelExport(leads)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"')
    return res.status(200).send(excelFile);
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    }));
  }
}

export async function search(req, res) {
  try {

    const Transaction = Transaction;
    const query = req.query;

    const pagination = await getPagination(query.pagination);

    const transactions = await Transaction.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });
    const meta = await getMeta(pagination, transactions.count);
    return res.status(200).send({ data: transactions.rows, meta });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(
        errorResponse({
          status: 500,
          message: "Internal server Error",
          details: error.message,
        })
      );
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    await transaction.update(req.body);

    return res.status(200).send({
      message: "Transaction Updated Successfully!",
      data: transaction,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to update transaction" });
  }
}


const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    await transaction.destroy();

    return res.status(200).send({ message: "Transaction Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to delete transaction" });
  }
};
export { _delete as delete };
