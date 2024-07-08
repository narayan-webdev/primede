import { config } from "dotenv";
import JWT from "jsonwebtoken";
config()
const JWT_SECRET = process.env.JWT_SECRET
export function issue(payload) {
    try {
        const token = JWT.sign(payload, JWT_SECRET, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.log(error);
        return { error };
    }
}
export function verify(req) {
    try {
        if (req.headers.hasOwnProperty("authorization")) {
            console.log(JWT_SECRET)
            const token = req.headers.authorization.split(" ")[1];
            const data = JWT.verify(token, JWT_SECRET);
            return data;
        } else {
            return { error: "No Bearer token pass in request" };
        }
    } catch (error) {
        console.log(error);
        return { error };
    }
}
