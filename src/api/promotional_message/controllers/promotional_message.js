
import { errorResponse } from "../../../services/errorResponse.js";
import Promotional_message from "../models/promotional_message.js";

export async function create(req, res) {
    try {


        const promotional_message = await Promotional_message.create(req.body);
        return res.status(200).send({ data: promotional_message })
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }));
    }
}

export async function find(req, res) {
    try {

        const promotional_messages = await Promotional_message.findAll();
        return res.status(200).send({ data: promotional_messages });
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }));
    }
}

export async function findOne(req, res) {
    try {

        const { id } = req.params
        const promotional_message = await Promotional_message.findByPk(id);
        if (!promotional_message) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        return res.status(200).send({ data: promotional_message })
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }));
    }
}


export async function update(req, res) {
    try {

        const { id } = req.params
        const getpromotional_message = await Promotional_message.findByPk(id)

        if (!getpromotional_message) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        const promotional_message = await Promotional_message.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "promotional_message updated" })
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }));
    }
}

const _delete = async (req, res) => {
    try {

        const { id } = req.params;
        const getpromotional_message = await Promotional_message.findByPk(id);

        if (!getpromotional_message) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }));
        }
        const promotional_message = await Promotional_message.destroy({ where: { id } });
        return res.status(200).send({ message: "promotional_message deleted!" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to fetch promotional_message' });
    }
};
export { _delete as _delete };

