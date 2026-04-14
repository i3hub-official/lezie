import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { reports, categories, statuses, users } from '$lib/server/db/schema';
import { eq, desc, and, sql, ilike, or } from 'drizzle-orm';

const MAX_REPORTS_PER_PAGE = 20;

const parseRequestBody = async (request: Request) => {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';

  if (contentType.includes('application/json')) {
    return await request.json();
  }

  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData();
    const body: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }
    return body;
  }

  try {
    return await request.json();
  } catch {
    return {};
  }
};

const requireAuth = (locals: App.Locals) => {
  if (!locals.user) {
    return null;
  }
  return locals.user;
};

export const GET: RequestHandler = async ({ locals, url }) => {
  const user = requireAuth(locals);
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const filterCategory = url.searchParams.get('category') ?? 'all';
  const filterSeverity = url.searchParams.get('severity') ?? 'all';
  const searchQuery = url.searchParams.get('q') ?? '';
  const page = Number(url.searchParams.get('page') ?? 1);
  const offset = (page - 1) * MAX_REPORTS_PER_PAGE;

  const conditions: any[] = [];

  if (filterCategory !== 'all') {
    conditions.push(eq(reports.categoryId, filterCategory));
  }

  if (filterSeverity !== 'all') {
    conditions.push(eq(reports.severity, filterSeverity as any));
  }

  if (searchQuery.trim()) {
    conditions.push(
      or(
        ilike(reports.title, `%${searchQuery}%`),
        ilike(reports.description, `%${searchQuery}%`),
      )
    );
  }

  try {
    const reportsData = await db
      .select({
        id:                 reports.id,
        title:              reports.title,
        description:        reports.description,
        severity:           reports.severity,
        verificationStatus: reports.verificationStatus,
        isAnonymous:        reports.isAnonymous,
        viewCount:          reports.viewCount,
        locationName:       reports.locationName,
        address:            reports.address,
        location:           reports.location,
        createdAt:          reports.createdAt,
        updatedAt:          reports.updatedAt,
        categoryId:         categories.id,
        categoryName:       categories.name,
        categoryColor:      categories.color,
        categoryIcon:       categories.icon,
        statusId:           statuses.id,
        statusName:         statuses.name,
        statusColor:        statuses.color,
        authorId:           users.id,
        commentCount: sql<number>`(
          SELECT count(*)::int FROM report_comments
          WHERE report_id = ${reports.id}
        )`,
        mediaCount: sql<number>`(
          SELECT count(*)::int FROM report_media
          WHERE report_id = ${reports.id}
        )`,
      })
      .from(reports)
      .leftJoin(categories, eq(reports.categoryId, categories.id))
      .leftJoin(statuses, eq(reports.statusId, statuses.id))
      .leftJoin(users, eq(reports.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reports.createdAt))
      .limit(MAX_REPORTS_PER_PAGE)
      .offset(offset);

    const categoriesData = await db
      .select({ id: categories.id, name: categories.name, color: categories.color, icon: categories.icon })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);

    const statusesData = await db
      .select({ id: statuses.id, name: statuses.name, color: statuses.color })
      .from(statuses)
      .where(eq(statuses.isActive, true));

    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(reports)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .then((r) => r[0]?.count ?? 0);

    return json({
      reports: reportsData.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
      categories: categoriesData,
      statuses: statusesData,
      currentUserId: user.id,
      pagination: {
        page,
        limit: MAX_REPORTS_PER_PAGE,
        total: totalResult,
        pages: Math.ceil(totalResult / MAX_REPORTS_PER_PAGE),
      },
      filters: { category: filterCategory, severity: filterSeverity, q: searchQuery },
    });
  } catch (err) {
    console.error('[REPORT GET]', err);
    return json({ error: 'Failed to load reports' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = requireAuth(locals);
  if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

  const body = await parseRequestBody(request);
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const categoryId = typeof body.categoryId === 'string' ? body.categoryId : '';
  const categoryName = typeof body.category === 'string' ? body.category : '';
  const severity = typeof body.severity === 'string' ? body.severity : 'medium';
  const isAnonymous = body.isAnonymous === true || body.isAnonymous === 'true';
  const locationName = typeof body.locationName === 'string' ? body.locationName : null;
  const address = typeof body.address === 'string' ? body.address : null;

  let location: unknown = null;

  if (body.location && typeof body.location === 'object') {
    const possibleLocation = body.location as Record<string, unknown>;
    if (typeof possibleLocation.type === 'string' && Array.isArray(possibleLocation.coordinates)) {
      location = possibleLocation;
    } else if (typeof possibleLocation.lat === 'number' && typeof possibleLocation.lng === 'number') {
      location = { lat: possibleLocation.lat, lng: possibleLocation.lng };
    }
  }

  if (!location && typeof body.lat === 'string' && typeof body.lng === 'string') {
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      location = { lat, lng };
    }
  }

  if (!title || title.length < 5) {
    return json({ error: 'Title must be at least 5 characters' }, { status: 400 });
  }

  if (!description || description.length < 20) {
    return json({ error: 'Description must be at least 20 characters' }, { status: 400 });
  }

  if (!categoryId && !categoryName) {
    return json({ error: 'Please select a category' }, { status: 400 });
  }

  if (!location) {
    return json({ error: 'Location is required' }, { status: 400 });
  }

  try {
    let categoryRow = null;

    if (categoryId) {
      categoryRow = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId),
      });
    }

    if (!categoryRow && categoryName) {
      categoryRow = await db.query.categories.findFirst({
        where: ilike(categories.name, categoryName),
      });
    }

    if (!categoryRow) {
      categoryRow = await db.query.categories.findFirst({
        where: eq(categories.isActive, true),
      });
    }

    if (!categoryRow) {
      return json({ error: 'No categories configured — contact admin' }, { status: 500 });
    }

    let statusRow = await db.query.statuses.findFirst({
      where: ilike(statuses.name, 'reported'),
    });

    if (!statusRow) {
      statusRow = await db.query.statuses.findFirst({
        where: eq(statuses.isActive, true),
      });
    }

    if (!statusRow) {
      return json({ error: 'No statuses configured — contact admin' }, { status: 500 });
    }

    const [inserted] = await db.insert(reports).values({
      userId: isAnonymous ? null : user.id,
      categoryId: categoryRow.id,
      statusId: statusRow.id,
      title,
      description,
      severity: severity as any,
      isAnonymous,
      location,
      locationName,
      address,
    }).returning({ id: reports.id });

    if (!inserted) {
      return json({ error: 'Failed to save report' }, { status: 500 });
    }

    return json({ success: true, reportId: inserted.id }, { status: 201 });
  } catch (err) {
    console.error('[REPORT POST]', err);
    return json({ error: 'Failed to save report' }, { status: 500 });
  }
};