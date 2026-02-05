import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// DB Schema
export const appUser = pgTable('app_user', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


// Validation Schemas
export const signupSchema = z.object({
    body: z.object({
        email: z.email('Invalid email format'),
        password: z.string()
            .min(8, 'Password length must be at least 8 characters'),
        name: z.string()
            .optional()
            .nullable()
    })
});


export const loginSchema = z.object({
    body: z.object({
        email: z.email('Invalid email format'),
        password: z.string()
            .min(1, 'Password is required'),
    })
});


export const tokenVerificationSchema = z.object({
    body: z.object({
        token: z.jwt('Invalid JWT format')
    })
});