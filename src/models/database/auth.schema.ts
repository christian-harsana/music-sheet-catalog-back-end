import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const appUser = pgTable('app_user', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});