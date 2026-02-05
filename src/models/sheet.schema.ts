import { pgTable, serial, text, integer, index } from 'drizzle-orm/pg-core';
import { source } from './source.schema';
import { level } from './level.schema';
import { genre } from './genre.schema';
import { appUser } from './app-user.schema';
import { z } from 'zod';

export const sheet = pgTable('sheet', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    key: text('key'),
    sourceId: integer('source_id').references(() => source.id),
    levelId: integer('level_id').references(() => level.id),
    genreId: integer('genre_id').references(() => genre.id),
    userId: integer('user_id').notNull().references(() => appUser.id)
}, (table) => [
    index('sheet_user_id_idx').on(table.userId)
]);


// Validation Schemas
export const createSheetSchema = z.object({
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Sheet title is required'),
        key: z.string().nullable().optional(),
        sourceId: z.number()
            .int('Source Id must be an integer')
            .positive('Source Id must be positive')
            .nullable()
            .optional(),
        levelId: z.number()
            .int('Level Id must be an integer')
            .positive('Level Id must be positive')
            .nullable()
            .optional(),
        genreId: z.number()
            .int('Genre Id must be an integer')
            .positive('Genre Id must be positive')
            .nullable()
            .optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getSheetSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateSheetSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Sheet Id is required')
    }),
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Sheet title is required'),
        key: z.string().nullable().optional(),
        sourceId: z.number()
            .int('Source Id must be an integer')
            .positive('Source Id must be positive')
            .nullable()
            .optional(),
        levelId: z.number()
            .int('Level Id must be an integer')
            .positive('Level Id must be positive')
            .nullable()
            .optional(),
        genreId: z.number()
            .int('Genre Id must be an integer')
            .positive('Genre Id must be positive')
            .nullable()
            .optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteSheetSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Sheet Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});