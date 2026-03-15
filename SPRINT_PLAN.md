# Relio — Sprint Plan & Execution Roadmap

**Version:** 1.0.0
**Date:** March 15, 2026
**Authors:** Scrum Master Agent, CEO, CTO, CPsychO
**Sprint Cadence:** 2-week sprints
**Status:** ACTIVE — Execution begins immediately

---

## Executive Summary

This sprint plan translates the VC Response revised 12-month roadmap into actionable 2-week sprints with tasks assigned to specific agents. The plan follows three phases:

- **Phase A (Sprints 1-4):** Discovery, Validation & MVP Build (Month 0-2)
- **Phase B (Sprints 5-8):** Pre-Seed Fundraise, Production & Beta (Month 2-4)
- **Phase C (Sprints 9-16):** Beta Expansion, Retention & Series A (Month 4-8)
- **Phase D (Sprints 17-24):** Series A Prep & Close (Month 8-12)

**MVP Scope:** 5 agents only — Safety Guardian, Orchestrator, Communication Coach, Individual Profiler, Phase-Dating.

---

## Pod Ownership & Accountability

| Pod | Owner Agent | Human Oversight | Responsibility |
|-----|------------|-----------------|----------------|
| **Medical Pod** | `chief-psychology-officer` | Clinical Co-Founder (TBH) | Clinical framework validation, safety protocols, agent behavior |
| **Tech Pod** | `chief-technology-officer` | Founder (Ido Katz) | Architecture, infrastructure, code, CI/CD |
| **Ops Pod** | `chief-executive-officer` | Founder (Ido Katz) | Strategy, fundraise, partnerships, legal, marketing |

---

## Priority Matrix

| Priority | Label | Definition |
|----------|-------|------------|
| P0 | **BLOCKER** | Must complete before anything else proceeds. Safety-critical or fundraise-critical. |
| P1 | **CRITICAL** | Required for current sprint's milestone. Sprint fails without it. |
| P2 | **HIGH** | Important for sprint velocity but non-blocking. |
| P3 | **MEDIUM** | Valuable, can slip to next sprint if needed. |
| P4 | **LOW** | Nice to have. Backlog candidate. |

---

# PHASE A: Discovery, Validation & MVP Build

## Sprint 1 (Weeks 1-2) — "First Contact"

**Sprint Goal:** Launch problem interviews, begin clinical co-founder search, build LLM Gateway abstraction.

**Gate:** 25+ interviews scheduled. Co-founder outreach begun. LLM Gateway abstraction layer committed.

### Ops Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S1-O1 | Write interview script (6 core questions) | P0 | `chief-product-officer` | Founder | Not Started | Script reviewed, 6 questions documented per VC Response Sec 6 |
| S1-O2 | Identify 100 interview candidates across 6 channels | P0 | `chief-marketing-officer` | Founder | Not Started | Channel list with 100 names/handles: Reddit, FB Groups, IG/TikTok creators, personal network, therapists, universities |
| S1-O3 | Conduct first 25 problem interviews | P1 | Founder (human) | Founder | Not Started | 25 calls completed, recorded, consent obtained |
| S1-O4 | Draft clinical co-founder job posting | P0 | `chief-product-officer` | Founder | Not Started | Posted on LinkedIn, AAMFT, Gottman alumni channels |
| S1-O5 | Begin co-founder outreach (20 candidates) | P1 | `chief-alliance-officer` | Founder | Not Started | 20 personalized outreach messages sent |
| S1-O6 | Draft investor one-pager (teaser) | P2 | `chief-strategy-officer` | Founder | Not Started | 1-page PDF: problem, solution, moat, team, ask |
| S1-O7 | Research Pre-Seed target investors (15 funds) | P2 | `chief-revenue-officer` | Founder | Not Started | Spreadsheet: fund name, partner, thesis match, warm intro path |

