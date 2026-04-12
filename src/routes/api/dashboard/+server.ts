// src/routes/api/dashboard/+server.ts
// Returns all data the dashboard home needs in a single request:
//   - stats (totalReports, verifiedReports, activeAlerts, safetyScore)
//   - recentIncidents (last 5, joined with category + status)
//   - notifications (last 5 for this user)
//
// Auth is already resolved by hooks.server.ts — we read event.locals directly.
// No second getSession() call needed.

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
  reports, categories, statuses,
  notifications as notificationsTable,
  alertZones,
} from '$lib/server/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
  // hooks.server.ts already validated + set this — if null, hook redirected to /signin
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorised.');

  // ── All queries in parallel ───────────────────────────────────────────────
  const [
    allReportsResult,
    verifiedReportsResult,
    activeAlertsResult,
    recentIncidentsRows,
    notificationRows,
  ] = await Promise.all([

    // Total reports by this user
    db
      .select({ count: count() })
      .from(reports)
      .where(eq(reports.userId, userId)),

    // Community-verified reports by this user
    db
      .select({ count: count() })
      .from(reports)
      .where(and(
        eq(reports.userId, userId),
        eq(reports.verificationStatus, 'community-verified')
      )),

    // Active alert zones for this user
    db
      .select({ count: count() })
      .from(alertZones)
      .where(and(
        eq(alertZones.userId, userId),
        eq(alertZones.isActive, true)
      )),

    // Last 5 reports across all users (community feed), joined with category + status
    db
      .select({
        id:                 reports.id,
        title:              reports.title,
        severity:           reports.severity,
        location:           reports.location,
        locationName:       reports.locationName,
        createdAt:          reports.createdAt,
        isAnonymous:        reports.isAnonymous,
        verificationStatus: reports.verificationStatus,
        categoryName:       categories.name,
        statusName:         statuses.name,
      })
      .from(reports)
      .innerJoin(categories, eq(reports.categoryId, categories.id))
      .innerJoin(statuses,   eq(reports.statusId,   statuses.id))
      .orderBy(desc(reports.createdAt))
      .limit(5),

    // Last 5 notifications for this user (read + unread)
    db
      .select({
        id:        notificationsTable.id,
        type:      notificationsTable.type,
        body:      notificationsTable.body,
        isRead:    notificationsTable.isRead,
        createdAt: notificationsTable.createdAt,
      })
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(5),
  ]);

  // ── Compute stats ──────────────────────────────────────────────────────────
  const totalReports    = Number(allReportsResult[0]?.count    ?? 0);
  const verifiedReports = Number(verifiedReportsResult[0]?.count ?? 0);
  const activeAlerts    = Number(activeAlertsResult[0]?.count  ?? 0);

  // Safety score = (verified / total) * 100, defaults to 0 with no reports
  const safetyScore = totalReports > 0
    ? Math.round((verifiedReports / totalReports) * 100)
    : 0;

  // ── Shape recent incidents ─────────────────────────────────────────────────
  const recentIncidents = recentIncidentsRows.map(r => {
    const loc = r.location as { lat?: number; lng?: number } | null;
    return {
      id:       r.id,
      title:    r.title,
      category: r.categoryName.toLowerCase(),
      severity: r.severity,
      time:     r.createdAt.toISOString(),
      location: r.locationName
        ?? (loc?.lat ? `${loc.lat.toFixed(4)}, ${loc.lng?.toFixed(4)}` : 'Unknown location'),
      status:   r.statusName.toLowerCase(),
    };
  });

  // ── Shape notifications ────────────────────────────────────────────────────
  // Map DB enum → template keys the dashboard already uses:
  //   'verification' → 'success'
  //   'system'       → 'info'
  //   'alert'        → 'alert'  (unchanged)
  const typeMap: Record<string, string> = {
    verification: 'success',
    system:       'info',
    alert:        'alert',
  };

  const notifications = notificationRows.map(n => ({
    id:      n.id,
    type:    typeMap[n.type] ?? 'info',
    message: n.body,
    time:    n.createdAt.toISOString(),
    read:    n.isRead,
  }));

  return json({
    stats: {
      totalReports,
      verifiedReports,
      activeAlerts,
      safetyScore,
      communityMembers: 0,  // TODO: add total active users count
      pendingReviews:   0,  // TODO: add pending status count
    },
    recentIncidents,
    notifications,
  });
};
