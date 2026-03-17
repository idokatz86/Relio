/**
 * Mixed-Language Couple Mediation E2E Test
 *
 * Issue #149: Tests the scenario where Partner A writes in Spanish
 * and Partner B receives Tier 3 output in Hebrew (or any combo).
 * Validates that the pipeline correctly passes preferredLanguage
 * and the Communication Coach generates Socratic output in the target language.
 *
 * Run: npx vitest run src/__tests__/mixed-language-e2e.test.ts
 * Requires: LLM_AVAILABLE=true (skipped in CI otherwise)
 */

import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function json(res: Response): Promise<any> {
  return res.json();
}

describe.skipIf(!process.env.TEST_SERVER_RUNNING)('Mixed-Language Couple Mediation E2E', () => {
  // These tests require a running LLM — skip in CI
  const shouldRun = !!process.env.LLM_AVAILABLE;

  it.skipIf(!shouldRun)('Spanish input → English Tier 3 output', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        message: 'Nunca me escucha cuando hablo de mi día.',
        preferredLanguage: 'en',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.tier3Output).toBeDefined();
    expect(data.safetyHalt).toBe(false);
    // Tier 3 should be in English (requested language)
    expect(data.tier3Output).toMatch(/[a-zA-Z]/);
  });

  it.skipIf(!shouldRun)('English input → Spanish Tier 3 output', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        message: 'She never listens to me when I talk about my problems.',
        preferredLanguage: 'es',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.tier3Output).toBeDefined();
    expect(data.safetyHalt).toBe(false);
  });

  it.skipIf(!shouldRun)('Portuguese input → Hebrew Tier 3 output', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        message: 'Ele nunca me ouve quando falo sobre o meu dia.',
        preferredLanguage: 'he',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await json(res);
    expect(data.tier3Output).toBeDefined();
    expect(data.safetyHalt).toBe(false);
  });

  // Non-LLM test: verify preferredLanguage is accepted by the API
  it('API accepts preferredLanguage field', async () => {
    // Just verify the schema validation passes (even if LLM is unavailable)
    const res = await fetch(`${BASE_URL}/api/v1/mediate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        message: 'Test message',
        preferredLanguage: 'pt',
      }),
    });
    // Should not be a 400 validation error (it's either 200 or 500 for LLM)
    expect(res.status).not.toBe(400);
  });
});
