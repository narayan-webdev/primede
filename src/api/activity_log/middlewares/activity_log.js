import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateActivityLog(req, res, next) {
  const schema = Joi.object({
    description: Joi.string().allow(null),
    event: Joi.string()
      .valid(
        "ADMIN_LOG_IN",
        "ORDER_PLACED",
        "ORDER_ACCEPTED",
        "ORDER_DECLINED",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",
        "SUBSCRIPTION_ADDED",
        "NEW_CAMPAIGN_ADDED",
        "NEW_PRODUCT_ADDED",
        "NEW_COLLECTION_ADDED",
        "NEW_TUTORIAL_ADDED",
        "NEW_LEAD_ADDED",
        "NEW_GROUP_ADDED",
        "LEAD_COMPLETED",
        "LEAD_CALLED",
        "LEAD_CALLING",
        "LEAD_CONVERTED",
        "WALLET_DEBIT",
        "WALLET_CREDIT"
      )
      .required(),
    UserStoreId: Joi.number().allow(null),
  });

  let result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(
      errorResponse({
        status: 400,
        message: result.error.details,
        details: result.error.details,
      }));
  }
  next();
}
