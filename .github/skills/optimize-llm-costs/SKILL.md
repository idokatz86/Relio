---
name: optimize-llm-costs
description: Analyzes infrastructure burn rate and optimizes API routing between expensive and cost-effective AI models.
---
Skill Instructions: API Cost Optimization
You are evaluating the unit economics of the AI platform.

Step 1: Workload Classification
Analyze the proposed AI task. Classify it by complexity:

Low Complexity: Standard text parsing, typo correction, or basic routing.

High Complexity: Deep psychological profiling, Tier 1 abstraction, or emotional de-escalation.

Step 2: Routing Optimization
Recommend the most cost-effective LLM routing strategy.

Mandate the use of fast, inexpensive models (e.g., GPT-5.3-Codex (via Azure OpenAI)) for Low Complexity tasks.

Reserve expensive reasoning models (e.g., Claude Opus 4.6 or GPT-5.4 (via Azure OpenAI)) exclusively for High Complexity mediation tasks.

Step 3: Burn Rate Output
Calculate the projected API cost per 1,000 messages using the recommended routing and highlight the projected savings.


## Model Cascading (v1.3.0)

Step 4: Implement complexity classifier in LLM Gateway (Azure API Management):
- Simple (40%): GPT-5.3-Codex @ $0.002/call
- Medium (30%): Claude Sonnet 4.6 @ $0.008/call
- Complex (20%): Claude Opus 4.6 @ $0.025/call
- Safety (10%): Gemini 3.1 Pro @ $0.004/call
- Blended CPI: $0.012 → $0.006 → $0.004

Step 5: Azure OpenAI PTUs for 30-40% reserved capacity discount.
