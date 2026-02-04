import { NextFunction, Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { source } from '../models/source.schema';

export const addSource = async (req: Request, res: Response, next: NextFunction) => {
 
    try {

        const { title, author, format } = req.body;
        const userId = req.user!.userId;

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

    // Get all sources
    try {
        const userId = req.user!.userId;

        const sources = await db.query.source.findMany({
            where: eq(source.userId, userId),
            orderBy: asc(source.title)
        });

        return res.status(200).json({
            success: true,
            message: 'All sources fetched successfully',
            data: sources
        });
    }

    catch (error: unknown) {
        next(error);
    }
};


export const updateSource = async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        const userId = req.user!.userId;
        const { id } = req.params;
        const { title, author, format } = req.body;

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

    try {

        const { id } = req.params;
        const userId = req.user!.userId;

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