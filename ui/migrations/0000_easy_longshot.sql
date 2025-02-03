CREATE TYPE "public"."player_status" AS ENUM('alive', 'dead', 'completed');--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"level_number" integer NOT NULL,
	"player_answer" text,
	"result" text
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"number" integer PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"minimum_word_count" integer,
	"required_elements" text[]
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"current_level" integer DEFAULT 0 NOT NULL,
	"status" "player_status" DEFAULT 'alive' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;