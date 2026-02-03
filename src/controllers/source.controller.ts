import { NextFunction, Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { source } from '../models/source.schema';

export const addSource = async (req: Request, res: Response, next: NextFunction) => {
 
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

    // Get data from the body
    const { title, author, format } = req.body;

    // Validate input
    // if (!title) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Source title is required'
    //     });
    // }
    // --- END OF TODO ---

    try {

        // Validate - Check if submitted source exists
        const existingSource = await db.query.source.findFirst({
            where: eq(source.title, title)
        });

        if (existingSource) {
            throw new Error('Conflict', { cause: 'Source title already exists' });
        }

        // Save Source
        const newSource = await db.insert(source).values({
            title: title?.trim(),
            author: author?.trim(),
            format: format?.trim(),
            userId: userId
        }).returning();

        // Return Success
        return res.status(201).json({
            success: true,
            message: 'New source added successfully',
            data: newSource[0]
        });

    }
    catch (error: unknown) {
        next(error);
    }
};


export const getSource = async (req: Request, res: Response, next: NextFunction) => {

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

    // Get all sources
    try {
        const sources = await db.query.source.findMany({
            where: eq(source.userId, userId),
            orderBy: asc(source.title)
        });

        return res.status(200).json({
            success: true,
            data: sources
        });
    }

    catch (error: unknown) {
        next(error);
    }
};


export const updateSource = async (req: Request, res: Response, next: NextFunction) => {
    
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

    // Get parameter and input and validate inputs
    const { id } = req.params;
    const { title, author, format } = req.body;

    // if (!id) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Source Id is required'
    //     });
    // }

    // if (!title || title.trim() === "") {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Title is required'
    //     });
    // }
    // --- END OF TODO ---

    try {
        // Update the data
        const updatedSource = await db.update(source)
            .set({ 
                title: title.trim(),
                author: author?.trim(),
                format: format?.trim() 
            })
            .where(and (
                eq(source.id, parseInt(id)),
                eq(source.userId, userId)
            ))
            .returning();

        if (!updatedSource || updatedSource.length === 0) {
            throw new Error('Not found', { cause: 'Source not found'});
        }

        return res.status(200).json({
            success: true,
            message: 'Update is successful',
            data: updatedSource[0]
        });
    }
    catch (error: unknown) {
        next(error);
    }
};


export const deleteSource = async (req: Request, res: Response, next:NextFunction) => {

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

    // Get parameter and validate
    const { id } = req.params;

    // if (!id) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Source id is required'
    //     })
    // }
    // --- END OF TODO ---

    // Delete
    try {
        const deletedSource = await db.delete(source)
            .where(and (
                eq(source.id, parseInt(id)),
                eq(source.userId, userId)
            ))
            .returning();

        if (!deletedSource || deletedSource.length === 0) {
            throw new Error('Not found', { cause: 'Source not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Source successfully deleted'
        });

    }
    catch(error: unknown) {
        next(error);
    }
}