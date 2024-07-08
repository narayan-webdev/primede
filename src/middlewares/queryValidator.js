import { errorResponse } from "../services/errorResponse.js";

export function search(req, res, next) {
    try {
        const query = req.query;
        const qs = query.qs;
        if (!query.hasOwnProperty("qs") || qs.length < 3) return res.status(400).send(errorResponse({ message: "Invalid Search query passed", details: "please check qs if it is blank or not passeds" }));
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorResponse({ status: 500, message: "Internal server error" }));
    }
}