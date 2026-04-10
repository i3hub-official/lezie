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

/**
 * Users table (Better Auth core)
 *
 * Encryption strategy
 * ───────────────────
 * Tier 1 — Deterministic (AES-256-CBC + fixed IV, same plaintext → same ciphertext):
 *   email, username, phoneNumber
 *   → unique indexes sit on the *hash* columns, not the encrypted columns,
 *     because the hash is what the login resolver queries against.
 *
 * Tier 2 — Random-IV (AES-256-CBC, different ciphertext every write):
 *   name, image (URL — low sensitivity, but encrypted for consistency)
 *
 * Plaintext / Better Auth-managed:
 *   id, emailVerified, pin (Better Auth hashes pin internally), createdAt, updatedAt
 */
export const authUsers = pgTable('user', {
  id:            text('id').primaryKey(),

  // ── Tier 2: random-IV encrypted ─────────────────────────────────────────
  name:          text('name').notNull(),           // protectName()  on write, revealName()  on read
  image:         text('image'),                    // protectText()  on write, revealText()  on read

  // ── Tier 1: deterministic encrypted ─────────────────────────────────────
  // Unique constraint lives on the corresponding *Hash column below.
  email:         text('email').notNull(),          // protectEmail()    → .encrypted
  username:      text('username'),                 // protectUsername() → .encrypted
  phoneNumber:   text('phone_number'),             // protectPhone()    → .encrypted

  // ── Search-hash columns (SHA-512 + pepper, no PII) ──────────────────────
  // Written by protectEmail/Username/Phone → .searchHash.
  // Queried by the login resolver via searchHashFor().
  emailHash:     text('email_hash').notNull(),
  usernameHash:  text('username_hash'),
  phoneHash:     text('phone_hash'),

  // ── Better Auth-managed / not encrypted ─────────────────────────────────
  emailVerified: boolean('email_verified').notNull().default(false),
  pin:           text('pin'),                      // Better Auth hashes this internally
  createdAt:     timestamp('created_at').notNull(),
  updatedAt:     timestamp('updated_at').notNull()

}, (table) => [
  // Unique lookups use the hash columns — deterministic, no PII exposed
  uniqueIndex('auth_users_email_hash_idx').on(table.emailHash),
  uniqueIndex('auth_users_username_hash_idx').on(table.usernameHash),
  uniqueIndex('auth_users_phone_hash_idx').on(table.phoneHash),

  // Non-unique index on encrypted email for any range/sort queries (optional)
  index('auth_users_email_idx').on(table.email),
]);

// ==================== UNCHANGED TABLES ====================
// No PII in sessions, accounts, verifications, or rate_limit —
// encryption is not applied to these tables.

// Sessions table
export const sessions = pgTable('session', {
  id:          text('id').primaryKey(),
  expiresAt:   timestamp('expires_at').notNull(),
  token:       text('token').notNull(),
  createdAt:   timestamp('created_at').notNull(),
  updatedAt:   timestamp('updated_at').notNull(),
  ipAddress:   text('ip_address'),
  userAgent:   text('user_agent'),
  userId:      text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' })
}, (table) => [
  uniqueIndex('auth_sessions_token_idx').on(table.token),
  index('auth_sessions_user_id_idx').on(table.userId),
  index('auth_sessions_expires_at_idx').on(table.expiresAt)
]);

// Accounts table (for OAuth providers)
export const accounts = pgTable('account', {
  id:                     text('id').primaryKey(),
  accountId:              text('account_id').notNull(),
  providerId:             text('provider_id').notNull(),
  userId:                 text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
  accessToken:            text('access_token'),
  refreshToken:           text('refresh_token'),
  idToken:                text('id_token'),
  accessTokenExpiresAt:   timestamp('access_token_expires_at'),
  refreshTokenExpiresAt:  timestamp('refresh_token_expires_at'),
  scope:                  text('scope'),
  password:               text('password'),
  createdAt:              timestamp('created_at').notNull(),
  updatedAt:              timestamp('updated_at').notNull()
}, (table) => [
  index('auth_accounts_user_id_idx').on(table.userId),
  index('auth_accounts_provider_id_idx').on(table.providerId),
  uniqueIndex('auth_accounts_provider_account_idx').on(table.providerId, table.accountId)
]);

// Verifications table (for email verification, password reset)
export const verifications = pgTable('verification', {
  id:          text('id').primaryKey(),
  identifier:  text('identifier').notNull(),
  value:       text('value').notNull(),
  expiresAt:   timestamp('expires_at').notNull(),
  createdAt:   timestamp('created_at'),
  updatedAt:   timestamp('updated_at')
}, (table) => [
  index('auth_verifications_identifier_idx').on(table.identifier),
  index('auth_verifications_expires_at_idx').on(table.expiresAt)
]);

// Rate limiting table
export const rateLimits = pgTable('rate_limit', {
  id:          text('id').primaryKey(),
  key:         text('key').notNull(),
  count:       text('count').notNull(),
  lastRequest: timestamp('last_request').notNull(),
  createdAt:   timestamp('created_at').notNull(),
  updatedAt:   timestamp('updated_at').notNull()
}, (table) => [
  uniqueIndex('auth_rate_limit_key_idx').on(table.key)
]);