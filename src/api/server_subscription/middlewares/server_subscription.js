

import Joi from "joi";
import { Op } from "sequelize";
import { verify } from "../../../services/jwt.js";
import { getDate } from "../../../services/date.js";
import { errorResponse } from "../../../services/errorResponse.js";
export async function validateRequest(req, res, next) {
    const JoiSchema = Joi.object({
        "plan_id": Joi.number().required().positive()
    });
    let result = JoiSchema.validate(req.body);
    if (result.error) {
        return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
    } else {
        await next();
    }
}
export async function checkPlan(req, res, next) {
    try {
        const sequelize = req.db;
        const plan_id = req.body.plan_id;
        const plan = await Plan.findByPk(plan_id);
        if (plan.is_active) {
            req.plan_day = plan.validity;
            await next();
        } else {
            return res.status(400).send(errorResponse({ message: "Invalid Plan ID", details: "Plan seems to be in_active" }));
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send(errorResponse({ status: 500, message: "Internal Server Error" }));
    }
}
export async function checkExistingSubscription(req, res, next) {
    try {

        const token = verify(req);
        const user = await User.findByPk(token.id, {
            distinct: true,
            include: [
                {
                    model: sequelize.models.Subscription,
                    as: "subscriptions",
                    where: {
                        [Op.and]: [
                            {
                                valid_to: {
                                    [Op.gt]: getDate()
                                },
                                is_paid: true
                            }
                        ]
                    },
                    include: "plan"
                },
                // Unconditional association for subscriptions
                {
                    model: sequelize.models.Subscription,
                    as: "subscriptions",
                    required: false // This makes it not required
                }
            ]
        });

        if (user.subscriptions.length > 0) {
            return res.status(400).send(requestError({ message: "You have already existing subscription please wait until it expires" }));
        }
        await next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

// async validateUserSubscription(req, res, next) {
//     try {
//         
//         const token = jwt.verify(req)
//         const { id } = req.params;
//         const subscription = await Subscription.findByPk(id, { include: ["user", "plan"] })
//         if (!subscription) return res.status(requestError({ message: "Invalid Subscription ID" }))
//         if (subscription.user.id === token.id && subscription.purchaseType === "ONLINE") {
//             req.body.subscription = subscription;
//             await next()
//         } else {
//             return res.status(400).send(requestError({ message: "Invalid Request", details: "Token and Subsciption do not belongs to same user" }))
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send(error)
//     }
// },
export async function verifySchema(req, res, next) {
    try {
        const body = req.body;
        const JoiSchema = Joi.object({
            razorpay_signature: Joi.string().required(),
            razorpay_payment_id: Joi.string().required(),
            razorpay_order_id: Joi.string().required(),
        })
        const result = JoiSchema.validate(body);
        if (result.error) {
            return res.status(400).send(errorResponse({ message: result.error.message, details: result.error.details }));
        }
        next();
    } catch (error) {
        return res.status(500).send(errorResponse({ message: error.message, status: 500 }));
    }
}
