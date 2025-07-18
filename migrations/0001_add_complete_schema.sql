-- Migration: Add Chat, Disease, Training Data, and System Log tables
-- Created: 2025-01-18

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS "chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_sessions_session_id_unique" UNIQUE("session_id")
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"message_id" text NOT NULL,
	"text" text NOT NULL,
	"sender" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_messages_message_id_unique" UNIQUE("message_id")
);

-- Disease Information Table
CREATE TABLE IF NOT EXISTS "diseases" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"symptoms" text[],
	"causes" text[],
	"treatments" text[],
	"preventions" text[],
	"risk_factors" text[],
	"category" text,
	"severity" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "diseases_name_unique" UNIQUE("name")
);

-- Training Data Table
CREATE TABLE IF NOT EXISTS "training_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"input_text" text NOT NULL,
	"expected_output" text NOT NULL,
	"category" text,
	"confidence" real,
	"validated" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- System Logs Table
CREATE TABLE IF NOT EXISTS "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"context" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("session_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
