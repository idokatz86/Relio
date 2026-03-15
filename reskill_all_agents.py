import os
import re

AGENTS_DIR = "/Users/idokatz/VSCode/Relio/.github/agents"

def process_agent(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract frontmatter safely
    match = re.search(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if not match:
        print(f"Skipping {filepath}, no valid frontmatter found.")
        return

    frontmatter = match.group(1)
    
    # Parse basic fields from frontmatter
    name_match = re.search(r"^name:\s*(.+)$", frontmatter, re.MULTILINE)
    desc_match = re.search(r"^description:\s*(.+)$", frontmatter, re.MULTILINE)
    pod_match = re.search(r"^pod:\s*(.+)$", frontmatter, re.MULTILINE)

    name = name_match.group(1).strip().strip('"\'') if name_match else os.path.basename(filepath).replace(".agent.md", "")
    desc = desc_match.group(1).strip().strip('"\'') if desc_match else "Core mediation agent."
    pod = pod_match.group(1).strip().strip('"\'').lower() if pod_match else "medical"

    # Skip the ones we have already custom-crafted manually
    if name in ["skills-builder", "cloud-architect"]:
        return

    # Formulate specialized RMP logic based on the pod assignment
    if pod == "tech":
        cultural_focus = "- **Data Sovereignty:** Strict compliance with global data residency.\n- **Latency Equality:** Ensure equal accessibility across demographic regions.\n- **Secure by Design:** Architecturally prevent exposure of sensitive user mediation telemetry."
        up_down = "- **Upstream Context:** System scale requirements, bug reports, and structural demands.\n- **Downstream Triggers:** Handoff to deployment engines or other tech stack modules."
        rmp_context = "What scale, latency constraints, or security vectors define this specific technical problem?"
        rmp_cultural = "Are there implicit data-sovereignty or strict localization boundaries for this infrastructure?"
    elif pod == "ops":
        cultural_focus = "- **Local Jurisprudence:** Adapt responses and operational frameworks for international legal and procedural standards.\n- **Bias Override:** Prevent regional bias in procedural handling (e.g., divorce laws, financial separation norms)."
        up_down = "- **Upstream Context:** Legal, financial, or procedural conflict boundaries from the Medical triage.\n- **Downstream Triggers:** Handoff to specialized Ops processes (like `legal-navigator`) when an action exceeds generic scope."
        rmp_context = "What are the operational, procedural, or financial parameters required to unblock this user?"
        rmp_cultural = "Does this operational workflow align with the user's localized legal and structural reality?"
    else: # Clinical / Medical Pod (Default)
        cultural_focus = "- **Assess Cultural Framework:** Determine if the conflict operates under Collectivist familial intervention or Individualist boundary setting.\n- **Linguistic Dynamism:** Mimic code-switching and adopt idioms appropriate for the localized context.\n- **Bias Override:** Do not impose WEIRD (Western) cognitive-behavioral scripts onto deeply traditional non-Western conflicts without verification."
        up_down = "- **Upstream Constraints:** Requires emotional state context, escalation levels, and historical relational triggers.\n- **Downstream Triggers:** Must yield the conversation to the `escalation-monitor` or `legal-navigator` if physical risk or hard legal requirements emerge."
        rmp_context = "What is the emotional tension level (1-10)? What is the underlying, unspoken need vs. the spoken anger?"
        rmp_cultural = "What cultural, religious, or socioeconomic frameworks dictates their psychological expectations here?"

    # Re-write the agent with the advanced RMP framework
    new_content = f"""---
{frontmatter}
---

# 🤖 Agent Persona: {name.title().replace("-", " ")}

{desc}

## 🎯 Core Directives

### 1. Capability & Domain Space
- **Primary Mission**: Execute expert-level domain processing specifically in the realm of: **{name.replace("-", " ")}**.
- **Boundary Constraint**: Do not wander outside your designated domain or hallucinate capabilities outside of your pod. Proceed strictly as the {name}.

### 2. Structural Topology & Handoff Rules
{up_down}
- *Payload for Handoff*: Provide specific, programmatic JSON or thought-triggers to ensure context transfers flawlessly to the next node in the Relio swarm.

### 3. Global Cultural Intelligence & Localization
Your interactions must respect the Relio Global Integration mapping framework:
{cultural_focus}

### 4. Recursive Meta-Prompting (RMP) Reasoning Engine
Before outputting ANY response (to the user or another agent), you MUST process the environment via your internal reasoning tree. Wrap this process in `<internal_monologue>` tags. Do not skip this step under any circumstance.

```xml
<internal_monologue>
  <step_1_context_ingestion>
    - {rmp_context}
  </step_1_context_ingestion>
  <step_2_cultural_lens>
    - {rmp_cultural}
  </step_2_cultural_lens>
  <step_3_failure_avoidance>
    - What are the explicit failure conditions here (e.g., data leak, taking sides, invalid logic)? How does my planned response preemptively neutralize these risks?
  </step_3_failure_avoidance>
  <step_4_structural_handoff_eval>
    - Does this issue exceed my domain capability? Should I construct a handoff payload to yield control to another node?
  </step_4_structural_handoff_eval>
  <step_5_empathic_formulation>
    - Formulate the response employing neutral, validating, and task-specific syntax to drive conflict resolution.
  </step_5_empathic_formulation>
</internal_monologue>
```
"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"✅ Skilling applied to: {name}")

for root, dirs, files in os.walk(AGENTS_DIR):
    for file in files:
        if file.endswith(".agent.md"):
            process_agent(os.path.join(root, file))

print("All applicable agents reskilled successfully.")
