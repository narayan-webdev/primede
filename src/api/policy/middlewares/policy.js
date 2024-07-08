import Joi from "joi"
import { errorResponse } from "../../../services/errorResponse.js";

export function createStorePolicy(req, res, next) {
  const schema = Joi.object({
    about_us: Joi.string().required(),
    terms_and_conditions: Joi.string().required(),
    privacy_policy: Joi.string().required(),
    refund_and_cancellation: Joi.string().required(),
    ship_and_delivery: Joi.string().required(),
    contact_us: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
  }

  next();
}
export function updateStorePolicy(req, res, next) {
  const schema = Joi.object({
    about_us: Joi.string().optional(),
    terms_and_conditions: Joi.string().optional(),
    privacy_policy: Joi.string().optional(),
    refund_and_cancellation: Joi.string().optional(),
    ship_and_delivery: Joi.string().optional(),
    contact_us: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
}
