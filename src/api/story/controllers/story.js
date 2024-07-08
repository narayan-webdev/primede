
import { getPagination, getMeta } from "../../../services/pagination.js";

import { errorResponse } from "../../../services/errorResponse.js";
import Story from "../models/story.js";

export async function create(req, res) {
    try {

        const body = req.body;
        const story = await Story.create(req.body);
        if (req.body.products.length) {
            let array = body.products.map((item) => {
                return { StoryId: story.dataValues.id, ProductId: item }
            })
            await StoryProduct.bulkCreate(array)
        }
        return res.status(200).send({ data: story })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to create a story' });
    }
}

export async function find(req, res) {
    try {

        const story = await Story.findAll({
            include: ["video", "thumbnail", { model: sequelize.models.Product, as: "products", include: ['thumbnail', "variants"] }]
        });
        return res.status(200).send({ data: story });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch storys' });
    }
}

export async function findOne(req, res) {
    try {

        const { id } = req.params
        const story = await Story.findByPk(id, {
            include: ["video", "thumbnail", { model: sequelize.models.Product, as: "products", include: ['thumbnail', "variants"] }]
        });
        if (!story) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        return res.status(200).send({ data: story })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch story' });
    }
}

export async function update(req, res) {
    try {

        const { id } = req.params
        const getstory = await Story.findByPk(id)
        if (!getstory) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        const story = await Story.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "story updated", data: story[1][0] })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch story' });
    }
}

export const _delete = async (req, res) => {
    try {

        const { id } = req.params;
        const getstory = await Story.findByPk(id);
        if (!getstory) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }));
        }
        const story = await Story.destroy({ where: { id } });
        return res.status(200).send({ message: "story deleted!" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Failed to fetch story' });
    }
};