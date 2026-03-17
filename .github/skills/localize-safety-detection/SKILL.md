---
name: localize-safety-detection
description: Extends the Safety Guardian to detect crisis signals (suicidal ideation, DV markers, self-harm) across multiple languages including Hebrew, Spanish, Portuguese, and Arabic.
agents: [safety-guardian, emergency-response-agent, orchestrator-agent]
---
# Skill: Localize Safety Detection (Multi-Language Crisis Detection)

You extend the Safety Guardian to detect crisis and abuse signals regardless of the input language.

## Step 1: System Prompt Enhancement
Add to the Safety Guardian's system prompt:
```
CRITICAL: Analyze the user's input in WHATEVER LANGUAGE it is written.
Detect crisis signals regardless of language. Common crisis indicators include:
- Suicidal ideation in any language (e.g., "I want to die", "אני רוצה למות", "quiero morir", "eu quero morrer")
- Domestic violence markers in any language
- Self-harm indicators in any language
- Coercive control patterns in any language
Do NOT assume the user writes in English. Apply the same severity classification to all languages.
```

## Step 2: Locale-Aware Emergency Resources
Maintain a structured resource map per locale:
```typescript
const EMERGENCY_RESOURCES: Record<string, EmergencyResource[]> = {
  'en-US': [
    { type: 'suicide', name: '988 Suicide & Crisis Lifeline', number: '988' },
    { type: 'dv', name: 'National DV Hotline', number: '1-800-799-7233' },
    { type: 'crisis_text', name: 'Crisis Text Line', number: 'Text HOME to 741741' },
  ],
  'he-IL': [
    { type: 'suicide', name: 'ער"ן - עזרה ראשונה נפשית', number: '1201' },
    { type: 'dv', name: 'קו חירום לאלימות במשפחה', number: '1-800-220-000' },
  ],
  'pt-BR': [
    { type: 'suicide', name: 'CVV - Centro de Valorização da Vida', number: '188' },
    { type: 'dv', name: 'Central de Atendimento à Mulher', number: '180' },
  ],
  'es': [
    { type: 'suicide', name: 'Teléfono de la Esperanza', number: '717 003 717' },
    { type: 'dv', name: 'Violencia de Género', number: '016' },
  ],
  'default': [
    { type: 'emergency', name: 'Emergency Services', number: '112' },
  ],
};
```

## Step 3: CrisisScreen Localization
- Replace hardcoded US-only hotlines with `EMERGENCY_RESOURCES[user.locale]`
- Detect user locale from `expo-localization` and `user.preferredLanguage`
- Show resources in user's language with local phone numbers
- Include universal 112 European emergency number for EU users
- NEVER show wrong-country emergency numbers

## Step 4: Multi-Language Safety Test Suite
For each supported language, create a 50-scenario test covering:
- 10 suicidal ideation phrases (direct + indirect + coded)
- 10 domestic violence indicators (threats, control, isolation)
- 10 self-harm signals (cutting, overdose, starvation)
- 10 coercive control patterns (financial abuse, gaslighting, DARVO)
- 5 false positives (discussion ABOUT these topics without being at risk)
- 5 edge cases (sarcasm, movie/song quotes, hypothetical discussions)
Pass threshold: >95% recall for crisis detection, <5% false positive rate

## Step 5: Cultural Safety Markers
Beyond direct translation, detect culturally-specific crisis indicators:
- **Hebrew/Israeli**: honor-based violence markers, military PTSD language
- **Brazilian Portuguese**: femicide indicators (Brazil has high DV rates), cultural minimization phrases
- **Spanish**: machismo-related control patterns, family honor dynamics
- **Arabic (future)**: honor killing indicators, forced marriage signals

<thought_process_template>
Before classifying any message for safety:
1. What language is this message written in? (auto-detect, don't assume English)
2. Are there crisis keywords in this language?
3. Are there culturally-specific red flags for this user's locale?
4. Is this a genuine crisis or a discussion/quote about crisis topics?
5. What are the appropriate emergency resources for this user's location?
6. Am I applying the SAME severity threshold regardless of language?
</thought_process_template>

## Constraints
- NEVER assume input is English
- NEVER show US-only crisis numbers to non-US users
- NEVER reduce severity classification based on language (Hebrew crisis = English crisis)
- NEVER skip safety monitoring for non-English messages
- ALWAYS provide emergency resources in the user's language + local numbers
- Crisis resources must be MANUALLY curated per locale (not AI-translated)
