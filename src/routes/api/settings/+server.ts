// src/routes/api/settings/+server.ts
// GET  → load settings + tier context for the current user
// PATCH → save settings (server-side tier sanitisation applied)

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userPreferences, users, reports } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import {
  DEFAULT_SETTINGS,
  resolveUnlockedFeatures,
  sanitiseSettings,
  type UserSettingsData,
  type SettingsResponse,
} from '$lib/config/settings.config';

// ─── GET ──────────────────────────────────────────────────────────────────────

export const GET: RequestHandler = async ({ locals }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorised.');

  const [prefs, account, reportCountResult] = await Promise.all([
    db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .then(r => r[0] ?? null),

    db
      .select({ tier: users.tier, kycStatus: users.kycStatus, trustScore: users.trustScore })
      .from(users)
      .where(eq(users.id, userId))
      .then(r => r[0] ?? { tier: '1', kycStatus: 'pending', trustScore: 0 }),

    db
      .select({ count: count() })
      .from(reports)
      .where(eq(reports.userId, userId))
      .then(r => Number(r[0]?.count ?? 0)),
  ]);

  const unlocked = resolveUnlockedFeatures(
    account.tier,
    account.kycStatus,
    account.trustScore,
    reportCountResult
  );

  const savedData = (prefs?.data as UserSettingsData | null) ?? {};
  const settings: UserSettingsData = {
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(savedData.notifications ?? {}) },
    privacy:       { ...DEFAULT_SETTINGS.privacy,       ...(savedData.privacy       ?? {}) },
    appearance: {
      theme:    (prefs?.theme    as UserSettingsData['appearance']['theme']) ?? DEFAULT_SETTINGS.appearance.theme,
      language: prefs?.language  ?? DEFAULT_SETTINGS.appearance.language,
    },
  };

  const sanitised = sanitiseSettings(settings, unlocked, DEFAULT_SETTINGS);

  const response: SettingsResponse = {
    ...sanitised,
    tier:             account.tier,
    kycStatus:        account.kycStatus,
    trustScore:       account.trustScore,
    reportCount:      reportCountResult,
    unlockedFeatures: unlocked,
  };

  return json(response);
};

// ─── PATCH ────────────────────────────────────────────────────────────────────

export const PATCH: RequestHandler = async ({ locals, request }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorised.');

  let body: Partial<UserSettingsData>;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON.');
  }

  const [account, prefs, reportCountResult] = await Promise.all([
    db
      .select({ tier: users.tier, kycStatus: users.kycStatus, trustScore: users.trustScore })
      .from(users)
      .where(eq(users.id, userId))
      .then(r => r[0] ?? { tier: '1', kycStatus: 'pending', trustScore: 0 }),

    db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .then(r => r[0] ?? null),

    db
      .select({ count: count() })
      .from(reports)
      .where(eq(reports.userId, userId))
      .then(r => Number(r[0]?.count ?? 0)),
  ]);

  const unlocked = resolveUnlockedFeatures(
    account.tier,
    account.kycStatus,
    account.trustScore,
    reportCountResult
  );

  const existingData = (prefs?.data as UserSettingsData | null) ?? DEFAULT_SETTINGS;
  const existing: UserSettingsData = {
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(existingData.notifications ?? {}) },
    privacy:       { ...DEFAULT_SETTINGS.privacy,       ...(existingData.privacy       ?? {}) },
    appearance: {
      theme:    (prefs?.theme    as UserSettingsData['appearance']['theme']) ?? DEFAULT_SETTINGS.appearance.theme,
      language: prefs?.language  ?? DEFAULT_SETTINGS.appearance.language,
    },
  };

  const sanitised = sanitiseSettings(body, unlocked, existing);

  if (prefs) {
    await db
      .update(userPreferences)
      .set({
        theme:          sanitised.appearance.theme,
        language:       sanitised.appearance.language,
        notifyCritical: sanitised.notifications.push,
        data:           sanitised as any,
        updatedAt:      new Date(),
      })
      .where(eq(userPreferences.userId, userId));
  } else {
    const { nanoid } = await import('nanoid');
    await db
      .insert(userPreferences)
      .values({
        id:             nanoid(),
        userId,
        theme:          sanitised.appearance.theme,
        language:       sanitised.appearance.language,
        notifyCritical: sanitised.notifications.push,
        data:           sanitised as any,
      });
  }

  return json({ ok: true, unlockedFeatures: unlocked });
};
