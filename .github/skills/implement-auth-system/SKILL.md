---
name: implement-auth-system
description: Implements Azure AD B2C authentication with JWT validation, token management, and couple-linking API for the Relio backend.
agents: [backend-developer, chief-technology-officer]
---
# Skill: Implement Auth System (Azure AD B2C + JWT + Couple Linking)

You implement the complete authentication and authorization layer for Relio's backend.

## Step 1: JWT Validation Middleware
Use the `jose` library with Azure AD B2C JWKS endpoint for production token validation.
- Fetch JWKS from `https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/discovery/v2.0/keys`
- Cache JWKS with 1-hour TTL (use `createRemoteJWKSet`)
- Validate: issuer, audience, expiry, RS256 signature
- Extract claims: `sub` (userId), `email`, `displayName`, custom claims
- Apply middleware to ALL `/api/v1/*` routes
- Return 401 with `{ error: 'token_expired' | 'token_invalid' | 'token_missing' }`

## Step 2: WebSocket Authentication
- Token passed via query parameter on connection upgrade: `wss://host/ws?token={jwt}`
- Validate token before accepting upgrade (reject with 401 if invalid)
- Store authenticated userId in socket context
- Heartbeat every 30s re-validates session
- On token expiry mid-session: send `{ type: 'auth_expired' }` and close connection
- Client must reconnect with refreshed token

## Step 3: Couple Linking API
Implement the invitation system for forming couples:
- `POST /api/v1/invites` — Generate 6-char invite code (charset: `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, excludes ambiguous 0/O/1/I/L). Returns code, deepLink, qrCodeUrl, expiresAt (7 days).
- `POST /api/v1/invites/accept` — Accept invite by code. Validate: code exists, not expired, acceptor != creator. Create couple record + shared room. Transition both users to `coupled` status.
- `GET /api/v1/invites/validate/:code` — Check if code is valid (exists + not expired + not used).
- Rate limit: Max 3 invites per 30-day window per user. Max 1 active invite at a time.

## Step 4: Consent API
- `POST /api/v1/consent` — Record consent grant. Immutable insert into `consent_audit` table. Required fields: consentType, version, granted (boolean). Auto-capture: timestamp, IP (from X-Forwarded-For), device info (from User-Agent).
- `GET /api/v1/consent` — Return user's consent records (own records only, RLS-enforced).
- Consent types: `not_therapy`, `privacy_model`, `ai_processing`, `terms_of_service`, `privacy_policy`, `age_verification`

## Constraints
- NEVER disable auth in production (no `AUTH_DISABLED` flag)
- NEVER store tokens in plain-text logs
- NEVER return user B's identity details to user A (opaque partnerId only)
- All invite codes must be cryptographically random (use `crypto.getRandomValues`)
- Refresh tokens use rotation: old token invalidated on each use
