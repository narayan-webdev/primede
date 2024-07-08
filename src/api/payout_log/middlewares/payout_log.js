import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      payout_id: Joi.string(),
      fund_account_id: Joi.string(),
      account_type: Joi.string(),
      amount: Joi.string(),
      currency: Joi.string(),
      mode: Joi.string(),
      purpose: Joi.string(),
      vpa: Joi.string(),
      name: Joi.string(),
      contact: Joi.string(),
      contact_id: Joi.string(),
      status: Joi.string(),
      reference_id: Joi.string(),
      fund_account_contact_id: Joi.string(),
      fund_bank_account_ifsc: Joi.string(),
      fund_bank_account_number: Joi.string(),
      fund_bank_name: Joi.string(),
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
