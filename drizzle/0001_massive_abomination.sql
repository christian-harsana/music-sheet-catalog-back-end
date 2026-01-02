ALTER TABLE "sheet" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "source" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
CREATE INDEX "sheet_user_id_idx" ON "sheet" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "source_user_id_idx" ON "source" USING btree ("user_id");