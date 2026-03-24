---
name: localize-agent-output
description: Configures AI mediation agents to generate language-aware output, enabling cross-language couple mediation where Tier 1 stays in sender's language and Tier 3 is generated in receiver's preferred language.
agents: [communication-coach, orchestrator-agent, individual-profiler, psychoeducation-agent]
---
# Skill: Localize Agent Output (Cross-Language Mediation)

You configure the AI mediation pipeline to generate output in the user's preferred language, enabling Relio's unique cross-language couple mediation.

## Step 1: Pipeline Language Context
The Orchestrator passes language context to all downstream agents:
```typescript
interface PipelineContext {
  sender: {
    userId: string;
    preferredLanguage: string; // ISO 639-1: 'en', 'es', 'pt-BR', 'he'
  };
  receiver: {
    userId: string;
    preferredLanguage: string;
  } | null; // null for solo mode
}
```
- For solo users (no partner): generate output in `sender.preferredLanguage`
- For couples: Tier 3 output in `receiver.preferredLanguage`

## Step 2: Communication Coach — Language-Native Casual Output
Add to the Communication Coach system prompt:
```
LANGUAGE DIRECTIVE:
- The sender's message may be in any supported language.
- Analyze the message in whatever language it is written.
- Generate your Tier 3 output in: {receiver.preferredLanguage}
- If receiver language is not specified, use the sender's language.
- Use NATURAL, CASUAL, everyday speech patterns — not formal or literary:
  - EN: contractions, "hey", "look", "honestly", "the thing is..."
  - ES: tuteo, "mira", "o sea", "la verdad es que", "dale", "la neta" (MX)
  - PT-BR: "olha", "tipo assim", "sabe", "na real", "tá ligado?"
  - HE: spoken register — "תשמע/י", "נו", "יאללה", "בסדר תראה", "מה קורה פה ש..."
- NEVER use stiff/formal/literary language. Real people don't talk like textbooks.
- Clinical framework accuracy stays in reasoning — output sounds like a friend mediating.
```

Example — Cross-language couple:
- Partner A (Hebrew): "הוא אף פעם לא מקשיב לי. אני מרגישה שקופה."
- Tier 3 output for Partner B (English): "Your partner would love to feel more heard. Can you think of a recent moment where they shared something important?"

## Step 3: Individual Profiler — Language-Aware Baseline
- Analyze attachment patterns regardless of input language
- Store attachment profile with `language: string` for longitudinal analysis
- Cultural attachment baselines differ: more avoidant in Western Europe, more anxious in Israel/Japan
- The Cultural Intelligence embedding from the Orchestrator applies here

## Step 4: Psychoeducation Agent — Localized Content
- Psychoeducation cards, exercises, and micro-lessons must be served in user's language
- Clinical content: professional human translation (NOT AI-generated)
- Exercise instructions: professional translation (safety-critical)
- Motivational content: AI translation acceptable with human review
- Store translated content in locale-specific JSON: `psychoeducation/en.json`, `psychoeducation/he.json`

## Step 5: Phase Agents — Cultural Adaptation
Each phase agent should be aware of cultural context:
- **Phase-Dating**: Digital trust signals vary by culture (Israeli directness vs. Brazilian indirectness)
- **Phase-Married**: Conflict resolution norms and intimacy expectations are culture-dependent
- **Phase-Pre-Divorced**: Asset division norms differ by jurisdiction; flooding detection language is culture-dependent
- **Phase-Divorced**: Co-parenting frameworks (BIFF/Gray Rock) are US-centric — adapt for Israeli/Brazilian family court contexts

## Step 6: Quality Assurance
For each supported language, evaluate:
- Socratic output quality: human rating 1-5 (target: ≥4.0)
- Cultural appropriateness: no WEIRD bias in output
- Clinical accuracy: psychological concepts correctly expressed
- Tone calibration: matches target culture's communication norms

<thought_process_template>
Before generating any output:
1. What language did the sender write in?
2. What language does the receiver prefer?
3. Am I generating Tier 3 output? If yes, use receiver's language.
4. Am I generating 1-on-1 coaching? If yes, use sender's language.
5. Are there culturally-specific nuances I should adapt for the target language?
6. Is this clinical content that requires professional translation, or dynamic output the LLM can generate?
</thought_process_template>

## Constraints
- NEVER generate Tier 3 output in the wrong language (sender vs receiver confusion)
- NEVER AI-translate clinical exercise instructions (use pre-translated content)
- NEVER apply WEIRD cultural defaults to non-Western users
- NEVER simplify clinical concepts for translation — maintain full therapeutic meaning
- ALWAYS detect input language (don't assume English)
- ALWAYS fall back to English if target language is unsupported
