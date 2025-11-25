import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const genre = pgTable('genre', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});