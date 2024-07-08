import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";


export async function validateAddToCart(req, res, next) {
  const addToCartSchema = Joi.object({
    VariantId: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
  });

  let result = addToCartSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
  }
  await next();
}
export async function validateEmptyCartRequest(req, res, next) {
  const emptyCartSchema = Joi.object({
    cartId: Joi.number().required(),
  });

  let result = emptyCartSchema.validate(req.params);

  if (result.error) {
    return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
  }

  await next();
}