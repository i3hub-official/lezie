// src/lib/server/services/ai.service.ts
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!);

export interface ReportAnalysis {
  title?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threatScore: number;
  categories: string[];
  summary: string;
  recommendedAction: string;
  confidence: number;
  needsImmediateAttention: boolean;
}

export class AIService {
  /**
   * Analyzes an incident report for threat level and urgency.
   */
  static async analyzeReport(title: string, description: string, category: string): Promise<ReportAnalysis> {
    // 1.5-flash is perfect for high-speed categorization/summarization
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `
      Analyze this incident report for Lezie, a community safety platform:
      Category: ${category}
      Title: ${title}
      Description: ${description}
      
      Return JSON using this schema:
      {
        "severity": "low" | "medium" | "high" | "critical",
        "threatScore": number (0-100),
        "categories": string[] (max 3),
        "summary": string (1 sentence),
        "recommendedAction": string,
        "confidence": number (0-1),
        "needsImmediateAttention": boolean
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        severity: 'medium',
        threatScore: 50,
        categories: [category],
        summary: 'Automatic analysis failed. Manual review required.',
        recommendedAction: 'Verify incident details manually.',
        confidence: 0,
        needsImmediateAttention: false,
      };
    }
  }

  /**
   * Detects impersonation by comparing current behavior against history.
   */
  static async detectImpersonation(userBehavior: any, historicalData: any[]): Promise<{
    isSuspicious: boolean;
    flags: string[];
    confidence: number;
  }> {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Compare current user behavior against historical patterns to detect identity fraud:
      Current: ${JSON.stringify(userBehavior)}
      History: ${JSON.stringify(historicalData)}
      
      Return JSON: { "isSuspicious": boolean, "flags": string[], "confidence": number }
    `;

    try {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch {
      return { isSuspicious: false, flags: [], confidence: 0 };
    }
  }

  /**
   * Provides high-level insights across multiple reports.
   */
  static async summarizeReports(reports: ReportAnalysis[]): Promise<string> {
    if (!reports.length) return 'No reports available.';

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const reportsText = reports.map(r => `- ${r.title}: ${r.summary} [${r.severity}]`).join('\n');

    const prompt = `
      Summarize these ${reports.length} safety reports. 
      Identify critical incidents, emerging patterns, and community advice.
      Keep it professional and under 200 words.
      
      Reports:
      ${reportsText}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Predicts future risks based on historical data.
   */
  static async predictTrends(historicalReports: any[], timeframe: string) {
    // 1.5-pro is better for analyzing long contexts and trends
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze historical data to predict safety trends for the next ${timeframe}.
      Data: ${JSON.stringify(historicalReports.slice(0, 50))}
      
      Return JSON: { "predictedIncidents": number, "highRiskAreas": Array<{lat, lng, risk}>, "commonCategories": string[], "alert": string | null }
    `;

    try {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch {
      return { predictedIncidents: 0, highRiskAreas: [], commonCategories: [], alert: null };
    }
  }
}
