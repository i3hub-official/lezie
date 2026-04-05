CREATE TYPE "public"."flag_type" AS ENUM('travel_anomaly', 'multiple_reports', 'suspicious_pattern');--> statement-breakpoint
CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('alert', 'verification', 'system');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('reported', 'investigating', 'resolved', 'false_report');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."user_tier" AS ENUM('1', '2', '3', '4');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('unverified', 'community-verified', 'authority-verified');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
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
	"name" varchar(100) NOT NULL,
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
	"user_id" uuid NOT NULL,
	"flag_type" "flag_type" NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb,
	"resolved" boolean DEFAULT false NOT NULL,
	"resolved_by" uuid,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
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
	"user_id" uuid NOT NULL,
	"comment" text NOT NULL,
	"is_official" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
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
	"user_id" uuid,
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
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
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
	"user_id" uuid NOT NULL,
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
	"name" varchar(50) NOT NULL,
	"description" text,
	"color" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"avatar_url" varchar(500),
	"bio" text,
	"location" jsonb,
	"address" text,
	"city" varchar(100),
	"country" varchar(100),
	"date_of_birth" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
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
DROP TABLE "task" CASCADE;--> statement-breakpoint
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
CREATE INDEX "audit_logs_admin_id_idx" ON "audit_logs" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_target_type_idx" ON "audit_logs" USING btree ("target_type");--> statement-breakpoint
CREATE INDEX "audit_logs_target_id_idx" ON "audit_logs" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_admin_created_idx" ON "audit_logs" USING btree ("admin_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_target_lookup_idx" ON "audit_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_created_idx" ON "audit_logs" USING btree ("action","created_at");--> statement-breakpoint
CREATE INDEX "categories_is_active_idx" ON "categories" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "categories_default_severity_idx" ON "categories" USING btree ("default_severity");--> statement-breakpoint
CREATE INDEX "identity_flags_user_id_idx" ON "identity_flags" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "identity_flags_flag_type_idx" ON "identity_flags" USING btree ("flag_type");--> statement-breakpoint
CREATE INDEX "identity_flags_resolved_idx" ON "identity_flags" USING btree ("resolved");--> statement-breakpoint
CREATE INDEX "identity_flags_created_at_idx" ON "identity_flags" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "identity_flags_user_resolved_idx" ON "identity_flags" USING btree ("user_id","resolved");--> statement-breakpoint
CREATE INDEX "identity_flags_type_created_idx" ON "identity_flags" USING btree ("flag_type","created_at");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notifications_is_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "notifications_user_unread_idx" ON "notifications" USING btree ("user_id","is_read","created_at");--> statement-breakpoint
CREATE INDEX "notifications_user_type_idx" ON "notifications" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "report_comments_report_id_idx" ON "report_comments" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "report_comments_user_id_idx" ON "report_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "report_comments_is_official_idx" ON "report_comments" USING btree ("is_official");--> statement-breakpoint
CREATE INDEX "report_comments_created_at_idx" ON "report_comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "report_comments_report_created_idx" ON "report_comments" USING btree ("report_id","created_at");--> statement-breakpoint
CREATE INDEX "report_media_report_id_idx" ON "report_media" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "report_media_user_id_idx" ON "report_media" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "report_media_media_type_idx" ON "report_media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "report_media_is_verified_idx" ON "report_media" USING btree ("is_verified");--> statement-breakpoint
CREATE INDEX "report_media_created_at_idx" ON "report_media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "report_media_report_media_idx" ON "report_media" USING btree ("report_id","media_type");--> statement-breakpoint
CREATE INDEX "reports_user_id_idx" ON "reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reports_category_id_idx" ON "reports" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "reports_status_id_idx" ON "reports" USING btree ("status_id");--> statement-breakpoint
CREATE INDEX "reports_severity_idx" ON "reports" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "reports_verification_status_idx" ON "reports" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "reports_is_anonymous_idx" ON "reports" USING btree ("is_anonymous");--> statement-breakpoint
CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "reports_severity_created_idx" ON "reports" USING btree ("severity","created_at");--> statement-breakpoint
CREATE INDEX "reports_status_created_idx" ON "reports" USING btree ("status_id","created_at");--> statement-breakpoint
CREATE INDEX "reports_category_severity_idx" ON "reports" USING btree ("category_id","severity");--> statement-breakpoint
CREATE INDEX "reports_location_idx" ON "reports" USING gist ("location"::geography);--> statement-breakpoint
CREATE INDEX "reports_title_search_idx" ON "reports" USING gin (to_tsvector('english', "title"));--> statement-breakpoint
CREATE INDEX "reports_description_search_idx" ON "reports" USING gin (to_tsvector('english', "description"));--> statement-breakpoint
CREATE INDEX "saved_locations_user_id_idx" ON "saved_locations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_locations_is_home_idx" ON "saved_locations" USING btree ("is_home");--> statement-breakpoint
CREATE INDEX "saved_locations_is_work_idx" ON "saved_locations" USING btree ("is_work");--> statement-breakpoint
CREATE INDEX "saved_locations_user_home_idx" ON "saved_locations" USING btree ("user_id","is_home");--> statement-breakpoint
CREATE INDEX "saved_locations_user_work_idx" ON "saved_locations" USING btree ("user_id","is_work");--> statement-breakpoint
CREATE INDEX "saved_locations_location_idx" ON "saved_locations" USING gist ("location"::geography);--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "sessions_last_active_idx" ON "sessions" USING btree ("last_active");--> statement-breakpoint
CREATE INDEX "sessions_user_active_idx" ON "sessions" USING btree ("user_id","last_active");--> statement-breakpoint
CREATE INDEX "sessions_cleanup_idx" ON "sessions" USING btree ("expires_at","user_id");--> statement-breakpoint
CREATE INDEX "statuses_is_active_idx" ON "statuses" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_preferences_language_idx" ON "user_preferences" USING btree ("language");--> statement-breakpoint
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profiles_name_idx" ON "user_profiles" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX "user_profiles_city_idx" ON "user_profiles" USING btree ("city");--> statement-breakpoint
CREATE INDEX "user_profiles_country_idx" ON "user_profiles" USING btree ("country");--> statement-breakpoint
CREATE INDEX "user_profiles_location_idx" ON "user_profiles" USING gist ("location"::geography);--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email") WHERE "users"."email" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_idx" ON "users" USING btree ("phone") WHERE "users"."phone" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_refresh_token_idx" ON "users" USING btree ("refresh_token") WHERE "users"."refresh_token" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "users_tier_idx" ON "users" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "users_kyc_status_idx" ON "users" USING btree ("kyc_status");--> statement-breakpoint
CREATE INDEX "users_trust_score_idx" ON "users" USING btree ("trust_score");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_last_active_idx" ON "users" USING btree ("last_active");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_active_tier_idx" ON "users" USING btree ("is_active","tier");