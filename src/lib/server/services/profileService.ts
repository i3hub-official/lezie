import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { 
  users, 
  reports, 
  notifications, 
  savedLocations, 
  identityFlags 
} from '$lib/server/db/schema';

import { eq, desc, sql } from 'drizzle-orm';
import { getProfile, getKycData } from '$lib/server/services/profileService';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user.id;

  try {
    const [
      account,
      profile,
      kycData,
      recentReports,
      reportSummary,
      unreadCountResult,
      recentNotifications,
      savedLocationsData,
      activeFlags,
    ] = await Promise.all([
      // 1. Account data from users table
      db
        .select({
          tier: users.tier,
          trustScore: users.trustScore,
          kycStatus: users.kycStatus,
          lastActive: users.lastActive,
          isActive: users.isActive,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then((rows) => rows[0] ?? null),

      // 2. Decrypted profile
      getProfile(userId),

      // 3. Decrypted KYC data
      getKycData(userId),

      // 4. Recent reports (last 10) - with category and status joined
      db
        .select({
          id: reports.id,
          title: reports.title,
          severity: reports.severity,
          verificationStatus: reports.verificationStatus,
          createdAt: reports.createdAt,
          categoryName: sql<string>`categories.name`,
          statusName: sql<string>`statuses.name`,
        })
        .from(reports)
        .leftJoin('categories', eq(reports.categoryId, sql`categories.id`))  // or import categories if preferred
        .leftJoin('statuses', eq(reports.statusId, sql`statuses.id`))
        .where(eq(reports.userId, userId))
        .orderBy(desc(reports.createdAt))
        .limit(10),

      // 5. Report summary (total + breakdown by severity)
      db
        .select({
          total: sql<number>`COUNT(*)`,
          low: sql<number>`SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END)`,
          medium: sql<number>`SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END)`,
          high: sql<number>`SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END)`,
          critical: sql<number>`SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END)`,
        })
        .from(reports)
        .where(eq(reports.userId, userId)),

      // 6. Unread notifications count
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .where(eq(notifications.isRead, false))
        .then((rows) => rows[0]),

      // 7. Recent notifications (last 20)
      db
        .select({
          id: notifications.id,
          type: notifications.type,
          title: notifications.title,
          body: notifications.body,
          isRead: notifications.isRead,
          createdAt: notifications.createdAt,
        })
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(20),

      // 8. Saved locations
      db
        .select({
          id: savedLocations.id,
          name: savedLocations.name,
          location: savedLocations.location,
          address: savedLocations.address,
          isHome: savedLocations.isHome,
          isWork: savedLocations.isWork,
        })
        .from(savedLocations)
        .where(eq(savedLocations.userId, userId)),

      // 9. Active (unresolved) identity flags
      db
        .select({
          id: identityFlags.id,
          flagType: identityFlags.flagType,
          description: identityFlags.description,
          createdAt: identityFlags.createdAt,
        })
        .from(identityFlags)
        .where(eq(identityFlags.userId, userId))
        .where(eq(identityFlags.resolved, false)),
    ]);

    return {
      user: locals.user,                    // Better Auth user
      account,                              // tier, trustScore, kycStatus...
      profile,                              // decrypted firstName, lastName, bio...
      kycData,                              // decrypted KYC or null
      recentReports,
      reportSummary,
      unreadCount: unreadCountResult?.count ?? 0,
      recentNotifications,
      savedLocations: savedLocationsData,
      activeFlags,
    };
  } catch (err) {
    console.error(`[DASHBOARD LOAD] Failed for user ${userId}:`, err);
    throw error(500, 'Unable to load your dashboard. Please try again later.');
  }
};