import cors from 'cors';
import { config } from '../config/index';

export const corsMiddleware = cors({
    origin: function(origin, callback) {

        console.log('Allowed origins:', process.env.ALLOWED_ORIGINS);
        console.log('Allowed originss:', config.cors.allowedOrigins);
        console.log(process.env.NODE_ENV)
        console.log('environment', config.nodeEnv)
        console.log(origin);

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (config.cors.allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else
        {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies/auth headers
    maxAge: 600, // Cache preflight requests for 10 minutes. 86400 - 24 hours (common for production)
    optionsSuccessStatus: 200
});