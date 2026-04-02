DROP INDEX "reports_location_idx";--> statement-breakpoint
DROP INDEX "saved_locations_location_idx";--> statement-breakpoint
DROP INDEX "user_profiles_location_idx";--> statement-breakpoint
CREATE INDEX "reports_location_idx" ON "reports" USING gist ("location"::text);--> statement-breakpoint
CREATE INDEX "saved_locations_location_idx" ON "saved_locations" USING gist ("location"::text);--> statement-breakpoint
CREATE INDEX "user_profiles_location_idx" ON "user_profiles" USING gist ("location"::text);