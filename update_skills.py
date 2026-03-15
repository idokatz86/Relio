#!/usr/bin/env python3
"""Update all skill files to align with PRD v1.3.0"""
import os

BASE = "/Users/idokatz/VSCode/Relio/.github"

def fix(path, old, new):
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        return
    c = open(path).read()
    if old in c:
        c = c.replace(old, new)
        open(path, "w").write(c)
        print(f"  OK: {path}")
    else:
        print(f"  SKIP (text not found): {os.path.basename(os.path.dirname(path))}")

print("=== Updating skills for PRD v1.3.0 ===\n")

# 1. design-vpc-subnets
p = f"{BASE}/skills/design-vpc-subnets/SKILL.md"
fix(p, "AWS or GCP infrastructure", "Azure VNet infrastructure")
fix(p, "Virtual Private Cloud (VPC)", "Azure Virtual Network (VNet)")
fix(p, "auto-scaling group policies to spin up additional backend instances automatically", "AKS Horizontal Pod Autoscaler policies to scale pods automatically")
fix(p, "in a strictly private subnet. Ensure it has no internet gateway attached and can only be accessed by the internal backend servers.", "in a private subnet with Private Endpoints. No public IP, no internet gateway. Access only via AKS pods through Azure Private Link.")

# 2. optimize-llm-costs
p = f"{BASE}/skills/optimize-llm-costs/SKILL.md"
fix(p, "Claude 3.5 Haiku or GPT-4o-mini", "GPT-5.3-Codex (via Azure OpenAI)")
fix(p, "Claude 3 Opus or GPT-4o", "Claude Opus 4.6 or GPT-5.4 (via Azure OpenAI)")
c = open(p).read()
if "Model Cascading" not in c:
    c += "\n\n## Model Cascading (v1.3.0)\n\nStep 4: Implement complexity classifier in LLM Gateway (Azure API Management):\n- Simple (40%): GPT-5.3-Codex @ $0.002/call\n- Medium (30%): Claude Sonnet 4.6 @ $0.008/call\n- Complex (20%): Claude Opus 4.6 @ $0.025/call\n- Safety (10%): Gemini 3.1 Pro @ $0.004/call\n- Blended CPI: $0.012 → $0.006 → $0.004\n\nStep 5: Azure OpenAI PTUs for 30-40% reserved capacity discount.\n"
    open(p, "w").write(c)
    print("  Added Model Cascading to optimize-llm-costs")

# 3. scaffold-agent-skill: 36->38
fix(f"{BASE}/skills/scaffold-agent-skill/SKILL.md", "36 downstream", "38 downstream")

# 4. skills-builder agent: 36->38
p = f"{BASE}/agents/skills-builder.agent.md"
fix(p, "36-node", "38-node")
fix(p, "our 36 specific", "our 38 specific")

# 5. enforce-privacy-mechanisms
p = f"{BASE}/skills/enforce-privacy-mechanisms/SKILL.md"
fix(p, "local, on-device PII masking occurs before data hits the cloud LLM", "PII redaction (Azure AI Language + Presidio) occurs before data hits the LLM Gateway (Azure API Management)")
fix(p, "purge Tier 1 data when it is no longer legally or functionally required.", "purge Tier 1 data when it is no longer legally or functionally required. Default: 90 days. Azure Functions timer triggers for cleanup.")

# 6. generate-containment-playbook
fix(f"{BASE}/skills/generate-containment-playbook/SKILL.md",
    "isolating the affected database subnet or rotating the compromised keys",
    "isolating the affected Azure VNet subnet via NSG rules, rotating Azure Key Vault secrets, and triggering Microsoft Defender for Cloud incident response")

# 7. create-secure-workflow
fix(f"{BASE}/skills/create-secure-workflow/SKILL.md",
    "CodeQL or similar static application security testing (SAST) tools on all generated code to scan for exposed secrets or broken authorization logic",
    "CodeQL + Microsoft Defender for DevOps. Scan for exposed secrets, broken auth, and Azure RBAC misconfigurations. Push images to Azure Container Registry (ACR) with vulnerability scanning")

