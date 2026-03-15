# Relio — Unified Product Requirements Document

**Version:** v1.2.0
**Date:** March 15, 2026
**Authors:** `chief-executive-officer` (GPT-5.4), `chief-product-officer` (Claude Sonnet 4.6), `chief-strategy-officer` (GPT-5.4), `chief-technology-officer` (GPT-5.4), `chief-finance-officer` (GPT-5.2)
**Classification:** Confidential — Board & Executive Leadership
**Status:** REVISED — Founder + CTO/CFO Review Integrated

---

## Changes from v1.0.0

1. **Database → Azure-native stack.** Replaced AWS RDS PostgreSQL / ElastiCache / NATS / S3 with Azure PostgreSQL Flexible Server (Tier 1/3), Azure Cosmos DB (Tier 2), Azure Cache for Redis, Azure Service Bus, Azure Blob Storage, and Azure AI Search. All infrastructure is now 100% Azure.
2. **Profitability analysis.** Added detailed cost/revenue/gross margin breakdown per pricing tier, including blended unit economics at scale.
3. **Emergency Response Agent (#38).** New dedicated agent separates emergency *detection* (Safety Guardian) from emergency *action* (Emergency Response Agent). Integrates with Azure Communication Services for real emergency number routing.
4. **Azure-native infrastructure.** Entire platform moved to Azure: AKS, Azure Front Door + WAF, Azure API Management, Azure VNet with NSGs, Azure Monitor + Application Insights, Azure Key Vault, Azure Container Registry. Scale path: 100K → 5M users.
5. **Investor mockups in Phase 1.** High-fidelity UI mockups and live demo environment included in Phase 1 timeline to support Series A fundraise.
6. **User Lifecycle Flow.** Full end-to-end diagram from Discovery → Onboarding → Mediation → Offboarding → Re-entry with data handling at each stage.
7. **Proactive Engagement Engine.** AI anticipates user needs through pattern recognition, scheduled check-ins, and pre-emptive de-escalation — not just reactive mediation.
8. **Platform Strategy.** Standalone app is PRIMARY (full 3-Tier). WhatsApp/Telegram/WeChat are Tier 3 notification channels only (Phase 2).
9. **Safety escalation to real emergency numbers.** Emergency Response Agent routes to actual emergency services (911/112/999). Includes false positive handling tiers (LOW → gentle check-in, MEDIUM → optional resources, HIGH/CRITICAL → SAFETY_HALT).
10. **Funding allocation detail.** $6M Series A (Month 3), $15–20M Series B (Month 18). Detailed allocation breakdown per category.
11. **Lean headcount.** AI-first operating model: 8 humans Y1 → 14 Y2 → 22 Y3. Agents do 90% of the work; humans supervise, audit, and handle edge cases.
12. **Anonymized data monetization.** Opt-in, k-anonymized relationship wellness insights sold to researchers, insurers, and EAP providers. Revenue: $500K Y2, $2M Y3, $5M Y4.
13. **Burn rate cut 57%.** Y1 $2.04M, Y2 $4.3M, Y3 $8M. Break-even moved to Q3 Y3 (from Q1 Y4). Lean headcount + Azure cost optimization + AI-first ops.

### Changes from v1.1.0

14. **LLM Infrastructure Transition Roadmap.** Three-phase plan: Phase 0 (pre-funding) uses GitHub Models API + PAT for development/testing with synthetic data only. Phase 1 (post-Series A) transitions to BYOK architecture on Azure OpenAI Service + Anthropic API + Vertex AI. Phase 2 (Month 12+) implements Model Cascading for cost-optimized inference.
15. **Model Cascading & CPI Management.** Added complexity classifier in LLM Gateway that routes 60% of traffic to cheapest models. Blended Cost Per Inference targets: $0.012 (Phase 1) → $0.006 (Phase 2) → $0.004 (Phase 3). Provider-agnostic gateway abstraction enables config-only provider swap.
16. **GitHub Models SDK for MVP.** Documented boundaries between free developmental usage (synthetic data, prompt engineering, investor demos) and required paid production usage (real user data). Hard line: real PII NEVER transits GitHub Models — BYOK required from first real user.

---

## Table of Contents

1. [Product Vision & Mission](#1-product-vision--mission)
2. [The 3-Tier Confidentiality Model](#2-the-3-tier-confidentiality-model)
3. [Multi-Agent Architecture Overview](#3-multi-agent-architecture-overview)
4. [Clinical Capabilities](#4-clinical-capabilities)
5. [Technical Architecture](#5-technical-architecture)
6. [Platform Strategy](#6-platform-strategy)
7. [User Lifecycle Flow](#7-user-lifecycle-flow)
8. [Business Strategy](#8-business-strategy)
9. [Cross-Pod Dependencies](#9-cross-pod-dependencies)
10. [Unified Risk Matrix](#10-unified-risk-matrix)
11. [Unified Timeline & Roadmap](#11-unified-timeline--roadmap)
12. [Unified Cost Model](#12-unified-cost-model)
13. [Funding & Capital Allocation](#13-funding--capital-allocation)
14. [Success Metrics Dashboard](#14-success-metrics-dashboard)
15. [Legal & Compliance Summary](#15-legal--compliance-summary)
16. [Team & Organizational Structure](#16-team--organizational-structure)
17. [Appendices](#17-appendices)

---

## 1. Product Vision & Mission

### What Relio Is

Relio is the world's first AI-powered 3-way relationship mediator — a private, neutral third party that sits between two partners (or co-parents) and transforms hostile, blame-laden communication into constructive, Socratic dialogue. It is not therapy. It is not a chatbot. It is structured mediation informed by evidence-based clinical frameworks (Gottman Method, Emotionally Focused Therapy, Adult Attachment Theory), delivered by 38 specialized AI agents, and protected by a privacy architecture that is physically incapable of leaking one partner's private words to the other.

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
6. **Proactive, Not Reactive.** The system anticipates and prevents conflict, not just mediates it. Pattern recognition, scheduled check-ins, and pre-emptive de-escalation are first-class capabilities — not afterthoughts. Waiting for a crisis is a design failure.

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
│  Storage: Azure PostgreSQL Flexible Server — per-user isolated      │
│           database partition (isolated subnet, NO internet gateway,  │
│           NO VNet peering). Encrypted at rest (AES-256) via Azure   │
│           Key Vault managed keys. Private Endpoint only.            │
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
│  Storage: Azure Cosmos DB (NoSQL) — Medical Pod internal. RU-based  │
│           autoscaling. Multi-region replication for HA. Private     │
│           Endpoint only. No public network access.                  │
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
│  Storage: Azure PostgreSQL Flexible Server — shared session         │
│           database (separate private subnet). Azure Blob Storage    │
│           for media/documents. Azure Cache for Redis for real-time  │
│           pub/sub and session state.                                │
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
| **Network** | Tier 1 databases reside in an isolated Azure VNet subnet with NO internet gateway, NO NAT, NO VNet peering. Access ONLY via Azure Private Endpoint from the application tier within the same VNet. NSG rules explicitly DENY all traffic except from the application subnet. |
| **Database** | Separate Azure PostgreSQL Flexible Server instances per tier. No cross-database foreign keys. `shared_room.user_a_id` and `user_b_id` are opaque UUIDs — not foreign keys to any private store. `CHECK` constraints enforce immutable tier classification. |
| **Encryption** | Azure Key Vault manages all encryption keys. Tier 1 databases use customer-managed keys (CMK) with automatic rotation. TDE enabled. All connections require TLS 1.3. |
| **Application** | Separate ORM connection pools per tier. No code path can query two users' Tier 1 stores in a single operation. Azure API Management enforces tier-aware routing policies. |
| **LLM Pipeline** | PII redaction engine (Azure AI Language + Presidio) strips names, locations, and identifiers before any LLM API call. Post-flight validation scans LLM output against recent Tier 1 phrases. |
| **Meta-Audit** | The CPO agent validates every Tier 3 output before delivery for clinical soundness, bias, and Tier 1 leakage. |
| **CI/CD** | Canary string injection tests run on every PR via GitHub Actions. If any Tier 1 canary string appears in any Tier 3 payload, the entire build fails. |
| **IAM** | Azure RBAC with custom role definitions. AKS pods use Managed Identities scoped to their tier. WebSocket services have explicit DENY policies for Tier 1 database resource IDs. Only the Intercept & Hold service can write to Tier 1. |

### Why This Makes Relio Uncopyable

A competitor adding "private mode" to their couples app gains nothing. Their database still has JOINable tables. Their API still has endpoints that can surface raw content. Their prompt can be jailbroken. Relio's isolation is physical, network-enforced, and cryptographically backed. Replicating it requires rebuilding the entire data architecture from scratch — a 12–18 month engineering effort that cannot be incrementally retrofitted.

---

## 3. Multi-Agent Architecture Overview

### Why Multi-Agent, Not Monolithic

A monolithic AI cannot hold the responsibilities of relationship mediation. It cannot simultaneously be a safety monitor, an attachment theorist, a crisis de-escalator, a logistical mediator, a psychoeducator, and a business strategist. Each clinical function must be auditable in isolation. Safety signals must propagate independently of system load. Model selection must be driven by task requirements, not one-size-fits-all cost optimization.

Relio's 38 agents are organized into three pods, each with distinct authority and isolation boundaries.

### Pod Responsibilities

| Pod | Mission | Agent Count | Authority Boundary |
|-----|---------|-------------|-------------------|
| **Medical Pod** | Clinical nervous system. Interpret, classify, and transform raw emotional language into safe, therapeutically grounded guidance. Proactively anticipate conflict and intervene before escalation. | 14 | Clinical decisions are never influenced by revenue targets. Safety signals propagate independently. Emergency response executes autonomously. |
| **Tech Pod** | Design, build, operate, and defend the secure, scalable, privacy-first Azure infrastructure. | 15 | Infrastructure decisions enforce the 3-Tier Model as a hard invariant. |
| **Ops Pod** | Transform clinical capabilities into sustainable, legally compliant, commercially dominant business. | 9 | Revenue never degrades the 3-Tier Model. Monetization reinforces the moat. |

### Combined System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RELIO: 38-AGENT SYSTEM                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      MEDICAL POD (14 agents)                    │   │
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
│  │                                                                  │   │
│  │   Safety Guardian ──[SAFETY_HALT]──► Emergency Response Agent   │   │
│  │                      ├── Real emergency number routing           │   │
│  │                      ├── Duty-to-warn execution                  │   │
│  │                      ├── Azure Communication Services            │   │
│  │                      └── Post-crisis follow-up                   │   │
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

### Full Agent Directory (38 Agents)

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
| 16 | `cloud-architect` | Tech | GPT-5.3-Codex | Azure VNet design, IaC (Terraform), scaling policies |
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
| **38** | **`emergency-response-agent`** | **Medical** | **GPT-5.4** | **Executes emergency protocols on SAFETY_HALT. Routes to real emergency numbers via Azure Communication Services. Manages duty-to-warn legal execution. Coordinates post-crisis follow-up and re-entry.** |

### Separation of Concerns: Detection vs. Action

```
┌──────────────────────────────┐     ┌──────────────────────────────────┐
│     SAFETY GUARDIAN (#3)     │     │  EMERGENCY RESPONSE AGENT (#38)  │
│                              │     │                                  │
│  DETECTS threats:            │     │  ACTS on threats:                │
│  • Monitors all Tier 1 input │────►│  • Executes SAFETY_HALT lockout  │
│  • Classifies severity level │     │  • Delivers localized emergency  │
│  • Raises SAFETY_HALT flag   │     │    resources (hotlines, shelters)│
│  • Flags patterns (DARVO,    │     │  • Routes to 911/112/999 via     │
│    coercive control)         │     │    Azure Communication Services  │
│                              │     │  • Executes duty-to-warn with    │
│  Does NOT:                   │     │    CLO coordination              │
│  • Contact external services │     │  • Manages post-crisis follow-up │
│  • Make legal decisions      │     │  • Handles false positive triage │
│  • Communicate with user     │     │  • Logs all actions for audit    │
│    about the threat          │     │  • Coordinates session re-entry  │
└──────────────────────────────┘     └──────────────────────────────────┘
```

**Why separate?** The Safety Guardian must remain a pure detection engine — fast, always-on, zero side effects. Mixing detection with action creates coupling that slows detection latency, introduces failure modes (what if the SMS API is down?), and makes auditability harder. The Emergency Response Agent is the execution arm: it handles the messy, stateful, multi-step work of actually helping someone in danger.

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
    │         └── THREAT DETECTED → Severity Classification
    │              ├── LOW → Flag for monitoring, continue pipeline
    │              ├── MEDIUM → Alert CPO, increase monitoring, continue
    │              ├── HIGH → SAFETY_HALT ──► EMERGENCY RESPONSE AGENT
    │              └── CRITICAL → SAFETY_HALT ──► EMERGENCY RESPONSE AGENT
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

    ─── ON SAFETY_HALT ───

[10] EMERGENCY RESPONSE AGENT (GPT-5.4) — Executes emergency protocol:
     ├── Pipeline execution immediately halted mid-stream
     ├── All pending Tier 3 outputs quarantined
     ├── Affected user receives localized emergency resources
     ├── If CRITICAL: Route to real emergency services via
     │   Azure Communication Services (911/112/999)
     ├── CLO notified for duty-to-warn evaluation
     ├── Session locked — only human clinical reviewer can clear
     └── Post-crisis follow-up scheduled (24h, 72h, 7d check-ins)
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

**Severity Levels and False Positive Handling:**

| Level | Signal Examples | Action | False Positive Handling |
|-------|----------------|--------|----------------------|
| `LOW` | Vague frustration language, mild hopelessness, passive complaints about wanting to "disappear" | Flag for monitoring. Continue pipeline. | Gentle check-in embedded in next Tier 3 output: *"We noticed you might be going through a tough time. How are you really feeling?"* No alarm, no disruption. |
| `MEDIUM` | Repeated escalating language, isolation patterns, references to self-harm in past tense, veiled threats | Alert CPO. Increase monitoring frequency. Offer optional resources in Tier 1. | Optional resource card shown in private space: *"If you're struggling, these resources are here for you."* User can dismiss. No session interruption. Review by CPO within 4 hours. |
| `HIGH` | Direct threat of harm, active suicidal ideation with plan, described physical violence, child at risk | `SAFETY_HALT` → Emergency Response Agent activates. Pipeline frozen. Emergency resources delivered. | Emergency Response Agent initiates structured de-escalation. If user clarifies context (e.g., quoting a movie, describing past resolved event), human clinical reviewer can clear halt within 30 minutes. Incident logged regardless. |
| `CRITICAL` | Imminent danger to life, active violence in progress, child in immediate danger | `SAFETY_HALT` → Emergency Response Agent activates. Real emergency number routing (911/112/999) via Azure Communication Services. Duty-to-warn execution. | No false positive accommodation. Every CRITICAL is treated as genuine. Human review post-incident. If determined false positive, user receives explanation and session restoration within 1 hour. |

**On SAFETY_HALT — Emergency Response Agent Protocol:**
1. Pipeline execution immediately halted mid-stream
2. All pending Tier 3 outputs quarantined
3. Emergency Response Agent takes control of user session
4. Affected user receives localized emergency resources (hotlines, shelters, crisis text lines)
5. For CRITICAL: Azure Communication Services routes to real emergency numbers (911/112/999 based on locale)
6. CLO notified for duty-to-warn legal evaluation
7. Session locked — only human clinical reviewer can clear
8. Post-crisis follow-up scheduled: 24h check-in, 72h check-in, 7-day follow-up
9. All actions logged to immutable audit trail (Azure Blob Storage, append-only)

No agent — including the Orchestrator and CPO — can override a Safety Guardian `SAFETY_HALT`.

### 4.4 Proactive Engagement Engine

**Philosophy:** A reactive-only mediation system fails users. By the time someone types an angry message, the conflict has already escalated. Relio's Proactive Engagement Engine uses pattern recognition and behavioral modeling to intervene *before* escalation.

**4.4.1 Pattern-Based Interventions**

The `relationship-dynamics` and `progress-tracker` agents continuously analyze longitudinal data to identify pre-conflict patterns:

| Pattern Detected | Proactive Intervention | Timing |
|-----------------|----------------------|--------|
| Increasing message frequency + negative sentiment trending | Preemptive calming exercise pushed to both partners | Before next session |
| Stonewalling pattern (partner goes silent for >48h after conflict) | Gentle re-engagement prompt to withdrawing partner + patience exercise to pursuing partner | 24h after silence |
| Recurring trigger topic (e.g., finances mentioned → conflict 80% of the time) | Topic-specific psychoeducation module unlocked proactively | Before next mention |
| Anniversary of difficult event approaching (separation date, loss) | Anticipatory support resources + therapist referral suggestion | 3 days before |
| Four Horsemen frequency increasing week-over-week | Personalized "relationship weather report" with specific antidote exercises | Weekly summary |
| One partner's engagement dropping (fewer sessions, shorter messages) | Re-engagement nudge calibrated to attachment style | After 3-day drop |

**4.4.2 Scheduled Check-Ins**

Proactive, AI-initiated touchpoints that are NOT triggered by crisis:

- **Daily micro-check-in** (Premium): 1-question pulse ("How connected did you feel to your partner today?" — 1-5 scale). Feeds `progress-tracker`.
- **Weekly relationship summary** (Premium): Non-shaming digest of communication patterns, positive moments, and growth areas. Delivered to each partner's Tier 1 space.
- **Monthly deep-dive** (Premium+): Comprehensive progress report, phase transition readiness assessment, therapist consultation recommendation if needed.
- **Milestone celebrations**: Triggered by positive trend data (e.g., "You've had 5 consecutive productive conversations — that's real progress!").

**4.4.3 Crisis Prevention (Pre-emptive De-escalation)**

```
Proactive Engagement Engine — Crisis Prevention Pipeline

[1] Longitudinal Pattern Analysis (relationship-dynamics)
    │
    ├── Conflict frequency increasing? ──► Preemptive exercise delivery
    ├── Communication gap widening? ──► Re-engagement protocol
    ├── Negative sentiment slope > threshold? ──► Guided reflection prompt
    └── External stressor detected (holiday, job loss, illness)? ──► Support resources
    │
    ▼
[2] Pre-emptive Intervention Selection (orchestrator)
    │
    ├── Tier 1: Private coaching for at-risk partner
    ├── Tier 3: Shared exercise suggested in mediation room
    └── Escalation: Therapist referral if pattern persists >2 weeks
    │
    ▼
[3] Delivery & Feedback Loop (communication-coach + progress-tracker)
    │
    ├── Track intervention acceptance rate
    ├── Measure post-intervention sentiment shift
    └── Refine pattern models with outcome data
```

### 4.5 Relationship Stage Lifecycle

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

### 5.1 Azure System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RELIO AZURE SYSTEM ARCHITECTURE                        │
│                                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐               │
│  │  iOS Client  │     │Android Client│     │  Web Client  │               │
│  │ Swift/SwiftUI│     │Kotlin/Compose│     │  (Phase 2)   │               │
│  │ Secure       │     │ Android      │     │              │               │
│  │ Enclave      │     │ Keystore     │     │              │               │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘               │
│         │         TLS 1.3 + WSS              │                             │
│         └────────────────┬───────────────────┘                             │
│                          ▼                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │              AZURE FRONT DOOR + WAF (Global)                      │     │
│  │              DDoS Protection Standard │ Geo-routing               │     │
│  └──────────────────────┬────────────────────────────────────────────┘     │
│                          ▼                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │          AZURE API MANAGEMENT (Premium Tier)                      │     │
│  │          Rate Limiting │ Auth │ CORS │ LLM Gateway Policies       │     │
│  │          Tier-Aware Routing │ Cost Tracking │ Analytics            │     │
│  └────────────┬──────────────────┬───────────────────────────────────┘     │
│            REST API          WebSocket                                      │
│               ▼                 ▼                                           │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │          AZURE KUBERNETES SERVICE (AKS) — Private Cluster         │     │
│  │          ┌─────────────────────────────────────────────────┐      │     │
│  │          │            APPLICATION TIER                      │      │     │
│  │          │  Auth Service │ WebSocket Server │ REST API      │      │     │
│  │          │  Intercept & Hold │ Medical Pod Services          │      │     │
│  │          │                                                   │      │     │
│  │          │           LLM GATEWAY (via APIM)                  │      │     │
│  │          │  ┌─────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ │      │     │
│  │          │  │Claude4.6│ │GPT-5.4 │ │GPT-5.3-  │ │Gemini  │ │      │     │
│  │          │  │Opus/Son.│ │        │ │Codex     │ │3.1 Pro │ │      │     │
│  │          │  └─────────┘ └────────┘ └──────────┘ └────────┘ │      │     │
│  │          │                                                   │      │     │
│  │          │  PII Redaction (Azure AI Language + Presidio)     │      │     │
│  │          │  Azure AI Search (session indexing, knowledge)    │      │     │
│  │          └─────────────────────────────────────────────────┘      │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │             DATA TIER (Isolated VNet Subnets)                     │     │
│  │                                                                    │     │
│  │  ┌────────────────────┐  ┌────────────────────┐  ← Subnet A      │     │
│  │  │  TIER 1 PRIVATE    │  │  TIER 1 PRIVATE    │  (Isolated)      │     │
│  │  │  User A             │  │  User B             │  NSG: DENY ALL  │     │
│  │  │  Azure PostgreSQL  │  │  Azure PostgreSQL  │  except app svc  │     │
│  │  │  Flexible Server   │  │  Flexible Server   │  Private Endpt   │     │
│  │  └────────────────────┘  └────────────────────┘                   │     │
│  │                                                                    │     │
│  │  ┌────────────────────────────────────────────┐  ← Subnet B      │     │
│  │  │     TIER 2 ABSTRACTED (Azure Cosmos DB)     │  (Medical only)  │     │
│  │  │     NoSQL document store │ Auto-scale RU     │  Private Endpt   │     │
│  │  └────────────────────────────────────────────┘                   │     │
│  │                                                                    │     │
│  │  ┌────────────────────────────────────────────┐  ← Subnet C      │     │
│  │  │     TIER 3 SHARED ROOM                      │  (Shared svc)    │     │
│  │  │     Azure PostgreSQL Flexible Server        │  Private Endpt   │     │
│  │  └────────────────────────────────────────────┘                   │     │
│  │                                                                    │     │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐  │     │
│  │  │Azure Cache for   │ │Azure Service Bus │ │Azure Blob Storage│  │     │
│  │  │Redis (Premium)   │ │(Premium)         │ │(Immutable audit  │  │     │
│  │  │Session + Pub/Sub │ │Event-driven arch │ │logs, media vault) │  │     │
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘  │     │
│  └───────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │                      OPERATIONS TIER                               │     │
│  │  Azure Monitor │ Application Insights │ Log Analytics Workspace   │     │
│  │  Azure Key Vault │ Azure Container Registry │ GitHub Actions      │     │
│  │  Azure Communication Services (emergency routing)                  │     │
│  │  Microsoft Defender for Cloud │ Azure Policy                       │     │
│  └───────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Azure Database Stack

| Tier | Service | Purpose | Configuration |
|------|---------|---------|---------------|
| **Tier 1 (Private)** | Azure PostgreSQL Flexible Server | Per-user isolated private data | General Purpose D4s_v3, 128 GB storage, CMK encryption via Key Vault, Private Endpoint, geo-redundant backup, point-in-time restore (35 days) |
| **Tier 2 (Abstracted)** | Azure Cosmos DB (NoSQL API) | Medical Pod internal clinical data | Autoscale 400–4000 RU/s, multi-region writes (HA), session consistency, Private Endpoint, analytical store enabled for aggregation |
| **Tier 3 (Shared)** | Azure PostgreSQL Flexible Server | Shared mediation room data | General Purpose D4s_v3, 256 GB storage, CMK encryption, Private Endpoint, read replicas for analytics |
| **Cache** | Azure Cache for Redis (Premium P1) | Session state, real-time pub/sub, rate limiting | 6 GB, clustering enabled, VNet integration, data persistence (AOF), Private Endpoint |
| **Event Bus** | Azure Service Bus (Premium) | Async event-driven architecture, agent-to-agent messaging | 1 MU, topics + subscriptions per agent, dead-letter queues, duplicate detection, Private Endpoint |
| **Object Store** | Azure Blob Storage (Hot + Archive) | Immutable audit logs, media vault, document storage | WORM policies for audit logs, soft delete, versioning, lifecycle management to Archive tier after 90 days |
| **Search** | Azure AI Search (Standard S1) | Session indexing, knowledge base, psychoeducation content | Semantic ranking, vector search for session similarity, Private Endpoint |

### 5.3 Network Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AZURE VNET (10.0.0.0/16)                         │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Subnet A: Tier 1 Isolated (10.0.1.0/24)                   │    │
│  │  NSG Rules:                                                  │    │
│  │    INBOUND:  ALLOW TCP 5432 from 10.0.4.0/24 (App Subnet)  │    │
│  │              DENY ALL other                                  │    │
│  │    OUTBOUND: DENY ALL (no internet, no NAT, no peering)     │    │
│  │  Resources: Azure PostgreSQL Flexible Server (Tier 1 × N)   │    │
│  │  Access: Private Endpoint ONLY from App Subnet               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Subnet B: Tier 2 Medical (10.0.2.0/24)                    │    │
│  │  NSG Rules:                                                  │    │
│  │    INBOUND:  ALLOW TCP 443 from 10.0.4.0/24 (App Subnet)   │    │
│  │              DENY ALL other                                  │    │
│  │    OUTBOUND: DENY ALL except Azure Cosmos DB Private Endpt  │    │
│  │  Resources: Azure Cosmos DB (Private Endpoint)               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Subnet C: Tier 3 Shared (10.0.3.0/24)                     │    │
│  │  NSG Rules:                                                  │    │
│  │    INBOUND:  ALLOW TCP 5432 from 10.0.4.0/24 (App Subnet)  │    │
│  │              DENY ALL other                                  │    │
│  │    OUTBOUND: DENY ALL except to Redis, Service Bus          │    │
│  │  Resources: Azure PostgreSQL (Tier 3), Redis, Service Bus   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Subnet D: Application (10.0.4.0/22)                        │    │
│  │  Resources: AKS Node Pool, APIM (VNet-injected)              │    │
│  │  NSG: ALLOW ingress from APIM, ALLOW egress to data subnets │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Subnet E: Operations (10.0.8.0/24)                         │    │
│  │  Resources: Azure Bastion, CI/CD runners, monitoring         │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

**Key invariant:** Subnet A (Tier 1) has NO outbound internet access, NO NAT gateway, NO VNet peering. The only inbound path is from Subnet D (Application) via Private Endpoint, and only the Intercept & Hold service and Safety Guardian have Managed Identity credentials to access it.

### 5.4 Dual-Context Database

**Core Invariants:**
1. **No Cross-User Foreign Keys** — `shared_room.user_a_id` and `user_b_id` are opaque UUIDs, not foreign keys
2. **No Cross-Database JOINs** — Enforced at network layer (separate instances in isolated subnets) and ORM layer (separate connection pools)
3. **Write-Once Tier Classification** — Every record classified at write time; `CHECK` constraints enforce immutability; Tier 1 data cannot be "promoted" to Tier 3

### 5.5 Real-Time WebSocket Sync

- **Protocol:** WSS over TLS 1.3, Socket.io with Azure Cache for Redis Pub/Sub adapter
- **Intercept & Hold:** Raw message captured → persisted to Tier 1 → HELD (partner sees nothing) → routed to Medical Pod → Tier 3 output → sanitized → broadcast to both partners
- **Reconnection:** Exponential backoff (1s→2s→4s→8s→max 30s), replay missed Tier 3 messages from Shared Room Store — invisible to users
- **Push Notifications:** Metadata-only — NEVER include message content (shoulder-surfing prevention)
- **Event-Driven:** Azure Service Bus topics for agent-to-agent async messaging, dead-letter queues for failed deliveries

### 5.6 LLM Gateway (via Azure API Management)

Single point of egress for all AI model interactions. No service may call an LLM API directly. Azure API Management provides unified gateway with rate limiting, cost tracking, and circuit breaker policies.

**Pipeline:** Request Validation → PII Redaction → Model Router → Response Validator → Cost Accounting

**PII Redaction (Azure AI Language + Presidio):**
- Input: *"My husband John keeps visiting his ex Sarah at 1234 Oak Street"*
- Redacted: *"My partner [PARTNER] keeps visiting their ex [PERSON_1] at [LOCATION_1]"*
- Post-flight: Verify LLM response doesn't reconstruct redacted entities
- Azure AI Language entity recognition + Microsoft Presidio custom analyzers for relationship-specific PII

#### 5.6.1 Infrastructure Transition Roadmap: GitHub Models → Azure BYOK

The LLM Gateway is built as a **provider-agnostic abstraction** from day one. Application code calls `callLLM("orchestrator", messages)` — the gateway decides the backend provider based on a config flag. This makes provider transitions a deployment config change, not a code rewrite.

**Phase 0: Pre-Funding / MVP Development (Now → Month 3)**

```
Developer PAT → GitHub Models API (free tier)
                └── GPT-4o, Claude 3.5 Sonnet, Llama, Mistral
                    (rate-limited: ~150 req/min GPT-4o, ~10 req/min large models)

Use for:     Prompt engineering, agent integration testing, investor demos (synthetic data)
DO NOT use:  Production user traffic, real PII, customer-facing API calls
```

- All development uses **synthetic test data only** — no real user PII ever transits GitHub Models
- `@github/models` SDK with Personal Access Token for rapid experimentation:

```typescript
import ModelClient from "@github/models";

const client = new ModelClient(process.env.GITHUB_TOKEN);

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: orchestratorSystemPrompt },
    { role: "user", content: syntheticUserMessage }
  ],
  temperature: 0.3
});
```

- Gateway config: `LLM_PROVIDER=github`

**Phase 1: Post-Series A / First Real Users (Month 3 → Month 12)**

Transition to Bring Your Own Key (BYOK) on enterprise-grade providers:

```
Relio App → Azure API Management (LLM Gateway)
                │
                ├── Azure OpenAI Service (GPT-5.4, GPT-5.3-Codex)
                │   └── Your Azure subscription, your keys, your quota
                │   └── HIPAA BAA eligible, zero data retention, data stays in-region
                │
                ├── Anthropic API (Claude Opus 4.6, Claude Sonnet 4.6)
                │   └── Enterprise agreement, zero-retention clause
                │
                └── Google Vertex AI (Gemini 3.1 Pro)
                    └── Your GCP project, Gemini-only, safety-critical monitoring
```

- Gateway config: `LLM_PROVIDER=azure` (single config change from Phase 0)
- PII redaction active on all requests before any LLM API call
- Zero-retention agreements with all providers (contractual + technical)
- Azure HIPAA BAA in place before first real user

**Provider Selection Rationale:**

| Provider | Service | Models | Why BYOK |
|----------|---------|--------|----------|
| OpenAI | Azure OpenAI Service | GPT-5.4, GPT-5.3-Codex | Data residency, SLA, no training on Relio data, HIPAA BAA |
| Anthropic | Anthropic API (direct) | Claude Opus 4.6, Sonnet 4.6 | Zero-retention agreement, superior empathetic language generation |
| Google | Vertex AI | Gemini 3.1 Pro | Managed Gemini, low latency for always-on safety monitoring |

**Hard Boundary — Free vs. Paid:**

| Usage | GitHub Models (Free PAT) | BYOK (Paid Enterprise) |
|-------|--------------------------|------------------------|
| Internal dev/testing | Allowed | Not needed yet |
| Investor demos (synthetic data) | Allowed (low volume) | Recommended |
| Beta users (<100) | NOT recommended | Required if real data |
| Production (100+ users) | **Prohibited** (ToS violation) | **Required** |
| Real user PII in prompts | **NEVER** — GitHub sees data | Use Azure OpenAI (your keys) |

> **Non-negotiable:** The moment real users send real relationship data, all traffic MUST flow through BYOK providers. GitHub Models free tier is for exploration and experimentation only. Tier 1 data through a third-party dev tool = catastrophic trust violation.

#### 5.6.2 Model Cascading & Cost Per Inference (CPI) Management

**Phase 2: Scale Optimization (Month 12+)**

The LLM Gateway implements a **Complexity Classifier** that routes each request to the cheapest model capable of handling it, strictly managing Cost Per Inference (CPI).

```
User Message Arrives
    │
    ▼
[Complexity Classifier] ── Simple (greeting, ack, scheduling) ──► GPT-5.3-Codex ($)
    │                                                                ~$0.002/call
    ├── Medium (profiling, cycle detection) ──► Claude Sonnet 4.6 ($$$)
    │                                              ~$0.008/call
    ├── Complex (Socratic translation, crisis) ──► Claude Opus 4.6 ($$$$)
    │                                                  ~$0.025/call
    └── Safety-critical (DV, abuse, suicidal) ──► Gemini 3.1 Pro ($$)
                                                      ~$0.004/call
```

**Traffic Distribution (Model Cascading at scale):**

| Complexity | % of Traffic | Model | Cost/Call | Weighted CPI |
|------------|-------------|-------|-----------|---------------|
| Simple | 40% | GPT-5.3-Codex | $0.002 | $0.0008 |
| Medium | 30% | Claude Sonnet 4.6 | $0.008 | $0.0024 |
| Complex | 20% | Claude Opus 4.6 | $0.025 | $0.0050 |
| Safety | 10% | Gemini 3.1 Pro | $0.004 | $0.0004 |
| **Blended** | **100%** | | | **$0.0086** |

**CPI Reduction Roadmap:**

| Phase | Blended CPI | Monthly LLM Spend (100K MAU) | Strategy |
|-------|-------------|------------------------------|----------|
| Phase 1 (no cascading) | ~$0.012 | ~$96,000 | Single model per agent |
| Phase 2 (cascading live) | ~$0.006 | ~$48,000 | Complexity routing, 60% to cheapest |
| Phase 3 (+ caching + fine-tuning) | ~$0.004 | ~$32,000 | Tier 2 cache, response templates, fine-tuned models |

**Cost optimization levers stacked:**

| Strategy | Savings | Owner | Timeline |
|----------|---------|-------|----------|
| Model Cascading (complexity routing) | 40–50% | `vp-rnd` | Month 12 |
| Cosmos DB Tier 2 caching (stable profiles) | 10–15% | `backend-developer` | Month 8 |
| Response templating (timeout, exercises) | 5–8% | `skills-builder` | Month 10 |
| Progressive context windowing | 15–20% | `vp-rnd` | Month 12 |
| Azure OpenAI Provisioned Throughput Units (PTUs) | 30–40% on committed volume | `cloud-architect` | Month 14 |
| Fine-tuned smaller models per agent | 25–40% per task | `vp-rnd` | Month 18 |

#### 5.6.3 Implementation Action Items

| Week | Action | Owner |
|------|--------|-------|
| Now | Use GitHub Models API + PAT for all agent development and prompt tuning (synthetic data only) | `backend-developer` |
| Now | Build LLM Gateway abstraction: `callLLM(agent, messages)` routes to GitHub Models now, Azure OpenAI later via config | `backend-developer` |
| W1–2 | Implement provider-agnostic interface with `LLM_PROVIDER` env var | `cloud-architect` |
| W3 (post-funding) | Provision Azure OpenAI Service, Anthropic enterprise account, Vertex AI project | `cloud-architect` |
| W3 | Flip config: `LLM_PROVIDER=github` → `LLM_PROVIDER=azure` | `backend-developer` |
| W4 | PII redaction pipeline live (Azure AI Language + Presidio) | `data-privacy-officer` |
| W8 | Tier 2 caching + response templating implemented | `backend-developer` |
| W12 | Model Cascading complexity classifier live in LLM Gateway | `vp-rnd` |
| W14 | Negotiate Azure OpenAI PTU reserved capacity based on usage data | `chief-finance-officer` |
| M18 | First fine-tuned models deployed for high-volume agents | `vp-rnd` |

### 5.7 Mobile Architecture

| Platform | Language | UI Framework | Security |
|----------|---------|-------------|----------|
| iOS | Swift 5.9+ | SwiftUI | Secure Enclave (AES-256, FaceID/TouchID binding) |
| Android | Kotlin 2.0+ | Jetpack Compose | Android Keystore (StrongBox, biometric binding) |

**Privacy Mode vs Shared Mode:** Visual themes, headers, data destinations, and screenshot protections change based on context. Privacy Mode uses `FLAG_SECURE` (Android) and hidden-in-app-switcher (iOS).

**Offline Sync:** Entries encrypted with device master key → queued with timestamp → uploaded on reconnect (oldest first) → server confirms → idempotent sync.

### 5.8 Security Posture

**STRIDE Threat Model — Top Threats:**

| Threat | Category | Mitigation |
|--------|----------|------------|
| Abusive partner reads Tier 1 via device theft | Spoofing | Biometric gating + local data wipe after 3 failures |
| SQL injection to partner's private store | Tampering | Network-isolated DBs, parameterized queries, no cross-DB JOINs |
| Prompt injection reveals Tier 1 | Info Disclosure | 4-layer defense: system prompt hardening, output validation, canary injection, behavioral analysis |
| Session hijacking | Spoofing | Short-lived JWTs (15 min), device binding, refresh rotation |
| Insider threat | Elevation of Privilege | No admin access to Tier 1 DBs, Azure RBAC with audit logging, role separation, Managed Identities |

**Prompt Injection Defense (4 Layers):**
1. System prompt hardening with explicit prohibitions
2. Post-generation scan against rolling Tier 1 phrase window (fuzzy + semantic matching)
3. Canary string injection — detection = immediate build failure
4. Behavioral pattern detection (role-play attempts, encoding tricks)

### 5.9 CI/CD

- GitHub Actions with `contents: read` default (NEVER grant write)
- CodeQL security scanning on every PR
- Privacy leak detection (canary strings): fail-fast, blocks entire pipeline
- Draft PR review gates: all AI-generated code submitted as Draft, requires human approval
- Canary releases: 5% → 25% → 100%, automated rollback on >1% error rate
- Azure Container Registry for image management with vulnerability scanning (Microsoft Defender for Containers)
- Infrastructure as Code: Terraform 1.8+ with Azure backend state storage

### 5.10 Scale Path: 100K → 5M Users

| Scale Stage | MAU | AKS Config | Database | Redis | Estimated Azure Cost/Mo |
|-------------|-----|-----------|----------|-------|------------------------|
| Stage 1 | 100K | 3-node D4s_v3 | Single-region PG + Cosmos DB | P1 (6 GB) | $18,000 |
| Stage 2 | 500K | 6-node D8s_v3 + autoscale | Multi-region PG read replicas + Cosmos multi-write | P2 (13 GB) clustered | $62,000 |
| Stage 3 | 1M | 12-node D8s_v3 + spot nodes | Sharded PG (Citus) + Cosmos global distribution | P3 (26 GB) clustered | $135,000 |
| Stage 4 | 5M | Multi-cluster AKS (3 regions) | Hyperscale Citus + Cosmos 5-region | P4 (53 GB) multi-region | $480,000 |

### 5.11 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Mobile iOS | Swift 5.9+, SwiftUI, CoreData, Secure Enclave |
| Mobile Android | Kotlin 2.0+, Jetpack Compose, Room, SQLCipher, Android Keystore |
| Backend Runtime | Node.js 22 LTS (TypeScript) |
| Backend Framework | Fastify (REST), Socket.io (WebSocket) |
| Database (Tier 1/3) | Azure PostgreSQL Flexible Server (General Purpose) |
| Database (Tier 2) | Azure Cosmos DB (NoSQL API) |
| Cache | Azure Cache for Redis (Premium, VNet-integrated) |
| Event Bus | Azure Service Bus (Premium, Topics + Subscriptions) |
| Object Store | Azure Blob Storage (Hot + Archive, WORM for audit) |
| Search | Azure AI Search (Standard S1, semantic + vector) |
| Orchestration | Azure Kubernetes Service (AKS, private cluster) |
| API Gateway | Azure API Management (Premium, VNet-injected) |
| CDN / WAF | Azure Front Door (Premium) + WAF policies |
| PII Redaction | Azure AI Language + Presidio (Microsoft) |
| Secrets | Azure Key Vault (Premium, HSM-backed for CMK) |
| Container Registry | Azure Container Registry (Premium, geo-replicated) |
| IaC | Terraform 1.8+ (Azure backend state) |
| Observability | Azure Monitor, Application Insights, Log Analytics |
| Alerting | Azure Monitor Alerts + PagerDuty integration |
| Emergency Comms | Azure Communication Services (SMS/Voice) |
| Identity | Azure RBAC + Managed Identities (zero-secret workloads) |
| Compliance | Microsoft Defender for Cloud, Azure Policy |
| Analytics | PostHog (self-hosted on AKS, privacy-first) |
| Feature Flags | LaunchDarkly |

---

## 6. Platform Strategy

### 6.1 Platform Evaluation

Relio must decide its primary delivery platform. The 3-Tier Confidentiality Model imposes hard constraints that most messaging platforms cannot satisfy.

| Platform | Privacy | Technical Feasibility | Reach | Recommendation |
|----------|---------|----------------------|-------|----------------|
| **Standalone App (iOS + Android)** | **FULL** — Complete control over encryption, storage isolation, network architecture. 3-Tier Model enforceable at every layer. | **FULL** — Native biometrics, Secure Enclave/Keystore, offline sync, screenshot protection, custom push. | Requires download. Higher friction. But users who download are higher-intent. | **PRIMARY — Full 3-Tier.** All mediation, coaching, and clinical features live here. |
| **WhatsApp** | **INSUFFICIENT** — End-to-end encrypted, but Meta controls the infrastructure. No per-user database isolation. No prevention of screenshot/forward. WhatsApp Business API stores messages on Meta servers. | **LIMITED** — No biometric gating, no Privacy Mode UX, no real-time pipeline interception. Bot API only. | 2B+ users. Massive reach in LATAM, India, Africa, Europe. | **Tier 3 CHANNEL ONLY** — Notifications, scheduled check-in reminders, appointment confirmations. NO Tier 1/2 content. Phase 2. |
| **Telegram** | **INSUFFICIENT** — Secret Chats are E2E, but bot interactions are NOT. Telegram stores all bot messages server-side. No user isolation possible. | **LIMITED** — Rich bot API, but no biometric enforcement, no screenshot blocking, no tier isolation. | 900M+ users. Strong in Eastern Europe, Middle East, tech communities. | **Tier 3 CHANNEL ONLY** — Same as WhatsApp. Phase 2. |
| **WeChat** | **PROBLEMATIC** — Data stored on Tencent servers. Chinese government access requirements. No privacy guarantees for international users. | **COMPLEX** — Mini Programs possible but WeChat controls the runtime. No encryption guarantees. | 1.3B users. Dominant in China. | **EVALUATE Phase 3** — Only if entering Chinese market with dedicated data residency and legal structure. |
| **Web App** | **GOOD** — Full control, but browser-based security is weaker than native. No Secure Enclave. Screenshot protection unreliable. | **GOOD** — WebSocket support, IndexedDB, Web Crypto API. More limited security than native. | Universal access. No download friction. | **SECONDARY — Phase 2.** Basic mediation for users who can't/won't install. Tier 3 features only until native-level security is achieved. |

### 6.2 Strategy Decision

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PLATFORM STRATEGY DECISION                        │
│                                                                      │
│  PHASE 1 (Launch):                                                   │
│    Standalone iOS + Android App = PRIMARY                            │
│    Full 3-Tier Confidentiality                                       │
│    All clinical features                                             │
│    All mediation capabilities                                        │
│                                                                      │
│  PHASE 2 (Year 1 Q3–Q4):                                           │
│    WhatsApp + Telegram = Tier 3 Notification Channels                │
│    ├── Scheduled check-in reminders                                  │
│    ├── Session availability notifications                            │
│    ├── Milestone celebration messages (non-clinical)                 │
│    └── Deep links back to standalone app for all interactions        │
│    Web App = Secondary access (Tier 3 features only)                 │
│                                                                      │
│  PHASE 3 (Year 2+):                                                 │
│    WeChat = Evaluate for China market entry                          │
│    Web App = Expand to basic Tier 1 with WebAuthn                   │
│    Apple Watch / Wear OS = Micro-interactions (Phase 3+)            │
└─────────────────────────────────────────────────────────────────────┘
```

**Rationale:** Privacy is the product. Any platform where we cannot enforce Tier 1 isolation at the infrastructure level is disqualified for primary use. Messaging platforms are distribution channels only — they drive users back to the app where security can be guaranteed.

---

## 7. User Lifecycle Flow

### 7.1 End-to-End Lifecycle Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        RELIO USER LIFECYCLE FLOW                              │
│                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │DISCOVERY │───►│ DOWNLOAD │───►│  ONBOARDING  │───►│   PROFILE    │      │
│  │          │    │          │    │              │    │  CREATION    │      │
│  │ Ads, SEO,│    │ App Store│    │ Privacy tour │    │ Name, anon  │      │
│  │ referral,│    │ Google   │    │ Tier explain │    │ handle, age │      │
│  │ therapist│    │ Play     │    │ Disclaimers  │    │ stage select│      │
│  │ word of  │    │          │    │ Consent      │    │              │      │
│  │ mouth    │    │          │    │              │    │              │      │
│  └──────────┘    └──────────┘    └──────────────┘    └──────┬───────┘      │
│                                                              │              │
│                   Data: None        Data: Device ID,     Data: Tier 1       │
│                                     consent flags        (encrypted)        │
│                                                              │              │
│                                                              ▼              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐      │
│  │  ASSESSMENT  │◄───│   PARTNER    │◄───│      SOLO MODE           │      │
│  │              │    │   INVITE     │    │  (if no partner yet)     │      │
│  │ Attachment   │    │              │    │  Journaling, coaching,   │      │
│  │ profiling,   │    │ Privacy-first│    │  psychoeducation,        │      │
│  │ relationship │    │ invite link  │    │  profiling               │      │
│  │ health score │    │ Partner B    │    │                          │      │
│  │              │    │ onboarding   │    │  Full value, not broken  │      │
│  └──────┬───────┘    └──────┬───────┘    └──────────────────────────┘      │
│         │                   │                                               │
│   Data: Tier 2         Data: Tier 3                                        │
│   (attachment map)     (shared room                                         │
│                         created)            ┌────────────────────┐         │
│         │                   │               │  PARTNER B         │         │
│         ▼                   ▼               │  ONBOARDING        │         │
│  ┌──────────────────────────────────┐      │                    │         │
│  │         FREE TRIAL               │      │  Privacy-first     │         │
│  │  15-min mediation session        │◄─────│  landing page      │         │
│  │  3 articles/week                 │      │  "Nothing shared.  │         │
│  │  Basic journaling                │      │  Ever."            │         │
│  │  Health Score preview            │      │  Guest mode option │         │
│  │  Partner invite                  │      └────────────────────┘         │
│  └──────────┬───────────────────────┘                                      │
│             │                                                              │
│        Data: Tier 1 (private), Tier 3 (shared session)                     │
│             │                                                              │
│             ▼                                                              │
│  ┌──────────────────────────────────┐                                      │
│  │     MEDIATION ACTIVE             │                                      │
│  │                                  │                                      │
│  │  Full clinical pipeline          │                                      │
│  │  Safety Guardian monitoring      │                                      │
│  │  Proactive Engagement Engine     │                                      │
│  │  Phase-appropriate interventions │                                      │
│  │  Daily micro-check-ins           │                                      │
│  │  Weekly summaries                │                                      │
│  └──────────┬───────────────────────┘                                      │
│             │                                                              │
│        Data: All tiers active, full pipeline operational                    │
│             │                                                              │
│             ▼                                                              │
│  ┌─────────────────────┐    ┌───────────────────────┐                      │
│  │  PHASE TRANSITIONS  │───►│  UPGRADE PROMPT       │                      │
│  │                      │    │                       │                      │
│  │  Dating→Commitment  │    │  "Your growth is      │                      │
│  │  Commitment→Crisis   │    │  accelerating.        │                      │
│  │  Crisis→Stabilize    │    │  Unlock deeper        │                      │
│  │  Any→Separation      │    │  insights with        │                      │
│  │  Sep→Post-Divorce    │    │  Premium."            │                      │
│  └─────────────────────┘    └───────────┬───────────┘                      │
│                                         │                                   │
│                                         ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐              │
│  │              PREMIUM / PREMIUM+ ACTIVE                    │              │
│  │                                                            │              │
│  │  Unlimited mediation │ All phases │ Full profiling         │              │
│  │  Progress tracking │ Monthly deep-dives │ Co-parenting     │              │
│  │  Document vault │ Multi-party │ Priority support           │              │
│  └──────────┬──────────────────────────────┬────────────────┘              │
│             │                              │                               │
│             ▼                              ▼                               │
│  ┌──────────────────────┐    ┌──────────────────────────────┐              │
│  │  PROGRESS REVIEWS    │    │  RESOLUTION / MAINTENANCE    │              │
│  │                      │    │                              │              │
│  │  Monthly reports     │    │  Relationship stabilized     │              │
│  │  Phase readiness     │    │  OR separation completed     │              │
│  │  Therapist referrals │    │  Maintenance mode available  │              │
│  │  Milestone celebrate │    │  Reduced check-in frequency  │              │
│  └──────────────────────┘    └──────────────┬───────────────┘              │
│                                              │                              │
│                                              ▼                              │
│  ┌──────────────────────────────────────────────────────────┐              │
│  │                    OFFBOARDING                            │              │
│  │                                                            │              │
│  │  User-initiated:                                           │              │
│  │  ├── Full data export (Tier 1 data → encrypted download)  │              │
│  │  ├── Selective deletion (Tier 1 only, Tier 2 only, all)   │              │
│  │  ├── Account deactivation (data retained 30 days)         │              │
│  │  ├── Account deletion (GDPR Art. 17, irreversible)        │              │
│  │  └── Exit survey (optional, anonymized)                   │              │
│  │                                                            │              │
│  │  Data handling:                                            │              │
│  │  ├── Tier 1: Deleted from Azure PostgreSQL, purged from   │              │
│  │  │   backups within 35 days                               │              │
│  │  ├── Tier 2: Anonymized (k≥5), retained for research if   │              │
│  │  │   consent given; deleted otherwise                     │              │
│  │  ├── Tier 3: Partner notified of departure; shared data   │              │
│  │  │   retained for remaining partner or deleted on request │              │
│  │  └── Audit logs: Retained per legal hold requirements     │              │
│  └──────────────────────────────────┬───────────────────────┘              │
│                                      │                                      │
│                                      ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐              │
│  │                    RE-ENTRY                               │              │
│  │                                                            │              │
│  │  Former users can return at any time:                      │              │
│  │  ├── New account (fresh start, no historical data)        │              │
│  │  ├── Restored account (if within 30-day window)           │              │
│  │  ├── Re-assessment (attachment + relationship health)     │              │
│  │  ├── New partner pairing (clean shared room)              │              │
│  │  └── Same partner re-pairing (option to restore history) │              │
│  │                                                            │              │
│  │  No penalty, no judgment, no engagement tricks.            │              │
│  └──────────────────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Data Handling per Lifecycle Stage

| Stage | Data Created | Tier | Storage | Retention |
|-------|-------------|------|---------|-----------|
| Discovery | None | — | — | — |
| Download | Device ID, OS version | Ops analytics | PostHog | 90 days |
| Onboarding | Consent flags, privacy tour completion | Tier 3 (non-sensitive) | Azure PostgreSQL (Tier 3) | Account lifetime |
| Profile Creation | Name, anonymous handle, age range, relationship stage | Tier 1 (PII) | Azure PostgreSQL (Tier 1) | Until deletion |
| Assessment | Attachment profile, health score | Tier 2 | Azure Cosmos DB | Until deletion/anonymization |
| Partner Invite | Invite token, shared room ID | Tier 3 | Azure PostgreSQL (Tier 3) | 7-day expiry |
| Free Trial | Session transcripts (private), shared outputs | Tier 1 + Tier 3 | Azure PostgreSQL (respective) | Until deletion |
| Mediation Active | Full pipeline data | All tiers | All databases | Per-tier retention policy |
| Premium Active | Extended analytics, deep profiles | All tiers | All databases | Account lifetime |
| Offboarding | Export package, deletion confirmations | Tier 1 export | Azure Blob (temporary) | 24h download window |
| Re-entry | New or restored profile | Fresh or restored | Per-tier | Standard policies |

---

## 8. Business Strategy

*Deep-dive: [docs/PRD-ops-pod.md](docs/PRD-ops-pod.md)*

### 8.1 Tiered Pricing Model

| Tier | Name | Price | Target User | Key Features |
|------|------|-------|-------------|-------------|
| Free | Discover | $0 | Relationship-curious individuals | Health Score preview, 3 articles/week, basic journaling, 1 free 15-min mediation, partner invitation |
| Premium | Grow | $19.99/mo ($149.99/yr) | Committed couples | Unlimited 3-way mediation, full 3-Tier Confidentiality, all phases, real-time coaching, progress tracking, individual profiling, daily check-ins, weekly summaries |
| Premium+ | Family | $29.99/mo ($229.99/yr) | Separating/divorced co-parents | Everything in Premium + co-parenting coordination, parallel parenting tools, multi-party mediation, document vault, monthly deep-dives, priority emergency response |

**Solo subscriber value:** If only one partner subscribes, they receive private journaling with AI analysis, psychoeducation, individual profiling, and 1-on-1 AI coaching. The product never feels broken for a solo user.

**Monetization prohibitions:** No selling data. No "upgrade to see what your partner said." No paywalling safety features. No dark patterns. No AI-generated urgency.

### 8.2 Profitability Analysis per Tier

| Tier | Revenue/User/Mo | Cost/User/Mo | Gross Margin | Notes |
|------|-----------------|--------------|-------------|-------|
| **Free** | $0.00 | $0.50 | **-100%** | Minimal LLM usage (3 articles, 1 session). Cost: ~$0.15 LLM + $0.20 infra + $0.15 support. Funded by paid tier margins. |
| **Premium** | $19.99 | $3.80 | **81%** | ~$2.40 LLM (8 sessions/mo avg, mixed model routing) + $0.90 infra (DB, Redis, compute) + $0.50 support. |
| **Premium+** | $29.99 | $4.50 | **85%** | ~$2.80 LLM (12 sessions/mo, co-parenting adds volume) + $1.10 infra (document vault, multi-party) + $0.60 support. |
| **Blended (at scale)** | $8.50 | $2.10 | **75% → 82%** | Assumes 60% Free, 30% Premium, 10% Premium+ at Year 3. Margin improves with scale (infra amortization + LLM optimization). |

**Unit Economics Trajectory:**

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Average Revenue per User (ARPU) | $0.63 | $1.03 | $1.53 |
| Average Revenue per Paying User | $12.55 | $12.90 | $13.89 |
| Cost per User (blended) | $2.85 | $2.40 | $2.10 |
| Cost per Paying User | $4.80 | $4.20 | $3.80 |
| Gross Margin (paying only) | 62% | 67% | 73% |
| Gross Margin (blended at scale) | — | 72% | 82% |

### 8.3 Revenue Projections (3-Year)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total MAU | 84,000 | 310,000 | 720,000 |
| Paid Subscribers (EoY) | 4,200 | 24,800 | 79,200 |
| Free→Paid Conversion | 5.0% | 8.0% | 11.0% |
| MRR (EoY) | $90,300 | $565,440 | $1,908,720 |
| ARR (EoY) | $1,083,600 | $6,785,280 | $22,904,640 |
| Gross Revenue (Annual) | $632,000 | $3,840,000 | $13,200,000 |
| **Anonymized Data Revenue** | **$0** | **$500,000** | **$2,000,000** |
| **Total Revenue** | **$632,000** | **$4,340,000** | **$15,200,000** |
| LTV | $215 | $342 | $498 |
| CAC (blended) | $48 | $38 | $29 |
| LTV:CAC Ratio | 4.5:1 | 9.0:1 | 17.2:1 |
| Gross Margin | 68% | 74% | 82% |
| Monthly Churn | 8% | 5% | 3.5% |

**Break-even:** Q3 Year 3. Revenue $15.2M vs. Burn $8M → Net positive $7.2M annual run rate.

### 8.4 Anonymized Data Monetization

**Philosophy:** User data is sacred. Anonymized insights are a byproduct, not the product. This revenue stream exists only because the data is genuinely useful for relationship research and wellness — not because we need to squeeze users.

**Framework:**
- **Opt-in only.** Users explicitly consent to anonymized data contribution during onboarding. Can revoke at any time.
- **k-Anonymity (k ≥ 5).** No record is included unless at least 5 users share the same quasi-identifier set (age range, relationship stage, region).
- **Differential privacy (ε = 1.0).** Noise injection on all aggregate queries.
- **No re-identification path.** All Tier 1 content is stripped. Only Tier 2 abstracted patterns and Tier 3 aggregate engagement metrics are included.
- **Independent audit.** Annual third-party review of anonymization pipeline.

**Revenue Model:**

| Customer | Product | Price | Year 2 | Year 3 | Year 4 |
|----------|---------|-------|--------|--------|--------|
| Academic researchers | Anonymized relationship dynamics datasets | $10K–50K/dataset | $100K | $400K | $800K |
| Insurance/EAP providers | Population wellness benchmarks | $50K–200K/yr | $200K | $800K | $2M |
| Therapy platforms | Engagement pattern insights | $25K–100K/yr | $100K | $400K | $1M |
| Enterprise HR | Workplace relationship wellness indices | $50K–150K/yr | $100K | $400K | $1.2M |
| **Total** | | | **$500K** | **$2M** | **$5M** |

### 8.5 The Asymmetric Funnel

The single largest GTM challenge: Partner A downloads enthusiastically. Partner B is skeptical.

**Solution:**
1. **Privacy-first onboarding for Partner B:** Landing page leads with "Nothing you say will be shared. Ever."
2. **Low-friction entry:** Free 15-min mediation without account creation (guest mode → conversion)
3. **Neutral AI framing:** Positioned as neutral third party, not Partner A's tool
4. **Solo value guarantee:** Subscription is never wasted if Partner B never joins
5. **Delayed invitation:** Partner A encouraged to use 3–5 days before inviting

### 8.6 Go-to-Market Strategy

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

### 8.7 Competitive Positioning

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
- 38-Agent Specialization: 12+ months (deep clinical orchestration)
- Proactive Engagement Engine: 6–12 months (longitudinal data moat deepens over time)
- Anonymized data network effects: 18+ months (requires scale to generate value)

### 8.8 Partnership Strategy

| Category | Key Partners | Revenue Model |
|----------|-------------|---------------|
| Therapy Networks | BetterHelp, Talkspace, independent therapists | $50 CPA bidirectional; 15% rev share for therapist referrals |
| Clinical Research | Gottman Institute, university labs (Stanford, UPenn) | Co-branded credibility; publishable outcomes within 12 months |
| Insurance/EAP | ComPsych, Lyra Health, Spring Health | $1.50–3.00 PEPM; enterprise volume (Year 2) |
| Content | Relationship publishers, podcasts, parenting platforms | Content library depth; distribution |
| Data Partnerships | Academic institutions, wellness platforms | Anonymized dataset licensing (Year 2+) |

### 8.9 International Expansion

**Priority order:** US (launch) → Canada (Q4 Y1) → UK/Australia (Y2) → Germany/Netherlands (Y3) → Mexico/Brazil (Y3) → Japan/India (Y4+)

Localization is not just translation — it includes cultural adaptation of therapeutic frameworks, clinical norms, legal compliance, and pricing parity.

---

## 9. Cross-Pod Dependencies

This section maps the critical interaction points between pods where a failure in one pod can cascade to others. Updated from v1.0.0 with Azure-native services, emergency response chain, proactive engagement cross-pod flow, and anonymized data monetization pipeline.

### 9.1 Safety Guardian (Medical) → Emergency Response Agent (Medical) → Azure Communication Services → Emergency Numbers

**NEW in v1.1.0 — Full emergency escalation chain with real-world routing.**

```
Safety Guardian detects imminent threat (Medical — Gemini 3.1 Pro)
    │
    ├──► SAFETY_HALT: pipeline frozen, all pending Tier 3 outputs quarantined
    │
    ▼
Emergency Response Agent takes control (Medical — GPT-5.4)
    │
    ├──► Severity = HIGH:
    │    ├── Deliver localized emergency resources (hotlines, shelters, crisis text lines)
    │    ├── Offer optional live connection to crisis counselor
    │    ├── Session locked — human clinical reviewer must clear
    │    └── Post-crisis follow-up: 24h, 72h, 7d check-ins
    │
    ├──► Severity = CRITICAL:
    │    ├── All HIGH actions PLUS:
    │    ├── Azure Communication Services activated:
    │    │    ├── US: Route to 988 Suicide & Crisis Lifeline / 911
    │    │    ├── EU: Route to 112 (pan-European) + country-specific
    │    │    ├── UK: Route to 999 / 116 123 (Samaritans)
    │    │    ├── AU: Route to 000 / Lifeline 13 11 14
    │    │    └── Fallback: International Association for Suicide Prevention directory
    │    ├── CLO (Ops) notified for duty-to-warn legal evaluation
    │    ├── CISO (Tech) preserves immutable audit trail (Azure Blob Storage, WORM)
    │    └── CEO alerted for board notification if warranted
    │
    └──► False Positive Triage:
         ├── LOW: Gentle check-in embedded in Tier 3 output (no disruption)
         ├── MEDIUM: Optional resource card in Tier 1 space (dismissible)
         ├── HIGH: User can clarify context → human reviewer clears in ≤30 min
         └── CRITICAL: Always treated as genuine. Post-incident review; user explanation + session restoration ≤1 hour
```

**SLA:** CRITICAL response time < 30 seconds (Safety Guardian detection to Azure Communication Services call initiation). Every activation logged, reviewed by legal within 24 hours, quarterly external audit.

### 9.2 Safety Guardian (Medical) → CLO Duty-to-Warn (Ops) → Incident Response (Tech)

```
Safety Guardian detects imminent threat (Medical)
    │
    ├──► SAFETY_HALT: pipeline frozen, user gets emergency resources
    │
    ├──► chief-legal-officer (Ops) evaluates duty-to-warn trigger:
    │    ├── Imminent threat to life → mandatory report (Tarasoff)
    │    ├── Child abuse/neglect → CPS report (all 50 states)
    │    ├── Elder abuse → APS report (Elder Justice Act)
    │    └── Court order → lawful process compliance (narrowly scoped)
    │
    └──► chief-info-security-officer (Tech) executes incident response:
         ├── Session lockout enforcement (AKS pod isolation)
         ├── Audit trail preservation (Azure Blob Storage, immutable, WORM)
         ├── Azure Monitor alert → PagerDuty escalation to human on-call
         └── Breach notification pipeline if required (GDPR Art. 34)
```

**SLA:** Duty-to-warn response time < 5 minutes. Every activation logged, reviewed by legal within 24 hours, quarterly external audit.

### 9.3 Proactive Engagement Engine Cross-Pod Flow

**NEW in v1.1.0 — Medical detection → Ops scheduling → Tech delivery.**

```
Medical Pod: Pattern Detection (Tier 2)
    │
    ├──► relationship-dynamics detects pre-conflict pattern
    │    (e.g., stonewalling frequency ↑30% over 2 weeks,
    │     negative sentiment slope exceeding threshold,
    │     recurring trigger topic approaching)
    │
    ├──► progress-tracker confirms longitudinal trend
    │    (not a single-session anomaly)
    │
    ▼
Ops Pod: Engagement Scheduling
    │
    ├──► chief-product-officer selects intervention type:
    │    ├── Preemptive calming exercise
    │    ├── Topic-specific psychoeducation module
    │    ├── "Relationship weather report"
    │    ├── Re-engagement nudge (calibrated to attachment style)
    │    └── Milestone celebration
    │
    ├──► chief-revenue-officer evaluates conversion opportunity:
    │    (Free → Premium prompt if intervention demonstrates value)
    │
    ▼
Tech Pod: Delivery
    │
    ├──► Azure Service Bus publishes engagement event
    ├──► AKS notification service selects channel:
    │    ├── In-app push notification (metadata-only, NEVER content)
    │    ├── WhatsApp/Telegram Tier 3 reminder (Phase 2+)
    │    └── Email digest (weekly summary)
    ├──► Azure Cache for Redis tracks delivery status + response
    └──► PostHog (self-hosted) captures engagement analytics
         (Tier 3 aggregates only, NEVER Tier 1 content)
```

**Constraint:** Proactive interventions NEVER reference Tier 1 content. All messaging is derived from Tier 2 pattern abstractions or Tier 3 aggregate metrics.

### 9.4 Data Monetization Pipeline

**NEW in v1.1.0 — Medical anonymization → Tech differential privacy → Ops revenue.**

```
Medical Pod: Anonymized Tier 2 Data
    │
    ├──► Tier 2 abstracted patterns (attachment styles, conflict cycles,
    │    Four Horsemen frequency, repair success rates, phase transitions)
    │    are flagged for potential research value
    │
    ├──► chief-psychology-officer validates clinical integrity of aggregation
    │    (no micro-cohort re-identification risk)
    │
    ▼
Tech Pod: Differential Privacy Pipeline
    │
    ├──► data-privacy-officer applies k-anonymity (k ≥ 5)
    │    on all quasi-identifiers (age range, relationship stage, region)
    ├──► Differential privacy noise injection (ε = 1.0) on aggregate queries
    ├──► Azure AI Search indexes anonymized datasets for researcher access
    ├──► Azure Blob Storage (Archive tier) for dataset versioning
    ├──► Automated re-identification risk scoring (reject if >0.1% risk)
    └──► Annual third-party audit of anonymization pipeline integrity
    │
    ▼
Ops Pod: Revenue
    │
    ├──► chief-alliance-officer manages data partnership agreements
    │    (academic, insurance/EAP, therapy platforms, enterprise HR)
    ├──► chief-finance-officer tracks data revenue against targets
    │    ($500K Y2, $2M Y3, $5M Y4)
    ├──► chief-legal-officer ensures GDPR Art. 89 research exemption
    │    compliance and contract terms
    └──► chief-revenue-officer integrates data revenue into P&L reporting
```

**Hard constraint:** Only users who explicitly opt in during onboarding contribute data. Consent is revocable at any time. Opt-out triggers retroactive removal from all pending dataset exports within 30 days.

### 9.5 LLM Token Costs (Medical) → CFO Routing Optimization (Ops) → LLM Gateway Cost Routing (Tech)

```
Medical Pod defines clinical model requirements (Opus for Coach, Gemini for Safety)
    │
    ├──► chief-finance-officer (Ops) sets per-user/month LLM budget targets:
    │    Y1: <$5.65 │ Y2: <$4.50 │ Y3: <$3.65
    │
    └──► vp-rnd (Tech) implements cost-optimized routing via Azure API Management:
         ├── Complexity assessment → cheap models for simple exchanges
         ├── Azure Cosmos DB Tier 2 caching → reduce re-computation
         ├── Token budget manager → daily/session caps
         ├── Circuit breaker → failover on latency spikes
         └── Monthly cost accounting via Azure Monitor → feedback to CFO
```

**Constraint:** Clinical quality is never sacrificed for cost. CFO may optimize routing but cannot override model assignments for safety-critical or high-nuance agents (Safety Guardian, Communication Coach, CPO).

### 9.6 PII Redaction (Tech) → Privacy as Brand (Ops) → Tier Isolation (Medical)

```
PII Redaction Engine (Tech — Azure AI Language + Presidio) strips names/locations
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

### 9.7 User Engagement Metrics (Medical) → Conversion Triggers (Ops) → Analytics Pipeline (Tech)

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
         ├── PostHog self-hosted on AKS (no third-party data sharing)
         ├── Differential privacy (ε=1.0) on aggregated data
         └── Analytics subnet (Azure VNet) has NO access to Tier 1 stores
```

### 9.8 App Store Compliance (Tech) → Medical Disclaimers (Ops) → Clinical Content Review (Medical)

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

### 9.9 Cultural Localization (Medical) → Market Expansion (Ops) → i18n Infrastructure (Tech)

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
         ├── Localized emergency resource databases (Azure Cosmos DB, per-region)
         ├── EU data residency (Azure West Europe / North Europe regions)
         ├── RTL support (future: Arabic/Hebrew)
         ├── Date/time/currency localization
         └── Locale-specific push notification compliance
```

---

## 10. Unified Risk Matrix

Combined and deduplicated from Medical Pod (10 risks), Tech Pod (14 risks), and Ops Pod (12 risks). Updated with emergency escalation, data monetization, proactive engagement, and platform integration risks. Ranked by Risk Score (Severity × Likelihood, 1–5 each). Ownership assigned to the primary mitigating pod.

| # | Risk | Severity | Likelihood | Score | Primary Pod | Mitigation |
|---|------|----------|------------|-------|-------------|------------|
| 1 | **Partner activation failure** — Partner B rejection >70% | 4 | 4 | **16** | Ops | Robust solo value; privacy-first Partner B UX; free trial; therapist-recommended entry; delayed invitation protocol |
| 2 | **Negative press cycle** — "AI replacing therapists" narrative | 4 | 4 | **16** | Ops | Proactive "complement, not replace" positioning; therapist endorsements; Gottman Institute partnership; published research |
| 3 | **Emergency escalation false positive** — Calling 911/112 for non-emergency (user quoting a movie, describing past event) | 5 | 3 | **15** | Medical | False positive triage tiers (LOW→MEDIUM→HIGH→CRITICAL); human reviewer clears HIGH in ≤30 min; CRITICAL always treated as genuine with post-incident review; mandatory context-gathering before phone routing; user consent framework at onboarding |
| 4 | **User trust erosion** — Data breach or privacy incident | 5 | 3 | **15** | Tech/Ops | SOC 2 Type II; Azure compliance (ISO 27001); annual third-party audits; bug bounty ($500–$10K); transparent incident response; Microsoft Defender for Cloud |
| 5 | **Prompt injection extracts private context** | 5 | 3 | **15** | Tech | 4-layer defense; weekly red-team; canary testing; behavioral analysis; Azure AI Content Safety integration |
| 6 | **Emergency escalation liability** — Legal exposure from routing to wrong jurisdiction's emergency number or delay in routing | 5 | 2 | **10** | Medical/Ops | Locale detection at multiple layers (device GPS, IP geolocation, user profile); multi-number fallback per jurisdiction; CLO pre-approved routing tables; E&O insurance ($5M); mandatory audit trail |
| 7 | **Tier 1 data leaks into Tier 3** — Trust-destroying, company-ending | 5 | 2 | **10** | Tech | Azure VNet isolation; NSG DENY rules; canary CI; output validation; fail-fast pipeline; zero-tolerance policy |
| 8 | **AI hallucination produces harmful advice** | 5 | 2 | **10** | Medical | CPO meta-audit on all Tier 3; no prescriptive language; hallucination detection; persistent disclaimers; response templating for high-risk scenarios |
| 9 | **False negative on abuse detection** — Physical harm occurs | 5 | 2 | **10** | Medical | Zero false-negative tolerance; multiple detection layers (semantic + pattern + keyword); weekly human review of borderline cases; continuous model retraining |
| 10 | **Regulatory reclassification** — Relio classified as healthcare provider | 5 | 2 | **10** | Ops | Strict wellness positioning; proactive regulator engagement; medical disclaimer saturation; no diagnostic language in any user-facing output |
| 11 | **Legal liability incident** — User harmed following AI guidance | 5 | 2 | **10** | Ops | E&O insurance ($5M); disclaimers at every touchpoint; arbitration clause; no diagnostic language; no prescriptive recommendations |
| 12 | **Data monetization consent risk** — User claims they didn't understand opt-in, regulator challenge on consent validity | 4 | 3 | **12** | Ops/Tech | Plain-language consent at onboarding (reading level ≤ Grade 8); separate consent screen (not buried in ToS); revocable at any time; retroactive removal within 30 days; GDPR Art. 89 research exemption; annual consent audit |
| 13 | **Azure vendor lock-in** — Dependency on single cloud provider limits negotiation leverage, creates migration risk | 3 | 4 | **12** | Tech | Terraform IaC (provider-agnostic where possible); container-based workloads (portable); multi-LLM provider strategy (Claude, GPT, Gemini = no single AI vendor lock-in); annual Azure cost negotiation with reserved instances; document migration playbook for critical services |
| 14 | **Proactive engagement overreach** — Users feel surveilled or annoyed by AI-initiated interventions | 3 | 4 | **12** | Medical/Ops | User controls for check-in frequency (daily/weekly/off); all proactive messages dismissible; hard cap on proactive outreach (max 3/week); A/B testing on intervention timing; opt-out without downgrade; transparent "why you're seeing this" |
| 15 | **Competitor feature parity** — Major player launches similar product | 4 | 3 | **12** | Ops | Accelerate moat depth (3-Tier architecture + longitudinal data); partnership lock-ins; first-mover brand; switching costs via historical relationship data |
| 16 | **LLM cost volatility** — Provider price increase disrupts unit economics | 4 | 3 | **12** | Ops/Tech | Multi-provider diversification (Claude, GPT, Gemini); model distillation; Azure reserved capacity; internal fine-tuned models long-term; CFO monthly cost review |
| 17 | **Platform integration data leakage** — WhatsApp/Telegram API inadvertently surfaces or stores sensitive data | 4 | 3 | **12** | Tech | Tier 3 ONLY on messaging platforms (hard technical enforcement); no Tier 1/2 content ever transmitted; WhatsApp Business API with data handling addendum; message content limited to non-clinical notifications; deep-link back to standalone app for all mediation; DPO quarterly audit of platform data flows |
| 18 | **Parasocial dependency** — User bonds with AI instead of partner | 4 | 3 | **12** | Medical | CPO monitors private:shared session ratio; progressive partner nudges; hard caps on private AI duration; dependency KPI (<3:1 ratio); "turn toward your partner" messaging integrated into every session |

---

## 11. Unified Timeline & Roadmap

Integrating Medical Pod (34 weeks), Tech Pod (48 weeks), and Ops Pod quarterly milestones into a single critical path. All infrastructure is Azure-native. Lean team: 8 humans Year 1, 14 Year 2, 22 Year 3.

### Phase 1: Foundation (Weeks 1–6)

**Theme:** Infrastructure + Safety + Investor Readiness — nothing else matters until these are green.

| Week | Tech Pod | Medical Pod | Ops Pod |
|------|----------|-------------|---------|
| 1–2 | Azure VNet, subnets, NSGs, Managed Identities, AKS private cluster, Azure Key Vault, Azure Container Registry. **LLM Gateway abstraction layer built** (`LLM_PROVIDER=github` for dev, swappable to `azure` post-funding). GitHub Models API + PAT for all agent dev/testing (synthetic data only). | Safety Guardian MVP training on adversarial corpus | Brand positioning; external counsel retained; fundraise prep materials |
| 3–4 | **Investor Mockup Sprint:** High-fidelity UI mockups (Figma), live demo environment on AKS (synthetic data), interactive prototype of 3-way mediation flow, Privacy/Shared Mode visual demo | **Investor Mockup Sprint:** Safety Guardian + Communication Coach live demo with synthetic conversations; adversarial testing gate pass | **Investor Mockup Sprint:** Series A pitch deck finalized; demo script; competitive battlecards v1.0; financial model v1.0; legal framework v1.0 (ToS, disclaimers) |
| 5–6 | Azure PostgreSQL Flexible Server (Tier 1 ×2, Tier 3), Azure Cosmos DB (Tier 2), Azure Cache for Redis, Azure Service Bus, CI/CD pipeline (GitHub Actions + Azure Container Registry), CodeQL | Safety Guardian passes red-team gate (≥99.5% sensitivity, ≥95% specificity on test corpus) | **Series A fundraise active ($6M target).** Regulatory landscape analysis finalized |

**Gates:**
- Safety Guardian MUST pass adversarial testing before any other agent goes live.
- Investor mockups and live demo environment completed by Week 4 for Series A meetings.
- Azure infrastructure (VNet, AKS, databases) operational by Week 6.

### Phase 2: Core Product (Weeks 7–30)

**Theme:** Pipeline + Mobile + Basic Mediation — Azure-native, lean team (3 engineers).

| Week | Tech Pod | Medical Pod | Ops Pod |
|------|----------|-------------|---------|
| 7–10 | Auth service (Azure AD B2C), WebSocket server (Socket.io + Azure Cache for Redis Pub/Sub), Intercept & Hold, REST API (Fastify on AKS). **Post-Series A: Flip `LLM_PROVIDER=azure`** — provision Azure OpenAI Service, Anthropic enterprise account, Vertex AI. PII redaction pipeline live. | Orchestrator, Individual Profiler, Relationship Dynamics training + integration | Partnership pipeline (25+ leads, 5 LOIs); Series A close (target Month 3) |
| 11–14 | Azure Cosmos DB Tier 2 integration, Medical Pod service mesh on AKS, Azure Service Bus topic/subscription wiring | All 5 phase agents + transition logic; Emergency Response Agent v1.0 | Pricing validated with 200+ survey responses; product roadmap v1.0 published |
| 15–18 | LLM Gateway via Azure API Management (unified routing, cost tracking, circuit breaker), PII redaction (Azure AI Language + Presidio), response validation pipeline | Communication Coach, Psychoeducation Agent, Proactive Engagement Engine v1.0 (pattern detection + scheduled check-ins) | GTM Phase 1 (Awareness) launched — content marketing, therapist network seeding |
| 19–26 | iOS + Android clients (auth, WSS, Privacy/Shared Mode, biometric gating, offline sync, push notifications via Azure Notification Hubs), Azure Communication Services integration for emergency routing | Progress Tracker, CPO meta-audit layer, Emergency Response Agent integration with Azure Communication Services tested (staging environment, synthetic emergencies) | Freemium launch prep; first 3 partnerships signed; data monetization consent framework designed |
| 27–30 | Mobile polish, E2E canary string testing, load testing (10K concurrent on AKS), Azure Monitor + Application Insights instrumented | Clinical validation (500 synthetic + 50 real beta couples); Proactive Engagement Engine A/B testing with beta group | iOS + Android launch (Dating + Commitment modules); Free tier live; Premium conversion funnel active |

### Phase 3: Full Launch + Platform Prep (Weeks 31–42)

**Theme:** All Phases + Premium + Security Hardening + GTM + WhatsApp/Telegram Prep

| Week | Tech Pod | Medical Pod | Ops Pod |
|------|----------|-------------|---------|
| 31–34 | Penetration testing (500+ prompt injection attacks, Azure-native pen test), vulnerability remediation, Microsoft Defender for Cloud onboarding | Cultural adaptation for top 10 markets; Proactive Engagement Engine refinement based on beta data | Premium conversion optimization; GTM Phase 2 (Acquisition); data monetization pilot ($100K pipeline) |
| 35–38 | Full E2E test suite, canary injection hardened, **WhatsApp Business API integration (Tier 3 notifications only)**, **Telegram Bot API integration (Tier 3 notifications only)**, load testing 50K concurrent | External clinical advisory board review; Emergency Response Agent jurisdiction table audited for US + CA + UK + AU | Crisis module marketing; EAP pilot discussions (3 enterprise leads); first anonymized dataset prepared |
| 39–42 | App Store submissions (iOS + Android); approval cycle; WhatsApp/Telegram notification channels beta; SOC 2 Type I audit initiated | Medical Pod v1.0 hardened release; CPO sign-off on all Tier 3 output templates | Premium+ (Family) tier launch; Separation + Co-Parenting live; first data partnership signed |

### Phase 4: Scale (Weeks 43–48 + Year 2–3)

**Theme:** Optimization + International + Data Monetization + 5M Users

| Period | Tech Pod | Medical Pod | Ops Pod |
|--------|----------|-------------|---------|
| W43–48 | Production monitoring, AKS autoscaling validation, post-launch security audit, Azure Cost Management optimization | Ongoing model calibration, emergency response accuracy review, proactive engagement effectiveness analysis | 84K MAU target; 4,200 paid subs; $120K partnership revenue; first data monetization revenue |
| Y2 Q1–Q2 | Multi-region AKS (Azure West US + East US), EU data residency (Azure West Europe), Azure Front Door geo-routing | Advanced crisis detection models, localized clinical frameworks (UK/AU/CA), false positive rate optimization | **Series B fundraise ($15–20M, target Month 18)**; first EAP contract; data revenue $500K target; 310K MAU |
| Y2 Q3–Q4 | Performance optimization at 500K scale, AKS node autoscaling, Azure Cosmos DB multi-region writes, SOC 2 Type II certification | First efficacy study published; Proactive Engagement Engine v2.0 (external stressor detection) | UK/AU launch; SOC 2 Type II announced; second EAP contract; insurance pilot initiated |
| Y3 | 5M user capacity: Multi-cluster AKS (3 regions), Hyperscale Citus for Tier 1/3, Azure Cosmos DB 5-region, voice input pipeline | Full cultural adaptation suite (15+ languages); advanced abuse pattern detection v3.0; localized emergency number routing for 30+ countries | LATAM expansion (Mexico, Brazil); insurance product live; $2M data revenue; 720K MAU; **break-even Q3 Y3** → $15.2M total revenue vs. $8M burn |

### Critical Path

```
Azure VNet + AKS ─► Tier 1 DB Isolation ─► Backend APIs ─► LLM Gateway ─► Mobile Clients ─► App Store ─► Launch
         ↑                                        ↑                              ↑
   Safety Guardian                        Medical Pod Pipeline          Investor Mockups
   (parallel, non-negotiable              (parallel development)        (Weeks 3-4, pre-Series A)
    gate before anything)
```

---

## 12. Unified Cost Model

### 12.1 Headcount-Driven Monthly Burn Rate

Lean AI-first model: 38 agents do 90% of the work. Humans supervise, audit, provide judgment for edge cases, and set strategic direction.

| Category | Year 1 (Monthly) | Year 2 (Monthly) | Year 3 (Monthly) |
|----------|-----------------|-----------------|-----------------|
| Engineering (3→5→8 FTE @ $15K avg) | $45,000 | $75,000 | $120,000 |
| Product & Design (1→2→3 FTE) | $15,000 | $30,000 | $45,000 |
| Clinical Advisor (1→1→2 part-time) | $8,000 | $8,000 | $16,000 |
| Marketing & Growth | $30,000 | $80,000 | $150,000 |
| Sales & Partnerships | $10,000 | $25,000 | $50,000 |
| Legal & Compliance | $15,000 | $25,000 | $35,000 |
| LLM & Azure Infrastructure | $25,000 | $80,000 | $200,000 |
| G&A (Tools, Insurance) | $12,000 | $20,000 | $30,000 |
| CEO/Ops (founder salary) | $10,000 | $15,000 | $20,000 |
| **Total Monthly Burn** | **$170,000** | **$358,000** | **$666,000** |
| **Total Annual Burn** | **$2,040,000** | **$4,296,000** | **$7,992,000** |

**Why this is 57% lower than v1.0.0:** AI-first operating model. 38 agents handle code generation, QA testing, security scanning, competitive analysis, legal drafting, clinical validation, content creation, and customer interaction. Humans are multipliers, not doers.

### 12.2 Azure Infrastructure Cost Breakdown at Scale Points

| Component | 100K MAU | 500K MAU | 1M MAU | 5M MAU |
|-----------|---------|---------|--------|--------|
| **AKS (compute)** | $3,200 | $12,800 | $28,000 | $115,000 |
| **Azure PostgreSQL Flexible Server (Tier 1 + Tier 3)** | $4,500 | $18,000 | $42,000 | $165,000 |
| **Azure Cosmos DB (Tier 2)** | $2,200 | $8,500 | $18,000 | $58,000 |
| **Azure Cache for Redis** | $1,800 | $4,500 | $8,500 | $22,000 |
| **Azure Service Bus** | $800 | $2,500 | $5,000 | $15,000 |
| **Azure Blob Storage** | $500 | $2,000 | $5,500 | $18,000 |
| **Azure Front Door + WAF** | $1,200 | $3,500 | $7,000 | $22,000 |
| **Azure API Management** | $1,500 | $4,000 | $8,000 | $20,000 |
| **Azure Monitor + App Insights** | $800 | $2,500 | $5,500 | $15,000 |
| **Azure Communication Services** | $200 | $800 | $1,500 | $5,000 |
| **Azure Key Vault + Security** | $300 | $800 | $1,500 | $4,000 |
| **Azure AI Language (PII)** | $500 | $2,000 | $4,500 | $12,000 |
| **Azure AI Search** | $500 | $1,500 | $3,000 | $9,000 |
| **Azure Infra Subtotal** | **$18,000** | **$63,400** | **$138,000** | **$480,000** |
| **LLM API (Claude + GPT + Gemini)** | $7,000 | $16,600 | $62,000 | $220,000 |
| **Total Infra + LLM** | **$25,000** | **$80,000** | **$200,000** | **$700,000** |

*LLM costs assume progressive optimization: intelligent routing, Tier 2 caching, response templating, and reserved capacity agreements yield 40–55% reduction from naive pricing.*

### 12.3 Revenue vs. Burn

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Gross Revenue (Subscriptions) | $632,000 | $3,840,000 | $13,200,000 |
| Anonymized Data Revenue | $0 | $500,000 | $2,000,000 |
| **Total Revenue** | **$632,000** | **$4,340,000** | **$15,200,000** |
| Total Burn | $2,040,000 | $4,296,000 | $7,992,000 |
| **Net Cash Flow** | **-$1,408,000** | **+$44,000** | **+$7,208,000** |
| Cumulative Cash Position | -$1,408,000 | -$1,364,000 | +$5,844,000 |
| Gross Margin (subscriptions only) | 68% | 74% | 82% |
| Gross Margin (total revenue) | 68% | 76% | 84% |

**Break-even:** Operational break-even in Q3 Year 2 (monthly revenue > monthly burn). Cumulative break-even in Q3 Year 3 (total lifetime revenue > total lifetime burn). Cash flow positive by Year 3 with $5.8M+ cumulative surplus.

### 12.4 LLM Cost Optimization Levers (40–55% reduction potential)

| Strategy | Savings | Owner | Timeline |
|----------|---------|-------|----------|
| Intelligent routing (cheap models for low-complexity) | 20–30% | `vp-rnd` | Phase 2 |
| Azure Cosmos DB Tier 2 caching (stable profiles) | 10–15% | `backend-developer` | Phase 2 |
| Batch processing for burst messages | 5–10% | `backend-developer` | Phase 3 |
| Response templating for predictable outputs | 5–8% | `skills-builder` | Phase 2 |
| Progressive context windowing (shorter for early pipeline) | 15–20% | `vp-rnd` | Phase 3 |
| Reserved capacity agreements (Azure OpenAI + Anthropic) | 30–40% compute | `cloud-architect` | Year 2 |
| Fine-tuned smaller models for routine tasks | 25–40% per task | `vp-rnd` | Year 2–3 |

---

## 13. Funding & Capital Allocation

### 13.1 Series A — $6M (Target Month 3)

Capital to build the core platform, achieve product-market fit, and reach 84K MAU by end of Year 1.

| Category | Amount | Purpose | Runway Contribution |
|----------|--------|---------|---------------------|
| Engineering (3 FTE × 18 months + contractors) | $1,800,000 | Core platform build: AKS, 3-Tier databases, Medical Pod pipeline, mobile clients | 18 months at 3 FTE |
| Azure Infrastructure (18 months pre-revenue) | $800,000 | AKS cluster, Azure PostgreSQL, Cosmos DB, Redis, Service Bus, Front Door, APIM, Communication Services, AI services | Full Azure stack operational |
| LLM API Costs (18 months) | $800,000 | Claude Opus/Sonnet, GPT-5.x, Gemini 3.1 Pro API spend across 38 agents | ~$44K/month average |
| Product & Design | $500,000 | UX research, Figma design system, investor mockups, beta program management, user testing | 1 FTE + contractor UX |
| Legal & Compliance | $600,000 | Regulatory counsel, patent filings (3-Tier architecture, Proactive Engagement Engine), international legal prep, IP protection, E&O insurance | SOC 2 prep + 3 patents |
| Marketing & GTM | $800,000 | Brand building, content marketing, therapist network partnerships, conference presence, PR | Awareness + Acquisition phases |
| Working Capital | $700,000 | Buffer for unforeseen costs, hiring acceleration, opportunity fund | 4-month runway reserve |
| **Total** | **$6,000,000** | | **18-month runway** |

**Investor deliverables by Month 3 (Series A close):**
- Live demo environment with synthetic 3-way mediation
- Safety Guardian passing adversarial red-team gate
- High-fidelity iOS + Android mockups
- Financial model with bottom-up unit economics
- 3 signed LOIs from therapy network / EAP partners
- Patent applications filed

### 13.2 Series B — $15–20M (Target Month 18)

Capital to scale internationally, achieve 720K MAU by end of Year 3, and reach cumulative break-even.

| Category | Amount | Purpose |
|----------|--------|---------|
| International Expansion | $5,000,000 | EU/UK/AU market entry: data residency (Azure regions), localization (clinical frameworks + language + legal), partnerships, regulatory compliance per jurisdiction |
| Engineering Scale (5→8 FTE) + Azure Scale-Up | $4,000,000 | Multi-region AKS (3 regions), Hyperscale Citus, Cosmos DB global distribution, 5M user capacity, voice input pipeline, advanced ML models |
| Marketing & Paid Acquisition | $4,000,000 | Growth engine: paid social, content scaling, influencer partnerships, conference sponsorships, SEO dominance in 5 languages |
| Partnerships & Enterprise | $2,000,000 | EAP contracts (ComPsych, Lyra Health, Spring Health), insurance pilot programs, therapy network expansion, enterprise HR integrations |
| Working Capital | $3,000,000–$5,000,000 | Bridge to profitability, M&A optionality, defensive IP, extended runway buffer |
| **Total** | **$15,000,000–$20,000,000** | |

**Series B milestones expected at Month 18:**
- 200K+ MAU with 12K+ paid subscribers
- $2M+ ARR run rate
- 2+ signed EAP contracts
- SOC 2 Type I certified
- iOS + Android live in US + Canada
- First published efficacy study (n=500+)
- Data monetization generating revenue

### 13.3 Path to Profitability

```
                Cash Position Trajectory
    $M
    +8 │                                          ╱  Break-even
    +6 │                                        ╱     Q3 Y3
    +4 │                                      ╱
    +2 │  Series A                          ╱
     0 │─$6M───────────────────────────────╱────────────
    -2 │    ╲              Series B      ╱
    -4 │      ╲           $15-20M      ╱
    -6 │        ╲              │     ╱
    -8 │          ╲────────────│───╱
   -10 │                       ╲╱
       └──┬────┬────┬────┬────┬────┬───── Time
         M3   M6  M12  M18  M24  M36
```

---

## 14. Success Metrics Dashboard

### Safety Metrics (Non-Negotiable — Red Line KPIs)

| KPI | Target | Owner | Measurement |
|-----|--------|-------|-------------|
| Abuse detection sensitivity | ≥ 99.5% | `safety-guardian` | Flag rate vs. human-reviewed ground truth (weekly) |
| Abuse detection specificity | ≥ 95% | `safety-guardian` | False positive rate (clinical team review) |
| Tier isolation compliance | **100%** (zero tolerance) | `fullstack-qa` + `data-privacy-officer` | Canary injection + CPO audit + pen testing |
| Safety response latency | < 2 seconds | `safety-guardian` | Instrumented pipeline latency (Azure Application Insights) |
| Duty-to-warn response time | < 5 minutes | `safety-guardian` + `chief-legal-officer` | Incident log timestamps |
| Disclaimer display rate | 100% all sessions | `chief-legal-officer` | Automated verification |

### Emergency Response KPIs (NEW in v1.1.0)

| KPI | Target | Owner | Measurement |
|-----|--------|-------|-------------|
| Emergency escalation accuracy | ≥ 98% (correct severity classification) | `emergency-response-agent` | Quarterly human audit of all SAFETY_HALT events |
| CRITICAL response time (detection → phone routing) | < 30 seconds | `emergency-response-agent` | Azure Communication Services call initiation timestamp vs. Safety Guardian flag timestamp |
| False positive rate (HIGH + CRITICAL combined) | < 5% | `safety-guardian` + `emergency-response-agent` | Monthly review: events classified HIGH/CRITICAL that were subsequently cleared as non-threats |
| Emergency number routing accuracy | 100% (correct jurisdiction) | `emergency-response-agent` | Audit log: locale detection vs. number dialed |
| Post-crisis follow-up completion rate | ≥ 90% (24h), ≥ 85% (72h), ≥ 75% (7d) | `emergency-response-agent` | Automated tracking of follow-up delivery + user engagement |
| User feedback on safety interventions | ≥ 4.0/5.0 satisfaction | `chief-product-officer` | Post-incident survey (offered 7 days after event) |
| False positive clearance time (HIGH) | < 30 minutes | `emergency-response-agent` | Time from user context clarification to session restoration |

### Proactive Engagement KPIs (NEW in v1.1.0)

| KPI | Target (Y1) | Target (Y2) | Target (Y3) | Owner |
|-----|------------|------------|------------|-------|
| Check-in response rate (daily micro) | 30% | 45% | 55% | `progress-tracker` |
| Check-in response rate (weekly summary) | 50% | 65% | 75% | `progress-tracker` |
| Pre-emptive intervention success rate (conflict prevented within 48h) | 20% | 35% | 50% | `relationship-dynamics` |
| Milestone celebration engagement rate | 60% | 70% | 80% | `psychoeducation-agent` |
| Proactive engagement opt-out rate | < 15% | < 10% | < 8% | `chief-product-officer` |
| Re-engagement success (dormant user returns within 7d) | 15% | 25% | 35% | `chief-marketing-officer` |
| Proactive-to-conversion rate (proactive touchpoint → Premium upgrade within 30d) | 3% | 5% | 8% | `chief-revenue-officer` |

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

| KPI | Target (Launch) | Target (5M Scale) | Owner |
|-----|----------------|-------------------|-------|
| Concurrent WebSocket connections | 10,000 | 500,000 | `cloud-architect` |
| LLM Gateway p99 latency | < 3s | < 5s | `vp-rnd` |
| API response time p50 | < 200ms | < 500ms | `backend-developer` |
| WebSocket reconnection time | < 2s | < 3s | `backend-developer` |
| Tier 3 broadcast latency | < 500ms | < 1s | `backend-developer` |
| AKS uptime | 99.9% | 99.95% | `cloud-architect` |
| Azure Communication Services availability | 99.99% | 99.99% | `cloud-architect` |

### Business Health

| KPI | Year 1 | Year 2 | Year 3 | Owner |
|-----|--------|--------|--------|-------|
| MRR (EoY) | $90,300 | $565,440 | $1,908,720 | `chief-revenue-officer` |
| ARR (EoY) | $1,083,600 | $6,785,280 | $22,904,640 | `chief-revenue-officer` |
| Free→Paid conversion | 5% | 8% | 11% | `chief-revenue-officer` |
| Monthly revenue churn | <8% | <5% | <3.5% | `chief-revenue-officer` |
| Gross margin (total revenue) | 68% | 76% | 84% | `chief-finance-officer` |
| LTV:CAC | 4.5:1 | 9.0:1 | 17.2:1 | `chief-finance-officer` |
| LLM cost per user/month | <$5.65 | <$4.50 | <$3.65 | `chief-finance-officer` |
| NRR | 105% | 118% | 130% | `chief-revenue-officer` |
| Data monetization revenue | $0 | $500,000 | $2,000,000 | `chief-alliance-officer` |
| Monthly burn | $170,000 | $358,000 | $666,000 | `chief-finance-officer` |

### User Engagement

| KPI | Year 1 | Year 2 | Year 3 | Owner |
|-----|--------|--------|--------|-------|
| Total MAU | 84,000 | 310,000 | 720,000 | `chief-marketing-officer` |
| Scale target (infrastructure capacity) | 100K | 1M | 5M | `cloud-architect` |
| Partner activation rate | 35% | 50% | 60% | `chief-product-officer` |
| DAU/MAU ratio | 25% | 32% | 38% | `chief-product-officer` |
| D7 retention | 55% | 65% | 72% | `chief-product-officer` |
| D30 retention | 35% | 45% | 55% | `chief-product-officer` |
| D90 retention | 20% | 30% | 40% | `chief-product-officer` |
| NPS | 45 | 55 | 65 | `chief-product-officer` |

---

## 15. Legal & Compliance Summary

### 15.1 Regulatory Posture

Relio operates as a **wellness and communication tool**, not a healthcare provider. This classification is deliberately chosen and consistently enforced across all marketing, product copy, disclaimers, and regulatory filings.

### 15.2 Mandatory Disclaimers

**AI ≠ Therapy disclaimer** — displayed at: first launch (full-screen, requires "I understand" tap), every session (inline banner), every report (footer), Settings → Legal.

**No therapist-patient privilege warning** — displayed at: onboarding, before first Tier 1 session, TOS. Communications are NOT legally privileged and may be subject to discovery in legal proceedings.

### 15.3 Emergency Number Escalation Legality

| Jurisdiction | Emergency Number | Legal Basis for AI-Initiated Contact | Consent Requirement | Relio Approach |
|-------------|-----------------|-------------------------------------|---------------------|----------------|
| **US** | 911 / 988 (Suicide & Crisis Lifeline) | Good Samaritan laws (vary by state); 988 is a public resource with no caller restriction | Obtained during onboarding; revocable for non-crisis resources but NOT for imminent danger scenarios | Route to 988 for suicidal ideation; 911 for imminent physical danger. User consents to emergency contact at onboarding. |
| **EU** | 112 (pan-European) + country-specific | EU eCall regulation; 112 accessible by any caller including automated systems in some jurisdictions | GDPR-compliant consent; emergency processing under Art. 6(1)(d) "vital interests" | Route to 112 + country-specific line. Vital interests legal basis for CRITICAL severity. |
| **UK** | 999 / 116 123 (Samaritans) | No legal barrier to AI-initiated call to emergency services; Samaritans is a public service | Consent model mirrors EU; vital interests basis | Samaritans for mental health crisis; 999 for physical danger. |
| **Australia** | 000 / Lifeline 13 11 14 | Telecommunications Act 1997 permits emergency calls from automated systems | Australian Privacy Act consent + vital interests | Lifeline for mental health; 000 for physical danger. |
| **Canada** | 911 / 988 (launching nationwide) | Criminal Code § 241 (duty to report); Canadian Telecom Act permits emergency routing | PIPEDA consent + vital interests | Same framework as US. |

**Consent framework for emergency escalation:**
1. **Obtained during onboarding:** Explicit screen explaining: "In rare cases where our AI detects a life-threatening situation, Relio may contact emergency services on your behalf. You can opt out of non-emergency resources at any time, but you cannot opt out of emergency contact when there is an imminent risk to life."
2. **Revocable for non-crisis resources:** Users can disable proactive wellness check-ins and resource suggestions at any time.
3. **Non-revocable for CRITICAL severity:** Imminent danger to life overrides all user preferences. Legal basis: vital interests (GDPR Art. 6(1)(d)), Good Samaritan laws (US), duty-to-warn (Tarasoff).
4. **Documented and auditable:** Every consent action and emergency contact is logged to immutable audit trail (Azure Blob Storage, WORM policy).

### 15.4 Duty-to-Warn Framework

| Trigger | Action | Legal Basis |
|---------|--------|-------------|
| Imminent threat to life | Break Tier 1 → alert authorities + emergency contacts via Azure Communication Services | Tarasoff duty; Good Samaritan laws |
| Child abuse/neglect | Break Tier 1 → mandatory CPS report | Mandatory reporting (all 50 states + international equivalents) |
| Elder abuse | Break Tier 1 → mandatory APS report | Elder Justice Act |
| Court order / valid subpoena | Produce requested data (narrowly scoped) | Lawful process compliance |

### 15.5 Data Monetization Legal Framework

| Requirement | Implementation | Legal Basis |
|------------|----------------|-------------|
| **Opt-in consent** | Separate consent screen at onboarding (not buried in ToS); plain language at ≤ Grade 8 reading level; one-tap revocation in Settings | GDPR Art. 7 (consent conditions); CCPA § 1798.120 |
| **k-Anonymity** | k ≥ 5 on all quasi-identifiers (age range, relationship stage, region); no record included if cohort < 5 users | GDPR Art. 89(1) (research safeguards) |
| **Differential privacy** | ε = 1.0 noise injection on all aggregate queries; formal privacy budget tracking | NIST SP 800-188 de-identification guidelines |
| **No re-identification path** | All Tier 1 content stripped; only Tier 2 abstractions and Tier 3 aggregates; independent annual audit | GDPR Art. 89(1) research exemption; HIPAA Safe Harbor |
| **Right to withdrawal** | Consent revocable at any time; retroactive removal from pending dataset exports within 30 days; confirmation notification | GDPR Art. 7(3); CCPA right to opt-out |
| **Research exemption** | Data processing for scientific research purposes with appropriate safeguards | GDPR Art. 89 research exemption; Common Rule (US) |
| **Third-party agreements** | Data recipients bound by contractual prohibition on re-identification; data use limited to stated research purpose; annual compliance audit | Standard contractual clauses (Art. 28 GDPR) |

### 15.6 Azure-Specific Compliance

| Certification | Scope | Relio Relevance |
|--------------|-------|-----------------|
| **Azure SOC 2 Type II** | Infrastructure security controls | Foundation for Relio's own SOC 2 audit; shared responsibility model |
| **ISO 27001** | Information security management | Azure-inherited controls reduce audit scope for Relio |
| **HIPAA BAA** | Azure signs Business Associate Agreement | Relio voluntarily compliant (wellness tool, not covered entity); BAA provides additional assurance |
| **GDPR** | Azure EU data residency options + DPA | Azure West Europe / North Europe for EU user data; Azure DPA covers processor obligations |
| **FedRAMP** | US government cloud standards | Not required at launch; positions Relio for future government EAP contracts |
| **Azure DDoS Protection Standard** | Network-layer protection | Included in Azure Front Door; protects against volumetric attacks |
| **Microsoft Defender for Cloud** | Threat detection + compliance monitoring | Continuous security posture assessment; compliance dashboard |
| **Azure Policy** | Governance guardrails | Enforce tag requirements, region restrictions, encryption standards across all resources |

### 15.7 Platform Integration Privacy

| Platform | Data Handling | Privacy Safeguard |
|----------|-------------|-------------------|
| **WhatsApp Business API** | Meta processes message metadata; business-initiated messages stored per Meta retention policy | Tier 3 ONLY (notification text: "You have a new check-in waiting in Relio" — no clinical content); deep-link to standalone app; no Tier 1/2 content ever transmitted; reviewed under Meta Business Data Processing Terms |
| **Telegram Bot API** | Telegram stores bot messages server-side (not E2E encrypted for bots) | Tier 3 ONLY (identical to WhatsApp); no mediation content; no user responses processed via Telegram; messages auto-delete after 48h |
| **Apple Push Notification** | Apple processes push metadata | Metadata-only push (no message content); "You have a new message in Relio" |
| **Google Firebase Cloud Messaging** | Google processes push metadata | Metadata-only push (identical to Apple) |

### 15.8 Regulatory Compliance Matrix

| Regulation | Applicability | Timeline | Owner |
|-----------|---------------|----------|-------|
| CCPA/CPRA | California users | Required at launch | `chief-legal-officer` |
| GDPR | EU users | Required for EU launch (Y2) | `data-privacy-officer` + `chief-legal-officer` |
| HIPAA | Voluntary compliance | At launch (via Azure BAA) | `chief-legal-officer` + CISO |
| Apple App Store Guidelines | iOS distribution | Required at launch | `app-store-certifier` |
| Google Play Policies | Android distribution | Required at launch | `app-store-certifier` |
| FTC Act Section 5 | Deceptive practices prevention | Required at launch | `chief-legal-officer` |
| ADA/WCAG 2.1 | Accessibility | Required at launch | `ui-ux-expert` |
| SOC 2 Type I | Enterprise/EAP partnerships | End of Year 1 | CISO |
| SOC 2 Type II | Full audit cycle | End of Year 2 | CISO |
| AU Privacy Act 1988 | Australian users | Required for AU launch (Y2) | `data-privacy-officer` |
| PIPEDA | Canadian users | Required for CA launch (Y1 Q4) | `chief-legal-officer` |
| UK GDPR + DPA 2018 | UK users | Required for UK launch (Y2) | `data-privacy-officer` |

### 15.9 Data Retention Policies

| Data Type | Tier | Retention | Deletion |
|-----------|------|-----------|----------|
| Raw transcripts | Tier 1 | 90 days (auto-purge) | User can delete anytime |
| Abstracted insights | Tier 2 | Account duration + 30 days | On account closure |
| Shared room content | Tier 3 | Account duration + 30 days | On account closure |
| Safety incident logs | System | 7 years (legal hold) | Manual after hold expires |
| Emergency escalation logs | System | 10 years (enhanced legal hold) | Manual after hold expires |
| Payment data | N/A | Per financial regulations (7 years) | Handled by Stripe (tokens only) |
| Anonymized research data | De-identified | Indefinite (no PII linkage) | Not deletable (no PII to delete) |
| Analytics | Anonymized | Indefinite (no PII linkage) | Not deletable |

### 15.10 Insurance Requirements

| Type | Coverage | Est. Annual Premium |
|------|----------|---------------------|
| Professional Liability (E&O) | $5M — AI advice liability, emergency escalation liability | $25,000–50,000 |
| Cyber Liability | $5M — Data breach, ransomware, business interruption | $15,000–30,000 |
| General Liability | $2M — Business operations | $5,000–10,000 |
| D&O Insurance | $5M — Directors & officers | $10,000–25,000 |

---

## 16. Team & Organizational Structure

### 16.1 Lean AI-First Operating Model

The foundational thesis: **38 AI agents handle 90% of the operational workload.** Humans provide oversight, strategic direction, and judgment for edge cases that require nuance beyond current AI capability.

| Role Category | Year 1 (8 humans) | Year 2 (14 humans) | Year 3 (22 humans) |
|--------------|-------------------|-------------------|-------------------|
| **Engineering** | 3 (1 senior backend, 1 mobile, 1 DevOps/infra) | 5 (+1 ML engineer, +1 frontend) | 8 (+1 security eng, +1 data eng, +1 mobile) |
| **Product & Design** | 1 (product lead, also owns UX) | 2 (+1 dedicated UX designer) | 3 (+1 product manager for international) |
| **Clinical** | 1 (part-time licensed therapist advisor) | 1 (same, increased hours) | 2 (+1 clinical psychologist for research) |
| **Legal & Compliance** | 1 (part-time general counsel) | 1 (full-time) | 2 (+1 international regulatory specialist) |
| **Marketing & Growth** | 1 (growth marketer) | 2 (+1 content/community manager) | 3 (+1 paid acquisition specialist) |
| **Business Development** | 0 (founder handles) | 1 (partnerships manager) | 2 (+1 enterprise sales) |
| **Executive** | 1 (CEO/founder — covers ops, strategy, fundraising) | 2 (+1 CFO/COO) | 2 (CEO + CFO/COO) |
| **Total** | **8** | **14** | **22** |

**What the 38 AI agents handle (no human needed):**

| Function | Agent(s) Responsible | Human Oversight |
|----------|---------------------|-----------------|
| Code generation & review | `backend-developer`, `native-mobile-developer`, `skills-builder` | Senior engineer reviews all PRs |
| QA testing & privacy regression | `fullstack-qa`, `mobile-qa`, `penetration-tester` | Engineer reviews test results weekly |
| Security scanning & threat modeling | `chief-info-security-officer`, `penetration-tester` | Security engineer triages findings |
| Competitive analysis | `chief-compete-officer` | CEO reviews quarterly battlecards |
| Legal document drafting | `chief-legal-officer` | Outside counsel reviews final versions |
| Clinical validation | `chief-psychology-officer`, `safety-guardian` | Clinical advisor reviews edge cases weekly |
| Content creation | `chief-marketing-officer`, `psychoeducation-agent` | Growth marketer reviews and publishes |
| Customer interaction (mediation) | All Medical Pod agents | No human in loop (by design — privacy) |
| Financial modeling & cost tracking | `chief-finance-officer` | CFO/founder reviews monthly |
| Sprint planning & delivery governance | `scrum-master`, `vp-rnd` | Product lead sets priorities |
| Infrastructure operations | `cloud-architect`, `chief-technology-officer` | DevOps engineer monitors alerts |
| App Store compliance | `app-store-certifier` | Product lead reviews submissions |

### 16.2 Organizational Chart

```
                    ┌──────────────────────────┐
                    │     FOUNDER / CEO         │
                    │  (Human — Mission Authority)│
                    │  Strategy, Fundraising,    │
                    │  Board, Key Partnerships   │
                    └───────────┬────────────────┘
                                │
        ┌───────────────────────┼───────────────────────────┐
        │                       │                           │
        ▼                       ▼                           ▼
┌────────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│ PRODUCT & ENG  │    │  CLINICAL        │    │ BUSINESS OPS         │
│                │    │                  │    │                      │
│ 3→5→8 Engineers│    │ 1→1→2 Clinical   │    │ CEO (Strategy/Ops)   │
│ 1→2→3 Product  │    │ Advisors (PT/FT) │    │ 0→1→1 CFO/COO       │
│                │    │                  │    │ 1→2→3 Marketing      │
│ Oversee:       │    │ Oversee:         │    │ 0→1→2 BD/Sales      │
│ 15 Tech agents │    │ 14 Medical agents│    │ 1→1→2 Legal          │
│ + dev tools    │    │ + safety reviews │    │                      │
│                │    │                  │    │ Oversee:             │
│                │    │                  │    │ 9 Ops agents         │
└────────────────┘    └──────────────────┘    └──────────────────────┘
```

### 16.3 Decision-Making Framework

| Decision Type | Recommend | Decide | Rationale |
|--------------|-----------|--------|-----------|
| Safety override | `safety-guardian` (AI) | No override possible | Human clinical reviewer only can clear SAFETY_HALT |
| Clinical content | `chief-psychology-officer` (AI) | Clinical advisor (Human) | Human oversight on edge cases; AI handles routine |
| Emergency escalation (CRITICAL) | `emergency-response-agent` (AI) | Autonomous execution | Time-critical; human review post-incident |
| Pricing changes | `chief-revenue-officer` (AI) | CEO (Human) | Revenue impact requires human judgment |
| Model selection (clinical) | `chief-psychology-officer` (AI) | Clinical advisor (Human) | Clinical requirements over cost |
| Model routing (optimization) | `vp-rnd` (AI) | Senior engineer (Human) | Cannot degrade clinical quality |
| Partnership agreements | `chief-alliance-officer` (AI) | CEO (Human) + outside counsel | Legal + strategic review |
| Fundraising decisions | `chief-finance-officer` (AI modeling) | CEO (Human) + Board | Board authority |
| International expansion | `chief-strategy-officer` (AI) | CEO (Human) + Legal | Regulatory + financial review |
| Security incidents | `chief-info-security-officer` (AI) | DevOps engineer (Human) | P0 auto-escalates to CEO |
| Budget reallocation | `chief-finance-officer` (AI) | CEO (Human) | All-pod impact |
| Hiring decisions | — | CEO (Human) | Human-only decision |
| Data monetization partnerships | `chief-alliance-officer` (AI) | CEO (Human) + Legal (Human) | Privacy-critical; requires human sign-off |

### 16.4 Operating Cadence

| Meeting | Frequency | Attendees | Purpose |
|---------|-----------|-----------|---------|
| Engineering Standup | Daily | Engineers + AI agent dashboards | Blockers, priorities, deployment status |
| Cross-Pod AI Review | Weekly | CEO, Product Lead, Clinical Advisor | AI agent performance, escalation review, alignment |
| Revenue Review | Weekly | CEO, Growth, BD (+ `CRO`, `CFO` AI reports) | MRR, pipeline, conversion, data revenue |
| Clinical Review | Weekly | Clinical Advisor + CPsychO AI report | Edge case review, safety audit, model accuracy |
| Strategy Sync | Biweekly | CEO, Product Lead | Roadmap, competitive threats, market |
| Legal & Compliance | Biweekly | Legal Counsel + `CLO`, `DPO` AI reports | Regulatory updates, incident review |
| Board Readout Prep | Monthly | CEO + `CFO` AI financial report | ARR, burn, KPIs, risks, fundraise status |
| Quarterly Strategic Review | Quarterly | All humans + AI pod lead reports | 3-year roadmap recalibration |

---

## 17. Appendices

### Appendix A: Full 38-Agent Directory

| # | Agent | Pod | Model | One-Line Description |
|---|-------|-----|-------|---------------------|
| 1 | `orchestrator-agent` | Medical | GPT-5.4 | Routes messages, enforces tier classification, access control gateway |
| 2 | `communication-coach` | Medical | Claude Opus 4.6 | Transforms hostile Tier 1 language into Socratic Tier 3 questions |
| 3 | `safety-guardian` | Medical | Gemini 3.1 Pro | Absolute veto authority; monitors all Tier 1 for DV, suicide, child abuse; raises SAFETY_HALT |
| 4 | `individual-profiler` | Medical | Claude Sonnet 4.6 | Maps attachment styles, love languages; emits Tier 2 profiles |
| 5 | `relationship-dynamics` | Medical | Claude Sonnet 4.6 | Detects negative cycles, Four Horsemen, calculates P:N ratio; feeds Proactive Engagement Engine |
| 6 | `phase-dating` | Medical | Claude Sonnet 4.6 | Early-stage compatibility, boundary formation, red flag identification |
| 7 | `phase-commitment` | Medical | Claude Sonnet 4.6 | Sound Relationship House; deepening intimacy; commitment asymmetry |
| 8 | `phase-crisis` | Medical | Claude Opus 4.6 | Flooding detection, 20-Min Timeout, repair attempt facilitation; can interrupt ANY phase |
| 9 | `phase-separation` | Medical | Claude Sonnet 4.6 | Logistical mediation, grief processing, asset division frameworks |
| 10 | `phase-post-divorce` | Medical | Claude Sonnet 4.6 | BIFF/Gray Rock co-parenting, parental alienation detection |
| 11 | `psychoeducation-agent` | Medical | Gemini 3.1 Pro | Adaptive exercises, micro-learnings, asymmetric engagement handling, milestone celebrations |
| 12 | `progress-tracker` | Medical | GPT-5.2 | Non-shaming metrics: conflict duration, repair rate, P:N ratio; feeds proactive check-ins |
| 13 | `chief-psychology-officer` | Medical | Claude Opus 4.6 | Meta-audit, bias detection, parasocial monitoring, hallucination flagging, data anonymization validation |
| 14 | `chief-technology-officer` | Tech | GPT-5.4 | Technical strategy, architecture decisions, cross-pod technical alignment |
| 15 | `backend-developer` | Tech | GPT-5.3-Codex | API development, microservices, Intercept & Hold pipeline |
| 16 | `cloud-architect` | Tech | GPT-5.3-Codex | Azure VNet design, Terraform IaC, AKS scaling, multi-region deployment |
| 17 | `github-architect` | Tech | GPT-5.3-Codex | CI/CD pipelines (GitHub Actions), repository governance, Draft PR gates |
| 18 | `native-mobile-developer` | Tech | GPT-5.3-Codex | iOS (Swift/SwiftUI) + Android (Kotlin/Compose) native clients |
| 19 | `mobile-qa` | Tech | GPT-5.3-Codex | Mobile E2E testing, cross-platform parity, offline sync verification |
| 20 | `fullstack-qa` | Tech | GPT-5.3-Codex | Canary string injection, privacy regression, load testing, Azure AKS scaling validation |
| 21 | `penetration-tester` | Tech | GPT-5.3-Codex | Prompt injection corpus (500+), adversarial testing, red-team exercises |
| 22 | `ui-ux-expert` | Tech | Claude Sonnet 4.6 | Privacy/Shared Mode design, accessibility (WCAG 2.1), design system |
| 23 | `chief-info-security-officer` | Tech | GPT-5.4 | Security posture, STRIDE threat model, incident response, SOC 2, Microsoft Defender for Cloud |
| 24 | `data-privacy-officer` | Tech | GPT-5.4 | GDPR/HIPAA compliance, data lifecycle, retention policies, DPIAs, anonymization pipeline oversight |
| 25 | `app-store-certifier` | Tech | Claude Sonnet 4.6 | Apple/Google policy compliance, privacy labels, pre-submission audit |
| 26 | `skills-builder` | Tech | Claude Opus 4.6 | Meta-prompt engineering, EvoSkill refinement loop, agent optimization |
| 27 | `scrum-master` | Tech | GPT-5.4 | Sprint planning, backlog management, velocity tracking, delivery governance |
| 28 | `vp-rnd` | Tech | GPT-5.4 | Model evaluation, cost-optimized routing, R&D experimentation |
| 29 | `chief-executive-officer` | Ops | GPT-5.4 | Mission authority, 3-Tier Model integrity, product roadmap prioritization |
| 30 | `chief-revenue-officer` | Ops | GPT-5.2 | Monetization engine, asymmetric funnel, pricing strategy |
| 31 | `chief-finance-officer` | Ops | GPT-5.2 | Unit economics, LLM cost optimization, margin protection, burn rate tracking |
| 32 | `chief-marketing-officer` | Ops | Claude Sonnet 4.6 | Stage-specific messaging, privacy-first brand, content strategy |
| 33 | `chief-compete-officer` | Ops | GPT-5.4 | Competitive intelligence, threat assessment, battlecard maintenance |
| 34 | `chief-alliance-officer` | Ops | Claude Opus 4.6 | Partnerships, clinical networks, data monetization agreements, "give-to-get" negotiation |
| 35 | `chief-legal-officer` | Ops | Claude Opus 4.6 | Medical disclaimers, duty-to-warn codification, regulatory compliance, emergency escalation legality |
| 36 | `chief-product-officer` | Ops | Claude Sonnet 4.6 | User stories, acceptance criteria, clinical-UX merger, proactive engagement design |
| 37 | `chief-strategy-officer` | Ops | GPT-5.4 | Platform lifecycle, international expansion, R&D investment priorities |
| **38** | **`emergency-response-agent`** | **Medical** | **GPT-5.4** | **Executes emergency protocols on SAFETY_HALT. Routes to real emergency numbers (911/112/999) via Azure Communication Services. Manages duty-to-warn legal execution with CLO. Handles false positive triage. Coordinates post-crisis follow-up (24h/72h/7d). Logs all actions to immutable audit trail.** |

### Appendix B: Pod-Level PRD References

| Document | Path | Content |
|----------|------|---------|
| Medical Pod PRD | [docs/PRD-medical-pod.md](docs/PRD-medical-pod.md) | Full clinical pipeline, 14 agent capabilities, clinical frameworks, Tier schemas, per-session token estimates, Proactive Engagement Engine detail, Emergency Response Agent protocols |
| Tech Pod PRD | [docs/PRD-tech-pod.md](docs/PRD-tech-pod.md) | Azure system architecture, database schemas (SQL), VNet design, AKS configuration, mobile security, STRIDE model, CI/CD pipelines, QA strategy, Azure Communication Services integration |
| Ops Pod PRD | [docs/PRD-ops-pod.md](docs/PRD-ops-pod.md) | Business model, full revenue projections, GTM phases, competitive battlecards, partnership strategy, international expansion, data monetization framework, lean headcount model |

### Appendix C: Glossary

| Term | Definition |
|------|-----------|
| **3-Tier Confidentiality Model** | Relio's core privacy architecture: Tier 1 (Private — never shared), Tier 2 (Abstracted — internal insights), Tier 3 (Actionable — safely delivered to partner) |
| **3-Way Mediation** | Real-time session: User A + User B + AI Mediator in a shared room |
| **AKS** | Azure Kubernetes Service — managed container orchestration platform used for all Relio backend services |
| **Asymmetric Funnel** | Acquisition challenge where Partner A discovers the app and Partner B must be persuaded to join |
| **Azure Communication Services** | Azure platform service for SMS, voice, and video communications — used by Emergency Response Agent to route calls to real emergency numbers (911/112/999) |
| **BIFF** | Brief, Informative, Friendly, Firm — high-conflict communication framework |
| **Canary String Injection** | QA technique: inject unique identifiable strings into Tier 1; fail build if they appear in Tier 3 |
| **DARVO** | Deny, Attack, Reverse Victim and Offender — abuse detection pattern |
| **Differential Privacy** | Mathematical framework (parameterized by ε) for adding calibrated noise to aggregate queries, ensuring no individual's data can be reverse-engineered from published statistics. Relio uses ε = 1.0 on all anonymized data exports |
| **DPA** | Diffuse Physiological Arousal — Gottman's term for emotional flooding (heart rate >100 BPM, cognitive empathy impossible) |
| **Duty-to-Warn** | Legal obligation to break confidentiality for imminent threat to life |
| **EAP** | Employee Assistance Program — employer-sponsored benefit |
| **EFT** | Emotionally Focused Therapy — attachment-based couples therapy framework |
| **EvoSkill Loop** | `skills-builder` agent's continuous refinement cycle: ingest telemetry → analyze → patch → verify |
| **Four Horsemen** | Gottman's predictors of relationship failure: Criticism, Contempt, Defensiveness, Stonewalling |
| **Gray Rock** | Communication strategy: make interactions boring, factual, emotionally flat to starve conflict |
| **Intercept & Hold** | Middleware that captures raw messages, persists to Tier 1, HOLDS them from partner, routes to Medical Pod, and only broadcasts the Tier 3 mediated output |
| **k-Anonymity** | Privacy technique ensuring that every record in a dataset is indistinguishable from at least k−1 other records on quasi-identifying attributes. Relio requires k ≥ 5 for all anonymized data exports |
| **LTV:CAC** | Lifetime Value to Customer Acquisition Cost ratio (target >3:1) |
| **NRR** | Net Revenue Retention — revenue retained from existing customers including expansion |
| **Parasocial Dependency** | User bonding with the AI instead of their partner — treated as a product failure |
| **PEPM** | Per Employee Per Month — EAP/enterprise pricing model |
| **PII** | Personally Identifiable Information |
| **Proactive Engagement Engine** | System that anticipates user needs through longitudinal pattern recognition, scheduled check-ins, and pre-emptive de-escalation interventions — designed to prevent conflict rather than just react to it |
| **Safety Guardian** | Medical Pod agent with absolute veto authority over the entire pipeline; pure detection engine |
| **SAFETY_HALT** | Signal that immediately freezes the medical pipeline; triggers Emergency Response Agent; only a human clinical reviewer can clear it. Severity levels: LOW (monitor), MEDIUM (alert + optional resources), HIGH (halt + emergency resources), CRITICAL (halt + real emergency number routing) |
| **SAFETY_HALT Escalation Chain** | Full chain: Safety Guardian (detection) → SAFETY_HALT signal → Emergency Response Agent (action) → Azure Communication Services (phone routing) → Emergency Number (911/112/999) + CLO (legal) + CISO (audit) + CEO (board). Each step is logged, timestamped, and immutable |
| **Socratic Method** | Non-directive questioning: ask, don't tell; reflect, don't diagnose; explore, don't prescribe |
| **Sound Relationship House** | Gottman's 7-level framework for evaluating partnership depth |
| **20-Minute Timeout** | Structural de-escalation intervention based on DPA research; shared room locked for 20 minutes with individual calming exercises |

---

## Document Control

| Field | Value |
|-------|-------|
| Document Title | Relio — Unified Product Requirements Document |
| Version | v1.1.0 |
| Date | March 15, 2026 |
| Authors | `chief-executive-officer` (GPT-5.4), `chief-product-officer` (Claude Sonnet 4.6), `chief-strategy-officer` (GPT-5.4) |
| Classification | Confidential — Board & Executive Leadership |
| Status | REVISED — Founder Review Integrated |
| Supersedes | v1.0.0 (March 15, 2026) |
| Next Review | April 15, 2026 |
| Review Board | CTO, CRO, CLO, External Clinical Advisory Board |
| Source Documents | [docs/PRD-medical-pod.md](docs/PRD-medical-pod.md), [docs/PRD-tech-pod.md](docs/PRD-tech-pod.md), [docs/PRD-ops-pod.md](docs/PRD-ops-pod.md) |
| Change Log | v1.0.0 → v1.1.0: Added emergency-response-agent (#38); migrated all infrastructure to Azure; added Proactive Engagement Engine; added anonymized data monetization; reduced burn rate 57% (AI-first model: 8→14→22 humans); added funding allocation detail (Series A $6M, Series B $15–20M); added false positive handling tiers; added emergency number escalation framework; break-even moved from Q1 Y4 to Q3 Y3 |

---

*This is the master product document for Relio. All pod-level PRDs are subordinate to this unified document. In case of conflict, this document prevails. Changes require joint approval from the CEO, CTO, and CPsychO (or Clinical Advisor for human oversight).*
