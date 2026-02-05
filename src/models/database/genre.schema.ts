import { pgTable, serial, text, integer, index } from 'drizzle-orm/pg-core';
import { appUser } from './auth.schema';

export const genre = pgTable('genre', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    userId: integer('user_id').notNull().references(() => appUser.id)
}, (table) => [
    index('genre_user_id_idx').on(table.userId)
]);