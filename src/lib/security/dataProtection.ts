// src/lib/security/dataProtection.ts
import {
  encryptSearchable,
  decryptSearchable,
  encryptField,
  decryptField,
  encryptSecure,
  decryptSecure,
  generateSearchHash,
  type SearchableField,
} from '$lib/security/encryption';

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────
const normalize = {
  email: (s: string): string =>
    s.trim().toLowerCase().replace(/\s+/g, ''),

  phone: (s: string): string => {
    const digits = s.replace(/[^0-9+]/g, '');
    if (digits.startsWith('234')  && digits.length === 13) return digits;
    if (digits.startsWith('0')    && digits.length === 11) return '234' + digits.slice(1);
    if (digits.startsWith('+234') && digits.length === 14) return digits.slice(1);
    return digits;
  },

  username: (s: string): string =>
    s.trim().toLowerCase().replace(/\s+/g, ''),

  name: (s: string): string =>
    s.trim().replace(/\s+/g, ' ').replace(/\w\S*/g, w =>
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ),

  /** NIN: strip everything except digits, trim whitespace */
  nin: (s: string): string =>
    s.replace(/\D/g, '').trim(),

  /** BVN: strip everything except digits, trim whitespace */
  bvn: (s: string): string =>
    s.replace(/\D/g, '').trim(),

  /** Government IDs (passport, driver's licence, TIN, etc.): uppercase, collapse spaces */
  governmentId: (s: string): string =>
    s.trim().toUpperCase().replace(/\s+/g, ''),

  /** Account numbers: digits only */
  accountNumber: (s: string): string =>
    s.replace(/\D/g, '').trim(),

  /** ISO-8601 date string (YYYY-MM-DD): strip whitespace */
  dateOfBirth: (s: string): string =>
    s.trim(),

  /** General free-text: trim leading/trailing whitespace only */
  general: (s: string): string =>
    s.trim(),
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTECT — Encrypt on write
// ─────────────────────────────────────────────────────────────────────────────

/** Email: searchable (deterministic) + search hash for login resolver */
export async function protectEmail(raw: string) {
  const normal = normalize.email(raw);
  return {
    encrypted:  encryptSearchable(normal, 'email'),
    searchHash: await generateSearchHash(normal, 'email'),
  };
}

/** Phone: searchable (deterministic) + search hash */
export async function protectPhone(raw: string) {
  const normal = normalize.phone(raw);
  return {
    encrypted:  encryptSearchable(normal, 'phone'),
    searchHash: await generateSearchHash(normal, 'phone'),
  };
}

/** Username: searchable (deterministic) + search hash */
export async function protectUsername(raw: string) {
  const normal = normalize.username(raw);
  return {
    encrypted:  encryptSearchable(normal, 'username'),
    searchHash: await generateSearchHash(normal, 'username'),
  };
}

/**
 * NIN (National Identification Number) — Tier 1 searchable.
 * Normalised to digits-only before encryption; produces a search hash
 * so the DB can look up a user by NIN without decrypting.
 */
export async function protectNin(raw: string) {
  const normal = normalize.nin(raw);
  return {
    encrypted:  encryptSearchable(normal, 'nin'),
    searchHash: await generateSearchHash(normal, 'nin'),
  };
}

/**
 * BVN (Bank Verification Number) — Tier 1 searchable.
 * Normalised to digits-only before encryption; produces a search hash
 * so the DB can look up a user by BVN without decrypting.
 */
export async function protectBvn(raw: string) {
  const normal = normalize.bvn(raw);
  return {
    encrypted:  encryptSearchable(normal, 'bvn'),
    searchHash: await generateSearchHash(normal, 'bvn'),
  };
}

/** Name / firstName / lastName: random-IV, not searchable */
export function protectName(raw: string): string {
  return encryptField(normalize.name(raw));
}

/** Address, city, country, bio: random-IV */
export function protectText(raw: string): string {
  return encryptField(raw.trim());
}

/**
 * Government-issued ID string — Tier 2 random-IV, not searchable.
 * Covers: passport number, driver's licence, TIN, CAC RC number, voter ID, etc.
 * Normalised to uppercase. Use protectNin / protectBvn for NIN and BVN
 * (they need deterministic lookup).
 */
export function protectGovernmentId(raw: string): string {
  return encryptField(normalize.governmentId(raw));
}

/**
 * Bank / wallet account number — Tier 2 random-IV, not searchable.
 * Normalised to digits-only.
 */
export function protectAccountNumber(raw: string): string {
  return encryptField(normalize.accountNumber(raw));
}

/**
 * Date of birth — Tier 2 random-IV, not searchable.
 * Store as an ISO-8601 string (YYYY-MM-DD) before calling this.
 */
export function protectDateOfBirth(raw: string): string {
  return encryptField(normalize.dateOfBirth(raw));
}

/**
 * General free-text field — Tier 2 random-IV, not searchable.
 * Use for notes, remarks, descriptions, or any unstructured string
 * that doesn't fit a more specific protect* helper.
 */
export function protectGeneral(raw: string): string {
  return encryptField(normalize.general(raw));
}

/**
 * Sensitive structured blob — Tier 3 GCM authenticated encryption.
 * Use for any object that must be tamper-evident: compliance payloads,
 * document metadata, risk scores, internal flags, etc.
 */
export function protectSensitiveData(raw: object): string {
  return encryptSecure(JSON.stringify(raw));
}

/** kycData jsonb blob: GCM authenticated encryption */
export function protectKycData(raw: object): string {
  return encryptSecure(JSON.stringify(raw));
}

// ─────────────────────────────────────────────────────────────────────────────
// UNPROTECT — Decrypt on read
// ─────────────────────────────────────────────────────────────────────────────

export function revealEmail(encrypted: string): string {
  return decryptSearchable(encrypted, 'email');
}

export function revealPhone(encrypted: string): string {
  return decryptSearchable(encrypted, 'phone');
}

export function revealUsername(encrypted: string): string {
  return decryptSearchable(encrypted, 'username');
}

/** Decrypt a NIN back to its normalised digit string */
export function revealNin(encrypted: string): string {
  return decryptSearchable(encrypted, 'nin');
}

/** Decrypt a BVN back to its normalised digit string */
export function revealBvn(encrypted: string): string {
  return decryptSearchable(encrypted, 'bvn');
}

export function revealName(encrypted: string): string {
  return decryptField(encrypted);
}

export function revealText(encrypted: string): string {
  return decryptField(encrypted);
}

export function revealGovernmentId(encrypted: string): string {
  return decryptField(encrypted);
}

export function revealAccountNumber(encrypted: string): string {
  return decryptField(encrypted);
}

export function revealDateOfBirth(encrypted: string): string {
  return decryptField(encrypted);
}

export function revealGeneral(encrypted: string): string {
  return decryptField(encrypted);
}

export function revealSensitiveData<T = object>(encrypted: string): T {
  return JSON.parse(decryptSecure(encrypted)) as T;
}

export function revealKycData<T = object>(encrypted: string): T {
  return JSON.parse(decryptSecure(encrypted)) as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH HASH LOOKUP — Used in login resolver
// ─────────────────────────────────────────────────────────────────────────────
export async function searchHashFor(
  input: string,
  field: SearchableField
): Promise<string> {
  const normalizers: Record<SearchableField, (s: string) => string> = {
    email:    normalize.email,
    phone:    normalize.phone,
    username: normalize.username,
    nin:      normalize.nin,
    bvn:      normalize.bvn,
  };
  return generateSearchHash(normalizers[field](input), field);
}