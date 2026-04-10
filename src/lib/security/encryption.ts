import { env } from '$env/dynamic/private';
import crypto from 'crypto';

/**
 * Helper to convert hex env strings to Buffers at runtime.
 * Fail-fast logic ensures we don't encrypt with undefined keys.
 */
function getBufferFromEnv(name: string, bytes: number): Buffer {
  const raw = env[name];
  if (!raw) {
    throw new Error(`CRITICAL: Environment variable ${name} is missing.`);
  }
  const buf = Buffer.from(raw, 'hex');
  if (buf.length !== bytes) {
    throw new Error(`${name} must be ${bytes} bytes (hex len: ${bytes * 2}). Got ${raw.length}`);
  }
  return buf;
}

// Versioning allows for smooth key rotation in the future
const VERSION_PREFIX = 'v1';

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1: Searchable Deterministic (AES-256-CBC)
// ─────────────────────────────────────────────────────────────────────────────
export type SearchableField = 'email' | 'phone' | 'username' | 'nin' | 'bvn';

export function encryptSearchable(data: string, field: SearchableField): string {
  if (!data) return '';
  const key = getBufferFromEnv('ENCRYPTION_KEY', 32);
  const iv = getBufferFromEnv(`FIXED_IV_${field.toUpperCase()}`, 16);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  
  return `${VERSION_PREFIX}:${encrypted.toString('hex')}`;
}

export function decryptSearchable(payload: string, field: SearchableField): string {
  if (!payload) return '';
  const [version, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported encryption version');

  const key = getBufferFromEnv('ENCRYPTION_KEY', 32);
  const iv = getBufferFromEnv(`FIXED_IV_${field.toUpperCase()}`, 16);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 2: Random IV (AES-256-CBC)
// ─────────────────────────────────────────────────────────────────────────────
export function encryptField(data: string): string {
  if (!data) return '';
  const key = getBufferFromEnv('ENCRYPTION_KEY', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  
  return `${VERSION_PREFIX}:${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptField(payload: string): string {
  if (!payload) return '';
  const [version, ivHex, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported encryption version');

  const key = getBufferFromEnv('ENCRYPTION_KEY', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(ivHex, 'hex'));
  
  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 3: Authenticated GCM with Context Binding (AAD)
// ─────────────────────────────────────────────────────────────────────────────
export function encryptSecure(data: string, contextId: string): string {
  if (!data) return '';
  const key = getBufferFromEnv('ENCRYPTION_KEY', 32);
  const iv = crypto.randomBytes(12); // GCM standard
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(contextId)); 
  
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return `${VERSION_PREFIX}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSecure(payload: string, contextId: string): string {
  if (!payload) return '';
  const [version, ivHex, tagHex, encHex] = payload.split(':');
  if (version !== 'v1') throw new Error('Unsupported encryption version');

  const key = getBufferFromEnv('ENCRYPTION_KEY', 32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
  
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  decipher.setAAD(Buffer.from(contextId));

  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH HASH (HMAC-SHA512)
// ─────────────────────────────────────────────────────────────────────────────
export function generateSearchHash(input: string, context: string): string {
  const pepper = env.SEARCH_HASH_PEPPER;
  if (!pepper || pepper.length < 32) throw new Error('SEARCH_HASH_PEPPER insecure or missing');

  return crypto
    .createHmac('sha512', pepper)
    .update(`${context}:${input}`)
    .digest('hex');
}
