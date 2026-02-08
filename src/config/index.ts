import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set. Please add it to your .env file.');
}

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL!,
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000']
    },
    jwt: {
        secret: JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || 900,
    },
    logLevel: process.env.LOG_LEVEL || 'info'
};