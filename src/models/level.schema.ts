import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";
import { appUser } from "./app-user.schema";
import { z } from 'zod';

// DB Schema
export const level = pgTable('level', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    userId: integer('user_id').notNull().references(() => appUser.id)
}, (table) => [
    index('level_user_id_idx').on(table.userId)
]);


// Validation Schemas
export const createLevelSchema = z.object({
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Level name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const getLevelSchema = z.object({
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const updateLevelSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Level Id is required')
    }),
    body: z.object({
        name: z.string()
            .trim()
            .min(1, 'Level Name is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});

export const deleteLevelSchema = z.object({
    params: z.object({
        id: z.string()
            .trim()
            .min(1, 'Level Id is required')
    }),
    user: z.object({
        userId: z.number()
            .int('User Id must be an integer')
            .positive('User Id must be positive')
    })
});