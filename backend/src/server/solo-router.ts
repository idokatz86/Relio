/**
 * Solo Translation Router
 *
 * The core "Emotional Translator" — Sprint 15, Issue #197.
 * Lets a user type raw frustration (Tier 1) and get a
 * constructive Tier 3 translation without a partner account.
 *
 * Survey evidence:
 * - 61.4% want "private venting stays private"
 * - 55.4% want "AI translates frustration into something constructive"
 * - 52.5% tried nothing — zero-friction solo entry
 *
 * Endpoints:
 *   POST /translate — Tier 1 → Tier 3 translation
 *   GET  /history   — Past translation history
 *   GET  /usage     — Weekly translation count
 *
 * @see .github/agents/communication-coach.agent.md
 * @see .github/agents/orchestrator-agent.agent.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { processMessage } from '../pipeline/mediation-pipeline.js';
import type { AuthenticatedUser } from '../auth/auth-service.js';
import { isInMemoryMode } from '../db/pool.js';
import * as tier1Repo from '../db/repositories/tier1-repo.js';
import { recordPipelineMetrics, recordSafetyEvent, recordSoloTranslation } from './admin-router.js';
import { recordPattern } from './pattern-router.js';
import { recordAttachmentSignal } from './attachment-router.js';

const router = Router();

// ── Schemas ──────────────────────────────────────────────────
const TranslateSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message cannot exceed 2000 characters'),
  preferredLanguage: z.enum(['en', 'es', 'pt', 'he']).optional().default('en'),
});

// ── In-Memory Stores (until DB connected) ────────────────────
interface TranslationRecord {
  id: string;
  userId: string;
  tier1Input: string;
  tier3Output: string;
  language: string;
  processingTimeMs: number;
  createdAt: string;
}

interface UsageRecord {
  userId: string;
  weekStart: string;
  count: number;
}

const translationHistory = new Map<string, TranslationRecord[]>(); // userId → records
const weeklyUsage = new Map<string, UsageRecord>(); // `${userId}:${weekStart}` → count

// ── FREE TIER LIMITS ─────────────────────────────────────────
const FREE_WEEKLY_LIMIT = 5;

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now);
  monday.setUTCDate(diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

function getUserWeeklyCount(userId: string): number {
  const weekStart = getWeekStart();
  const key = `${userId}:${weekStart}`;
  return weeklyUsage.get(key)?.count ?? 0;
}

function incrementUsage(userId: string): number {
  const weekStart = getWeekStart();
  const key = `${userId}:${weekStart}`;
  const current = weeklyUsage.get(key);
  const newCount = (current?.count ?? 0) + 1;
  weeklyUsage.set(key, { userId, weekStart, count: newCount });
  return newCount;
}

function getUserTier(req: Request): 'free' | 'plus' | 'pro' {
  const user = (req as any).user as AuthenticatedUser;
  // TODO: Check RevenueCat entitlement via backend API
  // For now, check an in-memory subscription status
  return (user as any).subscriptionTier ?? 'free';
}

// ── ROUTES ───────────────────────────────────────────────────

/**
 * POST /translate — Transform Tier 1 frustration to Tier 3 constructive message.
 *
 * Free users: 5 translations/week.
 * Plus/Pro users: unlimited.
 */
