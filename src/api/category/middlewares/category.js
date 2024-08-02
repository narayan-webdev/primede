
import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";


async function validateCreateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      name: Joi.string().required(),
      ThumbnailId: Joi.number().optional(),
      CategoryTypeId: Joi.number().optional()
    });
    return JoiSchema.validate(body);
  }

  let result = validate(req.body);
  if (result.error) {
    return res.status(400).send(
      errorResponse({
        message: result.error.message,
        details: result.error.details,
      })
    );
  } else {
    await next();
  }
}

async function validateUpdateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      name: Joi.string().optional(),
      ThumbnailId: Joi.number().optional(),
      CategoryTypeId: Joi.number().optional()
    });
    return JoiSchema.validate(body);
  }

  let result = validate(req.body);
  if (result.error) {
    return res.status(400).send(
      errorResponse({
        message: result.error.message,
        details: result.error.details,
      })
    );
  } else {
    await next();
  }
}

export {
  validateCreateRequest, validateUpdateRequest
}