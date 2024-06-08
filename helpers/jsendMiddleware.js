const jsendMiddleware = (req, res, next) => {
    res.success = (data, statusCode = 200) => {
        res.status(statusCode).json({ status: 'success', data });
    };

    res.fail = (data, statusCode = 400) => {
        res.status(statusCode).json({ status: 'fail', data });
    };

    res.error = (message, statusCode = 500) => {
        res.status(statusCode).json({ status: 'error', message });
    };

    next();
};

export default jsendMiddleware;