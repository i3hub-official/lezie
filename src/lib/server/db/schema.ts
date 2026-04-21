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
import { nanoid } from 'nanoid';
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
export const alertZoneStatusEnum = pgEnum('alert_zone_status', ['active', 'inactive']);


// ==================== TABLES WITH INDEXES ====================

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()), // NanoID from Better Auth

  // ── Encrypted PII (AES-256-CBC, random-IV) ──────────────────────────────
  // Plaintext never stored here. Better Auth stores plaintext in authUsers.
  email:        varchar('email',    { length: 500 }),  // encrypted
  phone:        varchar('phone',    { length: 500 }),  // encrypted
  username:     varchar('username', { length: 500 }),  // encrypted

  // ── Search hashes (SHA-512 + pepper) ────────────────────────────────────
  // Used for lookups — no PII exposed. Unique constraints live here.
  emailHash:    text('email_hash'),
  phoneHash:    text('phone_hash'),
  usernameHash: text('username_hash'),

  passwordHash: varchar('password_hash', { length: 255 }),
  tier:         userTierEnum('tier').default('1').notNull(),
  trustScore:   integer('trust_score').default(0).notNull(),
  kycStatus:    kycStatusEnum('kyc_status').default('pending').notNull(),
  kycData:      jsonb('kyc_data'),
  refreshToken: varchar('refresh_token', { length: 255 }),
  isActive:     boolean('is_active').default(true).notNull(),
  lastActive:   timestamp('last_active').defaultNow().notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
  hashable:     text('hashable'), // For auth relations
}, (table) => [
  // Unique constraints on hash columns — deterministic, no PII in index
  uniqueIndex('users_email_hash_idx').on(table.emailHash).where(sql`${table.emailHash} IS NOT NULL`),
  uniqueIndex('users_phone_hash_idx').on(table.phoneHash).where(sql`${table.phoneHash} IS NOT NULL`),
  uniqueIndex('users_username_hash_idx').on(table.usernameHash).where(sql`${table.usernameHash} IS NOT NULL`),
  index('users_tier_idx').on(table.tier),
  index('users_created_at_idx').on(table.createdAt),
]);

// User profiles
export const userProfiles = pgTable('user_profiles', {
  id:        text('id').primaryKey().$defaultFn(() => nanoid()),
  userId:    text('user_id').references(() => users.id).notNull().unique(),

  // ── Encrypted fields (Tier 2 random-IV) ────────────────────────────────
  firstName: varchar('first_name', { length: 255 }),   // encrypted
  lastName:  varchar('last_name',  { length: 400 }),   // encrypted
  bio:       text('bio'),                               // encrypted
  address:   text('address'),                           // encrypted (full street address)
  homeAddress: text('home_address'),                    // encrypted (home/saved location)
  city:      varchar('city',    { length: 255 }),       // encrypted
  state:     varchar('state',   { length: 255 }),       // encrypted
  country:   varchar('country', { length: 255 }),       // encrypted

  // ── Media (Cloudinary URLs — not PII, stored plaintext) ────────────────
  avatarUrl:    varchar('avatar_url',    { length: 500 }),
  coverUrl:     varchar('cover_url',     { length: 500 }),
  avatarPublicId: varchar('avatar_public_id', { length: 255 }), // Cloudinary public_id for deletion
  coverPublicId:  varchar('cover_public_id',  { length: 255 }),

  // ── KYC identity fields (encrypted, once-verified locks) ───────────────
  nin:         varchar('nin',  { length: 500 }),        // encrypted National ID
  bvn:         varchar('bvn',  { length: 500 }),        // encrypted Bank Verification Number
  ninVerified: boolean('nin_verified').default(false).notNull(),
  bvnVerified: boolean('bvn_verified').default(false).notNull(),
  ninSubmittedAt: timestamp('nin_submitted_at'),
  bvnSubmittedAt: timestamp('bvn_submitted_at'),

  // ── Non-encrypted fields ────────────────────────────────────────────────
  dateOfBirth:  timestamp('date_of_birth'),
  location:     jsonb('location'),              // { lat, lng } for map features
  socialLinks:  jsonb('social_links'),          // { twitter, linkedin, instagram }
  username:     varchar('username', { length: 255 }), // plaintext — set-once, indexed
  usernameSetAt: timestamp('username_set_at'), // non-null = locked, cannot change

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('user_profiles_name_idx').on(table.firstName, table.lastName),
  uniqueIndex('user_profiles_username_idx').on(table.username).where(sql`${table.username} IS NOT NULL`),
]);

