/**
 * Relio LLM Gateway
 * 
 * Provider-agnostic abstraction layer for all LLM calls.
 * Supports GitHub Models API (free/dev) and Azure BYOK (production).
 * 
 * Usage:
 *   const response = await callLLM('safety-guardian', messages);
 * 
 * Provider swap:
 *   Set LLM_PROVIDER=github (default, free tier)
 *   Set LLM_PROVIDER=azure (production, after Pre-Seed)
 * 
 * @see PRD Section 5.6.1 — LLM Infrastructure Transition Roadmap
 */

import type { AgentName, AgentModelConfig, LLMMessage, LLMProvider, LLMResponse } from '../types/index.js';
import { DefaultAzureCredential } from '@azure/identity';

// Azure AD token cache for managed identity auth
let cachedAzureToken: { token: string; expiresAt: number } | null = null;
const credential = new DefaultAzureCredential();

// ── Circuit Breaker (Issue #86) ─────────────────────────────
interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'closed' | 'open' | 'half-open';
}

const circuitBreaker: CircuitBreakerState = {
  failures: 0,
  lastFailure: 0,
  state: 'closed',
};

const CB_FAILURE_THRESHOLD = 3;
const CB_RESET_TIMEOUT_MS = 30_000;

function checkCircuitBreaker(): void {
  if (circuitBreaker.state === 'open') {
    if (Date.now() - circuitBreaker.lastFailure > CB_RESET_TIMEOUT_MS) {
      circuitBreaker.state = 'half-open';
    } else {
      throw new Error('Circuit breaker OPEN — LLM service unavailable. Retrying shortly.');
    }
  }
}

function recordSuccess(): void {
  circuitBreaker.failures = 0;
  circuitBreaker.state = 'closed';
}

function recordFailure(): void {
  circuitBreaker.failures++;
  circuitBreaker.lastFailure = Date.now();
  if (circuitBreaker.failures >= CB_FAILURE_THRESHOLD) {
    circuitBreaker.state = 'open';
    console.error(`[LLM Gateway] Circuit breaker OPEN after ${CB_FAILURE_THRESHOLD} failures`);
  }
}

// ── Per-User Token Budget (Issue #86) ────────────────────────
const userTokenUsage = new Map<string, { tokens: number; resetAt: number }>();
const DAILY_TOKEN_BUDGET = parseInt(process.env.LLM_DAILY_TOKEN_BUDGET || '50000', 10);

function checkTokenBudget(userId: string): void {
  const now = Date.now();
  const usage = userTokenUsage.get(userId);
  if (usage && usage.resetAt > now && usage.tokens >= DAILY_TOKEN_BUDGET) {
    throw new Error('Daily token budget exceeded. Please try again tomorrow.');
  }
}

function trackTokenUsage(userId: string, tokens: number): void {
  const now = Date.now();
  const endOfDay = new Date().setHours(23, 59, 59, 999);
  const usage = userTokenUsage.get(userId);
  if (!usage || usage.resetAt <= now) {
    userTokenUsage.set(userId, { tokens, resetAt: endOfDay });
  } else {
    usage.tokens += tokens;
  }
}

/** Agent-to-model mapping configuration */
const AGENT_MODEL_CONFIG: Record<AgentName, AgentModelConfig> = {
  'safety-guardian': {
    agent: 'safety-guardian',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41',
    vertexModel: 'gemini-3.1-pro',
    temperature: 0.1,
    maxTokens: 500,
  },
  'orchestrator': {
    agent: 'orchestrator',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41',
    temperature: 0.2,
    maxTokens: 800,
  },
  'communication-coach': {
    agent: 'communication-coach',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41-mini',
    anthropicModel: 'claude-opus-4.6',
    temperature: 0.4,
    maxTokens: 1000,
  },
  'individual-profiler': {
    agent: 'individual-profiler',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41-mini',
    anthropicModel: 'claude-sonnet-4.6',
    temperature: 0.3,
    maxTokens: 600,
  },
  'phase-dating': {
    agent: 'phase-dating',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41-mini',
    anthropicModel: 'claude-sonnet-4.6',
    temperature: 0.4,
    maxTokens: 800,
  },
  'relationship-dynamics': {
    agent: 'relationship-dynamics',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41-mini',
    anthropicModel: 'claude-sonnet-4.6',
    temperature: 0.3,
    maxTokens: 800,
  },
  'psychoeducation': {
    agent: 'psychoeducation',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41-mini',
    temperature: 0.5,
    maxTokens: 600,
  },
  'progress-tracker': {
    agent: 'progress-tracker',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-41-mini',
    temperature: 0.2,
    maxTokens: 500,
  },
};