### Tech Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S1-T1 | Build provider-agnostic LLM Gateway abstraction (`callLLM` interface) | P0 | `backend-developer` | Founder | Not Started | `LLM_PROVIDER=github` config works. Interface supports swap to `azure` without code changes. |
| S1-T2 | Implement Safety Guardian system prompt + skill | P0 | `backend-developer` + `safety-guardian` | Founder | Not Started | Safety Guardian invokable via LLM Gateway. Detects test abuse scenarios with >95% accuracy on synthetic data. |
| S1-T3 | Set up Relio backend project structure (Node.js/TypeScript) | P1 | `backend-developer` | Founder | Not Started | Monorepo initialized: `/backend`, `/shared`, `/agents`. TypeScript config. ESLint. |
| S1-T4 | Implement Orchestrator agent (tier classification + routing) | P1 | `backend-developer` + `orchestrator-agent` | Founder | Not Started | Orchestrator classifies messages as T1/T2/T3. Routes to correct pipeline stage. |
| S1-T5 | Create synthetic test dataset (50 conversation pairs) | P2 | `fullstack-qa` | Founder | Not Started | 50 diverse scenarios: dating conflicts, jealousy, phubbing, mild crisis, benign check-ins. JSON format. |
| S1-T6 | Set up GitHub Actions CI pipeline | P2 | `github-architect` | Founder | Not Started | Lint + test on every PR. `contents: read` default. |

### Medical Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S1-M1 | Finalize Safety Guardian detection thresholds (LOW/MEDIUM/HIGH/CRITICAL) | P0 | `chief-psychology-officer` | Clinical Co-Founder (TBH) | Not Started | Documented severity matrix with example phrases per level |
| S1-M2 | Write Communication Coach system prompt (Socratic translation rules) | P1 | `communication-coach` + `chief-psychology-officer` | Founder | Not Started | Prompt tested against 10 synthetic hostile messages → produces valid Tier 3 output |
| S1-M3 | Write Individual Profiler system prompt (attachment style mapping) | P1 | `individual-profiler` | Founder | Not Started | Prompt correctly identifies attachment style in 8/10 synthetic profiles |
| S1-M4 | Write Phase-Dating system prompt (early relationship guidance) | P2 | `phase-dating` | Founder | Not Started | Handles: compatibility assessment, boundary detection, red flag identification |

---

## Sprint 2 (Weeks 3-4) — "Build & Validate"

**Sprint Goal:** Complete 50 interviews. Working 5-agent MVP on synthetic data. Waitlist live. Clinical co-founder shortlist.

**Gate:** 50 interviews done. All 5 agents invokable. Waitlist page capturing emails. 5+ co-founder candidates.

### Ops Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S2-O1 | Complete remaining 25 problem interviews | P0 | Founder (human) | Founder | Not Started | Total 50 interviews. Transcribed. Coded for themes. |
| S2-O2 | Interview analysis report (verbatim quotes + themes) | P1 | `chief-product-officer` | Founder | Not Started | Report with top 5 pain points, willingness-to-pay data, objection themes |
| S2-O3 | Build waitlist landing page (Framer/Carrd) | P1 | `ui-ux-expert` + `chief-marketing-officer` | Founder | Not Started | Live at relio.app or getrelio.com. Captures email. A/B headline test. |
| S2-O4 | Interview 5+ clinical co-founder candidates | P1 | Founder (human) | Founder | Not Started | 5 candidates interviewed. Top 2 shortlisted. |
| S2-O5 | Create investor demo script (synthetic data walkthrough) | P2 | `chief-product-officer` | Founder | Not Started | 5-minute demo: show Tier 1 input → Safety check → Tier 3 Socratic output |
| S2-O6 | MVP PRD written (5-agent scope, 15 pages max) | P1 | `chief-product-officer` | Founder | Not Started | Covers: 5 agents, user stories, acceptance criteria, tech spec, clinical constraints |

