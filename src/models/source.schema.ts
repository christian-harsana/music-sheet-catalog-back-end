import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";

export const source = pgTable('source', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    author: text('author'),
    format: text('format'),
    userId: integer('user_id').notNull()
}, (table) => [
    index('source_user_id_idx').on(table.userId)
]);