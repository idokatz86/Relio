/**
 * Auth & Consent Repository — Shared Database
 *
 * Handles: consent_records, consent_audit.
 * RLS is enforced on consent tables via app.current_user_id.
 *
 * @see schema-auth.sql
 */

import { getTier3Pool, isInMemoryMode, setRlsContext } from '../pool.js';

// ── Types ────────────────────────────────────────────────────

export interface ConsentRecord {
  id: string;
  user_id: string;
  tos_version: string;
  tos_accepted_at: string;
  privacy_version: string;
  privacy_accepted_at: string;
  age_verified: boolean;
  age_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsentAuditEntry {
  id: string;
  user_id: string;
  action: string;
  version: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ── Consent Records (RLS-protected) ─────────────────────────

export async function insertConsentRecord(
  userId: string,
  tosVersion: string,
  privacyVersion: string,
  ageVerified: boolean,
  language?: string,
): Promise<ConsentRecord> {
  if (isInMemoryMode()) throw new Error('insertConsentRecord requires PostgreSQL');

  const pool = getTier3Pool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setRlsContext(client, userId);

    const now = new Date().toISOString();
    const result = await client.query<ConsentRecord>(
      `INSERT INTO consent_records (user_id, tos_version, tos_accepted_at, privacy_version, privacy_accepted_at, age_verified, age_verified_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
         tos_version = EXCLUDED.tos_version,
         tos_accepted_at = EXCLUDED.tos_accepted_at,
         privacy_version = EXCLUDED.privacy_version,
         privacy_accepted_at = EXCLUDED.privacy_accepted_at,
         age_verified = EXCLUDED.age_verified,
         age_verified_at = EXCLUDED.age_verified_at,
         updated_at = now()
       RETURNING *`,
      [userId, tosVersion, now, privacyVersion, now, ageVerified, ageVerified ? now : null],
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getConsentRecord(userId: string): Promise<ConsentRecord | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier3Pool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setRlsContext(client, userId);

    const result = await client.query<ConsentRecord>(
      `SELECT * FROM consent_records WHERE user_id = $1`,
      [userId],
    );

    await client.query('COMMIT');
    return result.rows[0] ?? null;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ── Consent Audit (append-only) ──────────────────────────────

export async function insertConsentAudit(
  userId: string,
  action: string,
  version: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<ConsentAuditEntry> {
  if (isInMemoryMode()) throw new Error('insertConsentAudit requires PostgreSQL');

  const pool = getTier3Pool();
  const result = await pool.query<ConsentAuditEntry>(
    `INSERT INTO consent_audit (user_id, action, version, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, action, version, ipAddress ?? null, userAgent ?? null],
  );
  return result.rows[0];
}

export async function deleteConsentRecord(userId: string): Promise<boolean> {
  if (isInMemoryMode()) return false;

  const pool = getTier3Pool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setRlsContext(client, userId);

    const result = await client.query(
      `DELETE FROM consent_records WHERE user_id = $1`,
      [userId],
    );

    await client.query('COMMIT');
    return (result.rowCount ?? 0) > 0;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getConsentAuditEntries(
  limit = 100,
): Promise<ConsentAuditEntry[]> {
  if (isInMemoryMode()) return [];

  const pool = getTier3Pool();
  const result = await pool.query<ConsentAuditEntry>(
    `SELECT * FROM consent_audit ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return result.rows;
}
