import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";


export const addAddress = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    houseNumber: Joi.string().optional(),
    phone: Joi.string().required(),
    countryCode: Joi.string().required(),
    addressLine1: Joi.string().required(),
    pincode: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    addressLine2: Joi.string().allow("", null),
    area: Joi.string().allow(""),
  });

  let result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(
      errorResponse({
        status: 400,
        message: result.error.message,
        details: result.error.details,
      })
    );
  }
  await next();
};
export const updateAddress = async (req, res, next) => {
  const schema = Joi.object({
    houseNumber: Joi.string().optional(),
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    countryCode: Joi.string().optional(),
    addressLine1: Joi.string().optional(),
    pincode: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    addressLine2: Joi.string().allow(""),
    area: Joi.string().allow(""),
  });

  let result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(
      errorResponse({
        status: 400,
        message: result.error.message,
        details: result.error.details,
      })
    );
  }
  await next();
};