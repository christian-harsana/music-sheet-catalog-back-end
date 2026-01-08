ALTER TABLE "genre" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "level" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
CREATE INDEX "genre_user_id_idx" ON "genre" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "level_user_id_idx" ON "level" USING btree ("user_id");