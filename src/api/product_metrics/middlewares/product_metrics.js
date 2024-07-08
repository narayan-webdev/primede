import Joi from "joi";

// Define Joi schema for product metrics validation
const productMetricsSchema = Joi.object({
  view_count: Joi.number().integer().min(0).required(),
  ordered_count: Joi.number().integer().min(0).required(),
  shares_count: Joi.number().integer().min(0).required(),
  revenue_generated: Joi.number().min(0).required(),
  ProductId: Joi.number(),
});

export function validateProductMetrics(req, res, next) {
  const { error } = productMetricsSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
}
