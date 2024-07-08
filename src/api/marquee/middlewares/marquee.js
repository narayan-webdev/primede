import Joi from "joi";
export async function validateRequest(req, res, next) {

    const JoiSchema = Joi.object({
        "name": Joi.string().optional(),
        "active": Joi.boolean().required(),
        "ImageId": Joi.number().required()
    });

    let result = JoiSchema.validate(req.body);
    if (result.error) {
        return res.status(400).send(errorResponse({
            message: result.error.message,
            details: result.error.details
        }));
    }
    next();
}
