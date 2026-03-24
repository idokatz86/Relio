/**
 * Schema Migration Runner
 *
 * Reads SQL files from the db/ directory and applies them idempotently.
 * All schemas use IF NOT EXISTS / CREATE OR REPLACE patterns.
 *
 * Run on startup when AUTO_MIGRATE=true.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTier1Pool, getTier3Pool, isInMemoryMode } from './pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Order matters: tier1 first (users table), then tier3, then auth (extends users), then deletion
const TIER1_SCHEMAS = ['schema-tier1.sql'];
const TIER3_SCHEMAS = ['schema-tier3.sql', 'schema-auth.sql', 'schema-deletion.sql'];

async function applySchemaFile(
  pool: import('pg').Pool,
  filePath: string,
  label: string,
): Promise<boolean> {
  try {
    const sql = await readFile(filePath, 'utf-8');
    await pool.query(sql);
    console.log(`[Migrate] ✓ Applied ${label}`);
    return true;
  } catch (err: any) {
    // Many statements use IF NOT EXISTS so re-running is safe.
    // Only log real failures (not "already exists" errors).
    if (err.code === '42710' || err.code === '42P07') {
      // 42710 = object already exists, 42P07 = relation already exists
      console.log(`[Migrate] ⊘ Skipped ${label} (already applied)`);
      return true;
    }
    console.error(`[Migrate] ✗ Failed ${label}:`, err.message);
    return false;
  }
}

export async function runMigrations(): Promise<{ applied: string[]; failed: string[] }> {
  if (isInMemoryMode()) {
    console.log('[Migrate] Skipping — in-memory mode');
    return { applied: [], failed: [] };
  }

  const applied: string[] = [];
  const failed: string[] = [];

  const tier1Pool = getTier1Pool();
  const tier3Pool = getTier3Pool();

  // Apply Tier 1 schemas
  for (const file of TIER1_SCHEMAS) {
    const filePath = join(__dirname, file);
    const ok = await applySchemaFile(tier1Pool, filePath, `tier1/${file}`);
    (ok ? applied : failed).push(`tier1/${file}`);
  }

  // Apply Tier 3 schemas
  for (const file of TIER3_SCHEMAS) {
    const filePath = join(__dirname, file);
    const ok = await applySchemaFile(tier3Pool, filePath, `tier3/${file}`);
    (ok ? applied : failed).push(`tier3/${file}`);
  }

  console.log(`[Migrate] Complete: ${applied.length} applied, ${failed.length} failed`);
  return { applied, failed };
}
