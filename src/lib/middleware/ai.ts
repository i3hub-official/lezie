// src/lib/middleware/ai.ts
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

type AIModel = 'grok' | 'openai' | 'claude';

interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: AIModel;
}

interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
  tokensUsed?: number;
}

// Choose your provider (you can switch easily)
const AI_PROVIDER = env.AI_PROVIDER || 'grok'; // 'grok' | 'openai' | 'claude'

export async function callAI({ 
  prompt, 
  systemPrompt = "You are a helpful safety and security assistant.",
  temperature = 0.3,
  maxTokens = 800,
  model 
}: AIRequest): Promise<AIResponse> {
  
  try {
    if (AI_PROVIDER === 'grok' && env.GROK_API_KEY) {
      return await callGrokAPI({ prompt, systemPrompt, temperature, maxTokens });
    } 
    else if (AI_PROVIDER === 'openai' && env.OPENAI_API_KEY) {
      return await callOpenAI({ prompt, systemPrompt, temperature, maxTokens });
    }
    else {
      throw new Error('No AI provider configured or API key missing');
    }
  } catch (error: any) {
    console.error('AI Middleware Error:', error.message);
    return {
      success: false,
      content: '',
      error: error.message || 'AI service unavailable'
    };
  }
}

// Grok (xAI) Implementation
async function callGrokAPI({ prompt, systemPrompt, temperature, maxTokens }: AIRequest): Promise<AIResponse> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.GROK_API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-beta",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature,
      max_tokens: maxTokens
    })
  });

  const data = await response.json();
  
  if (!response.ok) throw new Error(data.error?.message || 'Grok API error');

  return {
    success: true,
    content: data.choices?.[0]?.message?.content || '',
    tokensUsed: data.usage?.total_tokens
  };
}

// OpenAI Implementation (fallback)
async function callOpenAI({ prompt, systemPrompt, temperature, maxTokens }: AIRequest): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature,
      max_tokens: maxTokens
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI error');

  return {
    success: true,
    content: data.choices?.[0]?.message?.content || '',
    tokensUsed: data.usage?.total_tokens
  };
}

// Helper for incident analysis
export async function analyzeIncident(report: {
  title: string;
  description: string;
  category?: string;
  location?: string;
}) {
  const prompt = `
    Analyze this incident report and return a JSON object with:
    - severity (low/medium/high/critical)
    - threatLevel (1-10)
    - summary (one sentence)
    - recommendedAction
    - needsHumanReview (true/false)

    Report:
    Title: ${report.title}
    Description: ${report.description}
    Category: ${report.category || 'Unknown'}
    Location: ${report.location || 'Unknown'}
  `;

  const result = await callAI({
    prompt,
    systemPrompt: "You are an expert security and threat analysis AI.",
    temperature: 0.2,
    maxTokens: 600
  });

  return result;
}