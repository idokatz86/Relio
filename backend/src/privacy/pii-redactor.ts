/**
 * PII Redactor — Regex-based PII detection and redaction
 * 
 * Strips personally identifiable information from user messages
 * BEFORE they reach any LLM agent. Conservative approach: better
 * to miss a name than wrongly redact common words.
 */

export interface PiiEntity {
  type: 'PERSON' | 'EMAIL' | 'PHONE' | 'ADDRESS' | 'ID_NUMBER' | 'URL';
  original: string;
  replacement: string;
  startIndex: number;
  endIndex: number;
}

export interface RedactionResult {
  redacted: string;
  entities: PiiEntity[];
}

// ── Patterns ─────────────────────────────────────────────────

// Email: standard email pattern
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Phone: international formats (US, IL, BR, generic)
const PHONE_RE = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;

// SSN / ID numbers: xxx-xx-xxxx or xxx.xx.xxxx
const ID_NUMBER_RE = /\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g;

// URLs
const URL_RE = /https?:\/\/[^\s]+/gi;

// Address: number + street name pattern (e.g., "123 Main Street", "45 5th Ave")
const ADDRESS_RE = /\b\d{1,5}\s+(?:[A-Z][a-z]+\s+){0,2}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Road|Rd|Way|Court|Ct|Place|Pl|Circle|Cir)\b/gi;

// Name detection: Capitalized word after relationship/possessive indicators
// Conservative: only fires after clear relationship context words
const NAME_CONTEXT_RE = /\b(?:my\s+(?:partner|husband|wife|boyfriend|girlfriend|ex|fiancée?|friend|mother|father|sister|brother|son|daughter|boss|coworker|therapist|counselor))\s+([A-Z][a-z]{2,})\b/gi;

// Additional name patterns: "with [Name]", "told [Name]", "[Name] said", "[Name] told me"
const NAME_VERB_RE = /\b(?:with|told|asked|called|texted|messaged)\s+([A-Z][a-z]{2,})\b/g;
const NAME_SUBJECT_RE = /\b([A-Z][a-z]{2,})\s+(?:said|told|asked|called|texted|messaged|thinks|always|never|keeps)\b/g;

// Common words that look like names but aren't — skip list
const NOT_NAMES = new Set([
  'The', 'This', 'That', 'What', 'When', 'Where', 'Which', 'While',
  'How', 'Who', 'Why', 'Just', 'But', 'And', 'Not', 'Also', 'Even',
  'Still', 'Already', 'Always', 'Never', 'Sometimes', 'Maybe',
  'Really', 'Actually', 'Honestly', 'Basically', 'Please', 'Thanks',
  'Sorry', 'Okay', 'Sure', 'Like', 'Because', 'Since', 'After',
  'Before', 'During', 'Every', 'Some', 'Many', 'Most', 'Other',
  'Something', 'Nothing', 'Everything', 'Anything', 'Someone',
  'Yesterday', 'Today', 'Tomorrow', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday',
]);

// ── Core Redaction ───────────────────────────────────────────

export function redactPII(text: string): RedactionResult {
  const entities: PiiEntity[] = [];
  let redacted = text;

  // Order matters: redact more specific patterns first

  // 1. URLs (before emails, since URLs may contain @ symbols in query params)
  redacted = replaceAll(redacted, URL_RE, '[URL]', 'URL', entities);

  // 2. Emails
  redacted = replaceAll(redacted, EMAIL_RE, '[EMAIL]', 'EMAIL', entities);

  // 3. ID Numbers (before phone, since format overlaps)
  redacted = replaceAll(redacted, ID_NUMBER_RE, '[ID_NUMBER]', 'ID_NUMBER', entities);

  // 4. Phone numbers
  redacted = replaceAll(redacted, PHONE_RE, '[PHONE]', 'PHONE', entities);

  // 5. Addresses
  redacted = replaceAll(redacted, ADDRESS_RE, '[ADDRESS]', 'ADDRESS', entities);

  // 6. Names (contextual — most conservative)
  redacted = redactNames(redacted, entities);

  return { redacted, entities };
}

function replaceAll(
  text: string,
  pattern: RegExp,
  replacement: string,
  type: PiiEntity['type'],
  entities: PiiEntity[],
): string {
  // Reset regex state
  pattern.lastIndex = 0;
  let result = text;
  let match: RegExpExecArray | null;
  let offset = 0;

  // Collect matches first to avoid mutation during iteration
  const matches: { index: number; value: string }[] = [];
  while ((match = pattern.exec(text)) !== null) {
    matches.push({ index: match.index, value: match[0] });
  }

  for (const m of matches) {
    const adjustedIndex = m.index + offset;
    entities.push({
      type,
      original: m.value,
      replacement,
      startIndex: adjustedIndex,
      endIndex: adjustedIndex + m.value.length,
    });
    result = result.slice(0, adjustedIndex) + replacement + result.slice(adjustedIndex + m.value.length);
    offset += replacement.length - m.value.length;
  }

  return result;
}

function redactNames(text: string, entities: PiiEntity[]): string {
  let result = text;
  const namePatterns = [NAME_CONTEXT_RE, NAME_VERB_RE, NAME_SUBJECT_RE];

  for (const pattern of namePatterns) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    const matches: { index: number; name: string; fullMatch: string }[] = [];

    while ((match = pattern.exec(result)) !== null) {
      const name = match[1];
      if (name && !NOT_NAMES.has(name)) {
        matches.push({ index: match.index, name, fullMatch: match[0] });
      }
    }

    // Replace in reverse order to preserve indices
    for (let i = matches.length - 1; i >= 0; i--) {
      const m = matches[i];
      const nameStart = result.indexOf(m.name, m.index);
      if (nameStart >= 0) {
        entities.push({
          type: 'PERSON',
          original: m.name,
          replacement: '[PERSON]',
          startIndex: nameStart,
          endIndex: nameStart + m.name.length,
        });
        result = result.slice(0, nameStart) + '[PERSON]' + result.slice(nameStart + m.name.length);
      }
    }
  }

  return result;
}
