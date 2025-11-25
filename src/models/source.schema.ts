import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const source = pgTable('source', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    author: text('author'),
    format: text('format'),
});