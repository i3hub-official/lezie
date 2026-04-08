//api/reports/+server.ts

import { json } from '@sveltejs/kit';
import { ReportService } from '$lib/server/services/report.service';
import { auth } from '$lib/server/auth';

export async function POST({ request, cookies }) {
  try {
    const token = cookies.get('session_token');
    if (!token) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: new Headers({
        authorization: `Bearer ${token}`,
      }),
    });

    if (!session || !session.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const report = await ReportService.createReport({
      userId: session.user.id,
      ...data,
    });
    
    return json(report);
  } catch (error) {
    console.error('Failed to create report:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET({ url }) {
  const lat = parseFloat(url.searchParams.get('lat') || '0');
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const radius = parseFloat(url.searchParams.get('radius') || '5000');
  
  const reports = await ReportService.getNearbyReports(lat, lng, radius);
  return json(reports);
}