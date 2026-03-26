# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.3.0] - 2026-03-26
### Added — App Store Submission Critical Path
- **Clerk OIDC auth flow** (#152) — `@clerk/clerk-expo` integration, `AuthProvider` context, `clerkTokenCache` for secure token persistence, Clerk session synced to secure storage
- **React Navigation** (#153) — Replaced state machine with `NavigationContainer` + native stack/bottom tab navigators. Auth stack (biometric → login), onboarding stack (consent → age → privacy → setup → quiz → paywall), main tabs (chat, journal, settings), modal screens (crisis, language, invite, NPS). Deep linking for `relio://invite/:code`.
- **Privacy Policy + Terms of Service** (#155) — Static HTML pages at `/privacy.html` and `/terms.html` in landing-v2/public. Full 3-Tier data model disclosure, AI disclaimer, GDPR Article 17 deletion, third-party services list.
- **Account deletion endpoint** (#160) — `DELETE /api/v1/account` for Apple 5.1.1(v) compliance. 24h grace period, GDPR cascade. Mobile SettingsScreen updated to use proper auth headers.
- **Reviewer seed endpoint** (#151, #168) — `GET /api/v1/seed/reviewer` returns demo credentials (reviewer@myrelio.io). Pre-loaded conversation data. Disabled in production.
- **Sentry crash reporting** (#157) — Already wired via `initSentry()` in App.tsx. PII scrubbing in `beforeSend`. Screen transition breadcrumbs via `captureScreenTransition`.
- **Accessibility audit** (#159) — Added `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `accessibilityHint` to: SharedChatScreen TextInput + Send button, ConsentScreen switches + accept button, CrisisScreen resource buttons + checkbox + continue button.
- **EAS production profile** (#154) — Added env vars (Sentry DSN, RevenueCat keys) to production build, `channel: "production"`, `expo-web-browser` plugin for Clerk OAuth.

### Changed
- **App.tsx** — Complete rewrite: ClerkProvider → AuthProvider → SafeAreaProvider → GestureHandlerRootView → AppNavigator
- **SettingsScreen** — Account deletion uses `deleteAccount()` API method with auth headers instead of hardcoded fetch
- **Mobile dependencies** — Added `@clerk/clerk-expo`, `expo-web-browser`, `expo-auth-session`

## [3.2.0] - 2026-03-26
### Added — P2: Phase Agents (Married, Pre-Divorced, Divorced)
- **Phase-Married Agent** (`phase-married.ts`) — Gottman's Sound Relationship House framework: Love Maps, Fondness & Admiration, Turning Towards, perpetual conflict dialogue, shared meaning rituals. Casual friend-who-gets-it tone.
- **Phase-Pre-Divorced Agent** (`phase-pre-divorced.ts`) — De-escalation, flooding detection handoff, 20-minute timeout coordination, logistical mediation with non-partisan reframing, grief processing, digital flooding management (late-night spirals, text walls, old screenshot resurfacing).
- **Phase-Divorced Agent** (`phase-divorced.ts`) — BIFF response method (Brief, Informative, Friendly, Firm), Gray Rock protocol, parallel parenting support, Tier 1 venting firewall (hostile content blocked from transmission), child-focused reframing, parental alienation detection.
- **Orchestrator upgraded** — relationship stage detection (dating/married/pre-divorced/divorced) with contextual routing to appropriate phase agent. New `relationshipStage` field in routing result.
- **Pipeline upgraded to 7-step** — PII Redactor → Safety Guardian → (Orchestrator ‖ Profiler ‖ Dynamics) → Phase Agent → Coach → PII Validator. Phase guidance now feeds into Communication Coach as additional context.
- **LLM Gateway**: 3 new model configs (phase-married, phase-pre-divorced, phase-divorced) — all GPT-4.1-mini
- **AgentName type** expanded: `phase-married`, `phase-pre-divorced`, `phase-divorced`

## [3.1.0] - 2026-03-26
### Added — Sprint 14: New Agents, Pipeline Upgrade & Production Deploy
- **Relationship Dynamics Agent** (`relationship-dynamics.ts`) — Four Horsemen live detection, pursue-withdraw/attack-attack/withdraw-withdraw cycle identification, DIGITAL_FRICTION tagging, phubbing detection, Surface vs Depth analysis, repair attempt flagging
- **Psychoeducation Agent** (`psychoeducation.ts`) — Stage-specific micro-lesson generation (dating/married/pre-divorced/divorced), digital boundaries modules, casual tone in all 4 languages, exercise generation
- **Progress Tracker Agent** (`progress-tracker.ts`) — Conflict frequency, resolution time, positive:negative ratio, horsemen trends, repair attempt rate, non-shaming weekly summary in casual tone
- **Pipeline upgraded to 6-step, 10-agent system** — PII Redactor → Safety Guardian → (Orchestrator ‖ Profiler ‖ Dynamics) → Coach → PII Validator. Dynamics context (horsemen, cycle) now feeds into Communication Coach for smarter responses.
- **New API endpoints**:
  - `GET /api/v1/psychoeducation/lesson` — personalized micro-lessons by stage, language, dynamics
  - `GET /api/v1/progress` — weekly progress metrics with casual summary
- **LLM Gateway**: 3 new model configs (relationship-dynamics, psychoeducation, progress-tracker) — all GPT-4.1-mini for cost optimization
- **AgentName type** expanded: `relationship-dynamics`, `psychoeducation`, `progress-tracker`

### Changed — Casual Tone Overhaul
- **Communication Coach prompt** — formal Socratic → casual friend-mediating tone. Horseman-aware differentiation stays in reasoning; output sounds like a caring friend, not a textbook.
- **Phase-Crisis pause messages** — clinical ("prefrontal cortex offline") → warm casual ("things got heated, totally normal") in EN/ES/PT/HE
- **Emergency Response tone** — hotline-script → genuine warmth ("you don't have to deal with this alone")
- **9 user-facing skills updated** with casual tone + Hebrew glossary reference: socratic-translation, enforce-conflict-timeout, execute-emergency-response, establish-parallel-parenting, neutral-logistics-mediation, deliver-micro-lessons, audit-relationship-house, generate-health-report, generate-stage-messaging
- **Israeli Hebrew Tone Guide** — new skill (`israeli-hebrew-tone-guide/SKILL.md`) with 100+ everyday expressions, cultural mediation rules, gender conjugation, Arabic-origin words (יאללה, חלאס, סבבה)
- **Communication Coach Hebrew register** — full inline guide with DO/DON'T table, 4 authentic example outputs in spoken Israeli register

### Fixed
- **Mobile consent API** — ConsentScreen + AgeVerifyScreen wired to actual backend endpoints (`acceptConsent()`, `verifyAge()`)
- **Mobile API client** — added `acceptConsent`, `verifyAge`, `createInvite`, `acceptInvite` methods
- **Hebrew locale casualized** — consent, chat, crisis, settings strings updated (e.g., "יאללה, מסכים/ה — קדימה")
- **npm audit** — flatted prototype pollution + picomatch ReDoS fixed
- **eas.json** — removed invalid `versionCode`/`buildNumber` fields

### Infrastructure
- **Azure PostgreSQL started** — `relio-postgres-dev` running in Sweden Central (was stopped for cost savings)
- **Merged to main** — production deployment triggered via CD pipeline
- **PRD v3.0.0** — unified update from all 3 pods + CSO review
- **Customer Journey** — 10-phase HTML document + Mermaid diagram created

### Docs
- CHANGELOG.md, README.md, PRD.md updated to v3.0.0
- Customer journey PDF at `docs/customer-journey.html`
- Israeli Hebrew tone guide at `.github/skills/israeli-hebrew-tone-guide/SKILL.md`

## [3.0.0] - 2026-03-24
### Added — Sprint 13: Data Layer, Privacy & Scale
- **PostgreSQL Data Layer** — Full production-ready persistence layer replacing all in-memory Maps (#65)
  - Dual connection pool manager (`pool.ts`) for Tier 1 + Tier 3 physical database isolation
  - 4 repository modules: `tier1-repo.ts` (RLS-protected), `tier3-repo.ts`, `auth-repo.ts`, `deletion-repo.ts`
  - Idempotent schema migration runner (`migrate.ts`) — applies SQL schemas on startup when `AUTO_MIGRATE=true`
  - All 5 routers wired to DB with graceful in-memory fallback for local dev
  - Docker Compose with PostgreSQL 16 service + init script for `relio_tier3_shared` database
  - `pg` driver added to dependencies
- **PII Redaction Pipeline** — Pre-flight and post-flight privacy enforcement (S4-T4)
  - `pii-redactor.ts` — Regex-based detection of names, emails, phones, addresses, SSNs, URLs
  - `pii-validator.ts` — Post-flight scan ensuring no PII leaks into Tier 3 LLM output
  - Pipeline wired: redaction before Orchestrator/Profiler/Coach, validation after Coach
  - Safety Guardian sees original (un-redacted) message for accurate crisis detection
- **Canary Leak Detection Tests** — `fullstack-qa` agent mandate fulfilled (S5-3)
  - 44 tests injecting 7 unique canary strings (including Unicode Hebrew/Chinese)
  - Verifies canaries NEVER appear in: REST responses, WebSocket broadcasts, admin APIs, error payloads, response headers
  - Deep JSON recursive scanner catches double-encoded leaks
  - Compound injection test (all 7 canaries in one message)
  - Sequential isolation test (canary from request N doesn't bleed to N+1)
- **WebSocket Relay** — Redis pub/sub for cross-replica message fan-out (`cloud-architect` mandate)
  - `ws-relay.ts` — Publish/subscribe relay using separate Redis clients
  - Room lifecycle: subscribe on first connection, unsubscribe on last disconnect
  - Local EventEmitter fallback for single-replica mode (no Redis required)
  - App.ts WebSocket handler updated to use relay for all Tier 3 broadcasts
- **Integration Test Suite** — 20-test full user journey (`integration.test.ts`)
  - Health, waitlist, mediate (auth, validation, oversized), consent (accept, status, age), invite (create, status, accept), admin (auth, unauthorized), account (export, delete, cancel), security headers, CORS, rate limiting
- **Server Auto-Start Guard** — `app.ts` no longer calls `start()` on import (prevents port conflicts in parallel test suites)

### Changed
- `isInMemoryMode()` now returns `true` when pools are uninitialized (fixes test environment detection)
- Pipeline uses redacted messages for Orchestrator, Profiler, and Coach (original preserved for Safety Guardian only)
- Test suite: **156 passing** (was 61), 21 skipped, across 7 test files (was 3)
- `.env.example` updated with uncommented PostgreSQL URLs and `AUTO_MIGRATE=true`

### Test Coverage
| Test File | Tests | Focus |
|-----------|-------|---------|
| `canary-leak.test.ts` | 44 | Privacy: Tier 1 → Tier 3 leak prevention |
| `integration.test.ts` | 20 | Full API user journey |
| `pii-redaction.test.ts` | 18 | PII detection + post-flight validation |
| `ws-relay.test.ts` | 13 | Cross-replica WebSocket relay |
| `safety-multilang.test.ts` | 50 | Crisis keyword pre-screen (4 languages) |
| `pipeline.test.ts` | 3 | Pipeline unit tests |
| `canary.test.ts` | 8 | Basic canary checks |
| **Total** | **156** | |

## [2.6.0] - 2026-03-24
### Added
- **Market Validation Survey** — 14-question survey in English and Hebrew with multiple-choice answers, country dropdown (41 countries), willingness-to-pay, urgency scale, and feature prioritization (#150)
  - Google Apps Script auto-generator (`scripts/create_validation_forms_v2.gs`)
  - Survey reference files (`scripts/survey_english.md`, `scripts/survey_hebrew.md`)
  - Facebook post copy in EN and HE
- **Landing Page v2** — React + Tailwind CSS + Framer Motion (`landing-v2/`)
  - Hero section: "Love isn't broken. It's just waiting to be rediscovered."
  - About section: "Why Relio? Because some things are meant to be fixed." with 3 pillar cards
  - Waitlist form with email capture (`relio_waitlist` table schema: id, email, first_name, created_at)
  - Pulsing heart footer animation ("Relationship Pulse")
  - Sage green (#B2AC88) / warm cream (#FFFDD0) / charcoal theme
  - DM Serif Display + Plus Jakarta Sans typography
  - No semicolons constraint honored
- **Azure Static Web App deployment** — Landing page live at `https://white-river-02b19f103.1.azurestaticapps.net`
  - Resource group: `rg-relio-landing` (West Europe, Free tier)
  - Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin

### Pre-Seed Fundraise Analysis
- Revised valuation: $4M post-money (2 co-founders from Microsoft/Oracle/Fintech)
- Recommended raise: $600K–$800K on post-money SAFE
- Equity: 10–15% to investors, 37.5%/37.5% co-founder split, 5% clinical co-founder reserve, 10% ESOP, 2.5% advisors
- 90-day market validation playbook with specific channels, metrics, and thresholds

## [2.5.0] - 2026-03-17
### Added
- **Sprint 11: i18n Translations** — 5 issues closed
- **Complete es.json** — Full professional Spanish translation (14 sections, all screens) (#142)
- **Complete pt.json** — Full professional Brazilian Portuguese translation (#143)
- **Complete he.json** — Full Hebrew translation with RTL layout support (#144)
- **Push notification templates** — Localized push templates in EN/ES/PT/HE (invite, message, consent, reminder) (#145)
- **ToS + Privacy Policy translations** — Legal docs available for all 4 locales (#146)
- **Sprint 12: Multi-Language QA** — 3 issues closed
- **Safety test suite** — 50-scenario regex pre-screen test (12 per language: EN/ES/PT/HE + edge cases) — 61 tests passing (#147)
- **App Store listings** — 4-language store descriptions with keywords and metadata (#148)
- **Mixed-language E2E test** — Cross-language mediation validation (ES→EN, EN→ES, PT→HE) (#149)
- **Medical Pod Backlog** — 4 issues closed
- **Emergency Response Agent** — SAFETY_HALT handler with region-specific resources (US/BR/IL), LLM-powered compassionate messaging, fail-safe fallback (#81)
- **Regex pre-screen** — Multi-language crisis keyword detection before LLM call (already in Sprint 10, formalized) (#82)
- **Phase-Crisis Agent** — Flooding detection (Gottman DPA), rapid-fire messaging detection, 20-min structural pause protocol, repair attempts (#83)
- **CPsychO Meta-Audit Agent** — 5-dimension clinical auditor: accuracy, scope compliance, bias detection, parasocial risk, duty-to-warn (#90)
- **Ops/Legal Backlog** — 27 issues closed
- **Terms of Service v1.0** — 14 sections: medical disclaimer, duty to warn, GDPR deletion, arbitration clause (#78, #43, #123)
- **Privacy Policy v1.0** — 13 sections: 3-Tier model explanation, data retention table, GDPR/CCPA rights, EU data residency (#79)
- **Waitlist landing page** — Static HTML with 3-tier explainer, email signup form (#88)
- All remaining ops/medical/milestone backlog items closed (40 issues total)

### Changed
- Backend deployed v2.5.0 (Container Apps revision 0000013)
- Test suite: 61 passing, 21 skipped (safety multilang + E2E tests)
- Only 2 issues remain open: #73 (iOS TestFlight), #89 (Clinical co-founder outreach)

## [2.4.0] - 2026-03-17
### Added
- **Sprint 10: GDPR, i18n, Security Hardening** — 16 issues closed
- **Account deletion** (`/api/v1/account/*`) — 24h grace period, GDPR Article 17 cascade purge, cancel flow (#125)
- **Data export** (`/api/v1/account/export`) — GDPR Article 20 Right to Portability, JSON format (#126)
- **Auth rate limiting** — 5 req/15min on consent + account endpoints, IP+userId key (#128)
- **OWASP auth checklist** — JWT structure validation, generic error messages, no info leakage (#130)
- **Multi-language Safety Guardian** — Regex pre-screen for crisis keywords in EN/ES/PT/HE before LLM call (#135)
- **Locale-aware CrisisScreen** — Country-specific emergency resources: US (988/DV hotline), Brazil (CVV 188), Israel (ERAN 1201), Spanish (988 español) (#136)
- **i18n scaffold** — react-i18next + expo-localization, 4 locales: en, es, pt-BR, he (RTL) (#137)
- **String extraction** — LoginScreen + SettingsScreen converted to `useTranslation()` with en.json keys (#138)
- **Language picker** — LanguagePickerScreen.tsx + preferredLanguage stored in SecureStore + DB schema (#139)
- **Backend language passthrough** — `preferredLanguage` field in mediate request, piped to pipeline context (#140)
- **Coach language-aware output** — Communication Coach prompt updated to produce Socratic Tier 3 in user's language (#141)
- **Biometric gate config** — `setBiometricEnabled`/`isBiometricEnabled` in secure-storage, defaults to hardware check (#127)
- **Push notifications** — Expo Push API integration, `notifyInviteAccepted` + `notifyNewMessage`, `/api/v1/push/register` (#132)
- **Consent re-prompt** — Version change detection, `re_accept_tos`/`re_accept_privacy` audit actions (#133)
- **A/B test infrastructure** — Deterministic hash-based assignment, `/api/v1/ab/assignments` + admin `/experiments` (#131)
- **E2E smoke test** — 11-step journey: health → consent → age → invite → pair → account → push → export (#129)

### Changed
- Backend deployed v2.4.0 (Container Apps revision 0000012)
- Safety Guardian prompt expanded with multi-language examples (ES/PT/HE)
- Communication Coach prompt augmented with language-aware output instructions
- Skills count: 55 → 61 (+6 Sprint 10 skills: gdpr-account-deletion, harden-auth-owasp, push-notifications, ab-testing, biometric-gate, consent-reprompt)

## [2.3.0] - 2026-03-17
### Added
- **Sprint 9: Onboarding & Partner Invite** — 11 issues closed
- **Invite API** (`/api/v1/invite/*`) — POST /create (room + 6-char hex code), POST /accept (link partner), GET /status (pairing check), GET /qr/:code (QR data for client rendering). Auth-protected.
- **InvitePartnerScreen** — Generate invite code, share via system sheet, deep link `relio://invite/{code}`, privacy note
- **AcceptInviteScreen** — 6-char code input with uppercase hex filter, partner linking, 3-Tier privacy note
- **PrivacyExplainerScreen** — 3-step interactive 3-Tier model demo (Private → Abstracted → Shared) with examples and who-sees-it
- **AttachmentQuizScreen** — 5 Gottman/EFT-based questions, calculates dominant attachment style (anxious/avoidant/secure/disorganized), clinical context + disclaimer
- **PsychoeducationCards** — 4 cards: Emotional Flooding, Four Horsemen, Bids for Connection, Pursue-Withdraw Cycle (sourced from Gottman/EFT)
- **Sprint 8: Auth System (Clerk)** — 20 issues closed
- **Clerk auth LIVE** — JWKS validation against `set-boa-5.clerk.accounts.dev`, AUTH_DISABLED=false in production. All protected endpoints return 401 without valid token.
- **Provider-agnostic auth-service.ts** — jose + JWKS, works with Clerk/Auth0/Supabase via env vars
- **ConsentRouter** — `/api/v1/consent/*` (status, accept, verify-age, withdraw, audit)
- **Mobile auth screens** — LoginScreen, ConsentScreen, AgeVerifyScreen, token-manager.ts
- **DB auth schema** — consent_records, consent_audit (immutable), refresh_tokens with RLS

### Changed
- Backend deployed v2.3.0 (Container Apps revision 0000011)
- Auth provider migrated from Azure AD B2C → Clerk (free tier, OIDC-compliant)
- PRD updated to v2.0.0 (consolidated all pod PRDs)

## [1.9.0] - 2026-03-16
### Added
- **Backoffice Admin Dashboard** — 10 admin API endpoints + 7-page React frontend (Dashboard, Users, Phases, Subscriptions, Pipeline, Safety, Feedback) with sidebar navigation and Relio earth-tone design.
- **Admin API Router** (`backend/src/server/admin-router.ts`) — `/api/v1/admin/*` endpoints for overview stats, user directory, couple pairing, phase distribution, subscription analytics, pipeline metrics, safety events, feedback, audit log, and system health.
- **k-Anonymity Enforcement** — All admin aggregations suppress groups < 5 users (shows `"<5"` instead of exact count).
- **Admin Auth Middleware** — Requires `role: admin` in JWT; regular user tokens get 403. Audit log tracks every admin API call.
- **User Feedback System** — `POST /api/v1/feedback` for session ratings (1-5), weekly pulse, NPS (0-10), churn interviews. Admin view with anonymized userId and NPS score calculation.
- **Pipeline Telemetry** — Every mediate call records latency, agent invocations, and safety events to admin stats. Live metrics available via `/api/v1/admin/pipeline`.
- **Admin Frontend** (`admin/`) — React + Vite + TypeScript + Tailwind CSS with api client, KPI cards, data tables, bar charts, and "Tier 3 Only" data scope badge.
- **5 New Agent Skills** — `build-admin-api`, `design-admin-dashboard`, `build-kql-workbooks`, `test-admin-privacy`, `design-subscription-analytics`, `collect-user-feedback`.
- **GitHub Issues #94-#96** created and closed for backoffice phases.

### Changed
- Backend version bumped to v1.8.1 (deployed to Container Apps revision 0000007)
- Health endpoint now returns version `1.8.0`

## [1.8.0] - 2026-03-16
### Added
- **Azure OpenAI Service** (`relio-openai`) deployed in Sweden Central with GPT-4.1 (`gpt-41`) and GPT-4.1-mini (`gpt-41-mini`) model deployments. Managed identity authentication (no API keys).
- **LLM Gateway DefaultAzureCredential** — `callAzureOpenAI()` now uses `@azure/identity` for managed identity token auth with automatic caching. Falls back to API key if set.
- **Security hardening on server**: Helmet security headers, express-rate-limit (30 req/min), Zod input validation (UUID userId, 2000 char max message), CORS lockdown, 10kb body limit.
- **JWT auth middleware** on REST `/api/v1/mediate` + WebSocket upgrade. `AUTH_DISABLED=true` for dev mode. Prevents userId impersonation (JWT sub must match).
- **WebSocket heartbeat** (30s ping/pong, disconnect after 3 missed pongs) + connection close code 4401 for auth failures.
- **Safety Guardian fail-closed** — parse errors now default to `severity: HIGH, halt: true` (was SAFE/false).
- **LLM Gateway circuit breaker** — 3 consecutive failures → open state for 30s → half-open retry. Per-user daily token budget tracking (50K default).
- **PII redaction module** (`backend/src/utils/pii-redaction.ts`) — strips emails, phones, SSNs, addresses, credit cards with token substitution. Tier 1 leak detection on LLM output.
- **Structured JSON logger** (`backend/src/utils/logger.ts`) — pipeline step timing, safety event logging, log levels.
- **Redis client module** (`backend/src/infra/redis.ts`) — RoomPresence, RateLimiter, PubSub interfaces with InMemoryStore fallback.
- **Database schemas** — `schema-tier1.sql` (users, tier1_messages with RLS, safety_audit_log, journal_entries, 90-day auto-purge) and `schema-tier3.sql` (rooms, room_members, tier3_messages, sessions, invite codes). No FKs between tier1 and tier3.
- **CI/CD Workflows** — `security-scan.yml` (CodeQL + npm audit + gitleaks), `backend-cd.yml` (OIDC → ACR → Container Apps → smoke test).
- **E2E smoke test suite** (`backend/tests/smoke.test.ts`) — health check, auth enforcement, input validation, security headers, CORS.
- **Operational runbook** (`docs/engineering/operational-runbook.md`) — deploy, logs, scaling, incident response, Terraform ops.
- **Mobile ContextBanner component** (`mobile/src/components/ContextBanner.tsx`) — persistent private/shared visual indicator.
- **Key Vault** (`relio-kv-dev`) recovered with RBAC. Secrets: azure-openai-endpoint, redis-connection-string, postgres-host, appinsights-connection-string.
- **Container App managed identity** (system-assigned) with roles: `Cognitive Services OpenAI User`, `Key Vault Secrets User`.
- **Budget alert** ($50/month, email at 80%/100%) + scale-to-zero (min=0, max=10 replicas).
- **Branch protection** on `main` — require PR + 1 review + passing CI + no force push.

### Changed
- **LLM Provider switched to Azure OpenAI** — `LLM_PROVIDER=azure` on Container App. All 5 agents now use GPT-4.1/GPT-4.1-mini via managed identity in Sweden Central (EU data residency).
- **Mobile API client rewritten** — fixed syntax error (orphan ternary), added auth token headers (Bearer for REST, ?token= for WS), fixed port (3001 local, no port for Azure HTTPS), async `connect()`, handles 401 + WS close 4401.
- **Container App ingress** target port fixed from 3001 → 3000 (matches Dockerfile EXPOSE).
- **Terraform hardened** — ACR `admin_enabled=false`, Cosmos DB `public_network_access_enabled=false` + private endpoint, Key Vault `purge_protection_enabled=true`, NSGs on postgres + private-endpoints subnets, remote state backend.
- Agent model config updated: Safety Guardian + Orchestrator → `gpt-41`, Coach + Profiler + Phase-Dating → `gpt-41-mini`.

### Fixed
- Mobile `api.ts` line 32 syntax error (orphan ternary `: 'wss://api.relio.app'`).
- Container App startup probe failures due to port mismatch (ingress 3001 vs container 3000).
- Pipeline 500 errors due to invalid GitHub OAuth token (`gho_`) being used for GitHub Models API.

### Closed Issues (38 tech pod issues total)
- Sprint 3: #55, #56, #57, #58 (Azure infra provisioned), #61 (CI/CD pipeline)
- Sprint 4: #62 (Redis), #64 (App Insights logging), #65 (DB schemas), #67 (JWT auth), #68 (NSGs), #71 (Terraform remote state)
- Sprint 5: #74 (SG fail-closed), #75 (WS auth), #76 (input validation), #84 (ACR + Cosmos), #85 (CI security)
- Sprint 6: #86 (circuit breaker), #87 (Redis pub/sub), #91 (mobile ContextBanner)
- Sprint 7: #93 (branch protection)
- Azure: #59 (Azure OpenAI deployed), #60 (PII redaction), #63 (Key Vault), #66 (TLS), #69 (cost optimization), #70 (smoke tests), #72 (runbook)

## [1.7.0] - 2026-03-16
### Added
- **20 New GitHub Issues (#74-#93)**: Full cross-pod review by all 38 agents. Scrum Master triaged, prioritized, and assigned issues to relevant agents across Medical, Tech, and Ops pods.
- **7 P0-BLOCKER issues** (Sprint 5): Safety Guardian fail-closed fix (#74), WebSocket auth (#75), Input sanitization + CORS lockdown (#76), Delaware C-Corp incorporation (#77), ToS v1.0 (#78), Privacy Policy v1.0 (#79), 50 problem interviews (#80)
- **9 P1-CRITICAL issues** (Sprint 5-6): Emergency Response Agent handler (#81), Safety regex pre-screen (#82), Phase-Crisis flooding detection (#83), ACR managed identity + Cosmos private endpoint (#84), CI security scanning (#85), LLM circuit breaker + token budgets (#86), Redis WebSocket pub/sub (#87), Waitlist landing page deploy (#88), Clinical co-founder outreach (#89)
- **4 P2-HIGH issues** (Sprint 6-7): CPsychO meta-audit agent (#90), Mobile navigation + ContextBanner (#91), Investor deck v1 (#92), Branch protection rules (#93)

### Changed
- PRD updated to v1.6.0 with Sprint 5-7 post-launch roadmap section
- README updated with Key Capabilities v1.7.0 and current issue tracking status
- Sprint Plan scope extended to cover Sprint 5 (security hardening + legal foundation) and Sprint 6 (agent build-out + go-to-market)

### Security
- **CRITICAL FINDING**: Safety Guardian defaults to SAFE on parse failure (issue #74 — 1-line fix, ship immediately)
- **CRITICAL FINDING**: WebSocket connections have zero authentication (issue #75)
- **CRITICAL FINDING**: CORS wide open, no input validation (issue #76)
- **HIGH FINDING**: ACR admin credentials, Cosmos DB public access (issue #84)
- **HIGH FINDING**: No CodeQL, secret scanning, or dependency audit in CI (issue #85)

## [1.6.0] - 2026-03-16
### Added
- **Sweden Central Region Migration**: All Azure resources relocated from East US → Sweden Central (EU data residency)
- **Full Infrastructure**: VNet, ACR, Key Vault, Redis, PostgreSQL Flexible Server (Tier 1/3), Cosmos DB Serverless (Tier 2), Log Analytics, App Insights, Container Apps Environment — all in `swedencentral`
- **Backend LIVE**: `https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io`

### Changed
- Mobile app API client updated to Sweden Central backend URL
- Terraform IaC `location` changed from `eastus` → `swedencentral`
- PRD, README, CHANGELOG updated with new region and URLs

## [1.5.0] - 2026-03-16
### Added
- **Azure Deployment**: Backend live on Azure Container Apps (East US, since migrated)
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