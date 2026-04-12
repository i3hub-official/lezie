CREATE TYPE "public"."alert_zone_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "alert_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"radius" integer DEFAULT 2 NOT NULL,
	"categories" jsonb NOT NULL,
	"severity" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"location_label" varchar(255),
	"lat" text,
	"lng" text,
	"last_triggered" timestamp,
	"notification_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alert_zones" ADD CONSTRAINT "alert_zones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alert_zones_user_idx" ON "alert_zones" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "alert_zones_active_idx" ON "alert_zones" USING btree ("is_active");