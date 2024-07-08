
// Middleware for product_policy
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


import Joi from "joi";
import { errorResponse } from "../../../services/errorResponse.js";

export const  validateRequest = async(req, res, next)=> {

    function validate(body) {
        const JoiSchema = Joi.object({
            "title": Joi.string().optional(),
            "description": Joi.string().optional(),
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

