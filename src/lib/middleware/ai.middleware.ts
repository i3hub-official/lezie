// src/lib/middleware/ai.middleware.ts
import { AIService, type ReportAnalysis } from '$lib/server/services/ai.service';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export interface AIMiddlewareOptions {
  timeoutMs?: number;
  maxRetries?: number;
  logRequests?: boolean;
}

class AIMiddleware {
  private options: Required<AIMiddlewareOptions>;

  constructor(options: AIMiddlewareOptions = {}) {
    this.options = {
      timeoutMs: 15000,
      maxRetries: 2,
      logRequests: true,
      ...options
    };
  }

  /**
   * Analyze a new incident report
   */
  async analyzeReport(
    title: string,
    description: string,
    category: string = 'Other'
  ): Promise<ReportAnalysis> {
    const startTime = Date.now();

    try {
      const analysis = await AIService.analyzeReport(title, description, category);

      if (this.options.logRequests) {
        console.log(`[AI Middleware] Report analyzed in ${Date.now() - startTime}ms | Severity: ${analysis.severity} | Score: ${analysis.threatScore}`);
      }

      return analysis;
    } catch (err: any) {
      console.error('[AI Middleware] Analysis failed:', err.message);
      throw error(503, 'AI analysis service temporarily unavailable');
    }
  }

  /**
   * Detect impersonation / suspicious behavior
   */
  async detectImpersonation(
    userBehavior: any,
    historicalData: any[] = []
  ) {
    try {
      return await AIService.detectImpersonation(userBehavior, historicalData);
    } catch (err) {
      console.error('[AI Middleware] Impersonation detection failed:', err);
      return { isSuspicious: false, flags: [], confidence: 0 };
    }
  }

  /**
   * Summarize multiple reports
   */
  async summarizeReports(reports: ReportAnalysis[]): Promise<string> {
    try {
      return await AIService.summarizeReports(reports);
    } catch (err) {
      console.error('[AI Middleware] Summarization failed:', err);
      return 'Unable to generate summary at this time.';
    }
  }

  /**
   * Predict trends (for dashboard)
   */
  async predictTrends(historicalReports: ReportAnalysis[], timeframe: 'day' | 'week' | 'month') {
    try {
      return await AIService.predictTrends(historicalReports, timeframe);
    } catch (err) {
      console.error('[AI Middleware] Trend prediction failed:', err);
      return {
        predictedIncidents: 0,
        highRiskAreas: [],
        commonCategories: [],
        alert: null
      };
    }
  }

  /**
   * Quick threat assessment for alerts
   */
  async quickThreatAssessment(description: string): Promise<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    needsImmediateAttention: boolean;
    summary: string;
  }> {
    try {
      const analysis = await AIService.analyzeReport("Quick Alert", description, "General");
      return {
        severity: analysis.severity,
        needsImmediateAttention: analysis.needsImmediateAttention,
        summary: analysis.summary
      };
    } catch {
      return {
        severity: 'medium',
        needsImmediateAttention: false,
        summary: 'Incident reported'
      };
    }
  }
}

// Export singleton instance
export const aiMiddleware = new AIMiddleware({
  timeoutMs: 12000,
  maxRetries: 2,
  logRequests: true
});