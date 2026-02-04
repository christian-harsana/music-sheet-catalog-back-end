import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index";


// Extend Express Request type to include user
interface JwtUserPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
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
            throw new Error('Unauthorized', { cause: 'Access denied. No token provided' });
        }
        
        const decoded = jwt.verify(token, config.jwt.secret) as JwtUserPayload;

        // Attach req.user
        req.user = decoded;

        // Continue to the next middleware / route handler
        next();
    }
    catch(error) {
        next(error);
    }
}