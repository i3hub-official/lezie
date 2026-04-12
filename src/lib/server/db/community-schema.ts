// src/lib/server/db/community-schema.ts

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  uniqueIndex,
  real,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users, userProfiles } from './schema';

// ==================== ENUMS ====================

export const postCategoryEnum = pgEnum('post_category', [
  'general', 'safety', 'alerts', 'questions', 'success'
]);

export const postScopeEnum = pgEnum('post_scope', [
  'global', 'local'   // local = within radius of post's location
]);

export const eventCategoryEnum = pgEnum('event_category', [
  'workshop', 'meeting', 'training', 'social', 'other'
]);

export const discussionCategoryEnum = pgEnum('discussion_category', [
  'general', 'safety', 'alerts', 'questions', 'success'
]);

export const followStatusEnum = pgEnum('follow_status', [
  'pending', 'accepted'
]);

// ==================== COMMUNITY POSTS ====================

export const communityPosts = pgTable('community_posts', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  content:     text('content').notNull(),
  category:    postCategoryEnum('category').notNull().default('general'),
  scope:       postScopeEnum('scope').notNull().default('global'),

  // Location — required for local-scoped posts, optional for global
  lat:         real('lat'),
  lng:         real('lng'),
  locationName: varchar('location_name', { length: 255 }),

  isAnonymous: boolean('is_anonymous').notNull().default(false),
  isPinned:    boolean('is_pinned').notNull().default(false),
  isVerified:  boolean('is_verified').notNull().default(false),

  // Denormalised counts — updated via triggers or app logic
  likeCount:    integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  shareCount:   integer('share_count').notNull().default(0),

  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('community_posts_user_id_idx').on(table.userId),
  index('community_posts_category_idx').on(table.category),
  index('community_posts_scope_idx').on(table.scope),
  index('community_posts_created_at_idx').on(table.createdAt),
  index('community_posts_location_idx').on(table.lat, table.lng),
]);

// ==================== POST LIKES ====================

export const communityPostLikes = pgTable('community_post_likes', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').notNull().references(() => communityPosts.id, { onDelete: 'cascade' }),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('community_post_likes_unique').on(table.postId, table.userId),
  index('community_post_likes_post_id_idx').on(table.postId),
  index('community_post_likes_user_id_idx').on(table.userId),
]);

// ==================== POST COMMENTS ====================

export const communityComments = pgTable('community_comments', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').notNull().references(() => communityPosts.id, { onDelete: 'cascade' }),
  userId:    text('user_id').references(() => users.id, { onDelete: 'set null' }),
  content:   text('content').notNull(),
  isAnonymous: boolean('is_anonymous').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('community_comments_post_id_idx').on(table.postId),
  index('community_comments_user_id_idx').on(table.userId),
  index('community_comments_created_at_idx').on(table.createdAt),
]);

// ==================== DISCUSSIONS ====================

export const communityDiscussions = pgTable('community_discussions', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      text('user_id').references(() => users.id, { onDelete: 'set null' }),
  title:       varchar('title', { length: 300 }).notNull(),
  body:        text('body').notNull(),
  category:    discussionCategoryEnum('category').notNull().default('general'),
  scope:       postScopeEnum('scope').notNull().default('global'),

  lat:         real('lat'),
  lng:         real('lng'),
  locationName: varchar('location_name', { length: 255 }),

  isSticky:    boolean('is_sticky').notNull().default(false),
  isClosed:    boolean('is_closed').notNull().default(false),

  replyCount:  integer('reply_count').notNull().default(0),
  viewCount:   integer('view_count').notNull().default(0),
  lastActivityAt: timestamp('last_activity_at').notNull().defaultNow(),

  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('community_discussions_user_id_idx').on(table.userId),
  index('community_discussions_category_idx').on(table.category),
  index('community_discussions_last_activity_idx').on(table.lastActivityAt),
  index('community_discussions_sticky_idx').on(table.isSticky),
]);

// ==================== DISCUSSION REPLIES ====================

export const communityDiscussionReplies = pgTable('community_discussion_replies', {
  id:           uuid('id').primaryKey().defaultRandom(),
  discussionId: uuid('discussion_id').notNull().references(() => communityDiscussions.id, { onDelete: 'cascade' }),
  userId:       text('user_id').references(() => users.id, { onDelete: 'set null' }),
  content:      text('content').notNull(),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
  updatedAt:    timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('community_discussion_replies_discussion_id_idx').on(table.discussionId),
  index('community_discussion_replies_user_id_idx').on(table.userId),
]);

