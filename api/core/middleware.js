const handler = (callback) => {
    return (req, res) => {
        try {
            return Promise.resolve(callback(req, res))
        } catch (error) {
            return errorHandler(error, req, res)
        }
    }
}

const errorHandler = (error, req, res) => {
    if (error instanceof ResponseHttpError)
        return res.status(error.statusCode).json({ error: error.message })
    return res.status(500).json({ error: 'Internal server error', type: error.name, message: error.message })
}

module.exports = {
    handler
}