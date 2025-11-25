import cors from 'cors';
import { config } from '../config/index';

export const corsMiddleware = cors({
    origin: function(origin, callback) {

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (config.cors.allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else
        {
            callback(new Error('Not allowed by CORS!!!'));
        }
    }
});