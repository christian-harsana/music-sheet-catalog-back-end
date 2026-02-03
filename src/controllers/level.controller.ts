import { NextFunction, Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { level } from '../models/level.schema';

export const addLevel = async (req: Request, res: Response, next: NextFunction) => {

    // TODO: Reallocate to validation middleware
    // Verify authenticated user
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthenticated user'
    //     });
    // }

    const userId = parseInt(req.user!.userId);

    // if (isNaN(userId)) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Invalid User Id'
    //     });
    // }
    // --- END OF TODO ---

    // Get data from the body
    const { name, description } = req.body;

    // Validate input
    // if (!name) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Level name is required'
    //     });
    // }
    // --- END OF TODO ---

    try {

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

    // TODO: Reallocate to validation middleware
    // Verify authenticated user
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthenticated user'
    //     });
    // }

    const userId = parseInt(req.user!.userId);

    // if (isNaN(userId)) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Invalid User Id'
    //     });
    // }
    // --- END OF TODO ---

    // Get all levels
    try {
        const levels = await db.query.level.findMany({
            where: eq(level.userId, userId),
            orderBy: asc(level.id)
        });

        return res.status(200).json({
            success: true,
            data: levels
        });
    }

    catch (error: unknown) {
        next(error);
    }
};


export const updateLevel = async (req: Request, res: Response, next:NextFunction) => {
    
    // TODO: Reallocate to validation middleware
    // Verify authenticated user
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthenticated user'
    //     });
    // }

    // Get parameter and input and validate inputs
    const { id } = req.params;
    const { name, description } = req.body;

    // if (!id) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Level Id is required'
    //     });
    // }

    // if (!name || name.trim() === "") {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Name is required'
    //     });
    // }
    // --- END OF TODO ---

    try {
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

    // TODO: Reallocate to validation middleware
    // Verify authenticated user
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthenticated user'
    //     });
    // }

    // Get parameter and validate
    const { id } = req.params;

    // if (!id) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Level id is required'
    //     })
    // }
    // --- END OF TODO ---

    // Delete
    try {

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