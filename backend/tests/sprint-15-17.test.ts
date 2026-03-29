/**
 * Sprint 15-17 Feature Tests
 *
 * Tests for: Solo Translation, Trial, Pattern Tracking,
 * Attachment Profiling, Social Proof endpoints.
 *
 * Run: npm test -- tests/sprint-15-17.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3001';
const AUTH_HEADER = { 'Content-Type': 'application/json' };

// Helper: make authenticated request (AUTH_DISABLED=true in test)
async function api(method: string, path: string, body?: any) {
  const opts: RequestInit = {
    method,
    headers: AUTH_HEADER,
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(`${BASE}${path}`, opts);
}

// ── Solo Translation (Issue #197) ────────────────────────────
describe('Solo Translation API', () => {
  it('POST /api/v1/solo/translate — returns Tier 3 output', async () => {
    const res = await api('POST', '/api/v1/solo/translate', {
      message: 'He never listens to me, I feel invisible.',
      preferredLanguage: 'en',
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.translated).toBe(true);
    expect(data.tier3Output).toBeTruthy();
    expect(data.tier3Output.length).toBeGreaterThan(10);
    expect(data.usage).toBeDefined();
    expect(data.usage.used).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/v1/solo/translate — rejects empty message', async () => {
    const res = await api('POST', '/api/v1/solo/translate', {
      message: '',
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/v1/solo/translate — rejects too-long message', async () => {
    const res = await api('POST', '/api/v1/solo/translate', {
      message: 'x'.repeat(2001),
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/solo/usage — returns usage stats', async () => {
    const res = await api('GET', '/api/v1/solo/usage');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.used).toBeDefined();
    expect(data.tier).toBeDefined();
  });

  it('GET /api/v1/solo/history — returns translation history', async () => {
    const res = await api('GET', '/api/v1/solo/history');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.translations).toBeDefined();
    expect(Array.isArray(data.translations)).toBe(true);
  });

  it('Solo translation Tier 3 output does NOT contain Tier 1 input', async () => {
    const rawInput = 'My husband John is a terrible lazy person from Seattle';
    const res = await api('POST', '/api/v1/solo/translate', {
      message: rawInput,
      preferredLanguage: 'en',
    });
    const data = await res.json();
    if (data.tier3Output) {
      expect(data.tier3Output.toLowerCase()).not.toContain('john');
      expect(data.tier3Output.toLowerCase()).not.toContain('terrible');
      expect(data.tier3Output.toLowerCase()).not.toContain('lazy');
      expect(data.tier3Output.toLowerCase()).not.toContain('seattle');
    }
  });
});

// ── Trial (Issue #200) ───────────────────────────────────────
describe('Trial API', () => {
  it('POST /api/v1/trial/start — starts 14-day trial', async () => {
    const res = await api('POST', '/api/v1/trial/start');
    expect(res.status).toBeOneOf([200, 201]);
    const data = await res.json();
    expect(data.daysRemaining).toBeDefined();
  });

  it('GET /api/v1/trial/status — returns trial state', async () => {
    const res = await api('GET', '/api/v1/trial/status');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.active).toBe('boolean');
    expect(typeof data.daysRemaining).toBe('number');
  });

  it('POST /api/v1/trial/start — cannot restart expired trial', async () => {
    // First start
    await api('POST', '/api/v1/trial/start');
    // Second start should not create a new trial
    const res = await api('POST', '/api/v1/trial/start');
    const data = await res.json();
    expect(data.started).toBe(false);
  });
});

// ── Pattern Tracking (Issue #206) ────────────────────────────
describe('Pattern Tracking API', () => {
  it('GET /api/v1/patterns/weekly — returns weekly summary', async () => {
    const res = await api('GET', '/api/v1/patterns/weekly');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.week).toBeDefined();
    expect(data.themes).toBeDefined();
    expect(Array.isArray(data.themes)).toBe(true);
  });

  it('GET /api/v1/patterns/trends — returns 4-week trends', async () => {
    const res = await api('GET', '/api/v1/patterns/trends');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.trends).toBeDefined();
    expect(data.trends.length).toBe(4);
  });
});

// ── Attachment Profiling (Issue #207) ─────────────────────────
describe('Attachment Profiling API', () => {
  it('GET /api/v1/attachment/profile — returns assessment', async () => {
    const res = await api('GET', '/api/v1/attachment/profile');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.ready).toBe('boolean');
    if (!data.ready) {
      expect(data.translationsNeeded).toBeGreaterThan(0);
    }
  });

  it('Attachment profile needs 5+ translations', async () => {
    const res = await api('GET', '/api/v1/attachment/profile');
    const data = await res.json();
    // Without 5 translations, should not be ready
    if (data.ready === false) {
      expect(data.translationsNeeded).toBeGreaterThan(0);
      expect(data.message).toContain('more translation');
    }
  });
});

// ── Social Proof (Issue #210) ────────────────────────────────
describe('Social Proof API', () => {
  it('GET /api/v1/social-proof — returns public stats (no auth)', async () => {
    const res = await fetch(`${BASE}/api/v1/social-proof`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.couplesThisMonth).toBeGreaterThanOrEqual(10);
    expect(data.frameworks).toContain('Gottman Method');
    expect(data.frameworks).toContain('Emotionally Focused Therapy');
  });
});

// ── Health Check ─────────────────────────────────────────────
describe('Health & Infrastructure', () => {
  it('GET /health — returns ok', async () => {
    const res = await fetch(`${BASE}/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
  });
});

// ── Cross-Cutting: Canary Leak Prevention ────────────────────
describe('Solo Mode Canary Leak Tests', () => {
  it('Tier 1 PII never appears in Tier 3 solo output', async () => {
    const piiInput = 'Sarah told me at 123 Main St that she hates my email john@gmail.com';
    const res = await api('POST', '/api/v1/solo/translate', {
      message: piiInput,
      preferredLanguage: 'en',
    });
    const data = await res.json();
    if (data.tier3Output) {
      expect(data.tier3Output).not.toContain('Sarah');
      expect(data.tier3Output).not.toContain('123 Main St');
      expect(data.tier3Output).not.toContain('john@gmail.com');
    }
  });

  it('Hebrew PII canary check', async () => {
    const heInput = 'דני תמיד צועק עליי בדירה שלנו ברחוב הרצל 5 תל אביב';
    const res = await api('POST', '/api/v1/solo/translate', {
      message: heInput,
      preferredLanguage: 'he',
    });
    const data = await res.json();
    if (data.tier3Output) {
      expect(data.tier3Output).not.toContain('דני');
      expect(data.tier3Output).not.toContain('הרצל 5');
    }
  });
});
