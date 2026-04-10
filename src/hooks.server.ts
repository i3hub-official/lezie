import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';

// ==================== 1. RATE LIMITER ====================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  '/signin': { max: 10, windowMs: 60_000 },
  '/signup': { max: 5,  windowMs: 60_000 },
  '/api':    { max: 100, windowMs: 60_000 },
};

function checkRateLimit(ip: string, pathname: string): boolean {
  const rule = Object.entries(RATE_LIMIT_RULES).find(([path]) => pathname.startsWith(path))?.[1];
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

// ==================== 2. MIDDLEWARE HANDLERS ====================

/**
 * LOGGING: Monitor request performance in Dev
 */
const requestLogging: Handle = async ({ event, resolve }) => {
  const start = Date.now();
  const response = await resolve(event);
  if (dev) {
    const ms = Date.now() - start;
    const icon = response.status >= 400 ? '❌' : '✅';
    console.log(`${icon} [${response.status}] ${event.request.method} ${event.url.pathname} — ${ms}ms`);
  }
  return response;
};

/**
 * RATE LIMITING: Prevent brute force on auth endpoints
 */
const rateLimiting: Handle = async ({ event, resolve }) => {
  let ip = '127.0.0.1';
  try { ip = event.getClientAddress(); } catch { /* Termux fallback */ }

  if (!checkRateLimit(ip, event.url.pathname)) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return resolve(event);
};

/**
 * AUTHENTICATION & SECURITY
 * Handles: Better Auth API, session resolve, route protection, session expiry
 */
const authSession: Handle = async ({ event, resolve }) => {
  // 1. Let Better Auth handle its own API routes
  if (event.url.pathname.startsWith('/api/auth')) {
    return auth.handler(event.request);
  }

  // 2. Resolve session
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  const path = event.url.pathname;
  const now  = Date.now();

  if (session) {
    const expiresAt = new Date(session.session.expiresAt).getTime();

    if (now > expiresAt) {
      // Session expired
      if (dev) console.warn(`[AUTH] 🕒 Expired session for user: ${session.user.id}`);
      event.locals.user    = null;
      event.locals.session = null;

      if (path.startsWith('/dashboard')) {
        throw redirect(303, '/signin?error=session_expired');
      }
    } else {
      // Session valid
      event.locals.user    = session.user;
      event.locals.session = session.session;
    }
  } else {
    event.locals.user    = null;
    event.locals.session = null;
  }

  // 3. Protected route guard
  const protectedPaths = [
    '/dashboard', '/alerts', '/map', '/report',
    '/incident', '/safety-quest'
  ];
  const isProtectedRoute = protectedPaths.some(p => path.startsWith(p));

  if (isProtectedRoute && !event.locals.session) {
    if (dev) console.log(`[AUTH] 🛡️ Guest blocked from ${path}`);
    throw redirect(303, '/signin');
  }

  // 4. Prevent logged-in users from hitting auth pages
  if (event.locals.session && (path === '/signin' || path === '/signup')) {
    throw redirect(303, '/dashboard');
  }

  return resolve(event);
};

/**
 * CACHE CONTROL: Prevent sensitive pages from being cached
 */
const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  if (path.startsWith('/dashboard') || path.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  return response;
};

// ==================== 3. FINAL SEQUENCE ====================
export const handle: Handle = sequence(
  requestLogging,
  rateLimiting,
  authSession,
  cacheControl
);