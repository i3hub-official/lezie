// src/lib/server/db/auth-schema.ts


import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  index,
  uniqueIndex 
} from 'drizzle-orm/pg-core';

// ==================== BETTER AUTH TABLES ====================

// Users table (Better Auth core)
export const authUsers = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
}, (table) => [
  uniqueIndex('auth_users_email_idx').on(table.email)
]);

// Sessions table
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' })
}, (table) => [
  uniqueIndex('sessions_token_idx').on(table.token),
  index('sessions_user_id_idx').on(table.userId),
  index('sessions_expires_at_idx').on(table.expiresAt)
]);

// Accounts table (for OAuth providers)
export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'), // For email/password accounts
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
}, (table) => [
  index('accounts_user_id_idx').on(table.userId),
  index('accounts_provider_id_idx').on(table.providerId),
  uniqueIndex('accounts_provider_account_idx').on(table.providerId, table.accountId)
]);

// Verifications table (for email verification, password reset)
export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
}, (table) => [
  index('verifications_identifier_idx').on(table.identifier),
  index('verifications_expires_at_idx').on(table.expiresAt)
]);

// Rate limiting table (optional, for Better Auth rate limiting)
export const rateLimits = pgTable('rate_limit', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  count: text('count').notNull(),
  lastRequest: timestamp('last_request').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
}, (table) => [
  uniqueIndex('rate_limit_key_idx').on(table.key)
]);