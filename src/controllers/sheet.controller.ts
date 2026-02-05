import { NextFunction, Request, Response } from 'express';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '../config/db';
import { sheet } from '../models/database/sheet.schema';
import { genre } from '../models/database/genre.schema';
import { level } from '../models/database/level.schema';
import { source } from '../models/database/source.schema';

export const addSheet = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userId = req.user!.userId;
        let { title, key, sourceId, levelId, genreId } = req.body;

        // Save Sheet
        const newSheet = await db.insert(sheet).values({
            title: title?.trim(),
            key: key,
            sourceId: sourceId,
            levelId: levelId,
            genreId: genreId,
            userId: userId
        }).returning();

        // Return Success
        return res.status(201).json({
            success: true,
            message: 'New sheet added successfully',
            data: newSheet[0]
        });

    }
    catch (error: unknown) {
        next(error);
    }
};


export const getSheet = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = req.user!.userId;

        const sheets = await db.select({
                id: sheet.id,
                title: sheet.title,
                key: sheet.key,
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
            success: true,
            message: 'All sheets fetched successfully',
            data: sheets
        });
    }
    catch (error: unknown) {
        next(error);
    }
};


export const updateSheet = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { id } = req.params;
        const userId = req.user!.userId;
        let { title, key, sourceId, levelId, genreId } = req.body;

        // Update the data
        const updatedSheet = await db.update(sheet)
            .set({ 
                title: title.trim(),
                key: key,
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
            throw new Error('Not found', { cause: 'Sheet not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Update is successful',
            data: updatedSheet[0]
        });
    }
    catch (error: unknown) {
        next(error);
    }
};


export const deleteSheet = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { id } = req.params;
        const userId = req.user!.userId;

        const deletedSheet = await db.delete(sheet)
            .where(and (
                eq(sheet.id, parseInt(id)),
                eq(sheet.userId, userId)
            ))
            .returning();

        if (!deletedSheet || deletedSheet.length === 0) {
            throw new Error('Not found', { cause: 'Sheet not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Sheet successfully deleted'
        });

    }
    catch(error: unknown) {
        next(error);
    }
}