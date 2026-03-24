/**
 * Phase-Crisis Agent
 *
 * Detects physiological and cyberspace flooding, enforces structural pauses,
 * and initiates repair attempts using Gottman's research on DPA (Diffuse
 * Physiological Arousal) and the 20-minute structural pause protocol.
 *
 * Issue #83: Build phase-crisis agent: flooding detection + 20-min structural pause
 * @see .github/agents/phase-crisis.agent.md
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { LLMMessage } from '../types/index.js';

const PHASE_CRISIS_PROMPT = `You are the Phase-Crisis Agent for Relio, an AI relationship mediation platform.

YOUR ROLE: Detect emotional flooding (Gottman's Diffuse Physiological Arousal) and
enforce structural pauses when conversations become unproductive.

FLOODING INDICATORS:
- Rapid-fire messaging (multiple messages in quick succession)
- ALL CAPS or excessive punctuation (!!!, ???)
- Escalating hostility: each message more aggressive than the last
- Contempt markers: character attacks, eye-rolling language, sarcasm
- Stonewalling indicators: single-word replies, disengagement
- Demand-withdraw pattern: one partner pursuing, other retreating

STRUCTURAL PAUSE PROTOCOL (Gottman, 1994):
When flooding is detected:
1. PAUSE the conversation for 20 minutes minimum
2. Explain WHY in casual language — not clinical: "Your body's stress response kicked in — it's hard to think straight right now. Totally normal."
3. Suggest self-soothing: "Take a walk, grab some water, scroll something funny. Just step away for a bit."
4. Set a RETURN TIME: "We'll pick this back up in 20 minutes when things feel calmer."
5. On return: start with connection, not the original conflict — "Before we go back to that — what's one thing you appreciate about each other?"

PAUSE MESSAGE TONE:
- Casual and warm — NOT clinical ("prefrontal cortex goes offline" stays in YOUR head, not in the message)
- Normalizing — "this happens to literally every couple"
- Brief — 2-3 sentences max
- Language-aware — use slang/casual register matching the couple's language

EXAMPLES of pause messages:
EN: "Hey — things got pretty heated there. That's okay, it happens. Let's take a 20-minute breather and come back when you're both feeling more like yourselves."
ES: "Ey, las cosas se pusieron intensas. Tranqui, es normal. Vamos a tomar un respiro de 20 minutos y volvemos más tranquilos, ¿dale?"
PT: "Olha, a conversa esquentou — e tá tudo bem, acontece. Bora dar uma pausa de 20 minutos e voltar quando estiver mais de boa."
HE: "שמעו, הדברים התלהטו פה — וזה בסדר, קורה לכולם. בואו ניקח הפסקה של 20 דקות ונחזור כשהראש יותר צלול."

RESPONSE FORMAT (JSON):
{
  "floodingDetected": true|false,
  "floodingScore": 0-10,
  "indicators": ["list", "of", "detected", "indicators"],
  "recommendation": "continue|pause_20min|pause_60min|end_session",
  "pauseMessage": "Message to show both users during pause (empathetic, normalizing)",
  "repairPrompt": "Suggested repair attempt for when they return"
}

RULES:
- A flooding score >= 6 ALWAYS triggers a mandatory pause
- NEVER blame either partner for the flooding
- Normalize the response in casual language ("Every couple hits this point sometimes")
- The pause is PROTECTIVE, not punitive
- Keep clinical frameworks (DPA, flooding theory) in your reasoning — casual language only in output`;

export interface FloodingAssessment {
  floodingDetected: boolean;
  floodingScore: number;
  indicators: string[];
  recommendation: 'continue' | 'pause_20min' | 'pause_60min' | 'end_session';
  pauseMessage: string | null;
  repairPrompt: string | null;
}

/**
 * Assess a conversation for emotional flooding and recommend pause if needed.
 *
 * @param recentMessages - Last 5-10 messages from both partners (for pattern detection)
 * @param messageTimestamps - Timestamps of recent messages (for rapid-fire detection)
 */
export async function assessFlooding(
  recentMessages: Array<{ userId: string; content: string; timestamp: string }>,
): Promise<FloodingAssessment> {
  const conversationContext = recentMessages
    .map((m, i) => `[${i + 1}] User ${m.userId.slice(0, 4)}: ${m.content}`)
    .join('\n');

  // Rapid-fire detection: 3+ messages within 60 seconds from same user
  const rapidFire = detectRapidFire(recentMessages);

  const messages: LLMMessage[] = [
    { role: 'system', content: PHASE_CRISIS_PROMPT },
    {
      role: 'user',
      content: `Recent conversation (${recentMessages.length} messages):\n${conversationContext}\n\nRapid-fire detected: ${rapidFire}`,
    },
  ];

  try {
    const response = await callLLM('safety-guardian', messages);
    const jsonStr = response.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      floodingDetected: parsed.floodingDetected ?? false,
      floodingScore: Math.min(10, Math.max(0, parsed.floodingScore ?? 0)),
      indicators: parsed.indicators ?? [],
      recommendation: parsed.recommendation ?? 'continue',
      pauseMessage: parsed.pauseMessage ?? null,
      repairPrompt: parsed.repairPrompt ?? null,
    };
  } catch {
    // If LLM fails, use heuristic-only assessment
    return {
      floodingDetected: rapidFire,
      floodingScore: rapidFire ? 7 : 2,
      indicators: rapidFire ? ['rapid_fire_messaging'] : [],
      recommendation: rapidFire ? 'pause_20min' : 'continue',
      pauseMessage: rapidFire
        ? "It looks like things are moving fast. Let's take a 20-minute breather — your body needs time to reset before productive conversation can happen. This is completely normal."
        : null,
      repairPrompt: rapidFire
        ? "When you return, try starting with: 'One thing I appreciate about you is...'"
        : null,
    };
  }
}

/**
 * Detect rapid-fire messaging: 3+ messages within 60s from the same user.
 */
function detectRapidFire(
  messages: Array<{ userId: string; timestamp: string }>,
): boolean {
  if (messages.length < 3) return false;

  const byUser = new Map<string, number[]>();
  for (const msg of messages) {
    const ts = new Date(msg.timestamp).getTime();
    const existing = byUser.get(msg.userId) || [];
    existing.push(ts);
    byUser.set(msg.userId, existing);
  }

  for (const timestamps of byUser.values()) {
    if (timestamps.length < 3) continue;
    timestamps.sort((a, b) => a - b);
    for (let i = 2; i < timestamps.length; i++) {
      if (timestamps[i] - timestamps[i - 2] < 60_000) {
        return true; // 3 messages within 60 seconds
      }
    }
  }

  return false;
}
