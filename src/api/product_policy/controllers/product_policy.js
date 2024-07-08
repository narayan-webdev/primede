import { errorResponse } from "../../../services/errorResponse.js";
import Product_policy from "../models/product_policy.js";

export async function create(req, res) {
    try {


        const product_policy = await Product_policy.create(req.body);
        return res.status(200).send({ data: product_policy })
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }))
    }
}

// Controller function to get all posts
export async function find(req, res) {
    try {


        const product_policys = await Product_policy.findAll();

        return res.status(200).send({ data: product_policys });
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }))
    }
}

export async function findOne(req, res) {
    try {

        const { id } = req.params
        const product_policy = await Product_policy.findByPk(id);
        if (!product_policy) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        return res.status(200).send({ data: product_policy })
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }))
    }
}


export async function update(req, res) {
    try {

        const { id } = req.params
        const product_policy = await Product_policy.findByPk(id)

        if (!product_policy) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        const [rows, [data]] = await Product_policy.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "product_policy updated", data: data })
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: error.message }))
    }
}


export async function destroy(req, res) {
    try {

        const { id } = req.params
        const getproduct_policy = await Product_policy.findByPk(id)

        if (!getproduct_policy) {
            return res.status(400).send(errorResponse({ message: "Invalid ID" }))
        }
        const product_policy = await Product_policy.destroy({ where: { id } });
        return res.status(200).send({ message: "product_policy deleted!" })
    } catch (error) {
        console.log(error);
        res.status(500).send(errorResponse({ status: 500, message: error.message }))
    }
}

