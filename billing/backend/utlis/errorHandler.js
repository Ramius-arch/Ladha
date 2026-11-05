const logger = require('./logger');

function errorHandler(err, req, res) {
    const statusCode = err.statusCode || 500;
    
    // Create error response object
    const errorResponse = {
        error: {
            status: statusCode,
            message: err.message,
            stackTrace: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        }
    };

    logger.error(`Error occurred at ${req.url}:`, err);

    if (statusCode === 500) {
        res.status(500).json({
            error: {
                status: 500,
                message: 'Internal server error'
            }
        });
    } else {
        // For other errors, send specific messages
        if (err.name === 'ValidationError') {
            errorResponse.error.message = 'Validation failed. Please check the input fields';
        } else if (err.name === 'UnauthorizedError') {
            errorResponse.error.message = 'Unauthorized access';
        }
        
        res.status(statusCode).json(errorResponse);
    }
}

module.exports = errorHandler;
