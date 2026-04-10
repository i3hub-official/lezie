

// src/lib/server/services/profileService.ts
//
// All reads and writes to userProfiles / users that touch PII go through here.
// Better Auth owns: email, phone, username (encrypted in auth-schema).
// This module owns everything else that lives in the app schema.

import { db } from '$lib/server/db';
import { users, userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import {
  protectName,
  protectText,
  protectDateOfBirth,
  protectKycData,
  revealName,
  revealText,
  revealDateOfBirth,
  revealKycData,
} from '$lib/security/dataProtection';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ProfileInput {
  firstName?:  string;
  lastName?:   string;
  bio?:        string;
  address?:    string;
  city?:       string;
  country?:    string;
  dateOfBirth?: string; // ISO-8601 YYYY-MM-DD
  avatarUrl?:  string;  // URL — not PII, stored plaintext
}

export interface ProfileOutput {
  id:          string;
  userId:      string;
  firstName?:  string | null;
  lastName?:   string | null;
  bio?:        string | null;
  address?:    string | null;
  city?:       string | null;
  country?:    string | null;
  dateOfBirth?: string | null;
  avatarUrl?:  string | null;
  createdAt:   Date;
  updatedAt:   Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Encrypt — called on write
// ─────────────────────────────────────────────────────────────────────────────

function encryptProfileFields(input: ProfileInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (input.firstName  !== undefined) out.firstName  = input.firstName  ? protectName(input.firstName)        : null;
  if (input.lastName   !== undefined) out.lastName   = input.lastName   ? protectName(input.lastName)         : null;
  if (input.bio        !== undefined) out.bio        = input.bio        ? protectText(input.bio)               : null;
  if (input.address    !== undefined) out.address    = input.address    ? protectText(input.address)           : null;
  if (input.city       !== undefined) out.city       = input.city       ? protectText(input.city)              : null;
  if (input.country    !== undefined) out.country    = input.country    ? protectText(input.country)           : null;
  if (input.dateOfBirth !== undefined) out.dateOfBirth = input.dateOfBirth ? protectDateOfBirth(input.dateOfBirth) : null;

  // avatarUrl is a URL, not PII — pass through plaintext
  if (input.avatarUrl  !== undefined) out.avatarUrl  = input.avatarUrl ?? null;

  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Decrypt — called on read
// ─────────────────────────────────────────────────────────────────────────────

function decryptProfileRow(row: Record<string, any>): ProfileOutput {
  return {
    id:          row.id,
    userId:      row.userId,
    firstName:   row.firstName   ? revealName(row.firstName)        : null,
    lastName:    row.lastName    ? revealName(row.lastName)          : null,
    bio:         row.bio         ? revealText(row.bio)               : null,
    address:     row.address     ? revealText(row.address)           : null,
    city:        row.city        ? revealText(row.city)              : null,
    country:     row.country     ? revealText(row.country)           : null,
    dateOfBirth: row.dateOfBirth ? revealDateOfBirth(row.dateOfBirth) : null,
    avatarUrl:   row.avatarUrl   ?? null,
    createdAt:   row.createdAt,
    updatedAt:   row.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/** Read and decrypt a user's profile. Returns null if not found. */
export async function getProfile(userId: string): Promise<ProfileOutput | null> {
  const rows = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId as any))
    .limit(1);

  if (!rows.length) return null;
  return decryptProfileRow(rows[0]);
}

/** Update profile fields — only supplied fields are written. */
export async function updateProfile(
  userId: string,
  input: ProfileInput
): Promise<ProfileOutput | null> {
  const encrypted = encryptProfileFields(input);

  if (!Object.keys(encrypted).length) return getProfile(userId);

  const rows = await db
    .update(userProfiles)
    .set({ ...encrypted, updatedAt: new Date() })
    .where(eq(userProfiles.userId, userId as any))
    .returning();

  if (!rows.length) return null;
  return decryptProfileRow(rows[0]);
}

// ─────────────────────────────────────────────────────────────────────────────
// KYC data (lives on users table, not userProfiles)
// ─────────────────────────────────────────────────────────────────────────────

/** Write encrypted KYC payload to users.kycData */
export async function setKycData(userId: string, data: object): Promise<void> {
  await db
    .update(users)
    .set({ kycData: protectKycData(data) as any, updatedAt: new Date() })
    .where(eq(users.id, userId as any));
}

/** Read and decrypt users.kycData. Returns null if not set. */
export async function getKycData<T = object>(userId: string): Promise<T | null> {
  const rows = await db
    .select({ kycData: users.kycData })
    .from(users)
    .where(eq(users.id, userId as any))
    .limit(1);

  if (!rows.length || !rows[0].kycData) return null;
  return revealKycData<T>(rows[0].kycData as string);
}