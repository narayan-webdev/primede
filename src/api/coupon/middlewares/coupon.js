import Joi from "joi";


export async function validateRequest(req, res, next) {

    function validate(body) {
        const JoiSchema = Joi.object({
            "name": Joi.string(),
            "message": Joi.string(),
            "discount_value": Joi.decimal(),
            "valid_from": Joi.date(),
            "valid_to": Joi.date(),
            "active": Joi.boolean(),
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
