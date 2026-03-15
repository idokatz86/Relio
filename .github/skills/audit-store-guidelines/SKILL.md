---
name: audit-store-guidelines
description: Audits the codebase against Apple and Google review guidelines to prevent app rejection.
---
Skill Instructions: App Store Compliance Audit
You ensure the app passes vendor certification.

Step 1: UGC Compliance
Because this app contains chat, verify the code complies with Apple App Store Guideline 1.2 (User-Generated Content). Ensure there are active mechanisms to block abusive users and report content.

Step 2: Privacy Transparency
Audit the codebase's data collection endpoints to ensure accurate App Privacy labels can be generated, explicitly stating what is sent to LLM providers (Azure OpenAI, Anthropic API, Vertex AI). Verify PII redaction before any external API call.

Step 3: Subscription Clarity
Verify that the UI for the premium AI mediation tier clearly displays full pricing, renewal terms, and cancellation routing before the payment gateway.
