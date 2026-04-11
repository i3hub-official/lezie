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
import { authUsers } from './auth-schema';

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
  id: text('id').primaryKey(), // NanoID from Better Auth
  hashable: text('hashable').references(() => authUsers.id).unique(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 255 }),
  username: varchar('username', { length: 255 }),
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
  uniqueIndex('users_username_idx').on(table.username).where(sql`${table.username} IS NOT NULL`),
  index('users_tier_idx').on(table.tier),
  index('users_created_at_idx').on(table.createdAt),
]);

// User profiles
export const userProfiles = pgTable('user_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull().unique(), // Changed to text
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 400 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  bio: text('bio'),
  location: jsonb('location'),
  address: text('address'),
  city: varchar('city', { length: 255 }),
  country: varchar('country', { length: 255 }),
  dateOfBirth: timestamp('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
  index('user_profiles_name_idx').on(table.firstName, table.lastName),
]);

// Categories
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }).notNull(),
  color: varchar('color', { length: 20 }).default('#3b82f6'),
  defaultSeverity: severityEnum('default_severity').default('medium').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Statuses
export const statuses = pgTable('statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 20 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Reports
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id), // Changed to text
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
});

// Report Media
export const reportMedia = pgTable('report_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(), // Changed to text
  mediaType: mediaTypeEnum('media_type').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  size: integer('size'),
  mimeType: varchar('mime_type', { length: 100 }),
  metadata: jsonb('metadata'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Comments
export const reportComments = pgTable('report_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(), // Changed to text
  comment: text('comment').notNull(),
  isOfficial: boolean('is_official').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(), // Changed to text
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// User Preferences
export const userPreferences = pgTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull().unique(), // Changed to text
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
});

// Identity Flags
export const identityFlags = pgTable('identity_flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(), // Changed to text
  flagType: flagTypeEnum('flag_type').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  resolved: boolean('resolved').default(false).notNull(),
  resolvedBy: text('resolved_by').references(() => users.id), // Changed to text
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: text('admin_id').references(() => users.id).notNull(), // Changed to text
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(),
  targetId: uuid('target_id').notNull(),
  changes: jsonb('changes'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Sessions
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(), // Changed to text
  token: varchar('token', { length: 500 }).notNull(),
  deviceInfo: jsonb('device_info'),
  ipAddress: varchar('ip_address', { length: 45 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActive: timestamp('last_active').defaultNow().notNull()
}, (table) => [
  uniqueIndex('sessions_token_idx').on(table.token),
]);

// Saved Locations
export const savedLocations = pgTable('saved_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(), // Changed to text
  name: varchar('name', { length: 255 }).notNull(),
  location: jsonb('location').notNull(),
  address: text('address'),
  isHome: boolean('is_home').default(false),
  isWork: boolean('is_work').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ one, many }) => ({
  authUser: one(authUsers, {
    fields: [users.hashable],
    references: [authUsers.id]
  }),
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