### Tech Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S2-T1 | Implement Communication Coach via LLM Gateway | P0 | `backend-developer` | Founder | Not Started | Tier 1 hostile input → Tier 3 Socratic output. Zero Tier 1 phrasing leakage. |
| S2-T2 | Implement Individual Profiler via LLM Gateway | P1 | `backend-developer` | Founder | Not Started | Produces Tier 2 attachment profile JSON from Tier 1 message history |
| S2-T3 | Implement Phase-Dating via LLM Gateway | P1 | `backend-developer` | Founder | Not Started | Dating-stage guidance, red flag detection, boundary assessment |
| S2-T4 | Build 5-agent pipeline integration test | P1 | `fullstack-qa` | Founder | Not Started | End-to-end: synthetic message → Safety → Orchestrator → Profiler → Phase → Coach → Tier 3 output. All 5 agents in sequence. |
| S2-T5 | Build investor demo environment (CLI or simple web UI) | P2 | `backend-developer` | Founder | Not Started | Interactive demo: type message as User A → see Tier 3 transformation for User B |
| S2-T6 | Canary string injection test (Tier 1 leak detection) | P2 | `fullstack-qa` + `penetration-tester` | Founder | Not Started | Unique strings in Tier 1 → assert never appear in Tier 3 output |

### Medical Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S2-M1 | Test Safety Guardian against adversarial corpus (50 scenarios) | P0 | `penetration-tester` + `safety-guardian` | Founder | Not Started | ≥99% detection on explicit threats. ≥90% on implicit patterns. <15% false positive on MEDIUM. |
| S2-M2 | Validate Socratic Translation quality (Communication Coach) | P1 | `chief-psychology-officer` | Founder | Not Started | 20 hostile inputs → 20 Socratic outputs. All reviewed for clinical soundness. |
| S2-M3 | Document clinical edge cases for beta | P2 | `chief-psychology-officer` | Clinical Co-Founder | Not Started | 10 edge cases documented: what the system should NOT do (e.g., no diagnosis, no legal advice) |

---

## Sprint 3 (Weeks 5-6) — "Fundraise Prep"

**Sprint Goal:** Clinical co-founder signed. Investor deck v1. Pre-Seed outreach begins. MVP polished for demo.

**Gate:** Co-founder signed with vesting agreement. Investor deck reviewed. 3+ warm intros to funds.

### Ops Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S3-O1 | Sign clinical co-founder (vesting agreement executed) | P0 | Founder (human) + `chief-legal-officer` | Founder | Not Started | Signed. 12-15% equity. 4-year vest, 1-year cliff. |
| S3-O2 | Build 15-slide investor deck | P0 | `chief-strategy-officer` + `chief-product-officer` | Founder | Not Started | Problem → Solution → Moat → Demo → Team → Ask. Human-attributed. |
| S3-O3 | Build financial model (Pre-Seed version) | P1 | `chief-finance-officer` | Founder | Not Started | Conservative base case (2.5% conversion). Break-even sensitivity analysis. |
| S3-O4 | Send 15 warm intro requests to target investors | P1 | Founder (human) | Founder | Not Started | 15 emails sent. Target: Health Transformer Fund, Precursor, Hustle Fund, angels. |
| S3-O5 | Waitlist growth push (target 500 signups) | P2 | `chief-marketing-officer` | Founder | Not Started | Reddit posts, therapist network shares, Product Hunt upcoming page |
| S3-O6 | Draft Terms of Service v1.0 | P2 | `chief-legal-officer` | Founder | Not Started | Covers: AI ≠ therapy disclaimer, no privilege warning, data handling, duty-to-warn |

### Tech Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S3-T1 | Polish demo environment for investor meetings | P1 | `backend-developer` + `ui-ux-expert` | Founder | Not Started | Clean web UI: input field, real-time pipeline visualization, Tier 3 output display |
| S3-T2 | Document LLM Gateway → Azure BYOK transition plan | P2 | `cloud-architect` | Founder | Not Started | Step-by-step runbook: provision Azure OpenAI, Anthropic enterprise, flip config |
| S3-T3 | Set up Azure subscription (free tier / MSFT Startup credits) | P2 | `cloud-architect` | Founder | Not Started | Azure account active. Apply for Microsoft for Startups (up to $150K credits). |
| S3-T4 | Mobile wireframes (iOS) for investor deck | P2 | `ui-ux-expert` | Founder | Not Started | 5 screens: onboarding, Private Mode, Shared Mode, mediation, timeout |

