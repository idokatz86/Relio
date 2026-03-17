/**
 * E2E Smoke Test: Registration → Consent → Invite → Couple Pipeline
 *
 * Issue #129: Validates the complete user journey works end-to-end.
 * Runs with AUTH_DISABLED=true against a local server.
 * 
 * Run: npx vitest run src/__tests__/e2e-smoke.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function json(res: Response): Promise<any> {
  return res.json();
}

describe.skipIf(!process.env.TEST_SERVER_RUNNING)('E2E Smoke Test', () => {
  const userA = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'User A',
  };
  const userB = {
    userId: '660e8400-e29b-41d4-a716-446655440001',
    name: 'User B',
  };

  beforeAll(async () => {
    // Health check
    const res = await fetch(`${BASE_URL}/health`);
    expect(res.ok).toBe(true);
  });

  it('Step 1: Health check returns OK', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await json(res);
    expect(data.status).toBe('ok');
  });

  it('Step 2: Consent status returns requiresUpdate for new user', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/consent/status`, {
      headers: { 'Authorization': 'Bearer dev-token' },
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.requiresUpdate).toBe(true);
    expect(data.currentTosVersion).toBeDefined();
  });

  it('Step 3: Accept consent (ToS + Privacy)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/consent/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        tosVersion: '1.0.0',
        privacyVersion: '1.0.0',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.accepted).toBe(true);
  });

  it('Step 4: Age verification (must be 18+)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/consent/verify-age`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        dateOfBirth: '1995-06-15',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.verified).toBe(true);
  });

  it('Step 5: Create invite code', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/invite/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        userId: userA.userId,
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.inviteCode).toBeDefined();
    expect(data.inviteCode.length).toBe(6);
    // Store for next step
    (globalThis as any).__inviteCode = data.inviteCode;
    (globalThis as any).__roomId = data.roomId;
  });

  it('Step 6: Accept invite (partner joins)', async () => {
    const code = (globalThis as any).__inviteCode;
    expect(code).toBeDefined();

    const res = await fetch(`${BASE_URL}/api/v1/invite/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        inviteCode: code,
        userId: userB.userId,
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.paired).toBe(true);
  });

  it('Step 7: Check pairing status', async () => {
    const roomId = (globalThis as any).__roomId;
    const res = await fetch(`${BASE_URL}/api/v1/invite/status?roomId=${roomId}`, {
      headers: { 'Authorization': 'Bearer dev-token' },
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.paired).toBe(true);
  });

  it('Step 8: Account deletion status (no pending)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/account/delete/status`, {
      headers: { 'Authorization': 'Bearer dev-token' },
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.hasPendingDeletion).toBe(false);
  });

  it('Step 9: Push token registration', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/push/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        expoPushToken: 'ExponentPushToken[test-token-123]',
        platform: 'android',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.registered).toBe(true);
  });

  it('Step 10: Data export endpoint', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/account/export`, {
      headers: { 'Authorization': 'Bearer dev-token' },
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.format).toBe('relio-export-v1');
    expect(data.user).toBeDefined();
  });

  // Mediation pipeline test (requires LLM — skip in CI unless LLM available)
  it.skipIf(!process.env.LLM_AVAILABLE)('Step 11: Send message through pipeline', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        userId: userA.userId,
        message: 'I feel like my partner never listens to me when I talk about my day.',
        preferredLanguage: 'en',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.tier3Output).toBeDefined();
    expect(data.safetyHalt).toBe(false);
  });
});
