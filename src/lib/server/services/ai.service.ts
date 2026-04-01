// src/lib/server/services/ai.service.ts


import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ReportAnalysis {
  title?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threatScore: number; // 0-100
  categories: string[];
  summary: string;
  recommendedAction: string;
  confidence: number;
  needsImmediateAttention: boolean;
}

export interface UserBehavior {
  [key: string]: unknown;
}

export interface HistoricalPattern {
  [key: string]: unknown;
}

export class AIService {
  static async analyzeReport(title: string, description: string, category: string): Promise<ReportAnalysis> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      You are an AI safety analyst for Lezie, a community safety platform. Analyze this incident report:
      
      Category: ${category}
      Title: ${title}
      Description: ${description}
      
      Provide a threat assessment with the following JSON structure:
      {
        "severity": "low|medium|high|critical",
        "threatScore": number between 0-100,
        "categories": array of relevant threat categories (max 3),
        "summary": "brief 1-sentence summary",
        "recommendedAction": "what authorities should do",
        "confidence": number between 0-1,
        "needsImmediateAttention": boolean
      }
      
      Consider factors like: threat to life, property damage, urgency, scale, and credibility.
      Respond with ONLY the JSON object.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean the response to ensure valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanedText);
      return analysis;
    } catch (error) {
      console.error('Failed to parse AI analysis:', error);
      // Return default analysis
      return {
        severity: 'medium',
        threatScore: 50,
        categories: [category],
        summary: 'Unable to analyze automatically. Manual review required.',
        recommendedAction: 'Assign for manual review',
        confidence: 0.3,
        needsImmediateAttention: false,
      };
    }
  }

  static async detectImpersonation(
    userBehavior: UserBehavior,
    historicalData: HistoricalPattern[]
  ): Promise<{
    isSuspicious: boolean;
    flags: string[];
    confidence: number;
  }> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Analyze this user behavior for potential identity fraud or impersonation:
      
      Current Behavior: ${JSON.stringify(userBehavior)}
      Historical Patterns: ${JSON.stringify(historicalData)}
      
      Respond with JSON:
      {
        "isSuspicious": boolean,
        "flags": array of suspicious patterns detected,
        "confidence": number 0-1
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch {
      return {
        isSuspicious: false,
        flags: [],
        confidence: 0,
      };
    }
  }

  static async summarizeReports(reports: ReportAnalysis[]): Promise<string> {
    if (reports.length === 0) return 'No reports to summarize';
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const reportsText = reports.map(r => 
      `- ${r.title}: ${r.summary.substring(0, 100)}... [${r.severity}]`
    ).join('\n');
    
    const prompt = `
      Summarize these ${reports.length} incident reports for community safety insights:
      
      ${reportsText}
      
      Provide a concise summary highlighting:
      1. Most critical incidents
      2. Emerging patterns
      3. Recommended actions for the community
      
      Keep it under 200 words.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  static async predictTrends(
    historicalReports: ReportAnalysis[],
    timeframe: 'day' | 'week' | 'month'
  ): Promise<{
    predictedIncidents: number;
    highRiskAreas: Array<{ lat: number; lng: number; risk: number }>;
    commonCategories: string[];
    alert: string | null;
  }> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Based on historical incident data, predict safety trends for the next ${timeframe}:
      
      Data: ${JSON.stringify(historicalReports.slice(0, 100))}
      
      Respond with JSON:
      {
        "predictedIncidents": number,
        "highRiskAreas": array of {lat, lng, risk} objects,
        "commonCategories": array of categories,
        "alert": "warning message if needed or null"
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch {
      return {
        predictedIncidents: historicalReports.length,
        highRiskAreas: [],
        commonCategories: [],
        alert: null,
      };
    }
  }
}