import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
  users,
  reports,
  notifications,
  savedLocations,
  identityFlags,
  categories,
  statuses
} from '$lib/server/db/schema';

import { eq, desc, sql, and } from 'drizzle-orm';
import { getProfile, getKycData } from '$lib/server/services/profileService';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const userId = locals.user.id;

  try {
    const [
      account,
      profile,
      kycData,
      recentReports,
      reportSummaryRows,
      unreadCountResult,
      recentNotifications,
      savedLocationsData,
      activeFlags,
    ] = await Promise.all([

      // 1. Account data
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
        .then(rows => rows[0] ?? null),

      // 2. Profile (decrypted via profileService)
      getProfile(userId),

      // 3. KYC data (decrypted via profileService)
      getKycData(userId),

      // 4. Recent reports with category + status names
      db
        .select({
          id:                 reports.id,
          title:              reports.title,
          severity:           reports.severity,
          verificationStatus: reports.verificationStatus,
          createdAt:          reports.createdAt,
          categoryName:       categories.name,
          statusName:         statuses.name,
        })
        .from(reports)
        .leftJoin(categories, eq(reports.categoryId, categories.id))
        .leftJoin(statuses,   eq(reports.statusId,   statuses.id))
        .where(eq(reports.userId, userId))
        .orderBy(desc(reports.createdAt))
        .limit(10),

      // 5. Report severity summary
      db
        .select({
          total:    sql<number>`count(*)::int`,
          low:      sql<number>`count(*) filter (where ${reports.severity} = 'low')::int`,
          medium:   sql<number>`count(*) filter (where ${reports.severity} = 'medium')::int`,
          high:     sql<number>`count(*) filter (where ${reports.severity} = 'high')::int`,
          critical: sql<number>`count(*) filter (where ${reports.severity} = 'critical')::int`,
        })
        .from(reports)
        .where(eq(reports.userId, userId)),

      // 6. Unread notification count
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId,  userId),
            eq(notifications.isRead,  false)
          )
        )
        .then(rows => rows[0]),

      // 7. Recent notifications
      db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(20),

      // 8. Saved locations
      db
        .select()
        .from(savedLocations)
        .where(eq(savedLocations.userId, userId)),

      // 9. Active identity flags
      db
        .select()
        .from(identityFlags)
        .where(
          and(
            eq(identityFlags.userId,   userId),
            eq(identityFlags.resolved, false)
          )
        ),
    ]);

    return {
      user:                locals.user,
      account,
      profile,
      kycData,
      recentReports,
      reportSummary:       reportSummaryRows[0] ?? { total: 0, low: 0, medium: 0, high: 0, critical: 0 },
      unreadCount:         unreadCountResult?.count ?? 0,
      recentNotifications,
      savedLocations:      savedLocationsData,
      activeFlags,
    };

  } catch (err) {
    console.error(`[DASHBOARD LOAD] Failed for user ${userId}:`, err);
    throw error(500, 'Internal Server Error');
  }
};