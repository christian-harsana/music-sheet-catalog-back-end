import { NextFunction, Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { level } from '../models/level.schema';

export const addLevel = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { name, description } = req.body;
        const userId = req.user!.userId;

        // Validate - Check if submitted level exists
        const existingLevel = await db.query.level.findFirst({
            where: and(
                eq(level.name, name),
                eq(level.userId, userId)
            )
        });

        if (existingLevel) {
            throw new Error('Conflict', {cause: 'Level name already exists'});
        }

        // Save Level
        const newLevel = await db.insert(level).values({
            name: name?.trim(),
            description: description?.trim(),
            userId: userId
        }).returning();

        // Return Success
        return res.status(201).json({
            success: true,
            message: 'New level added successfully',
            data: newLevel[0]
        });

    }
    catch (error: unknown) {
        next(error);
    }
};


export const getLevel = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userId = req.user!.userId;

        const levels = await db.query.level.findMany({
            where: eq(level.userId, userId),
            orderBy: asc(level.id)
        });

        return res.status(200).json({
            success: true,
            message: 'All levels fetched successfully',
            data: levels
        });
    }

    catch (error: unknown) {
        next(error);
    }
};


export const updateLevel = async (req: Request, res: Response, next:NextFunction) => {

    try {

        // Get parameter and input and validate inputs
        const { id } = req.params;
        const { name, description } = req.body;

        // Update the data
        const updatedLevel = await db.update(level)
            .set({ 
                name: name.trim(),
                description: description?.trim() 
            })
            .where(eq(level.id, parseInt(id)))
            .returning();

        if (!updatedLevel || updatedLevel.length === 0) {
            throw new Error('Not found', {cause: 'Level not found'});
        }

        return res.status(200).json({
            success: true,
            message: 'Update is successful',
            data: updatedLevel[0]
        });
    }
    catch (error: unknown) {
        next(error);
    }
};


export const deleteLevel = async (req: Request, res: Response, next: NextFunction) => {

    // Delete
    try {

        // Get parameter and validate
        const { id } = req.params;

        const deletedLevel = await db.delete(level)
            .where(eq(level.id, parseInt(id)))
            .returning();

        if (!deletedLevel || deletedLevel.length === 0) {
            throw new Error('Not found', {cause: 'Level not found'});
        }

        return res.status(200).json({
            success: true,
            message: 'Level successfully deleted'
        });

    }
    catch(error: unknown) {
        next(error);
    }
}