// User Preferences
export const userPreferences = pgTable('user_preferences', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id).notNull().unique(),
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
  userId: text('user_id').references(() => users.id),
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
  userId: text('user_id').references(() => users.id).notNull(),
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
  userId: text('user_id').references(() => users.id).notNull(),
  comment: text('comment').notNull(),
  isOfficial: boolean('is_official').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Identity Flags
export const identityFlags = pgTable('identity_flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  flagType: flagTypeEnum('flag_type').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  resolved: boolean('resolved').default(false).notNull(),
  resolvedBy: text('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: text('admin_id').references(() => users.id).notNull(),
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
  userId: text('user_id').references(() => users.id).notNull(),
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
  userId: text('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  location: jsonb('location').notNull(),
  address: text('address'),
  isHome: boolean('is_home').default(false),
  isWork: boolean('is_work').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ==================== ALERT ZONES (UPDATED) ====================

export const alertZones = pgTable('alert_zones', {
  id:                uuid('id').primaryKey().defaultRandom(),
  userId:            text('user_id').references(() => users.id).notNull(),
  name:              varchar('name', { length: 255 }).notNull(),
  radius:            integer('radius').default(2).notNull(),        // km, max 2
  categories:        jsonb('categories').notNull().$type<string[]>(), // ['theft', 'assault', 'fire', etc]
  severity:          jsonb('severity').notNull().$type<string[]>(),   // ['low', 'medium', 'high', 'critical']
  isActive:          boolean('is_active').default(true).notNull(),
  locationLabel:     varchar('location_label', { length: 255 }),
  lat:               text('lat'),                                   // stored as text to avoid float precision issues
  lng:               text('lng'),
  lastTriggered:     timestamp('last_triggered'),
  notificationCount: integer('notification_count').default(0).notNull(),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
  updatedAt:         timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('alert_zones_user_idx').on(table.userId),
  index('alert_zones_active_idx').on(table.isActive),
  index('alert_zones_location_idx').on(table.lat, table.lng),
]);

// Alert Zone Triggers - when a zone is triggered by an incident
export const alertZoneTriggers = pgTable('alert_zone_triggers', {
  id:                uuid('id').primaryKey().defaultRandom(),
  zoneId:            uuid('zone_id').references(() => alertZones.id, { onDelete: 'cascade' }).notNull(),
  incidentId:        uuid('incident_id'),                           // Reference to incidents table
  postId:            uuid('post_id'),                               // Reference to community_posts
  triggerType:       varchar('trigger_type', { length: 50 }).notNull(), // 'incident', 'post', 'report'
  category:          varchar('category', { length: 50 }).notNull(),
  severity:          varchar('severity', { length: 20 }).notNull(),
  message:           text('message'),
  triggeredAt:       timestamp('triggered_at').defaultNow().notNull(),
  isNotified:        boolean('is_notified').default(false).notNull(),
  notifiedAt:        timestamp('notified_at'),
  metadata:          jsonb('metadata').$type<Record<string, any>>(),
}, (table) => [
  index('alert_zone_triggers_zone_idx').on(table.zoneId),
  index('alert_zone_triggers_triggered_idx').on(table.triggeredAt),
  index('alert_zone_triggers_notified_idx').on(table.isNotified),
]);

// User Alert Zone Subscriptions
export const userAlertSubscriptions = pgTable('user_alert_subscriptions', {
  id:                uuid('id').primaryKey().defaultRandom(),
  userId:            text('user_id').references(() => users.id).notNull(),
  zoneId:            uuid('zone_id').references(() => alertZones.id, { onDelete: 'cascade' }).notNull(),
  isActive:          boolean('is_active').default(true).notNull(),
  subscribedAt:      timestamp('subscribed_at').defaultNow().notNull(),
  unsubscribedAt:    timestamp('unsubscribed_at'),
}, (table) => [
  index('user_alert_subscriptions_user_idx').on(table.userId),
  index('user_alert_subscriptions_zone_idx').on(table.zoneId),
  uniqueIndex('user_alert_subscriptions_unique_idx').on(table.userId, table.zoneId),
]);

// Alert Zone Notifications Log
export const alertZoneNotifications = pgTable('alert_zone_notifications', {
  id:                uuid('id').primaryKey().defaultRandom(),
  zoneId:            uuid('zone_id').references(() => alertZones.id, { onDelete: 'cascade' }).notNull(),
  userId:            text('user_id').references(() => users.id).notNull(),
  triggerId:         uuid('trigger_id').references(() => alertZoneTriggers.id, { onDelete: 'cascade' }).notNull(),
  channel:           varchar('channel', { length: 20 }).notNull(), // 'push', 'email', 'sms', 'in_app'
  sentAt:            timestamp('sent_at').defaultNow().notNull(),
  delivered:         boolean('delivered').default(false),
  readAt:            timestamp('read_at'),
  metadata:          jsonb('metadata').$type<Record<string, any>>(),
}, (table) => [
  index('alert_zone_notifications_zone_idx').on(table.zoneId),
  index('alert_zone_notifications_user_idx').on(table.userId),
  index('alert_zone_notifications_sent_idx').on(table.sentAt),
]);


// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ one, many }) => ({
  authUser: one(authUsers, {
    fields: [users.hashable],
    references: [authUsers.id]
  }),
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId]
  }),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId]
  }),
  reports: many(reports),
  comments: many(reportComments),
  media: many(reportMedia),
  notifications: many(notifications),
  sessions: many(sessions),
  identityFlags: many(identityFlags),
  savedLocations: many(savedLocations),
  alertZones: many(alertZones),
  alertSubscriptions: many(userAlertSubscriptions),
  alertNotifications: many(alertZoneNotifications),
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

