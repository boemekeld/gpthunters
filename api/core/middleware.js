const resolver = (callback) => {
    return (req, res, next) => {
        return Promise
            .resolve(callback(req, res, next))
            .catch(e => next(e))
    }
}

const errorHandler = (error, request, response, next) => {
    if (error instanceof ResponseHttpError)
        return response.status(error.statusCode).json({ error: error.message })
    return response.status(500).json({ error: 'Internal server error', type: error.name, message: error.message })
}

module.exports = {
    resolver,
    errorHandler
}