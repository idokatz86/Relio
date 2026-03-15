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

/** Agent-to-model mapping configuration */
const AGENT_MODEL_CONFIG: Record<AgentName, AgentModelConfig> = {
  'safety-guardian': {
    agent: 'safety-guardian',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-54',
    vertexModel: 'gemini-3.1-pro',
    temperature: 0.1,
    maxTokens: 500,
  },
  'orchestrator': {
    agent: 'orchestrator',
    githubModel: 'openai/gpt-4o',
    azureModel: 'gpt-54',
    temperature: 0.2,
    maxTokens: 800,
  },
  'communication-coach': {
    agent: 'communication-coach',
    githubModel: 'openai/gpt-4o',
    anthropicModel: 'claude-opus-4.6',
    temperature: 0.4,
    maxTokens: 1000,
  },
  'individual-profiler': {
    agent: 'individual-profiler',
    githubModel: 'openai/gpt-4o',
    anthropicModel: 'claude-sonnet-4.6',
    temperature: 0.3,
    maxTokens: 600,
  },
  'phase-dating': {
    agent: 'phase-dating',
    githubModel: 'openai/gpt-4o',
    anthropicModel: 'claude-sonnet-4.6',
    temperature: 0.4,
    maxTokens: 800,
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
 * Requires Azure subscription and provisioned models.
 * PII redaction must be active before calling this.
 */
async function callAzureOpenAI(
  model: string,
  messages: LLMMessage[],
  temperature: number,
  maxTokens: number,
): Promise<LLMResponse> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Azure OpenAI not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY.');
  }

  const response = await fetch(
    `${endpoint}/openai/deployments/${model}/chat/completions?api-version=2024-10-21`,
    {
      method: 'POST',
      headers: {
        'api-key': apiKey,
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
): Promise<LLMResponse> {
  const config = AGENT_MODEL_CONFIG[agent];
  if (!config) {
    throw new Error(`Unknown agent: ${agent}. Valid agents: ${Object.keys(AGENT_MODEL_CONFIG).join(', ')}`);
  }

  const provider = getProvider();

  switch (provider) {
    case 'github':
      return callGitHubModels(config.githubModel, messages, config.temperature, config.maxTokens);

    case 'azure':
      // Use Azure OpenAI for GPT models, fall through for Anthropic/Gemini
      if (config.azureModel) {
        return callAzureOpenAI(config.azureModel, messages, config.temperature, config.maxTokens);
      }
      // TODO: Add Anthropic API and Vertex AI routing in Phase 1
      throw new Error(`Azure provider not yet configured for agent: ${agent}`);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/** Export config for testing/inspection */
export { AGENT_MODEL_CONFIG, getProvider };
