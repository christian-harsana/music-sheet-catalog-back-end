import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";

export const sheet = pgTable('sheet', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    sourceId: integer('source_id').notNull(),
    levelId: integer('level_id').notNull(),
    genreId: integer('genre_id').notNull(),
    userId: integer('user_id').notNull()
}, (table) => [
    index('sheet_user_id_idx').on(table.userId)
]);