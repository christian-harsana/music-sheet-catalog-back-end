import { NextFunction, Request, Response } from 'express';
import { eq, asc, and, count, or, ilike } from 'drizzle-orm';
import { db } from '../config/db';
import { sheet } from '../models/database/sheet.schema';
import { genre } from '../models/database/genre.schema';
import { level } from '../models/database/level.schema';
import { source } from '../models/database/source.schema';
import { HttpError } from '../errors';

export const addSheet = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userId = req.user!.userId;
        let { title, key, composer, sourceId, levelId, genreId, examPiece } = req.body;

        // Save Sheet
        const newSheet = await db.insert(sheet).values({
            title: title?.trim(),
            key: key,
            composer: composer,
            sourceId: sourceId,
            levelId: levelId,
            genreId: genreId,
            examPiece: examPiece,
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        const {keyQuery, levelQuery, genreQuery, examPieceQuery, searchQuery} = req.query;
        const searchFilter: string | undefined = searchQuery ? searchQuery as string : undefined;
        const keyFilter: string | undefined = keyQuery && keyQuery !== 'all' ? keyQuery as string : undefined;
        const levelFilter: number | undefined = levelQuery && levelQuery !== 'all' ? parseInt(levelQuery as string) : undefined;
        const genreFilter: number | undefined = genreQuery && genreQuery !== 'all' ? parseInt(genreQuery as string) : undefined;
        const examPieceFilter: boolean | undefined = examPieceQuery === 'true' ? true : false; 

        // Build WHERE conditions based on filter query
        const conditions = [eq(sheet.userId, userId)];

        if (keyFilter) {
            conditions.push(eq(sheet.key, keyFilter))
        }

        if (levelFilter) {
            conditions.push(eq(sheet.levelId, levelFilter))
        }

        if (genreFilter) {
            conditions.push(eq(sheet.genreId, genreFilter))
        }

        if (examPieceQuery) {
            conditions.push(eq(sheet.examPiece, examPieceFilter))
        }

        if (searchFilter && searchFilter.trim().length > 0) {
            const searchTerm = `%${searchFilter}%`;
            const searchTermCondition = or(
                    ilike(sheet.title, searchTerm),
                    ilike(sheet.composer, searchTerm),
                    ilike(source.title, searchTerm),
                );

            if (searchTermCondition) {
                conditions.push(searchTermCondition);
            }
        }

        // Get sheets data
        const sheets = await db.select({
                id: sheet.id,
                title: sheet.title,
                key: sheet.key,
                composer: sheet.composer,
                sourceId: sheet.sourceId,
                sourceTitle: source.title,
                levelId: sheet.levelId,
                levelName: level.name,
                genreId: sheet.genreId,
                genreName: genre.name,
                examPiece: sheet.examPiece
            })
            .from(sheet)
            .leftJoin(genre, eq(sheet.genreId, genre.id))
            .leftJoin(level, eq(sheet.levelId, level.id))
            .leftJoin(source, eq(sheet.sourceId, source.id))
            .where(and(...conditions))
            .limit(limit)
            .offset(offset)
            .orderBy(asc(sheet.title));

        
        // Get Total Count
        const totalCount = await db.select({
                count: count(sheet.id)
            })
            .from(sheet)
            .leftJoin(source, eq(sheet.sourceId, source.id))
            .where(and(...conditions));
        
        const total = totalCount[0].count;
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            message: 'Sheets data fetched successfully',
            data: sheets,
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


export const updateSheet = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { id } = req.params;
        const userId = req.user!.userId;
        let { title, key, composer, sourceId, levelId, genreId, examPiece } = req.body;

        // Update the data
        const updatedSheet = await db.update(sheet)
            .set({ 
                title: title.trim(),
                key: key,
                composer: composer,
                sourceId: sourceId,
                levelId: levelId,
                genreId : genreId,
                examPiece: examPiece
            })
            .where(and(
                eq(sheet.id, parseInt(id)),
                eq(sheet.userId, userId)
            ))
            .returning();

        if (!updatedSheet || updatedSheet.length === 0) {
            throw new HttpError(404, 'Sheet not found');
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
            throw new HttpError(404, 'Sheet not found');
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