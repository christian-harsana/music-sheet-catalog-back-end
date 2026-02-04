import { Request, Response, NextFunction } from "express";

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
            
            case 'unauthorized':
                errorHttpCode = 401;

            case 'not found':
                errorHttpCode = 404;

            case 'conflict': 
                errorHttpCode = 409;
        }

        return res.status(errorHttpCode).json({ 
            success: false,
            message: errorCause
        });
    }


    // Unknown error
    return res.status(500).json({ 
        success: false,
        message: 'Internal Server Error'
    });

    // TODO - Implement environment check for message, only show details on DEV
    // process.env.NODE_ENV === 'development' ? errorMessage: 'An unexpected error occurred. Please try again later.'
};