### Medical Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S3-M1 | Clinical co-founder reviews all 5 agent prompts | P0 | `chief-psychology-officer` | Clinical Co-Founder | Not Started | All 5 prompts clinically approved. Red-lines documented and resolved. |
| S3-M2 | Define beta clinical safety protocol | P1 | `chief-psychology-officer` | Clinical Co-Founder | Not Started | Written protocol: when to escalate, how to review flagged sessions, incident response |
| S3-M3 | Clinical co-founder practices investor pitch answers | P2 | Clinical Co-Founder (human) | Clinical Co-Founder | Not Started | Can answer: "What happens if someone threatens suicide?" "Is this therapy?" "What about liability?" |

---

## Sprint 4 (Weeks 7-8) — "Close Pre-Seed"

**Sprint Goal:** Pre-Seed term sheet signed. Azure BYOK transition planned. Beta recruitment from waitlist.

**Gate:** Pre-Seed committed ($1-1.5M SAFE). Azure transition runbook ready. 50+ beta applicants.

### Ops Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S4-O1 | Pitch to 10+ investors | P0 | Founder + Clinical Co-Founder (humans) | Founder | Not Started | 10 meetings. Track: interest level, follow-up, objections. |
| S4-O2 | Negotiate and close Pre-Seed ($1-1.5M SAFE) | P0 | Founder (human) + `chief-legal-officer` | Founder | Not Started | Signed SAFE at $6-8M cap. Funds wired. |
| S4-O3 | Beta recruitment from waitlist (target 50 couples) | P1 | `chief-marketing-officer` | Founder | Not Started | 50 couples confirmed for closed beta. Consent forms signed. |
| S4-O4 | Regulatory opinion letter commissioned ($15-25K) | P2 | `chief-legal-officer` | Founder | Not Started | Wellness classification opinion from healthcare regulatory attorney |

### Tech Pod Tasks

| ID | Task | Priority | Assigned Agent | Human Owner | Status | Acceptance Criteria |
|----|------|----------|----------------|-------------|--------|---------------------|
| S4-T1 | Provision Azure OpenAI Service + Anthropic enterprise account | P1 | `cloud-architect` | Founder | Not Started | Azure OpenAI: GPT-5.4 + GPT-5.3-Codex. Anthropic: Claude Opus + Sonnet. Vertex: Gemini. |
| S4-T2 | Flip LLM_PROVIDER config: github → azure | P1 | `backend-developer` | Founder | Not Started | All 5 agents now running on production BYOK providers. Zero code changes. |
| S4-T3 | Set up Azure Database for PostgreSQL Flexible Server (Tier 1 + 3) | P1 | `cloud-architect` | Founder | Not Started | Tier 1 DB: per-user RLS. Tier 3 DB: shared room. Both in private subnet. |
| S4-T4 | Implement PII redaction pipeline (Azure AI Language + Presidio) | P1 | `data-privacy-officer` + `backend-developer` | Founder | Not Started | Names, locations redacted before any LLM call. Post-flight validation. |
| S4-T5 | Build basic iOS TestFlight prototype | P2 | `native-mobile-developer` | Founder | Not Started | Login, text input, Privacy Mode, Tier 3 display. Minimal viable UI. |

---

# PHASE B: Production & Closed Beta

## Sprint 5 (Weeks 9-10) — "First Real Users"

**Sprint Goal:** First 10 real couples on production. Safety monitoring live.

**Gate:** 10 couples actively using the app. Zero safety incidents. All Tier 1 data isolated.

