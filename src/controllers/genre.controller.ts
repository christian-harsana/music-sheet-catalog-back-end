import { NextFunction, Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { genre } from '../models/genre.schema';
import { z } from 'zod';

export const addGenre = async (req: Request, res: Response, next: NextFunction) => {
 
    try {

        const { name } = req.body;
        const userId = req.user!.userId; // NOTE: safe to use ! because req user has been checked at the validation middleware

        // Validate - Check if submitted genre exists
        const existingGenre = await db.query.genre.findFirst({
            where: and(
                eq(genre.name, name),
                eq(genre.userId, userId)
            )
        });

        if (existingGenre) {
            throw new Error('Conflict', {cause: 'Genre name already exists'});
        }

        // Save Genre
        const newGenre = await db.insert(genre).values({
            name: name?.trim(),
            userId: userId
        }).returning();

        // Return Success
        return res.status(201).json({
            success: true,
            message: 'New genre added successfully',
            data: newGenre[0]
        });

    }
    catch (error: unknown) {
        next(error);
    }
};


export const getGenre = async (req: Request, res: Response, next: NextFunction) => {

    // Get all genres
    try {

        const userId = req.user!.userId;

        const genres = await db.query.genre.findMany({
            where: eq(genre.userId, userId),
            orderBy: asc(genre.id)
        });

        return res.status(200).json({
            success: true,
            message: 'All genres fetched successfully',
            data: genres
        });
    }
    catch (error: unknown) {
        next(error);
    }
};


export const updateGenre = async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        // Get parameter and input and validate inputs
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user!.userId;

        // Update the data
        const updatedGenre = await db.update(genre)
            .set({ name: name.trim() })
            .where(and(
                eq(genre.id, parseInt(id)),
                eq(genre.userId, userId)
            ))
            .returning();

        if (!updatedGenre || updatedGenre.length === 0) {
            throw new Error('Not Found', {cause: 'Genre no found'});
        }

        return res.status(200).json({
            success: true,
            message: 'Update is successful',
            data: updatedGenre[0]
        });
    }
    catch (error: unknown) {
        next(error);
    }
};


export const deleteGenre = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const deletedGenre = await db.delete(genre)
            .where(and (
                eq(genre.id, parseInt(id)),
                eq(genre.userId, userId)
            ))
            .returning();

        if (!deletedGenre || deletedGenre.length === 0) {
            throw new Error('Not Found', {cause: 'Genre not found'});
        }

        return res.status(200).json({
            success: true,
            message: 'Genre successfully deleted'
        });

    }
    catch(error: unknown) {
        next(error);
    }
}