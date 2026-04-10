// src/lib/server/db/schema.ts

import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// ==================== ENUMS ====================

export const userTierEnum = pgEnum('user_tier', ['1', '2', '3', '4']);
export const kycStatusEnum = pgEnum('kyc_status', ['pending', 'verified', 'rejected']);
export const verificationStatusEnum = pgEnum('verification_status', ['unverified', 'community-verified', 'authority-verified']);
export const severityEnum = pgEnum('severity', ['low', 'medium', 'high', 'critical']);
export const reportStatusEnum = pgEnum('report_status', ['reported', 'investigating', 'resolved', 'false_report']);
export const notificationTypeEnum = pgEnum('notification_type', ['alert', 'verification', 'system']);
export const flagTypeEnum = pgEnum('flag_type', ['travel_anomaly', 'multiple_reports', 'suspicious_pattern']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'audio']);

// ==================== TABLES WITH INDEXES ====================

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  tier: userTierEnum('tier').default('1').notNull(),
  trustScore: integer('trust_score').default(0).notNull(),
  kycStatus: kycStatusEnum('kyc_status').default('pending').notNull(),
  kycData: jsonb('kyc_data'),
  refreshToken: varchar('refresh_token', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  lastActive: timestamp('last_active').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  uniqueIndex('users_email_idx').on(table.email).where(sql`${table.email} IS NOT NULL`),
  uniqueIndex('users_phone_idx').on(table.phone).where(sql`${table.phone} IS NOT NULL`),
  uniqueIndex('users_refresh_token_idx').on(table.refreshToken).where(sql`${table.refreshToken} IS NOT NULL`),
  index('users_tier_idx').on(table.tier),
  index('users_kyc_status_idx').on(table.kycStatus),
  index('users_trust_score_idx').on(table.trustScore),
  index('users_is_active_idx').on(table.isActive),
  index('users_last_active_idx').on(table.lastActive),
  index('users_created_at_idx').on(table.createdAt),
  index('users_active_tier_idx').on(table.isActive, table.tier),
]);

// User profiles
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  bio: text('bio'),
  location: jsonb('location'),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  dateOfBirth: timestamp('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  // user_profiles_user_id_idx removed — .unique() on userId already creates this index
  index('user_profiles_name_idx').on(table.firstName, table.lastName),
  index('user_profiles_city_idx').on(table.city),
  index('user_profiles_country_idx').on(table.country),
  // GIN index for jsonb location queries
  index('user_profiles_location_idx').using('gin', table.location),
]);

// Categories
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }).notNull(),
  color: varchar('color', { length: 20 }).default('#3b82f6'),
  defaultSeverity: severityEnum('default_severity').default('medium').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('categories_is_active_idx').on(table.isActive),
  index('categories_default_severity_idx').on(table.defaultSeverity),
]);

// Statuses
export const statuses = pgTable('statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 20 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('statuses_is_active_idx').on(table.isActive),
]);

// Reports
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  statusId: uuid('status_id').references(() => statuses.id).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  location: jsonb('location').notNull(),
  locationName: varchar('location_name', { length: 255 }),
  address: text('address'),
  severity: severityEnum('severity').default('medium').notNull(),
  verificationStatus: verificationStatusEnum('verification_status').default('unverified').notNull(),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('reports_user_id_idx').on(table.userId),
  index('reports_category_id_idx').on(table.categoryId),
  index('reports_status_id_idx').on(table.statusId),
  index('reports_severity_idx').on(table.severity),
  index('reports_verification_status_idx').on(table.verificationStatus),
  index('reports_is_anonymous_idx').on(table.isAnonymous),
  index('reports_created_at_idx').on(table.createdAt),
  index('reports_updated_at_idx').on(table.updatedAt),
  index('reports_severity_created_idx').on(table.severity, table.createdAt),
  index('reports_status_created_idx').on(table.statusId, table.createdAt),
  index('reports_category_severity_idx').on(table.categoryId, table.severity),
  // GIN index for jsonb location queries
  index('reports_location_idx').using('gin', table.location),
  // Full-text search indexes
  index('reports_title_search_idx').using('gin', sql`to_tsvector('english', ${table.title})`),
  index('reports_description_search_idx').using('gin', sql`to_tsvector('english', ${table.description})`),
]);

// Report Media
export const reportMedia = pgTable('report_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  mediaType: mediaTypeEnum('media_type').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  size: integer('size'),
  mimeType: varchar('mime_type', { length: 100 }),
  metadata: jsonb('metadata'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  index('report_media_report_id_idx').on(table.reportId),
  index('report_media_user_id_idx').on(table.userId),
  index('report_media_media_type_idx').on(table.mediaType),
  index('report_media_is_verified_idx').on(table.isVerified),
  index('report_media_created_at_idx').on(table.createdAt),
  index('report_media_report_media_idx').on(table.reportId, table.mediaType),
]);

