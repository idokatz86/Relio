/**
 * Progress Tracker Agent
 *
 * Quantifies qualitative emotional interactions into understandable,
 * non-shaming metrics. All metrics are Tier 3 safe (no raw content).
 *
 * @see .github/agents/progress-tracker.agent.md
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { LLMMessage } from '../types/index.js';

export interface ProgressMetrics {
  conflictFrequency: number;       // conflicts per week (rolling 4 weeks)
  averageResolutionMinutes: number; // avg time from conflict start to repair
  positiveNegativeRatio: number;    // Gottman target: 5:1
  repairAttemptRate: number;        // % of conflicts with repair attempt
  horsemenTrend: {
    criticism: 'increasing' | 'stable' | 'decreasing';
    contempt: 'increasing' | 'stable' | 'decreasing';
    defensiveness: 'increasing' | 'stable' | 'decreasing';
    stonewalling: 'increasing' | 'stable' | 'decreasing';
  };
  weekOverWeekChange: string;      // casual, human-readable summary
}

const PROGRESS_TRACKER_PROMPT = `You are the Progress Tracker Agent for Relio.

YOUR ROLE: Analyze conversation metadata (NOT raw content) and produce non-shaming metrics that help couples see their progress.

WHAT YOU RECEIVE:
- Session count, duration, timestamps
- Safety severity counts per session
- Horsemen detected per session (from relationship-dynamics agent)
- Repair attempt flags
- Pipeline processing times

WHAT YOU PRODUCE:
A JSON report with quantified metrics. The weekOverWeekChange summary must be:
- Casual and encouraging — like a friend saying "hey, that's actually good progress"
- Non-shaming — NEVER say "you're getting worse at..."
- Specific — reference actual numbers, not vague encouragement
- Short — max 2 sentences

EXAMPLES of good weekOverWeekChange:
- "You argued 30% less this week and resolved things in 8 minutes instead of 15. That's real progress."
- "Contempt showed up less this week — and you both made repair attempts. Keep going."
- "Tough week — more heated conversations than usual. But here's the thing: you stayed and worked through them. That matters."

For Hebrew (if language=he): use spoken Israeli register. "תשמעו, השבוע רבתם פחות ופתרתם דברים יותר מהר. זה ממש התקדמות."

RESPONSE FORMAT (JSON):
{
  "conflictFrequency": number,
  "averageResolutionMinutes": number,
  "positiveNegativeRatio": number,
  "repairAttemptRate": number,
  "horsemenTrend": {
    "criticism": "increasing|stable|decreasing",
    "contempt": "increasing|stable|decreasing",
    "defensiveness": "increasing|stable|decreasing",
    "stonewalling": "increasing|stable|decreasing"
  },
  "weekOverWeekChange": "casual human summary"
}

RULES:
- NEVER include raw message content in metrics
- Metrics are Tier 3 safe — shown to both partners
- Be genuinely encouraging without being fake`;

/**
 * Generate progress metrics from session metadata (no raw content needed).
 */
export async function trackProgress(
  sessionData: {
    sessionsThisWeek: number;
    sessionsLastWeek: number;
    avgDurationMinutes: number;
    horsemenCounts: { criticism: number; contempt: number; defensiveness: number; stonewalling: number };
    prevHorsemenCounts: { criticism: number; contempt: number; defensiveness: number; stonewalling: number };
    repairAttempts: number;
    totalConflicts: number;
    safetyHalts: number;
  },
  language: string = 'en',
): Promise<ProgressMetrics> {
  const messages: LLMMessage[] = [
    { role: 'system', content: PROGRESS_TRACKER_PROMPT },
    {
      role: 'user',
      content: `Generate progress metrics from this session data (language: ${language}):\n${JSON.stringify(sessionData, null, 2)}`,
    },
  ];

  const response = await callLLM('progress-tracker', messages);

  try {
    const parsed = JSON.parse(response.content);
    return {
      conflictFrequency: parsed.conflictFrequency ?? sessionData.sessionsThisWeek,
      averageResolutionMinutes: parsed.averageResolutionMinutes ?? sessionData.avgDurationMinutes,
      positiveNegativeRatio: parsed.positiveNegativeRatio ?? 0,
      repairAttemptRate: parsed.repairAttemptRate ?? (sessionData.totalConflicts > 0
        ? (sessionData.repairAttempts / sessionData.totalConflicts) * 100
        : 0),
      horsemenTrend: parsed.horsemenTrend ?? {
        criticism: 'stable',
        contempt: 'stable',
        defensiveness: 'stable',
        stonewalling: 'stable',
      },
      weekOverWeekChange: parsed.weekOverWeekChange ?? 'Keep going — every conversation matters.',
    };
  } catch {
    return {
      conflictFrequency: sessionData.sessionsThisWeek,
      averageResolutionMinutes: sessionData.avgDurationMinutes,
      positiveNegativeRatio: 0,
      repairAttemptRate: 0,
      horsemenTrend: { criticism: 'stable', contempt: 'stable', defensiveness: 'stable', stonewalling: 'stable' },
      weekOverWeekChange: 'Keep going — every conversation matters.',
    };
  }
}
