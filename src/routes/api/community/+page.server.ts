// src/routes/community/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
  communityPosts,
  communityPostLikes,
  communityComments,
  communityDiscussions,
  communityEvents,
  communityEventAttendees,
  userFollows,
} from '$lib/server/db/community-schema';
import { users, userProfiles } from '$lib/server/db/schema';
import { eq, desc, and, sql, gt, or, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Haversine distance filter in SQL (approximate, degrees → km)
// Returns a SQL expression that is true when the point is within `radiusKm`
function withinRadius(
  latCol: any,
  lngCol: any,
  lat: number,
  lng: number,
  radiusKm: number
) {
  // Simple bounding box — fast, good enough for community feed
  const latDelta = radiusKm / 111.0;
  const lngDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));
  return and(
    gt(latCol, lat - latDelta),
    sql`${latCol} < ${lat + latDelta}`,
    gt(lngCol, lng - lngDelta),
    sql`${lngCol} < ${lng + lngDelta}`
  );
}

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const userId = locals.user.id;

  // Optional location from query params (client sends after geolocation)
  const lat = url.searchParams.get('lat') ? Number(url.searchParams.get('lat')) : null;
  const lng = url.searchParams.get('lng') ? Number(url.searchParams.get('lng')) : null;
  const LOCAL_RADIUS_KM = 5;

  try {
    const [
      postsData,
      discussionsData,
      membersData,
      eventsData,
      stats,
      followingIds,
      attendingEventIds,
      likedPostIds,
    ] = await Promise.all([

      // ── Posts: pinned first, then newest ──────────────────────────────────
      // Returns global posts + local posts if location provided
      db
        .select({
          id:           communityPosts.id,
          content:      communityPosts.content,
          category:     communityPosts.category,
          scope:        communityPosts.scope,
          isAnonymous:  communityPosts.isAnonymous,
          isPinned:     communityPosts.isPinned,
          isVerified:   communityPosts.isVerified,
          likeCount:    communityPosts.likeCount,
          commentCount: communityPosts.commentCount,
          shareCount:   communityPosts.shareCount,
          locationName: communityPosts.locationName,
          createdAt:    communityPosts.createdAt,
          authorId:     users.id,
          authorName:   userProfiles.firstName,
          authorLastName: userProfiles.lastName,
          authorRole:   users.tier,
        })
        .from(communityPosts)
        .leftJoin(users,        eq(communityPosts.userId, users.id))
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(
          lat && lng
            ? or(
                eq(communityPosts.scope, 'global'),
                withinRadius(communityPosts.lat, communityPosts.lng, lat, lng, LOCAL_RADIUS_KM)
              )
            : eq(communityPosts.scope, 'global')
        )
        .orderBy(desc(communityPosts.isPinned), desc(communityPosts.createdAt))
        .limit(30),

      // ── Discussions: sticky first, then by last activity ─────────────────
      db
        .select({
          id:             communityDiscussions.id,
          title:          communityDiscussions.title,
          category:       communityDiscussions.category,
          scope:          communityDiscussions.scope,
          isSticky:       communityDiscussions.isSticky,
          isClosed:       communityDiscussions.isClosed,
          replyCount:     communityDiscussions.replyCount,
          viewCount:      communityDiscussions.viewCount,
          lastActivityAt: communityDiscussions.lastActivityAt,
          createdAt:      communityDiscussions.createdAt,
          authorId:       users.id,
          authorName:     userProfiles.firstName,
          authorLastName: userProfiles.lastName,
        })
        .from(communityDiscussions)
        .leftJoin(users,        eq(communityDiscussions.userId, users.id))
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(
          lat && lng
            ? or(
                eq(communityDiscussions.scope, 'global'),
                withinRadius(communityDiscussions.lat, communityDiscussions.lng, lat, lng, LOCAL_RADIUS_KM)
              )
            : eq(communityDiscussions.scope, 'global')
        )
        .orderBy(desc(communityDiscussions.isSticky), desc(communityDiscussions.lastActivityAt))
        .limit(20),

      // ── Members: by trust score descending ───────────────────────────────
      db
        .select({
          id:         users.id,
          tier:       users.tier,
          trustScore: users.trustScore,
          firstName:  userProfiles.firstName,
          lastName:   userProfiles.lastName,
        })
        .from(users)
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(eq(users.isActive, true))
        .orderBy(desc(users.trustScore))
        .limit(12),

      // ── Upcoming events ───────────────────────────────────────────────────
      db
        .select({
          id:            communityEvents.id,
          title:         communityEvents.title,
          description:   communityEvents.description,
          category:      communityEvents.category,
          location:      communityEvents.location,
          startsAt:      communityEvents.startsAt,
          endsAt:        communityEvents.endsAt,
          maxAttendees:  communityEvents.maxAttendees,
          attendeeCount: communityEvents.attendeeCount,
          lat:           communityEvents.lat,
          lng:           communityEvents.lng,
        })
        .from(communityEvents)
        .where(
          and(
            gt(communityEvents.startsAt, new Date()),
            eq(communityEvents.isCancelled, false)
          )
        )
        .orderBy(communityEvents.startsAt)
        .limit(10),

      // ── Stats ─────────────────────────────────────────────────────────────
      Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.isActive, true)).then(r => r[0]?.count ?? 0),
        db.select({ count: sql<number>`count(*)::int` }).from(communityPosts).then(r => r[0]?.count ?? 0),
        db.select({ count: sql<number>`count(*)::int` }).from(communityDiscussions).then(r => r[0]?.count ?? 0),
        db.select({ count: sql<number>`count(*)::int` }).from(communityEvents).where(gt(communityEvents.startsAt, new Date())).then(r => r[0]?.count ?? 0),
      ]),

      // ── Current user's follows ────────────────────────────────────────────
      db
        .select({ followedId: userFollows.followedId })
        .from(userFollows)
        .where(eq(userFollows.followerId, userId))
        .then(rows => new Set(rows.map(r => r.followedId))),

      // ── Events the current user is attending ─────────────────────────────
      db
        .select({ eventId: communityEventAttendees.eventId })
        .from(communityEventAttendees)
        .where(eq(communityEventAttendees.userId, userId))
        .then(rows => new Set(rows.map(r => r.eventId))),

      // ── Posts the current user has liked ─────────────────────────────────
      db
        .select({ postId: communityPostLikes.postId })
        .from(communityPostLikes)
        .where(eq(communityPostLikes.userId, userId))
        .then(rows => new Set(rows.map(r => r.postId))),
    ]);

    const [memberCount, postCount, discussionCount, eventCount] = stats;

    return {
      posts: postsData.map(p => ({
        ...p,
        isLiked: likedPostIds.has(p.id),
        authorName: p.isAnonymous
          ? 'Anonymous'
          : [p.authorName, p.authorLastName].filter(Boolean).join(' ') || 'Unknown',
      })),
      discussions: discussionsData.map(d => ({
        ...d,
        authorName: [d.authorName, d.authorLastName].filter(Boolean).join(' ') || 'Unknown',
      })),
      members: membersData.map(m => ({
        ...m,
        name: [m.firstName, m.lastName].filter(Boolean).join(' ') || 'Unknown',
        isFollowing: followingIds.has(m.id),
        isCurrentUser: m.id === userId,
      })),
      events: eventsData.map(e => ({
        ...e,
        isAttending: attendingEventIds.has(e.id),
      })),
      stats: { memberCount, postCount, discussionCount, eventCount },
      currentUserId: userId,
    };

  } catch (err) {
    console.error('[COMMUNITY LOAD]', err);
    throw error(500, 'Failed to load community data');
  }
};

