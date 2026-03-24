/**
 * Tier 1 Repository — Private Database
 *
 * Handles: users, raw messages, safety audit logs, journal entries.
 * All queries use RLS via SET LOCAL app.current_user_id.
 *
 * @see schema-tier1.sql
 */

import { getTier1Pool, isInMemoryMode, setRlsContext } from '../pool.js';

// ── Types ────────────────────────────────────────────────────

export interface User {
  id: string;
  external_id: string;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Tier1Message {
  id: string;
  room_id: string;
  sender_id: string;
  raw_content: string;
  safety_severity: string;
  safety_halt: boolean;
  safety_reasoning: string | null;
  created_at: string;
}

export interface SafetyAuditEntry {
  id: string;
  room_id: string;
  user_id: string;
  severity: string;
  halt: boolean;
  reasoning: string;
  markers: string[];
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  prompt: string | null;
  created_at: string;
}

// ── User Operations ──────────────────────────────────────────

export async function insertUser(
  externalId: string,
  email: string,
  displayName: string,
): Promise<User> {
  if (isInMemoryMode()) throw new Error('insertUser requires PostgreSQL');

  const pool = getTier1Pool();
  const result = await pool.query<User>(
    `INSERT INTO users (external_id, email, display_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (external_id) DO UPDATE SET
       email = EXCLUDED.email,
       display_name = EXCLUDED.display_name,
       updated_at = now()
     RETURNING *`,
    [externalId, email, displayName],
  );
  return result.rows[0];
}

export async function getUserByExternalId(externalId: string): Promise<User | null> {
  if (isInMemoryMode()) return null;

  const pool = getTier1Pool();
  const result = await pool.query<User>(
    `SELECT * FROM users WHERE external_id = $1`,
    [externalId],
  );
  return result.rows[0] ?? null;
}

// ── Tier 1 Messages (RLS-protected) ─────────────────────────

export async function insertTier1Message(
  roomId: string,
  senderId: string,
  rawContent: string,
  safetySeverity: string,
  safetyHalt: boolean,
  safetyReasoning: string | null,
): Promise<Tier1Message> {
  if (isInMemoryMode()) throw new Error('insertTier1Message requires PostgreSQL');

  const pool = getTier1Pool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setRlsContext(client, senderId);

    const result = await client.query<Tier1Message>(
      `INSERT INTO tier1_messages (room_id, sender_id, raw_content, safety_severity, safety_halt, safety_reasoning)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [roomId, senderId, rawContent, safetySeverity, safetyHalt, safetyReasoning],
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

// ── Safety Audit Log (RLS-protected) ─────────────────────────

export async function insertSafetyAuditLog(
  roomId: string,
  userId: string,
  severity: string,
  halt: boolean,
  reasoning: string,
  markers: string[],
): Promise<SafetyAuditEntry> {
  if (isInMemoryMode()) throw new Error('insertSafetyAuditLog requires PostgreSQL');

  const pool = getTier1Pool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setRlsContext(client, userId);

    const result = await client.query<SafetyAuditEntry>(
      `INSERT INTO safety_audit_log (room_id, user_id, severity, halt, reasoning, markers)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [roomId, userId, severity, halt, reasoning, markers],
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

// ── Journal Entries (RLS-protected) ──────────────────────────

export async function insertJournalEntry(
  userId: string,
  content: string,
  prompt: string | null,
): Promise<JournalEntry> {
  if (isInMemoryMode()) throw new Error('insertJournalEntry requires PostgreSQL');

  const pool = getTier1Pool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setRlsContext(client, userId);

    const result = await client.query<JournalEntry>(
      `INSERT INTO journal_entries (user_id, content, prompt)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, content, prompt],
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

export async function getJournalEntries(
  userId: string,
  limit = 20,
): Promise<JournalEntry[]> {
  if (isInMemoryMode()) return [];

  const pool = getTier1Pool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setRlsContext(client, userId);

    const result = await client.query<JournalEntry>(
      `SELECT * FROM journal_entries
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit],
    );

    await client.query('COMMIT');
    return result.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ── Aggregate Queries ────────────────────────────────────────

export async function countUsers(): Promise<number> {
  if (isInMemoryMode()) return 0;

  const pool = getTier1Pool();
  const result = await pool.query<{ count: string }>('SELECT COUNT(*) FROM users');
  return parseInt(result.rows[0]?.count || '0', 10);
}