| ID | Task | Priority | Assigned Agent | Human Owner | Status |
|----|------|----------|----------------|-------------|--------|
| S5-1 | Onboard first 10 beta couples (hand-held) | P0 | Founder + Clinical Co-Founder | Founder | Not Started |
| S5-2 | Monitor Safety Guardian live (daily review) | P0 | `safety-guardian` + `chief-psychology-officer` | Clinical Co-Founder | Not Started |
| S5-3 | Canary string audit on production data | P0 | `fullstack-qa` | Founder | Not Started |
| S5-4 | Set up Azure Monitor + Application Insights | P1 | `cloud-architect` | Founder | Not Started |
| S5-5 | Daily bug triage + hotfix cycle | P1 | `scrum-master` + `backend-developer` | Founder | Not Started |
| S5-6 | Collect first user feedback (5-question survey) | P1 | `chief-product-officer` | Founder | Not Started |

## Sprint 6 (Weeks 11-12) — "Scale to 50"

**Sprint Goal:** 50 couples in closed beta. First D7 retention measured.

| ID | Task | Priority | Assigned Agent | Human Owner | Status |
|----|------|----------|----------------|-------------|--------|
| S6-1 | Onboard remaining 40 beta couples | P0 | Founder | Founder | Not Started |
| S6-2 | WebSocket real-time sync (replace polling if used) | P1 | `backend-developer` | Founder | Not Started |
| S6-3 | Measure D7 retention (target >50%) | P1 | `progress-tracker` | Founder | Not Started |
| S6-4 | Weekly clinical review of flagged sessions | P0 | `chief-psychology-officer` | Clinical Co-Founder | Not Started |
| S6-5 | First NPS survey (target >30) | P2 | `chief-product-officer` | Founder | Not Started |
| S6-6 | Implement basic session analytics | P2 | `backend-developer` | Founder | Not Started |

## Sprints 7-8 (Weeks 13-16) — "Agent #6 + Open Beta"

**Sprint Goal:** Add Phase-Crisis agent. Emergency Response Agent live. Expand to 200-500 couples.

| ID | Task | Priority | Assigned Agent | Human Owner | Status |
|----|------|----------|----------------|-------------|--------|
| S7-1 | Implement Phase-Crisis agent (flooding detection, timeout) | P0 | `phase-crisis` + `backend-developer` | Founder | Not Started |
| S7-2 | Implement Emergency Response Agent + Azure Communication Services | P1 | `emergency-response-agent` + `cloud-architect` | Founder | Not Started |
| S7-3 | Open beta to 200-500 couples from waitlist | P1 | `chief-marketing-officer` | Founder | Not Started |
| S7-4 | Implement cyberspace flooding detection markers | P1 | `phase-crisis` | Founder | Not Started |
| S7-5 | Add Relationship Dynamics agent (Four Horsemen detection) | P2 | `relationship-dynamics` + `backend-developer` | Founder | Not Started |
| S7-6 | Measure D30 retention (target >30%) | P0 | `progress-tracker` | Founder | Not Started |
| S7-7 | A/B test free → premium conversion prompts | P2 | `chief-revenue-officer` | Founder | Not Started |

---

# PHASE C: Retention & Series A Prep

## Sprints 9-12 (Weeks 17-24) — "Prove Retention"

**Sprint Goal:** D30 >30%. D90 measured. 500+ active couples. NPS >40. Unit economics validated.

