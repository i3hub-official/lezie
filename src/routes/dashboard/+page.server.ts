import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

import { getProfile, getKycData } from '$lib/server/services/profileService';
// Import your other services/queries here as needed:
// e.g. getRecentReports, getReportSummary, getUnreadNotificationsCount, etc.

export const load: PageServerLoad = async ({ locals }) => {
  // 1. Authentication guard — redirect to your signin page
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
      // Account data from your main `users` table
      db
        .select({
          tier: users.tier,
          trustScore: users.trustScore,
          kycStatus: users.kycStatus,
          lastActive: users.lastActive,
          isActive: users.isActive,
          // Add any other columns you need from the users table
        })
        .from(users)
        .where(eq(users.id, userId as any))
        .limit(1)
        .then((rows) => rows[0] ?? null),

      // Decrypted profile (firstName, lastName, bio, address, dob, avatarUrl, etc.)
      getProfile(userId),

      // Decrypted KYC data or null
      getKycData(userId),

      // Recent reports — replace with your actual query
      // Example placeholder:
      db
        .select() // select your report fields + joins
        .from(/* your reports table */)
        .where(/* eq(reports.userId, userId as any) */)
        .orderBy(desc(/* reports.createdAt */))
        .limit(10),

      // Report summary (counts)
      db
        .select({
          total: sql<number>`COUNT(*)`,
          // Add severity/status breakdown as needed
        })
        .from(/* your reports table */)
        .where(/* filter by userId */),

      // Unread notifications count
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(/* your notifications table */)
        .where(/* unread condition + userId */)
        .then((rows) => rows[0]),

      // Recent notifications (last 20)
      db
        .select()
        .from(/* notifications table */)
        .where(/* userId condition */)
        .orderBy(desc(/* createdAt */))
        .limit(20),

      // Saved locations
      db
        .select()
        .from(/* saved_locations table */)
        .where(eq(/* saved_locations.userId */, userId as any)),

      // Active/unresolved identity flags
      db
        .select()
        .from(/* flags table */)
        .where(/* userId + unresolved condition */),
    ]);

    return {
      user: locals.user,                    // Better Auth user (email, username, name, phoneNumber, etc.)
      account,                              // tier, trustScore, kycStatus, etc.
      profile,                              // decrypted profile fields
      kycData,                              // decrypted KYC object or null
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