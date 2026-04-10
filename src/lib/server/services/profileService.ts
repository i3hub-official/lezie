// All reads and writes to userProfiles / users that touch PII go through here.
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
  firstName?:   string;
  lastName?:    string;
  bio?:         string;
  address?:     string;
  city?:        string;
  country?:     string;
  dateOfBirth?: string; // ISO-8601 YYYY-MM-DD
  avatarUrl?:   string; // Plaintext URL
}

export interface ProfileOutput {
  id:           string;
  userId:       string;
  firstName:    string | null;
  lastName:     string | null;
  bio:          string | null;
  address:      string | null;
  city:         string | null;
  country:      string | null;
  dateOfBirth:  string | null;
  avatarUrl:    string | null;
  createdAt:    Date;
  updatedAt:    Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Private Helpers
// ─────────────────────────────────────────────────────────────────────────────

function encryptProfileFields(input: ProfileInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (input.firstName   !== undefined) out.firstName   = input.firstName   ? protectName(input.firstName)        : null;
  if (input.lastName    !== undefined) out.lastName    = input.lastName    ? protectName(input.lastName)         : null;
  if (input.bio         !== undefined) out.bio         = input.bio         ? protectText(input.bio)               : null;
  if (input.address     !== undefined) out.address     = input.address     ? protectText(input.address)           : null;
  if (input.city        !== undefined) out.city        = input.city        ? protectText(input.city)              : null;
  if (input.country     !== undefined) out.country     = input.country     ? protectText(input.country)           : null;
  if (input.dateOfBirth !== undefined) out.dateOfBirth = input.dateOfBirth ? protectDateOfBirth(input.dateOfBirth) : null;
  if (input.avatarUrl   !== undefined) out.avatarUrl   = input.avatarUrl ?? null;

  return out;
}

function decryptProfileRow(row: any): ProfileOutput {
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
    avatarUrl:   row.avatarUrl,
    createdAt:   row.createdAt,
    updatedAt:   row.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Profile API
// ─────────────────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<ProfileOutput | null> {
  const [row] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  return row ? decryptProfileRow(row) : null;
}

export async function updateProfile(
  userId: string,
  input: ProfileInput
): Promise<ProfileOutput | null> {
  const encrypted = encryptProfileFields(input);

  if (Object.keys(encrypted).length === 0) {
    return getProfile(userId);
  }

  const [row] = await db
    .update(userProfiles)
    .set({ ...encrypted, updatedAt: new Date() })
    .where(eq(userProfiles.userId, userId))
    .returning();

  return row ? decryptProfileRow(row) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// KYC Data (Authenticated AES-256-GCM)
// ─────────────────────────────────────────────────────────────────────────────

/** * Write encrypted KYC payload. 
 * Note: protectKycData now requires userId to bind the data.
 */
export async function setKycData(userId: string, data: object): Promise<void> {
  const encrypted = protectKycData(data, userId);
  
  await db
    .update(users)
    .set({ kycData: encrypted, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/** * Read and decrypt KYC payload. 
 * revealKycData now requires the userId to verify the AAD (Context Binding).
 */
export async function getKycData<T = object>(userId: string): Promise<T | null> {
  const [row] = await db
    .select({ kycData: users.kycData })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!row?.kycData) return null;

  try {
    return revealKycData<T>(row.kycData as string, userId);
  } catch (err) {
    // If decryption fails, it usually means tampering or wrong ownerId
    console.error(`Security Alert: Failed to decrypt KYC data for user ${userId}`, err);
    return null;
  }
}
