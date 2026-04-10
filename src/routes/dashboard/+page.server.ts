import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

import { getProfile, getKycData } from '$lib/server/services/profileService';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user.id;   // Safe to access because hooks.server.ts already protects this route

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
      // Account data from your main users table
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

      // Profile (decrypted)
      getProfile(userId),

      // KYC data (decrypted)
      getKycData(userId),

      // === TODO: Replace these placeholders with your real queries ===

      // Recent reports (last 10)
      db
        .select() // select your actual fields + joins to category/status
        .from(/* your reports table name */)
        .where(eq(/* reports.userId column */, userId as any))
        .orderBy(desc(/* reports.createdAt or similar */))
        .limit(10),

      // Report summary
      db
        .select({
          total: sql<number>`COUNT(*)`,
          // Add severity/status breakdown here if needed
        })
        .from(/* your reports table name */)
        .where(eq(/* reports.userId column */, userId as any)),

      // Unread notifications count
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(/* your notifications table name */)
        .where(eq(/* notifications.userId column */, userId as any))
        .then((rows) => rows[0]),

      // Recent notifications (last 20)
      db
        .select()
        .from(/* your notifications table name */)
        .where(eq(/* notifications.userId column */, userId as any))
        .orderBy(desc(/* notifications.createdAt */))
        .limit(20),

      // Saved locations
      db
        .select()
        .from(/* your saved_locations table name */)
        .where(eq(/* saved_locations.userId column */, userId as any)),

      // Active/unresolved identity flags
      db
        .select()
        .from(/* your flags table name */)
        .where(eq(/* flags.userId column */, userId as any)),
    ]);

    return {
      user: locals.user,           // Better Auth user
      account,                     // tier, trustScore, kycStatus, etc.
      profile,                     // decrypted profile
      kycData,                     // decrypted KYC or null
      recentReports,
      reportSummary,
      unreadCount: unreadCountResult?.count ?? 0,
      recentNotifications,
      savedLocations,
      activeFlags,
    };
  } catch (err) {
    console.error(`[DASHBOARD LOAD] Failed for user ${userId}:`, err);
    throw error