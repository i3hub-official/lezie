// src/routes/api/settings/+server.ts
// GET  → load user's current preferences
// PATCH → save updated preferences

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userPreferences, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SettingsPayload {
  notifications: {
    push:            boolean;
    email:           boolean;
    sms:             boolean;
    incidentNearby:  boolean;
    reportVerified:  boolean;
  };
  privacy: {
    anonymousReporting: boolean;
    showLocation:       boolean;
    profileVisibility:  string;
  };
  appearance: {
    theme:    string;
    language: string;
  };
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export const GET: RequestHandler = async ({ locals }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorised.');

  const [prefs] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));

  if (!prefs) {
    // Return defaults if no prefs row yet (shouldn't happen — auth hook creates it)
    return json(defaultSettings());
  }

  // Map DB columns → settings shape the component expects
  const data = prefs.data as Record<string, unknown> | null;

  return json({
    notifications: {
      push:           (data?.notif_push           ?? true)  as boolean,
      email:          prefs.notifyCritical !== undefined
                        ? ((data?.notif_email     ?? false) as boolean)
                        : false,
      sms:            (data?.notif_sms            ?? true)  as boolean,
      incidentNearby: (data?.notif_incidentNearby ?? true)  as boolean,
      reportVerified: (data?.notif_reportVerified ?? true)  as boolean,
    },
    privacy: {
      anonymousReporting: (data?.privacy_anonymous   ?? true)        as boolean,
      showLocation:       (data?.privacy_showLocation ?? false)       as boolean,
      profileVisibility:  (data?.privacy_visibility   ?? 'community') as string,
    },
    appearance: {
      theme:    prefs.theme    ?? 'light',
      language: prefs.language ?? 'en',
    },
  });
};

// ─── PATCH ────────────────────────────────────────────────────────────────────

export const PATCH: RequestHandler = async ({ locals, request }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorised.');

  let body: SettingsPayload;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON.');
  }

  const { notifications, privacy, appearance } = body;

  // We store notification toggles and privacy flags in the jsonb `data` column
  // (userPreferences doesn't have individual columns for all of these).
  // The columns that do exist (theme, language, notifyCritical etc.) are updated directly.

  const dataJson = {
    notif_push:            notifications.push,
    notif_email:           notifications.email,
    notif_sms:             notifications.sms,
    notif_incidentNearby:  notifications.incidentNearby,
    notif_reportVerified:  notifications.reportVerified,
    privacy_anonymous:     privacy.anonymousReporting,
    privacy_showLocation:  privacy.showLocation,
    privacy_visibility:    privacy.profileVisibility,
  };

  // Check if prefs row exists
  const [existing] = await db
    .select({ id: userPreferences.id })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));

  if (existing) {
    await db
      .update(userPreferences)
      .set({
        theme:          appearance.theme,
        language:       appearance.language,
        notifyCritical: notifications.push,  // map push → notifyCritical as closest match
        data:           dataJson,
        updatedAt:      new Date(),
      } as any)
      .where(eq(userPreferences.userId, userId));
  } else {
    // Shouldn't happen in normal flow but handle gracefully
    await db
      .insert(userPreferences)
      .values({
        id:             nanoid(),
        userId,
        theme:          appearance.theme,
        language:       appearance.language,
        notifyCritical: notifications.push,
        data:           dataJson,
      } as any);
  }

  return json({ ok: true });
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

function defaultSettings() {
  return {
    notifications: {
      push:           true,
      email:          false,
      sms:            true,
      incidentNearby: true,
      reportVerified: true,
    },
    privacy: {
      anonymousReporting: true,
      showLocation:       false,
      profileVisibility:  'community',
    },
    appearance: {
      theme:    'light',
      language: 'en',
    },
  };
}
