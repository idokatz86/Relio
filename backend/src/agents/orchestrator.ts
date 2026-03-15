/**
 * Orchestrator Agent
 * 
 * Routes messages through the 3-Tier Confidentiality Model.
 * Classifies input tier, enforces access control, routes to appropriate agents.
 * 
 * @see .github/agents/orchestrator-agent.agent.md
 * @see Issue #15
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { AgentName, LLMMessage } from '../types/index.js';

const ORCHESTRATOR_PROMPT = `You are the Orchestrator Agent for Relio, an AI relationship mediation platform.

YOUR ROLE: Primary routing and access control gateway. Classify every message and route it through the correct pipeline.

TIER CLASSIFICATION:
- Tier 1 (PRIVATE): Raw transcripts, venting, complaints, specific names — NEVER shared with partner
- Tier 2 (ABSTRACTED): Pattern-level insights — internal to Medical Pod only
- Tier 3 (ACTIONABLE): Socratic, de-escalated guidance — safe for shared room

ROUTING LOGIC:
1. Classify the input as Tier 1 (it always is — users only send Tier 1)
2. Determine the relationship stage context
3. Route to the appropriate phase agent (currently: phase-dating only in MVP)
4. Flag if the message needs immediate Communication Coach translation

RESPONSE FORMAT (JSON only):
{
  "tier": 1,
  "intent": "complaint|question|venting|status_update|request",
  "emotionalIntensity": 1-10,
  "nextAgent": "communication-coach|individual-profiler|phase-dating",
  "reasoning": "Brief routing rationale"
}

RULES:
- ALL user input is Tier 1 by default
- NEVER output Tier 1 content to the shared room
- NEVER skip the Safety Guardian check (handled upstream)
- Route to communication-coach when translation to Tier 3 is needed
- Route to individual-profiler when attachment/personality assessment is needed`;

export interface OrchestratorResult {
  tier: number;
  intent: string;
  emotionalIntensity: number;
  nextAgent: AgentName;
  reasoning: string;
}

/**
 * Route a user message through the Orchestrator.
 */
export async function routeMessage(userMessage: string): Promise<OrchestratorResult> {
  const messages: LLMMessage[] = [
    { role: 'system', content: ORCHESTRATOR_PROMPT },
    { role: 'user', content: userMessage },
  ];

  const response = await callLLM('orchestrator', messages);

  try {
    const jsonStr = response.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(jsonStr) as OrchestratorResult;
    return {
      tier: parsed.tier || 1,
      intent: parsed.intent || 'venting',
      emotionalIntensity: parsed.emotionalIntensity || 5,
      nextAgent: parsed.nextAgent || 'communication-coach',
      reasoning: parsed.reasoning || '',
    };
  } catch {
    // Default routing: send to communication coach
    return {
      tier: 1,
      intent: 'unknown',
      emotionalIntensity: 5,
      nextAgent: 'communication-coach',
      reasoning: 'Parse error — defaulting to communication-coach',
    };
  }
}