// Comments
export const reportComments = pgTable('report_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  comment: text('comment').notNull(),
  isOfficial: boolean('is_official').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('report_comments_report_id_idx').on(table.reportId),
  index('report_comments_user_id_idx').on(table.userId),
  index('report_comments_is_official_idx').on(table.isOfficial),
  index('report_comments_created_at_idx').on(table.createdAt),
  index('report_comments_report_created_idx').on(table.reportId, table.createdAt),
]);

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  // notifications_user_id_idx removed — notifications_user_unread_idx leads with userId
  index('notifications_type_idx').on(table.type),
  index('notifications_is_read_idx').on(table.isRead),
  index('notifications_created_at_idx').on(table.createdAt),
  index('notifications_user_unread_idx').on(table.userId, table.isRead, table.createdAt),
  index('notifications_user_type_idx').on(table.userId, table.type),
]);

// User Preferences
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  alertRadius: integer('alert_radius').default(5).notNull(),
  quietHoursEnabled: boolean('quiet_hours_enabled').default(false).notNull(),
  quietHoursStart: varchar('quiet_hours_start', { length: 5 }),
  quietHoursEnd: varchar('quiet_hours_end', { length: 5 }),
  notifyCritical: boolean('notify_critical').default(true).notNull(),
  notifyHigh: boolean('notify_high').default(true).notNull(),
  notifyMedium: boolean('notify_medium').default(true).notNull(),
  notifyLow: boolean('notify_low').default(false).notNull(),
  language: varchar('language', { length: 10 }).default('en'),
  theme: varchar('theme', { length: 20 }).default('light'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  // user_preferences_user_id_idx removed — .unique() on userId already creates this index
  index('user_preferences_language_idx').on(table.language),
]);

// Identity Flags
export const identityFlags = pgTable('identity_flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  flagType: flagTypeEnum('flag_type').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  resolved: boolean('resolved').default(false).notNull(),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  index('identity_flags_user_id_idx').on(table.userId),
  index('identity_flags_flag_type_idx').on(table.flagType),
  // identity_flags_resolved_idx removed — superseded by identity_flags_user_resolved_idx
  // Restore if you query WHERE resolved = false without a userId filter
  index('identity_flags_created_at_idx').on(table.createdAt),
  index('identity_flags_user_resolved_idx').on(table.userId, table.resolved),
  index('identity_flags_type_created_idx').on(table.flagType, table.createdAt),
]);

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(),
  targetId: uuid('target_id').notNull(),
  changes: jsonb('changes'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  index('audit_logs_admin_id_idx').on(table.adminId),
  index('audit_logs_action_idx').on(table.action),
  index('audit_logs_target_type_idx').on(table.targetType),
  index('audit_logs_target_id_idx').on(table.targetId),
  index('audit_logs_created_at_idx').on(table.createdAt),
  index('audit_logs_admin_created_idx').on(table.adminId, table.createdAt),
  index('audit_logs_target_lookup_idx').on(table.targetType, table.targetId),
  index('audit_logs_action_created_idx').on(table.action, table.createdAt),
]);

// Sessions
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 500 }).notNull(),
  deviceInfo: jsonb('device_info'),
  ipAddress: varchar('ip_address', { length: 45 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActive: timestamp('last_active').defaultNow().notNull()
}, (table) => [
  uniqueIndex('sessions_token_idx').on(table.token),
  // sessions_user_id_idx removed — sessions_user_active_idx leads with userId
  index('sessions_expires_at_idx').on(table.expiresAt),
  index('sessions_last_active_idx').on(table.lastActive),
  index('sessions_user_active_idx').on(table.userId, table.lastActive),
  index('sessions_cleanup_idx').on(table.expiresAt, table.userId),
]);

// Saved Locations
export const savedLocations = pgTable('saved_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  location: jsonb('location').notNull(),
  address: text('address'),
  isHome: boolean('is_home').default(false),
  isWork: boolean('is_work').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('saved_locations_user_id_idx').on(table.userId),
  // saved_locations_is_home_idx removed — saved_locations_user_home_idx covers it
  // saved_locations_is_work_idx removed — saved_locations_user_work_idx covers it
  index('saved_locations_user_home_idx').on(table.userId, table.isHome),
  index('saved_locations_user_work_idx').on(table.userId, table.isWork),
  // GIN index for jsonb location queries
  index('saved_locations_location_idx').using('gin', table.location),
]);

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  preferences: one(userPreferences),
  reports: many(reports),
  comments: many(reportComments),
  media: many(reportMedia),
  notifications: many(notifications),
  sessions: many(sessions),
  identityFlags: many(identityFlags),
  savedLocations: many(savedLocations)
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id]
  }),
  category: one(categories, {
    fields: [reports.categoryId],
    references: [categories.id]
  }),
  status: one(statuses, {
    fields: [reports.statusId],
    references: [statuses.id]
  }),
  media: many(reportMedia),
  comments: many(reportComments)
}));