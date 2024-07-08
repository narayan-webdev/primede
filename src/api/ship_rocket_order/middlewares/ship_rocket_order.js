import Joi from "joi";
import { order_status } from "../../../constants/order.js";
import { Op } from "sequelize";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateShipRocketOrder(req, res, next) {
  try {

    const schema = Joi.object({
      orderVariantId: Joi.array().items(Joi.number()).required(),
      pickup_location: Joi.string().required(),
      shipping_charges: Joi.number().optional(),
      giftwrap_charges: Joi.number().optional(),
      transaction_charges: Joi.number().optional(),
      length: Joi.number().required(),
      breadth: Joi.number().required(),
      height: Joi.number().required(),
      weight: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const orderVariants = await Order_variant.findAll({
      where: {
        id: req.body.orderVariantId,
        status: order_status.accepted,
        OrderId: { [Op.not]: null },
      },
      include: [{ model: sequelize.models.Variant, as: "variant" }],
    });

    if (orderVariants.length === 0) {
      return res.status(400).send(errorResponse({ message: "Your Order Are Not Accepted By Seller yet!" }));
    }
    const uniqueOrderIds = new Set(orderVariants.map((orderVariant) => orderVariant.OrderId));

    if (uniqueOrderIds.size !== 1) {
      return res.status(400).send(errorResponse({ message: "Order variants belong to different orders" }));
    }

    const orderVariantIds = orderVariants.map((orderVariant) => orderVariant.id);

    req.orderId = Array.from(uniqueOrderIds)[0];
    req.orderVariants = orderVariants;
    req.orderVariantIds = orderVariantIds;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ message: error.message, status: 500 }));
  }
}

export async function validateShipRocketReturn(req, res, next) {
  try {

    const schema = Joi.object({
      orderVariantId: Joi.number().required(),
      length: Joi.number().required(),
      breadth: Joi.number().required(),
      height: Joi.number().required(),
      weight: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const orderVariant = await Order_variant.findOne({
      where: {
        id: req.body.orderVariantId,
      },
      include: [
        {
          model: sequelize.models.Variant,
          as: "variant",
          include: [
            {
              model: sequelize.models.Product,
              as: "product",
            },
          ],
        },
        {
          model: sequelize.models.Order,
          as: "order",
          include: ['address', 'store_user']
        }
      ],
    });

    console.log(orderVariant)

    if (!orderVariant) {
      return res.status(404).send(errorResponse({ status: 404, message: 'order variant not found' }))
    }
    if (orderVariant.status === order_status.return_request) {
      return res.status(400).send(errorResponse({ message: 'order has already been returned!' }))
    }

    req.orderVariant = orderVariant;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

export function validateShipRocketUpdateOrder(req, res, next) {
  try {
    const schema = Joi.object({
      orderVariantId: Joi.array().items(Joi.number()),
      pickup_location: Joi.string(),
      shipping_charges: Joi.number(),
      giftwrap_charges: Joi.number(),
      transaction_charges: Joi.number(),
      length: Joi.number(),
      breadth: Joi.number(),
      height: Joi.number(),
      weight: Joi.number(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}
