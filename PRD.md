# Relio — Unified Product Requirements Document

**Version:** v4.0.0
**Date:** March 29, 2026
**Authors:** All 38 agents across Medical Pod (`chief-psychology-officer`), Tech Pod (`chief-technology-officer`), and Ops Pod (`chief-executive-officer`)
**Classification:** Confidential — Board & Executive Leadership
**Status:** Sprint 17 complete. Solo venting mode live. Pricing pivoted to Free/$4.99/$9.99. Market validation survey analyzed (101 responses). 176 tests. Deployed to ACA sprint17.

> **Supersedes:** PRD v1.0.0–v3.0.0

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

Relio is the world's first AI-powered 3-way relationship mediator — a private, neutral third party that sits between two partners and transforms hostile, blame-laden communication into natural, warm, everyday conversation prompts. It is not therapy. It is structured mediation informed by evidence-based clinical frameworks (Gottman Method, Emotionally Focused Therapy, Adult Attachment Theory), delivered by 38 specialized AI agents, and protected by a privacy architecture that is physically incapable of leaking one partner's private words to the other.

**Tone Philosophy (v3.0.0 — CSO + CPsychO + CMO joint directive):**
Clinical frameworks power the reasoning. The output sounds like a caring friend — not a therapist, not a textbook. Each language uses its own natural register: EN contractions, ES tuteo, PT-BR informal, HE spoken Israeli (תשמע, יאללה, תכלס). See `israeli-hebrew-tone-guide` skill for HE cultural rules.

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
- **PII Redaction** before all LLM calls: emails, phones, SSNs, addresses stripped with token substitution (pre-flight + post-flight validation)
- **Canary string injection tests** in CI: 44 tests prove Tier 1 data NEVER appears in Tier 3 payloads (including Unicode Hebrew/Chinese canaries)
- **Admin dashboard** connects ONLY to Tier 3 — physically cannot query Tier 1/2
- **WebSocket relay** via Redis pub/sub — Tier 3 messages only cross replica boundaries

---

## 3. Multi-Agent Architecture

### 38 Agents Across 3 Pods

**5 IMPLEMENTED [LIVE]** | 33 PLANNED

*Note: Emergency Response + Phase-Crisis are live in code (v2.5.0) but listed below with their production models.*

#### Medical Pod (14 agents)

| Agent | Status | Model (Production) | Role |
|-------|--------|-------------------|------|
| `safety-guardian` | **[LIVE]** | GPT-4.1 via Azure OpenAI | Absolute veto. Detects DV, suicidal ideation, child abuse. Multi-language regex pre-screen (EN/ES/PT/HE). **Fail-closed on parse error.** |
| `orchestrator-agent` | **[LIVE]** | GPT-4.1 | Routes messages through 3-Tier Model. Classifies intent + emotional intensity. |
| `communication-coach` | **[LIVE]** | GPT-4.1-mini | Transforms Tier 1 hostile language into casual, warm Tier 3 conversation prompts. Horseman-aware differentiation stays in reasoning; output sounds like a friend mediating. Language-native slang per locale. |
| `individual-profiler` | **[LIVE]** | GPT-4.1-mini | Evaluates attachment style (anxious/avoidant/secure/disorganized) and activation state. Sub-state classification (protest vs hyperactivation). |
| `phase-dating` | **[LIVE]** | GPT-4.1-mini | Early compatibility, boundaries, red flags, digital trust, love-bombing detection. |
| `emergency-response-agent` | **[LIVE]** | GPT-4.1-mini | Executes emergency protocols on SAFETY_HALT. Region-specific resources (US/BR/IL). Warm, caring tone — not hotline script. |
| `phase-crisis` | **[LIVE]** | GPT-4.1-mini | Flooding detection, 20-min structural pauses with casual messaging, repair attempts. |
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
    ├──► [0] PII REDACTOR (regex, pre-flight)
    │         └── Names, emails, phones, addresses, SSNs stripped
    │         └── Safety Guardian sees ORIGINAL (for accurate crisis detection)
    │
    ├──► [1] SAFETY GUARDIAN (GPT-4.1)
    │         ├── Multi-language regex pre-screen (EN/ES/PT/HE) [LIVE]
    │         ├── SAFE → Continue
    │         ├── Parse failure → HALT (fail-closed)
    │         └── HIGH/CRITICAL → SAFETY_HALT → Emergency Response [LIVE]
    │
    ├──► [2] ORCHESTRATOR + INDIVIDUAL PROFILER (parallel, GPT-4.1 + GPT-4.1-mini)
    │         ├── Tier classification, intent, emotional intensity
    │         └── Attachment style, activation state
    │
    ├──► [3] COMMUNICATION COACH (GPT-4.1-mini)
    │         └── Tier 1 → Tier 3 casual, warm conversation prompt
    │         └── Language-native output (EN/ES/PT/HE with slang)
    │
    └──► [4] PII POST-FLIGHT VALIDATOR
              └── Scans Tier 3 output for leaked PII → strips matches
