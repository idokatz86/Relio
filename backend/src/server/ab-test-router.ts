/**
 * A/B Test Infrastructure
 *
 * Issue #131: Lightweight feature flag + A/B testing for onboarding experiments.
 * Server-side assignment, client-side rendering.
 * 
 * Usage:
 *   const variant = getVariant(userId, 'onboarding_flow');
 *   // variant === 'control' | 'variant_a' | 'variant_b'
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import type { AuthenticatedUser } from '../auth/auth-service.js';

const router = Router();

// ── Experiment Config ────────────────────────────────────────
interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: string[];
  weights: number[];       // Must sum to 1.0
  active: boolean;
  startedAt: string;
}

const experiments: Map<string, Experiment> = new Map([
  ['onboarding_flow', {
    id: 'onboarding_flow',
    name: 'Onboarding Flow',
    description: 'Test different onboarding sequences',
    variants: ['control', 'variant_a'],
    weights: [0.5, 0.5],
    active: true,
    startedAt: new Date().toISOString(),
  }],
  ['coach_tone', {
    id: 'coach_tone',
    name: 'Coach Tone',
    description: 'Test more direct vs more empathetic coaching tone',
    variants: ['empathetic', 'direct'],
    weights: [0.5, 0.5],
    active: false,
    startedAt: new Date().toISOString(),
  }],
]);

// Track assignments for analysis
const assignments = new Map<string, Map<string, string>>(); // userId -> experimentId -> variant

// ── Deterministic Assignment ─────────────────────────────────

/**
 * Assign a user to an experiment variant deterministically.
 * Same userId + experimentId always returns same variant (stable assignment).
 */
export function getVariant(userId: string, experimentId: string): string {
  const experiment = experiments.get(experimentId);
  if (!experiment || !experiment.active) {
    return 'control';
  }

  // Check if already assigned
  const userAssignments = assignments.get(userId);
  if (userAssignments?.has(experimentId)) {
    return userAssignments.get(experimentId)!;
  }

  // Deterministic hash-based assignment
  const hash = crypto.createHash('sha256')
    .update(`${userId}:${experimentId}`)
    .digest('hex');
  const bucket = parseInt(hash.slice(0, 8), 16) / 0xFFFFFFFF;

  let cumulative = 0;
  let variant = experiment.variants[0];
  for (let i = 0; i < experiment.weights.length; i++) {
    cumulative += experiment.weights[i];
    if (bucket <= cumulative) {
      variant = experiment.variants[i];
      break;
    }
  }

  // Store assignment
  if (!assignments.has(userId)) {
    assignments.set(userId, new Map());
  }
  assignments.get(userId)!.set(experimentId, variant);

  return variant;
}

// ── API Routes ───────────────────────────────────────────────

// Get all active experiment assignments for current user
router.get('/assignments', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const result: Record<string, string> = {};

  for (const [id, exp] of experiments) {
    if (exp.active) {
      result[id] = getVariant(user.id, id);
    }
  }

  res.json({ experiments: result });
});

// Admin: list all experiments
router.get('/experiments', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  if (process.env.AUTH_DISABLED !== 'true' && user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const list = Array.from(experiments.values());
  res.json({ experiments: list, totalAssignments: assignments.size });
});

export { router as abTestRouter };
