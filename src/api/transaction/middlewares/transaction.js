import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      purpose: Joi.string()
        .valid("PURCHASE", "REFUND", "ADDED_TO_WALLET")
        .required(),
      UserId: Joi.number().integer().required(),
      txn_type: Joi.string().valid("DEBIT", "CREDIT").required(),
      txn_id: Joi.string().required(),
      remark: Joi.string().required(),
      mode: Joi.string().valid("WALLET", "MONEY").required(),
      amount: Joi.number().required(),
    });

    return JoiSchema.validate(body);
  }

  let result = validate(req.body);
  if (result.error) {
    return res.status(400).send(
      errorResponse({
        status: 400,
        message: result.error.message,
        details: result.error.details,
      })
    );
  } else {
    await next();
  }
}
