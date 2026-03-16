# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2026-03-16
### Added
- **Azure Deployment**: Backend live on Azure Container Apps at `https://relio-backend.nicecliff-c249023f.eastus.azurecontainerapps.io`
- **Terraform IaC**: VNet (4 subnets), ACR, Key Vault, Redis, Log Analytics, App Insights, Container Apps Environment — all provisioned via `terraform apply`
- **Docker Image**: Multi-stage build pushed to `relioacr.azurecr.io/relio-backend:latest` via ACR Build
- **19 Azure Issues** (#55-#73): Full deployment backlog created, triaged, and agent-assigned by Scrum Master
- **25 Sprint 1-2 issues closed** as completed; 6 duplicates closed

### Changed
- Mobile app API client now points to Azure backend URL (no local server needed for testers)
- New Android APK building via EAS with Azure backend baked in

## [1.4.0] - 2026-03-16
### Added
- **React Native Mobile App** (iOS + Android): 6 screens — Onboarding, SharedChat, PrivateJournal, Crisis, BiometricLock, Settings. Governed by 6 repo agents.
- **Backend HTTP + WebSocket Server**: Express API on port 3000 with data stripping, intercept & hold logic. REST + WS endpoints.
- **Android APK**: Built via EAS cloud, shareable download link.
- **iOS Simulator Build**: Built via EAS cloud (no Apple Developer account needed).
- **Demo Video**: Automated 6-scene captioned video with title cards (Relio/demo/).
- **19 Azure Deployment Issues** (#55-#73): Full Terraform IaC plan for Container Apps, PostgreSQL, Cosmos DB, Redis, Key Vault, App Insights.
- **EvoSkill Refinement Loop v1.1**: Skills-Builder assessed all 5 MVP agents against live telemetry.

### Changed
- **Pipeline Parallelization**: Orchestrator + Individual Profiler now run in `Promise.all()` (~1.5s latency reduction).
- **Safety Guardian**: Added compound contempt+withdrawal escalation rule (Gottman, 1994). "I am done trying" + contempt markers → MEDIUM.
- **Individual Profiler**: Added attachment sub-state classification (anxious-protest vs avoidant-deactivation).
- **Communication Coach**: Added Gottman Horseman-specific translation strategies (Criticism ≠ Contempt ≠ Defensiveness ≠ Stonewalling).
- **Phase-Dating Skill**: Added digital-era compatibility signals (social media friction, phubbing, love-bombing detection).
- **Orchestrator Skill**: Added pipeline parallelization directive and cultural intelligence embedding.
- **Mobile API Client**: Fixed to use `localhost` with `adb reverse` for emulator connectivity.
- **Expo Config**: Removed `expo-router` (was causing HomeMenu crash), fixed entry point to `AppEntry.js`.

### Fixed
- Android emulator "Something went wrong" crash (expo-router plugin hijacking).
- AI responses not showing in mobile chat (API host mismatch + silent error swallowing).
- Demo Scene 1 recording (onboarding taps not landing — fixed with `uiautomator` precision coordinates).

## [1.3.0] - 2026-03-15
### Added
- **Emergency Response Agent (#38)**: New dedicated agent that executes emergency protocols when SAFETY_HALT is triggered. Separates detection (Safety Guardian) from action. Integrates with Azure Communication Services for real emergency number routing (911/112/999).
- **`execute-emergency-response` skill**: Tiered emergency protocol execution including locale-aware resource delivery, real emergency routing, duty-to-warn legal protocol, session lockout, and post-crisis follow-up scheduling.
- **Digital Communication & Social Media Clinical Framework** (PRD Section 4.5): Cyberspace flooding detection, Surface vs. Depth social media friction analysis, stage-specific digital impact mapping, 7 digital psychoeducation micro-lessons.
- **Proactive Engagement Engine** (PRD Section 4.4): Pattern-based interventions, scheduled check-ins, crisis prevention through pre-emptive de-escalation.
- **LLM Infrastructure Transition Roadmap**: 3-phase plan from GitHub Models API (free/dev) → Azure BYOK (production) → Model Cascading (scale). Provider-agnostic gateway abstraction.
- **Model Cascading & CPI Management**: Complexity classifier routes 40% simple/30% medium/20% complex/10% safety. Blended CPI targets: $0.012 → $0.006 → $0.004.
- **Platform Strategy** (PRD Section 6): Standalone native app as PRIMARY. WhatsApp/Telegram as Tier 3 notification channels only.
- **User Lifecycle Flow** (PRD Section 7): End-to-end from Discovery → Offboarding → Re-entry with data handling per stage.
- **Funding Allocation Detail**: Series A $6M breakdown (7 categories), Series B $15-20M breakdown (5 categories).
- **Anonymized Data Monetization Strategy**: k-anonymity (k≥50), differential privacy (ε=0.5), opt-in. Revenue: $500K Y2, $2M Y3, $5M Y4.
- Investor mockup sprint added to Phase 1 timeline (Weeks 3-4).
- Unified PRD (`PRD.md`) and three pod-level PRDs (`docs/PRD-medical-pod.md`, `docs/PRD-tech-pod.md`, `docs/PRD-ops-pod.md`).
- Multi-agent architecture flow diagram (`multi-agent-flow.drawio`).

### Changed
- **All infrastructure → Azure-native**: AKS, Azure PostgreSQL Flexible Server (Tier 1/3), Azure Cosmos DB (Tier 2), Azure Cache for Redis, Azure Service Bus, Azure Blob Storage, Azure Front Door + WAF, Azure API Management, Azure Monitor + Application Insights, Azure Key Vault, Azure Container Registry.
- **Agent count: 37 → 38** (added `emergency-response-agent`). All agent and skill files updated accordingly.
- **Lean AI-first headcount**: 8 humans Y1 → 14 Y2 → 22 Y3 (down from 15→23→31). Agents handle 90% of work.
- **Burn rate cut 57%**: Y1 $2.04M, Y2 $4.3M, Y3 $8M (down from $4.74M/$8.9M/$14.8M).
- **Break-even pulled forward**: Q3 Year 3 (from Q1 Year 4).
- **Funding requirements reduced**: Series A $6M (from $10M), Series B $15-20M (from $25-35M).
- Updated `phase-crisis` agent with cyberspace flooding detection (late-night, cross-platform, evidence-gathering, read-receipt anxiety markers).
- Updated `relationship-dynamics` agent with `DIGITAL_FRICTION` tagging and Surface vs. Depth protocol for social media arguments.
- Updated `psychoeducation-agent` with stage-specific digital boundary curricula (7 micro-lesson modules).
- Updated `enforce-conflict-timeout` skill with digital-specific timeout extensions and post-timeout re-entry protocol.
- Updated `analyze-eft-cycles` skill with social media friction mapping.
- Updated `deliver-micro-lessons` skill with digital boundaries lesson delivery rules.
- Updated `design-vpc-subnets` skill: AWS VPC → Azure VNet + AKS + Private Endpoints.
- Updated `optimize-llm-costs` skill: added Model Cascading and Azure OpenAI PTU references.
- Updated `architect-dual-context-db` skill: Azure PostgreSQL + Cosmos DB specifics.
- Updated `enforce-privacy-mechanisms` skill: Azure AI Language + Presidio PII redaction.
- Updated `generate-containment-playbook` skill: Azure VNet NSG + Key Vault + Defender.
- Updated `create-secure-workflow` skill: Azure Container Registry + Defender for DevOps.
- Updated `implement-secure-websocket` skill: Socket.io on AKS + Azure Cache for Redis.
- Updated `test-tier1-isolation` skill: Azure PostgreSQL canary string injection.
- Updated `detect-crisis-abuse` skill: emergency-response-agent handoff.
- Updated `design-subscription-funnel` skill: Premium/Premium+ pricing + data monetization.
- Updated `generate-stage-messaging` skill: digital & social media angle per stage.
- Updated `scaffold-agent-skill` and `skills-builder` agent: 36 → 38 agents.
- Configured 3-Tier Confidentiality Model constraints into all system prompts.
- All pod PRDs aligned to v1.3.0.

## [1.0.0] - 2026-03-15
### Added
- Fully provisioned all 37 AI agent `.agent.md` files across the Medical, Operations, and Tech Pods using advanced LLMs (GPT-5.4, Claude Opus 4.6, Claude Sonnet 4.6, Gemini 3.1 Pro, GPT-5.3-Codex).
- Scaffolded all corresponding 37 `SKILL.md` definitions enforcing strict operational directives.
- Implemented core infrastructure issues for MCP integration and Enterprise LLM Gateway deployment.
- CI/CD workflow testing for `CHANGELOG.md` updates on PR.
- Initial GitHub Copilot architectures and base skill definitions.