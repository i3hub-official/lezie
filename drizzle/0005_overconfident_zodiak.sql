DROP INDEX "auth_users_username_idx";--> statement-breakpoint
DROP INDEX "auth_users_phone_number_idx";--> statement-breakpoint
DROP INDEX "auth_users_email_idx";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hashable" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username_hash" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_hashable_user_id_fk" FOREIGN KEY ("hashable") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_users_email_hash_idx" ON "user" USING btree ("email_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_users_username_hash_idx" ON "user" USING btree ("username_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_users_phone_hash_idx" ON "user" USING btree ("phone_hash");--> statement-breakpoint
CREATE INDEX "auth_users_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_hashable_unique" UNIQUE("hashable");