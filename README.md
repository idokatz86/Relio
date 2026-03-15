# Relio

Relio is a cloud-first, multi-agent mobile application for relationship mediation (iOS/Android). The app uses a 3-way chat system (User A + User B + AI Mediator) to safely guide couples through four relationship stages: early dating, long-term pre-marriage, marriage, and divorce/co-parenting.

## The 3-Tier Confidentiality Model

Our core architectural moat ensures the utmost emotional safety and data privacy:

- **Tier 1 (Private):** Raw transcripts, venting, and specific complaints. This data is rigorously firewalled and never shared with the partner or exposed to shared room endpoints.
- **Tier 2 (Abstracted):** Pattern-level psychological insights (e.g., "Anxious attachment activated", "Criticism pattern detected"). Kept internal to the Medical Pod.
- **Tier 3 (Actionable):** Socratic, de-escalated guidance safely presented to the partner to encourage constructive dialogue.

## Multi-Agent Architecture

Relio is powered by a workforce of 37 specialized AI agents distributed across three pods, utilizing the most advanced LLMs (Claude 4.6, GPT-5.4, GPT-5.3-Codex, Gemini 3.1 Pro):

- **Medical Pod:** (e.g., Orchestrator, Communication Coach, Phase Agents, Safety Guardian) Drives the clinical logic, enforces timeout rules, maps attachment styles, and monitors abuse signals.
- **Operations Pod:** (e.g., CEO, CMO, CLO, CRO) Manages business strategy, legal disclaimers, partnership evaluations, metric-driven marketing, and token cost optimization.
- **Tech Pod:** (e.g., CTO, Scrum Master, QA, Red Teamer) Constructs secure WebSockets, ensures rigid Tier 1 DB separation, oversees CI/CD governance, and executes adversarial red-teaming.

## Agent Directory

| Agent Name | Pod | Description |
|------------|-----|-------------|
| `chief-psychology-officer` | Medical Pod | Overseeing the system to prevent AI hallucination and parasocial dependency. |
| `communication-coach` | Medical Pod | Translates Tier 1 raw complaints into Tier 3 Socratic questions without revealing the source. |
| `individual-profiler` | Medical Pod | Evaluates Adult Attachment Theory and Love Languages for individual users. |
| `orchestrator-agent` | Medical Pod | Medical Pod - Enforces the 3-Tier Confidentiality Model for relationship mediation. |
| `phase-commitment` | Medical Pod | Focuses on John Gottman's Sound Relationship House and deepening intimacy. |
| `phase-crisis` | Medical Pod | Detects physiological flooding, enforces structural pauses, and initiates Gottman repair attempts. |
| `phase-dating` | Medical Pod | Assess early compatibility, boundaries, and red flags. |
| `phase-post-divorce` | Medical Pod | Manages high-conflict co-parenting and parallel parenting boundaries. |
| `phase-separation` | Medical Pod | Non-partisan logistical mediation for asset division and grief processing. |
| `psychoeducation-agent` | Medical Pod | Delivering personalized exercises handling asymmetric engagement. |
| `relationship-dynamics` | Medical Pod | Analyzes Gottman's Four Horsemen and EFT cycles in interactions. |
| `safety-guardian` | Medical Pod | Continuous context monitoring for coercive control, domestic violence, and self-harm. |
| `chief-alliance-officer` | Operations Pod | Evaluates and structures external partnerships, integrations, and clinical network agreements. |
| `chief-compete-officer` | Operations Pod | Monitors the competitive landscape and generates strategic counter-plays. |
| `chief-executive-officer` | Operations Pod | Aligning all business and tech operations with the core mission and protecting the 3-Tier Confidentiality Model. |
| `chief-finance-officer` | Operations Pod | Optimizes unit economics, burn rate, and dynamic LLM AI routing strategies. |
| `chief-legal-officer` | Operations Pod | Drafts liability protections, terms of service, and warns against privilege expectation. |
| `chief-marketing-officer` | Operations Pod | Manages messaging, positioning, user lifecycle campaigns, and brand differentiation. |
| `chief-product-officer` | Operations Pod | Formats product requirements into Agile user stories focused on relationship stages and emotional safety. |
| `chief-revenue-officer` | Operations Pod | Designs pricing models, subscription funnels, and monetization strategies for asymmetric engagement. |
| `chief-strategy-officer` | Operations Pod | Maps long-term product evolution, market trends, and R&D investment priorities. |
| `chief-technology-officer` | Operations Pod | Designs the high-level database architecture to isolate private data from shared spaces. |
| `data-privacy-officer` | Operations Pod | Enforces PII redaction protocols and differential privacy before data transmission to LLM APIs. |
| `app-store-certifier` | Tech Pod | Audits mobile codebase against Apple/Google guidelines for User-Generated Content and privacy. |
| `backend-developer` | Tech Pod | Builds the real-time server infrastructure, WebSocket routing, and payload sanitization APIs. |
| `chief-info-security-officer` | Tech Pod | Generates incident response playbooks for platform breaches and governs enterprise security. |
| `cloud-architect` | Tech Pod | Configures VPCs, subnets, and isolated database enclaves via Infrastructure as Code. |
| `fullstack-qa` | Tech Pod | Generates integration tests verifying that Tier 1 private data never leaks to shared endpoints. |
| `github-architect` | Tech Pod | Configures secure CI/CD pipelines and read-only GitHub Action defaults. |
| `mobile-qa` | Tech Pod | Tests WebSocket stability and state synchronization across iOS and Android platforms. |
| `native-mobile-developer` | Tech Pod | Writes code for iOS/Android focusing on local state encryption and biometric authentication. |
| `penetration-tester` | Tech Pod | Crafts prompt injection attacks to stress-test the LLM mediator's resistance to revealing private context. |
| `progress-tracker` | Tech Pod | Tracking conflict frequency and resolution times without leaking Tier 1 privacy. |
| `scrum-master` | Tech Pod | Organizes agile tasks, resolves blockers between teams, and ensures all tickets respect the 3-Tier Confidentiality Model. |
| `skills-builder` | Tech Pod | Elite AI Systems Architect and Meta-Prompt Engineer responsible for building, refining, and optimizing a 36-node multi-agent global relationship mediation system. |
| `ui-ux-expert` | Tech Pod | Designs UI paradigms visually distinguishing between private AI venting and shared communications. |
| `vp-rnd` | Tech Pod | Prototypes advanced NLP parsing pipelines to detect emotional flooding and systemic toxicity. |

## Organization & Structure

- `.github/agents/`: Contains definitions and system configurations for each of the 37 AI agents.
- `.github/skills/`: Houses specific procedural skills (`SKILL.md`) for the agents organized by domain.

## Development

All Pull Requests must include an update to the `CHANGELOG.md` file as enforced by our CI/CD pipeline and automated checks.
