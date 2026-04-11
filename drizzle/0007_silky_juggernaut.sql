ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "saved_locations" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "statuses" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "first_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "last_name" SET DATA TYPE varchar(400);--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "city" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "country" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(255);