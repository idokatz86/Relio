/**
 * PostgreSQL Connection Pool Manager
 *
 * Manages two physically isolated pools:
 *   - tier1Pool → Private DB (raw messages, safety logs, journals)
 *   - tier3Pool → Shared DB (rooms, tier3 messages, sessions, invites, consent)
 *
 * Falls back to in-memory mode when POSTGRES_TIER1_URL is not set (dev mode).
 *
 * @see schema-tier1.sql, schema-tier3.sql
 */

import pg from 'pg';

const { Pool } = pg;

// ── Configuration ────────────────────────────────────────────

const POOL_MAX = parseInt(process.env.PG_POOL_MAX ?? '10', 10);
const IDLE_TIMEOUT_MS = parseInt(process.env.PG_IDLE_TIMEOUT_MS ?? '30000', 10);
const CONNECTION_TIMEOUT_MS = parseInt(process.env.PG_CONNECTION_TIMEOUT_MS ?? '5000', 10);
const STATEMENT_TIMEOUT_MS = parseInt(process.env.PG_STATEMENT_TIMEOUT_MS ?? '30000', 10);

// ── State ────────────────────────────────────────────────────

let tier1Pool: pg.Pool | null = null;
let tier3Pool: pg.Pool | null = null;
let inMemoryMode = false;

function createPool(connectionString: string): pg.Pool {
  return new Pool({
    connectionString,
    max: POOL_MAX,
    idleTimeoutMillis: IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    statement_timeout: STATEMENT_TIMEOUT_MS,
    ssl: connectionString.includes('sslmode=require') || connectionString.includes('sslmode=verify')
      ? { rejectUnauthorized: false }
      : undefined,
  });
}

// ── Initialization ───────────────────────────────────────────

export async function initializePools(): Promise<void> {
  const tier1Url = process.env.POSTGRES_TIER1_URL;
  const tier3Url = process.env.POSTGRES_TIER3_URL;

  if (!tier1Url) {
    inMemoryMode = true;
    console.log('[DB] No POSTGRES_TIER1_URL set — running in-memory mode (dev only)');
    return;
  }

  tier1Pool = createPool(tier1Url);
  tier3Pool = tier3Url ? createPool(tier3Url) : createPool(tier1Url);

  // Attach error handlers so a single bad connection doesn't crash the process
  tier1Pool.on('error', (err) => {
    console.error('[DB] Tier 1 pool idle client error:', err.message);
  });
  tier3Pool.on('error', (err) => {
    console.error('[DB] Tier 3 pool idle client error:', err.message);
  });

  // Verify connectivity
  const t1 = await tier1Pool.query('SELECT 1');
  console.log('[DB] Tier 1 pool connected', t1.rowCount === 1 ? '✓' : '✗');

  const t3 = await tier3Pool.query('SELECT 1');
  console.log('[DB] Tier 3 pool connected', t3.rowCount === 1 ? '✓' : '✗');

  if (!tier3Url) {
    console.log('[DB] Tier 3 sharing Tier 1 connection (single-DB dev mode)');
  }
}

// ── Getters ──────────────────────────────────────────────────

export function getTier1Pool(): pg.Pool {
  if (!tier1Pool) throw new Error('Tier 1 pool not initialized — call initializePools() first');
  return tier1Pool;
}

export function getTier3Pool(): pg.Pool {
  if (!tier3Pool) throw new Error('Tier 3 pool not initialized — call initializePools() first');
  return tier3Pool;
}

export function isInMemoryMode(): boolean {
  return inMemoryMode || (!tier1Pool && !tier3Pool);
}

// ── RLS Helper ───────────────────────────────────────────────
// Sets the session variable that RLS policies read.
// Must be called inside the same client/transaction that runs the query.

export async function setRlsContext(
  client: pg.PoolClient,
  userId: string,
  role?: string,
): Promise<void> {
  await client.query(`SET LOCAL app.current_user_id = $1`, [userId]);
  if (role) {
    await client.query(`SET LOCAL app.current_user_role = $1`, [role]);
  }
}

// ── Health Check ─────────────────────────────────────────────

export interface DbHealth {
  mode: 'postgres' | 'in-memory';
  tier1: { connected: boolean; totalCount: number; idleCount: number; waitingCount: number } | null;
  tier3: { connected: boolean; totalCount: number; idleCount: number; waitingCount: number } | null;
}

export async function getDbHealth(): Promise<DbHealth> {
  if (inMemoryMode) {
    return { mode: 'in-memory', tier1: null, tier3: null };
  }

  const checkPool = async (pool: pg.Pool | null) => {
    if (!pool) return null;
    try {
      await pool.query('SELECT 1');
      return {
        connected: true,
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      };
    } catch {
      return {
        connected: false,
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      };
    }
  };

  return {
    mode: 'postgres',
    tier1: await checkPool(tier1Pool),
    tier3: await checkPool(tier3Pool),
  };
}

// ── Graceful Shutdown ────────────────────────────────────────

export async function shutdownPools(): Promise<void> {
  const tasks: Promise<void>[] = [];
  if (tier1Pool) tasks.push(tier1Pool.end());
  if (tier3Pool && tier3Pool !== tier1Pool) tasks.push(tier3Pool.end());
  await Promise.all(tasks);
  tier1Pool = null;
  tier3Pool = null;
  console.log('[DB] All pools closed');
}
