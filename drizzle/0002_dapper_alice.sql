CREATE TABLE "alert_zone_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zone_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"trigger_id" uuid NOT NULL,
	"channel" varchar(20) NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"delivered" boolean DEFAULT false,
	"read_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "alert_zone_triggers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zone_id" uuid NOT NULL,
	"incident_id" uuid,
	"post_id" uuid,
	"trigger_type" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"message" text,
	"triggered_at" timestamp DEFAULT now() NOT NULL,
	"is_notified" boolean DEFAULT false NOT NULL,
	"notified_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_alert_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"zone_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hashable" text;--> statement-breakpoint
ALTER TABLE "alert_zone_notifications" ADD CONSTRAINT "alert_zone_notifications_zone_id_alert_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."alert_zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_zone_notifications" ADD CONSTRAINT "alert_zone_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_zone_notifications" ADD CONSTRAINT "alert_zone_notifications_trigger_id_alert_zone_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."alert_zone_triggers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_zone_triggers" ADD CONSTRAINT "alert_zone_triggers_zone_id_alert_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."alert_zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_alert_subscriptions" ADD CONSTRAINT "user_alert_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_alert_subscriptions" ADD CONSTRAINT "user_alert_subscriptions_zone_id_alert_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."alert_zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alert_zone_notifications_zone_idx" ON "alert_zone_notifications" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "alert_zone_notifications_user_idx" ON "alert_zone_notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "alert_zone_notifications_sent_idx" ON "alert_zone_notifications" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "alert_zone_triggers_zone_idx" ON "alert_zone_triggers" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "alert_zone_triggers_triggered_idx" ON "alert_zone_triggers" USING btree ("triggered_at");--> statement-breakpoint
CREATE INDEX "alert_zone_triggers_notified_idx" ON "alert_zone_triggers" USING btree ("is_notified");--> statement-breakpoint
CREATE INDEX "user_alert_subscriptions_user_idx" ON "user_alert_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_alert_subscriptions_zone_idx" ON "user_alert_subscriptions" USING btree ("zone_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_alert_subscriptions_unique_idx" ON "user_alert_subscriptions" USING btree ("user_id","zone_id");--> statement-breakpoint
CREATE INDEX "alert_zones_location_idx" ON "alert_zones" USING btree ("lat","lng");