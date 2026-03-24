/**
 * Canary Leak Privacy Verification Tests
 *
 * Critical Tier 1 → Tier 3 isolation guarantee:
 * User A's raw text (Tier 1) must NEVER appear in any response
 * sent to User B or exposed through any API surface.
 *
 * Strategy: Inject highly identifiable "canary strings" as User A input,
 * then deep-scan every API response to prove none leak through.
 *
 * If ANY canary leaks, the build MUST fail.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

// ── Env vars MUST be set before any app import ───────────────
vi.hoisted(() => {
  process.env.AUTH_DISABLED = 'true';
  process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
  process.env.NODE_ENV = 'test';
});

// Controlled Tier 3 output — intentionally bland and canary-free
const SAFE_TIER3 = 'What does feeling truly heard look like for each of you?';

// ── Mock LLM gateway with canary-free outputs ────────────────
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
          content: SAFE_TIER3,
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

// Disable rate limiting so canary tests can run all requests without 429s
vi.mock('express-rate-limit', () => ({
  default: () => (_req: any, _res: any, next: any) => next(),
  __esModule: true,
}));

import { app } from '../src/server/app.js';

// ── Canary strings — unique markers that must never leak ─────
const CANARY_STRINGS = [
  'CANARY_PRIVATE_7f3a9b2e',
  'I hate my partner John Smith',
  'My SSN is 123-45-6789',
  'He cheated with Sarah from work',
  'I want to leave him_TIER1_PROOF',
  '我讨厌他 CANARY_CHINESE',
  'אני שונא אותו CANARY_HEBREW',
];

const USER_A_ID = '00000000-0000-0000-0000-000000000001';

// ── Test infra ───────────────────────────────────────────────
let server: Server;
let baseUrl: string;

function url(path: string): string {
  return `${baseUrl}${path}`;
}

async function post(
  path: string,
  data: unknown,
): Promise<{ res: Response; body: any }> {
  const res = await fetch(url(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  return { res, body };
}

async function get(path: string): Promise<{ res: Response; body: any }> {
  const res = await fetch(url(path));
  const body = await res.json();
  return { res, body };
}

// ── Deep scan helpers ────────────────────────────────────────

/**
 * Recursively assert that no canary substring appears anywhere
 * in a JSON-serialized response body.
 */
function assertNoCanaryLeak(responseBody: any, canary: string): void {
  const json = JSON.stringify(responseBody);
  expect(json).not.toContain(canary);
}

/**
 * Scan every canary against a response body. Throws on first leak.
 */
function assertNoLeakForAllCanaries(responseBody: any): void {
  for (const canary of CANARY_STRINGS) {
    assertNoCanaryLeak(responseBody, canary);
  }
}

/**
 * Assert that no canary string appears in any response header value.
 */
function assertNoCanaryInHeaders(headers: Headers): void {
  const headerEntries: string[] = [];
  headers.forEach((value, key) => {
    headerEntries.push(`${key}: ${value}`);
  });
  const headerString = headerEntries.join('\n');
  for (const canary of CANARY_STRINGS) {
    expect(headerString).not.toContain(canary);
  }
}

// ── Lifecycle ────────────────────────────────────────────────
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
// 1. Canary NOT in mediate response body
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Mediate Response', () => {
  for (const canary of CANARY_STRINGS) {
    it(`canary "${canary.slice(0, 30)}…" does NOT leak in POST /api/v1/mediate`, async () => {
      const { res, body } = await post('/api/v1/mediate', {
        userId: USER_A_ID,
        message: canary,
      });
      expect(res.status).toBe(200);
      assertNoCanaryLeak(body, canary);
    });
  }
});

// ─────────────────────────────────────────────────────────────
// 2. Canary NOT in tier3Output
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Tier 3 Output Isolation', () => {
  it('tier3Output is the controlled LLM mock, not the raw input', async () => {
    const { body } = await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message: CANARY_STRINGS[0],
    });
    expect(body.tier3Output).toBe(SAFE_TIER3);
    assertNoLeakForAllCanaries(body);
  });

  for (const canary of CANARY_STRINGS) {
    it(`tier3Output does not contain canary "${canary.slice(0, 30)}…"`, async () => {
      const { body } = await post('/api/v1/mediate', {
        userId: USER_A_ID,
        message: canary,
      });
      if (body.tier3Output) {
        expect(body.tier3Output).not.toContain(canary);
      }
    });
  }
});

