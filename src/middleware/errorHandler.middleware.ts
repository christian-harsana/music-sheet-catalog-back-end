import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index';

export const errorHandlerMiddleware = (
    error: unknown, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {

    if (error instanceof Error) {

        // Log error
        console.error('[Error]', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method
        });

        // JWT specific errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired.' 
            });
        }


        // Other errors
        let errorHttpCode = 500;
        const errorCause = error.cause ?? error.message;

        switch(error.message.trim().toLowerCase()) {
            case 'bad request':
                errorHttpCode = 400;
                break;
            
            case 'unauthorized':
                errorHttpCode = 401;
                break;

            case 'not found':
                errorHttpCode = 404;
                break;

            case 'conflict': 
                errorHttpCode = 409;
                break;
        }

        return res.status(errorHttpCode).json({ 
            success: false,
            message: config.nodeEnv === 'production' ? 'An unexpected error occurred. Please try again later.' : errorCause
        });
    }


    // Unknown error
    return res.status(500).json({ 
        success: false,
        message: config.nodeEnv === 'production' ? 'An unexpected error occurred. Please try again later.' : 'Internal server error'
    });
};