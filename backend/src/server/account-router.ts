/**
 * Account Management Router
 * 
 * GDPR Article 17 compliance: Right to Erasure with 24h grace period.
 * Cascade: soft-delete → 24h grace → hard purge (Tier 1+2+3 + consent + invites).
 * 
 * Issue #125: Account deletion flow (24h grace + cascade)
 * @see .github/agents/chief-info-security-officer.agent.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedUser } from '../auth/auth-service.js';
import { isInMemoryMode } from '../db/pool.js';
import * as deletionRepo from '../db/repositories/deletion-repo.js';

const router = Router();

// ── Types ────────────────────────────────────────────────────
interface DeletionRequest {
  userId: string;
  requestedAt: string;
  scheduledPurgeAt: string;
  cancelled: boolean;
  purged: boolean;
  reason: string | null;
}

// In-memory store (until DB connected)
const deletionQueue = new Map<string, DeletionRequest>();

// Grace period: 24 hours
const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

// ── Schemas ──────────────────────────────────────────────────
const DeleteRequestSchema = z.object({
  reason: z.string().max(500).optional(),
  confirmPhrase: z.literal('DELETE MY ACCOUNT', {
    errorMap: () => ({ message: 'Must type exactly "DELETE MY ACCOUNT" to confirm' }),
  }),
});

// ── Routes ───────────────────────────────────────────────────

/**
 * POST /delete — Request account deletion.
 * Starts 24h grace period. User can cancel within window.
 */
router.post('/delete', async (req: Request, res: Response) => {
  const parsed = DeleteRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.issues });
    return;
  }

  const user = (req as any).user as AuthenticatedUser;

  if (!isInMemoryMode()) {
    try {
      const existing = await deletionRepo.getDeletionRequest(user.id);
      if (existing && !existing.cancelled_at && !existing.purged_at) {
        res.status(409).json({
          error: 'Deletion already scheduled',
          scheduledPurgeAt: existing.scheduled_purge_at,
          canCancelUntil: existing.scheduled_purge_at,
        });
        return;
      }

      const request = await deletionRepo.requestDeletion(user.id, parsed.data.reason ?? null);
      res.json({
        scheduled: true,
        scheduledPurgeAt: request.scheduled_purge_at,
        graceHours: 24,
        message: 'Your account is scheduled for deletion. You can cancel within 24 hours.',
      });
      return;
    } catch (err) {
      console.error('[Account] DB delete error:', err);
      res.status(500).json({ error: 'Failed to schedule deletion' });
      return;
    }
  }

  // In-memory fallback
  const existing = deletionQueue.get(user.id);

  if (existing && !existing.cancelled && !existing.purged) {
    res.status(409).json({
      error: 'Deletion already scheduled',
      scheduledPurgeAt: existing.scheduledPurgeAt,
      canCancelUntil: existing.scheduledPurgeAt,
    });
    return;
  }

  const now = new Date();
  const purgeAt = new Date(now.getTime() + GRACE_PERIOD_MS);

  const request: DeletionRequest = {
    userId: user.id,
    requestedAt: now.toISOString(),
    scheduledPurgeAt: purgeAt.toISOString(),
    cancelled: false,
    purged: false,
    reason: parsed.data.reason ?? null,
  };

  deletionQueue.set(user.id, request);

  res.json({
    scheduled: true,
    scheduledPurgeAt: request.scheduledPurgeAt,
    graceHours: 24,
    message: 'Your account is scheduled for deletion. You can cancel within 24 hours.',
  });
});

/**
 * POST /delete/cancel — Cancel pending deletion within grace period.
 */
router.post('/delete/cancel', async (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;

  if (!isInMemoryMode()) {
    try {
      const cancelled = await deletionRepo.cancelDeletion(user.id);
      if (!cancelled) {
        res.status(404).json({ error: 'No pending deletion request found' });
        return;
      }
      res.json({ cancelled: true, message: 'Account deletion cancelled. Your data is safe.' });
      return;
    } catch (err) {
      console.error('[Account] DB cancel error:', err);
      res.status(500).json({ error: 'Failed to cancel deletion' });
      return;
    }
  }

  // In-memory fallback
  const request = deletionQueue.get(user.id);

  if (!request || request.cancelled || request.purged) {
    res.status(404).json({ error: 'No pending deletion request found' });
    return;
  }

  if (new Date() > new Date(request.scheduledPurgeAt)) {
    res.status(410).json({ error: 'Grace period expired. Data has been purged.' });
    return;
  }

  request.cancelled = true;
  res.json({ cancelled: true, message: 'Account deletion cancelled. Your data is safe.' });
});

/**
 * GET /delete/status — Check deletion status.
 */
router.get('/delete/status', async (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;

  if (!isInMemoryMode()) {
    try {
      const request = await deletionRepo.getDeletionRequest(user.id);
      if (!request) {
        res.json({ hasPendingDeletion: false });
        return;
      }
      const now = new Date();
      const purgeAt = new Date(request.scheduled_purge_at);
      const remainingMs = Math.max(0, purgeAt.getTime() - now.getTime());

      res.json({
        hasPendingDeletion: !request.cancelled_at && !request.purged_at,
        scheduledPurgeAt: request.scheduled_purge_at,
        remainingHours: Math.ceil(remainingMs / (60 * 60 * 1000)),
        cancelled: !!request.cancelled_at,
        purged: !!request.purged_at,
      });
      return;
    } catch (err) {
      console.error('[Account] DB status error:', err);
      res.status(500).json({ error: 'Failed to get deletion status' });
      return;
    }
  }

  // In-memory fallback
  const request = deletionQueue.get(user.id);

  if (!request) {
    res.json({ hasPendingDeletion: false });
    return;
  }

  const now = new Date();
  const purgeAt = new Date(request.scheduledPurgeAt);
  const remainingMs = Math.max(0, purgeAt.getTime() - now.getTime());

  res.json({
    hasPendingDeletion: !request.cancelled && !request.purged,
    scheduledPurgeAt: request.scheduledPurgeAt,
    remainingHours: Math.ceil(remainingMs / (60 * 60 * 1000)),
    cancelled: request.cancelled,
    purged: request.purged,
  });
});

