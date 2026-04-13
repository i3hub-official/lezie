CREATE TYPE "public"."alert_zone_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."flag_type" AS ENUM('travel_anomaly', 'multiple_reports', 'suspicious_pattern');--> statement-breakpoint
CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('alert', 'verification', 'system');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('reported', 'investigating', 'resolved', 'false_report');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."user_tier" AS ENUM('1', '2', '3', '4');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('unverified', 'community-verified', 'authority-verified');--> statement-breakpoint
CREATE TYPE "public"."discussion_category" AS ENUM('general', 'safety', 'alerts', 'questions', 'success');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('workshop', 'meeting', 'training', 'social', 'other');--> statement-breakpoint
CREATE TYPE "public"."follow_status" AS ENUM('pending', 'accepted');--> statement-breakpoint
CREATE TYPE "public"."post_category" AS ENUM('general', 'safety', 'alerts', 'questions', 'success');--> statement-breakpoint
CREATE TYPE "public"."post_scope" AS ENUM('global', 'local');--> statement-breakpoint
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
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" text NOT NULL,
	"action" varchar(100) NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"target_id" uuid NOT NULL,
	"changes" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(50) NOT NULL,
	"color" varchar(20) DEFAULT '#3b82f6',
	"default_severity" "severity" DEFAULT 'medium' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "identity_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"flag_type" "flag_type" NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb,
	"resolved" boolean DEFAULT false NOT NULL,
	"resolved_by" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"comment" text NOT NULL,
	"is_official" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"media_type" "media_type" NOT NULL,
	"url" varchar(500) NOT NULL,
	"thumbnail_url" varchar(500),
	"size" integer,
	"mime_type" varchar(100),
	"metadata" jsonb,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"category_id" uuid NOT NULL,
	"status_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"location" jsonb NOT NULL,
	"location_name" varchar(255),
	"address" text,
	"severity" "severity" DEFAULT 'medium' NOT NULL,
	"verification_status" "verification_status" DEFAULT 'unverified' NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" jsonb NOT NULL,
	"address" text,
	"is_home" boolean DEFAULT false,
	"is_work" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"token" varchar(500) NOT NULL,
	"device_info" jsonb,
	"ip_address" varchar(45),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"alert_radius" integer DEFAULT 5 NOT NULL,
	"quiet_hours_enabled" boolean DEFAULT false NOT NULL,
	"quiet_hours_start" varchar(5),
	"quiet_hours_end" varchar(5),
	"notify_critical" boolean DEFAULT true NOT NULL,
	"notify_high" boolean DEFAULT true NOT NULL,
	"notify_medium" boolean DEFAULT true NOT NULL,
	"notify_low" boolean DEFAULT false NOT NULL,
	"language" varchar(10) DEFAULT 'en',
	"theme" varchar(20) DEFAULT 'light',
	"data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(400),
	"avatar_url" varchar(500),
	"bio" text,
	"location" jsonb,
	"address" text,
	"city" varchar(255),
	"country" varchar(255),
	"date_of_birth" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(500),
	"phone" varchar(500),
	"username" varchar(500),
	"email_hash" text,
	"phone_hash" text,
	"username_hash" text,
	"password_hash" varchar(255),
	"tier" "user_tier" DEFAULT '1' NOT NULL,
	"trust_score" integer DEFAULT 0 NOT NULL,
	"kyc_status" "kyc_status" DEFAULT 'pending' NOT NULL,
	"kyc_data" jsonb,
	"refresh_token" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"username" text,
	"phone_number" text,
	"pin" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" text NOT NULL,
	"last_request" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "community_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" text,
	"content" text NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_discussion_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discussion_id" uuid NOT NULL,
	"user_id" text,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_discussions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"title" varchar(300) NOT NULL,
	"body" text NOT NULL,
	"category" "discussion_category" DEFAULT 'general' NOT NULL,
	"scope" "post_scope" DEFAULT 'global' NOT NULL,
	"lat" real,
	"lng" real,
	"location_name" varchar(255),
	"is_sticky" boolean DEFAULT false NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_event_attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"title" varchar(300) NOT NULL,
	"description" text NOT NULL,
	"category" "event_category" DEFAULT 'other' NOT NULL,
	"location" varchar(255) NOT NULL,
	"lat" real,
	"lng" real,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"max_attendees" integer,
	"attendee_count" integer DEFAULT 0 NOT NULL,
	"is_cancelled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_post_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"content" text NOT NULL,
	"category" "post_category" DEFAULT 'general' NOT NULL,
	"scope" "post_scope" DEFAULT 'global' NOT NULL,
	"lat" real,
	"lng" real,
	"location_name" varchar(255),
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"share_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" text NOT NULL,
	"followed_id" text NOT NULL,
	"status" "follow_status" DEFAULT 'accepted' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alert_zones" ADD CONSTRAINT "alert_zones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_flags" ADD CONSTRAINT "identity_flags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_flags" ADD CONSTRAINT "identity_flags_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_comments" ADD CONSTRAINT "report_comments_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_comments" ADD CONSTRAINT "report_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_media" ADD CONSTRAINT "report_media_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_media" ADD CONSTRAINT "report_media_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_locations" ADD CONSTRAINT "saved_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_discussion_replies" ADD CONSTRAINT "community_discussion_replies_discussion_id_community_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."community_discussions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_discussion_replies" ADD CONSTRAINT "community_discussion_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_discussions" ADD CONSTRAINT "community_discussions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_event_attendees" ADD CONSTRAINT "community_event_attendees_event_id_community_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."community_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_event_attendees" ADD CONSTRAINT "community_event_attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_events" ADD CONSTRAINT "community_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followed_id_users_id_fk" FOREIGN KEY ("followed_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alert_zones_user_idx" ON "alert_zones" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "alert_zones_active_idx" ON "alert_zones" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_profiles_name_idx" ON "user_profiles" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_hash_idx" ON "users" USING btree ("email_hash") WHERE "users"."email_hash" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_hash_idx" ON "users" USING btree ("phone_hash") WHERE "users"."phone_hash" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_hash_idx" ON "users" USING btree ("username_hash") WHERE "users"."username_hash" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "users_tier_idx" ON "users" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "auth_accounts_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_accounts_provider_id_idx" ON "account" USING btree ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_accounts_provider_account_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_users_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_users_username_idx" ON "user" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_users_phone_idx" ON "user" USING btree ("phone_number");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_rate_limit_key_idx" ON "rate_limit" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_sessions_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "auth_sessions_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_sessions_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "auth_verifications_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "auth_verifications_expires_at_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "community_comments_post_id_idx" ON "community_comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "community_comments_user_id_idx" ON "community_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_comments_created_at_idx" ON "community_comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "community_discussion_replies_discussion_id_idx" ON "community_discussion_replies" USING btree ("discussion_id");--> statement-breakpoint
