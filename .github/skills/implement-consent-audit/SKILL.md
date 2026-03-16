---
name: implement-consent-audit
description: Implements the consent audit trail with immutable records, GDPR-compliant data export, and account deletion cascade for Relio.
agents: [data-privacy-officer, backend-developer]
---
# Skill: Implement Consent Audit Trail

You implement the technical consent tracking, data export, and account deletion systems.

## Step 1: consent_audit Table
Create PostgreSQL table with the following schema:
```sql
CREATE TABLE consent_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  consent_type VARCHAR(50) NOT NULL,
  version VARCHAR(20) NOT NULL,
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  device_info TEXT,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at TIMESTAMPTZ
);
```
- Table is INSERT-ONLY: no UPDATE or DELETE permissions for application role
- Row Level Security: users can only SELECT their own records
- Index on (user_id, consent_type, version) for fast lookups
- consent_type enum: not_therapy, privacy_model, ai_processing, terms_of_service, privacy_policy, age_verification

## Step 2: Consent Version Tracking
- Each consent text version is tracked via semver (e.g., "1.0.0")
- When ToS/Privacy Policy text changes, increment version
- On user login, compare their latest consent record version against current version
- If mismatch: force re-consent flow before allowing app access
- Store current versions in environment config (not hardcoded)

## Step 3: Account Deletion (GDPR Art. 17)
Implement DELETE /api/v1/account:
- Require confirmation body: `{ confirmation: "DELETE MY ACCOUNT" }`
- Start 24-hour grace period (user can cancel via POST /api/v1/account/cancel-deletion)
- After grace period, cascade delete ALL user data:
  1. Tier 1 messages (PostgreSQL relio_tier1_private)
  2. Tier 2 clinical profiles (Cosmos DB attachment_profiles, relationship_dynamics, agent_observations)
  3. Consent audit records (mark as anonymized, keep for legal compliance with user_id nullified)
  4. Quiz results, progress data
  5. Uncouple from partner (partner's data preserved, but couple dissolved)
  6. Revoke all B2C tokens
  7. Delete B2C user object
- Return success with deletion scheduled timestamp

## Step 4: Data Export (GDPR Art. 20)
Implement POST /api/v1/account/export:
- Trigger async job to collect all user data
- Generate ZIP containing: messages.json, profile.json, consent_records.json, quiz_results.json
- Upload ZIP to Azure Blob Storage with 48-hour SAS link
- Send download link via email
- Log export event in consent_audit

## Constraints
- NEVER actually delete consent_audit records (anonymize user_id, keep for legal defensibility)
- NEVER allow UPDATE on consent_audit rows (append-only)
- NEVER expose other users' data in export (only requester's own data)
- NEVER skip the 24h grace period for deletion
- All deletion operations must be idempotent (safe to retry)
