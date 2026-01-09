import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";
import { source } from "./source.schema";
import { level } from "./level.schema";
import { genre } from "./genre.schema";
import { appUser } from "./app-user.schema";

export const sheet = pgTable('sheet', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    sourceId: integer('source_id').references(() => source.id),
    levelId: integer('level_id').references(() => level.id),
    genreId: integer('genre_id').references(() => genre.id),
    userId: integer('user_id').notNull().references(() => appUser.id)
}, (table) => [
    index('sheet_user_id_idx').on(table.userId)
]);