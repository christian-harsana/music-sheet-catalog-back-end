import { Request, Response } from "express";
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { appUser } from "../models/app-user.schema";

export const profile = async (req: Request, res: Response) => {
    
    if (!req.user) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Unauthenticated user' 
        });
    }

    try {
        const user = await db.query.appUser.findFirst({
            where: eq(appUser.id, Number(req.user.userId))
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: { 
                userId: user.id, 
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });

    }
    catch (error: unknown) {

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: errorMessage
        })
    }

};