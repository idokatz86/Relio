/**
 * Relio 5-Agent MVP Pipeline
 * 
 * The complete message processing pipeline:
 * User Input → Safety Guardian → Orchestrator → Individual Profiler → Communication Coach → Tier 3 Output
 * 
 * This is the core product loop that validates whether couples will use AI-mediated communication.
 */

import { checkSafety } from '../agents/safety-guardian.js';
import { routeMessage } from '../agents/orchestrator.js';
import { profileUser } from '../agents/individual-profiler.js';
import { transformToSocratic } from '../agents/communication-coach.js';
import type { AgentName, PipelineResult } from '../types/index.js';

/**
 * Process a single user message through the complete 5-agent pipeline.
 * 
 * @param userId - The user sending the message (for profiling)
 * @param message - The raw Tier 1 message
 * @returns Pipeline result with Tier 3 output (or safety halt)
 */
export async function processMessage(
  userId: string,
  message: string,
): Promise<PipelineResult> {
  const startTime = Date.now();
  const agentsInvoked: AgentName[] = [];

  // === STEP 1: Safety Guardian (non-negotiable, always first) ===
  agentsInvoked.push('safety-guardian');
  const safetyCheck = await checkSafety(message);

  if (safetyCheck.halt) {
    return {
      safetyCheck,
      tier3Output: null,
      processingTimeMs: Date.now() - startTime,
      agentsInvoked,
    };
  }

  // === STEPS 2 & 3: Orchestrator + Profiler (PARALLEL — no data dependency) ===
  agentsInvoked.push('orchestrator', 'individual-profiler');
  const [routing, profile] = await Promise.all([
    routeMessage(message),
    profileUser(userId, message),
  ]);

  // === STEP 4: Communication Coach (Tier 1 → Tier 3 translation) ===
  agentsInvoked.push('communication-coach');
  const context = `Attachment: ${profile.attachmentStyle} (${profile.attachmentConfidence}), State: ${profile.activationState}, Intent: ${routing.intent}, Intensity: ${routing.emotionalIntensity}/10`;
  const tier3Output = await transformToSocratic(message, context);

  return {
    safetyCheck,
    tier3Output,
    profile,
    processingTimeMs: Date.now() - startTime,
    agentsInvoked,
  };
}
