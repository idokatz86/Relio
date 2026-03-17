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

## Key Capabilities (v2.4.0)

- **Backend LIVE on Azure OpenAI GPT-4.1** — Container Apps (Sweden Central, EU data residency)
- **Clerk Auth LIVE** — OIDC JWKS validation, Apple/Google/Email sign-in, all endpoints auth-protected
- **5-Agent MVP Pipeline** — Safety Guardian → Orchestrator → [Individual Profiler || Communication Coach] → Tier 3 Output
- **Multi-Language i18n** — react-i18next + expo-localization, 4 locales: English, Spanish, Portuguese (BR), Hebrew (RTL)
- **Multi-Language Safety** — Crisis detection in EN/ES/PT/HE via regex pre-screen + LLM, locale-aware emergency resources
- **GDPR Compliance** — Account deletion (24h grace + cascade purge), data export (JSON), consent re-prompt on version change
- **Partner Invite System** — Invite codes, QR generation, deep links, couple pairing API, push notifications
- **15 Mobile Screens** — BiometricLock, Login, Consent, AgeVerify, Onboarding, PrivacyExplainer, AttachmentQuiz, PsychoeducationCards, InvitePartner, AcceptInvite, SharedChat, PrivateJournal, Crisis, Settings, LanguagePicker
- **Backoffice Admin Dashboard** — 10 admin API endpoints + 7-page React frontend with k-anonymity
- **Security Hardened** — JWT auth, OWASP checklist, Zod validation, Helmet, auth rate limiting, CORS, fail-closed Safety Guardian, circuit breaker
- **A/B Test Infrastructure** — Deterministic hash-based experiment assignment, admin experiment dashboard
- **Push Notifications** — Expo Push API (invite acceptance, new messages), privacy-safe (no content in pushes)

## Tech Pod Status (v2.4.0)

| Sprint | Tech Issues | Closed | Open | Focus |
|--------|-------------|--------|------|-------|
| 1–2 | 11 | 11 | 0 | MVP: LLM Gateway + 5 agents + pipeline |
| 3–4 | 24 | 24 | 0 | Azure IaC, DB, auth, Redis, NSGs |
| 5–7 | 8 | 8 | 0 | Security hardening, CI, branch protection |
| 8 | 20 | 20 | 0 | Clerk auth, consent, mobile screens, backoffice |
| 9 | 11 | 11 | 0 | Partner invite, onboarding, psychoeducation |
| 10 | 16 | 16 | 0 | GDPR, i18n (4 locales), OWASP, push notifications, A/B tests |
| Azure | 6 | 6 | 0 | OpenAI, Key Vault, cost optimization |
| **Total** | **96** | **96** | **0** | Sprint 10 complete |

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
- `.github/skills/`: Houses 61 specific procedural skills (`SKILL.md`) for the agents organized by domain.
- `PRD.md`: Unified Product Requirements Document (v1.3.0).
- `docs/PRD-medical-pod.md`: Medical Pod detailed blueprint.
- `docs/PRD-tech-pod.md`: Tech Pod detailed blueprint.
- `docs/PRD-ops-pod.md`: Operations Pod detailed blueprint.

## EvoSkill Refinement (v1.1 — March 2026)

The Skills-Builder agent executed the EvoSkill Refinement Loop against live pipeline telemetry. Patches applied:

| Agent | Patch | Impact |
|-------|-------|--------|
| Safety Guardian | Compound contempt+withdrawal escalation rule | "I am done trying" + contempt → MEDIUM (was LOW) |
| Individual Profiler | Attachment sub-state classification | Distinguishes anxious-protest from avoidant-deactivation |
| Communication Coach | Gottman Horseman-specific translation strategies | 4 distinct response patterns for Criticism/Contempt/Defensiveness/Stonewalling |
| Phase-Dating | Digital-era compatibility signals | Social media friction, phubbing, love-bombing detection |
| Orchestrator | Pipeline parallelization + cultural intelligence | ~1.5s latency reduction, WEIRD bias awareness |

## Builds & Downloads

