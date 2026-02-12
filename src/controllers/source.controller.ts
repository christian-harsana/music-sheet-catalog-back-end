import { NextFunction, Request, Response } from 'express';
import { eq, asc, and, count } from 'drizzle-orm';
import { db } from '../config/db';
import { source } from '../models/database/source.schema';
import { HttpError } from '../errors';

export const addSource = async (req: Request, res: Response, next: NextFunction) => {
 
    try {

        const { title, author, format } = req.body;
        const userId = req.user!.userId;

        // Validate - Check if submitted source exists
        const existingSource = await db.query.source.findFirst({
            where: eq(source.title, title)
        });

        if (existingSource) {
            throw new HttpError(409, 'Source title already exists');
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

    try {
        const userId = req.user!.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Get sources data
        const sources = await db.query.source.findMany({
            where: eq(source.userId, userId),
            limit: limit,
            offset: offset,
            orderBy: asc(source.title)
        });

        // Get total count
        const totalCount = await db.select({
                count: count(source.id)
            })
            .from(source)
            .where(eq(source.userId, userId));

        const total = totalCount[0].count;
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            message: 'Sources data fetched successfully',
            data: sources,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems: total,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
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
            throw new HttpError(404, 'Source not found');
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
            throw new HttpError(404, 'Source not found');
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