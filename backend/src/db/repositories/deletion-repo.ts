/**
 * GDPR Deletion Repository
 *
 * Handles: deletion_requests, cascade purge across both databases.
 * Implements GDPR Article 17 Right to Erasure with 24h grace period.
 *
 * @see schema-deletion.sql
 */

import { getTier1Pool, getTier3Pool, isInMemoryMode } from '../pool.js';

// ── Types ────────────────────────────────────────────────────

export interface DeletionRequest {
  id: string;
  user_id: string;
  reason: string | null;
  requested_at: string;
  scheduled_purge_at: string;
  cancelled_at: string | null;
  purged_at: string | null;
  created_at: string;
}

// ── Request Deletion (24h grace period) ──────────────────────

export async function requestDeletion(
  userId: string,
  reason: string | null,
): Promise<DeletionRequest> {
  if (isInMemoryMode()) throw new Error('requestDeletion requires PostgreSQL');

  const pool = getTier3Pool();
  const result = await pool.query<DeletionRequest>(
    `INSERT INTO deletion_requests (user_id, reason, scheduled_purge_at)
     VALUES ($1, $2, now() + INTERVAL '24 hours')
     ON CONFLICT (user_id) DO UPDATE SET
       reason = EXCLUDED.reason,
       requested_at = now(),
       scheduled_purge_at = now() + INTERVAL '24 hours',
       cancelled_at = NULL,
       purged_at = NULL
     RETURNING *`,
    [userId, reason],
  );
  return result.rows[0];
}

// ── Cancel Deletion ──────────────────────────────────────────

export async function cancelDeletion(userId: string): Promise<boolean> {
  if (isInMemoryMode()) return false;

  const pool = getTier3Pool();
  const result = await pool.query(
    `UPDATE deletion_requests
     SET cancelled_at = now()
     WHERE user_id = $1
       AND cancelled_at IS NULL
       AND purged_at IS NULL`,
    [userId],
  );
  return (result.rowCount ?? 0) > 0;
}

// ── Execute Deletion (cascade across both DBs) ──────────────

export async function executeDeletion(userId: string): Promise<{
  tier1Deleted: { messages: number; safety: number; journals: number };
  tier3Deleted: { messages: number; sessions: number; members: number; invites: number; consent: number; consentAudit: number; refreshTokens: number };
}> {
  if (isInMemoryMode()) throw new Error('executeDeletion requires PostgreSQL');

  const tier1 = getTier1Pool();
  const tier3 = getTier3Pool();

  // Phase 1: Purge Tier 1 (private data)
  const t1Client = await tier1.connect();
  let t1Messages = 0, t1Safety = 0, t1Journals = 0;
  try {
    await t1Client.query('BEGIN');

    const r1 = await t1Client.query(
      `DELETE FROM tier1_messages WHERE sender_id = $1`, [userId],
    );
    t1Messages = r1.rowCount ?? 0;

    const r2 = await t1Client.query(
      `DELETE FROM safety_audit_log WHERE user_id = $1`, [userId],
    );
    t1Safety = r2.rowCount ?? 0;

    const r3 = await t1Client.query(
      `DELETE FROM journal_entries WHERE user_id = $1`, [userId],
    );
    t1Journals = r3.rowCount ?? 0;

    await t1Client.query('COMMIT');
  } catch (err) {
    await t1Client.query('ROLLBACK');
    throw err;
  } finally {
    t1Client.release();
  }

  // Phase 2: Purge Tier 3 (shared data)
  const t3Client = await tier3.connect();
  let t3Messages = 0, t3Sessions = 0, t3Members = 0, t3Invites = 0;
  let t3Consent = 0, t3ConsentAudit = 0, t3RefreshTokens = 0;
  try {
    await t3Client.query('BEGIN');

    const r4 = await t3Client.query(
      `DELETE FROM tier3_messages WHERE sender_id = $1`, [userId],
    );
    t3Messages = r4.rowCount ?? 0;

    const r5 = await t3Client.query(
      `DELETE FROM sessions WHERE user_id = $1`, [userId],
    );
    t3Sessions = r5.rowCount ?? 0;

    const r6 = await t3Client.query(
      `DELETE FROM room_members WHERE user_id = $1`, [userId],
    );
    t3Members = r6.rowCount ?? 0;

    const r7 = await t3Client.query(
      `DELETE FROM room_invites WHERE created_by = $1`, [userId],
    );
    t3Invites = r7.rowCount ?? 0;

    // Consent audit is kept for legal compliance but anonymized
    const r8a = await t3Client.query(
      `DELETE FROM consent_records WHERE user_id = $1`, [userId],
    );
    t3Consent = r8a.rowCount ?? 0;

    // Anonymize audit trail (retain for compliance, remove PII link)
    const r8b = await t3Client.query(
      `UPDATE consent_audit SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id = $1`,
      [userId],
    );
    t3ConsentAudit = r8b.rowCount ?? 0;

    const r9 = await t3Client.query(
      `DELETE FROM refresh_tokens WHERE user_id = $1`, [userId],
    );
    t3RefreshTokens = r9.rowCount ?? 0;

    // Mark deletion as purged
    await t3Client.query(
      `UPDATE deletion_requests SET purged_at = now() WHERE user_id = $1 AND purged_at IS NULL`,
      [userId],
    );

    // Finally remove the user record
    await t3Client.query(`DELETE FROM users WHERE id = $1`, [userId]);

    await t3Client.query('COMMIT');
  } catch (err) {
    await t3Client.query('ROLLBACK');
    throw err;
  } finally {
    t3Client.release();
  }

  console.log(`[GDPR] Deletion executed for user ${userId}: T1(msg=${t1Messages},safety=${t1Safety},journal=${t1Journals}) T3(msg=${t3Messages},ses=${t3Sessions},mem=${t3Members})`);

  return {
    tier1Deleted: { messages: t1Messages, safety: t1Safety, journals: t1Journals },
    tier3Deleted: {
      messages: t3Messages,
      sessions: t3Sessions,
      members: t3Members,
      invites: t3Invites,
      consent: t3Consent,
      consentAudit: t3ConsentAudit,
      refreshTokens: t3RefreshTokens,
    },
  };
}

// ── Query Deletion Status ────────────────────────────────────

export async function getDeletionRequest(
  userId: string,
): Promise<DeletionRequest | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier3Pool();
  const result = await pool.query<DeletionRequest>(
    `SELECT * FROM deletion_requests
     WHERE user_id = $1
     ORDER BY requested_at DESC LIMIT 1`,
    [userId],
  );
  return result.rows[0] ?? null;
}
