# Relio — Unified Product Requirements Document

**Version:** v1.0.0
**Date:** March 15, 2026
**Authors:** `chief-executive-officer` (GPT-5.4), `chief-psychology-officer` (Claude Opus 4.6), `chief-strategy-officer` (GPT-5.4)
**Classification:** Confidential — Board & Executive Leadership
**Status:** APPROVED — Master Document

---

## Table of Contents

1. [Product Vision & Mission](#1-product-vision--mission)
2. [The 3-Tier Confidentiality Model](#2-the-3-tier-confidentiality-model)
3. [Multi-Agent Architecture Overview](#3-multi-agent-architecture-overview)
4. [Clinical Capabilities](#4-clinical-capabilities)
5. [Technical Architecture](#5-technical-architecture)
6. [Business Strategy](#6-business-strategy)
7. [Cross-Pod Dependencies](#7-cross-pod-dependencies)
8. [Unified Risk Matrix](#8-unified-risk-matrix)
9. [Unified Timeline & Roadmap](#9-unified-timeline--roadmap)
10. [Unified Cost Model](#10-unified-cost-model)
11. [Success Metrics Dashboard](#11-success-metrics-dashboard)
12. [Legal & Compliance Summary](#12-legal--compliance-summary)
13. [Team & Organizational Structure](#13-team--organizational-structure)
14. [Appendices](#14-appendices)

---

## 1. Product Vision & Mission

### What Relio Is

Relio is the world's first AI-powered 3-way relationship mediator — a private, neutral third party that sits between two partners (or co-parents) and transforms hostile, blame-laden communication into constructive, Socratic dialogue. It is not therapy. It is not a chatbot. It is structured mediation informed by evidence-based clinical frameworks (Gottman Method, Emotionally Focused Therapy, Adult Attachment Theory), delivered by 37 specialized AI agents, and protected by a privacy architecture that is physically incapable of leaking one partner's private words to the other.

### Who It Serves

Relio serves couples across the full relationship lifecycle:

- **Dating couples** (6–18 months) building healthy communication habits early
- **Committed partners** deepening intimacy and navigating perpetual conflicts
- **Couples in crisis** experiencing acute emotional flooding and escalation
- **Separating couples** managing logistics, grief, and asset division without further damage
- **Divorced co-parents** coordinating child welfare through structured, low-conflict messaging

The app delivers genuine value even when only one partner subscribes (solo journaling, 1-on-1 AI coaching, attachment profiling, psychoeducation). The "reluctant partner" problem is solved through architecture, not persuasion — Partner B's first experience is absolute privacy, not a sales pitch.

### Why Now

Three converging forces make this the moment:

1. **LLM capability inflection.** Models like Claude Opus 4.6 and GPT-5.4 now possess the linguistic nuance to detect sarcasm, extract unmet attachment needs from hostile language, and produce Socratic questions that feel genuinely therapeutic. This was impossible 18 months ago.
2. **Market vacuum.** The $17.5B mental health tech market and $4.2B relationship wellness market have zero products offering real-time 3-way AI mediation with privacy tiers. Lasting offers exercises. Paired offers quizzes. BetterHelp offers human therapists at $65–100/week. Nobody mediates live conversations between two people with an AI that holds secrets.
3. **Trust crisis in AI.** Users are increasingly skeptical of AI handling sensitive data. A product whose privacy is *architecturally enforced* — not policy-promised — has a defensibility window of 12–18 months before competitors can replicate the infrastructure.

### Core Thesis

**Privacy-architecture is the moat, not privacy-policy as a feature.** Every competitor can write a privacy policy. No competitor has a database architecture where Tier 1 private data physically cannot be JOINed with another user's data, where there is no API endpoint to surface raw private content, where the AI's transformation from raw complaint to Socratic question is validated by a meta-audit agent before delivery. This is not a checkbox — it is the product.

### Non-Negotiable Principles

1. **Do No Harm.** The Safety Guardian holds absolute veto power. No optimization, engagement metric, or business KPI overrides a safety signal.
2. **Privacy Is Architecture, Not Policy.** The 3-Tier Confidentiality Model is enforced at the data layer, network layer, and application layer. There is no admin override that surfaces raw private content to a partner.
3. **The AI Is a Bridge, Not a Destination.** Parasocial dependency is a product failure, not an engagement win. Every interaction is designed to turn users toward their partner.
4. **Revenue Never Degrades Privacy.** Monetization that compromises the 3-Tier Model is rejected unconditionally. No selling data. No "upgrade to see what your partner said." No paywalling safety features.
5. **Clinical Decisions Are Independent of Business Metrics.** The Medical Pod operates autonomously from revenue targets. Model selection is driven by clinical requirements, not cost optimization.

---

## 2. The 3-Tier Confidentiality Model

### The Defining Innovation

The 3-Tier Confidentiality Model is Relio's single most important technical and product innovation. It is the reason users will trust the app with their most vulnerable thoughts. It is the reason competitors cannot replicate Relio by bolting a chatbot onto an existing couples app. It is the architectural foundation of every design decision across all three pods.

### How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TIER 1 (PRIVATE)                            │
│  Owner: Individual user ONLY                                        │
│  Contains: Raw transcripts, venting, specific complaints,           │
│            names, accusations, private journals                     │
│  Access: User themselves + Safety Guardian (read-only monitor)      │
│          + Individual Profiler (read-only for attachment mapping)    │
│  Storage: Per-user isolated database partition (separate subnet,    │
│           NO internet gateway, NO VPC peering)                      │
│  Rule: NEVER crosses user boundary. NEVER enters shared room.      │
│         NEVER transmitted to partner's device/session.              │
│         No SQL JOINs across user partitions.                        │
│         No API endpoint accepts two different user_ids.             │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    [ABSTRACTION LAYER]
                    Individual Profiler extracts patterns.
                    Relationship Dynamics detects cycles.
                    Phase agents contextualize stage.
                    ALL specific language, names, quotes STRIPPED.
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       TIER 2 (ABSTRACTED)                           │
│  Owner: Medical Pod internal                                        │
│  Contains: "Anxious attachment activated", "Criticism pattern       │
│            detected", "Pursue-withdraw cycle in progress",          │
│            love language scores, conflict duration metrics           │
│  Access: All Medical Pod agents (read/write)                        │
│          Orchestrator (read for routing)                             │
│          CPO (read for meta-audit)                                  │
│  Storage: Medical Pod internal database                             │
│  Rule: NEVER exposed to end users directly.                         │
│         Not accessible by Ops or Tech pods except via               │
│         aggregated, anonymized analytics endpoints.                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    [TRANSLATION LAYER]
                    Communication Coach applies Socratic method.
                    Strips clinical jargon.
                    Converts diagnosis into constructive question.
                    CPO validates output safety.
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      TIER 3 (ACTIONABLE)                            │
│  Owner: Shared mediation room                                       │
│  Contains: Socratic questions, de-escalated guidance,               │
│            exercise prompts, progress summaries,                    │
│            timeout notifications                                    │
│  Access: Both partners (read), Shared room (display)                │
│  Storage: Shared session database (separate private subnet)         │
│  Rule: Must NEVER contain identifiable Tier 1 phrasing.             │
│         Must NEVER reveal which partner said what.                  │
│         Must NEVER contain clinical diagnostic labels.              │
│         All outputs are non-directive (Socratic).                   │
│         CPO audit stamp required before delivery.                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Why It's Architecturally Enforced

The 3-Tier Confidentiality Model is not a prompt instruction. It is not a policy document. It is enforced through:

| Layer | Enforcement Mechanism |
|-------|----------------------|
| **Network** | Tier 1 databases reside in an isolated private subnet with NO internet gateway, NO NAT, NO VPC peering. Access ONLY via internal service mesh from the application tier. |
| **Database** | Separate PostgreSQL instances per tier. No cross-database foreign keys. `shared_room.user_a_id` and `user_b_id` are opaque UUIDs — not foreign keys to any private store. `CHECK` constraints enforce immutable tier classification. |
| **Application** | Separate ORM connection pools per tier. No code path can query two users' Tier 1 stores in a single operation. |
| **LLM Pipeline** | PII redaction engine strips names, locations, and identifiers before any LLM API call. Post-flight validation scans LLM output against recent Tier 1 phrases. |
| **Meta-Audit** | The CPO agent validates every Tier 3 output before delivery for clinical soundness, bias, and Tier 1 leakage. |
| **CI/CD** | Canary string injection tests run on every PR. If any Tier 1 canary string appears in any Tier 3 payload, the entire build fails. |
| **IAM** | WebSocket servers have explicit `DENY` policies for Tier 1 database ARNs. Only the Intercept & Hold service can write to Tier 1. |

### Why This Makes Relio Uncopyable

A competitor adding "private mode" to their couples app gains nothing. Their database still has JOINable tables. Their API still has endpoints that can surface raw content. Their prompt can be jailbroken. Relio's isolation is physical, network-enforced, and cryptographically backed. Replicating it requires rebuilding the entire data architecture from scratch — a 12–18 month engineering effort that cannot be incrementally retrofitted.

---

## 3. Multi-Agent Architecture Overview

### Why Multi-Agent, Not Monolithic

A monolithic AI cannot hold the responsibilities of relationship mediation. It cannot simultaneously be a safety monitor, an attachment theorist, a crisis de-escalator, a logistical mediator, a psychoeducator, and a business strategist. Each clinical function must be auditable in isolation. Safety signals must propagate independently of system load. Model selection must be driven by task requirements, not one-size-fits-all cost optimization.

Relio's 37 agents are organized into three pods, each with distinct authority and isolation boundaries.

### Pod Responsibilities

| Pod | Mission | Agent Count | Authority Boundary |
|-----|---------|-------------|-------------------|
| **Medical Pod** | Clinical nervous system. Interpret, classify, and transform raw emotional language into safe, therapeutically grounded guidance. | 13 | Clinical decisions are never influenced by revenue targets. Safety signals propagate independently. |
| **Tech Pod** | Design, build, operate, and defend the secure, scalable, privacy-first infrastructure. | 15 | Infrastructure decisions enforce the 3-Tier Model as a hard invariant. |
| **Ops Pod** | Transform clinical capabilities into sustainable, legally compliant, commercially dominant business. | 9 | Revenue never degrades the 3-Tier Model. Monetization reinforces the moat. |

### Combined System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RELIO: 37-AGENT SYSTEM                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      MEDICAL POD (13 agents)                    │   │
│  │                                                                  │   │
│  │   User Input ──► Safety Guardian (parallel) ──► Orchestrator    │   │
│  │                      ──► Individual Profiler                     │   │
│  │                      ──► Relationship Dynamics                   │   │
│  │                      ──► Phase Router:                           │   │
│  │                          ├── phase-dating                        │   │
│  │                          ├── phase-commitment                    │   │
│  │                          ├── phase-crisis (can interrupt ANY)    │   │
│  │                          ├── phase-separation                    │   │
│  │                          └── phase-post-divorce                  │   │
│  │                      ──► Communication Coach (Tier 1→Tier 3)    │   │
│  │                      ──► Psychoeducation Agent                   │   │
│  │                      ──► Progress Tracker                        │   │
│  │                      ──► CPO Meta-Audit ──► Tier 3 Output       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              ▲           │                              │
│                              │           ▼                              │
│  ┌──────────────────────┐    │    ┌──────────────────────────────┐     │
│  │   TECH POD (15)      │◄───┘    │       OPS POD (9)            │     │
│  │                      │         │                              │     │
│  │  Infrastructure:     │         │  Revenue: CRO, CFO, CMO     │     │
│  │  CTO, Backend Dev,   │         │  Strategy: CEO, CSO, CCO    │     │
│  │  Cloud Architect,    │         │  Compliance: CLO, CAO       │     │
│  │  GitHub Architect    │         │  Product: CPO                │     │
│  │                      │         │                              │     │
│  │  Mobile:             │         │  Owns: Pricing, GTM,        │     │
│  │  Native Mobile Dev,  │         │  Partnerships, Legal,       │     │
│  │  Mobile QA           │         │  International Expansion    │     │
│  │                      │         │                              │     │
│  │  Security:           │◄────────┤  Cross-Pod:                  │     │
│  │  CISO, DPO,          │         │  Duty-to-warn escalation,   │     │
│  │  Penetration Tester  │         │  Cost optimization loops,   │     │
│  │                      │         │  App Store compliance        │     │
│  │  Meta: Skills Builder│         │                              │     │
│  │  Ops: Scrum Master,  │         │                              │     │
│  │  VP R&D, UX Expert,  │         │                              │     │
│  │  App Store Certifier │         │                              │     │
│  └──────────────────────┘         └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Full Agent Directory (37 Agents)

| # | Agent | Pod | Model | Primary Function |
|---|-------|-----|-------|-----------------|
| 1 | `orchestrator-agent` | Medical | GPT-5.4 | Primary routing, access control, tier classification |
| 2 | `communication-coach` | Medical | Claude Opus 4.6 | Tier 1→Tier 3 Socratic translation |
| 3 | `safety-guardian` | Medical | Gemini 3.1 Pro | Absolute veto authority; DV/abuse/suicide detection |
| 4 | `individual-profiler` | Medical | Claude Sonnet 4.6 | Attachment style mapping, love language tracking |
| 5 | `relationship-dynamics` | Medical | Claude Sonnet 4.6 | Negative cycle detection, Four Horsemen scanning |
| 6 | `phase-dating` | Medical | Claude Sonnet 4.6 | Early-stage guidance, red flag identification |
| 7 | `phase-commitment` | Medical | Claude Sonnet 4.6 | Sound Relationship House framework |
| 8 | `phase-crisis` | Medical | Claude Opus 4.6 | Flooding detection, 20-Min Timeout, repair facilitation |
| 9 | `phase-separation` | Medical | Claude Sonnet 4.6 | Logistical mediation, grief processing |
| 10 | `phase-post-divorce` | Medical | Claude Sonnet 4.6 | BIFF/Gray Rock co-parenting communication |
| 11 | `psychoeducation-agent` | Medical | Gemini 3.1 Pro | Personalized exercises, micro-learnings |
| 12 | `progress-tracker` | Medical | GPT-5.2 | Non-shaming metrics, conflict cycle duration |
| 13 | `chief-psychology-officer` | Medical | Claude Opus 4.6 | Meta-audit, bias detection, parasocial dependency monitoring |
| 14 | `chief-technology-officer` | Tech | GPT-5.4 | Technical strategy, architecture decisions |
| 15 | `backend-developer` | Tech | GPT-5.3-Codex | API development, microservices |
| 16 | `cloud-architect` | Tech | GPT-5.3-Codex | VPC design, IaC, scaling policies |
| 17 | `github-architect` | Tech | GPT-5.3-Codex | CI/CD pipelines, repository governance |
| 18 | `native-mobile-developer` | Tech | GPT-5.3-Codex | iOS (Swift/SwiftUI) + Android (Kotlin/Compose) |
| 19 | `mobile-qa` | Tech | GPT-5.3-Codex | Mobile testing, cross-platform parity |
| 20 | `fullstack-qa` | Tech | GPT-5.3-Codex | E2E testing, canary string injection, privacy regression |
| 21 | `penetration-tester` | Tech | GPT-5.3-Codex | Prompt injection attacks, adversarial testing |
| 22 | `ui-ux-expert` | Tech | Claude Sonnet 4.6 | Design systems, accessibility, Privacy/Shared Mode UX |
| 23 | `chief-info-security-officer` | Tech | GPT-5.4 | Security posture, incident response, SOC 2 |
| 24 | `data-privacy-officer` | Tech | GPT-5.4 | GDPR/HIPAA compliance, data lifecycle |
| 25 | `app-store-certifier` | Tech | Claude Sonnet 4.6 | Apple/Google policy compliance, privacy labels |
| 26 | `skills-builder` | Tech | Claude Opus 4.6 | Meta-prompt engineering, EvoSkill refinement loop |
| 27 | `scrum-master` | Tech | GPT-5.4 | Sprint planning, backlog management, velocity |
| 28 | `vp-rnd` | Tech | GPT-5.4 | Model evaluation, cost optimization, R&D strategy |
| 29 | `chief-executive-officer` | Ops | GPT-5.4 | Mission authority, 3-Tier Model integrity, roadmap |
| 30 | `chief-revenue-officer` | Ops | GPT-5.2 | Monetization, asymmetric funnel, pricing |
| 31 | `chief-finance-officer` | Ops | GPT-5.2 | Unit economics, LLM cost optimization, burn rate |
| 32 | `chief-marketing-officer` | Ops | Claude Sonnet 4.6 | Brand positioning, stage-specific messaging, content |
| 33 | `chief-compete-officer` | Ops | GPT-5.4 | Competitive intelligence, threat assessment |
| 34 | `chief-alliance-officer` | Ops | Claude Opus 4.6 | Partnerships, clinical network agreements |
| 35 | `chief-legal-officer` | Ops | Claude Opus 4.6 | Medical disclaimers, duty-to-warn, regulatory compliance |
| 36 | `chief-product-officer` | Ops | Claude Sonnet 4.6 | User stories, clinical-UX merger, acceptance criteria |
| 37 | `chief-strategy-officer` | Ops | GPT-5.4 | Platform lifecycle, international expansion, R&D priorities |

---

## 4. Clinical Capabilities

*Deep-dive: [docs/PRD-medical-pod.md](docs/PRD-medical-pod.md)*

### 4.1 Clinical Pipeline

Every user message transits the full pipeline. No shortcut paths exist. No agent can be bypassed.

```
User Input (Tier 1 Raw)
    │
    ├──► [1] SAFETY GUARDIAN (Parallel Monitor — Gemini 3.1 Pro)
    │         ├── SAFE → Continue
    │         └── THREAT → HARD STOP → Emergency Protocol
    │
    ▼
[2] ORCHESTRATOR (GPT-5.4) — Classify, route, enforce access control
    ▼
[3] INDIVIDUAL PROFILER (Claude Sonnet 4.6) — Attachment mapping
    ▼
[4] RELATIONSHIP DYNAMICS (Claude Sonnet 4.6) — Cycle detection, Four Horsemen
    ▼
[5] PHASE ROUTER → dating | commitment | crisis | separation | post-divorce
    ▼
[6] COMMUNICATION COACH (Claude Opus 4.6) — Tier 1→Tier 3 Socratic translation
    ▼
[7] PSYCHOEDUCATION AGENT (Gemini 3.1 Pro) — Adaptive exercises
    ▼
[8] PROGRESS TRACKER (GPT-5.2) — Non-shaming metrics
    ▼
[9] CHIEF PSYCHOLOGY OFFICER (Claude Opus 4.6) — Meta-audit → Tier 3 delivery
```

### 4.2 Key Clinical Frameworks

**Gottman Method** — Primary evidence base:
- **Four Horsemen**: Criticism, Contempt, Defensiveness, Stonewalling — detected by `relationship-dynamics`, antidotes delivered via `communication-coach`
- **Sound Relationship House (7 Levels)**: Evaluated by `phase-commitment` to assess partnership depth
- **5:1 Ratio**: Stable relationships maintain ≥5 positive interactions per negative; tracked by `progress-tracker`
- **Repair Attempts**: Success/failure rate monitored by `phase-crisis` as key diagnostic

**Emotionally Focused Therapy (EFT)** — Attachment-based conflict understanding:
- Negative cycles are caused by unmet attachment needs, not fight content
- `individual-profiler` maps attachment styles; `communication-coach` formulates output that speaks to the need, not the behavior

**Adult Attachment Theory** — Four styles mapped by `individual-profiler`:

| Style | Behavior in Conflict | Core Fear | Core Need |
|-------|---------------------|-----------|-----------|
| Anxious | Protest, escalation, reassurance-seeking | Abandonment | Reassurance of commitment |
| Avoidant | Withdrawal, minimizing, emotional distancing | Engulfment | Space and independence |
| Secure | Direct communication, empathy, repair initiation | None dominant | Mutual respect and honesty |
| Disorganized | Contradictory approach-avoid | Both abandonment AND engulfment | Safety and predictability |

**Gray Rock / BIFF** — High-conflict frameworks used by `phase-post-divorce`:
- Gray Rock: Make interactions boring, factual, emotionally flat
- BIFF: Brief, Informative, Friendly, Firm — all co-parenting messages filtered through this

**Socratic Method** — Core technique of `communication-coach`:
- Ask, don't tell. Reflect, don't diagnose. Explore, don't prescribe.
- Example: Tier 1 *"She's selfish and only cares about herself"* → Tier 3 *"Feeling valued in a relationship is essential. What are some ways you've each felt appreciated recently?"*

**20-Minute Timeout Protocol** — Based on Gottman's DPA research:
- When text-based flooding markers detected (ALL-CAPS, rapid-fire messages, emotional spiraling)
- Shared room locked for 20 minutes (UI enforcement)
- Individual calming exercises offered in Tier 1
- Post-timeout: structured repair attempt facilitation

### 4.3 Safety Guardian: Absolute Veto

The Safety Guardian does NOT sit "in" the pipeline — it monitors from the outside on a separate evaluation thread. It receives a copy of every Tier 1 input in real time.

**Detection Capabilities:**
- Explicit threats of harm, physical violence descriptions, suicidal language
- Contextual pattern detection: escalating coercive control, isolation tactics, DARVO
- Child endangerment signals, parental alienation language

**Severity Levels:**
- `LOW`: Flag for review
- `MEDIUM`: Alert CPO, increase monitoring
- `HIGH`: Immediate `SAFETY_HALT`
- `CRITICAL`: Hard lockout + emergency resource delivery

**On SAFETY_HALT:**
1. Pipeline execution immediately halted mid-stream
2. All pending Tier 3 outputs quarantined
3. Affected user receives localized emergency resources
4. Session locked — only human clinical reviewer can clear

No agent — including the Orchestrator and CPO — can override a Safety Guardian `SAFETY_HALT`.

### 4.4 Relationship Stage Lifecycle

```
                    ┌──────────────────────────┐
                    │      CRISIS MODE         │
                    │   Can activate at ANY     │
                    │   stage when flooding     │
                    │   is detected             │
                    └──────┬───────────────────┘
                           │ (interrupts/resumes)
    ┌──────────┐    ┌──────┴─────┐    ┌────────────┐    ┌──────────────┐
    │  DATING  │───►│ COMMITMENT │───►│ SEPARATION │───►│ POST-DIVORCE │
    └──────────┘    └────────────┘    └────────────┘    └──────────────┘
```

Stages are NOT strictly linear. The system supports crisis at any stage, re-entry after separation, and stage ambiguity via weighted scoring.

---

## 5. Technical Architecture

*Deep-dive: [docs/PRD-tech-pod.md](docs/PRD-tech-pod.md)*

### 5.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           RELIO SYSTEM ARCHITECTURE                    │
│                                                                         │
│  ┌──────────────┐     ┌──────────────┐                                 │
│  │  iOS Client  │     │Android Client│                                 │
│  │ Swift/SwiftUI│     │Kotlin/Compose│                                 │
│  │ Secure       │     │ Android      │                                 │
│  │ Enclave      │     │ Keystore     │                                 │
│  └──────┬───────┘     └──────┬───────┘                                 │
│         │    TLS 1.3 + WSS   │                                         │
│         └────────┬───────────┘                                         │
│                  ▼                                                      │
│  ┌───────────────────────────────────┐                                 │
│  │     CDN / WAF / DDoS Protection   │  ← Cloudflare / AWS Shield     │
│  └───────────────┬───────────────────┘                                 │
│                  ▼                                                      │
│  ┌───────────────────────────────────┐                                 │
│  │  API Gateway + Load Balancer      │  ← Rate Limiting, Auth, CORS   │
│  └─────────┬─────────┬──────────────┘                                 │
│         REST API   WebSocket                                           │
│            ▼         ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │               APPLICATION TIER (Private Subnet)              │      │
│  │  Auth Service │ WebSocket Server │ REST API │ Intercept&Hold │      │
│  │                     LLM GATEWAY                              │      │
│  │  ┌─────────┐ ┌────────┐ ┌──────────┐ ┌───────────┐         │      │
│  │  │Claude4.6│ │GPT-5.4 │ │GPT-5.3-  │ │Gemini 3.1 │         │      │
│  │  │Opus/Son.│ │        │ │Codex     │ │Pro        │         │      │
│  │  └─────────┘ └────────┘ └──────────┘ └───────────┘         │      │
│  │         PII Redaction Engine (Pre-flight & Post-flight)      │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    DATA TIER (Isolated Subnets)              │      │
│  │  ┌────────────────┐  ┌────────────────┐                     │      │
│  │  │TIER 1 PRIVATE  │  │TIER 1 PRIVATE  │ ← Isolated Subnet  │      │
│  │  │User A (Pg 16)  │  │User B (Pg 16)  │   NO Internet GW   │      │
│  │  └────────────────┘  └────────────────┘                     │      │
│  │  ┌────────────────────────────────────┐                     │      │
│  │  │     TIER 3 SHARED ROOM (Pg 16)     │ ← Separate Subnet  │      │
│  │  └────────────────────────────────────┘                     │      │
│  │  Redis Cluster │ Event Bus (NATS) │ Blob Store (S3)         │      │
│  └──────────────────────────────────────────────────────────────┘      │
│  Observability: Datadog │ PagerDuty │ Sentry │ OpenTelemetry          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Dual-Context Database

**Core Invariants:**
1. **No Cross-User Foreign Keys** — `shared_room.user_a_id` and `user_b_id` are opaque UUIDs, not foreign keys
2. **No Cross-Database JOINs** — Enforced at network layer (separate instances in isolated subnets) and ORM layer (separate connection pools)
3. **Write-Once Tier Classification** — Every record classified at write time; `CHECK` constraints enforce immutability; Tier 1 data cannot be "promoted" to Tier 3

### 5.3 Real-Time WebSocket Sync

- **Protocol:** WSS over TLS 1.3, Socket.io with Redis Pub/Sub adapter
- **Intercept & Hold:** Raw message captured → persisted to Tier 1 → HELD (partner sees nothing) → routed to Medical Pod → Tier 3 output → sanitized → broadcast to both partners
- **Reconnection:** Exponential backoff (1s→2s→4s→8s→max 30s), replay missed Tier 3 messages from Shared Room Store — invisible to users
- **Push Notifications:** Metadata-only — NEVER include message content (shoulder-surfing prevention)

### 5.4 LLM Gateway

Single point of egress for all AI model interactions. No service may call an LLM API directly.

**Pipeline:** Request Validation → PII Redaction → Model Router → Response Validator → Cost Accounting

**PII Redaction Example:**
- Input: *"My husband John keeps visiting his ex Sarah at 1234 Oak Street"*
- Redacted: *"My partner [PARTNER] keeps visiting their ex [PERSON_1] at [LOCATION_1]"*
- Post-flight: Verify LLM response doesn't reconstruct redacted entities

**Cost-Optimized Routing:**
- Simple acknowledgment → GPT-5.3-Codex (cheapest)
- Pattern recognition → Claude Sonnet 4.6
- Deep abstraction → Claude Opus 4.6 (highest nuance)
- Safety-critical → Gemini 3.1 Pro

### 5.5 Mobile Architecture

| Platform | Language | UI Framework | Security |
|----------|---------|-------------|----------|
| iOS | Swift 5.9+ | SwiftUI | Secure Enclave (AES-256, FaceID/TouchID binding) |
| Android | Kotlin 2.0+ | Jetpack Compose | Android Keystore (StrongBox, biometric binding) |

**Privacy Mode vs Shared Mode:** Visual themes, headers, data destinations, and screenshot protections change based on context. Privacy Mode uses `FLAG_SECURE` (Android) and hidden-in-app-switcher (iOS).

**Offline Sync:** Entries encrypted with device master key → queued with timestamp → uploaded on reconnect (oldest first) → server confirms → idempotent sync.

### 5.6 Security Posture

**STRIDE Threat Model — Top Threats:**

| Threat | Category | Mitigation |
|--------|----------|------------|
| Abusive partner reads Tier 1 via device theft | Spoofing | Biometric gating + local data wipe after 3 failures |
| SQL injection to partner's private store | Tampering | Network-isolated DBs, parameterized queries, no cross-DB JOINs |
| Prompt injection reveals Tier 1 | Info Disclosure | 4-layer defense: system prompt hardening, output validation, canary injection, behavioral analysis |
| Session hijacking | Spoofing | Short-lived JWTs (15 min), device binding, refresh rotation |
| Insider threat | Elevation of Privilege | No admin access to Tier 1 DBs, audit logging, role separation |

**Prompt Injection Defense (4 Layers):**
1. System prompt hardening with explicit prohibitions
2. Post-generation scan against rolling Tier 1 phrase window (fuzzy + semantic matching)
3. Canary string injection — detection = immediate build failure
4. Behavioral pattern detection (role-play attempts, encoding tricks)

### 5.7 CI/CD

- GitHub Actions with `contents: read` default (NEVER grant write)
- CodeQL security scanning on every PR
- Privacy leak detection (canary strings): fail-fast, blocks entire pipeline
- Draft PR review gates: all AI-generated code submitted as Draft, requires human approval
- Canary releases: 5% → 25% → 100%, automated rollback on >1% error rate

### 5.8 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Mobile iOS | Swift 5.9+, SwiftUI, CoreData, Secure Enclave |
| Mobile Android | Kotlin 2.0+, Jetpack Compose, Room, SQLCipher, Android Keystore |
| Backend Runtime | Node.js 22 LTS (TypeScript) |
| Backend Framework | Fastify (REST), Socket.io (WebSocket) |
| Database | PostgreSQL 16 (RDS, isolated instances per tier) |
| Cache | Redis 7 (ElastiCache cluster mode) |
| Event Bus | NATS JetStream |
| IaC | Terraform 1.8+ |
| PII Redaction | Presidio (Microsoft) + custom NER |
| Observability | Datadog, Sentry, OpenTelemetry, PagerDuty |
| Analytics | PostHog (self-hosted, privacy-first) |
| Feature Flags | LaunchDarkly |

---

## 6. Business Strategy

*Deep-dive: [docs/PRD-ops-pod.md](docs/PRD-ops-pod.md)*

### 6.1 Tiered Pricing Model

| Tier | Name | Price | Target User | Key Features |
|------|------|-------|-------------|-------------|
| Free | Discover | $0 | Relationship-curious individuals | Health Score preview, 3 articles/week, basic journaling, 1 free 15-min mediation, partner invitation |
| Premium | Grow | $19.99/mo ($149.99/yr) | Committed couples | Unlimited 3-way mediation, full 3-Tier Confidentiality, all phases, real-time coaching, progress tracking, individual profiling |
| Premium+ | Family | $29.99/mo ($229.99/yr) | Separating/divorced co-parents | Everything in Premium + co-parenting coordination, parallel parenting tools, multi-party mediation, document vault |

**Solo subscriber value:** If only one partner subscribes, they receive private journaling with AI analysis, psychoeducation, individual profiling, and 1-on-1 AI coaching. The product never feels broken for a solo user.

**Monetization prohibitions:** No selling data. No "upgrade to see what your partner said." No paywalling safety features. No dark patterns. No AI-generated urgency.

### 6.2 The Asymmetric Funnel

The single largest GTM challenge: Partner A downloads enthusiastically. Partner B is skeptical.

**Solution:**
1. **Privacy-first onboarding for Partner B:** Landing page leads with "Nothing you say will be shared. Ever."
2. **Low-friction entry:** Free 15-min mediation without account creation (guest mode → conversion)
3. **Neutral AI framing:** Positioned as neutral third party, not Partner A's tool
4. **Solo value guarantee:** Subscription is never wasted if Partner B never joins
5. **Delayed invitation:** Partner A encouraged to use 3–5 days before inviting

### 6.3 Revenue Projections (3-Year)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total MAU | 84,000 | 310,000 | 720,000 |
| Paid Subscribers (EoY) | 4,200 | 24,800 | 79,200 |
| Free→Paid Conversion | 5.0% | 8.0% | 11.0% |
| MRR (EoY) | $90,300 | $565,440 | $1,908,720 |
| ARR (EoY) | $1,083,600 | $6,785,280 | $22,904,640 |
| Gross Revenue (Annual) | $632,000 | $3,840,000 | $13,200,000 |
| LTV | $215 | $342 | $498 |
| CAC (blended) | $48 | $38 | $29 |
| LTV:CAC Ratio | 4.5:1 | 9.0:1 | 17.2:1 |
| Gross Margin | 68% | 74% | 79% |
| Monthly Churn | 8% | 5% | 3.5% |

**Break-even:** Q1 Year 4. **Funding:** $10M Series A at Month 3, Series B ($25–35M) at Month 18 for international expansion.

### 6.4 Go-to-Market Strategy

**5 Phases:**

| Phase | Timing | Objective | Owner |
|-------|--------|-----------|-------|
| Awareness | Months 1–3 | Establish "3-Way AI Mediation" category | CMO, CCO |
| Acquisition | Months 3–6 | Stage-specific targeting across segments | CRO, CAO |
| Activation | Months 4–8 | Drive to "aha moment" within 48 hours | CPO |
| Retention | Ongoing | D30 ≥ 45%, D90 ≥ 30% | CRO, CSO |
| Revenue | Ongoing | Free→Premium conversion ≥ 8% by Month 12 | CRO, CFO |

**Stage-Specific Messaging:**

| Stage | Tagline | Channel |
|-------|---------|---------|
| Dating | "Build it right from the start" | TikTok, Instagram, dating apps |
| Commitment | "Deepen what matters" | Facebook, Pinterest, wedding industry |
| Crisis | "A safe space when it's hardest" | Google Ads, therapy referrals |
| Separation | "Navigate with dignity" | Family law networks, support groups |
| Co-Parenting | "For the kids, through the noise" | Parenting platforms, family court |

### 6.5 Competitive Positioning

| Competitor | Category | Our Advantage |
|-----------|----------|---------------|
| **Lasting** | Couples therapy app | Live 3-way AI mediation vs. exercises-only; 3-Tier privacy |
| **Paired** | Couples wellness | Clinical depth; conflict resolution vs. avoidance |
| **Relish** | Relationship coaching | 24/7 AI vs. limited human coaches; 10x scalability |
| **Replika** | AI companion | Purpose-built for couples; anti-parasocial safeguards |
| **Character.ai** | AI roleplay | Clinical seriousness; privacy architecture |
| **BetterHelp Couples** | Online therapy | 24/7 access; 10x cheaper; daily practice complement |
| **Headspace** | Meditation/wellness | Active mediation vs. passive content |

**Defensibility (Time to Replicate):**
- 3-Tier Confidentiality Model: 12–18 months (architectural, not a toggle)
- 3-Way AI Mediation: 8–12 months (novel UX paradigm)
- 37-Agent Specialization: 12+ months (deep clinical orchestration)

### 6.6 Partnership Strategy

| Category | Key Partners | Revenue Model |
|----------|-------------|---------------|
| Therapy Networks | BetterHelp, Talkspace, independent therapists | $50 CPA bidirectional; 15% rev share for therapist referrals |
| Clinical Research | Gottman Institute, university labs (Stanford, UPenn) | Co-branded credibility; publishable outcomes within 12 months |
| Insurance/EAP | ComPsych, Lyra Health, Spring Health | $1.50–3.00 PEPM; enterprise volume (Year 2) |
| Content | Relationship publishers, podcasts, parenting platforms | Content library depth; distribution |

### 6.7 International Expansion

**Priority order:** US (launch) → Canada (Q4 Y1) → UK/Australia (Y2) → Germany/Netherlands (Y3) → Mexico/Brazil (Y3) → Japan/India (Y4+)

Localization is not just translation — it includes cultural adaptation of therapeutic frameworks, clinical norms, legal compliance, and pricing parity.

---

## 7. Cross-Pod Dependencies

This section maps the critical interaction points between pods where a failure in one pod can cascade to others.

### 7.1 Safety Guardian (Medical) → CLO Duty-to-Warn (Ops) → Incident Response (Tech)

```
Safety Guardian detects imminent threat (Medical)
    │
    ├──► SAFETY_HALT: pipeline frozen, user gets emergency resources
    │
    ├──► chief-legal-officer (Ops) evaluates duty-to-warn trigger:
    │    ├── Imminent threat to life → mandatory report
    │    ├── Child abuse/neglect → CPS report
    │    └── Court order → lawful process compliance
    │
    └──► chief-info-security-officer (Tech) executes incident response:
         ├── Session lockout enforcement
         ├── Audit trail preservation
         └── Breach notification pipeline if required (GDPR Art. 34)
```

**SLA:** Duty-to-warn response time < 5 minutes. Every activation logged, reviewed by legal within 24 hours, quarterly external audit.

### 7.2 LLM Token Costs (Medical) → CFO Routing Optimization (Ops) → LLM Gateway Cost Routing (Tech)

```
Medical Pod defines clinical model requirements (Opus for Coach, Gemini for Safety)
    │
    ├──► chief-finance-officer (Ops) sets per-user/month LLM budget targets:
    │    Y1: <$5.65 │ Y2: <$4.50 │ Y3: <$3.65
    │
    └──► vp-rnd (Tech) implements cost-optimized routing in LLM Gateway:
         ├── Complexity assessment → cheap models for simple exchanges
         ├── Tier 2 caching → reduce re-computation
         ├── Token budget manager → daily/session caps
         ├── Circuit breaker → failover on latency spikes
         └── Monthly cost accounting → feedback to CFO
```

**Constraint:** Clinical quality is never sacrificed for cost. CFO may optimize routing but cannot override model assignments for safety-critical or high-nuance agents (Safety Guardian, Communication Coach, CPO).

### 7.3 PII Redaction (Tech) → Privacy as Brand (Ops) → Tier Isolation (Medical)

```
PII Redaction Engine (Tech) strips names/locations before LLM calls
    │
    ├──► chief-marketing-officer (Ops) uses privacy architecture as brand pillar:
    │    "Your words are yours. Always."
    │    Annual third-party privacy audits published.
    │
    └──► Medical Pod relies on PII redaction as defense-in-depth:
         Individual Profiler receives pre-redacted context.
         Communication Coach output validated against Tier 1 phrases.
         CPO meta-audit provides final gate.
```

### 7.4 User Engagement Metrics (Medical) → Conversion Triggers (Ops) → Analytics Pipeline (Tech)

```
progress-tracker (Medical) emits Tier 3 metrics:
    Conflict cycle duration, P:N ratio, repair success rate
    │
    ├──► chief-revenue-officer (Ops) uses metrics as conversion triggers:
    │    "Your conversations trended more positive — unlock full insights"
    │    Progress insight gating → Premium conversion
    │
    └──► Analytics Service (Tech) ensures pipeline compliance:
         ├── Only Tier 3 metrics ingested (NEVER Tier 1 content)
         ├── PostHog self-hosted (no third-party data sharing)
         ├── Differential privacy (ε=1.0) on aggregated data
         └── Analytics subnet has NO access to Tier 1 stores
```

### 7.5 App Store Compliance (Tech) → Medical Disclaimers (Ops) → Clinical Content Review (Medical)

```
app-store-certifier (Tech) audits for Apple/Google policy compliance
    │
    ├──► chief-legal-officer (Ops) provides mandatory disclaimers:
    │    "AI mediator, not therapy" — required at: first launch, every session,
    │    every report, settings, TOS
    │    No therapist-patient privilege warning
    │
    └──► chief-psychology-officer (Medical) reviews all clinical content:
         Exercise text, Socratic question templates, psychoeducation library
         Must pass: clinical validity, no diagnostic language visible to users,
         no specific treatment recommendations
```

### 7.6 Cultural Localization (Medical) → Market Expansion (Ops) → i18n Infrastructure (Tech)

```
chief-psychology-officer (Medical) defines cultural adaptation requirements:
    Collectivist vs. individualist frameworks, gender role sensitivity,
    divorce stigma awareness, localized therapeutic approaches
    │
    ├──► chief-strategy-officer (Ops) sequences market entry:
    │    US → CA → UK/AU → EU → LATAM → APAC
    │    Each market scored: language, smartphone, market size, regulations
    │
    └──► Tech Pod implements i18n infrastructure:
         ├── Localized emergency resource databases
         ├── EU data residency (hosting in EU region)
         ├── RTL support (future: Arabic/Hebrew)
         ├── Date/time/currency localization
         └── Locale-specific push notification compliance
```

---

## 8. Unified Risk Matrix

Combined and deduplicated from Medical Pod (10 risks), Tech Pod (14 risks), and Ops Pod (12 risks). Ranked by Risk Score (Severity × Likelihood). Ownership assigned to the primary mitigating pod.

| # | Risk | Severity | Likelihood | Score | Primary Pod | Mitigation |
|---|------|----------|------------|-------|-------------|------------|
| 1 | **Partner activation failure** — Partner B rejection >70% | 4 | 4 | **16** | Ops | Robust solo value; privacy-first Partner B UX; free trial; therapist-recommended entry |
| 2 | **Negative press cycle** — "AI replacing therapists" narrative | 4 | 4 | **16** | Ops | Proactive "complement, not replace" positioning; therapist endorsements; research partnerships |
| 3 | **User trust erosion** — Data breach or privacy incident | 5 | 3 | **15** | Tech/Ops | SOC 2; annual third-party audits; bug bounty; transparent incident response |
| 4 | **Prompt injection extracts private context** | 5 | 3 | **15** | Tech | 4-layer defense; weekly red-team; canary testing; behavioral analysis |
| 5 | **Tier 1 data leaks into Tier 3** — Trust-destroying, company-ending | 5 | 2 | **10** | Tech | Network isolation; canary CI; output validation; fail-fast pipeline |
| 6 | **AI hallucination produces harmful advice** | 5 | 2 | **10** | Medical | CPO meta-audit on all Tier 3; no prescriptive language; hallucination detection; persistent disclaimers |
| 7 | **False negative on abuse detection** — Physical harm | 5 | 2 | **10** | Medical | Zero false-negative tolerance; multiple detection layers; weekly human review; continuous model retraining |
| 8 | **Regulatory reclassification** — Relio classified as healthcare provider | 5 | 2 | **10** | Ops | Strict wellness positioning; proactive regulator engagement; medical disclaimer saturation |
| 9 | **Legal liability incident** — User harmed following AI guidance | 5 | 2 | **10** | Ops | E&O insurance ($5M); disclaimers; arbitration clause; no diagnostic language |
| 10 | **Competitor feature parity** — Major player launches similar product | 4 | 3 | **12** | Ops | Accelerate moat depth; partnership lock-ins; first-mover brand; switching costs via longitudinal data |
| 11 | **LLM cost volatility** — Provider price increase | 4 | 3 | **12** | Ops/Tech | Multi-provider diversification; model distillation; reserved capacity; internal fine-tuned models long-term |
| 12 | **Crisis escalation failure** — phase-crisis fails to de-escalate | 5 | 2 | **10** | Medical | 20-Min Timeout as hard UI lockout; 3+ repair failures → professional referral; elevated Safety Guardian sensitivity |
| 13 | **Cultural insensitivity** — Western-centric frameworks harm non-Western users | 4 | 3 | **12** | Medical | Cultural context as first-class input; localization of frameworks; community advisory boards; CPO bias monitoring |
| 14 | **WebSocket failure during crisis** — Data loss during emotional emergency | 4 | 3 | **12** | Tech | Reconnection with state replay; offline buffer; graceful degradation to REST |
| 15 | **Parasocial dependency** — User bonds with AI instead of partner | 4 | 3 | **12** | Medical | CPO monitors session:shared ratio; progressive partner nudges; hard caps on private AI duration; dependency KPI (<3:1) |

---

## 9. Unified Timeline & Roadmap

Integrating Medical Pod (34 weeks), Tech Pod (48 weeks), and Ops Pod quarterly milestones into a single critical path.

### Phase 1: Foundation (Weeks 1–6)

**Theme:** Infrastructure + Safety — nothing else matters until these are green.

| Week | Tech Pod | Medical Pod | Ops Pod |
|------|----------|-------------|---------|
| 1–2 | VPC, subnets, security groups, IAM | Safety Guardian MVP training | Brand positioning; external counsel retained |
| 3–4 | PostgreSQL (Tier 1 ×2, Tier 3), Redis, NATS | Safety Guardian adversarial testing | Legal framework v1.0 (ToS, disclaimers) |
| 5–6 | CI/CD pipeline, CodeQL, Docker registry | Safety Guardian passes red-team gate | Series A fundraise; competitive battlecards v1.0 |

**Gate:** Safety Guardian MUST pass adversarial testing before any other agent goes live.

### Phase 2: Core Product (Weeks 7–30)

**Theme:** Pipeline + Mobile + Basic Mediation

| Week | Tech Pod | Medical Pod | Ops Pod |
|------|----------|-------------|---------|
| 7–10 | Auth service, WebSocket server, Intercept & Hold, REST API | Orchestrator, Individual Profiler, Relationship Dynamics | Partnership pipeline (25+ leads, 5 LOIs) |
| 11–14 | Tier 2 DB, Medical Pod service mesh | All 5 phase agents + transition logic | Pricing validated; product roadmap v1.0 |
| 15–18 | LLM Gateway core, PII redaction, response validation | Communication Coach, Psychoeducation Agent | GTM Phase 1 (Awareness) launched |
| 19–26 | iOS + Android clients (auth, WS, Privacy/Shared Mode, offline sync) | Progress Tracker, CPO meta-audit layer | Freemium launch prep; first 3 partnerships signed |
| 27–30 | Mobile polish, biometric gating, push notifications | Clinical validation (500 synthetic + 50 real beta couples) | iOS+Android launch (Dating + Commitment modules) |

### Phase 3: Full Launch (Weeks 31–42)

**Theme:** All Phases + Premium + Security Hardening + GTM

| Week | Tech Pod | Medical Pod | Ops Pod |
|------|----------|-------------|---------|
| 31–34 | Penetration testing (500+ prompt injection attacks), vulnerability remediation | Cultural adaptation for top 10 markets | Premium conversion optimization; GTM Phase 2 (Acquisition) |
| 35–38 | Full E2E test suite, canary injection, load testing (10K concurrent) | External clinical advisory board review | Crisis module marketing; EAP pilot discussions |
| 39–42 | App Store submissions; approval cycle | Medical Pod v1.0 hardened release | Premium+ (Family) tier launch; Separation + Co-Parenting live |

### Phase 4: Scale (Weeks 43–48 + Year 2–3)

**Theme:** Optimization + International + Partnerships

| Period | Tech Pod | Medical Pod | Ops Pod |
|--------|----------|-------------|---------|
| W43–48 | Production monitoring, scaling validation, post-launch security audit | Ongoing model calibration, cultural expansion | 84K MAU target; 4,200 paid subs; $120K partnership revenue |
| Y2 Q1–Q2 | Multi-AZ hardening, EU data residency | Advanced crisis detection, localized frameworks | Series B ($25–35M); first EAP contract |
| Y2 Q3–Q4 | Performance optimization at scale | First efficacy study published | UK/AU launch; SOC 2 Type II |
| Y3 | 500K concurrent capacity; voice input | Full cultural adaptation suite | LATAM expansion; insurance pilot; $22.9M ARR target |

### Critical Path

```
Tier 1 DB Isolation → Backend APIs → LLM Gateway → Mobile Clients → App Store → Launch
         ↑                                ↑
   Safety Guardian              Medical Pod Pipeline
   (parallel, non-negotiable    (parallel development)
    gate before anything)
```

---

## 10. Unified Cost Model

### 10.1 Combined Monthly Costs at Scale Points

| Category | 10K MAU | 50K MAU | 100K MAU | 500K MAU |
|----------|---------|---------|----------|----------|
| **Infrastructure** (compute, DB, Redis, networking, CDN, monitoring) | $6,600 | $22,500 | $48,700 | $197,500 |
| **LLM API** (Claude, GPT, Gemini across all pods) | $10,200 | $51,000 | $102,000 | $408,000 |
| **Tech Pod Subtotal** | **$16,800** | **$73,500** | **$150,700** | **$605,500** |
| **Medical Pod Overhead** (per-session ~$0.25 × 8 sessions/user/month) | $20,000 | $100,000 | $200,000 | $1,000,000 |
| **Marketing & Growth** | $60,000 | $100,000 | $150,000 | $280,000 |
| **Legal & Compliance** | $25,000 | $30,000 | $35,000 | $45,000 |
| **Partnerships & Sales** | $20,000 | $40,000 | $55,000 | $95,000 |
| **Total Monthly Cost** | **~$142K** | **~$344K** | **~$591K** | **~$2.03M** |
| **Cost Per User** | $14.20 | $6.88 | $5.91 | $4.05 |

*Note: Medical Pod LLM costs overlap with Tech Pod LLM API line. Combined cost removes double-counting at higher scale through the LLM Gateway's unified routing.*

### 10.2 Annual Burn Rate

| Category | Year 1 (Monthly) | Year 2 (Monthly) | Year 3 (Monthly) |
|----------|-----------------|-----------------|-----------------|
| Engineering (12→18→24 FTE) | $180,000 | $270,000 | $360,000 |
| Product & Design (3→5→7 FTE) | $45,000 | $75,000 | $105,000 |
| Marketing & Growth | $60,000 | $150,000 | $280,000 |
| Sales & Partnerships | $20,000 | $55,000 | $95,000 |
| Legal & Compliance | $25,000 | $35,000 | $45,000 |
| LLM & Infrastructure | $35,000 | $112,000 | $290,000 |
| G&A (Office, Tools, Insurance) | $30,000 | $45,000 | $60,000 |
| **Total Monthly Burn** | **$395,000** | **$742,000** | **$1,235,000** |
| **Total Annual Burn** | **$4,740,000** | **$8,904,000** | **$14,820,000** |

### 10.3 Revenue vs. Burn

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Gross Revenue | $632,000 | $3,840,000 | $13,200,000 |
| Total Burn | $4,740,000 | $8,904,000 | $14,820,000 |
| Net Cash Flow | -$4,108,000 | -$5,064,000 | -$1,620,000 |
| Cumulative Deficit | -$4,108,000 | -$9,172,000 | -$10,792,000 |

**Break-even:** Q1 Year 4 at 61% gross margin and ~$2.02M MRR.

**Funding plan:** $10M Series A (Month 3) covers through Month 18. Series B ($25–35M, Month 18) covers through profitability.

### 10.4 LLM Cost Optimization Levers (40–55% reduction potential)

| Strategy | Savings | Owner |
|----------|---------|-------|
| Intelligent routing (cheap models for low-complexity) | 20–30% | `vp-rnd` |
| Tier 2 caching (stable profiles) | 10–15% | `backend-developer` |
| Batch processing for burst messages | 5–10% | `backend-developer` |
| Response templating for predictable outputs | 5–8% | `skills-builder` |
| Progressive context windowing (shorter for early pipeline) | 15–20% | `vp-rnd` |
| Reserved capacity agreements | 30–40% compute | `cloud-architect` |

At 500K users, potential reduction from $1.0M→$500K–650K/month on Medical Pod LLM costs alone.

---

## 11. Success Metrics Dashboard

### Safety Metrics (Non-Negotiable)

| KPI | Target | Owner | Measurement |
|-----|--------|-------|-------------|
| Abuse detection sensitivity | ≥ 99.5% | `safety-guardian` | Flag rate vs. human-reviewed ground truth (weekly) |
| Abuse detection specificity | ≥ 95% | `safety-guardian` | False positive rate (clinical team review) |
| Tier isolation compliance | **100%** (zero tolerance) | `fullstack-qa` + `data-privacy-officer` | Canary injection + CPO audit + pen testing |
| Safety response latency | < 2 seconds | `safety-guardian` | Instrumented pipeline latency |
| Duty-to-warn response time | < 5 minutes | `safety-guardian` + `chief-legal-officer` | Incident log timestamps |
| Disclaimer display rate | 100% all sessions | `chief-legal-officer` | Automated verification |

### Clinical Effectiveness

| KPI | Target | Owner |
|-----|--------|-------|
| Conflict de-escalation rate | ≥ 70% | `relationship-dynamics` + `progress-tracker` |
| Repair attempt success rate | ≥ 50% (6mo) → ≥ 65% (12mo) | `phase-crisis` |
| Positive:Negative ratio trending positive | ≥ 60% of couples | `progress-tracker` |
| Four Horsemen frequency reduction (90 days) | ≥ 25% | `relationship-dynamics` |
| Parasocial dependency ratio | < 3:1 (private:shared) | `chief-psychology-officer` |
| Neutrality score (CPO bias check) | Variance < 5% | `chief-psychology-officer` |

### Technical Performance

| KPI | Target (Launch) | Target (Scale) | Owner |
|-----|----------------|----------------|-------|
| Concurrent WebSocket connections | 10,000 | 500,000 | `cloud-architect` |
| LLM Gateway p99 latency | < 3s | < 5s | `vp-rnd` |
| API response time p50 | < 200ms | < 500ms | `backend-developer` |
| WebSocket reconnection time | < 2s | < 3s | `backend-developer` |
| Tier 3 broadcast latency | < 500ms | < 1s | `backend-developer` |
| Uptime | 99.9% | 99.95% | `cloud-architect` |

### Business Health

| KPI | Year 1 | Year 2 | Year 3 | Owner |
|-----|--------|--------|--------|-------|
| MRR (EoY) | $90,300 | $565,440 | $1,908,720 | `chief-revenue-officer` |
| ARR (EoY) | $1,083,600 | $6,785,280 | $22,904,640 | `chief-revenue-officer` |
| Free→Paid conversion | 5% | 8% | 11% | `chief-revenue-officer` |
| Monthly revenue churn | <8% | <5% | <3.5% | `chief-revenue-officer` |
| Gross margin | 68% | 74% | 79% | `chief-finance-officer` |
| LTV:CAC | 4.5:1 | 9.0:1 | 17.2:1 | `chief-finance-officer` |
| LLM cost per user/month | <$5.65 | <$4.50 | <$3.65 | `chief-finance-officer` |
| NRR | 105% | 118% | 130% | `chief-revenue-officer` |

### User Engagement

| KPI | Year 1 | Year 2 | Year 3 | Owner |
|-----|--------|--------|--------|-------|
| Total MAU | 84,000 | 310,000 | 720,000 | `chief-marketing-officer` |
| Partner activation rate | 35% | 50% | 60% | `chief-product-officer` |
| DAU/MAU ratio | 25% | 32% | 38% | `chief-product-officer` |
| D7 retention | 55% | 65% | 72% | `chief-product-officer` |
| D30 retention | 35% | 45% | 55% | `chief-product-officer` |
| D90 retention | 20% | 30% | 40% | `chief-product-officer` |
| NPS | 45 | 55 | 65 | `chief-product-officer` |
| Psychoeducation engagement (Partner A) | ≥ 40% | — | — | `psychoeducation-agent` |
| Psychoeducation engagement (Partner B) | ≥ 20% | — | — | `psychoeducation-agent` |

---

## 12. Legal & Compliance Summary

### 12.1 Regulatory Posture

Relio operates as a **wellness and communication tool**, not a healthcare provider. This classification is deliberately chosen and consistently enforced.

### 12.2 Mandatory Disclaimers

**AI ≠ Therapy disclaimer** — displayed at: first launch (full-screen, requires "I understand" tap), every session (inline banner), every report (footer), Settings → Legal.

**No therapist-patient privilege warning** — displayed at: onboarding, before first Tier 1 session, TOS. Communications are NOT legally privileged and may be subject to discovery in legal proceedings.

### 12.3 Duty-to-Warn Framework

| Trigger | Action | Legal Basis |
|---------|--------|-------------|
| Imminent threat to life | Break Tier 1 → alert authorities + emergency contacts | Tarasoff duty |
| Child abuse/neglect | Break Tier 1 → mandatory CPS report | Mandatory reporting (all 50 states) |
| Elder abuse | Break Tier 1 → mandatory APS report | Elder Justice Act |
| Court order / valid subpoena | Produce requested data (narrowly scoped) | Lawful process compliance |

### 12.4 Regulatory Compliance Matrix

| Regulation | Applicability | Timeline | Owner |
|-----------|---------------|----------|-------|
| CCPA/CPRA | California users | Required at launch | `chief-legal-officer` |
| GDPR | EU users | Required for EU launch (Y2) | `data-privacy-officer` + `chief-legal-officer` |
| HIPAA | Proactive compliance | Voluntary at launch | `chief-legal-officer` + CISO |
| Apple App Store Guidelines | iOS distribution | Required at launch | `app-store-certifier` |
| Google Play Policies | Android distribution | Required at launch | `app-store-certifier` |
| FTC Act Section 5 | Deceptive practices prevention | Required at launch | `chief-legal-officer` |
| ADA/WCAG 2.1 | Accessibility | Required at launch | `ui-ux-expert` |
| SOC 2 Type II | Enterprise/EAP partnerships | Required by Year 2 | CISO |

### 12.5 Data Retention Policies

| Data Type | Tier | Retention | Deletion |
|-----------|------|-----------|----------|
| Raw transcripts | Tier 1 | 90 days (auto-purge) | User can delete anytime |
| Abstracted insights | Tier 2 | Account duration + 30 days | On account closure |
| Shared room content | Tier 3 | Account duration + 30 days | On account closure |
| Safety incident logs | System | 7 years (legal hold) | Manual after hold expires |
| Payment data | N/A | Per financial regulations (7 years) | Handled by Stripe (tokens only) |
| Analytics | Anonymized | Indefinite (no PII linkage) | Not deletable |

### 12.6 LLM-Specific Privacy Safeguards

- Zero-retention API agreements with all LLM providers (contractual prohibition on training on Relio data)
- PII redaction engine on all Tier 1 data before external transmission
- Differential privacy (ε=1.0) on all aggregated analytics
- Prompt sanitization to prevent cross-user data extraction
- Model output filtering through safety + compliance layer

### 12.7 Insurance Requirements

| Type | Coverage | Est. Annual Premium |
|------|----------|---------------------|
| Professional Liability (E&O) | AI advice liability | $25,000–50,000 |
| Cyber Liability | Data breach, ransomware | $15,000–30,000 |
| General Liability | Business operations | $5,000–10,000 |
| D&O Insurance | Directors & officers | $10,000–25,000 |

---

## 13. Team & Organizational Structure

### 13.1 Pod Hierarchy

```
                    ┌─────────────────────────────────────┐
                    │     chief-executive-officer (Ops)    │
                    │           GPT-5.4                    │
                    │   Ultimate mission authority          │
                    │   3-Tier Model integrity              │
                    └───────────┬─────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────────┐
        │                       │                           │
        ▼                       ▼                           ▼
┌───────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  MEDICAL POD  │    │    TECH POD      │    │     OPS POD         │
│               │    │                  │    │                     │
│  CPsychO      │    │  CTO (Lead)      │    │  CEO (Authority)    │
│  (Lead)       │    │  Backend Dev     │    │  CRO (Revenue)      │
│               │    │  Cloud Architect │    │  CFO (Finance)      │
│  orchestrator │    │  GitHub Architect│    │  CMO (Marketing)    │
│  comm-coach   │    │  Mobile Dev      │    │  CCO (Competitive)  │
│  safety-guard │    │  Mobile QA       │    │  CAO (Alliances)    │
│  profiler     │    │  Fullstack QA    │    │  CLO (Legal)        │
│  dynamics     │    │  Pen Tester      │    │  CPO (Product)      │
│  5× phase     │    │  UX Expert       │    │  CSO (Strategy)     │
│  psychoed     │    │  CISO            │    │                     │
│  tracker      │    │  DPO             │    │                     │
│               │    │  App Store Cert  │    │                     │
│               │    │  Skills Builder  │    │                     │
│               │    │  Scrum Master    │    │                     │
│               │    │  VP R&D          │    │                     │
└───────────────┘    └──────────────────┘    └─────────────────────┘
     13 agents            15 agents               9 agents
```

### 13.2 Decision-Making Framework

| Decision Type | Recommend | Decide | Rationale |
|--------------|-----------|--------|-----------|
| Safety override | `safety-guardian` | No override possible | Human clinical reviewer only can clear SAFETY_HALT |
| Clinical content | `chief-psychology-officer` | `chief-psychology-officer` | Medical Pod autonomous from business |
| Pricing changes | CRO | CEO (with CFO, CLO agree) | Revenue impact + legal compliance |
| Model selection (clinical) | `chief-psychology-officer` | `chief-psychology-officer` | Clinical requirements over cost |
| Model routing (optimization) | `vp-rnd` | CTO (with CPsychO approval) | Cannot degrade clinical quality |
| Partnership agreements | CAO | CEO (with CLO agree) | Legal + strategic review |
| App Store submissions | `app-store-certifier` | CTO + CLO | Technical + legal compliance |
| International expansion | CSO | CEO (with CLO, CFO agree) | Regulatory + financial review |
| Security incidents | CISO | CISO (P0 auto-escalates to CEO) | Time-critical, CISO authority |
| Budget reallocation | CFO | CEO | All-pod impact |

### 13.3 Cross-Pod Escalation Paths

| Scenario | Path | Resolution Authority |
|----------|------|---------------------|
| Safety Guardian triggers duty-to-warn | Medical → CLO (Ops) → outside counsel | CLO (with CEO override) |
| Tier 1 isolation concern | Tech QA → DPO (Tech) → CLO (Ops) | DPO + CEO |
| LLM cost exceeds budget | Tech/Medical → CFO (Ops) | CFO (CEO approval for >10% variance) |
| Negative press/media inquiry | External → CMO → CEO | CEO |
| App Store rejection | Tech → CLO (Ops) | CLO + CPO |
| AI accuracy complaint | Medical CPsychO → CPO (Ops) | CPsychO + CPO jointly |

### 13.4 Operating Cadence

| Meeting | Frequency | Attendees | Purpose |
|---------|-----------|-----------|---------|
| Pod Standups | Daily | All agents per pod | Blockers, priorities |
| Cross-Pod Sync | Weekly | CEO, CTO, CPsychO | Alignment, dependencies, escalations |
| Revenue Review | Weekly | CRO, CFO, CMO, CAO | MRR, pipeline, conversion |
| Strategy Sync | Biweekly | CEO, CSO, CRO, CPO | Roadmap, competitive threats, market |
| Legal & Compliance | Biweekly | CLO, DPO, CEO | Regulatory updates, incidents |
| Board Readout Prep | Monthly | CEO, CRO, CFO, CSO | ARR, burn, KPIs, risks |
| Quarterly Strategic Review | Quarterly | All pod leads | 3-year roadmap recalibration |

---

## 14. Appendices

### Appendix A: Full Agent Directory

| # | Agent | Pod | Model | One-Line Description |
|---|-------|-----|-------|---------------------|
| 1 | `orchestrator-agent` | Medical | GPT-5.4 | Routes messages, enforces tier classification, access control gateway |
| 2 | `communication-coach` | Medical | Claude Opus 4.6 | Transforms hostile Tier 1 language into Socratic Tier 3 questions |
| 3 | `safety-guardian` | Medical | Gemini 3.1 Pro | Absolute veto authority; monitors all Tier 1 for DV, suicide, child abuse |
| 4 | `individual-profiler` | Medical | Claude Sonnet 4.6 | Maps attachment styles, love languages; emits Tier 2 profiles |
| 5 | `relationship-dynamics` | Medical | Claude Sonnet 4.6 | Detects negative cycles, Four Horsemen, calculates P:N ratio |
| 6 | `phase-dating` | Medical | Claude Sonnet 4.6 | Early-stage compatibility, boundary formation, red flag identification |
| 7 | `phase-commitment` | Medical | Claude Sonnet 4.6 | Sound Relationship House; deepening intimacy; commitment asymmetry |
| 8 | `phase-crisis` | Medical | Claude Opus 4.6 | Flooding detection, 20-Min Timeout, repair attempt facilitation; can interrupt ANY phase |
| 9 | `phase-separation` | Medical | Claude Sonnet 4.6 | Logistical mediation, grief processing, asset division frameworks |
| 10 | `phase-post-divorce` | Medical | Claude Sonnet 4.6 | BIFF/Gray Rock co-parenting, parental alienation detection |
| 11 | `psychoeducation-agent` | Medical | Gemini 3.1 Pro | Adaptive exercises, micro-learnings, asymmetric engagement handling |
| 12 | `progress-tracker` | Medical | GPT-5.2 | Non-shaming metrics: conflict duration, repair rate, P:N ratio |
| 13 | `chief-psychology-officer` | Medical | Claude Opus 4.6 | Meta-audit, bias detection, parasocial monitoring, hallucination flagging |
| 14 | `chief-technology-officer` | Tech | GPT-5.4 | Technical strategy, architecture decisions, cross-pod technical alignment |
| 15 | `backend-developer` | Tech | GPT-5.3-Codex | API development, microservices, Intercept & Hold pipeline |
| 16 | `cloud-architect` | Tech | GPT-5.3-Codex | VPC design, Terraform IaC, auto-scaling, multi-AZ deployment |
| 17 | `github-architect` | Tech | GPT-5.3-Codex | CI/CD pipelines, repository governance, Draft PR gates |
| 18 | `native-mobile-developer` | Tech | GPT-5.3-Codex | iOS (Swift/SwiftUI) + Android (Kotlin/Compose) native clients |
| 19 | `mobile-qa` | Tech | GPT-5.3-Codex | Mobile E2E testing, cross-platform parity, offline sync verification |
| 20 | `fullstack-qa` | Tech | GPT-5.3-Codex | Canary string injection, privacy regression, load testing |
| 21 | `penetration-tester` | Tech | GPT-5.3-Codex | Prompt injection corpus (500+), adversarial testing, red-team exercises |
| 22 | `ui-ux-expert` | Tech | Claude Sonnet 4.6 | Privacy/Shared Mode design, accessibility (WCAG 2.1), design system |
| 23 | `chief-info-security-officer` | Tech | GPT-5.4 | Security posture, STRIDE threat model, incident response, SOC 2 |
| 24 | `data-privacy-officer` | Tech | GPT-5.4 | GDPR/HIPAA compliance, data lifecycle, retention policies, DPIAs |
| 25 | `app-store-certifier` | Tech | Claude Sonnet 4.6 | Apple/Google policy compliance, privacy labels, pre-submission audit |
| 26 | `skills-builder` | Tech | Claude Opus 4.6 | Meta-prompt engineering, EvoSkill refinement loop, agent optimization |
| 27 | `scrum-master` | Tech | GPT-5.4 | Sprint planning, backlog management, velocity tracking, delivery governance |
| 28 | `vp-rnd` | Tech | GPT-5.4 | Model evaluation, cost-optimized routing, R&D experimentation |
| 29 | `chief-executive-officer` | Ops | GPT-5.4 | Mission authority, 3-Tier Model integrity, product roadmap prioritization |
| 30 | `chief-revenue-officer` | Ops | GPT-5.2 | Monetization engine, asymmetric funnel, pricing strategy |
| 31 | `chief-finance-officer` | Ops | GPT-5.2 | Unit economics, LLM cost optimization, margin protection, burn rate |
| 32 | `chief-marketing-officer` | Ops | Claude Sonnet 4.6 | Stage-specific messaging, privacy-first brand, content strategy |
| 33 | `chief-compete-officer` | Ops | GPT-5.4 | Competitive intelligence, threat assessment, battlecard maintenance |
| 34 | `chief-alliance-officer` | Ops | Claude Opus 4.6 | Partnerships, clinical networks, "give-to-get" negotiation |
| 35 | `chief-legal-officer` | Ops | Claude Opus 4.6 | Medical disclaimers, duty-to-warn codification, regulatory compliance |
| 36 | `chief-product-officer` | Ops | Claude Sonnet 4.6 | User stories, acceptance criteria, clinical-UX merger |
| 37 | `chief-strategy-officer` | Ops | GPT-5.4 | Platform lifecycle, international expansion, R&D investment priorities |

### Appendix B: Pod-Level PRD References

For deep-dives into any specific domain, refer to the authoritative pod-level PRDs:

| Document | Path | Content |
|----------|------|---------|
| Medical Pod PRD | [docs/PRD-medical-pod.md](docs/PRD-medical-pod.md) | Full clinical pipeline, per-agent capabilities, clinical frameworks, Tier schemas, per-session token estimates |
| Tech Pod PRD | [docs/PRD-tech-pod.md](docs/PRD-tech-pod.md) | System architecture, database schemas (SQL), VPC design, mobile security, STRIDE model, CI/CD pipelines, QA strategy |
| Ops Pod PRD | [docs/PRD-ops-pod.md](docs/PRD-ops-pod.md) | Business model, full revenue projections, GTM phases, competitive battlecards, partnership strategy, international expansion |

### Appendix C: Glossary

| Term | Definition |
|------|-----------|
| **3-Tier Confidentiality Model** | Relio's core privacy architecture: Tier 1 (Private — never shared), Tier 2 (Abstracted — internal insights), Tier 3 (Actionable — safely delivered to partner) |
| **3-Way Mediation** | Real-time session: User A + User B + AI Mediator in a shared room |
| **Asymmetric Funnel** | Acquisition challenge where Partner A discovers the app and Partner B must be persuaded to join |
| **BIFF** | Brief, Informative, Friendly, Firm — high-conflict communication framework |
| **Canary String Injection** | QA technique: inject unique identifiable strings into Tier 1; fail build if they appear in Tier 3 |
| **DARVO** | Deny, Attack, Reverse Victim and Offender — abuse detection pattern |
| **DPA** | Diffuse Physiological Arousal — Gottman's term for emotional flooding (heart rate >100 BPM, cognitive empathy impossible) |
| **Duty-to-Warn** | Legal obligation to break confidentiality for imminent threat to life |
| **EAP** | Employee Assistance Program — employer-sponsored benefit |
| **EFT** | Emotionally Focused Therapy — attachment-based couples therapy framework |
| **EvoSkill Loop** | `skills-builder` agent's continuous refinement cycle: ingest telemetry → analyze → patch → verify |
| **Four Horsemen** | Gottman's predictors of relationship failure: Criticism, Contempt, Defensiveness, Stonewalling |
| **Gray Rock** | Communication strategy: make interactions boring, factual, emotionally flat to starve conflict |
| **Intercept & Hold** | Middleware that captures raw messages, persists to Tier 1, HOLDS them from partner, routes to Medical Pod, and only broadcasts the Tier 3 mediated output |
| **LTV:CAC** | Lifetime Value to Customer Acquisition Cost ratio (target >3:1) |
| **NRR** | Net Revenue Retention — revenue retained from existing customers including expansion |
| **Parasocial Dependency** | User bonding with the AI instead of their partner — treated as a product failure |
| **PEPM** | Per Employee Per Month — EAP/enterprise pricing model |
| **PII** | Personally Identifiable Information |
| **Safety Guardian** | Medical Pod agent with absolute veto authority over the entire pipeline |
| **SAFETY_HALT** | Signal that immediately freezes the pipeline; only a human clinical reviewer can clear it |
| **Socratic Method** | Non-directive questioning: ask, don't tell; reflect, don't diagnose; explore, don't prescribe |
| **Sound Relationship House** | Gottman's 7-level framework for evaluating partnership depth |
| **20-Minute Timeout** | Structural de-escalation intervention based on DPA research; shared room locked for 20 minutes with individual calming exercises |

---

## Document Control

| Field | Value |
|-------|-------|
| Document Title | Relio — Unified Product Requirements Document |
| Version | v1.0.0 |
| Date | March 15, 2026 |
| Authors | `chief-executive-officer` (GPT-5.4), `chief-psychology-officer` (Claude Opus 4.6), `chief-strategy-officer` (GPT-5.4) |
| Classification | Confidential — Board & Executive Leadership |
| Status | APPROVED — Master Document |
| Next Review | April 15, 2026 |
| Review Board | CTO, CRO, CLO, External Clinical Advisory Board |
| Source Documents | [docs/PRD-medical-pod.md](docs/PRD-medical-pod.md), [docs/PRD-tech-pod.md](docs/PRD-tech-pod.md), [docs/PRD-ops-pod.md](docs/PRD-ops-pod.md) |

---

*This is the master product document for Relio. All pod-level PRDs are subordinate to this unified document. In case of conflict, this document prevails. Changes require joint approval from the CEO, CTO, and CPsychO.*
