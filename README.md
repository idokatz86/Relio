# Relio

Relio is a cloud-first, AI-powered, multi-agent mobile application for relationship mediation (iOS/Android), deployed natively on **Microsoft Azure**. The app uses a 3-way chat system (User A + User B + AI Mediator) to safely guide couples through four relationship stages: early dating, long-term pre-marriage, marriage, and divorce/co-parenting.

## The 3-Tier Confidentiality Model

Our core architectural moat ensures the utmost emotional safety and data privacy — enforced at the network, database, application, LLM pipeline, and CI/CD layers:

- **Tier 1 (Private):** Raw transcripts, venting, and specific complaints. Rigorously firewalled in isolated Azure PostgreSQL Flexible Server partitions. NEVER shared with the partner.
- **Tier 2 (Abstracted):** Pattern-level psychological insights (e.g., "Anxious attachment activated", "Criticism pattern detected"). Stored in Azure Cosmos DB, internal to the Medical Pod only.
- **Tier 3 (Actionable):** Socratic, de-escalated guidance safely presented to the partner. All outputs validated by the CPO meta-audit agent before delivery.

## Multi-Agent Architecture

Relio is powered by **38 specialized AI agents** distributed across three pods, utilizing the most advanced LLMs (Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.4, GPT-5.3-Codex, Gemini 3.1 Pro):

- **Medical Pod (14 agents):** Orchestrator, Communication Coach, Safety Guardian, Emergency Response Agent, Phase Agents (5), Individual Profiler, Relationship Dynamics, Psychoeducation Agent, Progress Tracker, Chief Psychology Officer. Drives clinical logic, enforces timeout rules, maps attachment styles, monitors abuse, and executes emergency protocols.
- **Operations Pod (9 agents):** CEO, CRO, CFO, CMO, CCO, CAO, CLO, CPO, CSO. Manages business strategy, legal disclaimers, partnership evaluations, and AI-first lean operations.
- **Tech Pod (15 agents):** CTO, Backend Developer, Cloud Architect, GitHub Architect, Mobile Dev, Mobile QA, Fullstack QA, Penetration Tester, UI/UX Expert, CISO, DPO, App Store Certifier, Skills Builder, Scrum Master, VP R&D. Constructs Azure-native infrastructure, secure WebSockets, CI/CD governance, and adversarial red-teaming.

## Key Capabilities (v1.3.0)

- **Proactive Engagement Engine** — AI anticipates and prevents conflict through pattern recognition, not just reactive mediation
- **Digital Communication & Social Media Framework** — Cyberspace flooding detection, phubbing analysis, stage-specific digital boundary psychoeducation
- **Emergency Response Agent** — Dedicated agent for real emergency escalation (911/112/999) via Azure Communication Services
- **Model Cascading** — Complexity-based LLM routing for cost-optimized inference (CPI: $0.012 → $0.004)
- **Platform Strategy** — Standalone app PRIMARY; WhatsApp/Telegram as Tier 3 notification channels

## Agent Directory (38 Agents)

