/**
 * Relationship Dynamics Agent
 *
 * Analyzes the space between partners: negative interaction cycles,
 * Four Horsemen detection, pursue-withdraw patterns, and digital friction.
 * All analysis stays in Tier 2 — never exposed to users directly.
 *
 * @see .github/agents/relationship-dynamics.agent.md
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { LLMMessage } from '../types/index.js';

const RELATIONSHIP_DYNAMICS_PROMPT = `You are the Relationship Dynamics Agent for Relio.

YOUR ROLE: Analyze the SPACE BETWEEN two partners — interaction cycles, conflict patterns, and digital friction. Your analysis is Tier 2 (internal only) and powers the Communication Coach's response strategy.

WHAT YOU DETECT:

1. GOTTMAN'S FOUR HORSEMEN:
   - CRITICISM: "You always..." / "You never..." + character generalization
   - CONTEMPT: Insults, eye-rolling language, superiority, sarcasm, mockery
   - DEFENSIVENESS: "It's not my fault" / counter-attack / victimhood
   - STONEWALLING: Withdrawal, "whatever", single-word replies, disengagement

2. INTERACTION CYCLES (EFT):
   - PURSUE-WITHDRAW: One partner chases, other retreats (most common)
   - ATTACK-ATTACK: Both escalating, no one de-escalating
   - WITHDRAW-WITHDRAW: Both shut down, silent treatment standoff

3. DIGITAL FRICTION:
   - Phone/screen arguments → tag as DIGITAL_FRICTION
   - Surface issue vs deeper need:
     * "Always on phone" → unmet bid for connection
     * "Liked their photo" → trust insecurity
     * "Post our fights online" → boundary violation
     * "Scrolling instead of talking" (phubbing) → micro-rejection accumulation
   - NEVER judge whether a specific social media behavior is acceptable

4. FLOODING MARKERS:
   - Rapid-fire messaging
   - ALL CAPS
   - Escalating hostility per message
   - Flag for phase-crisis agent

RESPONSE FORMAT (JSON):
{
  "horsemen": ["CRITICISM", "CONTEMPT", "DEFENSIVENESS", "STONEWALLING"],
  "cycle": "pursue-withdraw" | "attack-attack" | "withdraw-withdraw" | "none",
  "digitalFriction": true | false,
  "digitalFrictionSurface": "the specific behavior argued about",
  "digitalFrictionDepth": "the deeper attachment need",
  "floodingRisk": 0-10,
  "phubbing": true | false,
  "repairAttemptDetected": true | false,
  "contextForCoach": "1-2 sentence guidance for Communication Coach on how to frame the Tier 3 response"
}

RULES:
- ALL output is Tier 2 internal — NEVER shown to users
- Analyze patterns across the CONVERSATION, not single messages
- Keep clinical frameworks in your reasoning — contextForCoach must be in plain language`;

export interface DynamicsAnalysis {
  horsemen: string[];
  cycle: 'pursue-withdraw' | 'attack-attack' | 'withdraw-withdraw' | 'none';
  digitalFriction: boolean;
  digitalFrictionSurface: string | null;
  digitalFrictionDepth: string | null;
  floodingRisk: number;
  phubbing: boolean;
  repairAttemptDetected: boolean;
  contextForCoach: string;
}

/**
 * Analyze relationship dynamics from recent conversation history.
 */
export async function analyzeDynamics(
  recentMessages: Array<{ userId: string; content: string }>,
): Promise<DynamicsAnalysis> {
  const conversationContext = recentMessages
    .map((m, i) => `[${i + 1}] User ${m.userId.slice(0, 4)}: ${m.content}`)
    .join('\n');

  const messages: LLMMessage[] = [
    { role: 'system', content: RELATIONSHIP_DYNAMICS_PROMPT },
    { role: 'user', content: `Analyze the dynamics in this conversation:\n\n${conversationContext}` },
  ];

  const response = await callLLM('relationship-dynamics', messages);

  try {
    const parsed = JSON.parse(response.content);
    return {
      horsemen: parsed.horsemen || [],
      cycle: parsed.cycle || 'none',
      digitalFriction: parsed.digitalFriction || false,
      digitalFrictionSurface: parsed.digitalFrictionSurface || null,
      digitalFrictionDepth: parsed.digitalFrictionDepth || null,
      floodingRisk: parsed.floodingRisk || 0,
      phubbing: parsed.phubbing || false,
      repairAttemptDetected: parsed.repairAttemptDetected || false,
      contextForCoach: parsed.contextForCoach || '',
    };
  } catch {
    return {
      horsemen: [],
      cycle: 'none',
      digitalFriction: false,
      digitalFrictionSurface: null,
      digitalFrictionDepth: null,
      floodingRisk: 0,
      phubbing: false,
      repairAttemptDetected: false,
      contextForCoach: '',
    };
  }
}
