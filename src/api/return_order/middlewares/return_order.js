
// Middleware for returns
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


import Joi from "joi";

export async function validateRequest(req, res, next) {

    function validate(body) {
        const JoiSchema = Joi.object({
            "name": Joi.string(),
            "description": Joi.text(),
        });
        return JoiSchema.validate(body);
    }

    let result = validate(req.body);
    if (result.error) {
        return res.status(400).send(errorResponse({
            message: result.error.message,
            details: result.error.details
        }));
    } else {
        await next(); // Corrected the square brackets to curly braces
    }
}
