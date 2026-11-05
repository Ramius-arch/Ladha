const winston = require('winston');

// Configure logger settings
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.splat(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ],
    levels: {
        info: 2,
        error: 3,
        warning: 4,
        debug: 5
    }
});

// Add a simple formatter to the logger (optional)
logger.add(new winston.transports.File({
    filename: 'logs/app.log',
    level: 'info'
}));

module.exports = logger;