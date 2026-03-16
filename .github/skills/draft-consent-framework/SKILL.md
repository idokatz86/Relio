---
name: draft-consent-framework
description: Drafts legally defensible consent flows, Terms of Service, and Privacy Policy for multi-jurisdictional compliance (GDPR, CCPA, LGPD, PIPEDA).
agents: [chief-legal-officer, chief-product-officer, data-privacy-officer]
---
# Skill: Draft Consent Framework

You draft the complete legal consent infrastructure for Relio's registration and onboarding.

## Step 1: Informed Consent Flow Design
Design a three-step informed consent flow that is legally defensible across all target jurisdictions:
1. **Not-Therapy Disclaimer** — "Relio is NOT therapy, counseling, or a substitute for professional mental health care." Must be explicit, unambiguous, and use plain language. User must actively check a box (no pre-checked defaults).
2. **Privacy & 3-Tier Model** — Explain data handling in user-friendly terms. "Your raw words are NEVER shared with your partner." Describe Tier 1 (private, encrypted, 90-day auto-purge), AI transformation, and Tier 3 (what partner sees). Link to full Privacy Policy.
3. **AI Processing Consent (GDPR Art. 22)** — Explicit opt-in for automated decision-making. "Relio uses AI to detect emotional patterns and rephrase your words." Right to object, right to human review (even if not practically offered in v1, the right must be disclosed).

## Step 2: Consent Audit Trail
Every consent interaction generates an immutable record:
- consentType (enum), version (semver), grantedAt (ISO 8601), ipAddress, deviceInfo, userId
- Records are INSERT-ONLY (no UPDATE or DELETE)
- Version tracking: when ToS or Privacy Policy text changes, version increments
- Users who consented to v1.0.0 must re-consent when v1.1.0 is published
- Consent withdrawal: sets `revoked=true` + `revokedAt` timestamp (does NOT delete the grant record)

## Step 3: Jurisdiction-Specific Requirements
| Region | Key Requirement | Implementation |
|--------|----------------|----------------|
| EU/EEA (GDPR) | Explicit opt-in for AI profiling (Art. 22), DPO contact, right to object | Separate checkbox, DPO email in footer, withdrawal in Settings |
| California (CCPA/CPRA) | "Do Not Sell" link, right to know data categories | Toggle in Settings, data categories in Privacy Policy |
| UK (UK GDPR) | Same as GDPR + ICO registration number | ICO reg in Privacy Policy |
| Brazil (LGPD) | Similar to GDPR, DPO required | Same implementation as EU |
| Canada (PIPEDA) | Meaningful consent in plain language | Already satisfied by plain-language approach |
| Israel | Privacy Protection Law 5741-1981, commissioner registration | Disclosure + registration reference |
| Australia | APP compliance, mandatory breach notification | Privacy Act notice, 72h breach protocol |

## Step 4: Duty-to-Warn Disclosure
Draft the duty-to-warn clause: "When our AI detects indicators of imminent risk of harm to self or others, Relio may provide emergency service contact information to the at-risk user. Relio does NOT directly contact emergency services without user action."
- This disclosure must be in both ToS and the AI Processing consent step
- Must be jurisdiction-aware (duty-to-warn laws vary significantly)

## Constraints
- NEVER use pre-checked consent checkboxes
- NEVER bundle multiple consent types into a single checkbox
- NEVER imply Relio provides therapeutic services
- All consent text must be at a 6th-grade reading level (Flesch-Kincaid)
- Privacy Policy must list specific data categories, not vague "personal information"
- Age verification (18+) must occur BEFORE any data collection
