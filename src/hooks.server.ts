import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';

// ==================== 1. RATE LIMITER ====================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  '/login':   { max: 10, windowMs: 60_000 },
  '/signup':  { max: 5,  windowMs: 60_000 },
  '/api':     { max: 100, windowMs: 60_000 },
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
 * LOGGING: Only active in Dev (Termux)
 */
const requestLogging: Handle = async ({ event, resolve }) => {
  const start = Date.now();
  const response = await resolve(event);
  if (dev) {
    const ms = Date.now() - start;
    const color = response.status >= 400 ? '❌' : '✅';
    console.log(`${color} [${response.status}] ${event.request.method} ${event.url.pathname} — ${ms}ms`);
  }
  return response;
};

/**
 * SECURITY: Authentication & Route Protection
 */
const authSession: Handle = async ({ event, resolve }) => {
  // 1. Better Auth API Handler
  if (event.url.pathname.startsWith('/api/auth')) {
    return auth.handler(event.request);
  }

  // 2. Resolve session
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  // 3. Set Locals for use in load functions/components
  event.locals.user = session?.user ?? null;
  event.locals.session = session?.session ?? null;

  const path = event.url.pathname;

  // 4. AUTH GUARD: Protect dashboard and sub-routes
  const isProtectedRoute = path.startsWith('/dashboard') || 
                           path.startsWith('/profile') || 
                           path.startsWith('/settings') ||
                           path.startsWith('/report');

  if (isProtectedRoute && !event.locals.session) {
    if (dev) console.log(`[AUTH] 🛡️ Blocked guest from ${path}`);
    throw redirect(303, '/login');
  }

  // 5. REDIRECT: Prevent logged-in users from seeing login/signup
  if (event.locals.session && (path === '/login' || path === '/signup')) {
    throw redirect(303, '/dashboard');
  }

  return resolve(event);
};

/**
 * RATE LIMITING
 */
const rateLimiting: Handle = async ({ event, resolve }) => {
  let ip = '127.0.0.1';
  try { ip = event.getClientAddress(); } catch { /* Termux fallback */ }

  if (!checkRateLimit(ip, event.url.pathname)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return resolve(event);
};

/**
 * CACHE CONTROL: Ensure sensitive pages aren't cached by browsers
 */
const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  if (path.startsWith('/dashboard') || path.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
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
