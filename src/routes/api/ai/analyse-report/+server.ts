// src/routes/api/ai/analyse-report/+server.ts
//
// Analyses an incident report using Claude and returns structured JSON.
// Called after a report is submitted — non-blocking, the report is already
// saved before this runs.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface AnalysisRequest {
  title:        string;
  description:  string;
  category?:    string;
  location?:    string;
  reported_at?: string;
}

interface AnalysisResult {
  category:           string;
  severity:           'low' | 'medium' | 'high' | 'critical';
  severity_score:     number;       // 1–10
  tags:               string[];
  summary:            string;
  recommended_action: string;
  prevention_tips:    string[];
  confidence:         number;       // 0–1
}

const SYSTEM_PROMPT = `You are a community safety analyst for Lezie, a real-time safety and monitoring platform.

Your job is to analyse incident reports submitted by community members and return a structured JSON assessment.

Rules:
- Be factual and measured — do not sensationalise
- Base severity on actual harm potential, not just the category
- Recommended actions should be practical and community-appropriate
- Prevention tips should be specific to the incident type
- Return ONLY valid JSON — no markdown, no explanation outside the JSON

Return this exact JSON structure:
{
  "category": "string (one of: suspicious_activity, theft_robbery, vandalism, fire_emergency, accident, noise_complaint, other)",
  "severity": "string (one of: low, medium, high, critical)",
  "severity_score": number (1-10 integer, 1=trivial, 10=life-threatening),
  "tags": ["array", "of", "relevant", "short", "tags"],
  "summary": "2-3 sentence objective summary of the incident",
  "recommended_action": "Specific actionable guidance for community members",
  "prevention_tips": ["tip 1", "tip 2", "tip 3"],
  "confidence": number (0.0-1.0, how confident you are in your assessment)
}`;

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body: AnalysisRequest = await request.json();

    if (!body.title?.trim() || !body.description?.trim()) {
      return json({ error: 'Title and description are required' }, { status: 400 });
    }

    const userMessage = `Analyse this community safety incident report:

Title: ${body.title}
Category (user-selected): ${body.category ?? 'Not specified'}
Location: ${body.location ?? 'Not specified'}
Reported at: ${body.reported_at ?? new Date().toISOString()}

Description:
${body.description}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      console.error('[AI ANALYSIS] Claude API error:', response.status, await response.text());
      return json({ error: 'AI analysis unavailable' }, { status: 503 });
    }

    const claudeData = await response.json();
    const rawText = claudeData.content
      ?.filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('') ?? '';

    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(cleaned);
    } catch {
      console.error('[AI ANALYSIS] Failed to parse Claude response:', rawText.slice(0, 200));
      return json({ error: 'AI returned unparseable response' }, { status: 502 });
    }

    // Validate required fields exist
    const required: (keyof AnalysisResult)[] = [
      'category', 'severity', 'severity_score', 'tags',
      'summary', 'recommended_action', 'prevention_tips', 'confidence',
    ];
    for (const field of required) {
      if (analysis[field] === undefined) {
        return json({ error: `AI response missing field: ${field}` }, { status: 502 });
      }
    }

    // Clamp values to valid ranges
    analysis.severity_score = Math.min(10, Math.max(1, Math.round(analysis.severity_score)));
    analysis.confidence     = Math.min(1, Math.max(0, analysis.confidence));
    analysis.tags           = (analysis.tags ?? []).slice(0, 8);
    analysis.prevention_tips = (analysis.prevention_tips ?? []).slice(0, 5);

    return json(analysis);

  } catch (err: any) {
    console.error('[AI ANALYSIS] Unexpected error:', err?.message ?? err);
    return json({ error: 'Internal error during analysis' }, { status: 500 });
  }
};