// ==================== ACTIONS ====================

export const actions: Actions = {

  // Create post
  createPost: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });

    const form = await request.formData();
    const content     = form.get('content')    as string;
    const category    = form.get('category')   as string;
    const isAnonymous = form.get('isAnonymous') === 'true';
    const scope       = form.get('scope')      as string ?? 'global';
    const lat         = form.get('lat')        ? Number(form.get('lat'))  : null;
    const lng         = form.get('lng')        ? Number(form.get('lng'))  : null;
    const locationName = form.get('locationName') as string | null;

    if (!content?.trim()) return fail(400, { error: 'Content is required' });

    await db.insert(communityPosts).values({
      userId:      locals.user.id,
      content:     content.trim(),
      category:    category as any,
      scope:       scope as any,
      isAnonymous,
      lat,
      lng,
      locationName,
    });

    return { success: true };
  },

  // Toggle like on a post
  toggleLike: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });

    const form   = await request.formData();
    const postId = form.get('postId') as string;
    if (!postId) return fail(400, { error: 'Post ID required' });

    const existing = await db.query.communityPostLikes.findFirst({
      where: and(
        eq(communityPostLikes.postId, postId),
        eq(communityPostLikes.userId, locals.user.id)
      ),
    });

    if (existing) {
      await db.delete(communityPostLikes).where(eq(communityPostLikes.id, existing.id));
      await db.update(communityPosts)
        .set({ likeCount: sql`${communityPosts.likeCount} - 1` })
        .where(eq(communityPosts.id, postId));
      return { liked: false };
    } else {
      await db.insert(communityPostLikes).values({ postId, userId: locals.user.id });
      await db.update(communityPosts)
        .set({ likeCount: sql`${communityPosts.likeCount} + 1` })
        .where(eq(communityPosts.id, postId));
      return { liked: true };
    }
  },

  // Toggle follow
  toggleFollow: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });

    const form       = await request.formData();
    const followedId = form.get('followedId') as string;
    if (!followedId || followedId === locals.user.id) return fail(400, { error: 'Invalid' });

    const existing = await db.query.userFollows.findFirst({
      where: and(
        eq(userFollows.followerId, locals.user.id),
        eq(userFollows.followedId, followedId)
      ),
    });

    if (existing) {
      await db.delete(userFollows).where(eq(userFollows.id, existing.id));
      return { following: false };
    } else {
      await db.insert(userFollows).values({ followerId: locals.user.id, followedId });
      return { following: true };
    }
  },

  // Toggle event RSVP
  toggleRsvp: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });

    const form    = await request.formData();
    const eventId = form.get('eventId') as string;
    if (!eventId) return fail(400, { error: 'Event ID required' });

    const existing = await db.query.communityEventAttendees.findFirst({
      where: and(
        eq(communityEventAttendees.eventId, eventId),
        eq(communityEventAttendees.userId, locals.user.id)
      ),
    });

    if (existing) {
      await db.delete(communityEventAttendees).where(eq(communityEventAttendees.id, existing.id));
      await db.update(communityEvents)
        .set({ attendeeCount: sql`${communityEvents.attendeeCount} - 1` })
        .where(eq(communityEvents.id, eventId));
      return { attending: false };
    } else {
      // Check capacity
      const event = await db.query.communityEvents.findFirst({
        where: eq(communityEvents.id, eventId),
      });
      if (event?.maxAttendees && event.attendeeCount >= event.maxAttendees) {
        return fail(400, { error: 'Event is full' });
      }
      await db.insert(communityEventAttendees).values({ eventId, userId: locals.user.id });
      await db.update(communityEvents)
        .set({ attendeeCount: sql`${communityEvents.attendeeCount} + 1` })
        .where(eq(communityEvents.id, eventId));
      return { attending: true };
    }
  },
};
