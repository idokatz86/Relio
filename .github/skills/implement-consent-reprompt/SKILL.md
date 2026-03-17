---
name: implement-consent-reprompt
description: Detects ToS/Privacy Policy version changes and re-prompts users for consent acceptance, with distinct audit trail entries for initial vs re-acceptance.
agents: [backend-developer, data-protection-officer, chief-info-security-officer]
---
# Skill: Implement Consent Re-prompt

You implement consent version change detection and re-prompt flow.

## Step 1: Version Tracking in Consent Router
- `CURRENT_TOS_VERSION` and `CURRENT_PRIVACY_VERSION` constants
- `GET /consent/status` returns `requiresUpdate: true` when user's accepted version !== current
- `tosUpToDate` and `privacyUpToDate` boolean fields in status response

## Step 2: Re-acceptance Audit Trail
- Detect re-acceptance: compare existing record version with new version
- Log `re_accept_tos` (not `accept_tos`) for version upgrades
- Log `re_accept_privacy` (not `accept_privacy`) for version upgrades
- First-time acceptance uses `accept_tos` / `accept_privacy`

## Step 3: Mobile Consent Gate
- On app launch, check `/api/v1/consent/status`
- If `requiresUpdate === true`, show ConsentScreen with updated terms
- Block all other navigation until re-consent granted
- Show "Terms updated" banner explaining what changed

## Step 4: Admin Visibility
- `GET /consent/audit` returns audit log with action types
- Filter by `re_accept_*` to track re-consent compliance rate

## Constraints
- Users cannot use the app without current consent (hard gate)
- Audit log is append-only (immutable)
- IP address and user-agent captured for legal compliance
