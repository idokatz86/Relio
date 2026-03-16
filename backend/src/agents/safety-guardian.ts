/**
 * Safety Guardian Agent
 * 
 * The FIRST agent in every pipeline invocation.
 * Monitors all Tier 1 inputs for DV, coercive control, suicidal ideation, and child abuse.
 * Has absolute veto authority — no agent can override a SAFETY_HALT.
 * 
 * @see .github/agents/safety-guardian.agent.md
 * @see Issue #5
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { LLMMessage, SafetyCheckResult } from '../types/index.js';

const SAFETY_GUARDIAN_PROMPT = `You are the Safety Guardian Agent for Relio, an AI relationship mediation platform.

YOUR ROLE: You hold absolute veto authority over all system processes. You passively monitor user inputs for safety threats.

DETECTION TARGETS:
- Explicit threats of physical harm or violence
- Suicidal ideation ("I want to end it all", "nobody would miss me", "I can't go on")
- Child abuse or neglect signals
- Domestic violence (DV) indicators
- Coercive control patterns (isolation, financial abuse, DARVO)
- Intimate partner violence markers

SEVERITY LEVELS:
- SAFE: Normal conversation, positive or neutral content. No safety concerns.
- LOW: Vague frustration or mild hopelessness. Flag for monitoring but continue.
- MEDIUM: Escalating language, isolation patterns, references to self-harm in past tense.
- MEDIUM compound rule: If message contains BOTH contempt (character attacks: "selfish", "disgusting", "pathetic") AND withdrawal finality ("I'm done", "I give up", "I quit trying"), classify MEDIUM even without explicit threats. This compound pattern is a documented DV precursor (Gottman, 1994).
- HIGH: Direct threats, active suicidal ideation with plan, described physical violence.
- CRITICAL: Imminent danger to life, active violence in progress, child in immediate danger.

RESPONSE FORMAT (JSON only, no other text):
{
  "severity": "SAFE|LOW|MEDIUM|HIGH|CRITICAL",
  "halt": true|false,
  "reasoning": "Brief explanation of assessment",
  "markers": ["list", "of", "detected", "markers"]
}

RULES:
- halt=true ONLY for HIGH and CRITICAL severity
- err on the side of caution — false positives are acceptable, false negatives are not
- do NOT diagnose, do NOT provide therapy, do NOT give advice
- you are a DETECTOR, not a responder
- evaluate the INPUT ONLY — do not generate conversational responses`;

/**
 * Run the Safety Guardian check on a user message.
 * This MUST be called before any other agent in the pipeline.
 */
export async function checkSafety(userMessage: string): Promise<SafetyCheckResult> {
  const messages: LLMMessage[] = [
    { role: 'system', content: SAFETY_GUARDIAN_PROMPT },
    { role: 'user', content: userMessage },
  ];

  const response = await callLLM('safety-guardian', messages);

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonStr = response.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const parsed = JSON.parse(jsonStr) as {
      severity: string;
      halt: boolean;
      reasoning: string;
      markers?: string[];
    };

    // Validate severity
    const validSeverities = ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    if (!validSeverities.includes(parsed.severity)) {
      throw new Error(`Invalid severity: ${parsed.severity}`);
    }

    return {
      severity: parsed.severity as SafetyCheckResult['severity'],
      halt: parsed.severity === 'HIGH' || parsed.severity === 'CRITICAL',
      reasoning: parsed.reasoning || 'No reasoning provided',
      markers: parsed.markers || [],
    };
  } catch {
    // If parsing fails, default to SAFE but log the error
    console.error('[Safety Guardian] Failed to parse response:', response.content);
    return {
      severity: 'SAFE',
      halt: false,
      reasoning: 'Parse error — defaulting to SAFE. Review logs.',
      markers: [],
    };
  }
}
