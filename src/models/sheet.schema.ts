import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const sheet = pgTable('sheet', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    sourceId: integer('source_id').notNull(),
    levelId: integer('level_id').notNull(),
    genreId: integer('genre_id').notNull(),
});