CREATE INDEX "community_discussion_replies_user_id_idx" ON "community_discussion_replies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_discussions_user_id_idx" ON "community_discussions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_discussions_category_idx" ON "community_discussions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "community_discussions_last_activity_idx" ON "community_discussions" USING btree ("last_activity_at");--> statement-breakpoint
CREATE INDEX "community_discussions_sticky_idx" ON "community_discussions" USING btree ("is_sticky");--> statement-breakpoint
CREATE UNIQUE INDEX "community_event_attendees_unique" ON "community_event_attendees" USING btree ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "community_event_attendees_event_id_idx" ON "community_event_attendees" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "community_event_attendees_user_id_idx" ON "community_event_attendees" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_events_user_id_idx" ON "community_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_events_starts_at_idx" ON "community_events" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "community_events_category_idx" ON "community_events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "community_events_location_idx" ON "community_events" USING btree ("lat","lng");--> statement-breakpoint
CREATE UNIQUE INDEX "community_post_likes_unique" ON "community_post_likes" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "community_post_likes_post_id_idx" ON "community_post_likes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "community_post_likes_user_id_idx" ON "community_post_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_posts_user_id_idx" ON "community_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_posts_category_idx" ON "community_posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "community_posts_scope_idx" ON "community_posts" USING btree ("scope");--> statement-breakpoint
CREATE INDEX "community_posts_created_at_idx" ON "community_posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "community_posts_location_idx" ON "community_posts" USING btree ("lat","lng");--> statement-breakpoint
CREATE UNIQUE INDEX "user_follows_unique" ON "user_follows" USING btree ("follower_id","followed_id");--> statement-breakpoint
CREATE INDEX "user_follows_follower_id_idx" ON "user_follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "user_follows_followed_id_idx" ON "user_follows" USING btree ("followed_id");