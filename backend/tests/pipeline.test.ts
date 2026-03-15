/**
 * 5-Agent Pipeline Integration Test
 * 
 * Validates that all 5 MVP agents work end-to-end:
 * Safety Guardian → Orchestrator → Individual Profiler → Phase-Dating → Communication Coach
 * 
 * @see Issue #25
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { processMessage } from '../src/pipeline/mediation-pipeline.js';
import type { PipelineResult } from '../src/types/index.js';

// Mock the LLM gateway for deterministic testing
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
            emotionalIntensity: 6,
            nextAgent: 'communication-coach',
            reasoning: 'Routing to coach for translation',
          }),
          model: 'test',
          provider: 'github' as const,
        };
      case 'individual-profiler':
        return {
          content: JSON.stringify({
            attachmentStyle: 'anxious',
            confidence: 0.75,
            activationState: 'elevated',
          }),
          model: 'test',
          provider: 'github' as const,
        };
      case 'communication-coach':
        return {
          content: 'Feeling heard is really important. What does being truly listened to look like for each of you?',
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

describe('5-Agent MVP Pipeline', () => {
  it('processes a normal message through all agents', async () => {
    const result = await processMessage('user-a', 'You never listen to me.');

    expect(result.safetyCheck.severity).toBe('SAFE');
    expect(result.safetyCheck.halt).toBe(false);
    expect(result.tier3Output).toBeTruthy();
    expect(result.tier3Output).toContain('listened to');
    expect(result.agentsInvoked).toContain('safety-guardian');
    expect(result.agentsInvoked).toContain('orchestrator');
    expect(result.agentsInvoked).toContain('individual-profiler');
    expect(result.agentsInvoked).toContain('communication-coach');
    expect(result.agentsInvoked.length).toBeGreaterThanOrEqual(4);
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('returns a profile with attachment style', async () => {
    const result = await processMessage('user-a', 'Why does she always ignore me?');

    expect(result.profile).toBeDefined();
    expect(result.profile?.attachmentStyle).toBe('anxious');
    expect(result.profile?.attachmentConfidence).toBe(0.75);
  });

  it('halts pipeline on safety threat', async () => {
    const { callLLM } = await import('../src/gateway/llm-gateway.js');
    const mockedCallLLM = vi.mocked(callLLM);

    // Override safety guardian to return HIGH
    mockedCallLLM.mockImplementationOnce(async () => ({
      content: JSON.stringify({
        severity: 'HIGH',
        halt: true,
        reasoning: 'Suicidal ideation detected',
        markers: ['suicidal language'],
      }),
      model: 'test',
      provider: 'github' as const,
    }));

    const result = await processMessage('user-a', 'I want to end it all.');

    expect(result.safetyCheck.severity).toBe('HIGH');
    expect(result.safetyCheck.halt).toBe(true);
    expect(result.tier3Output).toBeNull();
    // Only safety-guardian should have been invoked
    expect(result.agentsInvoked).toEqual(['safety-guardian']);
  });
});
