
global._handleResponse = function (req, res, err, response, message ) {
    if (err) {
        return res.status(err.statusCode || 400).json({
            status: 'error',
            code: err.code || "BadRequest",
            message: err.message || err,
        })
    }
    return res.status(200).json({
            status: 200,
            message: message || 'Success',
            result: response
    })
};