/**
 * Data export (GDPR Article 20: Right to Portability).
 * Issue #126: Returns all user data as JSON.
 */
router.get('/export', async (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;

  // Collect all user data from in-memory stores
  // In production, this queries Tier 1 + Tier 3 databases
  const exportData = {
    exportedAt: new Date().toISOString(),
    format: 'relio-export-v1',
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
    // Placeholder: real data comes from DB after DB integration
    tier1_private: {
      note: 'Private journal entries and raw messages (Tier 1) — available after DB integration',
    },
    tier3_shared: {
      note: 'Shared mediation outputs (Tier 3) — available after DB integration',
    },
    consent: {
      note: 'Consent records — available after DB integration',
    },
  };

  res.setHeader('Content-Disposition', `attachment; filename="relio-export-${user.id.slice(0, 8)}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.json(exportData);
});

/**
 * Background purge processor.
 * In production, this runs as a scheduled Azure Function or pg_cron job.
 * For now, called on server startup and every hour.
 */
export async function processDeletionQueue(): Promise<number> {
  // DB mode: use deletion-repo's executeDeletion for expired requests
  if (!isInMemoryMode()) {
    try {
      const { getTier3Pool } = await import('../db/pool.js');
      const pool = getTier3Pool();
      const result = await pool.query<{ user_id: string }>(
        `SELECT user_id FROM deletion_requests
         WHERE cancelled_at IS NULL AND purged_at IS NULL
           AND scheduled_purge_at <= now()`,
      );
      let purged = 0;
      for (const row of result.rows) {
        try {
          await deletionRepo.executeDeletion(row.user_id);
          purged++;
        } catch (err) {
          console.error(`[Account] Failed to purge user ${row.user_id}:`, err);
        }
      }
      if (purged > 0) console.log(`[Account] Purged ${purged} accounts via DB`);
      return purged;
    } catch (err) {
      console.error('[Account] DB purge check failed:', err);
      return 0;
    }
  }

  // In-memory fallback
  const now = new Date();
  let purged = 0;

  for (const [userId, request] of deletionQueue) {
    if (request.cancelled || request.purged) continue;
    if (now >= new Date(request.scheduledPurgeAt)) {
      // GDPR cascade: purge ALL user data
      console.log(`[Account] Purging user ${userId} — grace period expired`);

      // In production with DB:
      // 1. DELETE FROM tier1_messages WHERE sender_id = userId
      // 2. DELETE FROM journal_entries WHERE user_id = userId
      // 3. DELETE FROM safety_audit_log WHERE user_id = userId
      // 4. DELETE FROM consent_records WHERE user_id = userId
      // 5. DELETE FROM consent_audit WHERE user_id = userId
      // 6. DELETE FROM refresh_tokens WHERE user_id = userId
      // 7. DELETE FROM users WHERE id = userId
      // 8. Revoke Clerk user via API
      // 9. Clear Redis session cache

      request.purged = true;
      purged++;
    }
  }

  if (purged > 0) {
    console.log(`[Account] Purged ${purged} accounts`);
  }
  return purged;
}

// Run purge check every hour
setInterval(processDeletionQueue, 60 * 60 * 1000);

/**
 * DELETE / — Apple 5.1.1(v) compliant account deletion.
 * Convenience route: same logic as POST /delete but with HTTP DELETE method.
 * Apple App Review requires a DELETE endpoint for account removal.
 *
 * Issue #160: Server-side account deletion — Apple 5.1.1(v)
 */
router.delete('/', async (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;

  if (!isInMemoryMode()) {
    try {
      const existing = await deletionRepo.getDeletionRequest(user.id);
      if (existing && !existing.cancelled_at && !existing.purged_at) {
        res.status(409).json({
          error: 'Deletion already scheduled',
          scheduledPurgeAt: existing.scheduled_purge_at,
        });
        return;
      }

      const request = await deletionRepo.requestDeletion(user.id, 'Apple account deletion');
      res.json({
        scheduled: true,
        scheduledPurgeAt: request.scheduled_purge_at,
        graceHours: 24,
        message: 'Your account is scheduled for deletion. You can cancel within 24 hours.',
      });
      return;
    } catch (err) {
      console.error('[Account] DB delete error:', err);
      res.status(500).json({ error: 'Failed to schedule deletion' });
      return;
    }
  }

  // In-memory fallback
  const existing = deletionQueue.get(user.id);
  if (existing && !existing.cancelled && !existing.purged) {
    res.status(409).json({
      error: 'Deletion already scheduled',
      scheduledPurgeAt: existing.scheduledPurgeAt,
    });
    return;
  }

  const now = new Date();
  const purgeAt = new Date(now.getTime() + GRACE_PERIOD_MS);
  const request: DeletionRequest = {
    userId: user.id,
    requestedAt: now.toISOString(),
    scheduledPurgeAt: purgeAt.toISOString(),
    cancelled: false,
    purged: false,
    reason: 'Apple account deletion',
  };
  deletionQueue.set(user.id, request);

  res.json({
    scheduled: true,
    scheduledPurgeAt: request.scheduledPurgeAt,
    graceHours: 24,
    message: 'Your account is scheduled for deletion. You can cancel within 24 hours.',
  });
});

export { router as accountRouter };
