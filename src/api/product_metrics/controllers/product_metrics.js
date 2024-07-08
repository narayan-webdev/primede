// Import necessary modules and services
import { Op, literal, or } from "sequelize";
import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";


export async function create(req, res) {
  try {

    const body = req.body;

    // Create product metrics
    const productMetrics = await Product_metric.create(body);

    return res.status(200).send({
      message: "Product metrics created successfully!",
      data: productMetrics,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


export async function find(req, res) {
  try {

    const query = req.query;

    console.log(sequelize);

    const pagination = await getPagination(query.pagination);
    const productMetrics = await Product_metric.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, productMetrics.count);

    return res.status(200).send({ data: productMetrics.rows, meta });
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

    const productMetrics = await Product_metric.findByPk(id);

    if (!productMetrics) {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid  ID" }));
    }

    return res.status(200).send({ data: productMetrics });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


export async function update(req, res) {
  try {

    const { id } = req.params;
    const body = req.body;

    const productMetrics = await Product_metric.findByPk(id);

    if (!productMetrics) {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid  ID" }));
    }

    // Update product metrics
    await productMetrics.update({
      view_count: body.view_count,
      ordered_count: body.ordered_count,
      shares_count: body.shares_count,
      revenue_generated: body.revenue_generated,
      profit_margin: body.profit_margin,
      premium_plan_orders: body.premium_plan_orders,
    });

    return res.status(200).send({
      message: "Product metrics updated successfully!",
      data: productMetrics,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


const _delete = async (req, res) => {
  try {

    const { id } = req.params;

    const productMetrics = await Product_metric.findByPk(id);

    if (!productMetrics) {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid  ID" }));
    }

    // Delete product metrics
    await productMetrics.destroy();

    return res.status(200).send({ message: "Product metrics deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
export { _delete as _delete };
