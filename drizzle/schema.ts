import { pgTable, uniqueIndex, uuid, text, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const sessions = pgTable("sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	token: varchar({ length: 500 }).notNull(),
	deviceInfo: jsonb("device_info"),
	ipAddress: varchar("ip_address", { length: 45 }),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastActive: timestamp("last_active", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("sessions_token_idx").using("btree", table.token.asc().nullsLast().op("text_ops")),
]);

export const notifications = pgTable("notifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	title: varchar({ length: 200 }).notNull(),
	body: text().notNull(),
	data: jsonb(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const rateLimit = pgTable("rate_limit", {
	id: text().primaryKey().notNull(),
	key: text().notNull(),
	count: text().notNull(),
	lastRequest: timestamp("last_request", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("auth_rate_limit_key_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
]);
