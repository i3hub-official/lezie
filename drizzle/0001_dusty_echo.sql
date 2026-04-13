ALTER TABLE "user_profiles" ADD COLUMN "home_address" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "state" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "cover_url" varchar(500);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "avatar_public_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "cover_public_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "nin" varchar(500);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "bvn" varchar(500);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "nin_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "bvn_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "nin_submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "bvn_submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "social_links" jsonb;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "username" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "username_set_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "user_profiles_username_idx" ON "user_profiles" USING btree ("username") WHERE "user_profiles"."username" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" DROP COLUMN "data";