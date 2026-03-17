---
name: harden-auth-owasp
description: Implements OWASP Authentication Checklist hardening including auth rate limiting, JWT structure validation, generic error messages, and timing-safe token rejection.
agents: [chief-info-security-officer, backend-developer, penetration-tester]
---
# Skill: Harden Auth (OWASP Checklist)

You harden the authentication system against OWASP Top 10 authentication vulnerabilities.

## Step 1: Auth Rate Limiting
- Create a stricter `authRateLimit` middleware: 5 requests per 15 minutes
- Apply to: consent routes (`/api/v1/consent`), account routes (`/api/v1/account`)
- Key generator: `${req.ip}-${user.id}` (prevents distributed brute force)
- Use `express-rate-limit` with `standardHeaders: true`

## Step 2: JWT Structure Validation
- Before JWKS verification, reject tokens with `split('.').length !== 3`
- Catches malformed tokens early without hitting JWKS endpoint

## Step 3: Generic Error Messages
- All auth failures return identical `{ error: "Invalid or expired token" }`
- Never reveal whether token was expired vs invalid vs malformed
- Never include internal error details in 401/403 responses

## Step 4: OWASP Checklist Coverage
- ✅ JWKS validation (no local secrets for JWT signing)
- ✅ Token expiry enforced by `jose` library
- ✅ Audience/issuer validation via env vars
- ✅ Constant-time comparison (jose library handles internally)
- ✅ Token sent via Authorization header only (not URL for REST)
- ✅ CORS restricted to allowed origins
- ✅ Rate limiting on auth-adjacent endpoints
- ✅ Helmet security headers

## Constraints
- Never bypass rate limiting in production (AUTH_DISABLED=true only in dev)
- Rate limit state must survive server restarts in production (use Redis store)
