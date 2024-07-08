

import Joi from "joi";

export async function validateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      title: Joi.string(),
      desctiption: Joi.text(),
      type: Joi.enum("")(),
      isRead: Joi.boolean(),
      data: Joi.string(),
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
    await next(); // Corrected the square brackets to curly braces
  }
}
