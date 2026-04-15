// src/routes/incident/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reports, categories, statuses, users, reportComments, reportMedia } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { id } = params;
  
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  try {
    // Fetch the report with all related data
    const report = await db
      .select({
        id: reports.id,
        title: reports.title,
        description: reports.description,
        severity: reports.severity,
        verificationStatus: reports.verificationStatus,
        isAnonymous: reports.isAnonymous,
        viewCount: reports.viewCount,
        likeCount: reports.likeCount,
        commentCount: reports.commentCount,
        locationName: reports.locationName,
        address: reports.address,
        location: reports.location,
        lat: reports.lat,
        lng: reports.lng,
        city: reports.city,
        state: reports.state,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
        categoryId: categories.id,
        categoryName: categories.name,
        categoryColor: categories.color,
        categoryIcon: categories.icon,
        statusId: statuses.id,
        statusName: statuses.name,
        statusColor: statuses.color,
        authorId: users.id,
        authorName: users.name,
      })
      .from(reports)
      .leftJoin(categories, eq(reports.categoryId, categories.id))
      .leftJoin(statuses, eq(reports.statusId, statuses.id))
      .leftJoin(users, eq(reports.userId, users.id))
      .where(eq(reports.id, id))
      .limit(1);
    
    if (!report || report.length === 0) {
      throw error(404, 'Incident not found');
    }
    
    const incident = report[0];
    
    // Fetch comments for this report
    const comments = await db
      .select({
        id: reportComments.id,
        text: reportComments.text,
        createdAt: reportComments.createdAt,
        authorId: reportComments.userId,
        authorName: users.name,
      })
      .from(reportComments)
      .leftJoin(users, eq(reportComments.userId, users.id))
      .where(eq(reportComments.reportId, id))
      .orderBy(desc(reportComments.createdAt))
      .limit(50);
    
    // Fetch media for this report
    const media = await db
      .select({
        id: reportMedia.id,
        url: reportMedia.url,
        type: reportMedia.type,
        order: reportMedia.order,
      })
      .from(reportMedia)
      .where(eq(reportMedia.reportId, id))
      .orderBy(reportMedia.order);
    
    // Increment view count
    await db.update(reports)
      .set({ viewCount: (incident.viewCount || 0) + 1 })
      .where(eq(reports.id, id));
    
    return {
      id,
      incident: {
        ...incident,
        createdAt: incident.createdAt.toISOString(),
        updatedAt: incident.updatedAt.toISOString(),
        comments: comments.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        })),
        media,
      }
    };
    
  } catch (err) {
    console.error('Error loading incident:', err);
    throw error(500, 'Failed to load incident details');
  }
};