| Agent Name | Pod | Description |
|------------|-----|-------------|
| `chief-psychology-officer` | Medical | Meta-level auditor preventing AI hallucination and parasocial dependency. |
| `communication-coach` | Medical | Translates Tier 1 raw complaints into Tier 3 Socratic questions without revealing the source. |
| `emergency-response-agent` | Medical | Executes emergency protocols on SAFETY_HALT — routes to real emergency services (911/112/999) via Azure Communication Services. |
| `individual-profiler` | Medical | Evaluates Adult Attachment Theory and Love Languages for individual users. |
| `orchestrator-agent` | Medical | Enforces the 3-Tier Confidentiality Model, routes all messages through the clinical pipeline. |
| `phase-commitment` | Medical | Focuses on Gottman's Sound Relationship House and deepening intimacy. |
| `phase-crisis` | Medical | Detects physiological and cyberspace flooding, enforces structural pauses, initiates repair attempts. |
| `phase-dating` | Medical | Assesses early compatibility, boundaries, and red flags including digital trust. |
| `phase-post-divorce` | Medical | Manages high-conflict co-parenting with BIFF/Gray Rock digital communication frameworks. |
| `phase-separation` | Medical | Non-partisan logistical mediation for asset division and grief processing. |
| `psychoeducation-agent` | Medical | Delivers personalized exercises including digital boundaries and social media literacy micro-lessons. |
| `relationship-dynamics` | Medical | Analyzes Gottman's Four Horsemen, EFT cycles, and social media friction patterns (Surface vs. Depth). |
| `safety-guardian` | Medical | Continuous monitoring for coercive control, domestic violence, and self-harm. Absolute veto authority. |
| `progress-tracker` | Medical | Tracks conflict frequency and resolution times without leaking Tier 1 privacy. |
| `chief-alliance-officer` | Operations | Evaluates and structures external partnerships, integrations, and clinical network agreements. |
| `chief-compete-officer` | Operations | Monitors the competitive landscape and generates strategic counter-plays. |
| `chief-executive-officer` | Operations | Aligns all operations with the core mission and protects the 3-Tier Confidentiality Model. |
| `chief-finance-officer` | Operations | Optimizes unit economics, burn rate, and dynamic LLM AI routing strategies. |
| `chief-legal-officer` | Operations | Drafts liability protections, terms of service, duty-to-warn protocols. |
| `chief-marketing-officer` | Operations | Manages stage-specific messaging, privacy-first brand positioning. |
| `chief-product-officer` | Operations | Formats product requirements into Agile user stories focused on emotional safety. |
| `chief-revenue-officer` | Operations | Designs pricing models, subscription funnels, and asymmetric engagement monetization. |
| `chief-strategy-officer` | Operations | Maps long-term product evolution, market trends, and R&D priorities. |
| `app-store-certifier` | Tech | Audits mobile codebase against Apple/Google guidelines for UGC and privacy. |
| `backend-developer` | Tech | Builds real-time server infrastructure, WebSocket routing on AKS. |
| `chief-info-security-officer` | Tech | Generates incident response playbooks, governs Azure security posture. |
| `chief-technology-officer` | Tech | Designs high-level Azure-native database architecture for Tier isolation. |
| `cloud-architect` | Tech | Configures Azure VNets, AKS, and isolated database enclaves via Terraform. |
| `data-privacy-officer` | Tech | Enforces PII redaction (Azure AI Language + Presidio) and differential privacy. |
| `fullstack-qa` | Tech | Generates canary string injection tests verifying Tier 1 data never leaks. |
| `github-architect` | Tech | Configures secure CI/CD pipelines with least-privilege GitHub Actions defaults. |
| `mobile-qa` | Tech | Tests WebSocket stability and state synchronization across iOS and Android. |
| `native-mobile-developer` | Tech | Writes iOS (Swift/SwiftUI) and Android (Kotlin/Compose) with Secure Enclave/Keystore encryption. |
| `penetration-tester` | Tech | Crafts prompt injection attacks to stress-test LLM mediator resistance. |
| `scrum-master` | Tech | Organizes agile tasks, resolves blockers, ensures all tickets respect the 3-Tier Model. |
| `skills-builder` | Tech | Meta-Prompt Engineer responsible for building and optimizing the 38-node multi-agent system. |
| `ui-ux-expert` | Tech | Designs UI paradigms visually distinguishing private AI venting from shared communications. |
| `vp-rnd` | Tech | Prototypes NLP parsing pipelines, evaluates model cost/quality tradeoffs. |

## Azure-Native Infrastructure

| Service | Purpose |
|---------|---------|
| Azure Kubernetes Service (AKS) | Container orchestration for all backend services |
| Azure Database for PostgreSQL Flexible Server | Tier 1 (private) and Tier 3 (shared) data stores |
| Azure Cosmos DB | Tier 2 (abstracted) clinical data — Medical Pod internal |
| Azure Cache for Redis | Session cache, WebSocket Pub/Sub adapter |
| Azure Service Bus | Event-driven messaging between pods |
| Azure API Management | LLM Gateway with Model Cascading, rate limiting, cost tracking |
| Azure Front Door + WAF | CDN, DDoS protection, geo-routing |
| Azure Communication Services | Real emergency number routing for Emergency Response Agent |
| Azure AI Language + Presidio | PII redaction before any LLM API call |
| Azure Key Vault | Secrets management, encryption keys |
| Azure Monitor + Application Insights | Observability, alerting, distributed tracing |

## Organization & Structure

- `.github/agents/`: Contains definitions and system configurations for each of the 38 AI agents.
- `.github/skills/`: Houses 38 specific procedural skills (`SKILL.md`) for the agents organized by domain.
- `PRD.md`: Unified Product Requirements Document (v1.3.0).
- `docs/PRD-medical-pod.md`: Medical Pod detailed blueprint.
- `docs/PRD-tech-pod.md`: Tech Pod detailed blueprint.
- `docs/PRD-ops-pod.md`: Operations Pod detailed blueprint.

## Development

All Pull Requests must include an update to the `CHANGELOG.md` file as enforced by our CI/CD pipeline and automated checks.
