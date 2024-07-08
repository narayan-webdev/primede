import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";


export async function validateRequest(req, res, next) {

    function validate(body) {
        const JoiSchema = Joi.object({
            "title": Joi.string().required(),
            "description": Joi.string().required(),
        });

        return JoiSchema.validate(body);
    }

    let result = validate(req.body);
    if (result.error) {
        return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
    } else {
        await next(); // Corrected the square brackets to curly braces
    }
}
export async function validateUpdateRequest(req, res, next) {
    function validate(body) {
        const JoiSchema = Joi.object({
            "title": Joi.string().optional(),
            "description": Joi.string().optional(),
            "status": Joi.string().valid("OPEN", "CLOSED", "IN_PROGRESS", "ON_HOLD"),
        });
        return JoiSchema.validate(body);
    }
    let result = validate(req.body);
    if (result.error) {
        return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
    } else {
        await next(); // Corrected the square brackets to curly braces
    }
}
