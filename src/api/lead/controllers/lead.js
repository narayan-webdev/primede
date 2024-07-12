// Controller function to create a new post

import { Op, QueryError } from "sequelize";
import { errorResponse } from "../../../services/errorResponse.js";
import orderBy from "../../../services/orderBy.js"; import { getPagination, getMeta } from "../../../services/pagination.js";
import { createActivityLog } from "../../../services/createActivityLog.js";
import { verify } from "../../../services/jwt.js";
import { activity_event } from "../../../constants/activity_log.js";
import { lead_status, lead_source, lead_type } from "../../../constants/lead.js";
import tenantMetric from "../../../services/tenantMetric.js";
import { tenant_metric_fields } from "../../../constants/tenant_metric.js";
import excelExport from "../../../services/excelExport.js";
import { getPreviousDates } from "../../../services/date.js";
import User from "../../user/models/user.js";
import Product from "../../product/models/product.js";
import Lead from "../models/lead.js";


export async function create(req, res) {
  const t = await req.db.transaction();
  try {

    const body = req.body;
    const token = verify(req);

    const product = await Product.findByPk(body.ProductId)
    if (!product || !product.enquiry_enabled) {
      return res.status(400).send(errorResponse({ status: 400, message: !product ? "Invalid Product ID" : "Enquiry Is not enabled for this product" }))
    }
    const phone = body.phone
    if (body.hasOwnProperty("phone") && body.phone.length > 10) {
      const trimedPhone = phone.trim().split(" ").join("").slice(-10);
      body.phone = trimedPhone;
    }

    const lead = await Lead.create({ ...body, type: "HOT_LEAD", status: "OPEN" }, { transaction: t });

    await createActivityLog({ sequelize, UserId: token.id, event: activity_event.NEW_LEAD_ADDED, transaction: t });
    // await tenantMetric({ subdomain: req.subdomain, field_name: tenant_metric_fields.total_leads });
    await t.commit();
    return res.status(201).send({
      message: "Lead created successfully!",
      data: lead,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).send(errorResponse({
      status: 500,
      message: error.message,
      details: "Failed to create a lead",
    }));
  }
}

// Controller function to get all posts
export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);

    const order = orderBy(query);
    const whereClause = {};

    // code to validate query filters
    if (query.hasOwnProperty("status")) {
      whereClause.status = query.status;
    }
    if (query.hasOwnProperty("source")) {
      whereClause.source = query.source;
    }
    if (query.hasOwnProperty("type")) {
      whereClause.type = query.type;
    }
    const leads = await Lead.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      order: order,
      where: whereClause,
      include: [
        {
          model: sequelize.models.Product, as: "product", attributes: ["id", "name"],
          include: [{ model: sequelize.models.Media, as: "thumbnail", attributes: ["id", "url"] }]
        },
        {
          model: User, as: "assigned_to",
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: User, as: "user",
          attributes: ["id", "name", "email", "phone"]
        }
      ]
    });

    const meta = await getMeta(pagination, leads.count);
    return res.status(200).send({ data: leads.rows, meta });
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

// Controller function to get all posts
export async function exportLeads(req, res) {
  try {

    const query = req.query;
    const body = req.body;
    const whereClause = {};
    if (body.items.length && Array.isArray(body.items)) {
      whereClause.id = { [Op.in]: body.items }
    }
    const order = orderBy(query);
    const leads = await Lead.findAll({
      where: whereClause,
      order: order,
      include: [{ model: Product, as: "product", include: ["thumbnail", "gallery"] }],
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
    const lead = await Lead.findByPk(id, { include: [{ model: sequelize.models.Product, as: "product", include: ["thumbnail", "gallery"] }] });
    if (!lead) {
      return res.status(404).send(errorResponse({ status: 404, message: "Lead not found", details: "lead id seems to be invalid" }));
    }
    return res.status(200).send({ data: lead });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;
    const getLead = await Lead.findByPk(id);

    if (!getLead) {
      return res.status(404).send(errorResponse({ status: 404, message: "Lead not found", details: "lead id seems to be invalid" }));
    }
    await Lead.update(req.body, { where: { id } });

    return res.status(200).send({ message: "Lead updated successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}



const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getLead = await Lead.findByPk(id);

    if (!getLead) {
      return res.status(404).send(errorResponse({ status: 404, message: "Lead not found", details: "lead id seems to be invalid" }));
    }
    await Lead.destroy({ where: { id } });
    return res.status(200).send({ message: "Lead deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message }));
  }
};
export { _delete as _delete };


export async function search(req, res) {
  try {

    const query = req.query;
    const qs = query.qs.trim();
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const leads = await Lead.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${qs}%` } }, { phone: { [Op.iLike]: `%${qs}%` } }],
      },
      include: [{ model: sequelize.models.Product, as: "product", include: ["thumbnail", "gallery"] }]
    });

    const meta = await getMeta(pagination, leads.count);
    return res.status(200).send({ data: leads.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}
export async function stats(req, res) {
  try {

    const allStatuses = Object.values(lead_status);
    const allSources = Object.values(lead_source);
    const alltype = Object.values(lead_type);

    const initialStatusCounts = Object.fromEntries(allStatuses.map((status) => [status, 0]));
    const initialSourceCounts = Object.fromEntries(allSources.map((source) => [source, 0]));
    const initialTypeCounts = Object.fromEntries(alltype.map((type) => [type, 0]));

    const counts = await Lead.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "statusCount"],
        "source",
        [sequelize.fn("COUNT", sequelize.col("source")), "sourceCount"],
        "type",
        [sequelize.fn("COUNT", sequelize.col("type")), "typeCount"],
      ],
      group: ["status", "source", "type"],
    });

    const finalStats = {
      status: { ...initialStatusCounts },
      source: { ...initialSourceCounts },
      type: { ...initialTypeCounts }
    };

    counts.forEach((count) => {
      const status = count.dataValues.status;
      const source = count.dataValues.source;
      const type = count.dataValues.type;
      finalStats.status[status] = +count.dataValues.statusCount || 0;
      finalStats.source[source] = +count.dataValues.sourceCount || 0;
      finalStats.type[type] = +count.dataValues.typeCount || 0;
    });

    return res.status(200).send({ data: finalStats });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}
