import Joi from "joi"
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateRequest(req, res, next) {
  function validate(body) {
    const JoiSchema = Joi.object({
      store_type: Joi.string().valid(
        "WHATSAPP",
        "B2B",
        "ECOMMERCE",
        "RESELLER_ECOM"
      ).optional(),
      primary_color: Joi.string().optional(),
      secondary_color: Joi.string().optional(),
      bg_color: Joi.string().optional(),
      nav_bg_color: Joi.string().optional(),
      nav_text_color: Joi.string().optional(),
      text_color: Joi.string().optional(),
      button_color: Joi.string().optional(),
      is_app_enabled: Joi.boolean().optional(),
      is_maintenance_mode: Joi.boolean().optional(),
      is_store_active: Joi.boolean().optional(),
      store_inactive_message: Joi.string().allow("").optional(),
      store_maintenance_message: Joi.string().allow("").optional(),
      is_pricing_visible: Joi.boolean().optional(),
      is_cart_enabled: Joi.boolean().optional(),
      is_wallet_enabled: Joi.boolean().optional(),
      product_card_style: Joi.string().valid("PORTRAIT", "SQUARE").optional(),
      category_card_style: Joi.string().valid("LANDSCAPE", "SQUARE").optional(),
      product_list_span_mobile: Joi.number().integer().optional(),
      product_list_span_desktop: Joi.number().integer().optional(),
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
