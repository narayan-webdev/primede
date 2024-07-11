
import { errorResponse, tokenError } from "../../../services/errorResponse.js";
import { verify } from "../../../services/jwt.js";
import Testimonial from "../models/testimonial.js";
import User from './../../user/models/user.js';

export async function create(req, res) {
    try {
        const token = verify(req);
        if (token.error) {
            return res.status(400).send(tokenError(token))
        }

        const testimonial = await Testimonial.create({ ...req.body, UserId: token.id });
        return res.status(200).send({ data: testimonial })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to create a testimonial' });
    }
}

// Controller function to get all posts
export async function find(req, res) {
    try {

        const testimonials = await Testimonial.findAll({
            include: [{
                model: User, as: "user",
                attributes: ["id", "name", "email",],
                include: ["avatar"],
            }, "video"]
        });
        return res.status(200).send({ data: testimonials });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch testimonials' });
    }
}

export async function findOne(req, res) {
    try {

        const { id } = req.params
        const testimonial = await Testimonial.findByPk(id, {
            include: ["user", "video"]
        });
        if (!testimonial) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        return res.status(200).send({ data: testimonial })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch testimonial' });
    }
}


export async function update(req, res) {
    try {

        const { id } = req.params
        const gettestimonial = await Testimonial.findByPk(id)

        if (!gettestimonial) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        const testimonial = await Testimonial.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "testimonial updated" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch testimonial' });
    }
}


export const _delete = async (req, res) => {
    try {

        const { id } = req.params;
        const gettestimonial = await Testimonial.findByPk(id);

        if (!gettestimonial) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }));
        }
        const testimonial = await Testimonial.destroy({ where: { id } });
        return res.status(200).send({ message: "testimonial deleted!" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch testimonial' });
    }
};

