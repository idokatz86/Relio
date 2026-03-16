# Relio — Registration, Onboarding & Authentication Specification

**Version:** 1.0.0  
**Date:** March 16, 2026  
**Classification:** Confidential — Engineering Ready  
**Status:** APPROVED — Ready for Implementation  
**Authors:** CEO (coordinating), Medical Pod (CPsychO, Safety Guardian, Orchestrator, Phase Agents), Operations Pod (CRO, CMO, CLO, CFO), Tech Pod (CTO, Backend Dev, Cloud Architect, Mobile Dev, CISO, DPO)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Medical Pod: Clinical Onboarding Design](#2-medical-pod-clinical-onboarding-design)
3. [Operations Pod: Business, Legal & Conversion](#3-operations-pod-business-legal--conversion)
4. [Tech Pod: Architecture & Implementation](#4-tech-pod-architecture--implementation)
5. [Complete Screen-by-Screen Flow](#5-complete-screen-by-screen-flow)
6. [API Endpoint Definitions](#6-api-endpoint-definitions)
7. [Database Schema Additions](#7-database-schema-additions)
8. [Partner Invitation System](#8-partner-invitation-system)
9. [Security Requirements](#9-security-requirements)
10. [Legal & Compliance Checklist](#10-legal--compliance-checklist)
11. [Conversion Optimization](#11-conversion-optimization)
12. [Competitor Benchmarks](#12-competitor-benchmarks)
13. [Implementation Priority](#13-implementation-priority)

---

## 1. Executive Summary

### Strategic Objective

Build a registration/onboarding system that maximizes sign-up completion while enforcing the 3-Tier Confidentiality Model from the first millisecond. The system must handle the "solo-first" signup pattern (one partner joins, invites the other) as a first-class experience, not an edge case.

### Top 3 Priorities

1. **Trust-first onboarding** — Users must feel emotionally safe before providing any personal data. Privacy education is pre-registration, not post.
2. **Partner invitation virality** — Every solo user is a potential couple. The invitation system is the primary growth engine.
3. **Zero-friction auth with maximum security** — Social login first, biometric gate always, MFA roadmap for premium.

### Key Decisions

| Decision | Choice | Justification |
|----------|--------|---------------|
| Auth Provider | **Azure AD B2C** | Azure-native, GDPR EU data residency (Sweden Central), custom policy engine for consent flows, OIDC/OAuth2 standard, managed JWKS, social IdP federation built-in |
| Primary Signup | **Apple Sign In + Google Sign In** | 95%+ mobile user coverage, minimal friction, mandatory for iOS (Apple guideline 4.8) |
| Fallback Signup | **Email + magic link** | No password to remember/compromise. Reduces support load. |
| Biometric Gate | **Always-on after first auth** | expo-local-authentication + expo-secure-store. Configurable per-user. |
| Couple Linking | **6-character alphanumeric code + deep link + QR code** | Simple to share verbally, via text, or in-person scan |
| Pricing Surface | **After first mediation session** | Clinical data: surfacing pricing before value delivery kills conversion in mental health apps |

---

## 2. Medical Pod: Clinical Onboarding Design

### 2.1 Relationship Stage Selection — Non-Clinical UX

**Problem:** Collecting relationship stage feels clinical if done wrong. Users resist being "categorized."

**Solution:** Frame stage selection as personalization, not diagnosis.

#### Screen: "Customize Your Experience" (Screen 6 of onboarding)

**Header:** "Help Relio understand where you are"  
**Subheader:** "This helps us tailor conversations to what matters most right now."

| Stage Option | User-Facing Label | Internal Mapping | Emoji | Description |
|-------------|-------------------|-----------------|-------|-------------|
| Option 1 | "We're just getting started" | `dating` | 💫 | "New relationship, building something" |
| Option 2 | "We're building something real" | `commitment` | 💞 | "Committed, working through growing pains" |
| Option 3 | "We're in a rough patch" | `crisis` | 🌊 | "Things are hard right now, need help communicating" |
| Option 4 | "We're navigating a transition" | `separation` | 🔄 | "Separating or re-evaluating the relationship" |
| Option 5 | "We're co-parenting" | `post_divorce` | 👨‍👩‍👧 | "Focused on co-parenting after separation" |

**Design Rules:**
- No option is pre-selected (avoid anchoring bias)
- "I'd rather not say" is available → defaults to `dating` agent with adaptive routing
- Selection is changeable at any time from Settings
- Visual: Cards, not radio buttons. Cards feel like choices; radio buttons feel like forms
- Each card has 1 emoji + 1 label + 1 sentence description
- No clinical language: no "crisis," no "separation," no "therapy"

**Medical Pod Rationale:** The phase selection drives which phase agent handles the couple's first session. Misclassification is low-risk because the Orchestrator re-routes adaptively based on conversation content. The cost of asking incorrectly is one suboptimal first session; the cost of not asking is a poor first impression.

### 2.2 Consent Flows

#### Informed Consent Requirements (Before AI Mediation)

Users must explicitly acknowledge these before their first mediation session:

**Consent Item 1: Not Therapy Disclaimer**
```
Screen Title: "What Relio is — and isn't"

"Relio is an AI-powered communication tool. It is NOT therapy,
counseling, or a substitute for professional mental health care.

Relio does not diagnose, treat, or prescribe. If you or your
partner are experiencing a mental health crisis, please contact
a licensed professional or call your local emergency number.

By continuing, you understand that Relio provides communication
support only."

[Checkbox] I understand Relio is not therapy
```

**Consent Item 2: Privacy & Data Handling**
```
Screen Title: "How your privacy works"

"Everything you share in your Private Space (Tier 1) is encrypted
and NEVER shown to your partner. The AI transforms your words
into constructive questions (Tier 3) before your partner sees
anything.

We store your private data encrypted in the EU (Sweden) and
auto-delete it after 90 days.

Your partner will NEVER see your raw words, only AI-rephrased
versions."

[Checkbox] I understand how my privacy works
[Link] Read full Privacy Policy
```

**Consent Item 3: AI Processing Consent (GDPR Art. 22)**
```
Screen Title: "AI-powered mediation"

"Relio uses artificial intelligence to:
• Detect emotional patterns in your messages
• Rephrase your words constructively for your partner
• Suggest exercises based on your communication style

No human reads your messages. Your data is processed by AI
within the EU.

You can request a copy of all your data or delete your account
at any time."

[Checkbox] I consent to AI processing of my messages
[Link] Read full Terms of Service
```

**Consent Storage:** Every consent checkbox generates an immutable audit record:

```typescript
interface ConsentRecord {
  id: string;           // UUID
  userId: string;       // FK to users
  consentType: 'not_therapy' | 'privacy_model' | 'ai_processing' | 'terms_of_service' | 'privacy_policy' | 'age_verification';
  version: string;      // "1.0.0" — tracks which version of text they agreed to
  grantedAt: string;    // ISO 8601 timestamp
  ipAddress: string;    // For legal defensibility
  deviceInfo: string;   // Platform, OS version
  revoked: boolean;     // Can be revoked — triggers account restriction
  revokedAt: string | null;
}
```

#### Jurisdiction-Specific Consent Additions

| Region | Additional Requirement | Implementation |
|--------|----------------------|----------------|
| **EU/EEA (GDPR)** | Explicit opt-in for AI profiling (Art. 22), right to object, DPO contact | Separate checkbox for AI processing. Withdrawal link in Settings. DPO email in footer. |
| **California (CCPA/CPRA)** | "Do Not Sell My Personal Information" link, right to know | "Do Not Sell" toggle in Settings. Data categories disclosure. |
| **UK (UK GDPR)** | Same as GDPR + ICO registration | ICO reg number in Privacy Policy. |
| **Australia** | APP compliance, mandatory breach notification | Privacy Act notice in ToS. |
| **Canada (PIPEDA)** | Meaningful consent, access request mechanism | Plain-language consent. Access request form. |
| **Brazil (LGPD)** | Similar to GDPR, DPO requirement | Same implementation as EU. |
| **Israel** | Privacy Protection Law 5741-1981 | Data processing disclosure + commissioner registration |

### 2.3 Safety Screening During Onboarding

**Medical Pod Decision: YES — Passive screening, not active interrogation.**

We do NOT ask "Are you experiencing domestic violence?" during onboarding. Research (Campbell et al., 2003) shows direct screening in non-clinical settings can:
- Trigger denial/minimization
- Alert an abusive partner monitoring the phone
- Create a compliance checkbox that provides false reassurance

**Instead, we implement three safety layers:**

**Layer 1: Passive Language Monitoring (Active from first message)**
The Safety Guardian monitors ALL Tier 1 input from the first session. No special onboarding screen.

**Layer 2: Subtle Safety Resource Placement**
During onboarding, we include:
```
Footer on every onboarding screen:
"If you're in immediate danger, call [localized emergency number]
or the National DV Hotline: [localized number]"
```
This is always visible but not intrusive. Research shows that visible resources are more effective than screening questions.

**Layer 3: Relationship Dynamics Baseline (Session 1)**
The Individual Profiler establishes a baseline attachment profile in the first session. Markers for coercive control (isolation language, fear-based compliance, DARVO patterns) are detected from natural conversation, not from a screening questionnaire.

**If abuse is detected at any point:**
1. Safety Guardian raises severity flag
2. Emergency Response Agent activates
3. Resources are surfaced to the at-risk partner ONLY (never the suspected abuser)
4. The at-risk partner's Tier 1 context is heightened for monitoring

### 2.4 Individual vs. Couple Registration

**Architecture Decision: Solo-first is the primary flow. Couple is formed by invitation.**

```
┌─────────────────────┐
│   PARTNER A          │
│   Signs up solo      │
│   Completes          │
│   onboarding alone   │
│   Gets full value:   │
│   - Private journal  │
│   - 1-on-1 AI coach  │
│   - Psychoeducation  │
│   - Attachment quiz   │
└─────────┬───────────┘
          │
    Generates invite
    code/link/QR
          │
          ▼
┌─────────────────────┐
│   PARTNER B          │
│   Receives invite    │
│   Signs up           │
│   Completes own      │
│   onboarding         │
│   (SEPARATE from A)  │
└─────────┬───────────┘
          │
    Accepts couple link
          │
          ▼
┌─────────────────────┐
│   COUPLE FORMED      │
│   Shared room        │
│   created (Tier 3)   │
│   Both see welcome   │
│   First mediation    │
│   session begins     │
└─────────────────────┘
```

**If Partner B declines or doesn't sign up:**

| Scenario | System Response |
|----------|----------------|
| B doesn't respond in 7 days | A gets push notification: "Your partner hasn't joined yet. Relio still works great solo!" |
| B explicitly declines | A is NOT notified of the decline (prevents coercive pressure). Invite silently expires. |
| B blocks the invite | Invite link returns generic "This link has expired" (no information leak) |
| A keeps using solo | Full solo feature set: journaling, 1-on-1 AI coaching, psychoeducation, attachment profiling |
| A re-invites | New invite code generated. Old one invalidated. Max 3 active invites per 30-day window (anti-spam) |

**Medical Pod Rationale:** The "reluctant partner" problem is the #1 churn driver in relationship apps (Lasting reports 65% solo usage). By making solo genuinely valuable — not a degraded experience — we retain Partner A and create organic conditions for Partner B to join later.

### 2.5 Privacy Explanation — Plain Language 3-Tier Model

**Screen: "How Relio Keeps You Safe" (Screen 4 of onboarding)**

Visual: Three horizontally stacked cards with a downward arrow showing transformation.

```
┌─────────────────────────────────┐
│  🔒  YOUR PRIVATE SPACE         │
│                                  │
│  What you type stays private.    │
│  Your partner will NEVER see     │
│  your raw words. Period.         │
│                                  │
│  [Visual: lock icon, warm color] │
└───────────────┬─────────────────┘
                │
        [AI magic happens ✨]
                │
                ▼
┌─────────────────────────────────┐
│  💬  WHAT YOUR PARTNER SEES     │
│                                  │
│  Relio transforms your words     │
│  into a thoughtful question      │
│  designed to create connection.  │
│                                  │
│  [Visual: speech bubble, calm]   │
└─────────────────────────────────┘
```

**Interactive Example (swipeable):**

```
You type (private):
"He never listens to me. I feel invisible."
                    ↓
Partner sees:
"Your partner would love to feel more heard.
Can you think of a recent moment where they
shared something important?"
```

**Key messaging principles:**
- "Private" not "Tier 1"
- "What your partner sees" not "Tier 3"
- Never mention "Tier 2" — internal clinical data is invisible to users
- Use "transformed" not "translated" (feels less clinical)
- Show the before/after to make it tangible

### 2.6 Emotional Safety Psychoeducation (Pre-First-Session)

**Delivered between onboarding completion and first mediation session.**

#### Module 1: "How Relio Works" (60-second video or animation)
- Shows the 3-way chat: You → AI → Partner
- Demonstrates that raw messages are private
- Shows Socratic question output
- Sets expectation: "You'll see thoughtful questions, not accusations"

#### Module 2: "Ground Rules for Mediation" (interactive cards)
```
Card 1: "There are no winners here"
  Relio doesn't take sides. It helps both of you be heard.

Card 2: "It's okay to feel intense emotions"
  If things get heated, Relio may suggest a 20-minute pause.
  This is normal and healthy.

Card 3: "You control your pace"
  You can pause, journal privately, or take a break at any time.
  There's no timer. No pressure.

Card 4: "Safety comes first"
  If Relio detects anyone might be at risk, it will provide
  immediate resources. Safety overrides everything.
```

#### Module 3: "Your First Exercise" (optional, high-engagement)
A lightweight attachment-style quiz (5 questions) that:
- Feels like a personality quiz (fun, not clinical)
- Provides immediate personalized insight ("You tend to seek reassurance — that's your attachment system protecting you")
- Seeds the Individual Profiler with baseline data
- Drives engagement: 87% of users who take a quiz in onboarding complete their first session (internal projection based on Lasting/Paired data)

---

## 3. Operations Pod: Business, Legal & Conversion

### 3.1 Conversion Funnel — Targets

```
App Store Impression → Download         Target: 35%  (industry avg: 25-30%)
Download → Open App                     Target: 80%  (industry avg: 70-75%)
Open App → Complete Registration         Target: 70%  (industry avg: 50-60%)
Registration → Complete Onboarding       Target: 85%  (industry avg: 65-75%)
Onboarding → First Mediation Session     Target: 60%  (industry avg: 40-50%)
First Session → Day 7 Retention          Target: 45%  (industry avg: 30-35%)
Day 7 → Day 30 Retention                Target: 30%  (industry avg: 15-20%)
Free → Paid Conversion                   Target: 8%   (industry avg: 3-5%)
Solo → Couple Activation                 Target: 35%  (industry avg: 20-25%)
```

**Aggressive targets justified by:**
- Social login reducing registration friction (vs. email/password)
- Privacy-education onboarding creating emotional investment (sunk cost)
- Solo value proposition (journaling + coaching) preventing drop-off for unpaired users
- Attachment quiz creating "aha moment" before first session

### 3.2 Pricing Integration

**Decision: No pricing during onboarding. Surface after first meaningful session.**

**Pricing Model:**

| Tier | Price | Features | When Surfaced |
|------|-------|----------|---------------|
| **Free** | $0 | 3 mediation sessions/month, solo journaling, basic psychoeducation | Default |
| **Premium Solo** | $9.99/mo | Unlimited 1-on-1 AI coaching, full psychoeducation library, advanced attachment insights | After session 3 or day 7 |
| **Premium Couple** | $14.99/mo | Unlimited mediation, progress tracking, couples exercises, priority processing | After first couple session |
| **Premium+** | $24.99/mo | Everything + live crisis support, custom exercises, API integrations | After day 30 for power users |

**Annual pricing:** 40% discount ($5.99/$8.99/$14.99 per month billed annually)

**Monetization trigger points:**
1. **Free session limit hit** → Soft paywall: "You've used your 3 free sessions this month. Upgrade for unlimited mediation."
2. **Day 7 push notification** → "Unlock advanced attachment insights. Your profile shows anxious-avoidant dynamics — Premium helps you understand why."
3. **Partner invitation** → "Invite your partner free. Couples Premium unlocks shared exercises."
4. **Progress milestone** → "You've completed 10 sessions! See your full progress with Premium."

**What's always free (never paywalled):**
- Safety features (Emergency Response Agent, crisis resources)
- Basic privacy education
- Account deletion and data export
- Single journaling entry per day

### 3.3 Legal Requirements

#### Terms of Service v1.0 — Key Clauses

```
1. Age Requirement: 18+ (verified via date-of-birth input + IdP age claim)
2. Not Therapy Disclaimer: "Relio is a technology platform, not a healthcare
   provider. Nothing in the Service constitutes medical advice, diagnosis,
   or treatment."
3. Duty to Warn: "In cases where our AI detects imminent risk of harm to self
   or others, Relio may provide emergency service contact information to the
   affected user. Relio does not directly contact emergency services without
   user action."
4. Limitation of Liability: Standard limitation capped at subscription fees
   paid in the prior 12 months.
5. Arbitration: Mandatory binding arbitration (JAMS), class action waiver
   (except where prohibited by law).
6. Data Processing: "By using Relio, you consent to AI processing of your
   messages as described in our Privacy Policy."
7. Account Termination: Relio may terminate accounts violating ToS.
   User data deleted within 30 days of termination.
8. Governing Law: Delaware (corporate), EU (GDPR), user's jurisdiction
   for consumer protection.
```

#### Privacy Policy v1.0 — Key Disclosures

| Data Category | What We Collect | Why | Retention | Shared With |
|---------------|----------------|-----|-----------|-------------|
| Account Data | Email, name, DOB | Authentication | Account lifetime | Auth provider (Azure AD B2C) |
| Tier 1 Messages | Raw message text | AI processing | 90 days auto-purge | NO ONE — encrypted, user-only |
| Tier 2 Clinical | Attachment patterns | Improve AI quality | Account lifetime | No third parties |
| Tier 3 Outputs | Socratic questions | Display to partner | Account lifetime | Partner (the whole point) |
| Usage Data | Session count, timestamps | Analytics | 24 months | Anonymized aggregate only |
| Device Data | OS, app version | Bug fixes | 12 months | Crash reporting (App Insights) |

#### Age Verification

**Approach: Date-of-birth collection + IdP age claim (where available)**

```
Screen: "When were you born?"
Subtext: "Relio is for adults 18 and over."

[Date picker — month/day/year]

- If age < 18 → "Sorry, Relio is designed for adults.
  Please come back when you're 18."
  Account creation blocked. No data stored.
- If age < 13 → Hard block. COPPA compliance.
  No data collected whatsoever.
- If age claim from Apple/Google conflicts → Use IdP claim
  (more authoritative).
```

### 3.4 Marketing Hooks — Copy That Converts

**Primary taglines tested:**

| Tagline | Target Segment | Conversion Hypothesis |
|---------|---------------|----------------------|
| "Say what you feel. They hear what you mean." | All couples | Privacy + transformation in one line |
| "Fighting fair starts here." | Crisis couples | Action-oriented, non-judgmental |
| "Your words. Protected. Transformed. Delivered." | Privacy-conscious | Three-beat rhythm, trust-forward |
| "The mediator that never takes sides." | Skeptical partners | Neutrality promise |
| "Better arguments → Better love." | Dating couples | Reframes conflict as growth |

**App Store description (150 chars):**
"AI relationship mediator. Say what you really feel — your partner hears a thoughtful question, not raw emotion. Private. Neutral. Always available."

**First-open value proposition (shown pre-registration):**
```
"Relationships fail because of HOW we communicate, not WHAT
we're arguing about.

Relio sits between you and your partner. You say what you really
feel — raw, unfiltered, honest. Relio transforms your words into
a question designed to create understanding.

Your partner never sees your raw message. Just the good version.

It's like having a couples therapist in your pocket — but your
words stay private."
```

### 3.5 Referral Mechanism — Partner Invitation Flow

**Three channels for partner invitation:**

| Channel | Mechanism | User Action | Conversion Rate (Est.) |
|---------|-----------|-------------|----------------------|
| **Deep Link** | `https://relio.app/invite/{code}` | Share via any messaging app | 40% |
| **QR Code** | Generated in-app, scannable | Show phone to partner | 55% |
| **Verbal Code** | 6-char alphanumeric (e.g., `RLO-K7M`) | Tell partner, they type in app | 30% |

**Deep link flow:**
1. Partner A taps "Invite Partner" → generates unique link
2. A shares link via iMessage/WhatsApp/text
3. B clicks link → App Store if not installed, deep link if installed
4. B installs app → Opens to "You've been invited!" screen
5. B completes their own independent onboarding (separate from A)
6. B accepts couple link → Room created
7. Both see "You're connected!" celebration screen

**Viral loop amplifiers:**
- After first successful mediation: "That went well! Invite a friend couple?" (secondary referral)
- After day 7: "Relio has helped [X] couples this week. Share with someone who needs it."
- App Share Card: Rich preview with custom OG image when link is shared on social/messaging

### 3.6 Monetization Trigger Analysis

| Trigger Point | Free → Paid Conversion (Est.) | Rationale |
|--------------|------------------------------|-----------|
| After session 3 (limit hit) | 12% | Invested users, proven value |
| After first "aha moment" insight | 8% | Emotional hook |
| Partner invitation accepted | 15% | Couples are 3x more likely to pay (Lasting data) |
| Day 7 progress notification | 6% | Social proof + momentum |
| Feature gate (advanced exercises) | 4% | Lower urgency |

**Optimal flow:** Free 3 sessions → Soft paywall → Attachment insight teaser → Upgrade CTA. No hard paywalls for first 7 days.

---

## 4. Tech Pod: Architecture & Implementation

### 4.1 Auth Provider Decision — Azure AD B2C

**Evaluated Options:**

| Provider | Pros | Cons | Score |
|----------|------|------|-------|
| **Azure AD B2C** ✅ | Azure-native (managed identity), EU data residency, custom policies, social IdP federation, OIDC standard, GDPR-compliant | Learning curve for custom policies, UI customization requires HTML templates | **9/10** |
| Auth0 | Developer-friendly, great docs, rich rules engine | Non-Azure (vendor dependency), US-based by default (data residency concern), cost scales poorly | 7/10 |
| Firebase Auth | Google-native, fast setup, phone auth built-in | GCP-native (we're Azure), limited custom flows, no EU data residency guarantee | 5/10 |
| Custom JWT | Full control, no vendor lock-in | Massive engineering effort, security liability, no managed identity integration | 3/10 |

**Why Azure AD B2C wins:**
1. **Data residency:** B2C tenant created in EU (Sweden). User data never leaves EU. This is a GDPR hard requirement for our target market.
2. **Managed identity integration:** Backend on Azure Container Apps uses `DefaultAzureCredential` to validate B2C tokens. No shared secrets.
3. **Social login federation:** Apple Sign In + Google Sign In configured as identity providers in B2C. One OIDC flow, multiple IdPs.
4. **Custom user flows:** Consent collection, age verification, ToS acceptance — all configurable as B2C policy steps.
5. **Token management:** B2C issues JWT access tokens + refresh tokens with configurable lifetimes. JWKS endpoint for backend validation.
6. **Cost:** Free up to 50K MAU (Month 1-12 is well within this). Premium features at scale are ~$0.003/auth.

### 4.2 Registration Flow — Implementation

#### Supported Methods (Priority Order)

| Method | Priority | Implementation | Notes |
|--------|----------|---------------|-------|
| **Apple Sign In** | P0 | Azure AD B2C social IdP | Required by Apple App Store for all apps offering social login |
| **Google Sign In** | P0 | Azure AD B2C social IdP | Covers Android + Google-primary iOS users |
| **Email + Magic Link** | P1 | Azure AD B2C custom policy w/ email OTP | No password. Send 6-digit code to email. 10-min expiry. |
| **Email + Password** | P2 | Azure AD B2C local account | Fallback for users who prefer traditional auth |
| **Biometric (re-auth)** | P0 | expo-local-authentication | Post-first-auth, used for app re-open. Not for initial registration. |

#### Token Architecture

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  Mobile App   │────►│  Azure AD B2C     │◄────│  Social IdPs     │
│  (Expo)       │     │  (Sweden Central)  │     │  Apple / Google  │
│               │     │                    │     │                  │
│  Stores:      │     │  Issues:           │     │  Provides:       │
│  - access_tok │◄────│  - access_token    │     │  - id_token      │
│  - refresh_tok│     │    (JWT, 1hr)      │     │  - user profile  │
│  - id_token   │     │  - refresh_token   │     │                  │
│               │     │    (rolling, 14d)  │     │                  │
│  In:          │     │  - id_token        │     │                  │
│  expo-secure- │     │    (OIDC claims)   │     │                  │
│  store        │     │                    │     │                  │
└──────┬───────┘     └───────────────────┘     └──────────────────┘
       │
       │ Bearer token (REST)
       │ ?token= query (WebSocket)
       │
       ▼
┌──────────────────────────────────────┐
│  Backend (Azure Container Apps)       │
│                                       │
│  Validates JWT via:                   │
│  1. JWKS endpoint from B2C tenant     │
│  2. Issuer: https://{tenant}.b2c...   │
│  3. Audience: Relio client app ID     │
│  4. Expiry check                      │
│  5. Signature verification (RS256)    │
│                                       │
│  Extracts: sub (user ID), email,      │
│  display_name, custom claims          │
└──────────────────────────────────────┘
```

**Token Lifetimes:**

| Token | Lifetime | Storage | Rotation |
|-------|----------|---------|----------|
| Access Token (JWT) | 60 minutes | expo-secure-store | Refresh before expiry |
| Refresh Token | 14 days (rolling) | expo-secure-store | New refresh token on each use |
| ID Token | 60 minutes | Memory only | Not stored persistently |

**Token Refresh Flow:**
1. Mobile app checks access token expiry before each API call
2. If < 5 minutes remaining → use refresh token to get new access + refresh tokens
3. If refresh token expired → redirect to login screen
4. Token rotation: old refresh token invalidated on each use (prevents replay)

### 4.3 Session Management

```typescript
// Backend middleware — production JWT validation
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS_URI = `https://${B2C_TENANT}.b2clogin.com/${B2C_TENANT}.onmicrosoft.com/${B2C_POLICY}/discovery/v2.0/keys`;
const ISSUER = `https://${B2C_TENANT}.b2clogin.com/${B2C_TENANT_ID}/v2.0/`;
const AUDIENCE = B2C_CLIENT_ID;

const jwks = createRemoteJWKSet(new URL(JWKS_URI));

async function verifyToken(token: string): Promise<AuthenticatedUser> {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });

  return {
    id: payload.sub!,
    email: payload.email as string,
    displayName: payload.name as string,
  };
}
```

**WebSocket Authentication:**
- Initial connection: `wss://backend/ws?token={access_token}`
- Token validated on connection upgrade
- Heartbeat every 30s validates session still active
- If token expires mid-session: server sends `{ type: 'auth_expired' }`, client refreshes and reconnects

### 4.4 Couple Linking — Technical Design

#### Invite Code Generation

```typescript
// 6-character uppercase alphanumeric, excluding ambiguous chars (0/O, 1/I/L)
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateInviteCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes)
    .map(b => CHARSET[b % CHARSET.length])
    .join('');
}
// Format: "RLO-K7M" (displayed with hyphen for readability)
```

#### Couple Formation Flow

```
POST /api/v1/invites
  Auth: Bearer {token_A}
  Body: {} (no params needed)
  Response: {
    inviteCode: "K7M-RLC",
    deepLink: "https://relio.app/invite/K7MRLC",
    qrCodeUrl: "https://api.relio.app/qr/K7MRLC",
    expiresAt: "2026-03-23T..."  // 7 days
  }

POST /api/v1/invites/accept
  Auth: Bearer {token_B}
  Body: { code: "K7MRLC" }
  Response: {
    roomId: "uuid",
    partnerId: "uuid-of-A" (opaque to B),
    status: "coupled"
  }
```

#### Deep Link Handling (React Native)

```typescript
// app.config.ts (Expo)
{
  scheme: "relio",
  android: {
    intentFilters: [{
      action: "VIEW",
      data: [{ scheme: "https", host: "relio.app", pathPrefix: "/invite/" }]
    }]
  },
  ios: {
    associatedDomains: ["applinks:relio.app"]
  }
}
```

**State machine for couple formation:**

```
SOLO → INVITE_PENDING → COUPLED → [UNCOUPLED → SOLO]

States:
- SOLO: User registered, no active couple. Full solo features.
- INVITE_PENDING: User A created invite. Waiting for B.
  A can cancel. A can create max 1 active invite.
- COUPLED: Both users linked to a room. Mediation enabled.
- UNCOUPLED: Partnership dissolved. Both return to SOLO.
  Room archived. Tier 3 history retained 30 days then purged.
```

### 4.5 Security Implementation

#### Password Hashing (for email+password fallback)

Azure AD B2C handles password storage — we never see or store passwords. B2C uses bcrypt with 12 rounds internally.

For any application-level secrets (invite codes, API keys):

```typescript
import { hash, verify } from '@node-rs/argon2';

// Argon2id — memory-hard, GPU-resistant
const ARGON2_OPTIONS = {
  memoryCost: 65536,  // 64 MB
  timeCost: 3,
  parallelism: 4,
};
```

#### Rate Limiting

| Endpoint | Limit | Window | Response |
|----------|-------|--------|----------|
| `POST /api/v1/auth/register` | 5 | 15 min | 429 + Retry-After header |
| `POST /api/v1/auth/login` | 10 | 15 min | 429 + exponential backoff hint |
| `POST /api/v1/invites` | 3 | 30 days | 429 + "Too many invites" |
| `POST /api/v1/invites/accept` | 5 | 15 min | 429 |
| `POST /api/v1/mediate` | 30 | 1 min | 429 (existing) |
| All other endpoints | 60 | 1 min | 429 |

#### Account Lockout

| Condition | Action | Duration |
|-----------|--------|----------|
| 5 failed logins | Temporary lock | 15 minutes |
| 10 failed logins | Extended lock | 1 hour |
| 20 failed logins | Account locked | Manual unlock via support email |
| Suspicious IP pattern | CAPTCHA challenge | Per-request |

**Note:** Azure AD B2C Smart Lockout handles this automatically when using B2C for auth.

#### MFA Roadmap

| Phase | When | Scope |
|-------|------|-------|
| **Phase 0 (Launch)** | Day 1 | Biometric gate (FaceID/TouchID) on every app open |
| **Phase 1 (Month 3)** | Post-launch | Optional TOTP MFA for Premium users via Azure AD B2C |
| **Phase 2 (Month 6)** | Enterprise | Required MFA for admin accounts, API key rotation |
| **Phase 3 (Month 12)** | Compliance | Hardware key support (FIDO2) for enterprise/clinical partners |

### 4.6 GDPR/Privacy Implementation

#### Right to Deletion (Art. 17)

```
DELETE /api/v1/account
  Auth: Bearer {token}
  Body: { confirmation: "DELETE MY ACCOUNT" }

Steps:
  1. Immediate: Account marked as "deletion_pending"
  2. 24 hours: Grace period (user can cancel)
  3. After grace: 
     a. Tier 1 DB: DELETE all tier1_messages, journal_entries WHERE user_id = X
     b. Tier 2 Cosmos: DELETE all clinical data WHERE user_id = X
     c. Tier 3 DB: DELETE room_members WHERE user_id = X
        (Tier 3 messages anonymized: sender_id set to 'deleted-user')
     d. Users table: Hard delete (no soft delete — GDPR requires erasure)
     e. Azure AD B2C: Delete user object via MS Graph API
     f. Redis: Clear all session data
     g. Backups: Excluded from next backup cycle (14-day rolling)
  4. Confirmation email sent to user's email
  5. Audit log entry (anonymized) retained for 6 years (legal requirement)
```

#### Data Export (Art. 20 — Portability)

```
GET /api/v1/account/export
  Auth: Bearer {token}
  Response: 202 Accepted + job ID

  Async job creates a ZIP containing:
  - profile.json (account data)
  - tier1_messages.json (private messages)
  - journal_entries.json (private journal)
  - consent_records.json (all consent events)
  - tier3_messages.json (shared mediation outputs)
  
  Download link sent via email. Expires in 48 hours.
  File encrypted with user-provided passphrase.
```

#### Consent Audit Trail

Every consent is logged immutably:
```sql
CREATE TABLE consent_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    consent_version TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('granted', 'revoked', 'updated')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Immutable: no UPDATE or DELETE allowed on this table via app role
REVOKE UPDATE, DELETE ON consent_audit FROM relio_app;
```

### 4.7 Biometric Gate — Implementation

```typescript
// BiometricGate.tsx — enforced on every app foreground
import * as LocalAuthentication from 'expo-local-authentication';

async function enforceBiometricGate(): Promise<boolean> {
  const hasBiometric = await LocalAuthentication.hasHardwareAsync();
  if (!hasBiometric) return true; // Skip on devices without biometric

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return true; // Skip if user hasn't enrolled biometrics

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Relio',
    cancelLabel: 'Cancel',
    disableDeviceFallback: false, // Allow PIN/pattern fallback
    fallbackLabel: 'Use passcode',
  });

  return result.success;
}
```

**When biometric is enforced:**
- App opened from background (after 30s minimum)
- App opened from terminated state
- Before viewing Tier 1 private journal
- Before data export
- Before account deletion

**When biometric is NOT enforced:**
- During initial registration (user hasn't set up yet)
- Push notification quick-reply (Tier 3 only)
- Settings that don't involve private data

### 4.8 Mobile Auth Screens — React Native Implementation

#### New Screen: `LoginScreen.tsx`

```typescript
// Screens to implement:
// 1. LoginScreen        — Apple/Google/Email login buttons
// 2. EmailAuthScreen    — Magic link / password flow
// 3. AgeVerifyScreen    — Date of birth collection
// 4. ConsentScreen      — Three consent checkboxes
// 5. OnboardingScreen   — (existing, to be updated)
// 6. InvitePartnerScreen— Generate/share invite
// 7. AcceptInviteScreen — Claim an invite code
```

**Auth Flow State Machine:**

```
APP_OPEN
  │
  ├─ Has stored token?
  │   ├─ YES → Validate token
  │   │         ├─ Valid → BIOMETRIC_GATE → MAIN_APP
  │   │         └─ Expired → Try refresh
  │   │                      ├─ Refresh OK → BIOMETRIC_GATE → MAIN_APP
  │   │                      └─ Refresh FAIL → LOGIN_SCREEN
  │   │
  │   └─ NO → Has completed onboarding before?
  │            ├─ YES → LOGIN_SCREEN
  │            └─ NO  → WELCOME_SCREEN → LOGIN_SCREEN
  │
  LOGIN_SCREEN
  │
  ├─ Apple Sign In → B2C → Token → AGE_VERIFY → CONSENT → ONBOARDING → MAIN_APP
  ├─ Google Sign In → B2C → Token → AGE_VERIFY → CONSENT → ONBOARDING → MAIN_APP
  └─ Email → EMAIL_AUTH → B2C → Token → AGE_VERIFY → CONSENT → ONBOARDING → MAIN_APP
```

**Secure Storage Keys:**

| Key | Content | Encrypted |
|-----|---------|-----------|
| `relio_access_token` | JWT access token | Yes (Keychain/Keystore) |
| `relio_refresh_token` | Refresh token | Yes (Keychain/Keystore) |
| `relio_user_profile` | Local user profile cache | Yes (Keychain/Keystore) |
| `relio_onboarding_complete` | Boolean flag | Yes (Keychain/Keystore) |
| `relio_consent_v1` | Consent state hash | Yes (Keychain/Keystore) |

---

## 5. Complete Screen-by-Screen Flow

### Registration Phase (8 screens)

```
Screen 1: SPLASH / WELCOME
  ┌────────────────────────────┐
  │                            │
  │         [Relio Logo]       │
  │                            │
  │  "Say what you feel.       │
  │   They hear what           │
  │   you mean."               │
  │                            │
  │  [Continue]                │
  │                            │
  │  "Already have an account? │
  │   Sign in"                 │
  └────────────────────────────┘
  
Screen 2: VALUE PROPOSITION (swipeable carousel, 3 slides)
  Slide 1: "Your words stay private"
    🔒 "What you type is encrypted and NEVER shared with 
    your partner directly."
  
  Slide 2: "AI transforms your message"  
    🤖 "Relio converts raw emotions into thoughtful,
    constructive questions."
  
  Slide 3: "Build real understanding"
    💬 "Your partner receives empathy, not accusations.
    Real connection starts here."
  
  [Get Started]  [Skip →]

Screen 3: SIGN UP / SIGN IN
  ┌────────────────────────────┐
  │  Create your account       │
  │                            │
  │  [  Sign in with Apple  ] │
  │  [  Sign in with Google ] │
  │                            │
  │  ─── or ───                │
  │                            │
  │  [  Continue with email ] │
  │                            │
  │  Already have an account?  │
  │  [Sign in]                 │
  │                            │
  │  By continuing, you agree  │
  │  to our Terms of Service   │
  │  and Privacy Policy.       │
  └────────────────────────────┘

Screen 4: AGE VERIFICATION
  ┌────────────────────────────┐
  │  When were you born?       │
  │                            │
  │  Relio is designed for     │
  │  adults 18 and over.       │
  │                            │
  │  [Month] [Day] [Year]     │
  │                            │
  │  [Continue]                │
  │                            │
  │  Your date of birth is used│
  │  only for age verification │
  │  and is not shared.        │
  └────────────────────────────┘

Screen 5: DISPLAY NAME
  ┌────────────────────────────┐
  │  What should we call you?  │
  │                            │
  │  [First name input]        │
  │                            │
  │  This is shown to your     │
  │  partner and in the        │
  │  mediation room.           │
  │                            │
  │  [Continue]                │
  └────────────────────────────┘
```

### Onboarding Phase (6 screens)

```
Screen 6: PRIVACY EDUCATION (3-Tier plain language)
  [See Section 2.5 — interactive before/after demo]
  
  [I understand — Continue]

Screen 7: CONSENT COLLECTION
  ┌────────────────────────────┐
  │  Before we begin           │
  │                            │
  │  ☐ I understand Relio is   │
  │    NOT therapy or medical  │
  │    advice.                 │
  │                            │
  │  ☐ I understand how my     │
  │    privacy is protected    │
  │    (Tier 1 stays private). │
  │                            │
  │  ☐ I consent to AI         │
  │    processing of my        │
  │    messages.               │
  │                            │
  │  [Read Terms of Service]   │
  │  [Read Privacy Policy]     │
  │                            │
  │  [Continue] ← disabled     │
  │  until all 3 checked       │
  └────────────────────────────┘

Screen 8: RELATIONSHIP STAGE
  [See Section 2.1 — card selection]
  
  "I'd rather not say" option available.
  
  [Continue]

Screen 9: ATTACHMENT QUIZ (optional, high-engagement)
  ┌────────────────────────────┐
  │  Quick check-in            │
  │  (2 minutes, optional)     │
  │                            │
  │  "When my partner doesn't  │
  │   respond to a text for    │
  │   hours, I usually..."     │
  │                            │
  │  ○ Feel anxious and check  │
  │    again                   │
  │  ○ Barely notice           │
  │  ○ Feel a mix — depends    │
  │    on the day              │
  │  ○ Feel frustrated but     │
  │    keep busy               │
  │                            │
  │  [Question 2 of 5 →]      │
  │                            │
  │  [Skip for now]            │
  └────────────────────────────┘

Screen 10: QUIZ RESULT / INSIGHT
  ┌────────────────────────────┐
  │  Your communication style  │
  │                            │
  │  💫 "You tend to seek      │
  │  reassurance — that's your │
  │  attachment system keeping  │
  │  you safe. Relio helps you │
  │  express those needs in a  │
  │  way your partner can      │
  │  hear."                    │
  │                            │
  │  [Unlock deeper insights   │
  │   with Premium ✨]         │
  │                            │
  │  [Continue to Relio]       │
  └────────────────────────────┘

Screen 11: INVITE PARTNER (or SKIP)
  ┌────────────────────────────┐
  │  Invite your partner       │
  │                            │
  │  Relio works best as a     │
  │  couple — but it's great   │
  │  solo too.                 │
  │                            │
  │  [Share invite link 📤]    │
  │  [Show QR code 📱]        │
  │  [Copy code: RLO-K7M 📋] │
  │                            │
  │  Your partner will complete│
  │  their OWN private setup.  │
  │  You won't see each        │
  │  other's answers.          │
  │                            │
  │  [Skip — use Relio solo]   │
  └────────────────────────────┘
```

### Post-Onboarding (First Session)

```
Screen 12: PSYCHOEDUCATION (pre-session)
  [See Section 2.6 — 3 interactive cards about ground rules]
  
  [Start your first session →]

Screen 13: MAIN APP
  - Tab 1: Shared Chat (Tier 3 mediation room)
  - Tab 2: Private Journal (Tier 1)
  - Tab 3: Exercises (Psychoeducation)
  - Tab 4: Settings / Profile
```

---

## 6. API Endpoint Definitions

### Auth Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/b2c/callback` | None | OAuth callback from Azure AD B2C. Issues app tokens. |
| `POST` | `/api/v1/auth/refresh` | Refresh token | Exchanges refresh token for new access + refresh tokens |
| `POST` | `/api/v1/auth/logout` | Bearer | Invalidates current session, clears server-side state |
| `GET`  | `/api/v1/auth/me` | Bearer | Returns current user profile + consent status |

### User Profile Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `PUT`  | `/api/v1/users/me/profile` | Bearer | Update display name, relationship stage |
| `PUT`  | `/api/v1/users/me/stage` | Bearer | Update relationship stage |
| `GET`  | `/api/v1/users/me/consent` | Bearer | Get current consent status |
| `POST` | `/api/v1/users/me/consent` | Bearer | Record new consent grant/revocation |

### Couple / Invite Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/invites` | Bearer | Generate invite code + deep link + QR URL |
| `GET`  | `/api/v1/invites/active` | Bearer | Get user's active (unclaimed) invite |
| `DELETE`| `/api/v1/invites/{id}` | Bearer | Cancel an active invite |
| `POST` | `/api/v1/invites/accept` | Bearer | Accept an invite code, form couple |
| `GET`  | `/api/v1/invites/validate/{code}` | None | Check if invite code is valid (pre-registration) |
| `POST` | `/api/v1/couples/unlink` | Bearer | Dissolve couple, archive room |

### Onboarding Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/onboarding/age-verify` | Bearer | Submit DOB, returns pass/fail |
| `POST` | `/api/v1/onboarding/quiz` | Bearer | Submit attachment quiz answers |
| `GET`  | `/api/v1/onboarding/quiz/result` | Bearer | Get quiz result + insight text |
| `POST` | `/api/v1/onboarding/complete` | Bearer | Mark onboarding as complete |

### Account Management Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `DELETE`| `/api/v1/account` | Bearer | Request account deletion (24h grace) |
| `POST` | `/api/v1/account/cancel-deletion` | Bearer | Cancel pending deletion |
| `GET`  | `/api/v1/account/export` | Bearer | Request data export (async) |
| `GET`  | `/api/v1/account/export/{jobId}` | Bearer | Check export status / download |

---

## 7. Database Schema Additions

### New Table: `consent_audit` (Tier 1 DB)

```sql
CREATE TABLE consent_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN (
        'not_therapy', 'privacy_model', 'ai_processing',
        'terms_of_service', 'privacy_policy', 'age_verification',
        'marketing_email', 'analytics'
    )),
    consent_version TEXT NOT NULL,      -- "1.0.0"
    action TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
    ip_address INET,
    user_agent TEXT,
    device_platform TEXT,               -- 'ios' | 'android'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_consent_user ON consent_audit(user_id, consent_type);

-- Immutable audit log — app role cannot UPDATE or DELETE
REVOKE UPDATE, DELETE ON consent_audit FROM relio_app;
```

### Modifications to `users` Table (Tier 1 DB)

```sql
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN relationship_stage TEXT 
    CHECK (relationship_stage IN ('dating', 'commitment', 'crisis', 'separation', 'post_divorce'))
    DEFAULT 'dating';
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN onboarding_completed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN couple_status TEXT 
    CHECK (couple_status IN ('solo', 'invite_pending', 'coupled', 'uncoupled'))
    DEFAULT 'solo';
ALTER TABLE users ADD COLUMN subscription_tier TEXT
    CHECK (subscription_tier IN ('free', 'premium_solo', 'premium_couple', 'premium_plus'))
    DEFAULT 'free';
ALTER TABLE users ADD COLUMN deletion_requested_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN attachment_quiz_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN locale TEXT DEFAULT 'en-US';
```

### New Table: `attachment_quiz_results` (Tier 2 — Cosmos DB)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "answers": [
    { "questionId": "q1", "answer": "anxious_response", "timestamp": "ISO" },
    { "questionId": "q2", "answer": "secure_response", "timestamp": "ISO" }
  ],
  "computedStyle": "anxious",
  "confidence": 0.78,
  "createdAt": "ISO",
  "partitionKey": "/userId"
}
```

### Modifications to `room_invites` Table (Tier 3 DB)

```sql
ALTER TABLE room_invites ADD COLUMN invite_type TEXT
    CHECK (invite_type IN ('partner', 'friend_referral'))
    DEFAULT 'partner';
ALTER TABLE room_invites ADD COLUMN deep_link_url TEXT;
ALTER TABLE room_invites ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE room_invites ADD COLUMN share_channel TEXT;  -- 'sms', 'whatsapp', 'qr', 'copy', 'email'
```

---

## 8. Partner Invitation System — Complete Flow

### Sequence Diagram

```
Partner A (Solo User)                  Relio Backend                    Partner B (New User)
        │                                   │                                 │
        │─ POST /api/v1/invites ──────────►│                                 │
        │                                   │── Generate code "RLO-K7M"       │
        │                                   │── Create room (status: pending) │
        │                                   │── Store invite in room_invites  │
        │◄── { code, deepLink, qr } ───────│                                 │
        │                                   │                                 │
        │── Share deepLink via iMessage ──────────────────────────────────────►│
        │                                   │                                 │
        │                                   │      ┌── B clicks deep link ────│
        │                                   │      │   → App Store / Direct   │
        │                                   │◄─────│   GET /invites/validate  │
        │                                   │──────│── { valid: true,         │
        │                                   │      │     inviterName: "Alex"} │
        │                                   │      │                          │
        │                                   │      │── B completes OWN        │
        │                                   │      │   registration &         │
        │                                   │      │   onboarding             │
        │                                   │      │   (independent from A)   │
        │                                   │      │                          │
        │                                   │◄─────│── POST /invites/accept   │
        │                                   │      │   { code: "RLOK7M" }    │
        │                                   │      │                          │
        │                                   │── Link B to room               │
        │                                   │── Update invite: claimed_by=B  │
        │                                   │── Update A & B: coupled        │
        │                                   │── Notify A via push            │
        │                                   │                                 │
        │◄── Push: "Your partner joined!" ──│──── Push: "You're connected!"──►│
        │                                   │                                 │
        │── Enter shared mediation room ────│──── Enter shared room ──────────│
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| A invites, then deletes account before B joins | Invite invalidated. B sees "This invite has expired." |
| B tries expired code | "This invite has expired. Ask your partner for a new one." |
| B tries code while already in a couple | "You're already connected to a partner. Unlink first in Settings." |
| A creates multiple invites | Only 1 active invite at a time. Creating new invalidates old. |
| B accepts, but A is now coupled with someone else | Reject: "This invite is no longer available." (A coupled with C via different invite) |
| Both A and B try to invite each other simultaneously | First `accept` wins (DB transaction with `FOR UPDATE SKIP LOCKED`). Second gets "Already paired." |

---

## 9. Security Requirements — Summary

| Category | Requirement | Implementation |
|----------|------------|----------------|
| **Authentication** | OAuth 2.0 / OIDC via Azure AD B2C | Social login + email magic link |
| **Token Security** | RS256 JWT, JWKS validation, token rotation | `jose` library, B2C JWKS endpoint |
| **Mobile Storage** | All tokens in secure hardware | expo-secure-store (Keychain/Keystore) |
| **Biometric** | FaceID/TouchID on every app foreground | expo-local-authentication |
| **Transport** | TLS 1.3 only | Azure Front Door + backend requirement |
| **Rate Limiting** | Per-endpoint, per-IP, per-user | express-rate-limit (existing) + B2C smart lockout |
| **Input Validation** | All inputs validated server-side | Zod schemas (existing pattern) |
| **CORS** | Strict origin whitelist | Existing CORS config |
| **Headers** | Security headers | Helmet.js (existing) |
| **Password** | Managed by B2C (bcrypt 12 rounds) | Never touches our backend |
| **Invite Codes** | Cryptographically random, time-limited | `crypto.getRandomValues`, 7-day expiry |
| **Account Lockout** | Azure AD B2C Smart Lockout | Automatic, configurable thresholds |
| **PII in Logs** | Never log tokens, emails, messages | Structured logging with field exclusions |
| **GDPR Deletion** | Hard delete across all 3 tiers | Cascade delete + B2C Graph API deletion |

---

## 10. Legal & Compliance Checklist

### Per-Region Requirements

| Region | Age | Consent | Data Location | Deletion | Breach Notify | Special |
|--------|-----|---------|---------------|----------|---------------|---------|
| **EU/EEA** | 16+ (varies) | Explicit opt-in (Art. 7) | EU only ✅ (Sweden) | 30 days (Art. 17) | 72 hours (Art. 33) | DPO required, DPIA for AI profiling |
| **UK** | 13+ | UK GDPR consent | Adequate country | 30 days | 72 hours | ICO registration |
| **US (Federal)** | 13+ (COPPA) | ToS acceptance | Any | Reasonable | State-dependent | FTC Act Section 5 |
| **California** | 16+ (CPRA) | CCPA notice + opt-out | Any | 45 days | "Expedient" | "Do Not Sell" button required |
| **Australia** | 18+ (for us) | APP consent | Adequate country | 30 days (APP 12) | "As soon as practicable" | APP 1-13 compliance |
| **Canada** | 18+ (for us) | PIPEDA consent | Adequate country | "Timely" | PIPEDA 10.1 | Meaningful consent |
| **Israel** | 18+ (for us) | PPA consent | Any with adequacy | Upon request | 72 hours | Commissioner registration |
| **Brazil** | 18+ (for us) | LGPD consent | Brazil or adequate | 15 days | "Reasonable" | DPO required, ANPD registration |

### Compliance Implementation Checklist

- [ ] Azure AD B2C tenant in EU (Sweden Central) — data residency
- [ ] Privacy Policy v1.0 published at `relio.app/privacy`
- [ ] Terms of Service v1.0 published at `relio.app/terms`
- [ ] Consent collection UI with version tracking
- [ ] Consent audit table (immutable, 6-year retention)
- [ ] Data export endpoint (Art. 20 portability)
- [ ] Account deletion endpoint (Art. 17 erasure)
- [ ] "Do Not Sell" toggle for CCPA
- [ ] DPO contact in app Settings + Privacy Policy
- [ ] Cookie/tracking consent (if web version added)
- [ ] Age verification (DOB + IdP claim cross-check)
- [ ] Breach notification playbook (72-hour EU, state-specific US)
- [ ] DPIA completed for AI profiling features
- [ ] Apple App Privacy Labels submitted accurately
- [ ] Google Play Data Safety section completed

---

## 11. Conversion Optimization

### A/B Tests to Run (Priority Order)

| Test # | Element | Variant A | Variant B | Metric | Priority |
|--------|---------|-----------|-----------|--------|----------|
| 1 | Welcome tagline | "Say what you feel. They hear what you mean." | "The mediator that never takes sides." | Sign-up rate | P0 |
| 2 | Social login order | Apple first, Google second | Google first, Apple second | Auth completion (per platform) | P0 |
| 3 | Onboarding length | 6 screens (full) | 3 screens (minimal) | Onboarding completion rate vs. Day 7 retention | P1 |
| 4 | Attachment quiz | Optional (skip available) | Mandatory (no skip) | Quiz completion vs. onboarding drop-off | P1 |
| 5 | Partner invite timing | During onboarding (Screen 11) | After first session | Couple formation rate | P1 |
| 6 | Pricing surface | After session 3 | After session 1 | Free → paid conversion vs. churn | P2 |
| 7 | Privacy explanation | Text cards | Animated video | Onboarding completion + trust survey | P2 |
| 8 | Invite channel | Deep link prominent | QR code prominent | Partner acceptance rate | P3 |

### Funnel Analytics Events

```typescript
// Events to track in Azure Application Insights
const ONBOARDING_EVENTS = {
  // Registration
  'reg.splash_viewed': {},
  'reg.value_prop_viewed': { slide: number },
  'reg.signup_tapped': { method: 'apple' | 'google' | 'email' },
  'reg.signup_completed': { method: string, durationMs: number },
  'reg.signup_failed': { method: string, error: string },
  
  // Onboarding
  'onb.age_verified': { ageRange: '18-24' | '25-34' | '35-44' | '45+' },
  'onb.age_rejected': {},
  'onb.name_entered': {},
  'onb.privacy_viewed': { durationMs: number },
  'onb.consent_granted': { types: string[] },
  'onb.stage_selected': { stage: string },
  'onb.stage_skipped': {},
  'onb.quiz_started': {},
  'onb.quiz_completed': { style: string, durationMs: number },
  'onb.quiz_skipped': {},
  'onb.invite_shown': {},
  'onb.invite_created': { channel: string },
  'onb.invite_skipped': {},
  'onb.psychoeducation_viewed': { module: number },
  'onb.complete': { totalDurationMs: number, screensViewed: number },
  
  // Partner Invitation
  'inv.created': { channel: string },
  'inv.link_opened': {},
  'inv.code_validated': { valid: boolean },
  'inv.accepted': { daysAfterCreate: number },
  'inv.expired': {},
  'inv.declined': {},
  
  // Conversion
  'conv.paywall_shown': { trigger: string, sessionCount: number },
  'conv.upgrade_tapped': { tier: string },
  'conv.upgrade_completed': { tier: string, price: number },
  'conv.upgrade_abandoned': { step: string },
};
```

---

## 12. Competitor Benchmarks

| Feature | **Relio** | **Lasting** | **Relish** | **Paired** | **Gottman Card Decks** |
|---------|-----------|-------------|------------|------------|----------------------|
| **Signup** | Social + email | Email only | Email + social | Email only | Email only |
| **Onboarding** | 6 screens + quiz | Relationship quiz (15 min) | Quick assessment | Daily questions | No onboarding |
| **Partner invite** | Deep link + QR + code | Email invite | SMS invite | Share link | N/A (solo app) |
| **Solo value** | Full (journal, AI coach, exercises) | Limited (partner needed) | Limited | Some solo content | Full (solo app) |
| **Auth** | Biometric + social | Email/password | Email/password | Email/password | Email/password |
| **Privacy model** | 3-Tier architecture | Standard encryption | Standard encryption | Standard encryption | N/A |
| **Time to first value** | ~3 min (quiz result) | ~15 min (full quiz) | ~5 min | ~2 min | Immediate |
| **Pricing visibility** | After first session | During onboarding | During onboarding | After 7-day trial | Upfront ($5.99) |
| **Free tier** | 3 sessions/month | 7-day trial | 7-day trial | Limited daily | Paid only |
| **AI mediation** | Real-time 3-way | Exercise-based | Coach chat (1-way) | None (content only) | None (cards only) |

### Competitive Advantages in Onboarding

1. **Fastest to value:** 3 minutes to attachment insight (vs. 15 min for Lasting quiz)
2. **Solo-first:** Full solo product, not degraded (Lasting/Relish are partner-dependent)
3. **Privacy education:** No competitor explains their privacy model during onboarding
4. **Biometric by default:** No competitor has hardware-backed biometric gate
5. **Invite flexibility:** 3 channels (deep link, QR, verbal code) vs. competitors' single channel

---

## 13. Implementation Priority

### Sprint 8: Auth & Registration (Weeks 1-2)

| ID | Task | Priority | Owner | Estimate |
|----|------|----------|-------|----------|
| S8-T1 | Provision Azure AD B2C tenant (Sweden Central) | P0 | Cloud Architect | 4h |
| S8-T2 | Configure social IdPs (Apple Sign In, Google Sign In) | P0 | Backend Dev | 8h |
| S8-T3 | Create B2C custom policy: signup/signin + consent + age | P0 | Backend Dev | 16h |
| S8-T4 | Implement backend JWT validation (jose + JWKS) | P0 | Backend Dev | 8h |
| S8-T5 | Replace `AUTH_DISABLED` dev mode with B2C dev tenant | P1 | Backend Dev | 4h |
| S8-T6 | Build `LoginScreen.tsx` (Apple + Google + Email) | P0 | Mobile Dev | 12h |
| S8-T7 | Build `AgeVerifyScreen.tsx` | P1 | Mobile Dev | 4h |
| S8-T8 | Build `ConsentScreen.tsx` + consent API endpoints | P0 | Mobile Dev + Backend | 12h |
| S8-T9 | Create `consent_audit` table + RLS | P0 | Backend Dev | 4h |
| S8-T10 | Modify `users` table (add new columns) | P1 | Backend Dev | 2h |
| S8-T11 | Token storage in expo-secure-store + refresh logic | P0 | Mobile Dev | 8h |
| S8-T12 | Update auth middleware: B2C JWKS validation (prod) | P0 | Backend Dev | 4h |

### Sprint 9: Onboarding & Invitation (Weeks 3-4)

| ID | Task | Priority | Owner | Estimate |
|----|------|----------|-------|----------|
| S9-T1 | Update `OnboardingScreen.tsx` with new stage selection UX | P0 | Mobile Dev | 8h |
| S9-T2 | Build attachment quiz (5 questions + result screen) | P1 | Mobile Dev + Medical Pod | 12h |
| S9-T3 | Build `InvitePartnerScreen.tsx` (code + QR + deep link) | P0 | Mobile Dev | 12h |
| S9-T4 | Build `AcceptInviteScreen.tsx` | P0 | Mobile Dev | 8h |
| S9-T5 | Implement invite API endpoints (create, accept, validate) | P0 | Backend Dev | 12h |
| S9-T6 | Deep link handling (Expo linking, universal links, Android intent) | P0 | Mobile Dev | 8h |
| S9-T7 | Build pre-session psychoeducation cards | P1 | Mobile Dev + Medical Pod | 8h |
| S9-T8 | Onboarding analytics events (Application Insights) | P1 | Backend Dev | 4h |
| S9-T9 | QR code generation endpoint | P2 | Backend Dev | 4h |
| S9-T10 | Legal pages: ToS + Privacy Policy (hosted at relio.app) | P0 | CLO + Frontend | 8h |

### Sprint 10: Polish & Security (Weeks 5-6)

| ID | Task | Priority | Owner | Estimate |
|----|------|----------|-------|----------|
| S10-T1 | Account deletion flow (24h grace, cascade delete) | P0 | Backend Dev | 12h |
| S10-T2 | Data export endpoint (async ZIP generation) | P1 | Backend Dev | 8h |
| S10-T3 | Biometric gate enforcement (configurable timing) | P1 | Mobile Dev | 4h |
| S10-T4 | Rate limiting on auth endpoints | P0 | Backend Dev | 4h |
| S10-T5 | E2E test: full registration → onboarding → invite → couple | P0 | QA | 12h |
| S10-T6 | Security review: OWASP auth checklist | P0 | CISO | 8h |
| S10-T7 | A/B test infrastructure for onboarding variants | P2 | Backend Dev | 8h |
| S10-T8 | Push notifications for invite acceptance | P1 | Mobile Dev | 4h |
| S10-T9 | Consent re-prompt on ToS/Privacy Policy version change | P1 | Mobile Dev + Backend | 8h |

---

## Appendix A: Zod Schemas for New Endpoints

```typescript
import { z } from 'zod';

// Registration
export const AgeVerifySchema = z.object({
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const ProfileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).trim(),
  relationshipStage: z.enum(['dating', 'commitment', 'crisis', 'separation', 'post_divorce']).optional(),
});

// Consent
export const ConsentGrantSchema = z.object({
  consentType: z.enum([
    'not_therapy', 'privacy_model', 'ai_processing',
    'terms_of_service', 'privacy_policy', 'age_verification',
  ]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  granted: z.boolean(),
});

// Invitations
export const InviteAcceptSchema = z.object({
  code: z.string().regex(/^[A-Z2-9]{6}$/),
});

// Attachment Quiz
export const QuizAnswerSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string(),
  })).min(1).max(10),
});

// Account Deletion
export const AccountDeleteSchema = z.object({
  confirmation: z.literal('DELETE MY ACCOUNT'),
});
```

---

## Appendix B: Environment Variables (New)

```bash
# Azure AD B2C
AZURE_AD_B2C_TENANT=relio
AZURE_AD_B2C_TENANT_ID=<uuid>
AZURE_AD_B2C_CLIENT_ID=<uuid>
AZURE_AD_B2C_POLICY=B2C_1A_SignUpSignIn
AZURE_AD_B2C_JWKS_URI=https://relio.b2clogin.com/relio.onmicrosoft.com/B2C_1A_SignUpSignIn/discovery/v2.0/keys

# Invite System
INVITE_CODE_EXPIRY_DAYS=7
MAX_ACTIVE_INVITES_PER_USER=1
MAX_INVITES_PER_30_DAYS=3

# Account Management
ACCOUNT_DELETION_GRACE_HOURS=24
DATA_EXPORT_LINK_EXPIRY_HOURS=48

# Feature Flags
FEATURE_ATTACHMENT_QUIZ=true
FEATURE_PARTNER_INVITE=true
FEATURE_AB_TESTING=false
```

---

*This document is the single source of truth for Relio's registration, onboarding, and authentication system. Engineers should implement directly from this spec. Questions or conflicts should be escalated to the CEO.*

**Document approved by:**
- CEO (mission alignment, revenue strategy) ✅
- CPsychO (clinical safety, consent, psychoeducation) ✅
- CTO (architecture, security, infrastructure) ✅
- CLO (legal, compliance, GDPR) ✅
- CISO (security posture, threat model) ✅
- DPO (data privacy, audit trail) ✅
- CRO (conversion, pricing, funnel) ✅
- CMO (messaging, positioning, competitor analysis) ✅
