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
import { AIService } from './ai.service';
import { emitAlertToArea } from '$lib/server/websocket';

export interface CreateReportDto {
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
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
    // Get category to determine default severity
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, data.categoryId),
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Get default status (usually "reported")
    const defaultStatus = await db.query.statuses.findFirst({
      where: eq(statuses.name, 'reported'),
    });

    if (!defaultStatus) {
      throw new Error('Default status not found');
    }

    // AI analysis
    const analysis = await AIService.analyzeReport(
      data.title,
      data.description,
      category.name,
    );

    const reportId = randomUUID();

    // Create report
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
      verificationStatus: 'unverified',
      isAnonymous: data.isAnonymous || false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add media if any
    if (data.media && data.media.length > 0) {
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
          metadata: null,
          isVerified: false,
          createdAt: new Date(),
        });
      }
    }

    // Create alerts for nearby users
    await this.createNearbyAlerts(reportId, data.location.coordinates, analysis.severity);

    // Update user trust score (increment for reporting)
    await db.update(users)
      .set({
        trustScore: sql`${users.trustScore} + 5`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.userId));

    return { reportId, analysis };
  }

  static async createNearbyAlerts(reportId: string, coordinates: [number, number], severity: string) {
    // Convert severity to radius
    const radiusMap: Record<string, number> = {
      low: 1000,     // 1km
      medium: 3000,  // 3km
      high: 5000,    // 5km
      critical: 10000, // 10km
    };

    const radius = radiusMap[severity] || 3000;

    // Find users within radius using PostGIS
    const nearbyUsers = await db.execute(sql`
      SELECT u.id, up.user_id
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

    // Get report details
    const report = await db.query.reports.findFirst({
      where: eq(reports.id, reportId),
      with: {
        category: true,
      },
    });

    if (!report) return;

    // Create notifications for nearby users
    for (const user of nearbyUsers) {
      const userId = user.user_id as string;
      await db.insert(notifications).values({
        id: randomUUID(),
        userId,
        type: 'alert',
        title: `Alert: ${report.category?.name} nearby`,
        body: `${report.title} reported ${radius / 1000}km from you. Severity: ${severity.toUpperCase()}`,
        data: {
          reportId,
          severity,
          coordinates,
        },
        isRead: false,
        createdAt: new Date(),
      });

      // Emit real-time alert via WebSocket
      emitAlertToArea(coordinates[1], coordinates[0], {
        reportId,
        title: report.title,
        severity,
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
    const nearbyReports = await db.execute(sql`
      SELECT 
        r.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        s.name as status_name,
        s.color as status_color,
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

    return nearbyReports;
  }

  static async getReportWithDetails(reportId: string) {
    const report = await db.query.reports.findFirst({
      where: eq(reports.id, reportId),
      with: {
        category: true,
        status: true,
        user: {
          with: {
            profile: true,
          },
        },
        media: true,
        comments: {
          with: {
            user: {
              with: {
                profile: true,
              },
            },
          },
          orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        },
      },
    });

    if (!report) return null;

    // Increment view count
    await db.update(reports)
      .set({
        viewCount: sql`${reports.viewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, reportId));

    return report;
  }

  static async updateReportStatus(
    reportId: string,
    statusId: string,
    adminId: string,
    verificationStatus?: 'unverified' | 'community-verified' | 'authority-verified'
  ) {
    const updates: Partial<typeof reports.$inferInsert> = {
      statusId,
      updatedAt: new Date(),
    };

    if (verificationStatus) {
      updates.verificationStatus = verificationStatus;
    }

    await db.update(reports)
      .set(updates)
      .where(eq(reports.id, reportId));

    // Log audit
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