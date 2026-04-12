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
// Better Auth owns these tables entirely.
// Do NOT add custom encryption columns here — that belongs in schema.ts.
// Emails are stored in PLAINTEXT so Better Auth can query/validate them.

export const authUsers = pgTable('user', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull(),          // plaintext — Better Auth owns this
  emailVerified: boolean('email_verified').notNull().default(false),
  image:         text('image'),
  username:      text('username'),
  phoneNumber:   text('phone_number'),
  pin:           text('pin'),
  createdAt:     timestamp('created_at').notNull(),
  updatedAt:     timestamp('updated_at').notNull(),
}, (table) => [
  uniqueIndex('auth_users_email_idx').on(table.email),
  uniqueIndex('auth_users_username_idx').on(table.username),
  uniqueIndex('auth_users_phone_idx').on(table.phoneNumber),
]);

export const sessions = pgTable('session', {
  id:          text('id').primaryKey(),
  expiresAt:   timestamp('expires_at').notNull(),
  token:       text('token').notNull(),
  createdAt:   timestamp('created_at').notNull(),
  updatedAt:   timestamp('updated_at').notNull(),
  ipAddress:   text('ip_address'),
  userAgent:   text('user_agent'),
  userId:      text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
}, (table) => [
  uniqueIndex('auth_sessions_token_idx').on(table.token),
  index('auth_sessions_user_id_idx').on(table.userId),
  index('auth_sessions_expires_at_idx').on(table.expiresAt),
]);

export const accounts = pgTable('account', {
  id:                    text('id').primaryKey(),
  accountId:             text('account_id').notNull(),
  providerId:            text('provider_id').notNull(),
  userId:                text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
  accessToken:           text('access_token'),
  refreshToken:          text('refresh_token'),
  idToken:               text('id_token'),
  accessTokenExpiresAt:  timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope:                 text('scope'),
  password:              text('password'),
  createdAt:             timestamp('created_at').notNull(),
  updatedAt:             timestamp('updated_at').notNull(),
}, (table) => [
  index('auth_accounts_user_id_idx').on(table.userId),
  index('auth_accounts_provider_id_idx').on(table.providerId),
  uniqueIndex('auth_accounts_provider_account_idx').on(table.providerId, table.accountId),
]);

export const verifications = pgTable('verification', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expires_at').notNull(),
  createdAt:  timestamp('created_at'),
  updatedAt:  timestamp('updated_at'),
}, (table) => [
  index('auth_verifications_identifier_idx').on(table.identifier),
  index('auth_verifications_expires_at_idx').on(table.expiresAt),
]);

export const rateLimits = pgTable('rate_limit', {
  id:          text('id').primaryKey(),
  key:         text('key').notNull(),
  count:       text('count').notNull(),
  lastRequest: timestamp('last_request').notNull(),
  createdAt:   timestamp('created_at').notNull(),
  updatedAt:   timestamp('updated_at').notNull(),
}, (table) => [
  uniqueIndex('auth_rate_limit_key_idx').on(table.key),
]);
