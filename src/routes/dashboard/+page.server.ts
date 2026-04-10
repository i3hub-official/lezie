import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

import { getProfile, getKycData } from '$lib/server/services/profileService';
// TODO: Import your other query functions here when ready
// e.g. import { getRecentReports, getReportSummary } from '$lib/server/services/reportService';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.id) {
    throw redirect(302, '/signin');
  }

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
      savedLocations,
      activeFlags,
    ] = await Promise.all([
      // Account data from your users table
      db
        .select({
          tier: users.tier,
          trustScore: users.trustScore,
          kycStatus: users.kycStatus,
          lastActive: users.lastActive,
          isActive: users.isActive,
        })
        .from(users)
        .where(eq(users.id, userId as any))
        .limit(1)
        .then((rows) => rows[0] ?? null),

      getProfile(userId),

      getKycData(userId),

      // === Replace these placeholders with your actual queries ===
      db
        .select() // ← select your report fields + joins here
        .from(/* your reports table */)
        .where(eq(/* reports.userId */, userId as any)) // ← replace with real column
        .orderBy(desc(/* reports.createdAt */))
        .limit(10),

      db
        .select({
          total: sql<number>`COUNT(*)`,
          // add more breakdowns here (severity, status, etc.)
        })
        .from(/* your reports table */)
        .where(eq(/* reports.userId */, userId as any)),

      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(/* your notifications table */)
        .where(eq(/* notifications.userId */, userId as any)) // add unread condition if needed
        .then((rows) => rows[0]),

      db
        .select()
        .from(/* notifications table */)
        .where(eq(/* notifications.userId */, userId as any))
        .orderBy(desc(/* notifications.createdAt */))
        .limit(20),

      // Fixed: proper eq usage
      db
        .select()
        .from(/* saved_locations table */)
        .where(eq(/* saved_locations.userId */, userId as any)),

      // Fixed: proper eq usage
      db
        .select()
        .from(/* flags table */)
        .where(eq(/* flags.userId */, userId as any)), // add unresolved condition if needed
    ]);

    return {
      user: locals.user,
      account,
      profile,
      kycData,
      recentReports,
      reportSummary,
      unreadCount: unreadCountResult?.count ?? 0,
      recentNotifications,
      savedLocations,
      activeFlags,
    };
  } catch (err) {
    console.error(`[DASHBOARD LOAD] Failed for user ${userId}:`, err);
    throw error(500, 'Unable to load your dashboard. Please try again later.');
  }
};