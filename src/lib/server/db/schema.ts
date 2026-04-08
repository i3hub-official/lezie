import { sqliteTable, text, integer, blob, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Helper for Boolean in SQLite
const boolean = (name: string) => integer(name, { mode: 'boolean' });

// ==================== CORE USER TABLES ====================

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email'),
  phone: text('phone'),
  passwordHash: text('password_hash'),
  tier: text('tier', { enum: ['1', '2', '3', '4'] }).default('1').notNull(),
  trustScore: integer('trust_score').default(0).notNull(),
  kycStatus: text('kyc_status', { enum: ['pending', 'verified', 'rejected'] }).default('pending').notNull(),
  kycData: text('kyc_data'), // Store as JSON string
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  phoneIdx: uniqueIndex('users_phone_idx').on(table.phone),
}));

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'), // JSON string
  city: text('city'),
  country: text('country'),
});

// ==================== INCIDENT & REPORTING ====================

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon').notNull(),
  color: text('color').default('#3b82f6'),
  isActive: boolean('is_active').default(true).notNull(),
});

export const reports = sqliteTable('reports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  categoryId: text('category_id').references(() => categories.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(), // JSON string
  severity: text('severity', { enum: ['low', 'medium', 'high', 'critical'] }).default('medium').notNull(),
  status: text('status', { enum: ['reported', 'investigating', 'resolved', 'false_report'] }).default('reported').notNull(),
  verificationStatus: text('verification_status', { enum: ['unverified', 'community-verified', 'authority-verified'] }).default('unverified').notNull(),
  
  // AI-AUGMENTED: Native Vector column for incident processing
  embedding: blob('embedding'), 
  
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  severityIdx: index('reports_severity_idx').on(table.severity),
  statusIdx: index('reports_status_idx').on(table.status),
}));

export const reportMedia = sqliteTable('report_media', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  reportId: text('report_id').references(() => reports.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  mediaType: text('media_type', { enum: ['image', 'video', 'audio'] }).notNull(),
  url: text('url').notNull(),
  metadata: text('metadata'), // Storage size, mimeType, etc.
  isVerified: boolean('is_verified').default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ==================== COMMUNITY & SYSTEM ====================

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // alert, verification, system
  title: text('title').notNull(),
  body: text('body').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  adminId: text('admin_id').references(() => users.id).notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  changes: text('changes'), // JSON string
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