// ─────────────────────────────────────────────────────────────
// 3. Canary NOT in safety reasoning (HIGH severity path)
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Safety Guardian Reasoning Stripped', () => {
  it('safety reasoning is NOT exposed in response even on HIGH severity', async () => {
    const { callLLM } = await import('../src/gateway/llm-gateway.js');
    const mockedCallLLM = vi.mocked(callLLM);

    // Override safety guardian to return HIGH with canary in reasoning
    mockedCallLLM.mockImplementationOnce(async () => ({
      content: JSON.stringify({
        severity: 'HIGH',
        halt: true,
        reasoning: `Threat detected: user said "${CANARY_STRINGS[0]}"`,
        markers: ['threat'],
      }),
      model: 'test',
      provider: 'github' as const,
    }));

    const { body } = await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message: CANARY_STRINGS[0],
    });

    // The response must not contain the canary anywhere
    assertNoCanaryLeak(body, CANARY_STRINGS[0]);

    // The reasoning field (if present) must not contain the canary
    if (body.reasoning) {
      expect(body.reasoning).not.toContain(CANARY_STRINGS[0]);
    }
    if (body.safetyCheck?.reasoning) {
      expect(body.safetyCheck.reasoning).not.toContain(CANARY_STRINGS[0]);
    }
  });

  it('safety reasoning with PII canary does not leak', async () => {
    const { callLLM } = await import('../src/gateway/llm-gateway.js');
    const mockedCallLLM = vi.mocked(callLLM);

    const piiCanary = 'My SSN is 123-45-6789';
    mockedCallLLM.mockImplementationOnce(async () => ({
      content: JSON.stringify({
        severity: 'HIGH',
        halt: true,
        reasoning: `PII detected: "${piiCanary}"`,
        markers: ['pii'],
      }),
      model: 'test',
      provider: 'github' as const,
    }));

    const { body } = await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message: piiCanary,
    });

    assertNoCanaryLeak(body, piiCanary);
  });
});

// ─────────────────────────────────────────────────────────────
// 4. Canary NOT in error responses
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Error Responses', () => {
  it('400 error from missing fields does not echo canary in userId', async () => {
    const { res, body } = await post('/api/v1/mediate', {
      userId: CANARY_STRINGS[0], // invalid UUID containing canary
      message: CANARY_STRINGS[1],
    });
    expect(res.status).toBe(400);
    // Error message should describe the validation failure, not echo values
    assertNoCanaryLeak(body, CANARY_STRINGS[1]);
  });

  it('400 error from missing message does not echo canary userId', async () => {
    const { res, body } = await post('/api/v1/mediate', {
      userId: CANARY_STRINGS[0], // invalid UUID
    });
    expect(res.status).toBe(400);
    assertNoCanaryLeak(body, CANARY_STRINGS[0]);
  });

  it('400 from oversized message does not echo canary', async () => {
    const canaryPadded = CANARY_STRINGS[0] + 'x'.repeat(2001);
    const { res, body } = await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message: canaryPadded,
    });
    expect(res.status).toBe(400);
    assertNoCanaryLeak(body, CANARY_STRINGS[0]);
  });

  it('malformed JSON body does not echo canary', async () => {
    const res = await fetch(url('/api/v1/mediate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"userId":"${USER_A_ID}","message":"${CANARY_STRINGS[0]}"`, // truncated JSON
    });
    // Whether 400 or 500, the canary must not leak
    const text = await res.text();
    expect(text).not.toContain(CANARY_STRINGS[0]);
  });

  it('empty body error does not echo canary in any way', async () => {
    const res = await fetch(url('/api/v1/mediate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    const body = await res.json();
    assertNoLeakForAllCanaries(body);
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Canary NOT in admin endpoints after processing
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Admin API', () => {
  // First, pump all canaries through the pipeline to populate admin stats
  beforeAll(async () => {
    for (const canary of CANARY_STRINGS) {
      await post('/api/v1/mediate', {
        userId: USER_A_ID,
        message: canary,
      });
    }
  });

  const adminEndpoints = [
    '/api/v1/admin/stats/overview',
    '/api/v1/admin/pipeline',
    '/api/v1/admin/safety',
    '/api/v1/admin/users',
    '/api/v1/admin/couples',
    '/api/v1/admin/phases',
    '/api/v1/admin/subscriptions',
    '/api/v1/admin/feedback',
  ];

  for (const endpoint of adminEndpoints) {
    it(`no canary leaks in GET ${endpoint}`, async () => {
      const { body } = await get(endpoint);
      assertNoLeakForAllCanaries(body);
    });
  }
});

// ─────────────────────────────────────────────────────────────
// 6. Deep JSON scan — recursive property check
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Deep JSON Scan', () => {
  /**
   * Walk every leaf of a JSON object and assert no canary appears.
   * Catches leaks hidden in nested arrays, objects, or stringified sub-JSON.
   */
  function deepScanForCanary(obj: unknown, canary: string, path = '$'): void {
    if (obj === null || obj === undefined) return;

    if (typeof obj === 'string') {
      if (obj.includes(canary)) {
        throw new Error(
          `CANARY LEAK at ${path}: found "${canary}" in string value "${obj.slice(0, 100)}"`,
        );
      }
      // Also check if the string is itself JSON containing the canary
      if (obj.startsWith('{') || obj.startsWith('[')) {
        try {
          const parsed = JSON.parse(obj);
          deepScanForCanary(parsed, canary, `${path}.(parsed)`);
        } catch {
          // Not valid JSON — fine
        }
      }
      return;
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        deepScanForCanary(obj[i], canary, `${path}[${i}]`);
      }
      return;
    }

    if (typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
        // Key itself should not contain canary
        if (key.includes(canary)) {
          throw new Error(`CANARY LEAK in key at ${path}.${key}`);
        }
        deepScanForCanary(val, canary, `${path}.${key}`);
      }
    }
  }

  it('deep scan mediate response for all canaries', async () => {
    for (const canary of CANARY_STRINGS) {
      const { body } = await post('/api/v1/mediate', {
        userId: USER_A_ID,
        message: canary,
      });
      deepScanForCanary(body, canary);
    }
  });

  it('deep scan admin stats after canary injection', async () => {
    // Canaries already processed in admin suite's beforeAll
    const { body } = await get('/api/v1/admin/stats/overview');
    for (const canary of CANARY_STRINGS) {
      deepScanForCanary(body, canary);
    }
  });

  it('deep scan safety events for canary in reasoning', async () => {
    const { body } = await get('/api/v1/admin/safety');
    for (const canary of CANARY_STRINGS) {
      deepScanForCanary(body, canary);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// 7. Header scan — canary must not leak in HTTP headers
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Response Headers', () => {
  for (const canary of CANARY_STRINGS) {
    it(`headers contain no canary "${canary.slice(0, 30)}…"`, async () => {
      const res = await fetch(url('/api/v1/mediate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: USER_A_ID,
          message: canary,
        }),
      });
      assertNoCanaryInHeaders(res.headers);
      // Consume body to prevent connection leak
      await res.json();
    });
  }

  it('error response headers contain no canary', async () => {
    const res = await fetch(url('/api/v1/mediate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: CANARY_STRINGS[0],
        message: CANARY_STRINGS[1],
      }),
    });
    assertNoCanaryInHeaders(res.headers);
    await res.text();
  });
});

