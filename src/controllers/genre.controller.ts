import { NextFunction, Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { genre } from '../models/genre.schema';
import { success, z, ZodError } from 'zod';

export const addGenre = async (req: Request, res: Response, next: NextFunction) => {
 
    const addGenreSchema = z.object({
        name: z.string()
    });

    // TODO: reallocate to validation middleware
    // // Verify authenticated user - 
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthenticated user'
    //     });
    // }

    // const userId = parseInt(req.user.userId);

    // if (isNaN(userId)) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Invalid User Id'
    //     });
    // }
    // --- END OF TODO ---

    try {

        const { name } = req.body;
        const userId = parseInt(req.user!.userId); // NOTE: safe to use ! because req user has been checked at the middleware

        addGenreSchema.parse({
            name: name
        });

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
        
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            })
        }

        next(error);
    }
};


export const getGenre = async (req: Request, res: Response, next: NextFunction) => {

    // TODO: reallocate to validation middleware
    // Verify authenticated user
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthenticated user'
    //     });
    // }

    // if (isNaN(userId)) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Invalid User Id'
    //     });
    // }
    // -- END OF TODO

    // Get all genres
    try {

        const userId = parseInt(req.user!.userId);

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
    
    const updateGenreSchema = z.object({
        name: z.string()
    });

    // TODO: reallocate to validation middleware
    // Verify authenticated user
    // if (!req.user) {
    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthenticated user'
    //     });
    // }

    // const userId = parseInt(req.user.userId);

    // if (isNaN(userId)) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Invalid User Id'
    //     })
    // }
    // -- END OF TODO --
    
    try {

        // Get parameter and input and validate inputs
        const { id } = req.params;
        const { name } = req.body;
        const userId = parseInt(req.user!.userId);

        // TODO: Reallocate to validation middleware
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Genre Id is required'
            });
        }

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }
        // -- END OF TODO --

        updateGenreSchema.parse({
            id: id,
            name: name
        });

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

    // TODO: reallocate to validation middleware
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
    //     })
    // }
    // --- END OF TODO ---

    // Get parameter and validate
    const { id } = req.params;

    // TODO: reallocate to validation middleware
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Genre id is required'
        })
    }
    // --- END OF TODO

    // Delete
    try {

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