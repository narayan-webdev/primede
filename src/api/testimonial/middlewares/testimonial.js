import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateRequest(req, res, next) {

    function validate(body) {
        const JoiSchema = Joi.object({
            "content": Joi.string().required(),
            "rating": Joi.number().min(1).max(5).required(),
            "VideoId": Joi.number().positive().optional().allow(null),
        });
        return JoiSchema.validate(body);
    }
    let result = validate(req.body);
    if (result.error) {
        return res.status(400).send(errorResponse({
            message: result.error.message,
            details: result.error.details
        }));
    }
    next();
}
