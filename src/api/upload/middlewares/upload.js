import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export async function validateRequest(req, res, next) {

    function validate(body) {
        const JoiSchema = Joi.object({
            name: Joi.string().required(),
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
export async function fileFormat(req, res, next) {
    try {
        if (fileType !== "image/jpeg") {
            res.status(400).send(errorResponse({
                message: "Invalid file input",
                details: "Invalid file sent on request body!"
            }));
        }
        await next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid file input",
                details: "Invalid file sent on request body!"
            }
        });
    }
}