// ==================== ALERT ZONES RELATIONS ====================

export const alertZonesRelations = relations(alertZones, ({ one, many }) => ({
  user: one(users, {
    fields: [alertZones.userId],
    references: [users.id],
  }),
  triggers: many(alertZoneTriggers),
  subscriptions: many(userAlertSubscriptions),
  notifications: many(alertZoneNotifications),
}));

export const alertZoneTriggersRelations = relations(alertZoneTriggers, ({ one }) => ({
  zone: one(alertZones, {
    fields: [alertZoneTriggers.zoneId],
    references: [alertZones.id],
  }),
}));

export const userAlertSubscriptionsRelations = relations(userAlertSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userAlertSubscriptions.userId],
    references: [users.id],
  }),
  zone: one(alertZones, {
    fields: [userAlertSubscriptions.zoneId],
    references: [alertZones.id],
  }),
}));

export const alertZoneNotificationsRelations = relations(alertZoneNotifications, ({ one }) => ({
  zone: one(alertZones, {
    fields: [alertZoneNotifications.zoneId],
    references: [alertZones.id],
  }),
  user: one(users, {
    fields: [alertZoneNotifications.userId],
    references: [users.id],
  }),
  trigger: one(alertZoneTriggers, {
    fields: [alertZoneNotifications.triggerId],
    references: [alertZoneTriggers.id],
  }),
}));

export const reportMediaRelations = relations(reportMedia, ({ one }) => ({
	report: one(reports, {
		fields: [reportMedia.reportId],
		references: [reports.id]
	}),
	user: one(users, {
		fields: [reportMedia.userId],
		references: [users.id]
	})
}));

export const reportCommentsRelations = relations(reportComments, ({ one }) => ({
	report: one(reports, {
		fields: [reportComments.reportId],
		references: [reports.id]
	}),
	user: one(users, {
		fields: [reportComments.userId],
		references: [users.id]
	})
}));

// ==================== TYPES ====================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type AlertZone = typeof alertZones.$inferSelect;
export type NewAlertZone = typeof alertZones.$inferInsert;
export type AlertZoneTrigger = typeof alertZoneTriggers.$inferSelect;
export type UserAlertSubscription = typeof userAlertSubscriptions.$inferSelect;
export type AlertZoneNotification = typeof alertZoneNotifications.$inferSelect;