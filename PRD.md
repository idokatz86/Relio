# Relio — Unified Product Requirements Document

**Version:** v2.2.0
**Date:** March 17, 2026
**Authors:** All 38 agents across Medical Pod (`chief-psychology-officer`), Tech Pod (`chief-technology-officer`), and Ops Pod (`chief-executive-officer`)
**Classification:** Confidential — Board & Executive Leadership
**Status:** Sprint 10 complete. GDPR compliance, i18n (4 locales), OWASP hardened, push notifications live.

> **Supersedes:** PRD v1.0.0–v1.8.0, PRD-medical-pod.md v1.3.0, PRD-tech-pod.md v1.3.0, PRD-ops-pod.md v1.3.0

---

## Table of Contents

1. [Product Vision & Mission](#1-product-vision--mission)
2. [The 3-Tier Confidentiality Model](#2-the-3-tier-confidentiality-model)
3. [Multi-Agent Architecture](#3-multi-agent-architecture)
4. [Clinical Capabilities (Medical Pod)](#4-clinical-capabilities)
5. [Technical Architecture (Tech Pod)](#5-technical-architecture)
6. [Backoffice & Analytics](#6-backoffice--analytics)
7. [Security Architecture](#7-security-architecture)
8. [Business & Operations (Ops Pod)](#8-business--operations)
9. [Mobile Application](#9-mobile-application)
10. [Sprint History & Roadmap](#10-sprint-history--roadmap)
11. [Cost Model](#11-cost-model)
12. [Risk Matrix](#12-risk-matrix)
13. [Success Metrics](#13-success-metrics)

---

## 1. Product Vision & Mission

### What Relio Is

Relio is the world's first AI-powered 3-way relationship mediator — a private, neutral third party that sits between two partners and transforms hostile, blame-laden communication into constructive, Socratic dialogue. It is not therapy. It is structured mediation informed by evidence-based clinical frameworks (Gottman Method, Emotionally Focused Therapy, Adult Attachment Theory), delivered by 38 specialized AI agents, and protected by a privacy architecture that is physically incapable of leaking one partner's private words to the other.

### Who It Serves

- **Dating couples** (6–18 months) — building healthy communication habits early
- **Committed partners** — deepening intimacy and navigating perpetual conflicts
- **Couples in crisis** — experiencing acute emotional flooding and escalation
- **Separating couples** — managing logistics, grief, and asset division
- **Divorced co-parents** — coordinating child welfare through structured messaging

### Non-Negotiable Principles

1. **Do No Harm.** The Safety Guardian holds absolute veto power. No KPI overrides a safety signal.
2. **Privacy Is Architecture, Not Policy.** The 3-Tier Confidentiality Model is enforced at the data layer, network layer, and application layer. There is no admin override.
3. **The AI Is a Bridge, Not a Destination.** Parasocial dependency is a product failure.
4. **Revenue Never Degrades Privacy.** No selling data. No "upgrade to see what your partner said."
5. **Clinical Decisions Are Independent of Business Metrics.** Medical Pod operates autonomously from revenue targets.

---

## 2. The 3-Tier Confidentiality Model

### The Defining Innovation

| Tier | Name | Contains | Storage | Who Sees It |
|------|------|----------|---------|-------------|
| **Tier 1** | Private | Raw transcripts, venting, specific complaints | Azure PostgreSQL (Row-Level Security, isolated `relio_tier1_private` database) | ONLY the author + AI agents in-memory |
| **Tier 2** | Abstracted | Pattern-level psychological insights (attachment style, Horseman detection) | Azure Cosmos DB Serverless (`relio_tier2_clinical`) | Medical Pod agents only (internal) |
| **Tier 3** | Actionable | Socratic, de-escalated guidance | Azure PostgreSQL (`relio_tier3_shared` database) | Partner + AI + Admin (anonymized) |

### Architectural Enforcement

- **No foreign keys** between Tier 1 and Tier 3 databases (per `architect-dual-context-db` skill)
- **Row-Level Security** on Tier 1: `sender_id = current_setting('app.current_user_id')::uuid`
- **PII Redaction** before all LLM calls: emails, phones, SSNs, addresses stripped with token substitution
- **Canary string injection tests** in CI: Tier 1 data NEVER appears in Tier 3 payloads
- **Admin dashboard** connects ONLY to Tier 3 — physically cannot query Tier 1/2

---

## 3. Multi-Agent Architecture

### 38 Agents Across 3 Pods

**5 IMPLEMENTED [LIVE]** | 33 PLANNED

#### Medical Pod (14 agents)

| Agent | Status | Model (Production) | Role |
|-------|--------|-------------------|------|
| `safety-guardian` | **[LIVE]** | GPT-4.1 via Azure OpenAI | Absolute veto. Detects DV, suicidal ideation, child abuse. **Fail-closed on parse error.** |
| `orchestrator-agent` | **[LIVE]** | GPT-4.1 | Routes messages through 3-Tier Model. Classifies intent + emotional intensity. |
| `communication-coach` | **[LIVE]** | GPT-4.1-mini | Transforms Tier 1 hostile language into Tier 3 Socratic questions. |
| `individual-profiler` | **[LIVE]** | GPT-4.1-mini | Evaluates attachment style (anxious/avoidant/secure/disorganized) and activation state. |
| `phase-dating` | **[LIVE]** | GPT-4.1-mini | Early compatibility, boundaries, red flags, digital trust. |
| `emergency-response-agent` | PLANNED | — | Executes emergency protocols on SAFETY_HALT (911/112/999 routing). |
| `phase-crisis` | PLANNED | — | Flooding detection, 20-min structural pauses, repair attempts. |
| `relationship-dynamics` | PLANNED | — | Gottman Four Horsemen detection, EFT pursue-withdraw cycles. |
| `chief-psychology-officer` | PLANNED | — | Meta-auditor: clinical validity, bias detection, parasocial monitoring. |
| `phase-commitment` | PLANNED | — | Sound Relationship House, deepening intimacy. |
| `phase-separation` | PLANNED | — | Non-partisan logistical mediation, grief processing. |
| `phase-post-divorce` | PLANNED | — | Co-parenting with BIFF/Gray Rock frameworks. |
| `psychoeducation-agent` | PLANNED | — | Personalized exercises, digital boundaries. |
| `progress-tracker` | PLANNED | — | Conflict frequency tracking without leaking Tier 1. |

#### Tech Pod (15 agents) — All actively governing repo architecture

| Agent | Primary Mandate |
|-------|----------------|
| `chief-technology-officer` | Dual-context DB architecture, strict siloing, scalability |
| `backend-developer` | WebSocket infrastructure, intercept & hold, data stripping |
| `cloud-architect` | Azure VNet isolation, Terraform IaC, auto-scaling |
| `chief-info-security-officer` | Threat modeling, containment playbooks, GDPR/HIPAA |
| `data-privacy-officer` | PII redaction, differential privacy, data lifecycle |
| `github-architect` | Least-privilege CI/CD, CodeQL scanning, review gates |
| `native-mobile-developer` | Secure Enclave/Keystore encryption, biometric gating |
| `mobile-qa` | State sync testing, latency resilience, background testing |
| `fullstack-qa` | Canary string injection, E2E scenarios, fail-fast |
| `penetration-tester` | Prompt injection attacks, context extraction |
| `ui-ux-expert` | Visual demarcation (private vs shared), frictionless pauses |
| `app-store-certifier` | UGC compliance, privacy labels, subscription transparency |
| `skills-builder` | EvoSkill refinement loop, multi-agent optimization |
| `scrum-master` | Backlog prioritization, privacy gatekeeping, cross-pod coordination |
| `vp-rnd` | Sentiment pipelines, model evaluation, vector embeddings |

#### Operations Pod (9 agents) — Business strategy and execution

| Agent | Primary Mandate |
|-------|----------------|
| `chief-executive-officer` | Mission alignment, 3-Tier Model protection, roadmap |
| `chief-revenue-officer` | Asymmetric funnel, freemium mapping, pricing |
| `chief-finance-officer` | LLM cost optimization, margin protection, burn rate |
| `chief-marketing-officer` | Stage-specific messaging, privacy-first brand |
| `chief-compete-officer` | Competitive intelligence, differentiator mapping |
| `chief-alliance-officer` | Clinical partnerships (Gottman/EFT alignment) |
| `chief-legal-officer` | Medical disclaimers, privilege warnings, duty-to-warn |
| `chief-product-officer` | User stories with emotional safety, acceptance criteria |
| `chief-strategy-officer` | Lifecycle mapping, trend analysis, R&D priorities |

---

## 4. Clinical Capabilities

### Pipeline Flow [LIVE]

```
User Input (Tier 1 Raw)
    │
    ├──► [1] SAFETY GUARDIAN (GPT-4.1)
    │         ├── SAFE → Continue
    │         ├── Parse failure → HALT (fail-closed)
    │         └── HIGH/CRITICAL → SAFETY_HALT → Emergency Response [PLANNED]
    │
    ├──► [2] ORCHESTRATOR + INDIVIDUAL PROFILER (parallel, GPT-4.1 + GPT-4.1-mini)
    │         ├── Tier classification, intent, emotional intensity
    │         └── Attachment style, activation state
    │
    └──► [3] COMMUNICATION COACH (GPT-4.1-mini)
              └── Tier 1 → Tier 3 Socratic transformation
```

**Average pipeline latency:** ~7s (4 LLM calls, 2 parallelized)

### Safety Guardian Specifics [LIVE]
- Severity levels: SAFE, LOW, MEDIUM, HIGH, CRITICAL
- Compound rule: contempt + withdrawal → MEDIUM (Gottman, 1994)
- **Regex pre-screen layer** [PLANNED]: Fast keyword matching before LLM call
- **Fail-closed doctrine**: ANY parse failure defaults to `severity: HIGH, halt: true`

### Clinical Frameworks Referenced
- Gottman Method (Four Horsemen, Sound Relationship House, flooding indicators)
- Emotionally Focused Therapy (EFT pursue-withdraw cycles)
- Adult Attachment Theory (anxious, avoidant, secure, disorganized)
- BIFF/Gray Rock (high-conflict co-parenting communication)
- Cyberspace flooding detection (message velocity, ALL CAPS, cross-platform escalation)

---

## 5. Technical Architecture

### Infrastructure [LIVE — Sweden Central]

| Service | Purpose | Status |
|---------|---------|--------|
| Azure Container Apps | Backend hosting (scale-to-zero, 0–10 replicas) | **LIVE** |
| Azure OpenAI (`relio-openai`) | GPT-4.1 + GPT-4.1-mini via managed identity | **LIVE** |
| Azure PostgreSQL Flex | Tier 1 (`relio_tier1_private`) + Tier 3 (`relio_tier3_shared`) | **PROVISIONED** |
| Azure Cosmos DB Serverless | Tier 2 clinical (`relio_tier2_clinical`) | **PROVISIONED** |
| Azure Cache for Redis | Sessions, rate limiting, WebSocket pub/sub | **PROVISIONED** |
| Azure Key Vault (`relio-kv-dev`) | Secrets: OpenAI endpoint, Redis, Postgres, App Insights | **LIVE** |
| Azure Container Registry | Docker images, managed identity pull | **LIVE** |
| Azure VNet + NSGs | 4 subnets (app, postgres, private-endpoints, redis) | **LIVE** |
| Azure App Insights + Log Analytics | Observability, structured logging | **LIVE** |
| GitHub Actions | CI (typecheck+test), security scan (CodeQL+gitleaks), CD (ACR→Container Apps) | **LIVE** |

### Backend Stack [LIVE]
- **Runtime**: Express/TypeScript on Node.js 22
- **WebSocket**: `ws` library with heartbeat (30s ping/pong), authenticated via JWT `?token=` param
- **Validation**: Zod schemas (UUID userId, 2000-char message limit)
- **LLM Gateway**: Provider-agnostic `callLLM()` with circuit breaker (3 failures → 30s open) + per-user daily token budget (50K)
- **Auth**: JWT middleware on REST + WebSocket. `AUTH_DISABLED=true` for dev. userId must match JWT `sub`.

### Database Schemas [DESIGNED — pending connection]
- **Tier 1**: `users`, `tier1_messages` (RLS), `safety_audit_log`, `journal_entries`, 90-day auto-purge
- **Tier 3**: `rooms`, `room_members`, `tier3_messages`, `sessions`, `room_invites`, `feedback`
- **No foreign keys** between Tier 1 and Tier 3 databases

---

## 6. Backoffice & Analytics [LIVE]

### Admin API (`/api/v1/admin/*`)

| Endpoint | Data | Privacy |
|----------|------|---------|
| `/stats/overview` | Users, couples, messages, safety halts, latency | k-anonymized |
| `/users` | Paginated directory (name, phase, tier, status) | No email, no raw messages |
| `/couples` | Paired vs solo, room status, phase | Anonymized room IDs |
| `/phases` | Distribution across 5 relationship stages | Groups < 5 show `"<5"` |
| `/subscriptions` | Free/Premium breakdown, MRR, ARR, conversion | Aggregated only |
| `/pipeline` | Latency P50/P95/P99, token usage by agent | No message content |
| `/safety` | Halt rate, severity distribution, trends | No user identifiers |
| `/feedback` | Ratings, NPS score, anonymized comments | PII-redacted comments |
| `/audit` | Admin action audit trail | Full traceability |
| `/health` | System uptime, memory, version | Operational |

### Admin Dashboard (React + Vite + Tailwind)
7 pages: Dashboard, Users, Phases, Subscriptions, Pipeline, Safety, Feedback. Relio earth-tone design. "Tier 3 Only" data scope badge on every page.

### Feedback Collection System
- Post-session rating (1–5 stars + optional comment)
- Weekly pulse (3 questions, Sunday 10am)
- NPS survey (monthly, 0–10)
- Churn interview (48h after cancellation)

---

## 7. Security Architecture [LIVE]

| Control | Implementation | Status |
|---------|---------------|--------|
| JWT Auth | REST `Authorization: Bearer` + WebSocket `?token=` | **LIVE** |
| Input Validation | Zod schemas: UUID userId, 2000-char max, `express.json({limit:'10kb'})` | **LIVE** |
| Security Headers | Helmet (HSTS, X-Frame, nosniff, DNS prefetch) | **LIVE** |
| Rate Limiting | `express-rate-limit` 30 req/min per IP | **LIVE** |
| CORS Lockdown | `ALLOWED_ORIGINS` env var, deny in production | **LIVE** |
| Safety Fail-Closed | Parse error → `severity: HIGH, halt: true` | **LIVE** |
| Circuit Breaker | 3 LLM failures → open 30s → half-open retry | **LIVE** |
| Token Budget | Per-user 50K daily token limit | **LIVE** |
| PII Redaction | Email, phone, SSN, address, credit card stripping | **BUILT** |
| NSGs | Postgres: port 5432 from app-subnet only. PE: app-subnet only. | **LIVE** |
| Key Vault RBAC | Managed identity `Secrets User` + user `Secrets Officer` | **LIVE** |
| Branch Protection | PR required, 1 review, CI pass, no force push | **LIVE** |
| CodeQL + Gitleaks | Security scan on all PRs + weekly schedule | **LIVE** |
| Admin k-Anonymity | Groups < 5 suppressed, no export, 100-record pagination | **LIVE** |

---

## 8. Business & Operations

### Revenue Model
Freemium-to-premium subscription optimized for asymmetric engagement:

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Private journaling, attachment quiz |
| Premium Solo | $9.99/mo | Unlimited AI coaching, exercises |
| Premium Couples | $14.99/mo | SharedChat mediation (both linked) |
| Premium+ | $24.99/mo | Crisis, priority, therapist handoff |

### Market Size
- Mental health tech: $17.5B (2028)
- Relationship wellness: $4.2B (2027)
- Conversational AI: $32.6B (2029)
- Zero competitors offer 3-way AI mediation with privacy tiers

### Competitive Moat
| Relio | Lasting/Paired | BetterHelp |
|-------|---------------|------------|
| Real-time AI mediation | Passive quizzes/exercises | Human therapists |
| 3-Tier privacy architecture | Symmetric visibility | Therapist can see all |
| $14.99/mo | $11.99/mo | $65–100/week |
| 38 specialized agents | Generic content | Single practitioner |

### Go-To-Market Strategy
1. **Therapist referral network** (20 couples therapists → 5 client referrals each)
2. **Reddit/Facebook organic** (r/relationship_advice, marriage groups)
3. **Couples influencers** (3–5 micro-influencers, lifetime access)
4. **University psych departments** (research partnerships)
5. **Product Hunt** ("Upcoming" page)

### Lean Operating Model
8 humans Y1 → 14 Y2 → 22 Y3. AI agents do 90% of work. Break-even: Q3 Y3.

---

## 9. Mobile Application

### Screens [BUILT]
| Screen | Purpose | Status |
|--------|---------|--------|
| BiometricLock | FaceID/TouchID gate before app access | **BUILT** |
| Onboarding | Profile creation, relationship stage selection | **BUILT** |
| SharedChat | Tier 3 mediated conversation (intercept & hold) | **BUILT** |
| PrivateJournal | Tier 1 venting + AI reflections | **BUILT** |
| Crisis | Safety halt response with resources | **BUILT** |
| Settings | Preferences, logout | **BUILT** |

### Components [BUILT]
- `ContextBanner` — Persistent "🔒 Only you see this" / "👥 Shared with partner" indicator

### API Client [BUILT]
- REST: `Authorization: Bearer` header from `expo-secure-store`
- WebSocket: `?token=` param, exponential backoff reconnection (1s→30s)
- Backend URL: `relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io`

### Pending
- React Navigation (tab navigator + deep linking)
- iOS TestFlight build (#73 — needs Apple Developer account)
- Solo mode (coaching, exercises)

---

## 10. Sprint History & Roadmap

### Completed (Sprint 1–10)

| Sprint | Focus | Tech Issues | Closed |
|--------|-------|-------------|--------|
| 1–2 | MVP: 5 agents + LLM Gateway + pipeline tests | 11 | 11 |
| 3 | Azure IaC: VNet, ACR, PostgreSQL, Cosmos DB, Container Apps | 10 | 10 |
| 4 | DB schemas, auth, Redis, App Insights, NSGs | 14 | 14 |
| 5 | Security hardening: JWT, Zod, CORS, fail-closed, CI security | 4 | 4 |
| 6 | Circuit breaker, Redis pub/sub, mobile ContextBanner | 3 | 3 |
| 7 | Branch protection | 1 | 1 |
| 8 | Clerk auth, consent API, mobile auth screens, backoffice | 20 | 20 |
| 9 | Partner invite, onboarding, psychoeducation, attachment quiz | 11 | 11 |
| 10 | GDPR (deletion+export), i18n (4 locales), OWASP, push, A/B tests | 16 | 16 |
| Azure | OpenAI deployment, Key Vault, cost optimization | 6 | 6 |
| **Total** | | **96** | **96** |

### Next Sprints (Planned)

| Sprint | Focus |
|--------|-------|
| 11 | iOS TestFlight, Hebrew RTL, translations |
| 12 | Stripe/RevenueCat integration + App Store submission |
| 13–16 | Beta expansion (50 → 500 couples), retention data |
| 17–24 | Series A data deck, scale to 5M architecture |

### Key Milestones

| # | Milestone | Target |
|---|-----------|--------|
| #48 | First 10 real couples on production | Sprint 9 |
| #53 | 50 couples in beta + D7 retention | Sprint 12 |
| #52 | Agent #6 + open beta (500 couples) | Sprint 14 |
| #50 | D30 retention >30% | Sprint 18 |
| #49 | Series A data deck complete | Sprint 20 |
| #51 | Close Series A + scale to 5M | Sprint 24 |

---

## 11. Cost Model

### Current Monthly Spend (~$50–70/mo pre-launch)

| Service | Cost | Notes |
|---------|------|-------|
| Container Apps | ~$0 | Scale-to-zero (min=0 replicas) |
| PostgreSQL Flex (B_Standard_B1ms) | ~$13 | 32GB storage |
| Redis (Basic C0) | ~$16 | Sessions + rate limiting |
| Cosmos DB Serverless | ~$0 | Pay-per-RU, minimal traffic |
| Azure OpenAI (GPT-4.1 GlobalStandard) | ~$5–20 | 10K TPM, usage-based |
| ACR (Basic) | ~$5 | Image storage |
| Key Vault | ~$0 | Secrets (negligible) |
| Budget alert | $50/mo | Email at 80%/100% |

### Projected at Scale

| Users | Monthly Azure | LLM Cost | Total |
|-------|--------------|----------|-------|
| 100 | $100 | $150 | $250 |
| 1,000 | $200 | $1,200 | $1,400 |
| 10,000 | $500 | $8,000 | $8,500 |
| 100,000 | $2,000 | $40,000 | $42,000 |

Model cascading (GPT-4.1-mini for 60% of calls) reduces LLM cost by ~40%.

---

## 12. Risk Matrix

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| Tier 1 data leak to partner | **CRITICAL** | RLS, no FKs, canary tests, admin Tier 3-only | **MITIGATED** |
| Safety false negative | **CRITICAL** | Fail-closed doctrine, regex pre-screen, compound rules | **PARTIALLY MITIGATED** |
| LLM service outage | HIGH | Circuit breaker (3 fail → 30s open), graceful degradation | **MITIGATED** |
| Token budget abuse | HIGH | Per-user 50K daily limit, rate limiting | **MITIGATED** |
| No clinical co-founder | HIGH | Active outreach to AAMFT/Gottman alumni (#89) | **OPEN** |
| Prompt injection | HIGH | System prompts hardened, pen-tester agent designed | **PARTIALLY MITIGATED** |
| Parasocial dependency | MEDIUM | CPsychO meta-audit agent (planned) | **PLANNED** |
| Apple App Store rejection | MEDIUM | AppStore certifier agent, privacy labels | **OPEN** |
| Competitor replication | LOW | 12–18 month architectural head start, provisional patent planned | **OPEN** |

---

## 13. Success Metrics

### North Star: Mediated Conversations Per Week Per Couple (MCPW)

| Metric | Beta Target | Scale Target |
|--------|-------------|--------------|
| Activation (first mediation within 48h) | >60% | >70% |
| MCPW | 2+ | 3+ |
| D7 retention (couple-level) | >50% | >60% |
| D30 retention | >30% | >40% |
| Free→Paid conversion | >5% | >8% |
| M1 paid churn | <15% | <8% |
| Safety halt rate | Measure | <5% |
| NPS | >40 | >50 |
| Partner B invite acceptance | >30% | >40% |

---

## Agent Skills Directory (45 skills)

| Skill | Assigned Agent(s) | Domain |
|-------|-------------------|--------|
| `detect-crisis-abuse` | safety-guardian | Safety detection |
| `socratic-translation` | communication-coach | Tier 1→3 conversion |
| `map-attachment-styles` | individual-profiler | Clinical profiling |
| `assess-early-compatibility` | phase-dating | Dating phase |
| `enforce-tier-firewall` | orchestrator | Privacy enforcement |
| `architect-dual-context-db` | CTO | Database design |
| `implement-secure-websocket` | backend-developer | Real-time infrastructure |
| `test-tier1-isolation` | fullstack-qa | Privacy testing |
| `execute-llm-red-team` | penetration-tester | Adversarial testing |
| `enforce-privacy-mechanisms` | DPO | GDPR/PII compliance |
| `design-subscription-funnel` | CRO | Revenue optimization |
| `draft-medical-disclaimer` | CLO | Legal compliance |
| `build-admin-api` | backend-developer | Backoffice API |
| `design-admin-dashboard` | ui-ux-expert | Backoffice UI |
| `build-kql-workbooks` | cloud-architect | Azure Monitor analytics |
| `test-admin-privacy` | fullstack-qa | Admin privacy testing |
| `design-subscription-analytics` | CRO, CFO | Revenue metrics |
| `collect-user-feedback` | CPO, mobile-dev | Feedback system |
| *... and 27 more domain-specific skills* | | |

---

*This document is the single authoritative PRD for the Relio project. It supersedes all prior versions (v1.0.0–v1.8.0) and all pod-level PRDs (medical, tech, ops). Any conflict between this document and a pod PRD is resolved in favor of this document.*

*Last reviewed by: @chief-executive-officer, @chief-technology-officer, @chief-product-officer, @chief-strategy-officer, @chief-psychology-officer — March 16, 2026*
