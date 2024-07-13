import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      subscription_price: Joi.number().optional(),
      cod_enabled: Joi.boolean().optional(),
      cod_prepaid: Joi.number().optional(),
      cod_prepaid_type: Joi.string().valid("PRICE", "PERCENTAGE").optional(),
      shipping_price: Joi.number().optional(),
      razorpay_key: Joi.string().optional(),
      razorpay_secret: Joi.string().optional(),
      withdraw_limit: Joi.number().optional(),
      razorpayX_account_number: Joi.string().optional(),
      shiprocket_username: Joi.string().optional(),
      shiprocket_password: Joi.string().optional(),
      is_shiprocket_enabled: Joi.boolean().optional(),
      shiprocket_token: Joi.string().optional(),
      selected_payment_gateway: Joi.string().valid("RAZORPAY", "CASHFREE", "PHONEPE", "NONE").optional(),
      selected_shipment: Joi.string().valid("CUSTOM_COURIER", "SHIPROCKET", "BLUE_DART").optional(),
      bulk_pricing: Joi.boolean().optional(),
      cashfree_client_secret: Joi.string().optional(),
      cashfree_client_id: Joi.string().optional(),
      phonepe_merchant_id: Joi.string().optional(),
      phonepe_merchant_key: Joi.string().optional(),
      phonepe_key_index: Joi.string().optional(),
      firebase_auth: Joi.object({
        apiKey: Joi.string(),
        authDomain: Joi.string(),
        projectId: Joi.string(),
        storageBucket: Joi.string(),
        messagingSenderId: Joi.string(),
        appId: Joi.string(),
      }).optional(),
      firebase_topic: Joi.string().optional(),
      user_verification_method: Joi.string().valid("FIREBASE", "MSG91").optional(),
      return_request: Joi.boolean().optional(),
      return_request_period: Joi.number().optional(),
      personal_id: Joi.string().optional(),
      prepaid_discount: Joi.number().positive().optional(),
      prepaid_discount_type: Joi.string().valid("PRICE", "PERCENTAGE").optional(),
      facebook_pixel: Joi.string().optional(),
      msg91_template_id:Joi.string().optional(),
      msg91_api_key:Joi.string().optional(),
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
