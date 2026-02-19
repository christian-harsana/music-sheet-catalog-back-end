import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index';
import logger from '../utilities/logger';
import { HttpError } from '../errors';

export const errorHandlerMiddleware = (
    error: unknown, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {

    let errorHttpCode = 500;
    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (error instanceof HttpError) {
        errorHttpCode = error.statusCode;
        errorMessage = error.message;
    }
    else if (error instanceof Error) {

        // JWT errors
        if (error.name === 'JsonWebTokenError') {
            errorHttpCode = 401;
            errorMessage = 'Invalid token.';
        }
        else if (error.name === 'TokenExpiredError') {
            errorHttpCode = 401;
            errorMessage = 'Token expired.';
        }
        else if (config.nodeEnv !== 'production') {
            errorMessage = error.message;
        }
    }


    // Log error (server only)
    logger.error('[Error]', {
        name: error instanceof Error ? error.name : 'Unknown Error',
        message: error instanceof Error ? error.message : String(error), // For logging, we want to show the original message
        stack: error instanceof Error ?  error.stack : undefined,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        status: errorHttpCode || 500
    });

    return res.status(errorHttpCode).json({ 
        success: false,
        message: errorMessage
    });
};