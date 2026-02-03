import { NextFunction, Request, Response } from 'express';
import { eq, and, or, count, isNull } from 'drizzle-orm';
import { db } from '../config/db';
import { sheet } from '../models/sheet.schema';
import { level } from '../models/level.schema';
import { genre } from '../models/genre.schema';

export const summary = async (req: Request, res: Response, next: NextFunction) => {

    // TODO: Reallocate to validation middleware
    // Verify authenticated user
    // if (!req.user) {
    //     return res.status(401).json({
    //         status: 'error',
    //         message: 'Unauthenticated user'
    //     });
    // }

    const userId = parseInt(req.user!.userId);

    // if (isNaN(userId)) {
    //     return res.status(400).json({
    //         status: 'error',
    //         message: 'Invalid User Id'
    //     });
    // }
    // --- END OF TODO ---

    // Get summary
    try {

        const [sheetsByLevel, sheetsByGenre, sheetsWithMissingData] = await Promise.all([
            db.select({
                    levelId: sheet.levelId,
                    levelName: level.name,
                    count: count(sheet.id)
                })
                .from(sheet)
                .leftJoin(level, eq(sheet.levelId, level.id))
                .where(eq(sheet.userId, userId))
                .groupBy(sheet.levelId, level.name)
                .orderBy(sheet.levelId),
            db.select({
                    genreId: sheet.genreId,
                    genreName: genre.name,
                    count: count(sheet.id)
                })
                .from(sheet)
                .leftJoin(genre, eq(sheet.genreId, genre.id))
                .where(eq(sheet.userId, userId))
                .groupBy(sheet.genreId, genre.name)
                .orderBy(genre.name),
            db.select({
                    count: count(sheet.id)
                })
                .from(sheet)
                .where(
                    and (
                        eq(sheet.userId, userId),
                        or(
                            isNull(sheet.sourceId),
                            isNull(sheet.levelId),
                            isNull(sheet.genreId),
                            isNull(sheet.key),
                        )
                    )
                )
        ]);

        return res.status(200).json({
            status: 'success',
            data: [sheetsByLevel, sheetsByGenre, sheetsWithMissingData]
        });
    }

    catch (error: unknown) {
        next(error);
    }
};