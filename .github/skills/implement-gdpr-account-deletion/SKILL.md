---
name: implement-gdpr-account-deletion
description: Implements GDPR Article 17 Right to Erasure with 24h grace period, cascade purge across all tiers, and data export (Article 20 Right to Portability).
agents: [backend-developer, chief-info-security-officer, data-protection-officer]
---
# Skill: Implement GDPR Account Deletion

You implement the complete GDPR-compliant account deletion flow with grace period and cascade purge.

## Step 1: Account Router (`backend/src/server/account-router.ts`)
- POST `/delete` — Request deletion (requires `confirmPhrase: "DELETE MY ACCOUNT"`)
- POST `/delete/cancel` — Cancel within 24h grace window
- GET `/delete/status` — Check pending deletion status (remaining hours)
- GET `/export` — Data export as JSON with Content-Disposition header

## Step 2: Deletion Schema (`backend/src/db/schema-deletion.sql`)
- `deletion_requests` table: user_id, reason, scheduled_purge_at, cancelled_at, purged_at
- `purge_user_data(target_user_id)` function: cascade DELETE across all tiers
- Cascade order: tier1_messages → journal_entries → safety_audit_log → consent_audit → consent_records → refresh_tokens → users

## Step 3: Grace Period Enforcement
- 24-hour window before irreversible purge
- Background processor runs every hour via `setInterval` (production: pg_cron or Azure Function)
- Once purged: revoke Clerk user via API, clear Redis session cache

## Step 4: Data Export (GDPR Article 20)
- Collect all user data: Tier 1 private, Tier 3 shared, consent records
- Return as `relio-export-v1` JSON with `Content-Disposition: attachment` header
- Never include other users' data in export

## Constraints
- Auth middleware required on all endpoints
- Auth rate limiting: 5 req/15min (prevent abuse)
- Zod validation on all inputs
- Deletion queue is idempotent (409 if already scheduled)
