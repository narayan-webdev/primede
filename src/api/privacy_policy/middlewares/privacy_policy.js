
import Joi from "joi";

export async function validateRequest(req, res, next) {

    function validate(body) {
        const JoiSchema = Joi.object({
            "name": Joi.string().optional(),
            "year": Joi.string().required(),
            "descrpition": Joi.string().required(),
        });
        return JoiSchema.validate(body);
    }
    let result = validate(req.body);
    if (result.error) return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
    else await next();
}
