import winston from 'winston';
import { config } from '../config/index';

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack: true}),
        winston.format.json()
    ),
    transports: [new winston.transports.Console()], // TODO: Update to log into files in production
});

export default logger;