---
name: build-invite-system
description: Builds the complete partner invitation system — invite creation, QR codes, deep links, acceptance flow, and couple formation for Relio's solo-first onboarding.
agents: [native-mobile-developer, backend-developer, ui-ux-expert]
---
# Skill: Build Invite System (Partner Linking)

You build the complete couple formation system from solo signup through partner invitation to couple activation.

## Step 1: InvitePartnerScreen
Mobile screen with three invitation channels:
- **6-char code**: Display in large format with hyphen (e.g., `RLO-K7M`). Copy-to-clipboard button.
- **QR code**: Fetched from server (`GET /api/v1/qr/:code`). Scannable by partner.
- **Deep link**: Share via native share sheet (`https://myrelio.io/invite/{code}`).
- Show invite status: "Waiting for partner..." with countdown to expiry (7 days)
- Re-invite button (generates new code, invalidates old one)
- Rate limit: max 3 invites per 30-day window

## Step 2: AcceptInviteScreen
Screen for Partner B accepting an invitation:
- Auto-opened via deep link or manual code entry
- Shows Partner A's first name only (no full profile)
- Accept / Decline buttons
- On accept: celebration animation → couple formed → navigate to SharedChatScreen
- On decline: silent — Partner A is NOT notified (prevents coercive pressure)
- If invite expired: generic "This link has expired" message (no information leak about Partner A)
- If invite already used: generic "This link is no longer valid"

## Step 3: Backend Invite API
Three endpoints:
- `POST /api/v1/invite/create` — Generate invite code + deep link + QR URL. Rate limit: 3/30d per user. Returns `{ code, deepLink, qrUrl, expiresAt }`.
- `POST /api/v1/invite/accept` — Accept invite by code. Validate: exists, not expired, acceptor != creator. Create couple + shared room. Return `{ roomId, partnerId, status: 'coupled' }`.
- `GET /api/v1/invite/status` — Check current invite status for authenticated user. Returns `{ hasActiveInvite, inviteCode, expiresAt, partnerJoined }`.

Invite code generation:
```typescript
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // excludes 0/O/1/I/L
function generateInviteCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes).map(b => CHARSET[b % CHARSET.length]).join('');
}
```

## Step 4: Deep Link Configuration
Configure for both platforms:
- iOS: Associated Domains (`applinks:myrelio.io`) in `app.json`
- Android: Intent filters for `https://myrelio.io/invite/*`
- Expo linking: `scheme: "relio"` + universal link handlers
- Handle: app installed → deep link to AcceptInviteScreen; app not installed → redirect to App Store/Play Store

## Step 5: Couple State Machine
```
SOLO → INVITE_PENDING → COUPLED → [UNCOUPLED → SOLO]

Transitions:
- SOLO → INVITE_PENDING: User creates invite (POST /invite/create)
- INVITE_PENDING → COUPLED: Partner accepts (POST /invite/accept)
- INVITE_PENDING → SOLO: Invite expires after 7 days
- COUPLED → UNCOUPLED: One partner leaves or deletes account
- UNCOUPLED → SOLO: Uncouple confirmed
```

## Step 6: Push Notification on Accept
When Partner B accepts:
- Send push to Partner A: "Your partner joined Relio! Start your first session together."
- Navigate Partner A to SharedChatScreen on tap
- Use `expo-notifications` or Azure Notification Hubs

## Constraints
- NEVER reveal Partner A's full profile to Partner B during invitation
- NEVER notify Partner A if Partner B declines (prevents coercive pressure)
- NEVER allow self-invitation (acceptor == creator check)
- NEVER reuse expired invite codes (generate new ones)
- Invite codes must be cryptographically random (use `crypto.getRandomValues`)
- Rate limit: max 3 invites per 30-day window per user
- Max 1 active invite at a time per user
