import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index";


// Extend Express Request type to include user
interface JwtUserPayload {
    userId: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtUserPayload;
        }
    }
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    try {

        // Verify token
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                error: 'Access denied. No token provided.'
            });
        }
        
        const decoded = jwt.verify(token, config.jwt.secret) as JwtUserPayload;

        // Attach req.user
        req.user = decoded;

        // Continue to the next middleware / route handler
        next();
    }
    catch(error) {

        if (error instanceof Error) {

            // Handle specific JWT errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    error: 'Invalid token.' 
                });
            }
                
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token expired.' 
                });
            }
        }

        // Generic error
        res.status(400).json({ 
            error: 'Token verification failed.' 
        });
    }
}