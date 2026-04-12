// src/routes/api/statistics/+server.ts
// Returns statistics for the StatisticsPage:
//   - userStats:      this user's own report metrics
//   - communityStats: platform-wide totals
//   - incidentTrend:  monthly counts (last 12 months, community)
//   - categoryDist:   breakdown by category (community)
//   - severityDist:   breakdown by severity (community)
//   - topLocations:   top 5 location names by report count (community)
//   - userEngagement: monthly reports/comments per user (last 6 months)

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
  reports, categories, statuses,
  reportComments, users,
} from '$lib/server/db/schema';
import { eq, desc, and, count, sql, gte, isNotNull } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals, url }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorised.');

  const timeRange = url.searchParams.get('timeRange') ?? 'month';

  // ── Date cutoff based on timeRange ────────────────────────────────────────
  const cutoffMap: Record<string, number> = {
    week:  7  * 86400000,
    month: 30 * 86400000,
    year:  365 * 86400000,
  };
  const cutoff = new Date(Date.now() - (cutoffMap[timeRange] ?? cutoffMap.month));

  // ── 12-month window for trend chart ──────────────────────────────────────
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  // ── 6-month window for engagement chart ──────────────────────────────────
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    userTotals,
    communityTotals,
    activeUsersResult,
    trendRows,
    categoryRows,
    severityRows,
    locationRows,
    engagementRows,
    commentCountResult,
  ] = await Promise.all([

    // ── 1. User's own totals ───────────────────────────────────────────────
    db
      .select({
        total:            sql<number>`count(*)::int`,
        verified:         sql<number>`count(*) filter (where ${reports.verificationStatus} = 'community-verified')::int`,
        authorityVerified:sql<number>`count(*) filter (where ${reports.verificationStatus} = 'authority-verified')::int`,
        low:              sql<number>`count(*) filter (where ${reports.severity} = 'low')::int`,
        medium:           sql<number>`count(*) filter (where ${reports.severity} = 'medium')::int`,
        high:             sql<number>`count(*) filter (where ${reports.severity} = 'high')::int`,
        critical:         sql<number>`count(*) filter (where ${reports.severity} = 'critical')::int`,
      })
      .from(reports)
      .where(and(eq(reports.userId, userId), gte(reports.createdAt, cutoff)))
      .then(r => r[0] ?? { total:0, verified:0, authorityVerified:0, low:0, medium:0, high:0, critical:0 }),

    // ── 2. Community-wide totals ──────────────────────────────────────────
    db
      .select({
        total:    sql<number>`count(*)::int`,
        verified: sql<number>`count(*) filter (where ${reports.verificationStatus} != 'unverified')::int`,
        high:     sql<number>`count(*) filter (where ${reports.severity} in ('high','critical'))::int`,
      })
      .from(reports)
      .where(gte(reports.createdAt, cutoff))
      .then(r => r[0] ?? { total:0, verified:0, high:0 }),

    // ── 3. Active users (users who reported in this period) ───────────────
    db
      .select({ count: sql<number>`count(distinct ${reports.userId})::int` })
      .from(reports)
      .where(and(isNotNull(reports.userId), gte(reports.createdAt, cutoff)))
      .then(r => r[0]?.count ?? 0),

    // ── 4. Monthly incident trend (last 12 months, community) ─────────────
    db
      .select({
        month:    sql<string>`to_char(${reports.createdAt}, 'Mon')`,
        year:     sql<number>`extract(year from ${reports.createdAt})::int`,
        monthNum: sql<number>`extract(month from ${reports.createdAt})::int`,
        count:    sql<number>`count(*)::int`,
        verified: sql<number>`count(*) filter (where ${reports.verificationStatus} != 'unverified')::int`,
      })
      .from(reports)
      .where(gte(reports.createdAt, twelveMonthsAgo))
      .groupBy(
        sql`to_char(${reports.createdAt}, 'Mon')`,
        sql`extract(year from ${reports.createdAt})`,
        sql`extract(month from ${reports.createdAt})`
      )
      .orderBy(
        sql`extract(year from ${reports.createdAt})`,
        sql`extract(month from ${reports.createdAt})`
      ),

    // ── 5. Category distribution ──────────────────────────────────────────
    db
      .select({
        categoryName: categories.name,
        categoryColor: categories.color,
        count: sql<number>`count(*)::int`,
      })
      .from(reports)
      .innerJoin(categories, eq(reports.categoryId, categories.id))
      .where(gte(reports.createdAt, cutoff))
      .groupBy(categories.name, categories.color)
      .orderBy(desc(sql`count(*)`))
      .limit(8),

    // ── 6. Severity distribution ──────────────────────────────────────────
    db
      .select({
        severity: reports.severity,
        count:    sql<number>`count(*)::int`,
      })
      .from(reports)
      .where(gte(reports.createdAt, cutoff))
      .groupBy(reports.severity)
      .orderBy(desc(sql`count(*)`)),

    // ── 7. Top locations by name ──────────────────────────────────────────
    db
      .select({
        locationName: reports.locationName,
        count:        sql<number>`count(*)::int`,
      })
      .from(reports)
      .where(and(
        isNotNull(reports.locationName),
        gte(reports.createdAt, cutoff)
      ))
      .groupBy(reports.locationName)
      .orderBy(desc(sql`count(*)`))
      .limit(5),

    // ── 8. Monthly user engagement (reports + comments, last 6 months) ────
    db
      .select({
        month:    sql<string>`to_char(${reports.createdAt}, 'Mon')`,
        monthNum: sql<number>`extract(month from ${reports.createdAt})::int`,
        year:     sql<number>`extract(year from ${reports.createdAt})::int`,
        reports:  sql<number>`count(*)::int`,
      })
      .from(reports)
      .where(and(eq(reports.userId, userId), gte(reports.createdAt, sixMonthsAgo)))
      .groupBy(
        sql`to_char(${reports.createdAt}, 'Mon')`,
        sql`extract(month from ${reports.createdAt})`,
        sql`extract(year from ${reports.createdAt})`
      )
      .orderBy(
        sql`extract(year from ${reports.createdAt})`,
        sql`extract(month from ${reports.createdAt})`
      ),

    // ── 9. User's total comment count ─────────────────────────────────────
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(reportComments)
      .where(eq(reportComments.userId, userId))
      .then(r => r[0]?.count ?? 0),
  ]);

  // ── Safety score: (total - high_critical) / total * 100 ─────────────────
  const communityTotal = communityTotals.total;
  const safetyScore = communityTotal > 0
    ? Math.min(100, Math.round(((communityTotal - communityTotals.high) / communityTotal) * 100))
    : 0;

  const userTotal = userTotals.total;
  const userSafetyScore = userTotal > 0
    ? Math.min(100, Math.round(((userTotal - userTotals.high - userTotals.critical) / userTotal) * 100))
    : 0;

  // ── Severity colour map ───────────────────────────────────────────────────
  const sevColors: Record<string, { color: string; bg: string }> = {
    low:      { color: '#10B981', bg: '#D1FAE5' },
    medium:   { color: '#F59E0B', bg: '#FEF3C7' },
    high:     { color: '#F97316', bg: '#FFEDD5' },
    critical: { color: '#EF4444', bg: '#FEE2E2' },
  };

  // ── Shape category distribution with percentages ─────────────────────────
  const catTotal = categoryRows.reduce((s, r) => s + r.count, 0);
  const categoryDistribution = categoryRows.map(r => ({
    category:   r.categoryName,
    count:      r.count,
    percentage: catTotal > 0 ? Math.round((r.count / catTotal) * 1000) / 10 : 0,
    color:      r.categoryColor ?? '#6B7280',
  }));

  // ── Shape severity distribution ───────────────────────────────────────────
  const sevTotal = severityRows.reduce((s, r) => s + r.count, 0);
  const severityDistribution = severityRows.map(r => ({
    severity:   r.severity.charAt(0).toUpperCase() + r.severity.slice(1),
    count:      r.count,
    percentage: sevTotal > 0 ? Math.round((r.count / sevTotal) * 1000) / 10 : 0,
    color:      sevColors[r.severity]?.color ?? '#6B7280',
    bg:         sevColors[r.severity]?.bg    ?? '#F3F4F6',
  }));

  // ── Shape incident trend ──────────────────────────────────────────────────
  const incidentTrend = trendRows.map(r => ({
    month:    r.month,
    count:    r.count,
    verified: r.verified,
  }));

  // ── Shape top locations ───────────────────────────────────────────────────
  const topLocations = locationRows
    .filter(r => r.locationName)
    .map(r => ({
      location: r.locationName!,
      count:    r.count,
      trend:    '+0%',   // trend calc needs historical comparison — placeholder
    }));

  // ── Shape user engagement ─────────────────────────────────────────────────
  const userEngagement = engagementRows.map(r => ({
    month:         r.month,
    reports:       r.reports,
    verifications: 0,   // add verification join when ready
    comments:      0,   // aggregate per month needs separate query — placeholder
  }));

  return json({
    userStats: {
      totalReports:      userTotal,
      verifiedReports:   userTotals.verified + userTotals.authorityVerified,
      safetyScore:       userSafetyScore,
      commentCount:      commentCountResult,
      bySeverity: {
        low:      userTotals.low,
        medium:   userTotals.medium,
        high:     userTotals.high,
        critical: userTotals.critical,
      },
    },
    communityStats: {
      totalIncidents:   communityTotal,
      verifiedReports:  communityTotals.verified,
      safetyScore,
      activeUsers:      activeUsersResult,
      communityReports: communityTotal,
      avgResponseTime:  0,   // needs a response_time column — placeholder
    },
    incidentTrend,
    categoryDistribution,
    severityDistribution,
    topLocations,
    userEngagement,
    timeRange,
  });
};
