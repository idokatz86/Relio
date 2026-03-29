/**
 * Attachment Profiling Router — Persistent Attachment Assessment
 *
 * Sprint 17 / Issue #207.
 * Analyzes translation history to build longitudinal attachment profile.
 * Minimum 5 translations for initial assessment. Gated to Pro tier ($9.99/mo).
 *
 * Survey: 23.8% overall want attachment understanding, 30.9% among high-interest.
 * CPsychO: maps to textbook anxious-avoidant demand-withdraw cycle.
 *
 * @see .github/agents/individual-profiler.agent.md
 * @see .github/agents/chief-psychology-officer.agent.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import type { AuthenticatedUser } from '../auth/auth-service.js';
import type { AttachmentStyle } from '../types/index.js';

const router = Router();

// ── Types ────────────────────────────────────────────────────
interface AttachmentAssessment {
  userId: string;
  primaryStyle: AttachmentStyle;
  confidence: number;
  subState: string;
  history: Array<{ style: AttachmentStyle; confidence: number; timestamp: string }>;
  updatedAt: string;
}

// In-memory store
const assessments = new Map<string, AttachmentAssessment>();

// ── Public API for pipeline integration ──────────────────────
export function recordAttachmentSignal(
  userId: string,
  style: AttachmentStyle,
  confidence: number,
  subState?: string,
): void {
  let assessment = assessments.get(userId);

  if (!assessment) {
    assessment = {
      userId,
      primaryStyle: style,
      confidence,
      subState: subState ?? 'baseline',
      history: [],
      updatedAt: new Date().toISOString(),
    };
    assessments.set(userId, assessment);
  }

  // Add to history
  assessment.history.push({
    style,
    confidence,
    timestamp: new Date().toISOString(),
  });

  // Keep last 50 signals
  if (assessment.history.length > 50) {
    assessment.history.shift();
  }

  // Recalculate primary style from history (weighted recent)
  const styleCounts: Record<string, { count: number; totalConf: number }> = {};
  assessment.history.forEach((h, i) => {
    const weight = 1 + (i / assessment!.history.length); // Recent entries weighted more
    if (!styleCounts[h.style]) {
      styleCounts[h.style] = { count: 0, totalConf: 0 };
    }
    styleCounts[h.style].count += weight;
    styleCounts[h.style].totalConf += h.confidence * weight;
  });

  let bestStyle: AttachmentStyle = 'secure';
  let bestScore = 0;
  for (const [style, data] of Object.entries(styleCounts)) {
    const score = data.count * (data.totalConf / data.count);
    if (score > bestScore) {
      bestScore = score;
      bestStyle = style as AttachmentStyle;
    }
  }

  assessment.primaryStyle = bestStyle;
  assessment.confidence = Math.min(1, assessment.history.length / 10); // Confidence grows with data
  if (subState) assessment.subState = subState;
  assessment.updatedAt = new Date().toISOString();
}

// ── Routes ───────────────────────────────────────────────────

/**
 * GET /profile — Current attachment style assessment.
 * Requires minimum 5 translations.
 */
router.get('/profile', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const assessment = assessments.get(user.id);

  if (!assessment || assessment.history.length < 5) {
    const remaining = 5 - (assessment?.history.length ?? 0);
    res.json({
      ready: false,
      translationsNeeded: remaining,
      message: `${remaining} more translation${remaining !== 1 ? 's' : ''} needed for your attachment profile.`,
    });
    return;
  }

  // Educational content per style
  const styleInfo: Record<AttachmentStyle, { title: string; description: string; tip: string }> = {
    anxious: {
      title: 'Anxious Attachment',
      description: 'You tend to seek closeness and reassurance in relationships. When connection feels threatened, you may escalate or pursue more intensely.',
      tip: 'Try expressing your need for connection directly: "I need to feel close to you right now" instead of escalating.',
    },
    avoidant: {
      title: 'Avoidant Attachment',
      description: 'You value independence and may pull back when things feel too intense. This can look like withdrawal or emotional distancing.',
      tip: 'Try staying present for 10 more minutes before retreating. Your partner reads silence as rejection.',
    },
    secure: {
      title: 'Secure Attachment',
      description: 'You communicate needs directly and can tolerate disagreement without it threatening the relationship. This is the goal state.',
      tip: 'Keep doing what you\'re doing. Help your partner feel safe enough to be direct too.',
    },
    disorganized: {
      title: 'Disorganized Attachment',
      description: 'You may feel pulled in two directions — wanting closeness but also fearing it. This can create confusing patterns.',
      tip: 'Notice when you flip between pursuing and withdrawing. Naming the pattern out loud helps break it.',
    },
  };

  const info = styleInfo[assessment.primaryStyle];

  res.json({
    ready: true,
    primaryStyle: assessment.primaryStyle,
    confidence: Math.round(assessment.confidence * 100),
    subState: assessment.subState,
    dataPoints: assessment.history.length,
    ...info,
    disclaimer: 'This is a behavioral pattern assessment, not a clinical diagnosis. Your attachment style can change over time.',
    updatedAt: assessment.updatedAt,
  });
});

export { router as attachmentRouter };
