ALTER TABLE "user_actions" ADD COLUMN "task_id" integer;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "text" text;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "completed" boolean;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "priority" text;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "order" integer;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "reorder_before" jsonb;--> statement-breakpoint
ALTER TABLE "user_actions" ADD COLUMN "reorder_after" jsonb;--> statement-breakpoint
ALTER TABLE "user_actions" DROP COLUMN "payload";