# 8. implement-secure-websocket
fix(f"{BASE}/skills/implement-secure-websocket/SKILL.md",
    "Write code to manage persistent WebSocket connections. Implement exponential backoff and reconnection logic for mobile clients dropping cellular service.",
    "Write code to manage persistent WebSocket connections via Socket.io on AKS with Azure Cache for Redis Pub/Sub adapter. Implement exponential backoff (1s→2s→4s→8s→30s max). Replay missed Tier 3 messages from Shared Room Store on reconnect.")

# 9. test-tier1-isolation
fix(f"{BASE}/skills/test-tier1-isolation/SKILL.md",
    "User A's private Tier 1 database silo",
    "User A's Tier 1 Azure PostgreSQL Flexible Server partition (canary string injection)")

# 10. audit-store-guidelines
fix(f"{BASE}/skills/audit-store-guidelines/SKILL.md",
    "what is sent to third-party AI LLMs",
    "what is sent to LLM providers (Azure OpenAI, Anthropic API, Vertex AI). Verify PII redaction before any external API call")

# 11. detect-crisis-abuse
fix(f"{BASE}/skills/detect-crisis-abuse/SKILL.md",
    "Distribute localized crisis hotline numbers directly via a Tier 1 un-abstracted private channel to the user at risk.",
    "Trigger SAFETY_HALT and hand off to `emergency-response-agent`.\n4. `emergency-response-agent` delivers localized resources and, for CRITICAL, routes to real emergency services (911/112/999) via Azure Communication Services.")

# 12. architect-dual-context-db
p = f"{BASE}/skills/architect-dual-context-db/SKILL.md"
fix(p, "User A's Private State: Contains raw inputs and Tier 1 disclosures.",
    "User A's Private State: Azure PostgreSQL Flexible Server — raw inputs and Tier 1 disclosures. Row-Level Security + separate schemas.")
fix(p, "User B's Private State: Contains raw inputs and Tier 1 disclosures.",
    "User B's Private State: Azure PostgreSQL Flexible Server — raw inputs and Tier 1 disclosures. Row-Level Security + separate schemas.")
fix(p, "Shared Room State: Contains only the AI's Tier 3 translations and explicit shared messages.",
    "Shared Room State: Azure PostgreSQL Flexible Server (separate instance) — AI Tier 3 translations only.\n\nTier 2 Clinical State: Azure Cosmos DB — abstracted psychological profiles, attachment mappings. Medical Pod internal only.")

# 13. design-subscription-funnel
p = f"{BASE}/skills/design-subscription-funnel/SKILL.md"
c = open(p).read()
if "Premium+" not in c:
    c = c.replace(
        "Map active value (e.g., real-time 3-way AI mediation, live de-escalation) to the Premium Tier.",
        "Map active value (real-time 3-way AI mediation) to Premium ($19.99/mo).\n\nMap co-parenting and multi-party mediation to Premium+ Family ($29.99/mo).\n\nData monetization: anonymized aggregate insights (opt-in, k≥50) as revenue stream ($500K Y2, $2M Y3).")
    open(p, "w").write(c)
    print("  Updated design-subscription-funnel")

# 14. generate-stage-messaging
p = f"{BASE}/skills/generate-stage-messaging/SKILL.md"
c = open(p).read()
if "Digital" not in c:
    c = c.replace(
        "Divorce: Focus on shielding children from conflict and establishing peaceful boundaries.",
        "Divorce/Co-Parenting: Focus on shielding children and digital boundaries (BIFF framework).\n\nStep 1b: Digital & Social Media Angle\n- Dating: Social media comparison, jealousy, digital trust\n- Marriage: Phubbing, technoference, screen-free rituals\n- Divorce: Digital harassment, public oversharing\n- Co-Parenting: Parallel social media, BIFF for text/email")
    open(p, "w").write(c)
    print("  Updated generate-stage-messaging")

print("\n=== ALL DONE ===")