```

**Average pipeline latency:** ~7s (4 LLM calls, 2 parallelized)

### Safety Guardian Specifics [LIVE]
- Severity levels: SAFE, LOW, MEDIUM, HIGH, CRITICAL
- Compound rule: contempt + withdrawal → MEDIUM (Gottman, 1994)
- **Regex pre-screen layer** [LIVE]: Multi-language crisis keyword detection (EN/ES/PT/HE) before LLM call
- **Fail-closed doctrine**: ANY parse failure defaults to `severity: HIGH, halt: true`
- **Emergency Response** [LIVE]: Region-specific resources (US 988/DV/911, BR CVV/180/SAMU, IL ERAN/MDA)
- **Phase-Crisis** [LIVE]: Flooding detection (rapid-fire, ALL CAPS, contempt+withdrawal), 20-min structural pause with casual messaging

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

### Database Layer [LIVE — Sprint 13]
- **Connection**: Dual-pool `pg` driver (`pool.ts`) — separate connections for Tier 1 and Tier 3 databases, SSL/TLS required, configurable pooling, graceful shutdown
- **Tier 1 Repository** (`tier1-repo.ts`): `users`, `tier1_messages` (RLS via `SET LOCAL app.current_user_id`), `safety_audit_log`, `journal_entries`, 90-day auto-purge
- **Tier 3 Repository** (`tier3-repo.ts`): `rooms`, `room_members`, `tier3_messages`, `sessions`, `room_invites`
- **Auth Repository** (`auth-repo.ts`): `consent_records`, `consent_audit` (immutable)
- **Deletion Repository** (`deletion-repo.ts`): GDPR cascade deletion across both databases, 24h grace period
- **Migration Runner** (`migrate.ts`): Idempotent SQL schema application on startup (`AUTO_MIGRATE=true`)
- **In-Memory Fallback**: All routers gracefully degrade to Maps when `POSTGRES_TIER1_URL` is not set (dev mode)
- **No foreign keys** between Tier 1 and Tier 3 databases

### PII Redaction Pipeline [LIVE — Sprint 13]
- **Pre-flight** (`pii-redactor.ts`): Regex-based detection of PERSON, EMAIL, PHONE, ADDRESS, ID_NUMBER, URL — strips before Orchestrator/Profiler/Coach LLM calls
- **Post-flight** (`pii-validator.ts`): Scans Tier 3 output for leaked PII entities, strips any matches
- **Safety Guardian exception**: Sees original un-redacted message for accurate crisis detection
- **Audit**: Detected entities stored in Tier 1 safety audit log (never in Tier 3)

### WebSocket Relay [LIVE — Sprint 13]
- **Redis pub/sub** (`ws-relay.ts`): Cross-replica Tier 3 message fan-out via `room:{roomId}` channels
- **Lifecycle**: Subscribe on first connection, unsubscribe on last disconnect
- **Fallback**: Local EventEmitter when Redis unavailable (single-replica mode)

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
Freemium-to-premium subscription optimized for asymmetric engagement (CRO mandate: solo user gets standalone value even without partner joining):

| Tier | Price | Features |
|------|-------|---------|
| Free | $0 | Private journaling, attachment quiz, AI reflections, psychoeducation cards |
| Premium Couples | $19.99/mo | SharedChat mediation + weekly 60-min sessions + progress tracking (both partners included) |
| Premium+ | $29.99/mo | Crisis priority, therapist handoff, reserved response time |

**Unit Economics (CFO validated, Sprint 13):**
- AI COGS per couple: $1.72/mo (weekly 60-min text session + 4 daily messages)
- Infrastructure (amortized at 100+): $0.42/couple/mo
- **Gross margin: 89.3%** at $19.99

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

### Completed (Sprint 1–12 + Backlog)

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
| 11 | Full translations (ES/PT/HE), push templates, legal translations | 5 | 5 |
| 12 | Multi-language safety QA, App Store listings, mixed-lang E2E | 3 | 3 |
| **13** | **PostgreSQL data layer, PII redaction, canary leak tests, WS relay** | **6** | **6** |
| Medical | Emergency Response, Phase-Crisis, CPsychO, regex pre-screen | 4 | 4 |
| Ops | ToS, Privacy, incorporation, waitlist, fundraise, interviews | 27 | 27 |
| Azure | OpenAI deployment, Key Vault, cost optimization | 6 | 6 |
| **Total** | | **141** | **141** |

### Next Sprints (Planned)

| Sprint | Focus |
|--------|-------|
| 13+ | Stripe/RevenueCat, iOS TestFlight (#73), scale to 500 couples |
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

### Projected at Scale (CFO updated — Sprint 13 cost model)

| Couples | Monthly Azure | LLM Cost | Total | Revenue ($19.99) | Gross Margin |
|---------|--------------|----------|-------|-------------------|-------------|
| 100 | $42 | $172 | $214 | $1,999 | 89.3% |
| 1,000 | $257 | $1,720 | $1,977 | $19,990 | 90.1% |
| 10,000 | $824 | $17,200 | $18,024 | $199,900 | 91.0% |

Model cascading (GPT-4.1-mini for Coach+Profiler+Dating, GPT-4.1 for Safety+Orchestrator) built into production.

---

## 12. Risk Matrix

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| Tier 1 data leak to partner | **CRITICAL** | RLS, no FKs, 44 canary tests (incl. Unicode), admin Tier 3-only, PII redaction pre+post-flight | **MITIGATED** |
| Safety false negative | **CRITICAL** | Fail-closed doctrine, multi-lang regex pre-screen (EN/ES/PT/HE), compound rules, Emergency Response agent [LIVE] | **MITIGATED** |
| LLM service outage | HIGH | Circuit breaker (3 fail → 30s open), graceful degradation | **MITIGATED** |
| Token budget abuse | HIGH | Per-user 50K daily limit, rate limiting | **MITIGATED** |
| No clinical co-founder | HIGH | Active outreach to AAMFT/Gottman alumni (#89) | **OPEN** |
| Prompt injection | HIGH | System prompts hardened, pen-tester agent designed, PII redaction strips identifying data | **PARTIALLY MITIGATED** |
| Data loss on restart | **RESOLVED** | PostgreSQL persistence live (Sprint 13), dual-pool + in-memory fallback | **MITIGATED** |
| Multi-replica WS isolation | **RESOLVED** | Redis pub/sub relay (Sprint 13), local EventEmitter fallback | **MITIGATED** |
| PII in LLM context | **RESOLVED** | Pre-flight regex redactor + post-flight validator (Sprint 13) | **MITIGATED** |
| Parasocial dependency | MEDIUM | CPsychO meta-audit agent (planned) | **PLANNED** |
| Apple App Store rejection | MEDIUM | AppStore certifier agent, privacy labels | **OPEN** |
| Competitor replication | LOW | 12–18 month architectural head start, provisional patent planned | **OPEN** |
| npm vulnerabilities | LOW | npm audit fix in CI, automated dependency scanning | **MITIGATED** |

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

## Agent Skills Directory (61 skills)

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
| `implement-gdpr-account-deletion` | backend-dev, CISO, DPO | GDPR Article 17 deletion |
| `harden-auth-owasp` | CISO, backend-dev, pen-tester | OWASP auth hardening |
| `implement-push-notifications` | backend-dev, mobile-dev, DPO | Push notifications |
| `implement-ab-testing` | backend-dev, CRO | A/B test infrastructure |
| `configure-biometric-gate` | mobile-dev, CISO | Biometric enforcement |
| `implement-consent-reprompt` | backend-dev, DPO, CISO | Consent version tracking |
| *... and 37 more domain-specific skills* | | |

### Automated Test Coverage (v3.0.0 — 156 tests)

| Suite | Tests | Focus |
|-------|-------|---------|
| Canary Leak Detection | 44 | Tier 1 → Tier 3 isolation proof (7 canary strings, Unicode, deep JSON scan) |
| Integration | 20 | Full API user journey (health → consent → invite → mediate → admin → delete) |
| PII Redaction | 18 | Email, phone, SSN, address, URL, name detection + post-flight validation |
| WebSocket Relay | 13 | Cross-replica pub/sub, room lifecycle, message fidelity, burst test |
| Safety Multilang | 50 | Crisis keyword pre-screen (EN/ES/PT/HE + edge cases) |
| Pipeline | 3 | Pipeline unit tests |
| Canary Basic | 8 | Baseline canary checks |

---

## 14. Voice of Each Pod — v3.0.0 Review

### Medical Pod (`chief-psychology-officer`)
> "Sprint 13 delivered the database persistence needed for longitudinal clinical analysis. PII redaction before LLM calls is a clinical milestone — we can now guarantee that patient names never enter model context (except Safety Guardian, which needs originals for accurate crisis detection). The casual tone overhaul aligns with our parasocial prevention mandate: formal language creates a therapist dynamic we explicitly want to avoid. The Israeli Hebrew glossary correctly identifies that volume ≠ severity in Israeli couples — our flooding detection must not over-trigger on cultural directness."

### Tech Pod (`chief-technology-officer`)
> "The data layer gap was our #1 technical debt — now resolved. Dual-pool PostgreSQL with RLS enforcement, 4 repository modules, and idempotent migrations give us production-grade persistence with graceful local dev fallback. The WebSocket relay via Redis pub/sub enables horizontal scaling. 44 canary leak tests provide CI-enforced proof that the 3-Tier Model holds under adversarial conditions. 156 total tests, 0 TS errors, both CI pipelines green."

### Ops Pod (`chief-executive-officer`)
> "Revenue model updated to $19.99 with 89% gross margins validated by the CFO. The casual tone overhaul is a market positioning decision — we are NOT a therapy app, we're the friend who helps couples talk. The Hebrew glossary is critical for our Israel launch market. Cost projections now use actual GPT-4.1/4.1-mini pricing with model cascading built in. Bootstrap path remains viable: $214/mo at 100 couples against $1,999 revenue."

### CSO Synthesis (`chief-strategy-officer`)
> "Three strategic shifts in v3.0.0: (1) Tone — moving from clinical Socratic to casual friend-mediating is the right differentiation against BetterHelp's clinical posture and Lasting's quiz format. (2) Pricing — $19.99 at 89% margin gives runway to add voice later as a $29.99 tier without margin pressure. (3) Hebrew-first cultural adaptation — sets the precedent for per-locale tone guides (Arabic, Hindi, Japanese next). The 3-Tier architecture remains the defensible moat. Provisional patent filing should proceed before any investor meetings."

---

*This document is the single authoritative PRD for the Relio project. It supersedes all prior versions (v1.0.0–v2.3.0) and all pod-level PRDs (medical, tech, ops). Any conflict between this document and a pod PRD is resolved in favor of this document.*

*Last reviewed by: @chief-executive-officer, @chief-technology-officer, @chief-product-officer, @chief-strategy-officer, @chief-psychology-officer — March 26, 2026*
