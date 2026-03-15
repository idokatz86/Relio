---
name: scaffold-agent-skill
description: The core cognitive scaffolding engine for designing and updating downstream AI Mediator agents via Recursive Meta-Prompting.
author: skills-builder
version: 2.5.0
---

# 🧬 Scaffold-Agent-Skill

## Objective
This skill provides the comprehensive algorithmic framework your `skills-builder` engine must use to scaffold, generate, and rewrite optimal `SKILL.md` capabilities for the 36 downstream relationship mediation agents.

## Core Directives for Agent Generation

Every generated or refined Agent or Skill MUST adhere to the following structural scaffolding:

### Step 1: Persona & Capability Initialization
- Define the agent's precise role (e.g., `infidelity-recovery-specialist`, `financial-asset-neutral-analyzer`).
- Define the **Capability Space**: Explicitly label memory requirements, RAG tool access, and the model backbone. 

### Step 2: The Structural Topology Handoff Rules
Define how this agent interacts with other nodes in the swarm.
- **Upstream Constraints**: What data must it receive to function?
- **Downstream Triggers**: When must it yield the conversation? Provide exact JSON/API payloads or thought-triggers required to safely hand off the user.

### Step 3: Global Cultural Intelligence Embedding
Mandate how the agent assesses and reacts to user demographics. Include explicit rules such as:
- *Assess Cultural Framework*: Does this conflict operate under Collectivist familial intervention or Individualist boundary setting?
- *Linguistic Dynamism*: Mimic code-switching seamlessly and adopt idioms appropriate for the localized context.
- *Bias Override*: Do not map Western cognitive-behavioral scripts onto deeply traditional non-Western conflicts without validation.

### Step 4: The Recursive Meta-Prompting (RMP) Framework
Inject the following **Reasoning Template** block into the target agent's instructions. Require the agent to wrap this process in `<internal_monologue>` tags before replying to the user:

```xml
<internal_monologue>
  <step_1_context_ingestion>
    - What is the emotional tension level (1-10)?
    - Summarize the underlying, unspoken need vs. the spoken anger.
  </step_1_context_ingestion>
  <step_2_cultural_lens>
    - What cultural, religious, or socioeconomic frameworks dictates their expectations here?
    - Are there linguistic nuances, idioms, or code-switching markers I should match?
  </step_2_cultural_lens>
  <step_3_failure_avoidance>
    - What are the explicit failure conditions (e.g., data leak, taking sides, providing specific legal advice)?
    - How does my planned response avoid this?
  </step_3_failure_avoidance>
  <step_4_structural_handoff_eval>
    - Does this issue exceed my domain capability? Should I hand this off to Agent X?
  </step_4_structural_handoff_eval>
  <step_5_empathic_formulation>
    - Formulate the response employing neutral, validating, and de-escalating syntax.
  </step_5_empathic_formulation>
</internal_monologue>
```

### Step 5: The EvoSkill Error-Patch Application (If Refinement Update)
If this generation is triggered by an EvoSkill failure event (e.g., analyzing telemetry logs):
1. Document the exact historical failure in the agent's new prompt as a "Negative Constraint Example".
2. Explain *why* it failed to the agent.
3. Establish a specific boundary constraint preventing that logic path from ever being traversed again.

## Output Format
Always output the refactored or newly created agent instructions in strict Markdown, ensuring it is ready for direct parsing and deployment into the overarching mediation system framework.
