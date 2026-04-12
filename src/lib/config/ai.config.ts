// src/lib/config/ai.config.ts
// Central configuration for Lezie's AI features (powered by Google Gemini)
// Get your free API key at: https://aistudio.google.com

import { GEMINI_API_KEY } from '$env/static/private';

// ─── Model Config ────────────────────────────────────────────────────────────

export const AI_MODEL = 'gemini-2.0-flash';

export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const getGeminiKey = (): string => {
  if (!GEMINI_API_KEY) {
    throw new Error('[Lezie AI] GEMINI_API_KEY is not set. Add it to your .env file.');
  }
  return GEMINI_API_KEY;
};

// ─── Generation Defaults ─────────────────────────────────────────────────────

export const AI_DEFAULTS = {
  temperature: 0.4,       // Low = more predictable/structured (good for analysis)
  topP: 0.9,
  maxOutputTokens: 1024,
} as const;

export const AI_CHAT_DEFAULTS = {
  temperature: 0.7,       // Slightly higher = more natural conversation
  topP: 0.95,
  maxOutputTokens: 512,
} as const;

// ─── Incident Categories ──────────────────────────────────────────────────────
// Keep in sync with your DB schema incident type enum

export const INCIDENT_CATEGORIES = [
  'theft',
  'assault',
  'vandalism',
  'fire',
  'flooding',
  'suspicious_activity',
  'road_accident',
  'medical_emergency',
  'kidnapping',
  'armed_robbery',
  'civil_unrest',
  'noise_complaint',
  'other',
] as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];

// ─── Severity Levels ──────────────────────────────────────────────────────────

export const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'] as const;

export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const SEVERITY_COLOURS: Record<SeverityLevel, string> = {
  low:      '#4caf50',
  medium:   '#ff9800',
  high:     '#f44336',
  critical: '#9c27b0',
};

// ─── Rate Limiting (client-side guard — real guard is server-side) ────────────

export const AI_RATE_LIMITS = {
  reportAnalysis: { maxPerHour: 20 },
  chat:           { maxPerHour: 60 },
  smartAlerts:    { maxPerHour: 10 },
  feedSummary:    { maxPerHour: 30 },
} as const;

// ─── System Prompts ───────────────────────────────────────────────────────────
// Centralised here so every endpoint stays consistent with Lezie's context

export const SYSTEM_PROMPTS = {

  reportAnalysis: `
You are Lezie's incident analysis engine for Nigerian communities.
Your job is to analyse an incident report and return structured JSON only.
No markdown, no explanation — raw JSON only.

Context: Lezie is a community safety platform used across Nigerian neighbourhoods.
Consider local context (e.g. "one chance" = vehicle robbery, "area boys" = street gang activity).

You must return exactly this shape:
{
  "category": "<one of: theft | assault | vandalism | fire | flooding | suspicious_activity | road_accident | medical_emergency | kidnapping | armed_robbery | civil_unrest | noise_complaint | other>",
  "severity": "<one of: low | medium | high | critical>",
  "severity_score": <integer 1–10>,
  "tags": ["<tag1>", "<tag2>"],
  "summary": "<one sentence plain-English summary>",
  "recommended_action": "<brief advice for the community or responders>",
  "confidence": <float 0.0–1.0>
}
`.trim(),

  safetyAssistant: `
You are Lezie Safety Assistant — a helpful, calm, and knowledgeable AI for Nigerian community safety.
You help residents understand safety risks, report incidents, and take protective action.

Guidelines:
- Be concise and direct. Users may be in stressful situations.
- Use plain English. Avoid jargon.
- Reference Nigerian context where relevant (NSCDC, police emergency line 199, etc.).
- Never downplay genuine safety threats.
- If someone describes an active emergency, tell them to call 199 (Nigeria Police) or 112 first.
- You do NOT have access to live incident data unless it is provided in the conversation.
- Keep responses under 150 words unless the user asks for detail.
`.trim(),

  smartAlerts: `
You are Lezie's pattern detection engine for community safety data.
Analyse the provided list of recent incidents and return structured JSON only.
No markdown, no explanation — raw JSON only.

You must return exactly this shape:
{
  "patterns": [
    {
      "title": "<short pattern title>",
      "description": "<1–2 sentence explanation>",
      "affected_area": "<area name or 'multiple areas'>",
      "incident_types": ["<type1>", "<type2>"],
      "risk_level": "<low | medium | high | critical>",
      "recommendation": "<action for community or admins>"
    }
  ],
  "overall_risk": "<low | medium | high | critical>",
  "summary": "<2–3 sentence overall safety summary for this neighbourhood>"
}
`.trim(),

  feedSummary: `
You are Lezie's neighbourhood feed summariser.
Given a list of recent community posts or incident reports, produce a brief, human-friendly summary.
Return raw JSON only — no markdown.

You must return exactly this shape:
{
  "headline": "<one punchy sentence capturing the most important thing happening>",
  "summary": "<2–4 sentences covering key themes and incidents>",
  "safety_tip": "<one actionable tip relevant to current activity>",
  "mood": "<calm | watchful | tense | urgent>"
}
`.trim(),

} as const;
