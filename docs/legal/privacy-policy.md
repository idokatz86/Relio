# Relio — Privacy Policy v1.0

**Effective Date:** March 17, 2026  
**Last Updated:** March 17, 2026

## 1. Introduction

Relio, Inc. ("Relio", "we", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use the Relio mobile application ("Service").

## 2. Data We Collect

### 2.1 Information You Provide
- **Account data:** Email address, display name, date of birth (for age verification)
- **Messages:** Text messages you send through the mediation system
- **Consent records:** Timestamps and versions of ToS/Privacy Policy acceptance
- **Profile data:** Relationship status, attachment style quiz responses

### 2.2 Information Collected Automatically
- **Device data:** Device type, OS version, app version
- **Usage data:** Session timestamps, feature usage (anonymized)
- **Push notification tokens:** For delivering notifications (Expo Push)

### 2.3 Information We Do NOT Collect
- **Location data:** We do not track your location
- **Contact lists:** We do not access your contacts
- **Photos or media:** We do not access your camera or gallery
- **Biometric data:** FaceID/TouchID verification happens on-device only; biometric data never leaves your device

## 3. The 3-Tier Confidentiality Model

Your data is processed in three distinct tiers with strict isolation:

| Tier | What | Who Sees It | Storage | Retention |
|------|------|-------------|---------|-----------|
| **Tier 1 — Private** | Your original messages | Only you | Azure PostgreSQL (encrypted, RLS) | 90 days, then auto-purged |
| **Tier 2 — Clinical** | Anonymous attachment/emotion patterns | AI system only (no humans) | Azure Cosmos DB (serverless) | Anonymized, no PII |
| **Tier 3 — Shared** | AI-reworded messages | You + your partner | Azure PostgreSQL (encrypted) | Until account deletion |

**Critical guarantee:** Your partner NEVER sees your Tier 1 original messages. Only AI-reworded Tier 3 versions are shared.

## 4. How We Use Your Data

- **Mediation:** Processing messages through our AI pipeline to generate Tier 3 Socratic outputs
- **Safety:** Running safety checks to detect crisis situations (mandatory, cannot be disabled)
- **Personalization:** Adjusting AI behavior based on attachment style and communication patterns
- **Improvement:** Anonymized, aggregated data to improve AI quality (no PII)

## 5. Data Storage & Security

- **Hosting:** Microsoft Azure (Sweden Central region, EU data residency)
- **Encryption:** All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Access control:** Row-Level Security (RLS) prevents any cross-user data access
- **Authentication:** Clerk OIDC with JWKS validation (no passwords stored by Relio)
- **Biometric gate:** Optional FaceID/TouchID lock prevents unauthorized device access

## 6. Data Sharing

We do NOT sell your data. We share data only:
- **With your partner:** Only Tier 3 (AI-reworded) messages, never Tier 1
- **Emergency services:** If our AI detects imminent danger (Duty to Warn)
- **Legal requirements:** If compelled by law, court order, or legal process
- **Service providers:** Azure (hosting), Clerk (authentication), Expo (push notifications) — all under data processing agreements

## 7. Your Rights (GDPR / CCPA)

You have the right to:
- **Access:** View all your data via Settings → Export My Data
- **Portability:** Download your data in JSON format (GDPR Article 20)
- **Deletion:** Delete your account and all data (GDPR Article 17) — 24-hour grace period
- **Correction:** Update your profile information at any time
- **Withdrawal:** Withdraw consent at any time via Settings → Consent
- **Object:** Object to data processing by contacting privacy@relio.app

## 8. Children's Privacy

Relio is not intended for anyone under 18 years old. We verify age at registration. If we discover that a user is under 18, we will immediately delete their account and all associated data.

## 9. Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| Tier 1 messages | 90 days (auto-purged) |
| Tier 3 shared messages | Until account deletion |
| Consent records | 7 years (legal requirement) |
| Safety audit logs | 7 years (legal requirement) |
| Account data | Until account deletion |

## 10. International Transfers

Your data is processed in Azure Sweden Central (EU). If you are outside the EU, your data is transferred under Standard Contractual Clauses (SCCs) approved by the European Commission.

## 11. Push Notifications

Push notifications are privacy-safe: they NEVER include message content, Tier 1 data, or personal information. Notifications only contain generic alerts like "You have a new message" or "Your partner has joined."

## 12. Changes to This Policy

We will notify you of material changes via in-app notification and require re-acceptance before you can continue using the Service.

## 13. Contact

**Data Protection Officer:** privacy@relio.app  
**General inquiries:** legal@relio.app

---

*Relio, Inc. — Delaware C-Corp*
