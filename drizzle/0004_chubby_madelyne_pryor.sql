CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
DROP INDEX "auth_users_phone_idx";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(100);--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_sessions_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "auth_sessions_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_sessions_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username") WHERE "users"."username" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_users_phone_number_idx" ON "user" USING btree ("phone_number");