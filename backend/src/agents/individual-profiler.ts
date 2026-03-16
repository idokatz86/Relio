/**
 * Individual Profiler Agent
 * 
 * Maintains independent psychological profiles for each user.
 * Maps attachment styles (Anxious/Avoidant/Secure/Disorganized).
 * Profiles are NEVER merged or cross-referenced.
 * 
 * @see .github/agents/individual-profiler.agent.md
 * @see Issue #22
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { IndividualProfile, LLMMessage } from '../types/index.js';

const PROFILER_PROMPT = `You are the Individual Profiler Agent for Relio.

YOUR ROLE: Assess the user's attachment style and emotional state from their message.

ATTACHMENT STYLES:
- anxious: Protest, escalation, reassurance-seeking, fear of abandonment
- avoidant: Withdrawal, minimizing, emotional distancing, self-reliance
- secure: Direct communication, empathy, repair initiation
- disorganized: Contradictory approach-avoid, emotional dysregulation

RESPONSE FORMAT (JSON only):
{
  "attachmentStyle": "anxious|avoidant|secure|disorganized",
  "confidence": 0.0-1.0,
  "activationState": "baseline|elevated|flooding",
  "reasoning": "Brief analysis"
}

- Analyze language patterns, not content
- Do NOT diagnose — this is a behavioral pattern assessment
- Confidence below 0.5 means insufficient data

SUB-STATE CLASSIFICATION (required):
- For anxious: "anxious-protest" (escalating demands for connection, "you NEVER") vs "anxious-hyperactivation" (flooding)
- For avoidant: "avoidant-deactivation" (withdrawal, "I'm done trying") vs "avoidant-dismissal" (minimizing, "you're overreacting")
- KEY: "I'm done trying" is NOT anxious — it is avoidant-deactivation (terminating attachment bids)`;

/**
 * Profile a user based on their message.
 */
export async function profileUser(
  userId: string,
  userMessage: string,
): Promise<IndividualProfile> {
  const messages: LLMMessage[] = [
    { role: 'system', content: PROFILER_PROMPT },
    { role: 'user', content: userMessage },
  ];

  const response = await callLLM('individual-profiler', messages);

  try {
    const jsonStr = response.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(jsonStr) as {
      attachmentStyle: string;
      confidence: number;
      activationState: string;
    };

    return {
      userId,
      attachmentStyle: (parsed.attachmentStyle || 'secure') as IndividualProfile['attachmentStyle'],
      attachmentConfidence: parsed.confidence || 0.5,
      activationState: (parsed.activationState || 'baseline') as IndividualProfile['activationState'],
    };
  } catch {
    return {
      userId,
      attachmentStyle: 'secure',
      attachmentConfidence: 0.3,
      activationState: 'baseline',
    };
  }
}
