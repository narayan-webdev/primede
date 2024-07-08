import Joi from "joi";

export async function validateRequest(req, res, next) {

    function validate(body) {
        const JoiSchema = Joi.object({
            "order_id": Joi.string(),
            "payment_id": Joi.string(),
            "amount": Joi.decimal(),
            "currency": Joi.string(),
            "status": Joi.enum(),
            "method": Joi.string(),
            "captured": Joi.boolean(),
            "card_id": Joi.string(),
            "bank": Joi.string(),
            "wallet": Joi.string(),
            "vpa": Joi.string(),
            "email": Joi.string(),
            "contact": Joi.string(),
            "notes": Joi.string(),
            "upi": Joi.string(),
        });

        return JoiSchema.validate(body);
    }

    let result = validate(req.body);
    if (result.error) {
        return res.status(400).send({
            error: {
                status: 400,
                message: result.error.message,
                details: result.error.details
            }
        });
    } else {
        await next(); // Corrected the square brackets to curly braces
    }
}
