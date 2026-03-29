/**
 * Pattern Tracking Router — Communication Insights
 *
 * Sprint 16 / Issue #206.
 * Analyzes solo translation history to detect conflict themes,
 * emotional intensity trends, and Gottman Horseman patterns.
 *
 * Survey: 23.8% overall want pattern tracking, 40% among high-interest users.
 * Gated to Plus tier ($4.99/mo).
 *
 * All data sourced from Tier 2 (abstracted) — no Tier 1 content exposed.
 *
 * Endpoints:
 *   GET /weekly   — This week's pattern summary
 *   GET /trends   — 4-week trend data
 *
 * @see .github/agents/progress-tracker.agent.md
 * @see .github/agents/relationship-dynamics.agent.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import type { AuthenticatedUser } from '../auth/auth-service.js';

const router = Router();

// ── Types ────────────────────────────────────────────────────
interface PatternEntry {
  userId: string;
  week: string;
  themes: string[];
  avgIntensity: number;
  horsemen: string[];
  translationCount: number;
  timestamp: string;
}

// In-memory pattern store (populated by pipeline telemetry)
const patternStore = new Map<string, PatternEntry[]>(); // userId → entries

// ── Public API for pipeline integration ──────────────────────
export function recordPattern(
  userId: string,
  themes: string[],
  intensity: number,
  horsemen: string[],
): void {
  const now = new Date();
  const weekKey = getWeekKey(now);

  if (!patternStore.has(userId)) {
    patternStore.set(userId, []);
  }

  const entries = patternStore.get(userId)!;
  let weekEntry = entries.find(e => e.week === weekKey);

  if (!weekEntry) {
    weekEntry = {
      userId,
      week: weekKey,
      themes: [],
      avgIntensity: 0,
      horsemen: [],
      translationCount: 0,
      timestamp: now.toISOString(),
    };
    entries.push(weekEntry);
  }

  // Merge themes (deduplicate)
  for (const t of themes) {
    if (!weekEntry.themes.includes(t)) {
      weekEntry.themes.push(t);
    }
  }

  // Running average of intensity
  const total = weekEntry.avgIntensity * weekEntry.translationCount + intensity;
  weekEntry.translationCount++;
  weekEntry.avgIntensity = Math.round((total / weekEntry.translationCount) * 10) / 10;

  // Merge horsemen
  for (const h of horsemen) {
    if (!weekEntry.horsemen.includes(h)) {
      weekEntry.horsemen.push(h);
    }
  }

  weekEntry.timestamp = now.toISOString();
}

function getWeekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

// ── Routes ───────────────────────────────────────────────────

/**
 * GET /weekly — This week's communication pattern summary.
 * Gated to Plus/Pro tier.
 */
router.get('/weekly', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const userId = user.id;

  const entries = patternStore.get(userId) ?? [];
  const currentWeek = getWeekKey(new Date());
  const weekData = entries.find(e => e.week === currentWeek);

  if (!weekData || weekData.translationCount === 0) {
    res.json({
      week: currentWeek,
      summary: 'Not enough data yet. Keep translating to see patterns.',
      themes: [],
      avgIntensity: 0,
      horsemen: [],
      translationCount: 0,
      improvement: null,
    });
    return;
  }

  // Compare to previous week for improvement indicator
  const prevWeekDate = new Date();
  prevWeekDate.setDate(prevWeekDate.getDate() - 7);
  const prevWeek = getWeekKey(prevWeekDate);
  const prevData = entries.find(e => e.week === prevWeek);

  let improvement: number | null = null;
  if (prevData && prevData.avgIntensity > 0) {
    improvement = Math.round(
      ((prevData.avgIntensity - weekData.avgIntensity) / prevData.avgIntensity) * 100
    );
  }

  // Generate natural-language summary
  const topThemes = weekData.themes.slice(0, 3);
  const themeStr = topThemes.length > 0
    ? topThemes.join(', ')
    : 'general communication';

  let summary = `You had ${weekData.translationCount} translation${weekData.translationCount !== 1 ? 's' : ''} this week, mostly about ${themeStr}.`;

  if (improvement !== null && improvement > 0) {
    summary += ` Your intensity dropped ${improvement}% from last week — that's progress.`;
  } else if (improvement !== null && improvement < 0) {
    summary += ` Intensity was higher than last week — a tough stretch, but you're still showing up.`;
  }

  res.json({
    week: currentWeek,
    summary,
    themes: weekData.themes,
    avgIntensity: weekData.avgIntensity,
    horsemen: weekData.horsemen,
    translationCount: weekData.translationCount,
    improvement,
  });
});

/**
 * GET /trends — 4-week trend data for charting.
 * Gated to Plus/Pro tier.
 */
router.get('/trends', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const userId = user.id;

  const entries = patternStore.get(userId) ?? [];

  // Get last 4 weeks
  const weeks: string[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    weeks.push(getWeekKey(d));
  }
  weeks.reverse();

  const trends = weeks.map(week => {
    const data = entries.find(e => e.week === week);
    return {
      week,
      translationCount: data?.translationCount ?? 0,
      avgIntensity: data?.avgIntensity ?? 0,
      themes: data?.themes ?? [],
      horsemen: data?.horsemen ?? [],
    };
  });

  res.json({ trends, totalWeeks: entries.length });
});

export { router as patternRouter };
