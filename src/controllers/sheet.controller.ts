import e, { Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { sheet } from '../models/sheet.schema';
import { genre } from '../models/genre.schema';
import { level } from '../models/level.schema';
import { source } from '../models/source.schema';

export const addSheet = async (req: Request, res: Response) => {
 
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
    let { title, sourceId, levelId, genreId } = req.body;

    console.log(title);
    console.log(sourceId);
    console.log(levelId);
    console.log(genreId);

    // Validate and sanitise input
    if (!title) {
        return res.status(400).json({
            status: 'error',
            message: 'Sheet title is required'
        });
    }

    sourceId = sourceId?.length < 1 ? null : sourceId;
    levelId = levelId?.length < 1 ? null : levelId;
    genreId = genreId?.length < 1 ? null : genreId;

    try {

        // Save Sheet
        const newSheet = await db.insert(sheet).values({
            title: title?.trim(),
            sourceId: sourceId,
            levelId: levelId,
            genreId: genreId,
            userId: userId
        }).returning();

        // Return Success
        return res.status(201).json({
            status: 'success',
            message: 'New sheet added successfully',
            data: newSheet[0]
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


export const getSheet = async (req: Request, res: Response) => {

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

    // Get all sheets
    try {
        const sheets = await db.select({
                id: sheet.id,
                title: sheet.title,
                sourceId: sheet.sourceId,
                sourceTitle: source.title,
                levelId: sheet.levelId,
                levelName: level.name,
                genreId: sheet.genreId,
                genreName: genre.name
            })
            .from(sheet)
            .leftJoin(genre, eq(sheet.genreId, genre.id))
            .leftJoin(level, eq(sheet.levelId, level.id))
            .leftJoin(source, eq(sheet.sourceId, source.id))
            .where(eq(sheet.userId, userId))
            .orderBy(asc(sheet.title));

        return res.status(200).json({
            status: 'success',
            data: sheets
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


export const updateSheet = async (req: Request, res: Response) => {
    
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
    let { title, sourceId, levelId, genreId } = req.body;

    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'Sheet Id is required'
        });
    }

    if (!title || title.trim() === "") {
        return res.status(400).json({
            status: 'error',
            message: 'Title is required'
        });
    }

    // Sanitise inputs
    sourceId = sourceId?.length < 1 ? null : sourceId;
    levelId = levelId?.length < 1 ? null : levelId;
    genreId = genreId?.length < 1 ? null : genreId;


    try {
        // Update the data
        const updatedSheet = await db.update(sheet)
            .set({ 
                title: title.trim(),
                sourceId: sourceId,
                levelId: levelId,
                genreId : genreId
            })
            .where(and(
                eq(sheet.id, parseInt(id)),
                eq(sheet.userId, userId)
            ))
            .returning();

        if (!updatedSheet || updatedSheet.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Sheet not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Update is successful',
            data: updatedSheet[0]
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


export const deleteSheet = async (req: Request, res: Response) => {

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
            message: 'Sheet Id is required'
        })
    }

    // Delete
    try {

        const deletedSheet = await db.delete(sheet)
            .where(and (
                eq(sheet.id, parseInt(id)),
                eq(sheet.userId, userId)
            ))
            .returning();

        if (!deletedSheet || deletedSheet.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Sheet not found.'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Sheet successfully deleted'
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