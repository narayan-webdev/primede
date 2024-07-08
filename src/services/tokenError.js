export default (token) => {
    return {
        error: {
            status: 401,
            name: "Unauthorized!",
            message: token.error.message,
            details: token.error.name
        }
    }
}