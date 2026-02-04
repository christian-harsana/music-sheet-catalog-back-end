import { pgTable, serial, text, integer, index } from 'drizzle-orm/pg-core';
import { appUser } from './app-user.schema';
import { z } from 'zod';

// DB schema
export const genre = pgTable('genre', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    userId: integer('user_id').notNull().references(() => appUser.id)
}, (table) => [
    index('genre_user_id_idx').on(table.userId)
]);


// Validation Schemas
export const createGenreSchema = z.object({
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Genre Name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getGenreSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateGenreSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Genre Id is required')
    }),
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Genre Name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteGenreSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Genre Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});