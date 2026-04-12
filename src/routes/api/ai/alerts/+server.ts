// src/routes/api/ai/alerts/+server.ts
// Handles two concerns:
//   GET  /api/ai/alerts          → load user's alert zones from DB
//   POST /api/ai/alerts          → create a new alert zone
//   PATCH /api/ai/alerts         → toggle active/inactive
//   DELETE /api/ai/alerts        → delete a zone
//   POST /api/ai/alerts/analyse  → AI pattern detection on nearby incidents

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getGeminiKey,
  AI_MODEL,
  GEMINI_API_BASE,
  AI_DEFAULTS,
  SYSTEM_PROMPTS,
  type SeverityLevel,
} from '$lib/config/ai.config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AlertZone {
  id: string;
  userId: string;
  name: string;
  radius: number;              // km — enforced max 2km per spec
  categories: string[];
  severity: SeverityLevel[];
  isActive: boolean;
  location: string;
  lat?: number;
  lng?: number;
  createdAt: string;
  lastTriggered: string | null;
  notificationCount: number;
}

export interface AIPatternResult {
  patterns: {
    title: string;
    description: string;
    affected_area: string;
    incident_types: string[];
    risk_level: SeverityLevel;
    recommendation: string;
  }[];
  overall_risk: SeverityLevel;
  summary: string;
  analysed_at: string;
}

// ─── Radius Guard ─────────────────────────────────────────────────────────────
// Per spec: alerts are limited to users within 1–2km of an incident.
// Zone radius is therefore capped at 2km server-side — client slider can go
// higher but we clamp it here so no zone can ever exceed policy.

const MAX_RADIUS_KM = 2;

function clampRadius(radius: number): number {
  return Math.min(MAX_RADIUS_KM, Math.max(0.1, Number(radius) || 1));
}

// ─── Haversine (for filtering incidents to zone radius) ───────────────────────

function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── DB Stubs (replace with your Drizzle queries) ─────────────────────────────


import { db } from '$lib/server/db';
import { alertZones, reports, categories } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { haversineKm } from '$lib/server/db/geo';

// ── getZonesForUser ──────────────────────────────────────────
async function getZonesForUser(userId: string): Promise<AlertZone[]> {
  const rows = await db
    .select()
    .from(alertZones)
    .where(eq(alertZones.userId, userId))
    .orderBy(alertZones.createdAt);

  return rows.map(r => ({
    id:                r.id,
    userId:            r.userId,
    name:              r.name,
    radius:            r.radius,
    categories:        r.categories as string[],
    severity:          r.severity as SeverityLevel[],
    isActive:          r.isActive,
    location:          r.locationLabel ?? 'Custom Area',
    lat:               r.lat ? Number(r.lat) : undefined,
    lng:               r.lng ? Number(r.lng) : undefined,
    createdAt:         r.createdAt.toISOString(),
    lastTriggered:     r.lastTriggered?.toISOString() ?? null,
    notificationCount: r.notificationCount,
  }));
}

// ── createZoneInDB ───────────────────────────────────────────
async function createZoneInDB(
  zone: Omit<AlertZone, 'id' | 'createdAt' | 'lastTriggered' | 'notificationCount'>
): Promise<AlertZone> {
  const [created] = await db
    .insert(alertZones)
    .values({
      userId:        zone.userId,
      name:          zone.name,
      radius:        zone.radius,
      categories:    zone.categories,
      severity:      zone.severity,
      isActive:      zone.isActive,
      locationLabel: zone.location,
      lat:           zone.lat ? String(zone.lat) : null,
      lng:           zone.lng ? String(zone.lng) : null,
    })
    .returning();

  return {
    id:                created.id,
    userId:            created.userId,
    name:              created.name,
    radius:            created.radius,
    categories:        created.categories as string[],
    severity:          created.severity as SeverityLevel[],
    isActive:          created.isActive,
    location:          created.locationLabel ?? 'Custom Area',
    lat:               created.lat ? Number(created.lat) : undefined,
    lng:               created.lng ? Number(created.lng) : undefined,
    createdAt:         created.createdAt.toISOString(),
    lastTriggered:     null,
    notificationCount: 0,
  };
}

// ── toggleZoneInDB ───────────────────────────────────────────
async function toggleZoneInDB(zoneId: string, userId: string): Promise<boolean> {
  const [zone] = await db
    .select({ isActive: alertZones.isActive })
    .from(alertZones)
    .where(and(eq(alertZones.id, zoneId), eq(alertZones.userId, userId)));

  if (!zone) throw error(404, 'Alert zone not found.');

  await db
    .update(alertZones)
    .set({
      isActive:  !zone.isActive,
      updatedAt: new Date(),
    })
    .where(and(eq(alertZones.id, zoneId), eq(alertZones.userId, userId)));

  return !zone.isActive;
}

// ── deleteZoneFromDB ─────────────────────────────────────────
async function deleteZoneFromDB(zoneId: string, userId: string): Promise<void> {
  const result = await db
    .delete(alertZones)
    .where(and(eq(alertZones.id, zoneId), eq(alertZones.userId, userId)))
    .returning({ id: alertZones.id });

  if (result.length === 0) throw error(404, 'Alert zone not found.');
}

