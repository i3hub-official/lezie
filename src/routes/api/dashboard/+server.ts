// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

import { db } from '$lib/server/db';
import {
  users,
  reports,
  reportComments,
  reportMedia,
  notifications,
  savedLocations,
  identityFlags,
  categories,
  statuses,
} from '$lib/server/db/schema';

import { eq, desc, sql, and, count } from 'drizzle-orm';
import { getProfile, getKycData } from '$lib/server/services/profileService';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const userId = locals.user.id;
  if (dev) console.log(`[DASHBOARD] Loading data for user: ${userId}`);

  // ── Profile (non-fatal) ────────────────────────────────────────────────────
  let profile: any = null;
  try {
    profile = await getProfile(userId);
  } catch (err: any) {
    if (dev) console.warn(`[DASHBOARD] Profile error (non-fatal):`, err.message);
  }

  // ── KYC data (non-fatal) ───────────────────────────────────────────────────
  let kycData: any = null;
  try {
    kycData = await getKycData(userId);
  } catch (err: any) {
    if (dev) console.warn(`[DASHBOARD] KYC error (non-fatal):`, err.message);
  }

  try {
    const [
      account,
      recentReports,
      reportSummaryRows,
      commentCount,
      mediaCount,
      unreadCountResult,
      recentNotifications,
      savedLocationsData,
      activeFlags,
    ] = await Promise.all([

      // 1. Account data from users table
      db
        .select({
          tier:        users.tier,
          trustScore:  users.trustScore,
          kycStatus:   users.kycStatus,
          lastActive:  users.lastActive,
          isActive:    users.isActive,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then(r => r[0] ?? null),

      // 2. Recent reports with category + status names
      db
        .select({
          id:                 reports.id,
          title:              reports.title,
          severity:           reports.severity,
          verificationStatus: reports.verificationStatus,
          createdAt:          reports.createdAt,
          categoryName:       categories.name,
          categoryColor:      categories.color,
          statusName:         statuses.name,
          statusColor:        statuses.color,
        })
        .from(reports)
        .leftJoin(categories, eq(reports.categoryId, categories.id))
        .leftJoin(statuses,   eq(reports.statusId,   statuses.id))
        .where(eq(reports.userId, userId))
        .orderBy(desc(reports.createdAt))
        .limit(10)
        .then(rows => rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))),

      // 3. Report severity breakdown
      db
        .select({
          total:    sql<number>`count(*)::int`,
          low:      sql<number>`count(*) filter (where ${reports.severity} = 'low')::int`,
          medium:   sql<number>`count(*) filter (where ${reports.severity} = 'medium')::int`,
          high:     sql<number>`count(*) filter (where ${reports.severity} = 'high')::int`,
          critical: sql<number>`count(*) filter (where ${reports.severity} = 'critical')::int`,
          resolved: sql<number>`count(*) filter (where ${statuses.name} ilike 'resolved')::int`,
        })
        .from(reports)
        .leftJoin(statuses, eq(reports.statusId, statuses.id))
        .where(eq(reports.userId, userId))
        .then(r => r[0] ?? { total: 0, low: 0, medium: 0, high: 0, critical: 0, resolved: 0 }),

      // 4. Total comments on user's reports
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(reportComments)
        .innerJoin(reports, eq(reportComments.reportId, reports.id))
        .where(eq(reports.userId, userId))
        .then(r => r[0]?.count ?? 0),

      // 5. Total media uploads by user
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(reportMedia)
        .where(eq(reportMedia.userId, userId))
        .then(r => r[0]?.count ?? 0),

      // 6. Unread notifications
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
        .then(r => r[0]?.count ?? 0),

      // 7. Recent notifications
      db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(20)
        .then(rows => rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))),

      // 8. Saved locations
      db
        .select()
        .from(savedLocations)
        .where(eq(savedLocations.userId, userId)),

      // 9. Active identity flags
      db
        .select()
        .from(identityFlags)
        .where(and(eq(identityFlags.userId, userId), eq(identityFlags.resolved, false))),
    ]);

    if (dev) {
      console.log(`[DASHBOARD] ✅ Loaded for ${userId} — ${recentReports.length} reports, ${unreadCountResult} unread`);
    }

    return {
      user:    locals.user,
      account: account ?? {
        tier: '1', trustScore: 0, kycStatus: 'pending',
        lastActive: null, isActive: true,
      },
      profile:  profile ?? { firstName: null, lastName: null, phone: null, email: null },
      kycData,

      // Report stats
      recentReports,
      reportSummary:    reportSummaryRows,
      commentCount,
      mediaCount,

      // Notifications
      unreadCount:         unreadCountResult,
      recentNotifications,

      // Misc
      savedLocations:  savedLocationsData,
      activeFlags,
    };

  } catch (err: any) {
    console.error(`[DASHBOARD] Critical failure for ${userId}:`, err?.message);
    throw error(500, 'Unable to load dashboard. Please try again.');
  }
};