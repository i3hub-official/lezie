// src/routes/api/ai/summarise-feed/+server.ts
// Accepts recent neighbourhood feed posts/incidents and returns a
// human-friendly AI summary: headline, summary, safety tip, and mood.

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getGeminiKey,
  AI_MODEL,
  GEMINI_API_BASE,
  AI_DEFAULTS,
  SYSTEM_PROMPTS,
} from '$lib/config/ai.config';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedMood = 'calm' | 'watchful' | 'tense' | 'urgent';

export interface FeedItem {
  id: string;
  type: 'incident' | 'post' | 'alert';
  title: string;
  body?: string;
  category?: string;
  severity?: string;
  location?: string;
  distance_km?: number;       // from user's position — only items ≤2km are sent
  reported_at: string;
}

export interface SummariseFeedRequest {
  items: FeedItem[];
  neighbourhood?: string;     // e.g. "Surulere, Lagos" — for context in summary
}

export interface SummariseFeedResponse {
  headline: string;
  summary: string;
  safety_tip: string;
  mood: FeedMood;
  item_count: number;         // how many items were summarised
  generated_at: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateRequest(body: unknown): SummariseFeedRequest {
  if (!body || typeof body !== 'object') {
    throw error(400, 'Request body must be a JSON object.');
  }

  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.items) || b.items.length === 0) {
    throw error(400, 'Field "items" must be a non-empty array.');
  }

  if (b.items.length > 50) {
    throw error(400, 'Maximum 50 feed items per request.');
  }

  // Validate each item has the minimum fields
  const items: FeedItem[] = b.items.map((item: unknown, i: number) => {
    if (!item || typeof item !== 'object') {
      throw error(400, `items[${i}] must be an object.`);
    }
    const it = item as Record<string, unknown>;
    if (!it.id || typeof it.title !== 'string' || !it.reported_at) {
      throw error(400, `items[${i}] must have id, title, and reported_at.`);
    }
    return {
      id:          String(it.id),
      type:        (it.type as FeedItem['type']) || 'post',
      title:       String(it.title).trim(),
      body:        typeof it.body === 'string' ? it.body.trim() : undefined,
      category:    typeof it.category === 'string' ? it.category : undefined,
      severity:    typeof it.severity === 'string' ? it.severity : undefined,
      location:    typeof it.location === 'string' ? it.location : undefined,
      distance_km: typeof it.distance_km === 'number' ? it.distance_km : undefined,
      reported_at: String(it.reported_at),
    };
  });

  return {
    items,
    neighbourhood: typeof b.neighbourhood === 'string' ? b.neighbourhood.trim() : undefined,
  };
}

// ─── Format Items for Prompt ──────────────────────────────────────────────────
// Condenses feed items into a compact, token-efficient format for Gemini

function formatItemsForPrompt(items: FeedItem[]): string {
  return items.map((item, i) => {
    const when = new Date(item.reported_at).toLocaleString('en-NG', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const dist = item.distance_km !== undefined
      ? item.distance_km < 1
        ? `${Math.round(item.distance_km * 1000)}m away`
        : `${item.distance_km.toFixed(1)}km away`
      : null;

    const parts = [
      `${i + 1}. [${item.type.toUpperCase()}]`,
      item.severity ? `[${item.severity.toUpperCase()}]` : null,
      item.title,
      item.category ? `(${item.category})` : null,
      dist,
      item.location ? `at ${item.location}` : null,
      `— ${when}`,
    ].filter(Boolean);

    const line = parts.join(' ');

    // Include body snippet if present (truncated to keep prompt lean)
    if (item.body && item.body.length > 0) {
      return `${line}\n   "${item.body.slice(0, 120)}${item.body.length > 120 ? '...' : ''}"`;
    }

    return line;
  }).join('\n');
}

// ─── Gemini Call ──────────────────────────────────────────────────────────────

async function callGemini(
  items: FeedItem[],
  neighbourhood?: string
): Promise<Omit<SummariseFeedResponse, 'item_count' | 'generated_at'>> {
  const key = getGeminiKey();
  const url = `${GEMINI_API_BASE}/models/${AI_MODEL}:generateContent?key=${key}`;

  const formattedItems = formatItemsForPrompt(items);

  const userPrompt = `
${neighbourhood ? `Neighbourhood: ${neighbourhood}\n` : ''}Feed items (${items.length} total, all within 2km of the user):

${formattedItems}

Summarise this neighbourhood feed and return the JSON as instructed.
`.trim();

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPTS.feedSummary }],
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
    console.error('[summarise-feed] Gemini error:', res.status, errText);
    throw error(502, `AI service error (${res.status}). Please try again.`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error('[summarise-feed] Unexpected Gemini shape:', JSON.stringify(data));
    throw error(502, 'AI returned an unexpected response. Please try again.');
  }

  let parsed: Record<string, unknown>;
  try {
    const clean = text.replace(/```json|```/gi, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    console.error('[summarise-feed] Failed to parse AI JSON:', text);
    throw error(502, 'AI returned malformed JSON. Please try again.');
  }

  // Sanitise mood — fall back to 'watchful' if unrecognised
  const validMoods: FeedMood[] = ['calm', 'watchful', 'tense', 'urgent'];
  const mood: FeedMood = validMoods.includes(parsed.mood as FeedMood)
    ? (parsed.mood as FeedMood)
    : 'watchful';

  return {
    headline:   typeof parsed.headline === 'string'   ? parsed.headline   : 'Neighbourhood update',
    summary:    typeof parsed.summary === 'string'    ? parsed.summary    : '',
    safety_tip: typeof parsed.safety_tip === 'string' ? parsed.safety_tip : '',
    mood,
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request }) => {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    throw error(400, 'Invalid JSON in request body.');
  }

  const { items, neighbourhood } = validateRequest(rawBody);

  const result = await callGemini(items, neighbourhood);

  const response: SummariseFeedResponse = {
    ...result,
    item_count:   items.length,
    generated_at: new Date().toISOString(),
  };

  return json(response, { status: 200 });
};
