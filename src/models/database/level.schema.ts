import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";
import { appUser } from "./auth.schema";

export const level = pgTable('level', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    userId: integer('user_id').notNull().references(() => appUser.id)
}, (table) => [
    index('level_user_id_idx').on(table.userId)
]);