| Platform | Type | Link |
|----------|------|------|
| Backend API | **LIVE on Azure (Sweden Central)** | https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io/health |
| Android | APK (Sweden Central build) | [EAS Build](https://expo.dev/accounts/send2katzs-organization/projects/relio/builds/1d1fe833-1c34-453b-afc3-f498c50feae5) |
| iOS | Simulator (.app, Sweden Central) | [EAS Build](https://expo.dev/accounts/send2katzs-organization/projects/relio/builds/3a607d7c-89ef-4aa8-ad43-5f94ba42c2ca) |
| Demo Video | MP4 (1.9 min) | `Relio/demo/relio_demo_final.mp4` |

## Mobile App (iOS & Android)

Relio ships as a single React Native (Expo) codebase that produces native iOS and Android apps.

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | `nvm install 20` |
| npm | ≥ 10 | Comes with Node.js |
| Expo CLI | Latest | `npm install -g expo-cli` |
| EAS CLI | Latest | `npm install -g eas-cli` |
| Xcode | ≥ 15 | Mac App Store *(iOS simulator only)* |
| Android Studio | ≥ 2024 | [developer.android.com](https://developer.android.com/studio) *(Android emulator only)* |

> **No Xcode or Android Studio?** You can use [EAS Build](#build-apk--ipa-with-eas) to compile in the cloud.

### Step 1 — Start the Backend API

```bash
cd Relio/backend
cp .env.example .env          # Add your GITHUB_TOKEN
npm install
npx tsx src/server/app.ts
```

You should see:
```
🟢 Relio API Server running on http://localhost:3000
   WebSocket: ws://localhost:3000/ws
   REST API:  http://localhost:3000/api/v1/mediate
   Health:    http://localhost:3000/health
```

Verify with: `curl http://localhost:3000/health`

### Step 2 — Install Mobile Dependencies

```bash
cd Relio/mobile
npm install
```

### Step 3 — Run on iOS Simulator

> Requires **macOS** with **Xcode** installed (including iOS Simulator runtime).

```bash
# 1. Open Xcode at least once to accept the license and install components
# 2. Start the development server
npx expo start --ios
```

**What happens:**
1. Expo compiles a development build
2. iOS Simulator launches automatically (iPhone 15 Pro by default)
3. The app loads — you'll see the **Onboarding** screen
4. After onboarding, the **Shared Chat Room** appears
5. Type a message → see "Mediating..." → receive the Tier 3 transformation

**Troubleshooting iOS Simulator:**
- **"No available simulators"** → Open Xcode → Settings → Platforms → Download iOS 17+ Simulator
- **"Build failed"** → Run `cd ios && pod install && cd ..` then retry
- **Slow first build** → Normal, subsequent builds are cached (~10s)

### Step 4 — Run on Android Emulator

> Requires **Android Studio** with an AVD (Android Virtual Device) configured.

```bash
# 1. Open Android Studio → Device Manager → Create a Pixel 7 (API 34) AVD
# 2. Start the AVD (click the ▶ play button)
# 3. Start the development server
npx expo start --android
```

**What happens:**
1. Expo detects the running Android emulator
2. Installs the Expo Go client on the emulator
3. The app loads with the same onboarding flow as iOS

**Troubleshooting Android Emulator:**
- **"No connected devices"** → Ensure the AVD is running in Android Studio first
- **"ANDROID_HOME not set"** → Add to `~/.zshrc`:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
  ```
- **Slow emulator** → Enable hardware acceleration (HAXM on Intel, Hypervisor on Apple Silicon)

### Step 5 — Run on Physical Device (Expo Go)

The fastest way to test without simulators:

```bash
npx expo start
```

1. Scan the QR code with **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. The app loads directly on your phone
3. Make sure your phone and laptop are on the same Wi-Fi network
4. For the backend connection, update `API_BASE` in `src/services/api.ts` to your laptop's local IP (e.g., `http://192.168.1.100:3000`)

### Build APK / IPA with EAS

EAS (Expo Application Services) builds native binaries in the cloud — no Xcode or Android Studio required on your machine.

#### One-Time Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account (create one at expo.dev if needed)
eas login

# Initialize EAS in the project
cd Relio/mobile
eas build:configure
```

#### Build Android APK

```bash
# Development APK (installable directly, no Play Store needed)
eas build --platform android --profile preview

# Production AAB (for Google Play Store upload)
eas build --platform android --profile production
```

After the build completes (~10-15 min), EAS provides a download link for the `.apk` file. Install it on any Android device or emulator:

```bash
# Install on connected Android device/emulator
adb install relio.apk
```

#### Build iOS App

```bash
# Development build (for simulator)
eas build --platform ios --profile development

# Production IPA (for App Store / TestFlight)
eas build --platform ios --profile production
```

> **Note:** iOS production builds require an Apple Developer account ($99/year) and proper provisioning profiles. EAS can manage certificates automatically via `eas credentials`.

#### EAS Build Profiles

Add this to `eas.json` in the mobile directory:

```json
{
  "cli": { "version": ">= 3.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### App Architecture

```
mobile/
├── App.tsx                          # Entry point — screen router
├── app.json                         # Expo config (iOS + Android)
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx     # Welcome + privacy + relationship stage
│   │   ├── SharedChatScreen.tsx     # Tier 3 shared room (mint-white)
│   │   ├── PrivateJournalScreen.tsx # Tier 1 private journal (warm sand)
│   │   ├── CrisisScreen.tsx        # Safety HALT — 988/DV resources
│   │   ├── BiometricLockScreen.tsx  # FaceID/TouchID gate
│   │   └── SettingsScreen.tsx       # Privacy, block/report, data deletion
│   ├── services/
│   │   ├── api.ts                   # REST + WebSocket client
│   │   └── secure-storage.ts        # Encrypted local storage + biometric auth
│   ├── theme/
│   │   └── tokens.ts                # Design tokens (colors, typography, spacing)
│   └── types/
│       └── index.ts                 # TypeScript types matching backend API
```

### Agent Governance

Every screen and service follows mandates from the Relio repo agents:

| Screen | Governing Agent | Mandate |
|--------|----------------|---------|
| SharedChatScreen | `ui-ux-expert` | Tier 3 mint-white visual demarcation |
| PrivateJournalScreen | `native-mobile-developer` | At-rest encryption via Secure Enclave/Keystore |
| CrisisScreen | `ui-ux-expert` | Non-dismissable full-screen safety takeover |
| BiometricLockScreen | `native-mobile-developer` | Mandatory biometric gate before app access |
| SettingsScreen | `app-store-certifier` | UGC block/report, privacy labels, subscription transparency |
| API Service | `backend-developer` | WebSocket infra + intercept/hold + data stripping |

## Development

All Pull Requests must include an update to the `CHANGELOG.md` file as enforced by our CI/CD pipeline and automated checks.
