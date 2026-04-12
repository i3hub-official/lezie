// src/routes/api/ai/chat/+server.ts
// Streaming-capable safety assistant chat endpoint.
// Accepts user messages + live GPS coords, queries nearby incidents (≤2km),
// injects them as context, then streams Gemini's reply back.

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getGeminiKey,
  AI_MODEL,
  GEMINI_API_BASE,
  AI_CHAT_DEFAULTS,
  SYSTEM_PROMPTS,
} from '$lib/config/ai.config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];   // full conversation history
  lat: number;               // user's live GPS latitude
  lng: number;               // user's live GPS longitude
  radius_km?: number;        // default 2
}

export interface NearbyIncident {
  id: string;
  title: string;
  category: string;
  severity: string;
  distance_km: number;       // calculated server-side
  reported_at: string;
  location_label?: string;
}

export interface ChatResponse {
  reply: string;
  nearby_incident_count: number;  // so the UI can show "based on X nearby incidents"
}

// ─── Haversine Distance (km) ──────────────────────────────────────────────────

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

// ─── Fetch Nearby Incidents from DB ──────────────────────────────────────────
// TODO: swap the stub below for your real DB query once your reports table
// has lat/lng columns. The interface above matches what the AI context needs.

import { db } from '$lib/server/db';
import { reports, categories, statuses } from '$lib/server/db/schema';
import { gte, eq } from 'drizzle-orm';
import { haversineKm } from '$lib/server/db/geo';

async function fetchNearbyIncidents(
  lat: number,
  lng: number,
  radius_km: number
): Promise<NearbyIncident[]> {
  // Last 48 hours
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

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

  return rows
    .map(r => {
      const loc = r.location as { lat?: number; lng?: number } | null;
      if (!loc?.lat || !loc?.lng) return null;
      return {
        id:             r.id,
        title:          r.title,
        category:       r.categoryName,
        severity:       r.severity,
        distance_km:    haversineKm(lat, lng, loc.lat, loc.lng),
        reported_at:    r.createdAt.toISOString(),
        location_label: r.locationName ?? undefined,
      };
    })
    .filter((r): r is NearbyIncident => r !== null && r.distance_km <= radius_km)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 10);
}

// ─── Build Context Block from Nearby Incidents ────────────────────────────────

function buildIncidentContext(incidents: NearbyIncident[]): string {
  if (incidents.length === 0) {
    return 'No incidents have been reported within 2km of the user in the last 48 hours.';
  }

  const lines = incidents.map((inc, i) => {
    const dist = inc.distance_km < 1
      ? `${Math.round(inc.distance_km * 1000)}m away`
      : `${inc.distance_km.toFixed(1)}km away`;

    const when = new Date(inc.reported_at).toLocaleString('en-NG', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    return `${i + 1}. [${inc.severity.toUpperCase()}] ${inc.title} — ${inc.category} — ${dist} — reported ${when}${inc.location_label ? ` at ${inc.location_label}` : ''}`;
  });

  return `Recent incidents within 2km of the user:\n${lines.join('\n')}`;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateRequest(body: unknown): ChatRequest {
  if (!body || typeof body !== 'object') {
    throw error(400, 'Request body must be a JSON object.');
  }

  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.messages) || b.messages.length === 0) {
    throw error(400, 'Field "messages" must be a non-empty array.');
  }

  // Validate each message
  const messages: ChatMessage[] = b.messages.map((m: unknown, i: number) => {
    if (!m || typeof m !== 'object') throw error(400, `messages[${i}] must be an object.`);
    const msg = m as Record<string, unknown>;
    if (msg.role !== 'user' && msg.role !== 'model') {
      throw error(400, `messages[${i}].role must be "user" or "model".`);
    }
    if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
      throw error(400, `messages[${i}].content must be a non-empty string.`);
    }
    return { role: msg.role, content: msg.content.trim() };
  });

  // Last message must be from user
  if (messages[messages.length - 1].role !== 'user') {
    throw error(400, 'Last message must have role "user".');
  }

  const lat = Number(b.lat);
  const lng = Number(b.lng);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw error(400, 'Field "lat" must be a valid latitude (-90 to 90).');
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw error(400, 'Field "lng" must be a valid longitude (-180 to 180).');
  }

  const radius_km = Number.isFinite(Number(b.radius_km))
    ? Math.min(5, Math.max(0.5, Number(b.radius_km)))  // clamp 0.5–5km
    : 2;

  return { messages, lat, lng, radius_km };
}

// ─── Gemini Call ──────────────────────────────────────────────────────────────

async function callGemini(
  messages: ChatMessage[],
  incidentContext: string
): Promise<string> {
  const key = getGeminiKey();
  const url = `${GEMINI_API_BASE}/models/${AI_MODEL}:generateContent?key=${key}`;

  // Inject incident context as a system-level note appended to the base prompt
  const fullSystemPrompt = `${SYSTEM_PROMPTS.safetyAssistant}

─── Live Neighbourhood Context ───
${incidentContext}
──────────────────────────────────`;

  // Map our ChatMessage[] to Gemini's contents format
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: {
      parts: [{ text: fullSystemPrompt }],
    },
    contents,
    generationConfig: {
      ...AI_CHAT_DEFAULTS,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[chat] Gemini API error:', res.status, errText);
    throw error(502, `AI service error (${res.status}). Please try again.`);
  }

  const data = await res.json();

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error('[chat] Unexpected Gemini response shape:', JSON.stringify(data));
    throw error(502, 'AI returned an unexpected response. Please try again.');
  }

  return text.trim();
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request }) => {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    throw error(400, 'Invalid JSON in request body.');
  }

  const { messages, lat, lng, radius_km } = validateRequest(rawBody);

  // Fetch nearby incidents (within radius) from DB
  const nearbyIncidents = await fetchNearbyIncidents(lat, lng, radius_km ?? 2);

  // Build context string to inject into system prompt
  const incidentContext = buildIncidentContext(nearbyIncidents);

  // Call Gemini with full conversation history + injected context
  const reply = await callGemini(messages, incidentContext);

  const result: ChatResponse = {
    reply,
    nearby_incident_count: nearbyIncidents.length,
  };

  return json(result, { status: 200 });
};