import morgan from 'morgan';
import {config} from '../config/index';
import logger from '../utilities/logger';

export const morganMiddleware = 
    config.nodeEnv === 'development' ? 
        morgan('dev') 
        : 
        morgan('combined', {
            stream: {
                write: (message: string) => {
                    logger.info(message.trim());
                }
            }
        });