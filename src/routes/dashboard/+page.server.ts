// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

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
  // Check authentication
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const userId = locals.user.id;

  if (dev) {
    console.log(`[DASHBOARD] Loading data for user: ${userId}`);
  }

  try {
    // Fetch profile separately with error handling to prevent complete failure
    let profile = null;
    let profileError = null;
    
    try {
      profile = await getProfile(userId);
      if (dev && profile) {
        console.log(`[DASHBOARD] Profile loaded successfully for user: ${userId}`);
      }
    } catch (err) {
      profileError = err;
      console.error(`[DASHBOARD] Failed to load profile for user ${userId}:`, err);
      // Continue with null profile instead of failing the entire page
      profile = null;
    }

    // Fetch KYC data separately with error handling
    let kycData = null;
    let kycError = null;
    
    try {
      kycData = await getKycData(userId);
      if (dev && kycData) {
        console.log(`[DASHBOARD] KYC data loaded successfully for user: ${userId}`);
      }
    } catch (err) {
      kycError = err;
      console.error(`[DASHBOARD] Failed to load KYC data for user ${userId}:`, err);
      // Continue with null KYC data
      kycData = null;
    }

    // Fetch all other data in parallel
    const [
      account,
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
        .then(rows => rows[0] ?? null)
        .catch(err => {
          console.error(`[DASHBOARD] Account query failed:`, err);
          return null;
        }),

      // 2. Recent reports with category + status names
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
        .limit(10)
        .catch(err => {
          console.error(`[DASHBOARD] Recent reports query failed:`, err);
          return [];
        }),

      // 3. Report severity summary
      db
        .select({
          total:    sql<number>`count(*)::int`,
          low:      sql<number>`count(*) filter (where ${reports.severity} = 'low')::int`,
          medium:   sql<number>`count(*) filter (where ${reports.severity} = 'medium')::int`,
          high:     sql<number>`count(*) filter (where ${reports.severity} = 'high')::int`,
          critical: sql<number>`count(*) filter (where ${reports.severity} = 'critical')::int`,
        })
        .from(reports)
        .where(eq(reports.userId, userId))
        .then(rows => rows[0] ?? { total: 0, low: 0, medium: 0, high: 0, critical: 0 })
        .catch(err => {
          console.error(`[DASHBOARD] Report summary query failed:`, err);
          return { total: 0, low: 0, medium: 0, high: 0, critical: 0 };
        }),

      // 4. Unread notification count
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId,  userId),
            eq(notifications.isRead,  false)
          )
        )
        .then(rows => rows[0] ?? { count: 0 })
        .catch(err => {
          console.error(`[DASHBOARD] Unread count query failed:`, err);
          return { count: 0 };
        }),

      // 5. Recent notifications
      db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(20)
        .catch(err => {
          console.error(`[DASHBOARD] Notifications query failed:`, err);
          return [];
        }),

      // 6. Saved locations
      db
        .select()
        .from(savedLocations)
        .where(eq(savedLocations.userId, userId))
        .catch(err => {
          console.error(`[DASHBOARD] Saved locations query failed:`, err);
          return [];
        }),

      // 7. Active identity flags
      db
        .select()
        .from(identityFlags)
        .where(
          and(
            eq(identityFlags.userId,   userId),
            eq(identityFlags.resolved, false)
          )
        )
        .catch(err => {
          console.error(`[DASHBOARD] Identity flags query failed:`, err);
          return [];
        }),
    ]);

    // Log any errors that occurred but don't fail the page
    if (profileError && dev) {
      console.warn(`[DASHBOARD] Profile error (non-fatal):`, profileError.message);
    }
    
    if (kycError && dev) {
      console.warn(`[DASHBOARD] KYC error (non-fatal):`, kycError.message);
    }

    // Prepare the return data with fallbacks for missing data
    const dashboardData = {
      user:                locals.user,
      account:             account || {
        tier: 'free',
        trustScore: 0,
        kycStatus: 'unverified',
        lastActive: null,
        isActive: true,
      },
      profile:             profile || { 
        name: null,
        // Add other profile fields with defaults
        firstName: null,
        lastName: null,
        phone: null,
        address: null,
      },
      kycData:             kycData || null,
      recentReports:       recentReports || [],
      reportSummary:       reportSummaryRows,
      unreadCount:         unreadCountResult?.count ?? 0,
      recentNotifications: recentNotifications || [],
      savedLocations:      savedLocationsData || [],
      activeFlags:         activeFlags || [],
    };

    if (dev) {
      console.log(`[DASHBOARD] Successfully loaded data for user: ${userId}`);
      console.log(`[DASHBOARD] Report count: ${dashboardData.recentReports.length}`);
      console.log(`[DASHBOARD] Notification count: ${dashboardData.recentNotifications.length}`);
    }

    return dashboardData;

  } catch (err) {
    // Only fail completely for critical database errors
    console.error(`[DASHBOARD] Critical failure for user ${userId}:`, err);
    
    // Log more details if available
    if (err instanceof Error) {
      console.error(`[DASHBOARD] Error details:`, {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
    }
    
    throw error(500, 'Unable to load dashboard. Please try again later.');
  }
};