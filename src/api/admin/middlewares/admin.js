import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";
export async function createBody(req, res, next) {
  try {
    const JoiSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
      permissions: Joi.array().optional(),
    });

    let result = JoiSchema.validate(req.body);

    if (result.error) {
      return res.status(400).send(
        errorResponse({
          message: result.error.message,
          details: result.error.details,
        })
      );
    } else {
      await next(); // Corrected the square brackets to curly braces
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function updateBody(req, res, next) {
  try {
    const JoiSchema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      permissions: Joi.array().items(Joi.number().positive()).optional(),
      delete_permissions: Joi.array().items(Joi.number()).optional()
    });

    let result = JoiSchema.validate(req.body);

    if (result.error) {
      return res.status(400).send(
        errorResponse({
          message: result.error.message,
          details: result.error.details,
        })
      );
    } else {
      await next(); // Corrected the square brackets to curly braces
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export
  //  function to validate user & admin login
  async function validateLoginBody(req, res, next) {
  try {
    const JoiSchema = Joi.object({
      email: Joi.string().required().min(4),
      password: Joi.string().required().min(5),
    });
    let result = JoiSchema.validate(body);
    if (result.error) {
      return res.status(400).send(
        errorResponse({
          status: 400,
          message: result.error.message,
          details: result.error.details,
        })
      );
    }
    return await next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
