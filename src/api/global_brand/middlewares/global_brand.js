import Joi from "joi";

import { errorResponse } from "../../../services/errorResponse.js";


export async function validateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      name: Joi.string().optional(),
      LogoIdDark: Joi.number().optional().allow("", null),
      LogoIdLight: Joi.number().optional().allow("", null),
      FavIconId: Joi.number().optional().allow("", null),
      tagline: Joi.string().optional().allow("", null),
      whatsapp_number: Joi.string().optional().allow("", null),
      calling_number: Joi.string().optional().allow("", null),
      email: Joi.string().email().optional().allow("", null),
      about_us: Joi.string().optional().allow("", null),
      address: Joi.string().optional().allow("", null),
      instagram: Joi.string().optional().allow("", null),
      facebook: Joi.string().optional().allow("", null),
      telegram: Joi.string().optional().allow("", null),
      youtube: Joi.string().optional().allow("", null),
    });

    return JoiSchema.validate(body);
  }

  let result = validate(req.body);
  if (result.error) {
    return res.status(400).send(
      errorResponse({
        status: 400,
        message: result.error.message[0],
        details: result.error.details,
      })
    );
  } else {
    await next();
  }
}
