export default (req, res) => {
    return res.status(404).send({
        error: {
            status: 404,
            message: "Not Found!",
            details: "Requested api endpoint does not exists",
            handler: "not found handler"
        }
    })
}