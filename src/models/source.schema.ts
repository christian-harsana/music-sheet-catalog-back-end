import { pgTable, serial, text, integer, index } from 'drizzle-orm/pg-core';
import { appUser } from './auth.schema';
import { z } from 'zod';

// DB Schema
export const source = pgTable('source', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    author: text('author'),
    format: text('format'),
    userId: integer('user_id').notNull().references(() => appUser.id)
}, (table) => [
    index('source_user_id_idx').on(table.userId)
]);


// Validation Schemas
export const createSourceSchema = z.object({
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Source title is required'),
        author: z.string().optional(),
        format: z.string().optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getSourceSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateSourceSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Source Id is required')
    }),
    body: z.object({
        title: z.string()
            .trim()
            .min(1, 'Source title is required'),
        author: z.string().optional(),
        format: z.string().optional()
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteSourceSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Source Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});