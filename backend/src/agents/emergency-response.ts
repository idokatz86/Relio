/**
 * Emergency Response Agent
 *
 * Executes emergency protocols on SAFETY_HALT events.
 * Provides immediate crisis resources and optional warm handoff
 * to real emergency services via Azure Communication Services.
 *
 * Issue #81: Implement Emergency Response Agent handler on SAFETY_HALT
 * @see .github/agents/emergency-response-agent.agent.md
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { LLMMessage, SafetyCheckResult } from '../types/index.js';

// ── Emergency Resources by Region ────────────────────────────
interface EmergencyResource {
  name: string;
  phone: string;
  description: string;
}

const EMERGENCY_RESOURCES: Record<string, EmergencyResource[]> = {
  US: [
    { name: '988 Suicide & Crisis Lifeline', phone: '988', description: '24/7 crisis support' },
    { name: 'National DV Hotline', phone: '1-800-799-7233', description: 'Domestic violence help' },
    { name: '911 Emergency', phone: '911', description: 'Immediate danger' },
  ],
  BR: [
    { name: 'CVV — Centro de Valorização da Vida', phone: '188', description: 'Apoio emocional 24h' },
    { name: 'Ligue 180 — Violência contra a Mulher', phone: '180', description: 'Central 24h' },
    { name: 'SAMU', phone: '192', description: 'Emergência médica' },
  ],
  IL: [
    { name: 'ERAN — עזרה ראשונה נפשית', phone: '1201', description: 'תמיכה 24/7' },
    { name: 'קו חירום לנשים מוכות', phone: '1-800-353-300', description: 'חינם' },
    { name: 'מד"א', phone: '101', description: 'חירום רפואי' },
  ],
  DEFAULT: [
    { name: 'Emergency Services', phone: '112', description: 'International emergency number' },
  ],
};

// ── Emergency Response Prompt ────────────────────────────────
const EMERGENCY_PROMPT = `You are the Emergency Response Agent for Relio.

CONTEXT: The Safety Guardian has issued a SAFETY_HALT for this user's message.
Your job is to generate a compassionate, grounding response that:

1. DOES NOT minimize the situation
2. DOES NOT provide therapy or clinical advice
3. DOES acknowledge the severity with empathy
4. Suggests specific next steps (call hotline, reach out to trusted person, go to ER)
5. Reminds the user this is NOT a replacement for professional help

RESPONSE FORMAT (JSON):
{
  "message": "A compassionate 2-3 sentence grounding message",
  "suggestedAction": "call_hotline|contact_trusted_person|go_to_er|safety_plan",
  "severity": "HIGH|CRITICAL",
  "requiresFollowUp": true
}`;

// ── Types ────────────────────────────────────────────────────
export interface EmergencyResponse {
  message: string;
  suggestedAction: string;
  severity: string;
  requiresFollowUp: boolean;
  resources: EmergencyResource[];
  region: string;
}

/**
 * Handle a SAFETY_HALT event by generating an emergency response
 * and returning appropriate crisis resources.
 */
export async function handleEmergency(
  safetyCheck: SafetyCheckResult,
  userMessage: string,
  userRegion: string = 'US',
): Promise<EmergencyResponse> {
  const messages: LLMMessage[] = [
    { role: 'system', content: EMERGENCY_PROMPT },
    {
      role: 'user',
      content: `Safety check result: severity=${safetyCheck.severity}, markers=${safetyCheck.markers?.join(', ')}. User message context: [REDACTED FOR SAFETY - markers indicate ${safetyCheck.reasoning}]`,
    },
  ];

  try {
    const response = await callLLM('safety-guardian', messages);
    const jsonStr = response.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    const region = userRegion.toUpperCase();
    const resources = EMERGENCY_RESOURCES[region] || EMERGENCY_RESOURCES.DEFAULT;

    return {
      message: parsed.message || "We're here for you. Please reach out to one of the resources below.",
      suggestedAction: parsed.suggestedAction || 'call_hotline',
      severity: safetyCheck.severity,
      requiresFollowUp: true,
      resources,
      region,
    };
  } catch {
    // Fail-safe: always return resources even if LLM fails
    const resources = EMERGENCY_RESOURCES[userRegion.toUpperCase()] || EMERGENCY_RESOURCES.DEFAULT;
    return {
      message: "We notice you might be going through something difficult. You don't have to face this alone. Please reach out to one of the resources below.",
      suggestedAction: 'call_hotline',
      severity: safetyCheck.severity,
      requiresFollowUp: true,
      resources,
      region: userRegion,
    };
  }
}

/**
 * Log an emergency event for clinical review.
 * In production, this writes to safety_audit_log + alerts admin.
 */
export function logEmergencyEvent(
  userId: string,
  safetyCheck: SafetyCheckResult,
  response: EmergencyResponse,
): void {
  console.error(`[EMERGENCY] userId=${userId} severity=${safetyCheck.severity} action=${response.suggestedAction} markers=${safetyCheck.markers?.join(',')}`);
  // TODO: Write to safety_audit_log table
  // TODO: Send Slack/email alert to on-call clinical reviewer
}
