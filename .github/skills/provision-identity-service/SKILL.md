---
name: provision-identity-service
description: Provisions and configures Azure AD B2C tenant with social identity providers, custom policies, and EU data residency for Relio authentication.
agents: [cloud-architect, chief-info-security-officer]
---
# Skill: Provision Identity Service (Azure AD B2C)

You provision and configure the complete identity infrastructure for Relio.

## Step 1: Azure AD B2C Tenant
- Create B2C tenant in EU region (associated with Sweden Central subscription)
- Configure tenant name: `relio.onmicrosoft.com`
- Enable custom domain if available
- Set password complexity policy (12+ chars, uppercase, lowercase, number, special)
- Configure token lifetimes: access token 60min, refresh token 14 days rolling

## Step 2: Social Identity Providers
- **Apple Sign In**: Register Relio in Apple Developer Portal, configure Services ID, generate client secret (JWT signed with Apple key). Add as B2C social IdP. Claims: email, name.
- **Google Sign In**: Register OAuth 2.0 client in Google Cloud Console. Add as B2C social IdP. Claims: email, name, picture.
- Both IdPs must return email claim (required for account linking)

## Step 3: Custom User Flows (B2C Policies)
Create custom policy `B2C_1A_SignUpSignIn` that handles:
- Combined signup + signin in one flow
- Social IdP federation (Apple + Google)
- Email magic link (OTP) as local account fallback
- Age verification step (collect DOB, enforce 18+)
- Custom HTML templates matching Relio design system (earth tones)
- Return claims: sub, email, displayName, idp (identity provider used)

## Step 4: Application Registration
- Register Relio Mobile App as B2C application
- Configure redirect URIs for Expo auth session callback
- Enable PKCE flow (public client, no client secret on mobile)
- Configure API permissions (openid, offline_access, profile, email)
- Generate JWKS endpoint URL for backend validation

## Step 5: Security Configuration
- Enable MFA roadmap (optional for v1, configurable for premium)
- Configure account lockout: 5 failed attempts → 30min lockout
- Enable audit logging for all auth events
- IP-based risk detection (block burst from single IP)
- NEVER allow implicit grant flow (PKCE only)

## Constraints
- Tenant MUST be in EU region for GDPR compliance
- NEVER use client credentials grant from mobile app
- NEVER store B2C admin credentials in code or environment variables
- Use managed identity for backend-to-B2C communication
- All custom policy XML must be version-controlled in the repo
