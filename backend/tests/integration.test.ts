/**
 * Full User Journey Integration Tests
 *
 * Tests all REST API endpoints using the Express app directly
 * with an ephemeral HTTP server. No running server or database required.
 *
 * Environment: AUTH_DISABLED=true, in-memory DB, mocked LLM gateway.
 *
 * Rate-limit strategy:
 *   The app shares ONE authRateLimit instance (5 req/15 min per key)
 *   across /consent and /account routes. The key is "<ip>-<userId>".
 *   In AUTH_DISABLED mode, userId comes from req.body?.userId || 'dev-user'.
 *   • Consent tests leave userId unset → key = ip-dev-user
 *   • Account POST tests include a dedicated userId → separate key
 *   • Account GET tests (export) use dev-user key
 *   This keeps each key well under 5 so all happy-path tests pass,
 *   and the rate-limit test (20) pushes the dev-user key past 5.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

// ── Env vars MUST be set before any app import ───────────────
// vi.hoisted runs before ESM imports are evaluated.
vi.hoisted(() => {
  process.env.AUTH_DISABLED = 'true';
  process.env.ALLOWED_ORIGINS = 'http://localhost:3000,https://relio.app';
  // DB vars intentionally unset → in-memory mode
});

// ── Mock LLM gateway before any app import ───────────────────
vi.mock('../src/gateway/llm-gateway.js', () => ({
  callLLM: vi.fn(async (agent: string) => {
    switch (agent) {
      case 'safety-guardian':
        return {
          content: JSON.stringify({
            severity: 'SAFE',
            halt: false,
            reasoning: 'No safety concerns detected',
            markers: [],
          }),
          model: 'test',
          provider: 'github' as const,
        };
      case 'orchestrator':
        return {
          content: JSON.stringify({
            tier: 1,
            intent: 'complaint',
            emotionalIntensity: 5,
            nextAgent: 'communication-coach',
            reasoning: 'Routing to coach',
          }),
          model: 'test',
          provider: 'github' as const,
        };
      case 'individual-profiler':
        return {
          content: JSON.stringify({
            attachmentStyle: 'secure',
            confidence: 0.8,
            activationState: 'calm',
          }),
          model: 'test',
          provider: 'github' as const,
        };
      case 'communication-coach':
        return {
          content: 'What does feeling truly heard look like for each of you?',
          model: 'test',
          provider: 'github' as const,
        };
      default:
        return { content: '{}', model: 'test', provider: 'github' as const };
    }
  }),
  AGENT_MODEL_CONFIG: {},
  getProvider: () => 'github',
}));

import { app } from '../src/server/app.js';

// ── Test Infra ───────────────────────────────────────────────
let server: Server;
let baseUrl: string;

// Dedicated userId for account-delete flow so its rate-limit key
// is separate from the consent tests that share "dev-user".
const ACCT_USER = 'acct-delete-test-user';

function url(path: string): string {
  return `${baseUrl}${path}`;
}

async function req(
  path: string,
  opts: RequestInit = {},
): Promise<Response> {
  return fetch(url(path), opts);
}

async function json(path: string, opts: RequestInit = {}): Promise<{ res: Response; body: any }> {
  const res = await req(path, opts);
  const body = await res.json();
  return { res, body };
}

function post(path: string, data: unknown, headers: Record<string, string> = {}): Promise<{ res: Response; body: any }> {
  return json(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
}

beforeAll(async () => {
  server = createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const addr = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${addr.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

// ─────────────────────────────────────────────────────────────
// 1. Health Check
// ─────────────────────────────────────────────────────────────
describe('Full User Journey Integration', () => {
  it('1 — GET /health returns 200 with status ok', async () => {
    const { res, body } = await json('/health');
    expect(res.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('db');
  });

  // ───────────────────────────────────────────────────────────
  // 2–3. Waitlist
  // ───────────────────────────────────────────────────────────
  const waitlistEmail = `integration-${Date.now()}@test.relio.app`;

  it('2 — POST /api/v1/waitlist with valid email returns success', async () => {
    const { res, body } = await post('/api/v1/waitlist', { email: waitlistEmail });
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body).toHaveProperty('position');
  });

  it('3 — POST /api/v1/waitlist with duplicate email returns duplicate flag', async () => {
    const { res, body } = await post('/api/v1/waitlist', { email: waitlistEmail });
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.duplicate).toBe(true);
  });

  // ───────────────────────────────────────────────────────────
  // 4–6. Mediate Endpoint
  // ───────────────────────────────────────────────────────────
  it('4 — POST /api/v1/mediate without Bearer token returns 401', async () => {
    // Temporarily disable auth bypass
    process.env.AUTH_DISABLED = 'false';
    try {
      const { res, body } = await post('/api/v1/mediate', {
        userId: '00000000-0000-0000-0000-000000000001',
        message: 'test',
      });
      expect(res.status).toBe(401);
      expect(body).toHaveProperty('error');
    } finally {
      process.env.AUTH_DISABLED = 'true';
    }
  });

  it('5 — POST /api/v1/mediate with missing fields returns 400', async () => {
    const { res, body } = await post('/api/v1/mediate', { userId: 'not-a-uuid' });
    expect(res.status).toBe(400);
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('details');
  });

  it('6 — POST /api/v1/mediate with oversized message returns 400', async () => {
    const { res, body } = await post('/api/v1/mediate', {
      userId: '00000000-0000-0000-0000-000000000001',
      message: 'x'.repeat(2001),
    });
    expect(res.status).toBe(400);
    expect(body).toHaveProperty('error');
    const messageField = body.details?.find((d: any) => d.field === 'message');
    expect(messageField).toBeDefined();
  });

  // ───────────────────────────────────────────────────────────
  // 7–9. Consent Endpoints
  // ───────────────────────────────────────────────────────────
  it('7 — POST /api/v1/consent/accept with valid consent data', async () => {
    const { res, body } = await post('/api/v1/consent/accept', {
      tosVersion: '1.0.0',
      privacyVersion: '1.0.0',
    });
    expect(res.status).toBe(200);
    expect(body.accepted).toBe(true);
    expect(body.tosVersion).toBe('1.0.0');
    expect(body.privacyVersion).toBe('1.0.0');
  });

  it('8 — GET /api/v1/consent/status returns current consent state', async () => {
    const { res, body } = await json('/api/v1/consent/status');
    expect(res.status).toBe(200);
    expect(body).toHaveProperty('hasConsented');
    expect(body.hasConsented).toBe(true);
    expect(body).toHaveProperty('tosVersion');
    expect(body).toHaveProperty('tosAccepted');
    expect(body).toHaveProperty('ageVerified');
    expect(body).toHaveProperty('currentTosVersion');
    expect(body).toHaveProperty('requiresUpdate');
  });

  it('9 — POST /api/v1/consent/verify-age with valid adult DOB', async () => {
    const { res, body } = await post('/api/v1/consent/verify-age', {
      dateOfBirth: '1990-05-15',
    });
    expect(res.status).toBe(200);
    expect(body.verified).toBe(true);
    expect(body.age).toBeGreaterThanOrEqual(18);
  });

  // ───────────────────────────────────────────────────────────
  // 10–12. Invite Endpoints
  // ───────────────────────────────────────────────────────────
  let inviteCode: string;

  it('10 — POST /api/v1/invite/create creates an invite code', async () => {
    const { res, body } = await post('/api/v1/invite/create', {});
    expect([200, 201]).toContain(res.status);
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('roomId');
    expect(body).toHaveProperty('deepLink');
    inviteCode = body.code;
  });

  it('11 — GET /api/v1/invite/status returns invite/pairing details', async () => {
    const { res, body } = await json('/api/v1/invite/status');
    expect(res.status).toBe(200);
    expect(body).toHaveProperty('paired');
    expect(body).toHaveProperty('roomId');
  });

  it('12 — POST /api/v1/invite/accept with own code returns 400 (cannot self-accept)', async () => {
    // In AUTH_DISABLED mode the user is always 'dev-user',
    // who is also the invite creator → self-accept rejection
    const { res, body } = await post('/api/v1/invite/accept', { code: inviteCode });
    expect(res.status).toBe(400);
    expect(body.error).toContain('cannot accept your own invite');
  });

  // ───────────────────────────────────────────────────────────
  // 13–14. Admin Endpoints
  // ───────────────────────────────────────────────────────────
  it('13 — GET /api/v1/admin/stats/overview without admin role returns 403', async () => {
    // With AUTH_DISABLED=false, no user is attached → 403 from adminAuthMiddleware
    process.env.AUTH_DISABLED = 'false';
    try {
      const { res, body } = await json('/api/v1/admin/stats/overview');
      expect(res.status).toBe(403);
      expect(body.error).toContain('Admin access required');
    } finally {
      process.env.AUTH_DISABLED = 'true';
    }
  });

  it('14 — GET /api/v1/admin/stats/overview with admin role returns stats', async () => {
    // AUTH_DISABLED=true → adminAuthMiddleware grants admin access
    const { res, body } = await json('/api/v1/admin/stats/overview');
    expect(res.status).toBe(200);
    expect(body).toHaveProperty('totalUsers');
    expect(body).toHaveProperty('activeCouples');
    expect(body).toHaveProperty('messagesToday');
    expect(body).toHaveProperty('timestamp');
  });

  // ───────────────────────────────────────────────────────────
  // 15–17. Account Endpoints
  // ───────────────────────────────────────────────────────────
  it('15 — GET /api/v1/account/export returns user data', async () => {
    const { res, body } = await json('/api/v1/account/export');
    expect(res.status).toBe(200);
    expect(body).toHaveProperty('exportedAt');
    expect(body.format).toBe('relio-export-v1');
    expect(body).toHaveProperty('user');
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(res.headers.get('content-disposition')).toContain('attachment');
  });

  it('16 — POST /api/v1/account/delete initiates 24h grace delete', async () => {
    const { res, body } = await post('/api/v1/account/delete', {
      confirmPhrase: 'DELETE MY ACCOUNT',
      reason: 'Integration test',
      userId: ACCT_USER,
    });
    expect(res.status).toBe(200);
    expect(body.scheduled).toBe(true);
    expect(body.graceHours).toBe(24);
    expect(body).toHaveProperty('scheduledPurgeAt');
  });

  it('17 — POST /api/v1/account/delete/cancel cancels pending deletion', async () => {
    const { res, body } = await post('/api/v1/account/delete/cancel', {
      userId: ACCT_USER,
    });
    expect(res.status).toBe(200);
    expect(body.cancelled).toBe(true);
  });

  // ───────────────────────────────────────────────────────────
  // 18. Security Headers
  // ───────────────────────────────────────────────────────────
  it('18 — Helmet security headers are present', async () => {
    const res = await req('/health');
    // Helmet defaults
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBeTruthy(); // SAMEORIGIN or DENY
    expect(res.headers.get('x-xss-protection')).toBeDefined();
    // Helmet disables X-Powered-By
    expect(res.headers.get('x-powered-by')).toBeNull();
  });

  // ───────────────────────────────────────────────────────────
  // 19. CORS
  // ───────────────────────────────────────────────────────────
  it('19 — CORS rejects bad origin (no Access-Control-Allow-Origin)', async () => {
    const res = await req('/health', {
      headers: { Origin: 'http://evil.example.com' },
    });
    // cors package must NOT reflect an unlisted origin
    const acao = res.headers.get('access-control-allow-origin');
    expect(acao === null || acao !== 'http://evil.example.com').toBe(true);
  });

  // ───────────────────────────────────────────────────────────
  // 20. Rate Limiting
  // ───────────────────────────────────────────────────────────
  it('20 — Rapid requests to auth-adjacent endpoint get throttled (429)', async () => {
    // dev-user key is at 4 of 5 (consent×3 + export×1).
    // Additional GETs push it past the limit.
    const results: number[] = [];
    for (let i = 0; i < 3; i++) {
      const { res } = await json('/api/v1/consent/status');
      results.push(res.status);
    }
    expect(results).toContain(429);
  });
});
