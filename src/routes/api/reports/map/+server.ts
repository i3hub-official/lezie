// src/routes/api/reports/map/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { reports, categories, statuses } from '$lib/server/db/schema';
import { eq, gte, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
  const dateRange = url.searchParams.get('dateRange') ?? 'week';

  const cutoffMap: Record<string, number> = {
    day:   1  * 86400000,
    week:  7  * 86400000,
    month: 30 * 86400000,
  };

  const cutoff = new Date(Date.now() - (cutoffMap[dateRange] ?? cutoffMap.week));

  const rows = await db
    .select({
      id:           reports.id,
      title:        reports.title,
      description:  reports.description,
      severity:     reports.severity,
      location:     reports.location,
      locationName: reports.locationName,
      isAnonymous:  reports.isAnonymous,
      createdAt:    reports.createdAt,
      categoryName: categories.name,
      statusName:   statuses.name,
    })
    .from(reports)
    .innerJoin(categories, eq(reports.categoryId, categories.id))
    .innerJoin(statuses,   eq(reports.statusId,   statuses.id))
    .where(gte(reports.createdAt, cutoff))
    .orderBy(desc(reports.createdAt))
    .limit(100);

  const mapped = rows
    .map(r => {
      const loc = r.location as { lat?: number; lng?: number } | null;
      if (!loc?.lat || !loc?.lng) return null;
      return {
        id:          r.id,
        title:       r.title,
        description: r.description,
        category:    r.categoryName.toLowerCase(),
        severity:    r.severity,
        lat:         loc.lat,
        lng:         loc.lng,
        time:        r.createdAt.toISOString(),
        status:      r.statusName.toLowerCase(),
        location:    r.locationName ?? '',
        isLive:      r.severity === 'critical' || r.severity === 'high',
        witnesses:   0, // add a verifications count join here when ready
      };
    })
    .filter(Boolean);

  return json(mapped);
};
