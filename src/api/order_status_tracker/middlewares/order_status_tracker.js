import Joi from "joi";

import { errorResponse } from "../../../services/errorResponse.js";

export async function validateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      status: Joi.string()
        .valid(
          "NEW",
          "ACCEPTED",
          "DECLINED",
          "PROCESSING",
          "INTRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
          "COMPLETED",
          "PAYOUT_DONE",
          "RTO",
          "RETURN_REQUEST",
          "RETURN_ACCEPTED",
          "RETURN_DECLINED",
          "RETURN_RECEIVED",
          "RETURN_PENDING"
        )
        .required(),
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
