// src/routes/api/reports/[id]/like/+server.ts
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reports } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST({ params, locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const reportId = parseInt(params.id);

  await db.update(reports)
    .set({ likeCount: sql`${reports.likeCount} + 1` })
    .where(eq(reports.id, reportId));

  return json({ success: true });
}