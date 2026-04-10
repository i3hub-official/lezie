// src/lib/security/encryption.ts
import { env } from '$env/dynamic/private';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// ENV VALIDATION — Fail fast
// ─────────────────────────────────────────────────────────────────────────────


function mustHexEnvFrom(raw: string | undefined, bytes: number): Buffer {
  if (!raw) throw new Error(`ENV is missing`);
  if (raw.length !== bytes * 2)
    throw new Error(`ENV must be ${bytes * 2} hex chars`);
  const buf = Buffer.from(raw, 'hex');
  if (buf.length !== bytes) throw new Error(`Invalid hex`);
  return buf;
}
// Master AES-256 key — never changes without full re-encryption
const ENCRYPTION_KEY = mustHexEnvFrom(env.ENCRYPTION_KEY, 32);

// Fixed IVs per field type — prevents cross-field linkability
const FIXED_IV = {
  email:    mustHexEnv('FIXED_IV_EMAIL',    16),
  phone:    mustHexEnv('FIXED_IV_PHONE',    16),
  username: mustHexEnv('FIXED_IV_USERNAME', 16),
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
function assertValidHex(str: string, field: string): void {
  if (!str || str.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(str)) {
    throw new Error(
      `Corrupted encrypted data [${field}]. ` +
      `Expected valid hex. Got "${str?.slice(0, 50)}..." (len: ${str?.length || 0})`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1: Searchable Deterministic Encryption (AES-256-CBC + Fixed IV)
// Use for: email, phone, username — fields you need to search/lookup
// Same plaintext → same ciphertext per field type (enables WHERE queries)
// ─────────────────────────────────────────────────────────────────────────────
export type SearchableField = 'email' | 'phone' | 'username';

export function encryptSearchable(data: string, field: SearchableField): string {
  const iv = FIXED_IV[field];
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return encrypted.toString('hex');
}

export function decryptSearchable(encryptedData: string, field: SearchableField): string {
  assertValidHex(encryptedData, `${field}`);
  const iv = FIXED_IV[field];
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  return (
    decipher.update(Buffer.from(encryptedData, 'hex'), undefined, 'utf8') +
    decipher.final('utf8')
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 2: Random-IV Encryption (AES-256-CBC)
// Use for: name, firstName, lastName, address, city, country, dateOfBirth
// Not searchable — different ciphertext each time
// ─────────────────────────────────────────────────────────────────────────────
export function encryptField(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptField(encryptedData: string): string {
  const sep = encryptedData.indexOf(':');
  if (sep === -1) throw new Error('Invalid encrypted field format');
  const ivHex  = encryptedData.slice(0, sep);
  const encHex = encryptedData.slice(sep + 1);
  assertValidHex(ivHex,  'IV');
  assertValidHex(encHex, 'Encrypted');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    ENCRYPTION_KEY,
    Buffer.from(ivHex, 'hex')
  );
  return (
    decipher.update(Buffer.from(encHex, 'hex'), undefined, 'utf8') +
    decipher.final('utf8')
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 3: AES-256-GCM — Authenticated Encryption
// Use for: kycData jsonb, any tamper-sensitive blob
// ─────────────────────────────────────────────────────────────────────────────
export function encryptSecure(data: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSecure(encryptedData: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) throw new Error('Invalid GCM format: expected iv:authTag:encrypted');
  const [ivHex, authTagHex, encHex] = parts;
  assertValidHex(ivHex,      'GCM IV');
  assertValidHex(authTagHex, 'GCM AuthTag');
  assertValidHex(encHex,     'GCM Encrypted');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    ENCRYPTION_KEY,
    Buffer.from(ivHex, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  return (
    decipher.update(Buffer.from(encHex, 'hex'), undefined, 'utf8') +
    decipher.final('utf8')
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCHABLE HASH — For indexed lookup without decryption
// Use for: login resolver (find user by email/phone/username)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateSearchHash(
  input: string,
  context: SearchableField
): Promise<string> {
  const pepper = process.env.SEARCH_HASH_PEPPER;
  if (!pepper || pepper.length < 32)
    throw new Error('SEARCH_HASH_PEPPER must be ≥32 chars');

  const encoder = new TextEncoder();
  const data = encoder.encode(`${context.toLowerCase()}::${input.trim()}::${pepper}`);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}