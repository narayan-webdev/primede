


import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateCreateBody(req, res, next) {
    const JoiSchema = Joi.object({
        "name": Joi.string().optional(),
        "description": Joi.string().optional(),
        "permissions": Joi.array().items(Joi.number().positive()).min(0).required()
    });
    let result = JoiSchema.validate(req.body);

    if (result.error) {
        return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
    } else {
        await next(); // Corrected the square brackets to curly braces
    }
}
export async function validateUpdateBody(req, res, next) {
    const JoiSchema = Joi.object({
        "name": Joi.string().optional(),
        "description": Joi.string().optional(),
        "permissions": Joi.array().items(Joi.number().positive()).min(0).required(),
        "delete_permissions": Joi.array().items(Joi.number().positive()).min(0).required(),
    });
    let result = JoiSchema.validate(req.body);

    if (result.error) {
        return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
    } else {
        await next(); // Corrected the square brackets to curly braces
    }
}

