// src/routes/api/ai/analyse-report/+server.ts
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { HF_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: HF_TOKEN,
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    const completion = await client.chat.completions.create({
      model: "moonshotai/Kimi-K2-Instruct-0905",
      messages: [
        {
          role: "system",
          content: "You are a community safety analyst. Analyze reports and return ONLY a valid JSON object. Do not include markdown formatting or backticks."
        },
        {
          role: "user",
          content: `Analyze this report:
            Title: ${body.title}
            Description: ${body.description}

            Return JSON with: category, severity (low/medium/high/critical), severity_score (1-10), tags (array), summary, and recommended_action.`
        }
      ],
      // This is Kimi's secret sauce—you can bump this if you need deep analysis
      max_tokens: 1000, 
      temperature: 0.3,
    });

    const rawContent = completion.choices[0].message.content || '{}';

    // Cleanup in case the model ignores the "no backticks" instruction
    const cleanedJson = rawContent.replace(/```json|```/gi, '').trim();
    const analysis = JSON.parse(cleanedJson);

    return json(analysis);

  } catch (err: any) {
    console.error('[KIMI AI ERROR]:', err);
    return json({ error: 'AI analysis failed' }, { status: 500 });
  }
};