/**
 * Get the current LLM provider from environment config.
 */
function getProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'github';
  if (provider !== 'github' && provider !== 'azure') {
    throw new Error(`Invalid LLM_PROVIDER: ${provider}. Must be 'github' or 'azure'.`);
  }
  return provider;
}

/**
 * Call GitHub Models API (Phase 0 — free tier).
 * Uses Personal Access Token for authentication.
 * WARNING: Synthetic data only. Never send real PII.
 */
async function callGitHubModels(
  model: string,
  messages: LLMMessage[],
  temperature: number,
  maxTokens: number,
): Promise<LLMResponse> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN not set. Required for LLM_PROVIDER=github.');
  }

  const response = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub Models API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
    model: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };

  return {
    content: data.choices[0]?.message?.content ?? '',
    model: data.model,
    provider: 'github',
    tokensUsed: data.usage ? {
      input: data.usage.prompt_tokens,
      output: data.usage.completion_tokens,
      total: data.usage.total_tokens,
    } : undefined,
  };
}

/**
 * Call Azure OpenAI Service (Phase 1 — production BYOK).
 * Uses DefaultAzureCredential (managed identity in Azure, az login locally).
 * Falls back to API key if AZURE_OPENAI_API_KEY is set.
 */
async function callAzureOpenAI(
  model: string,
  messages: LLMMessage[],
  temperature: number,
  maxTokens: number,
): Promise<LLMResponse> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  if (!endpoint) {
    throw new Error('AZURE_OPENAI_ENDPOINT not set.');
  }

  // Resolve deployment name: use env var override or model param
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || model;

  // Auth: prefer API key if set, otherwise use managed identity token
  let authHeader: Record<string, string>;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  if (apiKey) {
    authHeader = { 'api-key': apiKey };
  } else {
    // Get bearer token from managed identity / DefaultAzureCredential
    const now = Date.now();
    if (!cachedAzureToken || cachedAzureToken.expiresAt < now + 60_000) {
      const tokenResponse = await credential.getToken('https://cognitiveservices.azure.com/.default');
      cachedAzureToken = {
        token: tokenResponse.token,
        expiresAt: tokenResponse.expiresOnTimestamp,
      };
    }
    authHeader = { 'Authorization': `Bearer ${cachedAzureToken.token}` };
  }

  const response = await fetch(
    `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`,
    {
      method: 'POST',
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
    model: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };

  return {
    content: data.choices[0]?.message?.content ?? '',
    model: data.model,
    provider: 'azure',
    tokensUsed: data.usage ? {
      input: data.usage.prompt_tokens,
      output: data.usage.completion_tokens,
      total: data.usage.total_tokens,
    } : undefined,
  };
}

/**
 * callLLM — The main gateway function.
 * 
 * Routes to the correct provider based on LLM_PROVIDER env var.
 * Provider swap is config-only — zero code changes required.
 * 
 * @param agent - Which agent is making the call (determines model selection)
 * @param messages - The conversation messages to send
 * @returns LLM response with content and metadata
 * 
 * @example
 * ```ts
 * const result = await callLLM('safety-guardian', [
 *   { role: 'system', content: safetyGuardianPrompt },
 *   { role: 'user', content: userMessage },
 * ]);
 * ```
 */
export async function callLLM(
  agent: AgentName,
  messages: LLMMessage[],
  userId?: string,
): Promise<LLMResponse> {
  const config = AGENT_MODEL_CONFIG[agent];
  if (!config) {
    throw new Error(`Unknown agent: ${agent}. Valid agents: ${Object.keys(AGENT_MODEL_CONFIG).join(', ')}`);
  }

  // Circuit breaker check (Issue #86)
  checkCircuitBreaker();

  // Token budget check (Issue #86)
  if (userId) {
    checkTokenBudget(userId);
  }

  const provider = getProvider();

  try {
    let response: LLMResponse;
    switch (provider) {
      case 'github':
        response = await callGitHubModels(config.githubModel, messages, config.temperature, config.maxTokens);
        break;

      case 'azure':
        if (config.azureModel) {
          response = await callAzureOpenAI(config.azureModel, messages, config.temperature, config.maxTokens);
        } else {
          throw new Error(`Azure provider not yet configured for agent: ${agent}`);
        }
        break;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    // Record success for circuit breaker
    recordSuccess();

    // Track token usage (Issue #86)
    if (userId && response.tokensUsed) {
      trackTokenUsage(userId, response.tokensUsed.total);
    }

    return response;
  } catch (err) {
    recordFailure();
    throw err;
  }
}

/** Export config for testing/inspection */
export { AGENT_MODEL_CONFIG, getProvider };
