
// Middleware for story
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


const Joi = require("joi")

module.exports = {
    async validateRequest(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                "VideoId": Joi.number().required(),
                "ThumbnailId": Joi.number().optional().allow(null),
                "products": Joi.array().items(Joi.number().required()).min(1)
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
}
