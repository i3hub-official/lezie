import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// ==================== 1. RATE LIMITER ====================
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  '/signin':   { max: 10, windowMs: 60_000 },
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
 * LOGGING: Only active in Dev (Termux/Local)
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
 * AUTHENTICATION: Powered by Better Auth
 */
const authSession: Handle = async ({ event, resolve }) => {
  /**
   * 1. The svelteKitHandler handles all /api/auth/* requests automatically.
   * It takes care of CSRF, cookies, and provider redirects.
   */
  return svelteKitHandler({
    event,
    resolve,
    auth,
    onSessionResolve: async (session) => {
      // Pass the session into locals for use in +page.server.ts and +layout.server.ts
      event.locals.user = session?.user ?? null;
      event.locals.session = session?.session ?? null;

      const path = event.url.pathname;

      // 2. AUTH GUARD: Protect dashboard and app sub-routes
      const isProtectedRoute = [
        '/dashboard',
        '/alerts',
        '/map',
        '/report',
        '/incident',
        '/community',
        '/profile',
        '/settings'
      ].some(route => path.startsWith(route));

      if (isProtectedRoute && !event.locals.session) {
        if (dev) console.log(`[AUTH] 🛡️ Redirecting guest to /signin`);
        throw redirect(303, '/signin');
      }

      // 3. LOGGED-IN REDIRECT: Prevent authenticated users from seeing auth forms
      const isAuthForm = path === '/signin' || path === '/signup' || path === '/';
      if (event.locals.session && isAuthForm) {
        throw redirect(303, '/dashboard');
      }
    }
  });
};

/**
 * RATE LIMITING
 */
const rateLimiting: Handle = async ({ event, resolve }) => {
  let ip = '127.0.0.1';
  try { ip = event.getClientAddress(); } catch { /* Termux/Proxy fallback */ }

  if (!checkRateLimit(ip, event.url.pathname)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return resolve(event);
};

/**
 * CACHE CONTROL: Security header to prevent caching sensitive data
 */
const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  // Prevent browser from caching dashboard data or API responses
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
