import Joi from "joi";

const createOrderItemSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  units: Joi.number().integer().required(),
  selling_price: Joi.number().required(),
  discount: Joi.number().required(),
  tax: Joi.number().required(),
  hsn: Joi.string().required(),
  ShipRocketOrderId: Joi.number().allow(null),
  OrderVariantId: Joi.number().allow(null),
});

const updateOrderItemSchema = Joi.object({
  name: Joi.string(),
  sku: Joi.string(),
  units: Joi.number().integer(),
  selling_price: Joi.number(),
  discount: Joi.number(),
  tax: Joi.number(),
  hsn: Joi.string(),
  ShipRocketOrderId: Joi.number().allow(null),
  OrderVariantId: Joi.number().allow(null),
});

export function validateCreateOrderItem(req, res, next) {
  const { error } = createOrderItemSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

export function validateUpdateOrderItem(req, res, next) {
  const { error } = updateOrderItemSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}
