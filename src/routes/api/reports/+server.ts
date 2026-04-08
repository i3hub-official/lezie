// src/routes/api/reports/+server.ts
import { json } from '@sveltejs/kit';
import { ReportService } from '$lib/server/services/report.service';
import { auth } from '$lib/server/auth';

export async function POST({ request, cookies }) {
  try {
    // Better Auth expects the session token in a specific way
    const sessionToken = cookies.get('auth_session') || cookies.get('session_token');
    
    if (!sessionToken) {
      return json({ error: 'Unauthorized - No session token' }, { status: 401 });
    }

    // Get session using Better Auth's API
    const session = await auth.api.getSession({
      headers: new Headers({
        'Authorization': `Bearer ${sessionToken}`
      })
    });

    if (!session?.user) {
      return json({ error: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    const data = await request.json();

    // Check if user exists in your app's users table, if not, sync them
    const { users } = await import('$lib/server/db/schema');
    const { db } = await import('$lib/server/db');
    const { eq } = await import('drizzle-orm');
    
    let appUser = await db.select().from(users).where(eq(users.id, session.user.id)).get();
    
    if (!appUser) {
      // Sync the user
      await db.insert(users).values({
        id: session.user.id,
        email: session.user.email,
        tier: '1',
        trustScore: 0,
        kycStatus: 'pending',
        isActive: true,
      });
    }

    const result = await ReportService.createReport({
      userId: session.user.id,
      ...data,
    });

    return json(result);
  } catch (error: any) {
    console.error('Failed to create report:', error);
    return json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}