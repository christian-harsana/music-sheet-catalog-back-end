import { NextFunction, Request, Response } from "express";
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { appUser } from "../models/database/auth.schema";
import { HttpError } from "../errors";

export const profile = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = await db.query.appUser.findFirst({
            where: eq(appUser.id, Number(req.user!.userId))
        });

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        return res.status(200).json({
            success: true,
            message: 'User profile succesfully fetched',
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