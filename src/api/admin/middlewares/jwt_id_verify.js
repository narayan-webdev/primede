import { errorResponse, tokenError } from "../../../services/errorResponse.js"
import { verify } from "../../../services/jwt.js"

export default async (req, res, next) => {
    try {
        const token = verify(req)
        const tokenId = token.id
        const paramsId = req.params.id
        if (token.error) return tokenError(token)
        if (tokenId !== paramsId) {
            return res.status(404).send(errorResponse({ message: "Token ID and params ID did not match!" }))
        }
        await next()
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}