| ID | Task | Priority | Assigned Agent | Human Owner | Status |
|----|------|----------|----------------|-------------|--------|
| S9-1 | Iterate on product based on D30 cohort analysis | P0 | `chief-product-officer` | Founder | Not Started |
| S9-2 | Add Psychoeducation Agent (exercise delivery) | P2 | `psychoeducation-agent` + `backend-developer` | Founder | Not Started |
| S9-3 | Add Progress Tracker (non-shaming metrics) | P2 | `progress-tracker` + `backend-developer` | Founder | Not Started |
| S9-4 | Implement Model Cascading in LLM Gateway | P1 | `vp-rnd` + `backend-developer` | Founder | Not Started |
| S9-5 | Measure actual CPI vs. projected ($0.006-0.012) | P1 | `chief-finance-officer` | Founder | Not Started |
| S9-6 | Validate unit economics: actual cost/user vs. $19.99 revenue | P0 | `chief-finance-officer` | Founder | Not Started |
| S9-7 | Add Phase-Commitment agent (Sound Relationship House) | P3 | `phase-commitment` + `backend-developer` | Founder | Not Started |
| S9-8 | Add digital boundaries psychoeducation modules | P3 | `psychoeducation-agent` | Founder | Not Started |
| S9-9 | First partnership LOI (therapist network or EAP) | P2 | `chief-alliance-officer` | Founder | Not Started |
| S9-10 | Prepare D30/D90 retention cohort charts | P1 | `chief-product-officer` | Founder | Not Started |

## Sprints 13-16 (Weeks 25-32) — "Series A Data Deck"

**Sprint Goal:** Series A deck + data room complete. 5+ investor meetings scheduled.

| ID | Task | Priority | Assigned Agent | Human Owner | Status |
|----|------|----------|----------------|-------------|--------|
| S13-1 | Build Series A data deck (retention charts, unit economics, NPS) | P0 | `chief-strategy-officer` + `chief-finance-officer` | Founder | Not Started |
| S13-2 | Build data room (financials, legal, clinical protocol, metrics) | P1 | `chief-legal-officer` + `chief-finance-officer` | Founder | Not Started |
| S13-3 | Target 15 Series A investors (General Catalyst, a16z Bio, Bessemer) | P0 | `chief-revenue-officer` | Founder | Not Started |
| S13-4 | Practice pitch with clinical co-founder (10 dry runs) | P1 | Humans only | Founder + CC | Not Started |
| S13-5 | Add Android support (Kotlin/Compose MVP) | P2 | `native-mobile-developer` | Founder | Not Started |
| S13-6 | SOC 2 Type I audit initiated | P3 | `chief-info-security-officer` | Founder | Not Started |
| S13-7 | WhatsApp Business API integration (Tier 3 notifications) | P3 | `backend-developer` | Founder | Not Started |

---

# PHASE D: Series A

## Sprints 17-24 (Weeks 33-48) — "Close Series A + Scale"

**Sprint Goal:** Close $5-6M Series A. Begin multi-region Azure deployment.

| ID | Task | Priority | Assigned Agent | Human Owner | Status |
|----|------|----------|----------------|-------------|--------|
| S17-1 | Pitch and negotiate Series A ($5-6M at $25-35M post) | P0 | Founder + CC (humans) | Founder | Not Started |
| S17-2 | Close Series A. Funds wired. | P0 | Founder + `chief-legal-officer` | Founder | Not Started |
| S17-3 | Hire engineering team (2 additional engineers) | P1 | Founder (human) | Founder | Not Started |
| S17-4 | Multi-region AKS deployment (East US + West US) | P2 | `cloud-architect` | Founder + Eng | Not Started |
| S17-5 | Add remaining phase agents (Separation, Post-Divorce) | P2 | Medical Pod | Founder + CC | Not Started |
| S17-6 | Implement Proactive Engagement Engine | P2 | `relationship-dynamics` + `backend-developer` | Founder + Eng | Not Started |
| S17-7 | International expansion prep (UK/AU data residency) | P3 | `cloud-architect` + `chief-strategy-officer` | Founder | Not Started |
| S17-8 | Publish first Cyberspace Flooding research paper | P3 | `chief-psychology-officer` + Clinical Co-Founder | CC | Not Started |

---

## Sprint Velocity Assumptions