// ─────────────────────────────────────────────────────────────
// 8. stripTier1Data unit-level verification
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — stripTier1Data Guarantee', () => {
  it('stripped result has no reasoning, no raw message fields', async () => {
    const { res, body } = await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message: CANARY_STRINGS[0],
    });
    expect(res.status).toBe(200);

    // These fields must NOT exist in the sanitized output
    expect(body).not.toHaveProperty('message');
    expect(body).not.toHaveProperty('rawMessage');
    expect(body).not.toHaveProperty('rawInput');
    expect(body).not.toHaveProperty('tier1');
    expect(body).not.toHaveProperty('safetyCheck.reasoning');

    // These fields SHOULD exist
    expect(body).toHaveProperty('tier3Output');
    expect(body).toHaveProperty('safetySeverity');
    expect(body).toHaveProperty('safetyHalt');
    expect(body).toHaveProperty('processingTimeMs');
    expect(body).toHaveProperty('agentsInvoked');
  });
});

// ─────────────────────────────────────────────────────────────
// 9. Compound canary — combine all canaries in one request
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Compound Injection', () => {
  it('all canaries sent as one message do not leak in response', async () => {
    const compound = CANARY_STRINGS.join(' | ');
    // Truncate to stay within 2000 char limit
    const message = compound.slice(0, 2000);

    const { res, body } = await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message,
    });
    expect(res.status).toBe(200);
    assertNoLeakForAllCanaries(body);
  });
});

// ─────────────────────────────────────────────────────────────
// 10. Sequential canary correlation — no cross-request leaks
// ─────────────────────────────────────────────────────────────
describe('Canary Leak — Sequential Request Isolation', () => {
  it('canary from request N does not appear in request N+1 response', async () => {
    // Send canary A
    await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message: CANARY_STRINGS[0],
    });

    // Send canary B — response must not contain canary A
    const { body } = await post('/api/v1/mediate', {
      userId: USER_A_ID,
      message: CANARY_STRINGS[1],
    });

    assertNoCanaryLeak(body, CANARY_STRINGS[0]);
    assertNoCanaryLeak(body, CANARY_STRINGS[1]);
  });
});
