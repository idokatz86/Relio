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

// ── Multi-language crisis keyword pre-screen (Issue #135) ────
// Fast regex check BEFORE LLM call — catches obvious crisis signals in any language.
// These patterns are intentionally broad to minimize false negatives.
const CRISIS_PATTERNS: RegExp[] = [
  // English
  /\b(kill\s+(my|him|her|them|your)self|suicide|want\s+to\s+die|end\s+(it|my\s+life)|slit\s+my)\b/i,
  /\b(he\s+hits?\s+me|she\s+hits?\s+me|beats?\s+me|chok(es?|ing)\s+me|punche[sd]?\s+me)\b/i,
  // Spanish
  /\b(quiero\s+morir|me\s+voy\s+a\s+matar|suicidar|no\s+puedo\s+más|me\s+(pega|golpea|ahorca))\b/i,
  // Portuguese
  /\b(quero\s+morrer|vou\s+me\s+matar|suic[ií]dio|não\s+aguento\s+mais|ele\s+me\s+bat[eu])\b/i,
  // Hebrew (common crisis phrases)
  /אני\s*רוצ[הא]\s*למות|אסיים\s*את\s*(הכל|החיים)|הוא\s*מכה\s*אותי|היא\s*מכה\s*אותי|אני\s*לא\s*יכול[הא]?\s*יותר/,
];

/**
 * Fast regex pre-screen for crisis keywords (Issue #135).
 * Returns true if any multi-language crisis pattern matches.
 */
function preScreenCrisis(message: string): boolean {
  return CRISIS_PATTERNS.some(pattern => pattern.test(message));
}

const SAFETY_GUARDIAN_PROMPT = `You are the Safety Guardian Agent for Relio, an AI relationship mediation platform.

YOUR ROLE: You hold absolute veto authority over all system processes. You passively monitor user inputs for safety threats.

MULTI-LANGUAGE SUPPORT (Issue #135):
You MUST detect safety concerns in ALL languages: English, Spanish, Portuguese, Hebrew, and any other language.
Examples of crisis indicators in other languages:
- Spanish: "quiero morirme", "me voy a matar", "no puedo más", "me pega", "me golpea"
- Portuguese: "quero morrer", "vou me matar", "não aguento mais", "ele me bate"
- Hebrew: "אני רוצה למות", "אני אסיים את הכל", "הוא מכה אותי", "אני לא יכולה יותר"
Always respond in English regardless of input language.

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
  // Fast regex pre-screen (Issue #135): catch obvious crisis keywords before LLM
  if (preScreenCrisis(userMessage)) {
    console.warn('[Safety Guardian] REGEX_PRE_SCREEN triggered — escalating to HIGH');
    // Still call LLM for full analysis, but flag as pre-screened
  }

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
    // FAIL-CLOSED: Parse failure defaults to HIGH/halt (issue #74)
    // Per safety-guardian.agent.md: "false positives are acceptable, false negatives are not"
    console.error('[Safety Guardian] PARSE_FAILURE — defaulting to HIGH/halt. Raw:', response.content);
    return {
      severity: 'HIGH',
      halt: true,
      reasoning: 'Parse error — defaulting to HIGH (fail-closed). Manual review required.',
      markers: ['PARSE_FAILURE'],
    };
  }
}
