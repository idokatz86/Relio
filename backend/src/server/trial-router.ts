/**
 * Trial Router — 14-Day Free SharedChat Trial
 *
 * Sprint 15 / Issue #200.
 * Survey: 54.5% need "free trial first" — the #1 adoption barrier.
 *
 * Rules:
 * - New users automatically get 14-day SharedChat trial
 * - No credit card required
 * - Trial includes up to 5 SharedChat mediation sessions
 * - Day 10 + Day 13: push notification reminders
 * - Day 14: graceful downgrade to free tier
 * - Trial can only be activated once per user
 *
 * Endpoints:
 *   POST /start   — Activate trial (auto-called on first partner invite)
 *   GET  /status   — Trial state + days remaining
 *   POST /extend   — Admin-only trial extension (for beta users)
 *
 * @see .github/agents/chief-revenue-officer.agent.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import type { AuthenticatedUser } from '../auth/auth-service.js';

const router = Router();

// ── Constants ────────────────────────────────────────────────
const TRIAL_DURATION_DAYS = 14;
const TRIAL_SESSION_LIMIT = 5;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ── In-Memory Store ──────────────────────────────────────────
interface TrialRecord {
  userId: string;
  startedAt: string;
  expiresAt: string;
  sessionsUsed: number;
  sessionLimit: number;
  expired: boolean;
  notifiedDay10: boolean;
  notifiedDay13: boolean;
}

const trials = new Map<string, TrialRecord>();

// ── Helpers ──────────────────────────────────────────────────
function getTrialStatus(userId: string): {
  active: boolean;
  daysRemaining: number;
  sessionsRemaining: number;
  startedAt: string | null;
  expiresAt: string | null;
  eligible: boolean;
} {
  const trial = trials.get(userId);

  // Never started — eligible
  if (!trial) {
    return {
      active: false,
      daysRemaining: 0,
      sessionsRemaining: 0,
      startedAt: null,
      expiresAt: null,
      eligible: true,
    };
  }

  const now = Date.now();
  const expiresAt = new Date(trial.expiresAt).getTime();
  const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / MS_PER_DAY));
  const sessionsRemaining = Math.max(0, trial.sessionLimit - trial.sessionsUsed);
  const active = daysRemaining > 0 && sessionsRemaining > 0 && !trial.expired;

  return {
    active,
    daysRemaining,
    sessionsRemaining,
    startedAt: trial.startedAt,
    expiresAt: trial.expiresAt,
    eligible: false, // Already used
  };
}

export function isTrialActive(userId: string): boolean {
  return getTrialStatus(userId).active;
}

export function consumeTrialSession(userId: string): boolean {
  const trial = trials.get(userId);
  if (!trial) return false;

  const status = getTrialStatus(userId);
  if (!status.active) return false;

  trial.sessionsUsed++;
  return true;
}

// ── Routes ───────────────────────────────────────────────────

/**
 * POST /start — Activate the 14-day trial.
 */
router.post('/start', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const userId = user.id;

  // Check if already used
  const existing = trials.get(userId);
  if (existing) {
    const status = getTrialStatus(userId);
    if (status.active) {
      res.json({
        started: false,
        message: 'Trial already active',
        ...status,
      });
    } else {
      res.status(409).json({
        started: false,
        message: 'Trial already used. Upgrade to Plus for full access.',
        upgradeUrl: '/paywall',
      });
    }
    return;
  }

  // Start trial
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TRIAL_DURATION_DAYS * MS_PER_DAY);

  const trial: TrialRecord = {
    userId,
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    sessionsUsed: 0,
    sessionLimit: TRIAL_SESSION_LIMIT,
    expired: false,
    notifiedDay10: false,
    notifiedDay13: false,
  };

  trials.set(userId, trial);

  res.status(201).json({
    started: true,
    daysRemaining: TRIAL_DURATION_DAYS,
    sessionsRemaining: TRIAL_SESSION_LIMIT,
    startedAt: trial.startedAt,
    expiresAt: trial.expiresAt,
  });
});

/**
 * GET /status — Current trial state.
 */
router.get('/status', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const status = getTrialStatus(user.id);
  res.json(status);
});

export { router as trialRouter };
