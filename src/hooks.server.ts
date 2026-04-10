import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';

// ==================== RATE LIMITER ====================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  '/login':   { max: 10,  windowMs: 60_000 },
  '/signup':  { max: 5,   windowMs: 60_000 },
  '/api':     { max: 100, windowMs: 60_000 },
};

function getRateLimit(pathname: string) {
  for (const [path, rule] of Object.entries(RATE_LIMIT_RULES)) {
    if (pathname === path || pathname.startsWith(path + '/')) return rule;
  }
  return null;
}

function checkRateLimit(ip: string, pathname: string): boolean {
  const rule = getRateLimit(pathname);
  if (!rule) return true;
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= rule.max;
}

// ==================== MIDDLEWARE HANDLERS ====================

const requestLogging: Handle = async ({ event, resolve }) => {
  const start = Date.now();
  const response = await resolve(event);
  const ms = Date.now() - start;
  console.log(`[${response.status}] ${event.request.method} ${event.url.pathname} — ${ms}ms`);
  return response;
};

const rateLimiting: Handle = async ({ event, resolve }) => {
  let ip: string;
  try {
    ip = event.getClientAddress();
  } catch {
    ip = '127.0.0.1'; // Termux/Local Dev Fallback
  }

  if (!checkRateLimit(ip, event.url.pathname)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return resolve(event);
};

const securityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
};

const authSession: Handle = async ({ event, resolve }) => {
  // CRITICAL: Better Auth handler for API routes
  if (event.url.pathname.startsWith('/api/auth')) {
    return auth.handler(event.request);
  }

  const session = await auth.api.getSession({ headers: event.request.headers });
  if (session) {
    event.locals.user = session.user;
    event.locals.session = session.session;
  } else {
    event.locals.user = null;
    event.locals.session = null;
  }

  return resolve(event);
};

const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  if (event.url.pathname.startsWith('/dashboard')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
  return response;
};

// ==================== EXPORT ====================
export const handle: Handle = sequence(
  requestLogging,
  rateLimiting,
  securityHeaders,
  authSession,
  cacheControl
);
