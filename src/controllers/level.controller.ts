import { Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { level } from '../models/level.schema';

export const addLevel = async (req: Request, res: Response) => {
 
    // Verify authenticated user
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthenticated user'
        });
    }

    const userId = parseInt(req.user.userId);

    if (isNaN(userId)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid User Id'
        });
    }

    // Get data from the body
    const { name, description } = req.body;

    // Validate input
    if (!name) {
        return res.status(400).json({
            status: 'error',
            message: 'Level name is required'
        });
    }

    try {

        // Validate - Check if submitted level exists
        const existingLevel = await db.query.level.findFirst({
            where: and(
                eq(level.name, name),
                eq(level.userId, userId)
            )
        });

        if (existingLevel) {
            return res.status(409).json({
                status: 'error',
                message: 'Level name already exists'
            });
        }

        // Save Level
        const newLevel = await db.insert(level).values({
            name: name?.trim(),
            description: description?.trim(),
            userId: userId
        }).returning();

        // Return Success
        return res.status(201).json({
            status: 'success',
            message: 'New level added successfully',
            data: newLevel[0]
        });

    }
    catch (error: unknown) {
        
        const errorMessage  = error instanceof Error ? error.message : 'Unknown error';

        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: errorMessage
        })
    }
};


export const getLevel = async (req: Request, res: Response) => {

    // Verify authenticated user
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthenticated user'
        });
    }

    // Get all levels
    try {
        const levels = await db.query.level.findMany({
            orderBy: asc(level.id)
        });

        return res.status(200).json({
            status: 'success',
            data: levels
        });
    }

    catch (error: unknown) {
        const errorMessage = error instanceof Error? error.message : 'unknown error';

        return res.status(500).json({
            status: 'error',
            message: errorMessage
        });
    }
};


export const updateLevel = async (req: Request, res: Response) => {
    
    // Verify authenticated user
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthenticated user'
        });
    }

    // Get parameter and input and validate inputs
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'Level Id is required'
        });
    }

    if (!name || name.trim() === "") {
        return res.status(400).json({
            status: 'error',
            message: 'Name is required'
        });
    }

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
            return res.status(404).json({
                status: 'error',
                message: 'Level not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Update is successful',
            data: updatedLevel[0]
        });
    }
    catch (error: unknown) {

        const errorMessage = error instanceof Error ? error.message : "unknown error";

        return res.status(500).json({
            status: 'error',
            message: errorMessage
        });
    }
};


export const deleteLevel = async (req: Request, res: Response) => {

    // Verify authenticated user
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthenticated user'
        });
    }

    // Get parameter and validate
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'Level id is required'
        })
    }

    // Delete
    try {

        const deletedLevel = await db.delete(level)
            .where(eq(level.id, parseInt(id)))
            .returning();

        if (!deletedLevel || deletedLevel.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Level not found.'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Level successfully deleted'
        });

    }
    catch(error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "unknown error";

        return res.status(500).json({
            status: 'error',
            message: errorMessage
        });
    }
}