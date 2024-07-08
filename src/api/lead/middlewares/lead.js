import Joi from "joi";
import { verify } from "../../../services/jwt.js";
import { errorResponse, tokenError } from "../../../services/errorResponse.js";
import User from "../../user/models/user.js";

export async function createLeadValidate(req, res, next) {

  const body = req.body;
  let role;
  let storeUser;
  if (req.headers.hasOwnProperty("authorization")) {
    const token = verify(req);
    if (token.error) return res.status(403).send(tokenError(token));
    storeUser = await User.findByPk(token.id, {
      include: "role",
    });
    if (!storeUser) return res.status(400).send(errorResponse({ status: 400, message: "Store user not found" }));
    role = storeUser.role.name === "Admin" ? "Admin" : "Authenticated";

    if (role !== "Admin" && body.hasOwnProperty("AssignedTo")) {
      return res.status(400).send(errorResponse({ status: 400, message: "AssignedTo Is Now allwed!" }));
    }
    if (role !== "Consumer" && body.hasOwnProperty("UserId")) {
      return res.status(400).send(errorResponse({ status: 400, message: "UserId Is Now allwed!" }));
    }
    if (role === "Consumer") {
      req.body.UserId = storeUser.id;
    }
  }

  const JoiSchema = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    AssignedTo: Joi.number().positive().optional(),
    UserId: Joi.number().positive().optional(),
    ProductId: Joi.number().positive().optional(),
    consumer_note: Joi.string().optional(), // Adjust validation as needed
    quantity: Joi.number().positive().optional(), // Adjust validation as needed
    staff_note: Joi.string().optional(), // Adjust validation as needed
    // status: Joi.string()
    //   .valid("OPEN", "UNDER_CONNECTION", "FOLLOWUP", "PROSPECTS", "ON_HOLD", "CANCELLED", "COMPLETED", "COMFIRMED")
    //   .required(),
    source: Joi.string().valid("WHATSAPP", "INSTAGRAM", "SOCIAL_SELLER_WEBSITE", "YOUTUBE_CHANNEL", "APP", "WEBSITE").required(),
  });
  let result = JoiSchema.validate(body);
  if (result.error) return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
  await next();
}
export async function updateLeadValidate(req, res, next) {
  const body = req.body;

  let role;
  if (req.headers.hasOwnProperty("authorization")) {
    const token = verify(req);
    if (token.error) return res.status(403).send(tokenError(token));

    const storeUser = await User.findByPk(token.id, {
      include: "role",
    });
    role = storeUser.role.name === "Admin" ? "Admin" : "Authenticated";
  } else {
    return res.status(403).send(errorResponse({ status: 403, message: "Your are not allowed to access the endpoint" }));
  }

  const JoiSchema = Joi.object({
    AssignedTo: Joi.number().optional().positive(),
    status: Joi.string().valid(
      "NEW",
      "ASSIGNED",
      "CALLING",
      "CALLED",
      "CONVERTED",
      "COMPLETED"
    ).optional(),
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    country_code: Joi.string().optional(),
    consumer_note: Joi.string().optional(),
    staff_note: Joi.string().optional(),
    quantity: Joi.string().optional(),
  });
  let result = JoiSchema.validate(body);
  if (result.error) return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
  await next();
}
