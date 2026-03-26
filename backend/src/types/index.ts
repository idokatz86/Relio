/**
 * Relio Core Types
 * Defines the fundamental types used across the 5-agent MVP pipeline.
 */

/** LLM provider configuration */
export type LLMProvider = 'github' | 'azure';

/** Message format for LLM calls */
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Response from an LLM call */
export interface LLMResponse {
  content: string;
  model: string;
  provider: LLMProvider;
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
}

/** Agent names in the MVP pipeline */
export type AgentName =
  | 'safety-guardian'
  | 'orchestrator'
  | 'communication-coach'
  | 'individual-profiler'
  | 'phase-dating'
  | 'relationship-dynamics'
  | 'psychoeducation'
  | 'progress-tracker';

/** Model assignment per agent */
export interface AgentModelConfig {
  agent: AgentName;
  githubModel: string;     // Model name for GitHub Models API
  azureModel?: string;     // Model name for Azure OpenAI
  anthropicModel?: string; // Model name for Anthropic API
  vertexModel?: string;    // Model name for Vertex AI (Gemini)
  temperature: number;
  maxTokens: number;
}

/** Safety severity levels */
export type SafetySeverity = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Safety Guardian response */
export interface SafetyCheckResult {
  severity: SafetySeverity;
  halt: boolean;
  reasoning: string;
  markers?: string[];
}

/** Tier classification */
export type TierLevel = 1 | 2 | 3;

/** Orchestrator routing decision */
export interface RoutingDecision {
  tier: TierLevel;
  nextAgent: AgentName;
  sessionMetadata: Record<string, unknown>;
}

/** Attachment styles (Individual Profiler) */
export type AttachmentStyle = 'anxious' | 'avoidant' | 'secure' | 'disorganized';

/** Individual profile (Tier 2) */
export interface IndividualProfile {
  userId: string;
  attachmentStyle: AttachmentStyle;
  attachmentConfidence: number;
  lovLanguagePrimary?: string;
  loveLanguageSecondary?: string;
  activationState: 'baseline' | 'elevated' | 'flooding';
}

/** Pipeline result — the end-to-end output */
export interface PipelineResult {
  safetyCheck: SafetyCheckResult;
  tier3Output: string | null;
  profile?: IndividualProfile;
  processingTimeMs: number;
  agentsInvoked: AgentName[];
}
