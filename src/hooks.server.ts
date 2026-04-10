import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { dev } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const authMiddleware: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({
		event,
		resolve,
		auth,
		onSessionResolve: async (session) => {
			// Populate locals so they are available in +page.server.ts
			event.locals.session = session?.session ?? null;
			event.locals.user = session?.user ?? null;

			const path = event.url.pathname;

			// 1. Auth Guard: Protect the dashboard
			if (path.startsWith("/dashboard") && !session) {
				throw redirect(303, "/signin");
			}

			// 2. Prevent logged-in users from seeing signin/signup
			if (session && (path === "/signin" || path === "/signup")) {
				throw redirect(303, "/dashboard");
			}
		},
	});
};

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
 * LOGGING: Dev-only request monitoring
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
 * AUTHENTICATION: Better Auth SvelteKit Handler
 */
const authSession: Handle = async ({ event, resolve }) => {
  return svelteKitHandler({
    event,
    resolve,
    auth,
    onSessionResolve: async (session) => {
      // 1. Critical: Populate Locals
      event.locals.user = session?.user ?? null;
      event.locals.session = session?.session ?? null;

      const path = event.url.pathname;

      if (dev) {
        console.log(`[AUTH:DEBUG] Path: ${path} | Session: ${!!session}`);
      }

      // 2. Define Protected Routes
      const protectedPaths = [
        '/dashboard',
        '/alerts',
        '/map',
        '/report',
        '/community',
        '/profile',
        '/settings'
      ];

      const isProtectedRoute = protectedPaths.some(p => path.startsWith(p));

      // 3. AUTH GUARD: Guest attempting to access app
      if (isProtectedRoute && !session) {
        if (dev) console.warn(`[AUTH] 🛡️ Guest blocked from ${path}. Redirecting to /signin`);
        throw redirect(303, '/signin');
      }

      // 4. AUTH REDIRECT: Logged in user attempting to access auth pages
      const authPages = ['/signin', '/signup'];
      if (session && authPages.includes(path)) {
        if (dev) console.log(`[AUTH] 🔄 User active. Redirecting ${path} -> /dashboard`);
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
  try { ip = event.getClientAddress(); } catch { /* Fallback for Termux environment */ }

  if (!checkRateLimit(ip, event.url.pathname)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return resolve(event);
};

/**
 * CACHE CONTROL: Security headers for sensitive content
 */
const cacheControl: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  // Ensure authenticated pages and API responses aren't cached locally
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
