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
import { analyzeDynamics } from '../agents/relationship-dynamics.js';
import { redactPII } from '../privacy/pii-redactor.js';
import { validateNoPiiLeak } from '../privacy/pii-validator.js';
import type { AgentName, PipelineResult } from '../types/index.js';

/**
 * Process a single user message through the complete 5-agent pipeline.
 * 
 * @param userId - The user sending the message (for profiling)
 * @param message - The raw Tier 1 message
 * @param preferredLanguage - User's preferred language for Tier 3 output (Issue #140)
 * @returns Pipeline result with Tier 3 output (or safety halt)
 */
export async function processMessage(
  userId: string,
  message: string,
  preferredLanguage: string = 'en',
): Promise<PipelineResult> {
  const startTime = Date.now();
  const agentsInvoked: AgentName[] = [];

  // === PRE-FLIGHT: PII Redaction (strip names, emails, phones before any LLM call) ===
  const { redacted: safeMessage, entities: piiEntities } = redactPII(message);

  // === STEP 1: Safety Guardian (non-negotiable, always first) ===
  // Safety Guardian sees the ORIGINAL message for accurate crisis detection
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

  // === STEPS 2, 3 & 4: Orchestrator + Profiler + Dynamics (PARALLEL — no data dependency) ===
  // These agents see the REDACTED message (no PII)
  agentsInvoked.push('orchestrator', 'individual-profiler', 'relationship-dynamics');
  const [routing, profile, dynamics] = await Promise.all([
    routeMessage(safeMessage),
    profileUser(userId, safeMessage),
    analyzeDynamics([{ userId, content: safeMessage }]),
  ]);

  // === STEP 5: Communication Coach (Tier 1 → Tier 3 translation) ===
  // Coach sees the REDACTED message + dynamics context — generates casual output without PII
  agentsInvoked.push('communication-coach');
  const dynamicsContext = dynamics.contextForCoach ? `, Dynamics: ${dynamics.contextForCoach}` : '';
  const horsemenContext = dynamics.horsemen.length > 0 ? `, Horsemen: ${dynamics.horsemen.join('+')}` : '';
  const context = `Attachment: ${profile.attachmentStyle} (${profile.attachmentConfidence}), State: ${profile.activationState}, Intent: ${routing.intent}, Intensity: ${routing.emotionalIntensity}/10, Language: ${preferredLanguage}${dynamicsContext}${horsemenContext}`;
  let tier3Output = await transformToSocratic(safeMessage, context);

  // === POST-FLIGHT: Validate no PII leaked into Tier 3 output ===
  if (tier3Output && piiEntities.length > 0) {
    tier3Output = validateNoPiiLeak(tier3Output, piiEntities);
  }

  return {
    safetyCheck,
    tier3Output,
    profile,
    processingTimeMs: Date.now() - startTime,
    agentsInvoked,
  };
}
