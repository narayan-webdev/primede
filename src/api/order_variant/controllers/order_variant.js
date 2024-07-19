// ordersController.js
import { getPagination, getMeta } from "../../../services/pagination.js";
import { tokenError, errorResponse } from "../../../services/errorResponse.js";
import { makeOrderVariantBody } from "../services/order_variant.js";
import { verify } from "../../../services/jwt.js";
import { order_status as _order_status, payment_modes } from "../../../constants/order.js";
import orderBy from "../../../services/orderBy.js";
import { order_status } from "../../../constants/order_status.js";
import { createActivityLog } from "../../../services/createActivityLog.js";
import { activity_event } from "../../../constants/activity_log.js";
import orderTracker from "../../../services/orderTracker.js";
import excelExport from "../../../services/excelExport.js";
import { request } from "express";
import { Op } from "sequelize";
import Variant from "../../variant/models/variant.js";
import Product from "../../product/models/product.js";
import Order from "../../order/models/order.js";
import Order_variant from "../models/order_variant.js";

// ordersController.js

export async function find(req, res) {
  try {

    const query = req.query;
    const order_by = orderBy(query)
    const pagination = await getPagination(query.pagination);
    const whereClause_OV = {};
    const whereClause_O = {};
    if (query.hasOwnProperty("status")) {
      if (query.status.toLowerCase() === "all") {
      } else if (!Object.values(_order_status).includes(query.status)) {
        return res.status(400).send(errorResponse({ message: `Invalid status type select from ${Object.values(_order_status)}` }));
      } else {
        whereClause_OV.status = query.status;
      }
    }
    if (query.hasOwnProperty("payment_mode")) {
      if (!Object.values(payment_modes).includes(query.payment_mode)) {
        return res.status(400).send(errorResponse({ message: `Invalid Payment Mode Type select from ${Object.values(payment_modes)}` }));
      }
      whereClause_O.payment_mode = query.payment_mode;
    }
    if (query.hasOwnProperty("reseller_order")) {
      query.reseller_order === "true" ? (whereClause_O.is_reseller_order = true) : query.reseller_order === "false" ? (whereClause_O.is_reseller_order = false) : "";
    }
    const order_variants = await Order_variant.findAndCountAll({
      where: whereClause_OV,
      order: order_by,
      include: [
        {
          model: Variant,
          as: "variant",
          include: ["thumbnail", { model: Product, as: "product", include: ["thumbnail"], attributes: ["id", "name"] }],
        },
        {
          model: Order,
          as: "order",
          where: whereClause_O,
        },
      ],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, order_variants.count);

    return res.status(200).send({
      data: order_variants.rows,
      meta,
    });
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

export async function create(req, res) {
  try {

    const OrderVariant = Order_variant;

    const createdOrderVariant = await OrderVariant.create(req.body);

    return res.status(201).send({
      message: "Order variant created successfully!",
      data: createdOrderVariant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function findOne(req, res) {
  try {

    const id = req.params.id;
    console.log("shdf")
    const orderVariant = await Order_variant.findByPk(id, {
      include: [
        "custom_couriers",
        "shipRocketOrderItem",
        "status_tracker",
        {
          model: Variant,
          as: "variant",
          include: ["thumbnail", { model: Product, as: "product", attributes: ["id", "name"] }],
        },
        {
          model: Order,
          as: "order",
          include: ["address",
            { model: User, as: "user", attributes: { execlude: ["password"] } }],
        },

      ],
    });

    if (!orderVariant) {
      return res.status(400).send(errorResponse({ status: 400, message: "Order not found" }));
    }

    return res.status(200).send({
      data: orderVariant
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function findOneStoreUser(req, res) {
  try {

    const id = req.params.id;
    const token = verify(req)

    const orderVariant = await Order_variant.findByPk(id, {
      include: [
        {
          model: Custom_courier,
          as: "custom_couriers",
        },
        {
          model: Ship_rocket_orderitem,
          as: "shipRocketOrderItem",
        },
        {
          model: Variant,
          as: "variant",
          include: [
            {
              model: Product,
              as: "product",
              include: ["category", "sub_category", "thumbnail", "gallery"]
            },
            "thumbnail",
            "gallery",]
        },
        {
          model: Order,
          where: { UserId: token.id },
          as: "order",
          include: ["address"]
        },

      ],
    });

    // const orderVariantResponse = await makeOrderVariantBody(orderVariant, order_status_trackers);
    return res.status(200).send({
      data: orderVariant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  try {

    const OrderVariant = Order_variant;
    const orderVariantId = req.params.id;

    const [updatedRowsCount, updatedOrderVariant] = await OrderVariant.update(req.body, {
      where: { id: orderVariantId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).send(errorResponse({ message: "Order variant not found" }));
    }

    return res.status(200).send({
      message: "Order variant updated successfully!",
      data: updatedOrderVariant[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

const _delete = async (req, res) => {
  try {

    const OrderVariant = Order_variant;
    const orderVariantId = req.params.id;

    const deletedRowCount = await OrderVariant.destroy({
      where: { id: orderVariantId },
    });

    if (deletedRowCount === 0) {
      return res.status(404).send(errorResponse({ message: "Order variant not found" }));
    }

    return res.status(200).send({
      message: "Order variant deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
export { _delete as _delete };

export async function findByOrderId(req, res) {
  try {

    const OrderVariant = Order_variant;
    const orderId = req.params.id;

    const orderVariants = await OrderVariant.findAll({
      where: { OrderId: orderId },
    });

    if (!orderVariants) {
      return res.status(400).send(errorResponse({ status: 400, message: "Order is not found" }));
    }

    return res.status(200).send({
      message: `All order variants for OrderId ${orderId} retrieved successfully`,
      data: orderVariants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function updateReturnStatus(req, res) {
  try {

    const OrderVariant = Order_variant;
    const orderId = req.params.orderId;
    const variantId = req.params.variantId;

    const orderVariant = await OrderVariant.findOne({
      where: { OrderId: orderId, VariantId: variantId },
    });

    if (!orderVariant) {
      return res.status(404).send(errorResponse({ message: "Order variant not found" }));
    }

    await orderVariant.update({ status: "RETURN_REQUEST" });

    return res.status(200).send({
      message: "Return status updated successfully!",
      data: orderVariant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function storeUserOrders(req = request, res) {
  try {
    console.log("entering search");

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    let user_id;
    if (query.hasOwnProperty("user") && query.user) {
      user_id = query.user;
    } else {
      const token = verify(req);
      if (token.error) {
        return res.status(401).send(tokenError(token))
      }
      user_id = token.id;
    }

    const whereClause_OV = {}
    const whereClause_O = {}

    if (query.hasOwnProperty("status")) {
      if (query.status.toLowerCase() === "all") {
      } else if (!Object.values(_order_status).includes(query.status)) {
        return res.status(400).send(errorResponse({ message: `Invalid status type select from ${Object.values(_order_status)}` }));
      } else {
        whereClause_OV.status = query.status;
      }
    }
    if (query.hasOwnProperty("payment_mode")) {
      if (!Object.values(payment_modes).includes(query.payment_mode)) {
        return res.status(400).send(errorResponse({ message: `Invalid Payment Mode Type select from ${Object.values(payment_modes)}` }));
      }
      whereClause_O.payment_mode = query.payment_mode;
    }
    if (query.hasOwnProperty("reseller_order")) {
      query.reseller_order === "true" ? (whereClause_O.is_reseller_order = true) : query.reseller_order === "false" ? (whereClause_O.is_reseller_order = false) : "";
    }

    const order_variants = await Order_variant.findAll({
      offset: pagination.offset,
      limit: pagination.limit,
      where: whereClause_OV,
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: { UserId: user_id, ...whereClause_O },
        },
        {
          model: Variant,
          as: "variant",
          include: ["thumbnail", "gallery", {
            model: Product,
            as: "product",
            include: ["thumbnail", "gallery", "category", "collections"]
          }]
        }
      ],
    });

    // const orderDetail = await Order.findAll({
    //   where: { UserId: token.id },
    // });

    const meta = await getMeta(pagination, order_variants.length);
    return res.status(200).send({ data: order_variants, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch orders" });
  }
}

export async function searchOrderVariants(req, res) {
  try {
    console.log("entering search");

    const query = req.query;
    const qs = query.qs.trim();
    const pagination = await getPagination(query.pagination);
    const whereClause_OV = {};
    const whereClause_O = {};

    if (query.hasOwnProperty("status")) {
      if (!Object.values(_order_status).includes(query.status)) {
        return res.status(400).send(errorResponse({ message: `Invalid status type select from ${Object.values(_order_status)}` }));
      }
      whereClause_OV.status = query.status;
    }
    if (query.hasOwnProperty("payment_mode")) {
      if (!Object.values(payment_modes).includes(query.payment_mode)) {
        return res
          .status(400)
          .send(errorResponse({ message: `Invalid Payment Mode Type select from ${Object.values(payment_modes)}` }));
      }
      whereClause_O.payment_mode = query.payment_mode;
    }
    if (query.hasOwnProperty("reseller_order")) {
      query.reseller_order === "true"
        ? (whereClause_O.is_reseller_order = true)
        : query.reseller_order === "false"
          ? (whereClause_O.is_reseller_order = false)
          : "";
    }

    const orders = await Order_variant.findAndCountAll({
      where: whereClause_OV,
      include: [
        {
          model: Variant,
          as: "variant",
          where: qs ? { name: { [Op.iLike]: `%${qs}%` } } : {},
        },
        {
          model: Order,
          as: "order",
          where: whereClause_O,
        },
      ],

      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, orders.count);
    return res.status(200).send({ data: orders.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch orders" });
  }
}

export async function storeUserOrderStats(req, res) {
  try {

    const token = verify(req)

    const allStatuses = Object.values(_order_status);
    const initialStatusCounts = Object.fromEntries(allStatuses.map((status) => [status, 0]));
    const counts = await Order_variant.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "statusCount"],
      ],
      group: ["status"],
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: {
            [Op.and]: [
              { UserId: token.id },
              { is_paid: true }
            ]
          },
        },
      ],
    });

    const finalStats = {
      status: { ...initialStatusCounts },
    };

    const orderVariants = await Order_variant.count({
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: { UserId: token.id },
        },
      ],
    })

    counts.forEach((count) => {
      const status = count.dataValues.status;
      finalStats.status[status] = +count.dataValues.statusCount || 0;
    });

    return res.status(200).send({ data: { ...finalStats.status, ALL: orderVariants } });
  } catch (error) {
    console.log(error)
    return res.status(500).send(errorResponse({ status: 500, message: error.message }))
  }
}

export async function stats(req, res) {
  try {

    const allStatuses = Object.values(_order_status);

    const initialStatusCounts = Object.fromEntries(allStatuses.map((status) => [status, 0]));

    const counts = await Order_variant.findAll({
      where: { status: { [Op.ne]: null } },
      attributes: ["status", [sequelize.fn("COUNT", sequelize.col("status")), "statusCount"]],
      group: ["status"],
    });

    const orderVariants = await Order_variant.count();

    const finalStats = {
      status: { ...initialStatusCounts },
    };

    counts.forEach((count) => {
      const status = count.dataValues.status;
      finalStats.status[status] = +count.dataValues.statusCount || 0;
    });

    return res.status(200).send({ data: { ...finalStats.status, ALL: orderVariants } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

export async function acceptOrder(req, res) {
  const t = await sequelize.transaction();
  try {

    const token = verify(req);
    const { id } = req.params;

    const orderVariant = await Order_variant.findByPk(id);


    if (orderVariant.dataValues.status === order_status.ACCEPTED) {
      return res.status(400).send(
        errorResponse({
          message: "Order Has Already Been Accepted",
          details: "Order is not processed yet",
        })
      );
    }

    await orderVariant.update({
      status: order_status.ACCEPTED,
    },
      {
        where: { id: id },
        transaction: t,
      });

    await createActivityLog({
      event: activity_event.ORDER_ACCEPTED,
      sequelize,
      UserId: token.id,
      transaction: t,
    });
    await orderTracker({
      sequelize,
      order_variant_ids: [id],
      status: order_status.ACCEPTED,
      transaction: t,
    });
    await t.commit();
    return res.status(200).send({ message: "Order Variant has been accepted!" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
}

export async function declineOrder(req, res) {
  const t = await sequelize.transaction();
  try {

    const token = verify(req);
    const { id } = req.params;

    const orderVariant = await Order_variant.findByPk(id);

    if (!orderVariant || orderVariant.status === order_status.INTRANSIT) {
      return res.status(400).send(
        errorResponse({
          message: "Order not eligible for decline",
          details: "Order is In-Transit",
        })
      );
    }

    await orderVariant.update(
      {
        status: order_status.DECLINED,
      },
      {
        transaction: t,
      }
    );

    await createActivityLog({
      event: activity_event.ORDER_DECLINED,
      sequelize,
      UserId: token.id,
      transaction: t,
    });
    await orderTracker({
      sequelize,
      order_variant_ids: [id],
      status: order_status.DECLINED,
      transaction: t,
    });
    await t.commit();

    return res.status(200).send({ message: "Order Variant has been declined!" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
}

export async function cancelOrder(req, res) {
  const t = await sequelize.transaction();
  try {

    const token = verify(req);
    const { id } = req.params;

    await Order_variant.update(
      { status: order_status.CANCELLED },
      {
        where: { id: id },
        transaction: t,
      }
    );

    await createActivityLog({
      event: activity_event.ORDER_DECLINED,
      sequelize,
      UserId: token.id,
      transaction: t,
    });
    await orderTracker({
      sequelize,
      order_variant_ids: [id],
      status: order_status.CANCELLED,
      transaction: t,
    });
    await t.commit();
    return res.status(200).send({ message: "Order Variant has been cancelled!" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
}

export async function deliverOrder(req, res) {
  const t = await sequelize.transaction();
  try {

    const token = verify(req);
    const { id } = req.params;

    const orderVariant = await Order_variant.findByPk(id, {
      include: ["order"],
    });
    if (
      !orderVariant
      // || orderVariant.status !== order_status.INTRANSIT
    ) {
      return res.status(400).send(
        errorResponse({
          message: "Order not eligible for delivery",
          details: "Order is not in INTRANSIT status",
        })
      );
    }

    await orderVariant.update(
      { status: order_status.DELIVERED },
      {
        where: { id: id },
        transaction: t,
        returning: true,
        include: ["order"],
      }
    );

    if (orderVariant.order.is_reseller_order && orderVariant.order.payment_mode === "COD") {
      let payout_amount = orderVariant.selling_price - orderVariant.price
      await user.update({
        wallet_balance: sequelize.literal(`wallet_balance + ${payout_amount}`)
      }, { where: { id: orderVariant.order.UserId }, transaction: t })
      await createTransaction({ sequelize, purpose: transaction.purpose.ADDED_TO_WALLET, amount: payout_amount, mode: transaction.mode.WALLET, UserId: orderVariant.order.UserId, transaction: t, txn_type: transaction.txn_type.DEBIT })
      await Wallet.create(
        {
          UserId: orderVariant.order.UserId,
          amount: payout_amount,
          transaction_type: "DEBIT",
          remark: `Payout done for reseller order`,
        },
        { transaction: t }
      );
    }
    await createActivityLog({ event: activity_event.ORDER_DELIVERED, sequelize, UserId: token.id, transaction: t });
    await orderTracker({ sequelize, order_variant_ids: [id], status: order_status.DELIVERED, transaction: t });
    await t.commit();

    return res.status(200).send({ message: "Order Variant has been delivered!", data: orderVariant });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
}

export async function declineReturn(req, res) {
  const t = await sequelize.transaction();
  try {

    const OrderVariant = Order_variant;
    const token = verify(req);
    const { id } = req.params;

    const orderVariant = await OrderVariant.findByPk(id);

    if (!orderVariant || orderVariant.status !== order_status.RETURN_REQUEST) {
      return res.status(400).send(errorResponse({
        message: "Return request not eligible for decline",
        details: "Order is not in RETURN_REQUEST status",
      })
      );
    }

    await OrderVariant.update(
      { status: order_status.RETURN_DECLINED },
      {
        where: { id: id },
        transaction: t,
      }
    );

    await orderTracker({
      sequelize,
      order_variant_ids: [id],
      status: order_status.RETURN_DECLINED,
      transaction: t,
    });
    await t.commit();

    return res.status(200).send({ message: "Return request has been declined" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
}

export async function returnRequest(req, res) {
  const t = await sequelize.transaction();
  try {

    const OrderVariant = Order_variant;
    const token = verify(req);
    const { id } = req.params;

    if (token.error) return res.status(401).send(tokenError(token))

    const orderVariant = await OrderVariant.findByPk(id, { include: [{ model: Variant, as: "variant", include: ["product"] }] });

    if (!orderVariant.variant.product.product_return) {
      return res.status(400).send(errorResponse({ message: "You can not return this product", details: "product return is not available for this product" }))
    }

    if (!orderVariant || orderVariant.status !== order_status.DELIVERED) {
      return res.status(400).send(
        errorResponse({
          message: "Return request not eligible",
          details: "Order is not in DELIVERED status",
        })
      );
    }

    await OrderVariant.update({ status: order_status.RETURN_REQUEST },
      {
        where: { id: id },
        transaction: t,
      });


    const returnOrder = await Return_order.create({
      ...req.body, UserId: token.id,
      OrderVariantId: id
    }, { transaction: t })

    await orderTracker({
      sequelize,
      order_variant_ids: [id],
      status: order_status.RETURN_REQUEST,
      transaction: t,
    });
    await t.commit();
    return res.status(200).send({ message: "Order is requested for return" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
}

export async function listReturnRequests(req, res) {
  try {

    const OrderVariant = Order_variant;
    const token = verify(req);
    if (token.error) return res.status(401).send(tokenError(token))
    const orderVariant = await OrderVariant.findAll({
      where: { status: order_status.RETURN_REQUEST },
      include: [
        { model: Order, as: "order", where: { UserId: token.id } },
        {
          model: Variant, as: "variant",
          include: ['thumbnail', { model: Product, as: "product", include: ["thumbnail"] }]
        }
      ]
    });
    return res.status(200).send({ data: orderVariant });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
}

export async function trackOrder(req, res) {
  try {

    const { id } = req.params;
    const orderStatuses = await Order_status_tracker.findAll({ where: { OrderVariantId: id } })
    return res.status(200).send({ data: orderStatuses })
  } catch (error) {
    console.log(error)
    return res.status(500).send(errorResponse({ message: error.message, status: 500 }))
  }
}

export async function exportToExcel(req, res) {
  try {

    const query = req.query;
    const body = req.body;
    const whereClause = {};
    if (body.items.length && Array.isArray(body.items)) {
      whereClause.id = { [Op.in]: body.items }
    }
    const order = orderBy(query);
    const order_variants = await Order_variant.findAll({
      where: whereClause,
      order: order,
      include: [{ model: Variant, as: "variant", }],
      raw: true
    });
    if (!order_variants.length) {
      return res.status(400).send({ message: `No data found for last ${query.days}` })
    }

    const excelFile = await excelExport(order_variants)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"')
    return res.status(200).send(excelFile);
  } catch (error) {
    return res.status(500).send(errorResponse({ status: 500, message: error.message, details: error }))
  }
}