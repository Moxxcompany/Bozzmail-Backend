const winston = require('winston');
const { combine, timestamp, json, prettyPrint } = winston.format

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

module.exports = { logger }