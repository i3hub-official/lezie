
// lib/server/services/report.service.ts
import { db } from '$lib/server/db';
import { 
  reports, 
  reportMedia, 
  categories, 
  statuses, 
  notifications, 
  auditLogs,
  users
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { aiMiddleware } from '$lib/middleware/ai.middleware';
import { emitAlertToArea } from '$lib/server/websocket';

export interface CreateReportDto {
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  locationName?: string;
  address?: string;
  isAnonymous?: boolean;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnailUrl?: string;
    size?: number;
    mimeType?: string;
  }[];
}

export class ReportService {
  static async createReport(data: CreateReportDto) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, data.categoryId),
    });
    if (!category) throw new Error('Invalid category');

    const defaultStatus = await db.query.statuses.findFirst({
      where: eq(statuses.name, 'reported'),
    });
    if (!defaultStatus) throw new Error('Default status not found');

    // AI Analysis via Middleware
    let analysis;
    try {
      analysis = await aiMiddleware.analyzeReport(
        data.title,
        data.description,
        category.name
      );
    } catch (err) {
      console.warn('AI analysis failed, using fallback');
      analysis = {
        severity: 'medium' as const,
        threatScore: 50,
        categories: [category.name],
        summary: 'AI analysis temporarily unavailable.',
        recommendedAction: 'Manual review recommended',
        confidence: 0.4,
        needsImmediateAttention: false,
      };
    }

    const reportId = randomUUID();

    // Create Report
    await db.insert(reports).values({
      id: reportId,
      userId: data.userId,
      categoryId: data.categoryId,
      statusId: defaultStatus.id,
      title: data.title,
      description: data.description,
      location: data.location,
      locationName: data.locationName || null,
      address: data.address || null,
      severity: analysis.severity,
      threatScore: analysis.threatScore,
      verificationStatus: 'unverified',
      isAnonymous: data.isAnonymous || false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert Media
    if (data.media?.length) {
      for (const media of data.media) {
        await db.insert(reportMedia).values({
          id: randomUUID(),
          reportId,
          userId: data.userId,
          mediaType: media.type,
          url: media.url,
          thumbnailUrl: media.thumbnailUrl || null,
          size: media.size || null,
          mimeType: media.mimeType || null,
          isVerified: false,
          createdAt: new Date(),
        });
      }
    }

    // Send nearby alerts
    await this.createNearbyAlerts(reportId, data.location.coordinates, analysis.severity);

    // Increase reporter trust score
    await db.update(users)
      .set({ trustScore: sql`${users.trustScore} + 5`, updatedAt: new Date() })
      .where(eq(users.id, data.userId));

    return {
      reportId,
      severity: analysis.severity,
      threatScore: analysis.threatScore,
      needsImmediateAttention: analysis.needsImmediateAttention,
      summary: analysis.summary
    };
  }

  static async createNearbyAlerts(
    reportId: string, 
    coordinates: [number, number], 
    severity: string
  ) {
    const radiusMap: Record<string, number> = {
      low: 1000, medium: 3000, high: 5000, critical: 10000
    };
    const radius = radiusMap[severity] || 3000;

    const nearbyUsers = await db.execute(sql`
      SELECT u.id as user_id
      FROM user_profiles up
      JOIN users u ON u.id = up.user_id
      WHERE u.is_active = true 
        AND u.kyc_status = 'verified'
        AND ST_DWithin(
          up.location::geography,
          ST_SetSRID(ST_MakePoint(${coordinates[0]}, ${coordinates[1]}), 4326)::geography,
          ${radius}
        )
    `);

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, reportId),
      with: { category: true }
    });

    if (!report) return;

    for (const user of nearbyUsers) {
      const userId = user.user_id as string;

      await db.insert(notifications).values({
        id: randomUUID(),
        userId,
        type: 'alert',
        title: `Alert: ${report.category?.name} nearby`,
        body: `${report.title} • ${severity.toUpperCase()} • ${Math.round(radius/1000)}km away`,
        data: { reportId, severity, coordinates },
        isRead: false,
        createdAt: new Date(),
      });

      emitAlertToArea(coordinates[1], coordinates[0], {
        reportId,
        title: report.title,
        severity,
        category: report.category?.name,
        location: coordinates,
      });
    }
  }

  static async getNearbyReports(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    limit: number = 50
  ) {
    const result = await db.execute(sql`
      SELECT 
        r.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        s.name as status_name,
        ST_Distance(
          r.location::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        ) as distance
      FROM reports r
      JOIN categories c ON c.id = r.category_id
      JOIN statuses s ON s.id = r.status_id
      WHERE ST_DWithin(
        r.location::geography,
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        ${radius}
      )
      AND r.verification_status != 'false_report'
      ORDER BY r.severity DESC, distance ASC
      LIMIT ${limit}
    `);
    return result;
  }

  static async getReportWithDetails(reportId: string) {
    const report = await db.query.reports.findFirst({
      where: eq(reports.id, reportId),
      with: {
        category: true,
        status: true,
        user: {
          with: { profile: true },
        },
        media: true,
        comments: {
          with: {
            user: {
              with: { profile: true },
            },
          },
          orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        },
      },
    });

    if (!report) return null;

    // Increment view count
    await db.update(reports)
      .set({ viewCount: sql`${reports.viewCount} + 1`, updatedAt: new Date() })
      .where(eq(reports.id, reportId));

    return report;
  }

  static async updateReportStatus(
    reportId: string,
    statusId: string,
    adminId: string,
    verificationStatus?: 'unverified' | 'community-verified' | 'authority-verified'
  ) {
    const updates: any = {
      statusId,
      updatedAt: new Date(),
    };

    if (verificationStatus) updates.verificationStatus = verificationStatus;

    await db.update(reports).set(updates).where(eq(reports.id, reportId));

    // Audit log
    await db.insert(auditLogs).values({
      id: randomUUID(),
      adminId,
      action: 'update_report_status',
      targetType: 'report',
      targetId: reportId,
      changes: { statusId, verificationStatus },
      ipAddress: '',
      userAgent: '',
      createdAt: new Date(),
    });
  }

  static async getReportHeatmap(
    bounds: { north: number; south: number; east: number; west: number },
    startDate?: Date,
    endDate?: Date
  ) {
        let dateFilter = sql``;
    if (startDate && endDate) {
      dateFilter = sql`AND r.created_at BETWEEN ${startDate} AND ${endDate}`;
    }

    const heatmapData = await db.execute(sql`
      SELECT 
        ST_X(ST_Transform(r.location::geometry, 4326)) as longitude,
        ST_Y(ST_Transform(r.location::geometry, 4326)) as latitude,
        CASE r.severity
          WHEN 'critical' THEN 100
          WHEN 'high' THEN 75
          WHEN 'medium' THEN 50
          WHEN 'low' THEN 25
        END as weight,
        r.title,
        r.id as report_id,
        c.name as category
      FROM reports r
      JOIN categories c ON c.id = r.category_id
      WHERE ST_Within(
        r.location::geometry,
        ST_MakeEnvelope(${bounds.west}, ${bounds.south}, ${bounds.east}, ${bounds.north}, 4326)
      )
      ${dateFilter}
      AND r.verification_status != 'false_report'
    `);

    return heatmapData;
  
  }

  static async getIncidentClusters(
    latitude: number,
    longitude: number,
    zoom: number
  ) {
        // Adjust cluster size based on zoom level
    const clusterDistance = Math.max(50, 500 / Math.pow(2, zoom - 10));

    const clusters = await db.execute(sql`
      WITH clusters AS (
        SELECT 
          ST_ClusterDBSCAN(r.location::geometry, eps := ${clusterDistance}, minpoints := 2) OVER () as cluster_id,
          r.*,
          c.name as category_name
        FROM reports r
        JOIN categories c ON c.id = r.category_id
        WHERE ST_DWithin(
          r.location::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
          ${50000 / Math.pow(2, zoom - 8)}
        )
        AND r.verification_status != 'false_report'
      )
      SELECT 
        cluster_id,
        COUNT(*) as count,
        ST_Centroid(ST_Collect(location::geometry)) as center,
        array_agg(DISTINCT category_name) as categories,
        MAX(severity) as max_severity
      FROM clusters
      WHERE cluster_id IS NOT NULL
      GROUP BY cluster_id
      UNION ALL
      SELECT 
        NULL as cluster_id,
        1 as count,
        location::geometry as center,
        ARRAY[category_name] as categories,
        severity as max_severity
      FROM clusters
      WHERE cluster_id IS NULL
    `);

    return clusters;
  }
}