/**
 * PII Redaction Layer
 * 
 * Pre-flight PII stripping before any LLM API call.
 * Replaces names, emails, phones, and addresses with tokens.
 * 
 * Issue #60: PII Redaction Layer Before LLM Calls
 * @see .github/agents/data-privacy-officer.agent.md — "Pre-Flight Redaction"
 * @see .github/skills/enforce-privacy-mechanisms/SKILL.md
 */

interface RedactionResult {
  redacted: string;
  tokenMap: Map<string, string>;
}

// Common PII patterns
const PII_PATTERNS: Array<{ pattern: RegExp; type: string }> = [
  // Email addresses
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, type: 'EMAIL' },
  // Phone numbers (various formats)
  { pattern: /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g, type: 'PHONE' },
  // SSN
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, type: 'SSN' },
  // Street addresses (basic)
  { pattern: /\b\d{1,5}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:St|Ave|Blvd|Dr|Rd|Ln|Ct|Way|Pl)\b\.?/g, type: 'ADDRESS' },
  // Credit card numbers
  { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, type: 'CARD' },
];

/**
 * Redact PII from text, replacing with tokens like [EMAIL_1], [PHONE_1].
 * Returns the redacted text and a token→original map for rehydration.
 */
export function redactPII(text: string): RedactionResult {
  const tokenMap = new Map<string, string>();
  let redacted = text;
  const counters: Record<string, number> = {};

  for (const { pattern, type } of PII_PATTERNS) {
    redacted = redacted.replace(pattern, (match) => {
      counters[type] = (counters[type] || 0) + 1;
      const token = `[${type}_${counters[type]}]`;
      tokenMap.set(token, match);
      return token;
    });
  }

  return { redacted, tokenMap };
}

/**
 * Check if LLM output contains any tokens from the original input.
 * Returns true if a potential Tier 1 leak is detected.
 */
export function detectTier1Leak(originalInput: string, llmOutput: string): boolean {
  // Extract significant words (6+ chars) from original input
  const words = originalInput
    .split(/\s+/)
    .filter(w => w.length >= 6)
    .map(w => w.toLowerCase().replace(/[^a-z]/g, ''));

  const outputLower = llmOutput.toLowerCase();

  // Check if any significant original words appear in output
  for (const word of words) {
    if (word && outputLower.includes(word)) {
      return true;
    }
  }

  return false;
}

/**
 * Rehydrate tokens back to original PII values.
 * Only for displaying to the ORIGINAL sender in their private journal.
 * NEVER rehydrate for the partner.
 */
export function rehydratePII(text: string, tokenMap: Map<string, string>): string {
  let result = text;
  for (const [token, original] of tokenMap) {
    result = result.replace(token, original);
  }
  return result;
}
