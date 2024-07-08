import Joi from "joi";

export async function createBody(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required().positive(),
      strike_price: Joi.number().required().positive(),
      premium_price: Joi.number().required().positive(),
      // is_active: Joi.boolean().required(),
      quantity: Joi.number().required().positive(),
      ProductId: Joi.number().positive().required(),
      ThumbnailId: Joi.number().positive().optional().allow(null, ""),
      gallery: Joi.array().items(Joi.number().positive()).optional(),
      PrimaryAttributeId: Joi.number().optional(),
      SecondaryAttributeId: Joi.number().optional()
    });

    return JoiSchema.validate(body);
  }

  let result = validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details);
  } else {
    await next();
  }
}
export async function updateBody(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      name: Joi.string().optional(),
      price: Joi.number().optional().positive(),
      strike_price: Joi.number().optional().positive(),
      quantity: Joi.number().optional().positive(),
      ThumbnailId: Joi.number().optional().positive(),
      // is_active: Joi.boolean().optional(),
      ProductId: Joi.number().positive().required(),
      gallery: Joi.array().items(Joi.number().positive()).optional(),
      PrimaryAttributeId: Joi.number().optional(),
      SecondaryAttributeId: Joi.number().optional()
    });
    return JoiSchema.validate(body);
  }

  let result = validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details);
  } else {
    await next();
  }
}
