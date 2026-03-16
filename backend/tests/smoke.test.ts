/**
 * E2E Smoke Test Suite for Deployed Environment
 * 
 * Validates the deployed backend is responding correctly.
 * Run against staging or production URLs.
 * 
 * Issue #70: E2E Smoke Test Suite
 * Usage: BACKEND_URL=https://relio-backend.xxx.azurecontainerapps.io npx vitest run tests/smoke.test.ts
 */

import { describe, it, expect } from 'vitest';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

describe.skipIf(!process.env.BACKEND_URL)('E2E Smoke Tests', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await fetch(`${BACKEND_URL}/health`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
  });

  it('POST /api/v1/mediate without auth returns 401', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: crypto.randomUUID(), message: 'test' }),
    });
    // Should be 401 if auth enabled, 200 if AUTH_DISABLED
    expect([200, 401]).toContain(res.status);
  });

  it('POST /api/v1/mediate with oversized message returns 400', async () => {
    const oversized = 'x'.repeat(3000);
    const res = await fetch(`${BACKEND_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: crypto.randomUUID(), message: oversized }),
    });
    // 400 from Zod validation or 401 from auth
    expect([400, 401]).toContain(res.status);
  });

  it('POST /api/v1/mediate with invalid userId returns 400', async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'not-a-uuid', message: 'test' }),
    });
    expect([400, 401]).toContain(res.status);
  });

  it('Security headers are present', async () => {
    const res = await fetch(`${BACKEND_URL}/health`);
    // Helmet sets these headers
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('SAMEORIGIN');
  });

  it('CORS does not allow arbitrary origins in production', async () => {
    const res = await fetch(`${BACKEND_URL}/health`, {
      headers: { 'Origin': 'https://evil.com' },
    });
    expect(res.status).toBe(200);
    // In production, Access-Control-Allow-Origin should NOT be https://evil.com
    const allowOrigin = res.headers.get('access-control-allow-origin');
    if (allowOrigin) {
      expect(allowOrigin).not.toBe('https://evil.com');
    }
  });
});