// ── getRecentIncidentsNearZones ──────────────────────────────
async function getRecentIncidentsNearZones(zones: AlertZone[]): Promise<object[]> {
  const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000);

  const rows = await db
    .select({
      id:           reports.id,
      title:        reports.title,
      severity:     reports.severity,
      location:     reports.location,
      locationName: reports.locationName,
      createdAt:    reports.createdAt,
      categoryName: categories.name,
    })
    .from(reports)
    .innerJoin(categories, eq(reports.categoryId, categories.id))
    .where(gte(reports.createdAt, cutoff));

  return rows.filter(r => {
    const loc = r.location as { lat?: number; lng?: number } | null;
    if (!loc?.lat || !loc?.lng) return false;
    return zones.some(zone => {
      if (!zone.lat || !zone.lng) return false;
      return haversineKm(zone.lat, zone.lng, loc.lat!, loc.lng!) <= zone.radius;
    });
  }).map(r => {
    const loc = r.location as { lat: number; lng: number };
    return {
      id:           r.id,
      title:        r.title,
      category:     r.categoryName,
      severity:     r.severity,
      location:     r.locationName,
      lat:          loc.lat,
      lng:          loc.lng,
      reportedAt:   r.createdAt.toISOString(),
    };
  });
}
// ─── AI Pattern Detection ─────────────────────────────────────────────────────

async function analysePatterns(
  incidents: object[],
  zones: AlertZone[]
): Promise<AIPatternResult> {
  const key = getGeminiKey();
  const url = `${GEMINI_API_BASE}/models/${AI_MODEL}:generateContent?key=${key}`;

  const zonesSummary = zones
    .map(z => `- "${z.name}" (${z.radius}km radius, watching: ${z.categories.join(', ')})`)
    .join('\n');

  const incidentsSummary = incidents.length > 0
    ? JSON.stringify(incidents, null, 2)
    : 'No incidents reported in these zones in the last 72 hours.';

  const userPrompt = `
Active alert zones for this user:
${zonesSummary}

Recent incidents within these zones (last 72 hours):
${incidentsSummary}

Analyse the incidents above and identify any patterns, trends, or emerging risks.
Return the JSON as instructed.
`.trim();

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPTS.smartAlerts }],
    },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      ...AI_DEFAULTS,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[smart-alerts] Gemini error:', res.status, errText);
    throw error(502, `AI service error (${res.status}). Please try again.`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error('[smart-alerts] Unexpected Gemini shape:', JSON.stringify(data));
    throw error(502, 'AI returned an unexpected response. Please try again.');
  }

  let parsed: AIPatternResult;
  try {
    const clean = text.replace(/```json|```/gi, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    console.error('[smart-alerts] Failed to parse AI JSON:', text);
    throw error(502, 'AI returned malformed JSON. Please try again.');
  }

  return {
    ...parsed,
    analysed_at: new Date().toISOString(),
  };
}

// ─── Auth Helper ──────────────────────────────────────────────────────────────
// Swap this for your real session check (Better Auth / your auth-client pattern)

import { auth } from '$lib/server/auth';

async function requireUser(request: Request): Promise<string> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) throw error(401, 'Unauthorised.');

  // Resolve to your internal users.id via the hashable link
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.hashable, session.user.id));

  if (!user) throw error(401, 'User not found.');
  return user.id;
}

  // ── AI analysis sub-route ─────────────────────────────────────────────────
  if (url.pathname.endsWith('/analyse')) {
    const zones = await getZonesForUser(userId);
    const activeZones = zones.filter(z => z.isActive);

    if (activeZones.length === 0) {
      return json({
        patterns:     [],
        overall_risk: 'low',
        summary:      'No active alert zones to analyse.',
        analysed_at:  new Date().toISOString(),
      } satisfies AIPatternResult);
    }

    const incidents = await getRecentIncidentsNearZones(activeZones);
    const result = await analysePatterns(incidents, activeZones);
    return json(result, { status: 200 });
  }

  // ── Create new zone ───────────────────────────────────────────────────────
  const { name, radius, categories, severity, isActive, location, lat, lng } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw error(400, 'Field "name" is required (min 2 characters).');
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    throw error(400, 'At least one category is required.');
  }
  if (!Array.isArray(severity) || severity.length === 0) {
    throw error(400, 'At least one severity level is required.');
  }

  const newZone = await createZoneInDB({
    userId,
    name:       name.trim(),
    radius:     clampRadius(radius as number),   // ← radius capped at 2km
    categories: categories as string[],
    severity:   severity as SeverityLevel[],
    isActive:   typeof isActive === 'boolean' ? isActive : true,
    location:   typeof location === 'string' ? location.trim() : 'Custom Area',
    lat:        typeof lat === 'number' ? lat : undefined,
    lng:        typeof lng === 'number' ? lng : undefined,
  });

  return json({ zone: newZone }, { status: 201 });
};

// PATCH — toggle a zone's active state
export const PATCH: RequestHandler = async ({ request }) => {
  const userId = await requireUser(request);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON in request body.');
  }

  const { zoneId } = body;
  if (!zoneId || typeof zoneId !== 'string') {
    throw error(400, 'Field "zoneId" is required.');
  }

  const newState = await toggleZoneInDB(zoneId, userId);
  return json({ isActive: newState }, { status: 200 });
};

// DELETE — remove a zone
export const DELETE: RequestHandler = async ({ request }) => {
  const userId = await requireUser(request);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON in request body.');
  }

  const { zoneId } = body;
  if (!zoneId || typeof zoneId !== 'string') {
    throw error(400, 'Field "zoneId" is required.');
  }

  await deleteZoneFromDB(zoneId, userId);
  return json({ deleted: true }, { status: 200 });
};