// ==================== EVENTS ====================

export const communityEvents = pgTable('community_events', {
  id:           uuid('id').primaryKey().defaultRandom(),
  userId:       text('user_id').references(() => users.id, { onDelete: 'set null' }),
  title:        varchar('title', { length: 300 }).notNull(),
  description:  text('description').notNull(),
  category:     eventCategoryEnum('category').notNull().default('other'),

  location:     varchar('location', { length: 255 }).notNull(),
  lat:          real('lat'),
  lng:          real('lng'),

  startsAt:     timestamp('starts_at').notNull(),
  endsAt:       timestamp('ends_at'),
  maxAttendees: integer('max_attendees'),

  attendeeCount: integer('attendee_count').notNull().default(0),
  isCancelled:   boolean('is_cancelled').notNull().default(false),

  createdAt:    timestamp('created_at').notNull().defaultNow(),
  updatedAt:    timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('community_events_user_id_idx').on(table.userId),
  index('community_events_starts_at_idx').on(table.startsAt),
  index('community_events_category_idx').on(table.category),
  index('community_events_location_idx').on(table.lat, table.lng),
]);

// ==================== EVENT ATTENDEES ====================

export const communityEventAttendees = pgTable('community_event_attendees', {
  id:        uuid('id').primaryKey().defaultRandom(),
  eventId:   uuid('event_id').notNull().references(() => communityEvents.id, { onDelete: 'cascade' }),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('community_event_attendees_unique').on(table.eventId, table.userId),
  index('community_event_attendees_event_id_idx').on(table.eventId),
  index('community_event_attendees_user_id_idx').on(table.userId),
]);

// ==================== USER FOLLOWS ====================

export const userFollows = pgTable('user_follows', {
  id:         uuid('id').primaryKey().defaultRandom(),
  followerId: text('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  followedId: text('followed_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status:     followStatusEnum('status').notNull().default('accepted'),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('user_follows_unique').on(table.followerId, table.followedId),
  index('user_follows_follower_id_idx').on(table.followerId),
  index('user_follows_followed_id_idx').on(table.followedId),
]);

// ==================== RELATIONS ====================

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  author:   one(users,            { fields: [communityPosts.userId],   references: [users.id] }),
  likes:    many(communityPostLikes),
  comments: many(communityComments),
}));

export const communityPostLikesRelations = relations(communityPostLikes, ({ one }) => ({
  post: one(communityPosts, { fields: [communityPostLikes.postId], references: [communityPosts.id] }),
  user: one(users,          { fields: [communityPostLikes.userId], references: [users.id] }),
}));

export const communityCommentsRelations = relations(communityComments, ({ one }) => ({
  post:   one(communityPosts, { fields: [communityComments.postId],   references: [communityPosts.id] }),
  author: one(users,          { fields: [communityComments.userId],   references: [users.id] }),
}));

export const communityDiscussionsRelations = relations(communityDiscussions, ({ one, many }) => ({
  author:  one(users,                      { fields: [communityDiscussions.userId], references: [users.id] }),
  replies: many(communityDiscussionReplies),
}));

export const communityDiscussionRepliesRelations = relations(communityDiscussionReplies, ({ one }) => ({
  discussion: one(communityDiscussions, { fields: [communityDiscussionReplies.discussionId], references: [communityDiscussions.id] }),
  author:     one(users,                { fields: [communityDiscussionReplies.userId],       references: [users.id] }),
}));

export const communityEventsRelations = relations(communityEvents, ({ one, many }) => ({
  organiser: one(users,                    { fields: [communityEvents.userId], references: [users.id] }),
  attendees: many(communityEventAttendees),
}));

export const communityEventAttendeesRelations = relations(communityEventAttendees, ({ one }) => ({
  event: one(communityEvents, { fields: [communityEventAttendees.eventId], references: [communityEvents.id] }),
  user:  one(users,           { fields: [communityEventAttendees.userId],  references: [users.id] }),
}));

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, { fields: [userFollows.followerId], references: [users.id], relationName: 'follower' }),
  followed: one(users, { fields: [userFollows.followedId], references: [users.id], relationName: 'followed' }),
}));
