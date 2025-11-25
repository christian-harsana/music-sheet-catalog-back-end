CREATE TABLE "app_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "genre" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "sheet" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"source_id" integer NOT NULL,
	"level_id" integer NOT NULL,
	"genre_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"format" text
);
