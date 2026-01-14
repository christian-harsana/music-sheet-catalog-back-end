import { Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { genre } from '../models/genre.schema';

export const addGenre = async (req: Request, res: Response) => {
 
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
    const { name } = req.body;

    // Validate input
    if (!name) {
        return res.status(400).json({
            status: 'error',
            message: 'Genre name is required'
        });
    }

    try {

        // Validate - Check if submitted genre exists
        const existingGenre = await db.query.genre.findFirst({
            where: and(
                eq(genre.name, name),
                eq(genre.userId, userId)
            )
        });

        if (existingGenre) {
            return res.status(409).json({
                status: 'error',
                message: 'Genre name already exists'
            });
        }

        // Save Genre
        const newGenre = await db.insert(genre).values({
            name: name?.trim(),
            userId: userId
        }).returning();

        // Return Success
        return res.status(201).json({
            status: 'success',
            message: 'New genre added successfully',
            data: newGenre[0]
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


export const getGenre = async (req: Request, res: Response) => {

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

    // Get all genres
    try {
        const genres = await db.query.genre.findMany({
            where: eq(genre.userId, userId),
            orderBy: asc(genre.id)
        });

        return res.status(200).json({
            status: 'success',
            data: genres
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


export const updateGenre = async (req: Request, res: Response) => {
    
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
        })
    }

    // Get parameter and input and validate inputs
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'Genre Id is required'
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
        const updatedGenre = await db.update(genre)
            .set({ name: name.trim() })
            .where(and(
                eq(genre.id, parseInt(id)),
                eq(genre.userId, userId)
            ))
            .returning();

        if (!updatedGenre || updatedGenre.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Genre not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Update is successful',
            data: updatedGenre[0]
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


export const deleteGenre = async (req: Request, res: Response) => {

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
        })
    }

    // Get parameter and validate
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'Genre id is required'
        })
    }

    // Delete
    try {

        const deletedGenre = await db.delete(genre)
            .where(and (
                eq(genre.id, parseInt(id)),
                eq(genre.userId, userId)
            ))
            .returning();

        if (!deletedGenre || deletedGenre.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Genre not found.'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Genre successfully deleted'
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