| Phase | Team Size | Sprint Capacity (story points) | Bottleneck |
|-------|-----------|-------------------------------|------------|
| Phase A (Sprints 1-4) | 1 human + 38 AI agents | ~40 pts/sprint | Founder time (interviews, fundraise) |
| Phase B (Sprints 5-8) | 2 humans + 38 AI agents | ~50 pts/sprint | Clinical review bandwidth |
| Phase C (Sprints 9-16) | 3 humans + 38 AI agents | ~65 pts/sprint | User feedback iteration speed |
| Phase D (Sprints 17-24) | 5 humans + 38 AI agents | ~80 pts/sprint | Hiring + scaling |

---

## Risk Register (Sprint-Level)

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Clinical co-founder search takes >6 weeks | Medium | Critical | Expand search channels. Offer advisory role as bridge. | Founder |
| Pre-Seed fundraise delayed beyond Month 3 | Medium | High | Extend MVP runway on GitHub Models. Reduce scope further. | `chief-finance-officer` |
| D30 retention <30% | Medium | Critical | Rapid iteration. Weekly user interviews. A/B test core loop. | `chief-product-officer` |
| Safety Guardian false positive >15% on MEDIUM | Low | High | Threshold tuning with clinical co-founder. More training data. | `safety-guardian` + CC |
| Azure BYOK transition breaks pipeline | Low | Medium | Config-only swap. Integration tests before cutover. Rollback plan. | `backend-developer` |

---

## Ceremonies

| Ceremony | Frequency | Duration | Attendees | Purpose |
|----------|-----------|----------|-----------|---------|
| Sprint Planning | Every 2 weeks (Monday) | 1 hour | Founder, Clinical Co-Founder, Scrum Master agent | Prioritize tasks, assign agents, set sprint goal |
| Daily Standup | Daily (async) | 15 min | Founder reviews agent outputs | Blockers, progress, today's priority |
| Sprint Review | Every 2 weeks (Friday) | 30 min | Founder, Clinical Co-Founder | Demo completed work, validate acceptance criteria |
| Sprint Retrospective | Every 2 weeks (Friday) | 30 min | Founder, Clinical Co-Founder | What worked, what didn't, what to change |
| Clinical Review | Weekly | 1 hour | Clinical Co-Founder, CPsychO agent | Review flagged sessions, validate agent behavior, safety audit |
| Investor Update | Monthly | Email | Investor leads | Progress, metrics, ask |

---

## Definition of Done

A task is DONE when:
1. Code committed to `main` branch (if engineering task)
2. Tests pass (CI green)
3. Acceptance criteria met (verified by human reviewer)
4. Clinical review completed (if touches Medical Pod)
5. No Tier 1 data leakage detected (canary test passes)
6. Documentation updated (if architecture change)

---

## Backlog (Unprioritized — Post-Series A)

| Task | Agent | Notes |
|------|-------|-------|
| Data monetization pipeline (k-anonymity) | `data-privacy-officer` | Requires 100K+ MAU |
| Platform integrations (WhatsApp, Telegram, WeChat) | `backend-developer` | Tier 3 notifications only |
| Voice input pipeline | `vp-rnd` | Requires speech-to-text + privacy filtering |
| Full cultural localization (15+ languages) | `skills-builder` | Per-market adaptation |
| Insurance/EAP enterprise contracts | `chief-alliance-officer` | Post-Series A BD |
| Advanced Proactive Engagement (external stressor detection) | `relationship-dynamics` | Requires longitudinal data |
| Fine-tuned specialized models per agent | `vp-rnd` | Month 18+ |
| Multi-party mediation (3+ people) | `orchestrator-agent` | Premium+ feature |

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Relio Sprint Plan & Execution Roadmap |
| Version | 1.0.0 |
| Date | March 15, 2026 |
| Authors | `scrum-master`, `chief-executive-officer`, `chief-technology-officer`, `chief-psychology-officer` |
| Status | ACTIVE |
| Review Cadence | Updated every sprint (bi-weekly) |
| Source of Truth | PRD v1.3.0, VC Response (2026-03-15) |
