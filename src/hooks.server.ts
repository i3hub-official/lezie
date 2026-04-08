import type { Handle } from '@sveltejs/kit';
import { handleAuth } from '@better-auth/core';
import { sequence } from '@sveltejs/kit/hooks';

const cacheHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  const url = event.url.pathname;

  const noCachePaths = [
    '/dashboard',
    '/signup',
    '/login',
    '/report',
    '/profile',
    '/settings',
    '/contact',
    '/safety-guidelines',
    '/faq'
  ];

  if (noCachePaths.some(path => url === path || url.startsWith(path + '/'))) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } 
  else if (url === '/' || url === '/home') {
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );
  } 
  else {
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600'
    );
  }

  return response;
};

// Wrap caching handle and Better Auth together
export const handle: Handle = sequence(
  handleAuth({
    // Optional Better Auth hooks
    onLogin: async ({ user }) => {
      console.log('User logged in:', user.id);
    },
    onLogout: async ({ session }) => {
      console.log('User logged out');
    }
  }),
  cacheHandle
);