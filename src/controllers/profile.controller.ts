import { NextFunction, Request, Response } from "express";
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { appUser } from "../models/auth.schema";

export const profile = async (req: Request, res: Response, next: NextFunction) => {
    
    // TODO: Reallocate to validation middleware
    // if (!req.user) {
    //     return res.status(401).json({ 
    //         success: false,
    //         message: 'Unauthenticated user' 
    //     });
    // }

    try {
        const user = await db.query.appUser.findFirst({
            where: eq(appUser.id, Number(req.user!.userId))
        });

        if (!user) {
            throw new Error('Not found', { cause: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            data: { 
                userId: user.id, 
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });

    }
    catch (error: unknown) {
        next(error);
    }

};