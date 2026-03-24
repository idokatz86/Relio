/**
 * PII Post-Flight Validator
 * 
 * After the Communication Coach generates Tier 3 output, scan it
 * for any leaked PII entities that were detected in the original input.
 * If found, strip them from the output before returning.
 */

import type { PiiEntity } from './pii-redactor.js';

/**
 * Validate that no PII from the original message leaked into the Tier 3 output.
 * If any entity's original value appears in the output, replace it with the
 * corresponding placeholder.
 */
export function validateNoPiiLeak(tier3Output: string, originalEntities: PiiEntity[]): string {
  if (!originalEntities.length || !tier3Output) return tier3Output;

  let cleaned = tier3Output;

  for (const entity of originalEntities) {
    // Case-insensitive replacement of the original PII value
    const escaped = escapeRegex(entity.original);
    const re = new RegExp(escaped, 'gi');
    if (re.test(cleaned)) {
      console.warn(`[PII Validator] Leaked ${entity.type} detected in Tier 3 output — redacting`);
      cleaned = cleaned.replace(re, entity.replacement);
    }
  }

  return cleaned;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