router.post('/translate', async (req: Request, res: Response) => {
  const parsed = TranslateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
    });
    return;
  }

  const user = (req as any).user as AuthenticatedUser;
  const userId = user.id;
  const { message, preferredLanguage } = parsed.data;
  const tier = getUserTier(req);

  // Check free tier limit
  if (tier === 'free') {
    const used = getUserWeeklyCount(userId);
    if (used >= FREE_WEEKLY_LIMIT) {
      res.status(429).json({
        error: 'Weekly translation limit reached',
        limit: FREE_WEEKLY_LIMIT,
        used,
        resetsAt: getWeekStart(), // Next Monday
        upgradeUrl: '/paywall',
      });
      return;
    }
  }

  try {
    // Run through the full mediation pipeline
    const result = await processMessage(userId, message, preferredLanguage);

    // Record telemetry
    recordPipelineMetrics(result.processingTimeMs, result.agentsInvoked);
    recordSafetyEvent(result.safetyCheck.severity, result.safetyCheck.halt);

    // Safety halt — return crisis info, not translation
    if (result.safetyCheck.halt) {
      res.json({
        translated: false,
        safetyHalt: true,
        severity: result.safetyCheck.severity,
        tier3Output: null,
        processingTimeMs: result.processingTimeMs,
      });
      return;
    }

    // Increment usage
    const newCount = incrementUsage(userId);

    // Record solo translation metric (Issue #201)
    recordSoloTranslation(userId, tier, preferredLanguage, result.processingTimeMs);

    // Record patterns for tracking dashboard (Issue #206 — Sprint 16)
    if (result.profile) {
      const themes: string[] = [];
      // Extract themes from routing if available
      if ((result as any).routing?.intent) {
        themes.push((result as any).routing.intent);
      }
      const horsemen: string[] = (result as any).dynamics?.horsemen ?? [];
      const intensity = (result as any).routing?.emotionalIntensity ?? 5;
      recordPattern(userId, themes, intensity, horsemen);

      // Record attachment signal for profiling (Issue #207 — Sprint 17)
      recordAttachmentSignal(
        userId,
        result.profile.attachmentStyle,
        result.profile.attachmentConfidence,
        result.profile.activationState,
      );
    }

    // Store translation in history
    const record: TranslationRecord = {
      id: uuidv4(),
      userId,
      tier1Input: message,
      tier3Output: result.tier3Output ?? '',
      language: preferredLanguage,
      processingTimeMs: result.processingTimeMs,
      createdAt: new Date().toISOString(),
    };

    if (!translationHistory.has(userId)) {
      translationHistory.set(userId, []);
    }
    translationHistory.get(userId)!.push(record);

    // Also store in Tier 1 DB if available (RLS-isolated)
    if (!isInMemoryMode()) {
      try {
        // Store Tier 1 (private) — only the user can ever access this
        await tier1Repo.insertTier1Message(
          'solo', // roomId = 'solo' for solo mode
          userId,
          message,
          result.safetyCheck.severity,
          result.safetyCheck.halt,
          result.safetyCheck.reasoning,
        );
      } catch (dbErr) {
        console.error('[Solo] DB write failed (non-blocking):', dbErr);
      }
    }

    res.json({
      translated: true,
      safetyHalt: false,
      id: record.id,
      tier3Output: result.tier3Output,
      processingTimeMs: result.processingTimeMs,
      usage: {
        used: newCount,
        limit: tier === 'free' ? FREE_WEEKLY_LIMIT : null,
        remaining: tier === 'free' ? Math.max(0, FREE_WEEKLY_LIMIT - newCount) : null,
        tier,
      },
    });
  } catch (err) {
    console.error('[Solo] Translation error:', err);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

/**
 * GET /history — Retrieve past translations for the authenticated user.
 * Returns Tier 1 + Tier 3 pairs (user's own data only, RLS-enforced).
 */
router.get('/history', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const userId = user.id;

  const records = translationHistory.get(userId) ?? [];

  // Return most recent first, max 50
  const sorted = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50)
    .map(r => ({
      id: r.id,
      tier1Input: r.tier1Input,
      tier3Output: r.tier3Output,
      language: r.language,
      createdAt: r.createdAt,
    }));

  res.json({ translations: sorted, total: records.length });
});

/**
 * GET /usage — Current week's translation count + limit.
 */
router.get('/usage', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const userId = user.id;
  const tier = getUserTier(req);
  const used = getUserWeeklyCount(userId);

  res.json({
    used,
    limit: tier === 'free' ? FREE_WEEKLY_LIMIT : null,
    remaining: tier === 'free' ? Math.max(0, FREE_WEEKLY_LIMIT - used) : null,
    tier,
    resetsAt: getWeekStart(),
  });
});

export { router as soloRouter };
