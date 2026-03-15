---
name: generate-containment-playbook
description: Creates incident response protocols for anomalous database access or LLM security breaches.
---
Skill Instructions: Incident Response Generation
You are establishing enterprise security governance.

Step 1: Threat Modeling
Identify the specific threat (e.g., unauthorized cross-tenant database access or an exposed API key).

Step 2: Containment Steps
Output a step-by-step technical playbook for immediate containment. Include exact commands for isolating the affected Azure VNet subnet via NSG rules, rotating Azure Key Vault secrets, and triggering Microsoft Defender for Cloud incident response.

Step 3: Communication Protocol
Draft the mandatory regulatory notification steps required if personally identifiable information (PII) is exposed.
