
import { errorResponse } from "../../../services/errorResponse.js";
import Marquee from "../models/marquee.js";

export async function create(req, res) {
    try {

        const marquee = await Marquee.create(req.body);
        return res.status(200).send(marquee)
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to create a marquee' });
    }
}

export async function find(req, res) {
    try {

        const marquees = await Marquee.findAll({ where: { active: true }, include: ["image"] });
        return res.status(200).send({ data: marquees });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch marquees' });
    }
}

export async function findOne(req, res) {
    try {

        const { id } = req.params
        const marquee = await Marquee.findByPk(id, { include: ["image"] });
        if (!marquee) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        return res.status(200).send(marquee)
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch marquee' });
    }
}


export async function update(req, res) {
    try {

        const { id } = req.params
        const getMarquee = await Marquee.findByPk(id)

        if (!getMarquee) {
            return res.status(404).send(errorResponse({ message: "Marquee Not Found!" }))
        }
        const marquee = await Marquee.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "marquee updated" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch marquee' });
    }
}


const _delete = async (req, res) => {
    try {

        const { id } = req.params;
        const getMarquee = await Marquee.findByPk(id);

        if (!getMarquee) {
            return res.status(404).send(errorResponse({ message: "Marquee Not Found!" }));
        }
        const marquee = await Marquee.destroy({ where: { id } });
        return res.status(200).send({ message: "marquee deleted!" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to fetch marquee' });
    }
};
export { _delete as _delete };

