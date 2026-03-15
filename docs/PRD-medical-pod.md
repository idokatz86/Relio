# Relio Medical Pod — Comprehensive Blueprint PRD

**Version:** 1.3.0
**Date:** March 15, 2026
**Author:** Chief Psychology Officer (CPO) Agent — Claude Opus 4.6
**Classification:** Internal — Engineering & Clinical Leadership
**Status:** Aligned with Unified PRD v1.3.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Clinical Architecture](#2-clinical-architecture)
3. [Core Capabilities (Per Agent)](#3-core-capabilities)
4. [Clinical Frameworks Referenced](#4-clinical-frameworks-referenced)
5. [Data Model & Privacy](#5-data-model--privacy)
6. [Risk Matrix](#6-risk-matrix)
7. [LLM Model Assignments](#7-llm-model-assignments)
8. [Success Metrics (KPIs)](#8-success-metrics-kpis)
9. [Relationship Stage Lifecycle](#9-relationship-stage-lifecycle)
10. [Timeline & Milestones](#10-timeline--milestones)
11. [Cost Projections](#11-cost-projections)
12. [Appendix: Agent Interaction Matrix](#12-appendix-agent-interaction-matrix)

---

## 1. Executive Summary

### Mission

The Medical Pod is the clinical nervous system of Relio. It is the sole subsystem authorized to interpret, classify, and transform raw human emotional language into safe, therapeutically grounded guidance. Its mission is to provide AI-mediated relationship support that is clinically defensible, emotionally safe, and architecturally incapable of violating user privacy.

### Clinical Philosophy

Relio does not provide therapy. Relio provides **structured mediation informed by evidence-based clinical frameworks**. This distinction is not semantic — it is the legal, ethical, and product-design cornerstone of every decision in this document.

The Medical Pod operates on three non-negotiable principles:

1. **Do No Harm.** Safety Guardian holds absolute veto power. No optimization, engagement metric, or business KPI overrides a safety signal. Period.
2. **Privacy Is Architecture, Not Policy.** The 3-Tier Confidentiality Model is enforced at the data layer, not the prompt layer. Tier 1 data is physically isolated. There is no API endpoint, no admin override, no "emergency access" that surfaces raw private content to a partner.
3. **The AI Is a Bridge, Not a Destination.** Every interaction is designed to turn users toward their partner, not toward the AI. Parasocial dependency is treated as a product failure, not an engagement win.

### Why a Dedicated Clinical Pod?

Relationship mediation sits at the intersection of the highest-stakes domains in applied psychology: attachment trauma, domestic violence detection, grief processing, and child welfare. A monolithic AI agent cannot hold these responsibilities. The Medical Pod isolates clinical logic from business logic (Ops Pod) and infrastructure logic (Tech Pod) to ensure:

- Clinical decisions are never influenced by revenue targets or engagement metrics.
- Safety signals propagate independently of system load or feature flags.
- Each clinical function is auditable in isolation by the CPO meta-audit layer.
- Model selection is driven by clinical requirements, not cost optimization.

---

## 2. Clinical Architecture

### 2.1 Full Pipeline

Every user message transits the following pipeline. No shortcut paths exist. No agent can be bypassed.

```
User Input (Tier 1 Raw)
    │
    ├──► [1] SAFETY GUARDIAN (Passive Monitor — Gemini 3.1 Pro)
    │         │
    │         ├── SAFE → Continue pipeline
    │         └── THREAT DETECTED → HARD STOP → Emergency Protocol
    │                                            (lockout + hotlines)
    │
    ▼
[2] ORCHESTRATOR (GPT-5.4)
    │  ├── Classify input tier (Tier 1 confirmed)
    │  ├── Route to appropriate phase agent
    │  ├── Enforce access control boundaries
    │  └── Attach session metadata
    │
    ▼
[3] INDIVIDUAL PROFILER (Claude Sonnet 4.6)
    │  ├── Update User A or B attachment profile
    │  ├── Refine love language mapping
    │  └── Emit Tier 2 profile update
    │
    ▼
[4] RELATIONSHIP DYNAMICS (Claude Sonnet 4.6)
    │  ├── Detect active negative cycle
    │  ├── Scan for Four Horsemen markers
    │  └── Emit Tier 2 relational state
    │
    ▼
[5] PHASE ROUTER → One of:
    │  ├── phase-dating (Claude Sonnet 4.6)
    │  ├── phase-commitment (Claude Sonnet 4.6)
    │  ├── phase-crisis (Claude Opus 4.6) ← can interrupt at ANY stage
    │  ├── phase-separation (Claude Sonnet 4.6)
    │  └── phase-post-divorce (Claude Sonnet 4.6)
    │
    ▼
[6] COMMUNICATION COACH (Claude Opus 4.6)
    │  ├── Ingest Tier 1 raw + Tier 2 context
    │  ├── Strip attack vectors, sarcasm, blame
    │  ├── Identify core unmet need
    │  └── Output Tier 3 Socratic question
    │
    ▼
[7] PSYCHOEDUCATION AGENT (Gemini 3.1 Pro)
    │  ├── Match exercise to Tier 2 diagnostic state
    │  ├── Adapt for asymmetric engagement
    │  └── Deliver accessible micro-learning
    │
    ▼
[8] PROGRESS TRACKER (GPT-5.2)
    │  ├── Log interaction event
    │  ├── Update conflict cycle duration
    │  ├── Recalculate positive:negative ratio
    │  └── Emit non-shaming readout
    │
    ▼
[9] CHIEF PSYCHOLOGY OFFICER (Claude Opus 4.6) — META AUDIT
       ├── Validate clinical soundness of Tier 3 output
       ├── Check for bias (siding with one partner)
       ├── Monitor parasocial dependency signals
       └── Flag or override if necessary
```

### 2.2 The Tier 1 → Tier 2 → Tier 3 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TIER 1 (PRIVATE)                            │
│  Owner: Individual user ONLY                                        │
│  Contains: Raw transcripts, venting, specific complaints,           │
│            names, accusations, private journals                     │
│  Access: User themselves + Safety Guardian (read-only monitor)      │
│          + Individual Profiler (read-only for attachment mapping)    │
│  Storage: Per-user isolated database partition                      │
│  Rule: NEVER crosses user boundary. NEVER enters shared room.      │
│         NEVER transmitted to partner's device/session.              │
│         No SQL JOINs across user partitions.                        │
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
│          Orchestrator (read for routing decisions)                   │
│          CPO (read for meta-audit)                                  │
│  Storage: Medical Pod internal database                             │
│  Rule: NEVER exposed to end users directly.                         │
│         NEVER transmitted outside Medical Pod without Tier 3        │
│         transformation. Not accessible by Ops or Tech pods          │
│         except via aggregated, anonymized analytics endpoints.      │
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
│  Storage: Shared session database                                   │
│  Rule: Must NEVER contain identifiable Tier 1 phrasing.             │
│         Must NEVER reveal which partner said what.                  │
│         Must NEVER contain clinical labels visible to users.        │
│         All outputs are non-directive (Socratic).                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Safety Guardian: Parallel Monitoring Architecture

The Safety Guardian does NOT sit "in" the pipeline — it monitors the pipeline from the outside. It receives a copy of every Tier 1 input in real time and operates on a separate evaluation thread. If the Safety Guardian issues a veto:

1. The current pipeline execution is **immediately halted** mid-stream.
2. The Orchestrator receives a `SAFETY_HALT` signal.
3. All pending Tier 3 outputs for this session are **quarantined**.
4. The affected user receives localized emergency resources.
5. The session enters a locked state requiring manual clinical review before resumption.

This architecture ensures Safety Guardian evaluation is never gated behind Orchestrator routing, profiling latency, or downstream processing.

---

## 3. Core Capabilities

### 3.1 orchestrator-agent

| Field | Detail |
|-------|--------|
| **Model** | GPT-5.4 |
| **Purpose** | Primary routing and access control gateway. Enforces the 3-Tier Confidentiality Model at every message hop. |
| **Inputs** | Raw user message (Tier 1), session metadata (relationship stage, active flags), Safety Guardian status signal. |
| **Processing Logic** | (1) Receive raw input. (2) Check Safety Guardian status — if `SAFETY_HALT`, abort pipeline. (3) Classify message intent: complaint, question, status update, crisis signal. (4) Attach tier classification tag (`T1_PRIVATE`). (5) Route to Individual Profiler for profile update. (6) Route to Relationship Dynamics for cycle detection. (7) Route to appropriate Phase Agent based on session's current relationship stage. (8) Forward phase output + Tier 2 context to Communication Coach for Tier 3 translation. (9) Deliver final Tier 3 output to shared room. |
| **Outputs** | Tier-tagged routing decisions, session state updates, Tier 3 delivery to shared room. |
| **Failure Modes** | Misclassification of tier (Tier 1 content leaking to Tier 3 — CRITICAL), routing to wrong phase agent (LOW — self-correcting), latency spike stalling pipeline (MEDIUM — timeout fallback). |
| **Interactions** | Receives from: all user inputs. Sends to: every Medical Pod agent. Receives veto from: Safety Guardian. Audited by: CPO. |

### 3.2 communication-coach

| Field | Detail |
|-------|--------|
| **Model** | Claude Opus 4.6 |
| **Purpose** | Transform Tier 1 hostile language into Tier 3 Socratic, de-escalated questions. The most linguistically sensitive agent in the system. |
| **Inputs** | Tier 1 raw transcript (single message or short burst), Tier 2 context from Individual Profiler (attachment style) and Relationship Dynamics (active cycle), Phase Agent recommendations. |
| **Processing Logic** | (1) Parse raw input for attack vectors: direct insults, sarcasm, passive-aggression, blame statements, absolute language ("you always", "you never"). (2) Identify the **core unmet need** beneath the surface language using EFT principles. (3) Map the unmet need to the user's attachment style (e.g., anxious user's anger = fear of abandonment). (4) Formulate a Socratic question that invites the partner to explore the need without being accused. (5) Validate that the Tier 3 output contains ZERO Tier 1 phrasing, names, or specifics. (6) Apply cultural lens from session context. |
| **Outputs** | Tier 3 Socratic question or reflective prompt. Example: Tier 1 input: *"He never listens to me, I'm done."* → Tier 3 output: *"It sounds like feeling heard is really important in this relationship. What does being truly listened to look like for each of you?"* |
| **Failure Modes** | Tier 1 phrasing leaking into Tier 3 (CRITICAL — CPO catches), overly generic output losing therapeutic value (MEDIUM), cultural mismatch in Socratic framing (MEDIUM). |
| **Interactions** | Receives from: Orchestrator (Tier 1 + Tier 2 context). Sends to: Orchestrator (Tier 3 output for delivery). Audited by: CPO for clinical validity and bias. |

### 3.3 safety-guardian

| Field | Detail |
|-------|--------|
| **Model** | Gemini 3.1 Pro |
| **Purpose** | Ultimate veto authority. Passively monitors 100% of Tier 1 inputs for domestic violence, intimate partner violence, suicidal ideation, child abuse, and coercive control. |
| **Inputs** | Real-time copy of every Tier 1 message across all active sessions (read-only shadow feed). |
| **Processing Logic** | (1) Continuous NLP scanning for explicit threat markers: direct threats of harm, descriptions of physical violence, suicidal language ("I want to end it all", "nobody would miss me"), child endangerment. (2) Contextual pattern detection for implicit markers: escalating coercive control, isolation tactics, financial abuse patterns, DARVO (Deny, Attack, Reverse Victim and Offender). (3) Severity scoring: `LOW` (flag for review), `MEDIUM` (alert CPO + increase monitoring frequency), `HIGH` (immediate `SAFETY_HALT`), `CRITICAL` (hard lockout + emergency resource delivery). (4) Zero false-negative tolerance philosophy — err on the side of over-flagging. |
| **Outputs** | `SAFE` (continue), `SAFETY_FLAG` (elevated monitoring), `SAFETY_HALT` (stop pipeline), `EMERGENCY_LOCKOUT` (session frozen + hotlines displayed). |
| **Failure Modes** | False negative on abuse detection (CATASTROPHIC — primary risk), false positive causing unnecessary lockout (LOW severity but degrades trust), latency causing delayed safety intervention (CRITICAL — must operate on dedicated thread). |
| **Interactions** | Monitors: all Tier 1 inputs passively. Sends to: Orchestrator (`SAFETY_HALT` signal), CPO (all flags for audit). Does NOT interact with Communication Coach, Phase Agents, or Progress Tracker. |

### 3.4 individual-profiler

| Field | Detail |
|-------|--------|
| **Model** | Claude Sonnet 4.6 |
| **Purpose** | Maintain independent psychological profiles for User A and User B. Profiles are NEVER merged, compared, or cross-referenced at the data layer. |
| **Inputs** | Tier 1 behavioral data (message patterns, language style, emotional valence), session history. |
| **Processing Logic** | (1) Continuously aggregate Tier 1 behavioral signals. (2) Map to Adult Attachment Theory: Anxious (protest behavior, reassurance seeking), Avoidant (withdrawal, emotional distancing), Secure (direct communication, repair initiation), Disorganized (contradiction, approach-avoid cycling). (3) Track primary and secondary love languages (Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch). (4) Detect shifts in attachment activation over time (e.g., secure user becoming anxious under chronic criticism). (5) Emit Tier 2 profile updates — abstract labels only, never raw data. |
| **Outputs** | Tier 2 individual profile: `{ attachment_style: "anxious", confidence: 0.82, love_language_primary: "words_of_affirmation", love_language_secondary: "quality_time", activation_state: "elevated" }` |
| **Failure Modes** | Incorrect attachment classification (MEDIUM — recalibrates over time), cultural bias in attachment mapping (MEDIUM — mitigated by cultural context input), profile drift from insufficient data (LOW). |
| **Interactions** | Receives from: Orchestrator (Tier 1 data). Sends to: Orchestrator (Tier 2 profiles), Relationship Dynamics (individual context for cycle detection), Phase Agents (attachment context), Communication Coach (attachment-informed translation). |

### 3.5 relationship-dynamics

| Field | Detail |
|-------|--------|
| **Model** | Claude Sonnet 4.6 |
| **Purpose** | Analyze "the Space Between" — the interactional patterns that emerge between two individuals, independent of either person's individual profile. |
| **Inputs** | Tier 2 profiles from Individual Profiler (both users), Tier 1 interaction sequences (message timing, turn-taking patterns, emotional escalation trajectories). |
| **Processing Logic** | (1) Detect active negative interaction cycle: Pursue-Withdraw (one partner escalates while other retreats), Attack-Attack (mutual escalation), Withdraw-Withdraw (mutual disengagement). (2) Real-time scan for Gottman's Four Horsemen: **Criticism** (global character attacks vs. specific complaints), **Contempt** (superiority, mockery, eye-rolling language), **Defensiveness** (counter-attacking, playing victim), **Stonewalling** (shutdown, monosyllabic responses, long silence gaps). (3) Calculate rolling positive:negative interaction ratio (target: 5:1 per Gottman research). (4) Detect repair attempts and their success/failure rate. |
| **Outputs** | Tier 2 relational state: `{ active_cycle: "pursue_withdraw", horsemen_detected: ["criticism", "defensiveness"], repair_attempt_rate: 0.3, positive_negative_ratio: 2.1, cycle_intensity: "escalating" }` |
| **Failure Modes** | Misidentifying cycle type (MEDIUM — affects phase routing), failing to detect contempt in subtle sarcasm (MEDIUM), culturally biased interpretation of communication styles (MEDIUM). |
| **Interactions** | Receives from: Individual Profiler (Tier 2 profiles), Orchestrator (interaction sequences). Sends to: Phase Agents (cycle context), Communication Coach (cycle-informed translation), Progress Tracker (metrics), CPO (audit data). |

### 3.6 phase-dating

| Field | Detail |
|-------|--------|
| **Model** | Claude Sonnet 4.6 |
| **Purpose** | Guide early-stage couples through compatibility assessment, healthy boundary formation, and red flag identification. |
| **Inputs** | Tier 2 individual profiles, Tier 2 relational state, session stage metadata. |
| **Processing Logic** | (1) Assess early attachment mapping — are both partners presenting secure, or are anxiety/avoidance patterns emerging? (2) Monitor boundary formation: Does each partner respect "no"? Is there healthy autonomy? (3) Red flag scanning: love bombing (excessive flattery + rapid commitment pressure), early coercive control (isolating from friends, monitoring behavior), moving too fast. (4) Generate Tier 3 dating-stage exercises: communication templates, boundary-setting prompts, compatibility reflection questions. |
| **Outputs** | Phase-specific Tier 2 assessment, Tier 3 dating exercises and guidance. |
| **Failure Modes** | Normalizing red flags as "excitement" (HIGH — safety risk), being overly cautious and pathologizing healthy enthusiasm (LOW). |
| **Interactions** | Receives from: Orchestrator (routing), Individual Profiler, Relationship Dynamics. Sends to: Communication Coach (phase context), Psychoeducation Agent (exercise requests). Can escalate to: Safety Guardian (if coercive control detected). |

### 3.7 phase-commitment

| Field | Detail |
|-------|--------|
| **Model** | Claude Sonnet 4.6 |
| **Purpose** | Support couples in deepening intimacy and building a resilient partnership using the Sound Relationship House framework. |
| **Inputs** | Tier 2 profiles, Tier 2 relational state, relationship history/duration data. |
| **Processing Logic** | (1) Evaluate the seven levels of the Sound Relationship House: **Build Love Maps** (how well do they know each other's inner world?), **Share Fondness & Admiration** (do they express appreciation?), **Turn Towards** (do they respond to bids for connection?), **The Positive Perspective** (do they give benefit of the doubt?), **Manage Conflict** (perpetual vs. solvable problems), **Make Life Dreams Come True** (supporting each other's aspirations), **Create Shared Meaning** (rituals, roles, goals). (2) Identify which level is weakest. (3) Generate targeted Tier 3 deepening exercises. (4) Monitor for commitment asymmetry (one partner investing more). |
| **Outputs** | Sound Relationship House status assessment (Tier 2), stage-specific exercises and prompts (Tier 3). |
| **Failure Modes** | Misreading conflict avoidance as relationship health (MEDIUM), culturally biased expectations of intimacy expression (MEDIUM). |
| **Interactions** | Receives from: Orchestrator, Individual Profiler, Relationship Dynamics. Sends to: Communication Coach, Psychoeducation Agent. Can escalate to: phase-crisis (if acute conflict detected mid-commitment-work). |

### 3.8 phase-crisis

| Field | Detail |
|-------|--------|
| **Model** | Claude Opus 4.6 |
| **Purpose** | Handle acute escalated conflicts. Detect physiological flooding. Enforce structural pauses. Facilitate repair attempts. This agent can **interrupt any other phase agent at any time**. |
| **Inputs** | Tier 1 message stream (real-time), Tier 2 relational state, flooding detection signals. |
| **Processing Logic** | (1) Continuous monitoring for flooding markers: ALL-CAPS messages, rapid-fire message bursts (>5 messages in <60 seconds), repetitive swearing, message length explosion, incoherent emotional spiraling. (2) When flooding detected → trigger **20-Minute Timeout Protocol**: immediately insert a Tier 3 message into the shared room: *"It seems like emotions are running high right now. Research shows our bodies need about 20 minutes to calm down from emotional flooding. Let's take a brief pause and come back when you're both ready."* (3) During timeout: offer each user individual Tier 1 calming exercises (breathing, grounding). (4) Post-timeout: initiate structured repair attempt sequence. (5) Track repair attempt outcomes — if 3+ consecutive repair failures, recommend professional intervention. |
| **Outputs** | Timeout activation signals, Tier 3 de-escalation messages, repair attempt facilitation, escalation recommendations. |
| **Failure Modes** | Failing to detect flooding in text-only medium (MEDIUM — no vocal/physiological data), premature timeout disrupting needed venting (LOW), timeout being ignored/circumvented (MEDIUM — enforce via UI lockout). |
| **Interactions** | Can interrupt: ALL phase agents. Receives from: Orchestrator (real-time stream). Sends to: Communication Coach (post-crisis framing), Progress Tracker (crisis event logging), Safety Guardian (if crisis approaches danger). |

### 3.9 phase-separation

| Field | Detail |
|-------|--------|
| **Model** | Claude Sonnet 4.6 |
| **Purpose** | Non-partisan logistical mediation for couples who have decided to separate. Manages asset division, living arrangements, and grief processing. |
| **Inputs** | Tier 1 messages, Tier 2 profiles, separation-specific context (shared assets, children, living situation). |
| **Processing Logic** | (1) Redirect ALL historical blame or emotional accusations to logistical framing. Example: User says *"He ruined my life and now wants to take the house"* → Tier 3 reframe: *"Let's work through the housing situation step by step. What are the options both of you have considered?"* (2) Maintain strict non-partisan stance — never validate one party's narrative over another. (3) Offer isolated, individual grief processing spaces: each user gets a Tier 1-only channel for grieving that is NEVER surfaced to the partner. (4) For asset division: generate structured Tier 3 frameworks (lists, categories, priority rankings) that both parties can work through collaboratively. |
| **Outputs** | Tier 3 logistical mediation prompts, Tier 1 grief processing space, structured asset discussion frameworks. |
| **Failure Modes** | Inadvertently siding with one party on asset division (MEDIUM — CPO audits), grief processing content leaking into shared room (CRITICAL — tier violation), triggering additional trauma by forcing premature logistics (LOW). |
| **Interactions** | Receives from: Orchestrator. Sends to: Communication Coach (Tier 3 reframing), Psychoeducation Agent (grief processing exercises). Monitors with: Safety Guardian (separation is high-risk for DV escalation). |

### 3.10 phase-post-divorce

| Field | Detail |
|-------|--------|
| **Model** | Claude Sonnet 4.6 |
| **Purpose** | Manage post-separation co-parenting relationships using high-conflict communication frameworks. Prevent toxic spillover from affecting children. |
| **Inputs** | Tier 1 co-parenting messages, child logistics data, Tier 2 relational state. |
| **Processing Logic** | (1) Apply **Gray Rock** method: keep all shared communications boring, factual, and unemotional. Strip all emotional content from Tier 3 outputs. (2) Apply **BIFF** framework to all outgoing Tier 3: **Brief** (short and to the point), **Informative** (facts only), **Friendly** (neutral tone), **Firm** (clear boundaries). (3) Block ALL venting from reaching the co-parent. Tier 1 venting stays in Tier 1. Only actionable, scheduling-related Tier 3 data is transmitted. (4) Monitor for parental alienation language. (5) Support parallel parenting model where direct contact is minimized. |
| **Outputs** | BIFF-formatted Tier 3 co-parenting messages, Child logistics coordination, Parental alienation alerts. |
| **Failure Modes** | Emotional content leaking through BIFF filter (MEDIUM), appearing to favor one parent's scheduling preferences (LOW), missing parental alienation signals (HIGH). |
| **Interactions** | Receives from: Orchestrator. Sends to: Communication Coach (BIFF validation), Safety Guardian (child welfare monitoring). Does NOT send to: Psychoeducation Agent (post-divorce focuses on communication, not exercises). |

### 3.11 psychoeducation-agent

| Field | Detail |
|-------|--------|
| **Model** | Gemini 3.1 Pro |
| **Purpose** | Deliver personalized, clinically-informed exercises and micro-learnings adapted to each user's engagement level and psychological state. |
| **Inputs** | Tier 2 diagnostic state (attachment profiles, active cycles, phase context), user engagement metrics (completion rates, response patterns). |
| **Processing Logic** | (1) Match exercise to current clinical state. Examples: Anxious attachment → grounding exercises, journaling prompts about self-worth. Avoidant partner → low-friction, gamified check-ins (3-question max). Four Horsemen detected → targeted antidote exercises (e.g., "The Antidote to Criticism: Gentle Startup"). (2) Handle **asymmetric engagement**: if Partner A completes 80% of exercises and Partner B completes 10%, deliver bite-sized, optional content to Partner B. Never shame non-engagement. (3) Translate ALL clinical jargon into accessible language. "Anxious attachment activation" becomes "That feeling of needing reassurance when things feel uncertain." (4) Progressive difficulty: start with awareness exercises, advance to behavioral experiments, then relational practices. (5) **Digital Psychoeducation Module** (7 micro-lessons): "The 93% You're Missing" (how text strips emotional signaling), "Phubbing: The Silent Killer" (technoference and bids for connection), "Social Media ≠ Real Life" (curated reality vs. actual relationships), "The Screen-Free Ritual" (building device-free connection habits), "Digital Boundaries Agreement" (co-creating tech rules as a couple), "Text Fighting Rules" (structured digital conflict protocol), "Co-Parenting Communication Protocol" (BIFF-based digital co-parenting). |
| **Outputs** | Personalized exercises (Tier 3 — safe for shared room), individual journaling prompts (Tier 1 — private), engagement tracking data to Progress Tracker. |
| **Failure Modes** | Overwhelming an avoidant user with too much content (MEDIUM), exercises that are culturally inappropriate (MEDIUM), clinical jargon leaking into user-facing content (LOW). |
| **Interactions** | Receives from: Phase Agents (exercise requests), Orchestrator (Tier 2 context). Sends to: Progress Tracker (engagement data), Orchestrator (Tier 3 exercise delivery). |

### 3.12 progress-tracker

| Field | Detail |
|-------|--------|
| **Model** | GPT-5.2 |
| **Purpose** | Quantify qualitative emotional interactions into objective, non-shaming metrics that help couples see their progress over time. |
| **Inputs** | Interaction event logs from Orchestrator, conflict cycle data from Relationship Dynamics, repair attempt outcomes from phase-crisis, exercise engagement from Psychoeducation Agent. |
| **Processing Logic** | (1) Calculate **conflict cycle duration**: time from conflict initiation to successful repair. Track trend over time. (2) Maintain **positive:negative interaction ratio** (rolling 7-day and 30-day windows). (3) Count and categorize **repair attempts**: who initiates, success rate, time to acceptance. (4) Track **Four Horsemen frequency**: are specific horsemen declining over time? (5) Monitor **exercise engagement rate**: per user, per exercise type. (6) Generate **non-shaming readouts**: never present metrics as grades or scores. Frame as: "Over the past two weeks, your conversations have trended toward more positive interactions. Here's what that looks like..." |
| **Outputs** | Tier 3 progress summaries (safe for shared room — aggregated, non-blaming), Tier 2 raw metrics (internal to Medical Pod). |
| **Failure Modes** | Metrics that inadvertently blame one partner (MEDIUM — "Partner A initiates 90% of conflicts" is shaming), creating competitive dynamics between partners (LOW), quantifying emotions in ways that feel reductive (LOW). |
| **Interactions** | Receives from: Relationship Dynamics, phase-crisis, Psychoeducation Agent, Orchestrator. Sends to: Orchestrator (Tier 3 summaries), CPO (trend data for audit), Psychoeducation Agent (engagement gaps for content targeting). |

### 3.13 chief-psychology-officer

| Field | Detail |
|-------|--------|
| **Model** | Claude Opus 4.6 |
| **Purpose** | Meta-level clinical auditor. Ensures the entire Medical Pod maintains clinical integrity, detects systemic bias, and prevents parasocial dependency. |
| **Inputs** | All Tier 3 outputs before delivery, all Safety Guardian flags, Progress Tracker trend data, Communication Coach transformation logs, Tier 2 diagnostic state. |
| **Processing Logic** | (1) **Clinical Validity Audit**: Review every Tier 3 output for therapeutic soundness. Is the Socratic question well-formed? Does it align with the detected attachment style and cycle? Could it inadvertently harm? (2) **Bias Detection**: Analyze communication patterns across both users over time. Is the system consistently framing one partner's concerns more sympathetically? Are cultural biases influencing Tier 3 tone? (3) **Parasocial Dependency Monitoring**: Track signals that a user is turning to the AI for emotional support instead of their partner. Metrics: session frequency increasing while shared room engagement decreasing, Tier 1 private messages becoming confessional/therapy-like, user expressing gratitude/attachment to the AI itself. (4) **Hallucination Detection**: Flag any Tier 3 output that contains specific clinical recommendations (e.g., "You should try EMDR therapy") — the system mediates, it does not prescribe. (5) **Escalation Review**: Audit all Safety Guardian decisions — both activations (were they justified?) and non-activations (were there missed signals?). |
| **Outputs** | Audit verdicts (approve/flag/override), bias correction directives, parasocial dependency alerts, Safety Guardian effectiveness reports, system-wide clinical quality scores. |
| **Failure Modes** | Over-correcting and making outputs too generic (LOW), missing systemic bias that builds slowly across many sessions (MEDIUM), itself developing blind spots (mitigated by periodic external clinical review). |
| **Interactions** | Audits: Orchestrator, Communication Coach, all Phase Agents. Reviews: Safety Guardian decisions. Monitors: Progress Tracker trends. Reports to: External clinical advisory board (human oversight). |

### 3.14 emergency-response-agent

| Field | Detail |
|-------|--------|
| **Model** | GPT-5.4 |
| **Purpose** | Executes emergency protocols when `SAFETY_HALT` is triggered. Separates detection (Safety Guardian) from action (this agent). Safety Guardian detects — Emergency Response Agent acts. |
| **Inputs** | `SAFETY_HALT` signals from Safety Guardian, severity level (tiered: T1-advisory, T2-urgent, T3-critical), user locale, session context, user emergency contact preferences. |
| **Processing Logic** | (1) **Severity Triage**: T1 (advisory) → deliver localized mental health resources passively. T2 (urgent) → active resource delivery + scheduled follow-up. T3 (critical — imminent harm) → route to real emergency numbers (911/112/999) via Azure Communication Services, initiate duty-to-warn legal execution. (2) **Localized Emergency Routing**: Maintain emergency services database by locale. Deliver culturally appropriate crisis resources (hotline numbers, chat services, local shelters). Support 40+ locales at launch. (3) **Duty-to-Warn Legal Execution**: When legally mandated (Tarasoff obligations), coordinate with CLO agent for jurisdiction-specific compliance. Document all actions for legal audit trail. (4) **Post-Crisis Follow-Up Scheduling**: Automated check-ins at 24h, 72h, and 7d post-incident. Escalate if user does not respond to 72h check-in. (5) **Session Lockout Management**: Enforce session lock after T2/T3 events. Only human clinical reviewer can clear lockout. |
| **Outputs** | Emergency resource delivery (Tier 3 — localized hotlines, shelters, chat services), real-time escalation to emergency services (T3), session lockout enforcement, duty-to-warn legal packets to CLO, post-crisis follow-up schedule, complete audit trail for CPO post-incident review. |
| **Failure Modes** | False positive escalation — mitigated by tiered severity (T1 actions are low-cost/reversible) (LOW). Locale mismatch delivering wrong emergency numbers (MEDIUM — mitigated by locale validation + fallback to international resources). Latency in emergency routing exceeding 2-second SLA (MEDIUM — mitigated by pre-cached locale data and Azure Communication Services SLA). Follow-up fatigue if user receives too many check-ins (LOW). |
| **Interactions** | Receives from: Safety Guardian (`SAFETY_HALT` + severity), Orchestrator (session context). Sends to: CLO agent (duty-to-warn legal packets), affected user (emergency resources), CPO (post-incident audit trail). Reports to: CPO (all incidents for meta-audit), external clinical advisory board (T3 critical incidents). |

---

## 4. Clinical Frameworks Referenced

### 4.1 Gottman Method

The Gottman Method, developed by Drs. John and Julie Gottman, is the primary evidence base for Relio's relationship assessment and intervention logic.

**Four Horsemen of the Apocalypse:**
| Horseman | Definition | Detection Signal | Antidote |
|----------|-----------|-----------------|----------|
| Criticism | Global character attack ("You always...", "You never...") | Absolute language, "you" statements targeting character | Gentle Startup — express feeling + specific behavior + need |
| Contempt | Superiority, mockery, disgust | Sarcasm, eye-rolling language, mocking quotes, name-calling | Build Culture of Appreciation — express fondness and admiration |
| Defensiveness | Counter-attacking, denying responsibility | "But you...", "That's not fair", victimhood framing | Accept Responsibility — even partial ownership de-escalates |
| Stonewalling | Emotional shutdown, withdrawal | Monosyllabic responses, long delays, "I don't care", disengagement | Physiological Self-Soothing — take a break, return when calm |

**Sound Relationship House (7 Levels):**
Used by `phase-commitment` to evaluate partnership depth:
1. Build Love Maps (knowledge of partner's inner world)
2. Share Fondness & Admiration (expressing appreciation)
3. Turn Towards (responding to bids for connection)
4. The Positive Perspective (benefit of the doubt)
5. Manage Conflict (dialogue about perpetual problems)
6. Make Life Dreams Come True (supporting aspirations)
7. Create Shared Meaning (rituals, roles, goals, symbols)

**5:1 Positive-to-Negative Interaction Ratio:** Stable relationships maintain at least 5 positive interactions for every negative one. `progress-tracker` calculates this continuously.

**Repair Attempts:** Any statement or action that prevents negativity from escalating. `phase-crisis` monitors repair attempt success/failure rate as a key diagnostic.

### 4.2 Emotionally Focused Therapy (EFT)

EFT provides the attachment-based framework for understanding WHY partners behave as they do in conflict.

**Core Principle:** Negative cycles are not caused by the "content" of the fight — they are caused by unmet attachment needs (safety, connection, significance) that trigger protest behaviors.

**Application in Relio:**
- `individual-profiler` maps attachment styles to understand each user's underlying needs.
- `communication-coach` identifies the unmet need beneath the surface complaint and formulates Tier 3 output that speaks to the need, not the behavior.
- `relationship-dynamics` detects the pursue-withdraw cycle: one partner escalates (protest behavior from anxious attachment) while the other retreats (self-protective behavior from avoidant attachment).

### 4.3 Adult Attachment Theory

| Style | Behavior in Conflict | Core Fear | Core Need |
|-------|---------------------|-----------|-----------|
| Anxious | Protest, escalation, reassurance-seeking, hyper-vigilance to partner's mood | Abandonment | Reassurance of commitment |
| Avoidant | Withdrawal, minimizing, emotional distancing, self-reliance | Engulfment, losing autonomy | Space and respect for independence |
| Secure | Direct communication, empathy, repair initiation, emotional regulation | None dominant | Mutual respect and honesty |
| Disorganized | Contradictory approach-avoid, emotional dysregulation, confusion | Both abandonment AND engulfment | Safety and predictability |

Used by: `individual-profiler` (primary), `communication-coach` (informed translation), all Phase Agents (context-aware guidance).

### 4.4 Gray Rock / BIFF Framework

**Gray Rock:** A communication strategy for high-conflict situations where one or both parties are unable to engage constructively. Make interactions as boring, factual, and emotionally flat as possible to starve the conflict of fuel.

**BIFF (Brief, Informative, Friendly, Firm):**
- **Brief:** Keep communications short. Do not JADE (Justify, Argue, Defend, Explain).
- **Informative:** Provide only necessary facts. No opinions, no emotional commentary.
- **Friendly:** Neutral, professional tone. Not warm — professional.
- **Firm:** Clear boundaries. No ambiguity. No room for negotiation on established boundaries.

Used by: `phase-post-divorce` (primary), `phase-separation` (secondary).

### 4.5 Socratic Method

Non-directive questioning designed to help individuals arrive at insights themselves rather than being told what to think. Core technique of `communication-coach`.

**Principles:**
- Ask, don't tell.
- Reflect, don't diagnose.
- Explore, don't prescribe.
- Invite perspective-taking, don't assign blame.

**Example transformation chain:**
- Tier 1: *"She's a selfish person who only cares about herself."*
- Tier 2 analysis: *Criticism horseman detected. Anxious attachment activated — core need is feeling valued.*
- Tier 3 Socratic output: *"Feeling valued in a relationship is essential. What are some ways you've each felt appreciated recently, and what would 'feeling valued' look like going forward?"*

### 4.6 20-Minute Timeout Protocol

Based on Gottman's research on Diffuse Physiological Arousal (DPA) — when heart rate exceeds ~100 BPM during conflict, cognitive empathy becomes neurologically impossible. The body enters fight-or-flight. Productive conversation cannot resume until the nervous system returns to baseline, which requires approximately 20 minutes of non-stimulating activity.

**Relio Implementation (`phase-crisis`):**
1. Detect text-based flooding markers (proxy for physiological flooding).
2. Deliver Tier 3 timeout notification to shared room.
3. Lock shared room input for 20 minutes (UI enforcement).
4. Offer individual Tier 1 calming exercises during cooldown.
5. Post-timeout: structured re-entry with repair attempt facilitation.

### 4.7 Digital Communication & Social Media Psychology

Digital-mediated conflict is qualitatively different from in-person conflict. Relio must account for the unique psychological dynamics of text-based relationship interactions.

**Cyberspace Flooding:**
Text-based conflict removes approximately 93% of emotional signaling (Mehrabian, 1971). No facial expressions, no vocal tone, no body language. This creates a uniquely hostile environment for conflict resolution:
- No structural pauses — partners can send messages continuously without the natural turn-taking of spoken conversation.
- Ambiguity amplification — neutral statements are interpreted negatively during conflict (negativity bias × communication channel poverty).
- Leads to continuous Diffuse Physiological Arousal (DPA) without the partner even being physically present.

**Digital-Specific Flooding Markers** (detected by `safety-guardian` and `relationship-dynamics`):
| Marker | Detection Signal | Severity |
|--------|-----------------|----------|
| Rapid-fire messaging | >5 messages in 60 seconds from same user | HIGH |
| Late-night conflict | Heated exchanges between 11 PM – 4 AM user-local time | MEDIUM |
| Cross-platform spillover | User references arguments happening on other platforms ("you tweeted...", "your Instagram...") | MEDIUM |
| Message length explosion | Single message >500 words during active conflict | HIGH |
| Screenshot/evidence-gathering | Language indicating collection of "proof" ("I have screenshots", "I saved all your messages") | HIGH |
| Read-receipt anxiety | Repeated references to being "left on read", message delivery status | LOW |
| Online disinhibition effect | Language significantly more aggressive than user's baseline (Suler, 2004) — the screen removes social inhibition | HIGH |

**Social Media Friction: Surface vs. Depth Protocol:**
Social media arguments almost never represent the actual conflict. `communication-coach` maps surface social media complaints to deeper EFT attachment needs:

| Surface Argument | Deeper Attachment Need | EFT Frame |
|-----------------|----------------------|----------|
| "You liked their photo" | Trust insecurity, fear of replacement | Anxious attachment — bid for reassurance of commitment |
| Phubbing (phone snubbing) | Unmet bid for connection | Partner's bid was ignored — Gottman Turn Away event |
| "You're always on your phone" | Feeling deprioritized, invisible | Attachment injury — "Am I important to you?" |
| Posting about relationship online | Boundary violation, control | Autonomy need vs. connection need conflict |
| Comparing relationship to others' posts | Idealization gap, inadequacy | Unmet expectation anchored to curated social media reality |
| Following/unfollowing as signal | Passive-aggressive protest behavior | Indirect bid for attention — fear of direct vulnerability |

**Stage-Specific Digital Impacts:**
| Relationship Stage | Digital Friction Points | Agent Response |
|-------------------|------------------------|----------------|
| Dating (`phase-dating`) | Jealousy over social media activity, comparison to others' relationships, texting frequency anxiety | Normalize digital anxiety. Psychoeducate on curated vs. real. |
| Marriage (`phase-commitment`) | Phubbing/technoference, emotional affairs via DMs, porn discovery, financial secrecy via apps | Address through Sound Relationship House Level 3 (Turn Towards). |
| Separation (`phase-separation`) | Oversharing separation on social media, digital harassment, monitoring ex's profiles | Gray Rock + BIFF for digital communication. Boundary exercises. |
| Co-Parenting (`phase-post-divorce`) | Parental alienation via social media, children weaponized in online posts, co-parenting app misuse | Strict BIFF protocol. Flag child welfare concerns to Safety Guardian. |

### 4.8 Proactive Engagement Engine

Relio does not wait for conflict to occur. The Medical Pod implements a proactive engagement model that detects patterns before they escalate.

**Pattern-Based Interventions:**
Longitudinal Tier 2 analysis enables pre-emptive action:
- Declining positive:negative ratio over 7-day window → trigger Communication Coach to deliver a "relationship check-in" Socratic prompt before next conflict.
- Increasing session frequency with decreasing shared room engagement → CPO parasocial dependency alert + gentle redirect exercises.
- Four Horsemen frequency trending upward → Psychoeducation agent delivers targeted antidote micro-lessons proactively.
- Exercise completion rate dropping for one partner → adapt content format (shorter, gamified) before disengagement becomes entrenched.

**Scheduled Check-Ins:**
| Cadence | Type | Content | Delivered By |
|---------|------|---------|-------------|
| Daily | Micro check-in | Single reflection question ("What's one thing your partner did today that you appreciated?") | `psychoeducation-agent` |
| Weekly | Summary | Non-shaming progress readout + one targeted exercise | `progress-tracker` + `psychoeducation-agent` |
| Monthly | Deep-dive | Relationship health dashboard, trend analysis, personalized recommendations | `progress-tracker` + `chief-psychology-officer` |

**Crisis Prevention:**
- Pre-emptive de-escalation: When `relationship-dynamics` detects emerging negative cycle patterns (e.g., criticism frequency rising but not yet at crisis threshold), the system delivers a proactive Tier 3 intervention before flooding occurs.
- Anniversary/trigger date awareness: Track known relationship stress points (dates of past arguments, anniversaries of losses) and prepare supportive content in advance.
- Seasonal pattern detection: Some couples show cyclical conflict patterns (holidays, tax season, back-to-school). Proactive engagement adapts to these rhythms.

---

## 5. Data Model & Privacy

### 5.1 Tier 1 Schema (Private)

```json
{
  "tier": 1,
  "isolation": "per_user_partition",
  "storage": "user_{user_id}_private_db",
  "cross_reference": "PROHIBITED",
  "schema": {
    "private_messages": {
      "message_id": "uuid",
      "user_id": "uuid (partition key)",
      "session_id": "uuid",
      "timestamp": "iso8601",
      "raw_content": "encrypted_text",
      "emotional_valence": "float (-1.0 to 1.0)",
      "flooding_markers": "boolean",
      "safety_flag": "enum (SAFE, FLAGGED, HALT)"
    },
    "private_journals": {
      "journal_id": "uuid",
      "user_id": "uuid (partition key)",
      "timestamp": "iso8601",
      "content": "encrypted_text",
      "exercise_ref": "uuid (nullable)",
      "tier": 1
    },
    "grief_processing_sessions": {
      "session_id": "uuid",
      "user_id": "uuid (partition key)",
      "phase": "enum (separation, post_divorce)",
      "entries": "encrypted_text[]",
      "tier": 1
    }
  },
  "access_control": {
    "read": ["user_self", "safety_guardian (monitor)", "individual_profiler (pattern extraction)"],
    "write": ["user_self", "system (metadata only)"],
    "admin_override": "DOES NOT EXIST",
    "partner_access": "ARCHITECTURALLY IMPOSSIBLE"
  },
  "constraints": [
    "No SQL JOINs across user partitions — enforced at database layer",
    "No API endpoint exists that accepts two different user_ids in one query",
    "Encryption at rest (AES-256) + in transit (TLS 1.3)",
    "Data retention: user-configurable, default 90 days, hard delete on request"
  ]
}
```

### 5.2 Tier 2 Schema (Abstracted)

```json
{
  "tier": 2,
  "isolation": "medical_pod_internal",
  "storage": "medical_pod_db",
  "cross_reference": "WITHIN medical pod agents ONLY",
  "schema": {
    "individual_profile": {
      "profile_id": "uuid",
      "user_id": "uuid",
      "attachment_style": "enum (anxious, avoidant, secure, disorganized)",
      "attachment_confidence": "float (0.0 to 1.0)",
      "love_language_primary": "enum (words, time, gifts, service, touch)",
      "love_language_secondary": "enum",
      "activation_state": "enum (baseline, elevated, flooding)",
      "last_updated": "iso8601"
    },
    "relational_state": {
      "state_id": "uuid",
      "session_id": "uuid",
      "active_cycle": "enum (pursue_withdraw, attack_attack, withdraw_withdraw, none)",
      "horsemen_detected": "enum[] (criticism, contempt, defensiveness, stonewalling)",
      "repair_attempt_rate": "float (0.0 to 1.0)",
      "positive_negative_ratio": "float",
      "cycle_intensity": "enum (stable, escalating, de_escalating, crisis)",
      "last_updated": "iso8601"
    },
    "phase_assessment": {
      "assessment_id": "uuid",
      "session_id": "uuid",
      "current_phase": "enum (dating, commitment, crisis, separation, post_divorce)",
      "phase_specific_data": "jsonb",
      "transition_signals": "jsonb",
      "last_updated": "iso8601"
    }
  },
  "access_control": {
    "read": ["all_medical_pod_agents", "cpo_meta_audit"],
    "write": ["individual_profiler", "relationship_dynamics", "phase_agents"],
    "ops_pod_access": "DENIED (aggregated anonymized analytics only)",
    "tech_pod_access": "DENIED (infrastructure operations only)",
    "user_access": "DENIED (users never see Tier 2 labels)"
  }
}
```

### 5.3 Tier 3 Schema (Actionable)

```json
{
  "tier": 3,
  "isolation": "shared_session",
  "storage": "shared_session_db",
  "schema": {
    "shared_room_messages": {
      "message_id": "uuid",
      "session_id": "uuid",
      "source_agent": "enum (communication_coach, phase_agent, psychoeducation, progress_tracker, phase_crisis)",
      "content_type": "enum (socratic_question, exercise_prompt, progress_summary, timeout_notice, repair_prompt)",
      "content": "text (validated Tier 3 — no Tier 1 content)",
      "cpo_audit_status": "enum (approved, flagged, overridden)",
      "timestamp": "iso8601"
    },
    "shared_exercises": {
      "exercise_id": "uuid",
      "session_id": "uuid",
      "exercise_type": "string",
      "content": "text",
      "partner_a_status": "enum (pending, started, completed, skipped)",
      "partner_b_status": "enum (pending, started, completed, skipped)",
      "timestamp": "iso8601"
    }
  },
  "access_control": {
    "read": ["user_a", "user_b", "all_medical_pod_agents"],
    "write": ["orchestrator (delivery only)", "system"],
    "validation": "CPO audit stamp required before delivery"
  },
  "constraints": [
    "NO content may contain identifiable Tier 1 phrasing",
    "NO content may reveal which partner said what",
    "NO content may contain clinical diagnostic labels",
    "ALL outputs must be non-directive (Socratic)",
    "Content validated by CPO before entering shared room"
  ]
}
```

### 5.4 Isolation Guarantees

| Guarantee | Enforcement Mechanism |
|-----------|----------------------|
| No cross-user Tier 1 queries | Separate database partitions per user. No API accepts multi-user Tier 1 queries. |
| No Tier 1 → Tier 3 leakage | Communication Coach strips; CPO validates; automated regex scanning for quoted content. |
| No Tier 2 → User exposure | Tier 2 DB has no user-facing API endpoints. Accessible only via internal Medical Pod service mesh. |
| No Ops/Tech Pod access to clinical data | Network-level isolation. Ops/Tech pods access only aggregated, anonymized analytics. |
| Right to deletion | Hard delete across all tiers within 72 hours of request. Cascade delete ensures no orphaned references. |

---

## 6. Risk Matrix

| # | Risk | Severity | Likelihood | Impact | Mitigation |
|---|------|----------|------------|--------|------------|
| R1 | **AI hallucination producing harmful clinical advice** | CRITICAL | Medium | User harm, legal liability, loss of trust | CPO meta-audit on all Tier 3 outputs. System is instructed to mediate, never prescribe. Hallucination detection layer flags specific clinical recommendations. Disclaimer on every session: "This is not therapy." |
| R2 | **Parasocial dependency** (user bonds with AI, not partner) | HIGH | High | Defeats product mission, creates ethical liability | CPO monitors session frequency vs. shared engagement ratio. Progressive nudges toward partner interaction. Hard caps on private AI session duration. Dependency score tracked as KPI. |
| R3 | **Confirmation bias in mediation** (AI inadvertently sides with one partner) | HIGH | Medium | Destroys trust, harms weaker party | CPO bias detection analyzes tone balance across both users over time. Randomized audit sampling. A/B tested Tier 3 outputs for neutrality scoring. |
| R4 | **False negative on abuse detection** (Safety Guardian misses DV/abuse signals) | CATASTROPHIC | Low | Physical harm, legal catastrophe, existential company risk | Zero false-negative tolerance philosophy. Err toward false positives. Continuous model retraining on DV literature. Human clinical review of all Safety Guardian decisions weekly. Multiple detection layers (explicit + contextual + pattern). |
| R5 | **Crisis escalation failure** (phase-crisis fails to de-escalate, situation worsens) | CRITICAL | Low-Medium | Emotional harm, user churn, liability | 20-Minute Timeout as hard structural intervention (UI lockout, not just suggestion). 3+ repair failures → recommend professional help. Safety Guardian monitors crisis sessions with elevated sensitivity. |
| R6 | **Tier 1 data leakage** (private content surfaces in shared room) | CRITICAL | Low | Complete trust destruction, legal liability, existential risk | Architectural enforcement (no cross-tier API endpoints). Communication Coach stripping. CPO validation. Automated regex scanning for quoted phrases. Penetration testing by red team (Tech Pod). |
| R7 | **Cultural insensitivity** (Western-centric therapeutic frameworks applied to non-Western users) | HIGH | High | Alienation, incorrect guidance, harm | Cultural context as first-class input to all agents. Localization of frameworks. Community advisory boards. CPO monitors for systemic Western bias. BIFF/Socratic method adapted per cultural context. |
| R8 | **Model degradation or drift** (LLM updates change agent behavior) | MEDIUM | Medium | Inconsistent quality, regression in safety | Version-pinned model deployments. Regression test suite for each agent. CPO-controlled rollout approval. Canary deployment for model updates. |
| R9 | **Asymmetric engagement weaponization** (one partner uses the system to gather intel on the other) | HIGH | Medium | Privacy violation, trust destruction | Tier 1 isolation makes this architecturally impossible. No cross-user data surfaces. Progress metrics are always aggregated (couple-level, never individual blame). |
| R10 | **Legal misinterpretation** (user treats AI mediation as legal or therapeutic advice) | HIGH | High | Liability exposure | Persistent disclaimers. No specific legal/financial/therapeutic recommendations. Phase-separation redirects to professional mediators for asset division finalization. Terms of Service explicit that this is not therapy or legal advice. |

---

## 7. LLM Model Assignments

| Agent | Model | Rationale |
|-------|-------|-----------|
| `orchestrator-agent` | **GPT-5.4** | Requires fast, structured routing logic with minimal latency. GPT-5.4 excels at classification, structured output, and function calling — critical for tier tagging and multi-agent routing. Lower cost per token than Opus for high-volume routing operations. |
| `communication-coach` | **Claude Opus 4.6** | The most linguistically nuanced task in the system. Must detect sarcasm, extract unmet needs from hostile language, and produce Socratic questions that feel human and therapeutic. Claude Opus 4.6 has superior performance on empathetic language generation, nuance preservation, and instruction-following fidelity for complex rewriting tasks. |
| `safety-guardian` | **Gemini 3.1 Pro** | Requires processing high volumes of text with low latency on a parallel monitoring thread. Gemini 3.1 Pro offers strong performance on content safety classification with favorable cost-per-token for always-on monitoring. Long context window supports pattern detection across message histories. |
| `individual-profiler` | **Claude Sonnet 4.6** | Balanced performance-to-cost ratio for continuous psychological pattern extraction. Sonnet handles structured analytical tasks (attachment mapping, love language tracking) with high accuracy at lower cost than Opus. |
| `relationship-dynamics` | **Claude Sonnet 4.6** | Same rationale as Individual Profiler. Cycle detection and Four Horsemen identification are structured analytical tasks. Sonnet's analytical capabilities are sufficient. |
| `phase-dating` | **Claude Sonnet 4.6** | Moderate complexity phase guidance. Sonnet handles red flag detection and early-stage assessment effectively. |
| `phase-commitment` | **Claude Sonnet 4.6** | Sound Relationship House evaluation is structured and framework-driven. Sonnet is well-suited. |
| `phase-crisis` | **Claude Opus 4.6** | Crisis intervention requires the highest-quality language generation and the most sophisticated emotional tone calibration. Timeout messaging and repair attempt facilitation demand Opus-level nuance. False positive/negative costs are highest here. |
| `phase-separation` | **Claude Sonnet 4.6** | Logistical mediation and grief processing. Structured reframing follows predictable patterns. Sonnet handles this well. |
| `phase-post-divorce` | **Claude Sonnet 4.6** | BIFF framework application is template-driven. Gray Rock output is intentionally flat. Sonnet is cost-effective and sufficient. |
| `psychoeducation-agent` | **Gemini 3.1 Pro** | Content generation for exercises and micro-learnings at scale. Gemini's long context window helps with generating varied, non-repetitive educational content. Cost-effective for high-volume content delivery. |
| `progress-tracker` | **GPT-5.2** | Metric calculation and summarization. Lower-complexity analytical task. GPT-5.2 generates clean, structured numeric summaries at the lowest cost tier in the Medical Pod. |
| `chief-psychology-officer` | **Claude Opus 4.6** | Meta-audit requires the highest reasoning capability. Must evaluate nuance in Tier 3 outputs, detect subtle bias across many sessions, and identify parasocial dependency patterns. Opus 4.6 is the only model with sufficient analytical depth for this role. |
| `emergency-response-agent` | **GPT-5.4** | Fast structured output for emergency protocol execution. Requires low-latency classification (severity triage), structured API calls (Azure Communication Services for emergency routing), and deterministic action sequencing. GPT-5.4's function-calling precision and speed make it optimal for time-critical emergency workflows where the 2-second SLA is non-negotiable. |

### Model Cost Tiers (Relative)

| Tier | Models | Relative Cost | Usage Profile |
|------|--------|---------------|---------------|
| Premium | Claude Opus 4.6 | $$$$  | Communication Coach, Phase-Crisis, CPO — low volume, high stakes |
| Standard | Claude Sonnet 4.6, GPT-5.4 | $$$ | Profiler, Dynamics, Most Phase Agents, Orchestrator — moderate volume |
| Efficient | Gemini 3.1 Pro, GPT-5.2 | $$ | Safety Guardian (always-on), Psychoeducation, Progress Tracker — high volume |

---

## 8. Success Metrics (KPIs)

### 8.1 Safety Metrics (Non-Negotiable)

| KPI | Definition | Target | Measurement |
|-----|-----------|--------|-------------|
| **Abuse Detection Sensitivity** | True positive rate on DV/abuse/suicidal ideation signals | ≥ 99.5% | Safety Guardian flag rate vs. human-reviewed ground truth (weekly audit) |
| **Abuse Detection Specificity** | True negative rate (avoiding false lockouts) | ≥ 95% | Lockout events reviewed by clinical team; false positive rate tracked |
| **Tier Isolation Compliance Rate** | Percentage of Tier 3 outputs confirmed free of Tier 1 content | 100% (zero tolerance) | Automated regex scanning + CPO audit sampling + penetration testing |
| **Safety Response Latency** | Time from threat detection to emergency resource delivery | < 2 seconds | Instrumented Safety Guardian pipeline latency |
| **User Safety Score** | Composite score: no safety incidents, crisis resolution rate, emergency resource delivery success | ≥ 98/100 | Weighted composite of safety sub-metrics |

### 8.2 Clinical Effectiveness Metrics

| KPI | Definition | Target | Measurement |
|-----|-----------|--------|-------------|
| **Conflict De-escalation Rate** | Percentage of escalated exchanges that return to baseline within session | ≥ 70% | Tracked by Relationship Dynamics + Progress Tracker (cycle intensity → stable) |
| **Repair Attempt Success Rate** | Percentage of repair attempts that are accepted by the receiving partner | ≥ 50% (6-month goal), ≥ 65% (12-month) | Phase-crisis repair tracking |
| **Positive:Negative Ratio Trend** | Percentage of active couples whose 30-day P:N ratio is improving | ≥ 60% trending positive | Progress Tracker rolling window |
| **Four Horsemen Reduction** | Average frequency reduction of detected Horsemen per couple over 90 days | ≥ 25% reduction | Relationship Dynamics longitudinal tracking |
| **Time-to-Resolution** | Average time from conflict initiation to repair completion | Decreasing trend quarter-over-quarter | Progress Tracker conflict cycle duration |

### 8.3 Engagement & Product Health Metrics

| KPI | Definition | Target | Measurement |
|-----|-----------|--------|-------------|
| **Psychoeducation Engagement Rate** | Percentage of delivered exercises that are started | ≥ 40% (Partner A), ≥ 20% (Partner B) | Psychoeducation Agent completion tracking |
| **Exercise Completion Rate** | Percentage of started exercises that are completed | ≥ 60% | Psychoeducation Agent |
| **Parasocial Dependency Score** | Ratio of private AI sessions to shared partner interactions | < 3:1 (private:shared) | CPO monitoring. Alert if ratio exceeds 5:1 for > 7 days. |
| **Phase Transition Rate** | Percentage of couples that naturally progress through stages | Tracking baseline (Year 1) | Phase Agent transition triggers |
| **Session Return Rate** | Percentage of couples returning within 14 days of last session | ≥ 65% | Session analytics |

### 8.4 Bias & Fairness Metrics

| KPI | Definition | Target | Measurement |
|-----|-----------|--------|-------------|
| **Neutrality Score** | CPO-assessed balance of Tier 3 tone across both partners over 30-day window | Variance < 5% | CPO bias analysis. Randomized audit sampling. |
| **Cultural Adaptation Coverage** | Percentage of sessions where cultural context is correctly identified and applied | ≥ 85% (Year 1), ≥ 95% (Year 2) | CPO audit + user feedback |
| **Demographic Parity in Outcomes** | Conflict resolution rates do not vary by >10% across demographic groups | Variance < 10% | Anonymized cohort analysis |

---

## 9. Relationship Stage Lifecycle

### 9.1 Stage Definitions & Transitions

```
                    ┌──────────────────────────┐
                    │      CRISIS MODE         │
                    │    (phase-crisis)         │
                    │  Can activate at ANY      │
                    │  stage when flooding      │
                    │  is detected              │
                    └──────┬───────────────────┘
                           │ (interrupts/resumes)
                           │
    ┌──────────┐    ┌──────┴─────┐    ┌────────────┐    ┌──────────────┐
    │  DATING  │───►│ COMMITMENT │───►│ SEPARATION │───►│ POST-DIVORCE │
    │          │    │            │    │            │    │              │
    │ phase-   │    │ phase-     │    │ phase-     │    │ phase-post-  │
    │ dating   │    │ commitment │    │ separation │    │ divorce      │
    └──────────┘    └────────────┘    └────────────┘    └──────────────┘
         │                │                                    │
         │                │         ┌─────────────┐            │
         └────────────────┴────────►│  EXIT/CHURN │◄───────────┘
                                    └─────────────┘
```

### 9.2 Transition Triggers

| From | To | Trigger | Agent Responsible |
|------|----|---------|-------------------|
| Dating → Commitment | Forward | Duration > 6 months + user self-report "serious" + reduced red flag frequency | phase-dating emits transition signal; Orchestrator confirms |
| Commitment → Separation | Forward | User self-reports decision to separate + sustained negative cycle + 3+ crisis events in 30 days | phase-commitment + phase-crisis joint signal |
| Separation → Post-Divorce | Forward | Legal separation confirmed (user self-report) + shift from asset discussion to child logistics | phase-separation detects logistics shift |
| Any → Crisis | Interrupt | Flooding detection by phase-crisis at any stage | phase-crisis (interrupt authority) |
| Crisis → Previous Stage | Resume | Timeout completed + repair attempt made + intensity de-escalated | phase-crisis releases control; Orchestrator routes back |
| Any → Dating (Regression) | Backward | Couple re-enters system after break + reports re-dating | User self-report; Orchestrator routes |

### 9.3 Regression Handling

Relationship stages are NOT strictly linear. The system supports:

- **Crisis at any stage:** A dating couple can experience flooding. A post-divorce co-parenting pair can have a crisis. phase-crisis operates across all stages.
- **Re-entry after separation:** If a separated couple reconciles, the system supports returning to Commitment stage with historical context preserved (Tier 2 profile history is maintained — not deleted — to inform future interactions).
- **Stage ambiguity:** Some couples may not fit neatly into one phase. The Orchestrator applies weighted scoring across phase agents and routes to the dominant phase, with secondary phase context available.

---

## 10. Timeline & Milestones

### Phase 0: Foundation (Weeks 1–4)

| Milestone | Deliverable | Dependencies |
|-----------|-------------|-------------|
| M0.1 | **Safety Guardian MVP** — DV, suicidal ideation, child abuse detection on synthetic test data | Training data curation, Gemini 3.1 Pro provisioning |
| M0.2 | Tier 1 database isolation architecture — per-user partitioned storage with no cross-user query paths | Tech Pod cloud-architect, database provisioning |
| M0.3 | Safety Guardian integration testing — red team (penetration-tester) adversarial attack suite | Tech Pod penetration-tester |
| M0.4 | Emergency resource database — localized hotlines for 50+ countries | Ops Pod CLO (legal review) |

> **Gate:** Safety Guardian MUST pass adversarial testing before any other Medical Pod agent goes live. No exceptions.

### Phase 1: Core Pipeline (Weeks 5–10)

| Milestone | Deliverable | Dependencies |
|-----------|-------------|-------------|
| M1.1 | **Orchestrator** — Tier classification, routing logic, access control enforcement | Safety Guardian (M0.1) |
| M1.2 | **Individual Profiler** — Attachment mapping and love language tracking | Tier 1 database (M0.2) |
| M1.3 | **Relationship Dynamics** — Four Horsemen detection and cycle identification | Individual Profiler (M1.2) |
| M1.4 | Tier 2 database and Medical Pod internal service mesh | Tech Pod backend-developer |
| M1.5 | Integration test: full Tier 1 → Tier 2 pipeline with synthetic data | All Phase 1 agents |

### Phase 2: Phase Agents (Weeks 11–16)

| Milestone | Deliverable | Dependencies |
|-----------|-------------|-------------|
| M2.1 | **phase-crisis** — Flooding detection + 20-Minute Timeout Protocol | Orchestrator (M1.1), Relationship Dynamics (M1.3) |
| M2.2 | **phase-dating** — Compatibility assessment + red flag monitoring | Individual Profiler (M1.2) |
| M2.3 | **phase-commitment** — Sound Relationship House framework | Relationship Dynamics (M1.3) |
| M2.4 | **phase-separation** — Logistical mediation + grief processing | Relationship Dynamics (M1.3) |
| M2.5 | **phase-post-divorce** — BIFF/Gray Rock co-parenting | phase-separation (M2.4) |
| M2.6 | Phase transition logic and regression handling | All phase agents |

### Phase 3: Translation & Education (Weeks 17–22)

| Milestone | Deliverable | Dependencies |
|-----------|-------------|-------------|
| M3.1 | **Communication Coach** — Tier 1 → Tier 3 Socratic translation | All Phase 2 agents (context input) |
| M3.2 | **Psychoeducation Agent** — Dynamic exercise delivery + asymmetric engagement handling | Tier 2 profiles (M1.2, M1.3) |
| M3.3 | Tier 3 database and shared room delivery pipeline | Tech Pod backend-developer |
| M3.4 | End-to-end Tier 1 → Tier 2 → Tier 3 integration test | All agents through M3.2 |

### Phase 4: Measurement & Meta-Audit (Weeks 23–28)

| Milestone | Deliverable | Dependencies |
|-----------|-------------|-------------|
| M4.1 | **Progress Tracker** — Conflict metrics, P:N ratio, repair tracking | Relationship Dynamics (M1.3), phase-crisis (M2.1) |
| M4.2 | **Chief Psychology Officer** — Meta-audit layer, bias detection, parasocial dependency monitoring | All agents (full pipeline required) |
| M4.3 | Clinical validation study — 500 synthetic + 50 real beta couples | All agents |
| M4.4 | External clinical advisory board review | M4.2 + M4.3 |

### Phase 5: Hardening & Launch (Weeks 29–34)

| Milestone | Deliverable | Dependencies |
|-----------|-------------|-------------|
| M5.1 | Adversarial red team final assessment | Tech Pod penetration-tester |
| M5.2 | Cultural adaptation for top 10 markets | CPO + localization |
| M5.3 | Load testing at 10K concurrent sessions | Tech Pod |
| M5.4 | **Medical Pod v1.0 Production Release** | All gates passed |

---

## 11. Cost Projections

### 11.1 Per-Session Token Estimates

**Assumptions:** Average session = 40 user messages (20 per partner). Each message transits the full pipeline. Average input: 50 tokens/message. Average output: 100 tokens/agent response.

| Agent | Model | Invocations/Session | Avg Input Tokens | Avg Output Tokens | Est. Cost/Session |
|-------|-------|--------------------:|------------------:|-------------------:|------------------:|
| orchestrator-agent | GPT-5.4 | 40 | 200 | 100 | $0.024 |
| safety-guardian | Gemini 3.1 Pro | 40 | 150 | 50 | $0.008 |
| individual-profiler | Claude Sonnet 4.6 | 40 | 300 | 150 | $0.036 |
| relationship-dynamics | Claude Sonnet 4.6 | 20 | 400 | 200 | $0.024 |
| phase-agent (avg) | Claude Sonnet 4.6 | 20 | 350 | 200 | $0.022 |
| communication-coach | Claude Opus 4.6 | 20 | 500 | 200 | $0.070 |
| psychoeducation-agent | Gemini 3.1 Pro | 5 | 300 | 400 | $0.004 |
| progress-tracker | GPT-5.2 | 2 | 500 | 300 | $0.003 |
| chief-psychology-officer | Claude Opus 4.6 | 20 | 400 | 150 | $0.055 |
| emergency-response-agent | GPT-5.4 | 0.5 | 200 | 150 | $0.001 |
| **TOTAL PER SESSION** | | | | | **~$0.25** |

### 11.2 Monthly Cost at Scale

| Active Users | Sessions/Month (avg 8/user) | LLM Cost/Month | Infrastructure Overhead (30%) | **Total Monthly** |
|-------------:|----------------------------:|----------------:|------------------------------:|-------------------:|
| 10,000 | 80,000 | $20,000 | $6,000 | **$26,000** |
| 50,000 | 400,000 | $100,000 | $30,000 | **$130,000** |
| 100,000 | 800,000 | $200,000 | $60,000 | **$260,000** |
| 500,000 | 4,000,000 | $1,000,000 | $300,000 | **$1,300,000** |

### 11.3 Token Optimization Strategies

| Strategy | Estimated Savings | Implementation |
|----------|------------------:|----------------|
| **Intelligent routing** — Use Sonnet/GPT-5.2 for low-complexity messages, Opus only when nuance required | 20–30% | Orchestrator classifies message complexity before routing. Simple acknowledgments skip Communication Coach. |
| **Tier 2 caching** — Cache stable profile data instead of re-computing per message | 10–15% | Individual Profiler runs full analysis every 10th message; incremental updates otherwise. |
| **Batch processing** — Aggregate Safety Guardian checks for burst messages | 5–10% | Buffer rapid-fire messages (< 5 second intervals) and process as batch. Maintains safety latency SLA. |
| **Response templating** — Timeout notices, exercise delivery use pre-built templates with dynamic insertions | 5–8% | Reduce Psychoeducation and phase-crisis token usage for predictable outputs. |
| **Progressive context window** — Shorter context for early pipeline stages, full context only for Coach + CPO | 15–20% | Orchestrator and Safety Guardian operate on current message + summary. Coach and CPO get full session context. |
| **Combined potential** | **40–55%** | At 500K users: reduce from $1.3M to ~$650K–$780K/month. |

---

## 12. Appendix: Agent Interaction Matrix

### 12.1 Communication Matrix

| Agent | Sends To | Receives From | Handoff Trigger |
|-------|----------|---------------|-----------------|
| **orchestrator-agent** | All Medical Pod agents | User input, Safety Guardian signals, all agent outputs | Every message (always active) |
| **safety-guardian** | Orchestrator (SAFETY_HALT), Emergency Response Agent (SAFETY_HALT + severity), CPO (all flags) | Tier 1 shadow feed (all messages) | Threat detected (continuous passive monitoring) |
| **communication-coach** | Orchestrator (Tier 3 output) | Orchestrator (Tier 1 + Tier 2 context) | Tier 3 translation needed |
| **individual-profiler** | Orchestrator (Tier 2 profiles), Relationship Dynamics, Phase Agents, Communication Coach | Orchestrator (Tier 1 data) | Every message (continuous profiling) |
| **relationship-dynamics** | Phase Agents, Communication Coach, Progress Tracker, CPO | Individual Profiler (Tier 2), Orchestrator (interaction data) | Every interaction pair (both users active) |
| **phase-dating** | Communication Coach, Psychoeducation, Safety Guardian (escalation) | Orchestrator, Individual Profiler, Relationship Dynamics | Session in dating stage |
| **phase-commitment** | Communication Coach, Psychoeducation, phase-crisis (escalation) | Orchestrator, Individual Profiler, Relationship Dynamics | Session in commitment stage |
| **phase-crisis** | Communication Coach, Progress Tracker, Safety Guardian | Orchestrator (real-time stream) | Flooding detected (can interrupt ANY phase) |
| **phase-separation** | Communication Coach, Psychoeducation, Safety Guardian (DV risk) | Orchestrator, Relationship Dynamics | Session in separation stage |
| **phase-post-divorce** | Communication Coach, Safety Guardian (child welfare) | Orchestrator, Relationship Dynamics | Session in post-divorce stage |
| **psychoeducation-agent** | Progress Tracker (engagement data), Orchestrator (Tier 3 exercises) | Phase Agents (exercise requests), Orchestrator (Tier 2 context) | Exercise delivery triggered by phase agent or schedule |
| **progress-tracker** | Orchestrator (Tier 3 summaries), CPO (trend data), Psychoeducation (gaps) | Relationship Dynamics, phase-crisis, Psychoeducation | Periodic (end of session, weekly roll-up) |
| **chief-psychology-officer** | Orchestrator (override), External clinical board (reports) | All agents (audit feed) | Continuous meta-audit on all Tier 3 outputs |
| **emergency-response-agent** | Affected user (emergency resources), CLO (duty-to-warn packets), CPO (audit trail), external clinical board (T3 incidents) | Safety Guardian (`SAFETY_HALT` + severity), Orchestrator (session context + locale) | `SAFETY_HALT` signal received from Safety Guardian |

### 12.2 Data Flow Diagram

```
                         ┌─────────────────────┐
                         │     USER INPUT       │
                         │    (Tier 1 Raw)      │
                         └──────┬──────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           │
        ┌──────────────┐  ┌──────────┐     │
        │   SAFETY     │  │ORCHESTR- │     │
        │  GUARDIAN     │  │  ATOR    │     │
        │ (parallel    │  │(serial   │     │
        │  monitor)    │  │ pipeline)│     │
        └──────┬───────┘  └────┬─────┘     │
               │               │           │
          SAFE/HALT      ┌─────┴────┐      │
               │         │          │      │
               ▼         ▼          ▼      │
        ┌──────────┐ ┌──────────┐         │
        │INDIVIDUAL│ │RELATION- │         │
        │ PROFILER │ │SHIP DYN. │         │
        └────┬─────┘ └────┬─────┘         │
             │             │               │
             └──────┬──────┘               │
                    ▼                      │
           ┌───────────────┐               │
           │  PHASE AGENT  │               │
           │(dating/commit/│               │
           │crisis/sep/    │               │
           │post-divorce)  │               │
           └───────┬───────┘               │
                   ▼                       │
          ┌────────────────┐               │
          │ COMMUNICATION  │               │
          │    COACH       │               │
          │ (Tier 1→Tier 3)│               │
          └───────┬────────┘               │
                  ▼                        │
          ┌──────────────┐                 │
          │     CPO      │                 │
          │ (Meta-Audit) │                 │
          └──────┬───────┘                 │
                 ▼                         │
          ┌──────────────┐   ┌───────────────────┐
          │  TIER 3 OUT  │   │  PSYCHOEDUCATION  │
          │ (Shared Room)│   │  + PROGRESS       │
          └──────────────┘   │  TRACKER          │
                             └───────────────────┘
```

### 12.3 Emergency Override Chain

When Safety Guardian issues `SAFETY_HALT`:

```
SAFETY_HALT Signal
    │
    ├──► Orchestrator: STOP all pipeline processing
    ├──► All Phase Agents: FREEZE current state
    ├──► Communication Coach: QUARANTINE pending Tier 3 outputs
    ├──► Emergency Response Agent: EXECUTE emergency protocol (severity-tiered)
    │       ├── T1: Deliver localized mental health resources
    │       ├── T2: Active resource delivery + schedule follow-ups (24h/72h/7d)
    │       └── T3: Route to emergency services (911/112/999) + duty-to-warn to CLO
    ├──► CPO: ALERT for post-incident review
    └──► Session: LOCK until manual clinical review clears resumption
```

No agent in the Medical Pod — including the Orchestrator and CPO — has authority to override a Safety Guardian `SAFETY_HALT`. Only a human clinical reviewer can clear the lock.

---

## Document Control

| Field | Value |
|-------|-------|
| Document Title | Relio Medical Pod — Comprehensive Blueprint PRD |
| Version | 1.3.0 |
| Date | March 15, 2026 |
| Author | Chief Psychology Officer (CPO) Agent |
| Model | Claude Opus 4.6 |
| Status | Aligned with Unified PRD v1.3.0 |
| Next Review | April 15, 2026 |
| Approvers | CTO, CLO, External Clinical Advisory Board |
| Classification | Internal — Engineering & Clinical Leadership |

---

*This document is a living artifact. All changes require CPO approval and CHANGELOG entry per project governance policy.*
