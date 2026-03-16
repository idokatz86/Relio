# Relio Backoffice Admin Dashboard — Joint Tech Pod × Ops Pod Consultation

**Date:** March 16, 2026  
**Classification:** Internal — Engineering & Operations  
**Participants:** 13 agents across Tech Pod and Ops Pod  
**Facilitator:** `scrum-master`

---

## 1. Recommendation Matrix

Each option scored **1 (worst) → 5 (best)** per criterion, weighted by agent mandates.

| Criterion | Weight | Option A: Low-Code (Retool) | Option B: DB-Introspecting (AdminJS) | Option C: React Admin (Refine.dev) | Option D: shadcn/ui Dashboard | Option E: Azure-Native Analytics |
|---|---|---|---|---|---|---|
| **Privacy Compliance** | 30% | ⚠️ **1** — Data leaves VNet. Retool/AppSmith hosted externally. *DPO: "Categorical rejection. Tier 1/2 data transiting vendor SaaS infrastructure violates the 3-Tier Model at the network layer."* | ⚠️ **2** — Self-hosted, but AdminJS connects *directly* to DB. Risk of accidental Tier 1 introspection if misconfigured. | ✅ **4** — Custom data provider queries only Tier 3 + App Insights. No direct DB connection. Full control over what's exposed. | ✅ **4** — Same as C. Custom API layer mediates all access. Backend controls exactly which data surfaces. | ✅ **5** — Zero DB access. Queries only App Insights/Log Analytics (already anonymized). KQL queries are read-only analytics. |
| **Dev Effort** | 15% | ✅ **5** — Drag-and-drop. Hours to build. | ✅ **4** — Auto-generates CRUD from schemas. ~1 day setup. | ⚠️ **2** — Need custom data provider, Zod schemas, auth integration. ~5-8 days. | ⚠️ **2** — Need custom API routes + full React pages. ~5-8 days. | ✅ **4** — KQL queries + workbook config. ~2-3 days. But limited interactivity. |
| **Time-to-Ship** | 15% | ✅ **5** — Same day. | ✅ **4** — 1-2 days. | ⚠️ **2** — 1-2 weeks. | ⚠️ **2** — 1-2 weeks. | ✅ **4** — 2-3 days for read-only dashboards. |
| **Cost** | 10% | ⚠️ **2** — $50-120/mo Retool, ongoing SaaS fee. | ✅ **5** — Free, self-hosted. | ✅ **5** — Free, self-hosted. | ✅ **5** — Free, self-hosted. | ✅ **5** — Already paying for App Insights. $0 incremental for workbooks. |
| **Scalability** | 15% | ⚠️ **3** — Vendor-dependent. Row limits on free tiers. | ⚠️ **3** — Single-process Node.js. OK for 1-2 admin users. | ✅ **4** — React SPA. Scales with CDN. API layer scales with Container Apps. | ✅ **4** — Same as C. | ✅ **5** — Azure Monitor is planetary-scale. |
| **Customization** | 15% | ⚠️ **2** — Constrained to vendor component library. Hard to add Relio-specific views (phase tracking, safety halts). | ⚠️ **3** — Plugin system exists but limited. Custom views require hacking. | ✅ **5** — Full React/TypeScript. Headless. Any UI you want. | ✅ **5** — Full React/TypeScript + shadcn/ui component library. Beautiful defaults. | ❌ **1** — KQL-only. No user management, no feedback forms, no interactive features. |

### Weighted Scores

| Option | Weighted Score | Rank |
|---|---|---|
| **A: Low-Code (Retool)** | 1×0.30 + 5×0.15 + 5×0.15 + 2×0.10 + 3×0.15 + 2×0.15 = **2.55** | **#5** |
| **B: DB-Introspecting (AdminJS)** | 2×0.30 + 4×0.15 + 4×0.15 + 5×0.10 + 3×0.15 + 3×0.15 = **3.00** | **#4** |
| **C: React Admin (Refine.dev)** | 4×0.30 + 2×0.15 + 2×0.15 + 5×0.10 + 4×0.15 + 5×0.15 = **3.65** | **#2** |
| **D: shadcn/ui Dashboard** | 4×0.30 + 2×0.15 + 2×0.15 + 5×0.10 + 4×0.15 + 5×0.15 = **3.65** | **#2 (tied)** |
| **E: Azure-Native Analytics** | 5×0.30 + 4×0.15 + 4×0.15 + 5×0.10 + 5×0.15 + 1×0.15 = **3.90** | **#1** |

---

## 2. Agent-by-Agent Evaluation

### TECH POD

**@chief-technology-officer** (Dual-Context DB Architecture, Strict Siloing, Scalability):
> "Options A and B are architecturally dangerous. Retool requires a direct DB connection string — that creates a network path from a third-party SaaS to our VNet. AdminJS introspects schemas automatically, meaning it would discover `tier1_messages` and `journal_entries` unless we manually exclude them. Both violate strict siloing. Options C/D are acceptable IF the backend API layer mediates all access and connects ONLY to the Tier 3 PostgreSQL database. Option E is the safest — it can't access any database at all. **My recommendation: E for metrics + D for management features, deployed as a hybrid.**"

**@backend-developer** (WebSocket Infrastructure, Intercept & Hold, Data Stripping):
> "I can build a dedicated `/api/v1/admin/` route group on the existing Express server behind a separate `admin-auth` middleware. This route group queries ONLY the Tier 3 database (rooms, room_members, tier3_messages, sessions) and App Insights REST API for aggregated metrics. No new service needed. The backoffice frontend (Option D) calls these endpoints. This reuses our existing Zod validation, Helmet, and rate limiting. For Option E, our existing App Insights already tracks `customEvents` for pipeline runs — we just need KQL queries."

**@cloud-architect** (VPC Isolation, IaC Generation, Auto-scaling):
> "Option A is a VNet violation. Period. For C/D, the backoffice frontend deploys as a static site on Azure Static Web Apps (free tier) or alongside the existing Container App. The admin API runs in the same Container App process — no new infrastructure. For Option E, Azure Monitor Workbooks are zero-infrastructure. **Critical: the backoffice Container App/static site must NOT have network routes to the Tier 1 (10.0.2.0/24 postgres-subnet) or Tier 2 (Cosmos DB private endpoint) subnets. It connects only to 10.0.3.0/24 (Tier 3 shared).** I'll add an NSG rule explicitly denying backoffice → Tier 1/2."

**@ui-ux-expert** (Visual Demarcation, Frictionless Pauses, AI Presence):
> "Option D (shadcn/ui) aligns perfectly with my mandate. The shadcn/ui component library gives us clean data tables, charts (via Recharts), and navigation — the same design system we'd use for the main app. Option E workbooks look like Azure Portal dashboards — not branded, not Relio. **Recommendation: D for the interactive admin panel, E for deep operational analytics that only the founder/CTO/cloud-architect need.** The admin panel should have clear visual indicators showing 'This data is Tier 3 only — no private messages are visible.'"

**@fullstack-qa** (Data Isolation Testing, E2E Scenarios, Fail-Fast):
> "I require a new E2E test suite for the backoffice: inject known Tier 1 mock strings (e.g., `'QA-CANARY-PRIVATE-abc123'`), then assert that searching the backoffice API for that string returns zero results. This test runs in CI on every PR touching the admin routes. Also: any admin endpoint returning `raw_content` or `journal_entries` fields fails the build immediately. For Option B (AdminJS), I cannot guarantee this — it auto-generates CRUD which could expose Tier 1 columns. C/D give me full control over assertions."

**@github-architect** (Least Privilege YAML, Review Gates, Continuous Scanning):
> "The backoffice deployment needs its own workflow: `backoffice-cd.yml`. It MUST have `contents: read` + `packages: read` only. The admin API routes should be scanned by CodeQL for any SQL query that references `tier1_messages`, `safety_audit_log`, or `journal_entries` — if found, the workflow fails. Draft PR review gate required for any changes to `/src/server/admin/` directory."

**@data-privacy-officer** (Pre-Flight Redaction, Differential Privacy, Data Lifecycle):
> "**Non-negotiable requirements:**
> 1. The backoffice MUST NOT display individual user emails or names alongside behavioral data. User counts are OK; user lists with relationship phase + email = re-identification risk.
> 2. Any user feedback system must strip PII before storage. Feedback goes to a separate `admin_feedback` table in Tier 3, not into Tier 1.
> 3. Pipeline usage metrics must be aggregated (daily/weekly totals). Per-message cost breakdowns would reveal conversation frequency, which is behavioral metadata.
> 4. **Option A is rejected.** Data transiting to Retool's servers (even with SOC 2) is a GDPR Article 28 processor risk we don't need.
> 5. Differential privacy: Any query returning fewer than 5 users per segment must be suppressed (k-anonymity threshold)."

**@vp-rnd** (Sentiment Pipeline Optimization, Model Evaluation):
> "The backoffice should surface LLM cost-per-inference broken down by agent, not by user. I need: average tokens per Safety Guardian call vs. Communication Coach call, p50/p95 latency per agent, and model utilization ratios (how often we route to GPT-4.1 vs GPT-4.1-mini). This data exists in App Insights `customEvents` — Option E's KQL workbooks are the fastest path. For the React dashboard (Option D), we'd need an API bridge to the App Insights query REST endpoint."

### OPS POD

**@chief-executive-officer** (Align ops with mission, Protect 3-Tier Model):
> "The backoffice exists to help me, as the human founder, make decisions. It is NOT a product feature — it is an internal tool. Therefore: minimize engineering distraction from the core product. The hybrid approach (E for analytics + D for management) lets us ship E in days and build D incrementally. **Protect the 3-Tier Model above all.** I'd rather have a basic workbook I can trust than a beautiful dashboard that creates a privacy attack surface."

**@chief-product-officer** (User Stories with emotional safety, Acceptance Criteria):
> "User stories for the backoffice:
> - *As the founder, I want to see total registered users and weekly growth so that I can report to investors.*
> - *As the founder, I want to see free vs. paying user counts so that I can track conversion rate.*
> - *As the founder, I want to see which relationship phase each couple is in (aggregated) so that I can validate product-market fit across stages.*
> - *As the founder, I want to see solo vs. linked couple counts so that I can measure partner invite success.*
> - *As the founder, I want to read anonymized user feedback so that I can prioritize features.*
> - *As the founder, I want to see daily LLM costs and safety halt counts so that I can manage burn rate.*
> 
> **Acceptance Criteria for ALL stories:** No view, endpoint, or query may reveal: (a) raw Tier 1 messages, (b) individual user identities paired with behavioral data, (c) clinical Tier 2 profiles."

**@chief-revenue-officer** (Asymmetric Funnel Design, Freemium Mapping, Value Assurance):
> "The backoffice must give me real-time visibility into the acquisition funnel: Discovery → Registration → Solo Usage → Partner Invite Sent → Partner Joined → First Mediation → Subscription → Renewal. Each step's conversion rate is critical. Option E can track funnel events via App Insights custom events. Option D can visualize this beautifully with a funnel chart. Both work; D is better for quick visual reads. I also need: revenue per phase (are crisis-stage couples converting at higher rates?)."

**@chief-finance-officer** (Compute Optimization, Margin Protection, Burn Rate):
> "I need cost dashboards NOW, not in 2 weeks. Option E gives me this today — KQL queries against App Insights for token usage per agent, daily API calls, and projected monthly Azure spend. The `customEvents` from our LLM Gateway already log `tokensUsed.total` and `model` per request. **Ship E this week for financial visibility. Build D over the next sprint for operational management.** Also: set up Azure Cost Management alerts at 80% and 100% of the $50/month budget — oh wait, we already have those."

**@chief-marketing-officer** (Stage-Specific Messaging, Privacy differentiator):
> "The backoffice analytics can help me validate messaging effectiveness. If I see that 70% of users are in the 'dating' phase, my GTM should target dating-stage language. If 'crisis' phase users have 3x higher retention, that's a messaging insight. I need phase distribution data and user acquisition source tracking. Option E handles this if we emit custom events for acquisition channel. Option D makes it visual and shareable for investor updates."

---

## 3. TOP 2 Recommended Approaches

### 🥇 Recommendation #1: HYBRID — Azure-Native Analytics (E) + shadcn/ui Admin Panel (D)

**Ship in two phases:**

**Phase 1 (This week, ~2-3 days): Azure Monitor Workbooks**
- Zero new infrastructure
- KQL queries against existing App Insights + Log Analytics
- Covers: pipeline metrics, LLM costs, safety halt rates, latency percentiles, error rates
- Accessible only to the founder via Azure Portal RBAC

**Phase 2 (Next sprint, ~5-8 days): shadcn/ui Admin Panel**
- React + TypeScript + Vite + shadcn/ui
- New `/api/v1/admin/*` routes on existing Express backend
- Queries ONLY Tier 3 PostgreSQL + App Insights query REST API
- Deployed as Azure Static Web App or as a route on existing Container App
- Covers: user management views, feedback collection, funnel visualization, phase distribution

**Why this hybrid wins:**
- **@data-privacy-officer:** "E is mathematically safe — aggregated KQL queries cannot leak Tier 1/2. D is safe IF the API layer is the sole gateway to data."
- **@chief-finance-officer:** "E is free and instant. D costs only dev time, no new Azure resources."
- **@cloud-architect:** "E adds zero attack surface. D reuses existing Container App infra with a separate auth middleware."
- **@chief-executive-officer:** "Ship E now for investor conversations. Build D iteratively without blocking core product work."

### 🥈 Recommendation #2: Refine.dev React Admin (C) — If full customization is needed faster

**Justification:** If the founder decides the backoffice needs to be a full admin tool with CRUD operations (e.g., manually pausing mediation rooms, adjusting user tiers, modifying settings), then Refine.dev provides a more structured admin framework than raw shadcn/ui.

**Trade-off vs. D:** Refine.dev is slightly more opinionated (admin-specific layouts, built-in list/show/edit pages). shadcn/ui is more flexible but requires more manual work. Since the backoffice is internal-only and needs standard CRUD patterns, Refine.dev could actually be faster for those specific views.

**Still requires:** The same dedicated admin API routes, same Tier 3-only access constraint, same E2E canary tests.

---

## 4. Backoffice Pages/Views (for Recommended Approach — Hybrid E + D)

### Phase 1: Azure Monitor Workbooks (KQL)

| Workbook | KQL Data Source | Visualizations |
|---|---|---|
| **Pipeline Health** | `customEvents` where `name == 'pipeline_run'` | Daily mediation count, p50/p95 latency, success/failure ratio |
| **LLM Cost Tracker** | `customEvents` where `name == 'llm_call'` | Tokens per agent (bar chart), daily cost estimate (line chart), model split (pie chart) |
| **Safety Dashboard** | `customEvents` where `name == 'safety_check'` | Safety halt count by severity, daily trend, false positive rate |
| **Error Analytics** | `exceptions` + `requests` | Error rate, top error types, response time heatmap |

### Phase 2: shadcn/ui Admin Panel Pages

| Page | Data Source | Components | DPO Constraint |
|---|---|---|---|
| **Dashboard (Home)** | Tier 3 DB + App Insights REST API | KPI cards: total users, MAU, DAU, paying users, free users. Growth sparkline (7d/30d). | User counts only. No names shown on this page. |
| **User Directory** | Tier 3 DB: `room_members` → count distinct `user_id` | Data table: user ID (UUID only), registration date, last active, subscription tier (free/premium/premium+). Search by UUID. | **No email, no display_name, no behavioral data alongside identity.** The DPO requires k-anonymity: UUID display only. If the founder needs to contact a user, go through the auth provider (Azure AD B2C) separately. |
| **Couple Pairing Status** | Tier 3 DB: `rooms` + `room_members` | Aggregated view: X solo users, Y linked couples, Z rooms active. Pie chart. Room status breakdown (active/paused/archived). | No user-to-room mapping shown individually. Aggregated counts only. |
| **Relationship Phase Distribution** | Tier 3 DB: custom `user_metadata` table (to be created) OR App Insights custom events | Bar chart: users per phase (dating/commitment/crisis/separation/post-divorce). Trend over time. | Phase data stored in Tier 3 as aggregated segment counts, not individual profiles. |
| **Subscription Analytics** | Tier 3 DB: `user_subscriptions` table (to be created) + Stripe/RevenueCat webhook data | Free vs. Premium vs. Premium+ breakdown. Conversion funnel: Registration → Solo → Linked → Subscribed. MRR/ARR projection. Churn rate. | Financial data only. No linking subscription status to behavioral patterns. |
| **Pipeline Metrics** | App Insights REST API (KQL bridge) | Daily message volume (line chart). Average agents invoked per message. LLM cost per day (stacked by agent). Safety halts per day. | Aggregated daily totals. No per-user message counts. |
| **User Feedback** | Tier 3 DB: new `admin_feedback` table | Feedback list with date, category (bug/feature/praise), and PII-stripped content. Status (new/reviewed/actioned). Admin can tag and respond. | Feedback stored in Tier 3 only. PII stripped on submission (no names, no emails in content). Separate from Tier 1 journals. |
| **System Health** | App Insights + Container App metrics | Container App replica count, CPU/memory, Redis connections, WebSocket active connections, DB connection pool usage. | Operational data only. Safe by default. |

### Admin API Routes (Express)

```
GET  /api/v1/admin/stats/overview     → { totalUsers, mau, dau, freeUsers, payingUsers }
GET  /api/v1/admin/stats/phases       → { dating: N, commitment: N, crisis: N, ... }
GET  /api/v1/admin/stats/pairing      → { soloUsers: N, linkedCouples: N, activeRooms: N }
GET  /api/v1/admin/stats/subscriptions → { free: N, premium: N, premiumPlus: N, mrr: N }
GET  /api/v1/admin/stats/pipeline     → { dailyMessages: N, avgLatencyMs: N, safetyHalts: N, llmCostToday: N }
GET  /api/v1/admin/users              → Paginated user list (UUID, created_at, tier, last_active) — NO email/name
GET  /api/v1/admin/feedback           → Paginated feedback list
POST /api/v1/admin/feedback           → Submit feedback (from in-app prompt, PII-stripped)
PATCH /api/v1/admin/feedback/:id      → Update feedback status/tags
GET  /api/v1/admin/health             → System health metrics
```

All routes require `admin-auth` middleware (separate from user auth — Azure AD app role `Admin`).

---

## 5. Required New Agent Skills

### Existing Agents Requiring New Skills

| Agent | New Skill Name | Purpose | Skill Description |
|---|---|---|---|
| **@backend-developer** | `backoffice-admin-api` | Build the `/api/v1/admin/*` route group | "Generate Express routes that query ONLY the Tier 3 PostgreSQL database and App Insights REST API. Include admin-only auth middleware (Azure AD `Admin` app role). Every response MUST be validated against a DPO-approved allowlist of fields — no `raw_content`, no `journal_entries`, no `safety_reasoning` fields permitted in admin API responses. Include Zod schemas for all admin endpoints." |
| **@backend-developer** | `app-insights-query-bridge` | Query App Insights from Express | "Implement a server-side bridge to the Azure Monitor Query REST API using `@azure/monitor-query` SDK with DefaultAzureCredential. Execute KQL queries for pipeline metrics, LLM cost aggregation, and safety halt counts. Cache results in Redis (5-min TTL) to avoid hitting App Insights rate limits. Return JSON-serialized query results." |
| **@cloud-architect** | `backoffice-infra` | Deploy and isolate backoffice infrastructure | "Generate Terraform/Bicep for: (1) Azure Static Web App for the admin frontend, (2) NSG rule explicitly DENY-ing the app-subnet → postgres-subnet path for any request originating from the admin route context, (3) Azure AD App Registration with `Admin` app role for backoffice auth, (4) Managed identity permissions: `Monitoring Reader` on the Log Analytics workspace for App Insights queries. No new subnets, no new Container Apps — reuse existing infra." |
| **@ui-ux-expert** | `admin-dashboard-design` | Design system for internal admin tools | "Define the Relio admin design system using shadcn/ui: layout (sidebar navigation + main content area), color palette (distinguish from user-facing app — use neutral grays, not the teal/warm palette of the main app), data table patterns, chart standardization (Recharts for consistency), and a persistent banner: 'ADMIN VIEW — Tier 3 Data Only — No Private Messages Visible'. All data tables must suppress rows when the count < 5 (k-anonymity)." |
| **@fullstack-qa** | `backoffice-privacy-tests` | E2E privacy leak tests for admin panel | "Generate a Playwright test suite that: (1) Injects canary strings (`QA-CANARY-TIER1-{uuid}`) into the Tier 1 database, (2) Queries every `/api/v1/admin/*` endpoint, (3) Asserts the canary string NEVER appears in any admin API response, (4) Asserts no endpoint returns fields named `raw_content`, `journal_entries`, `safety_reasoning`, or `email`, (5) Runs in CI on every PR touching `src/server/admin/`. Fail-fast: ANY match = blocked deployment." |
| **@github-architect** | `backoffice-ci-cd` | Dedicated backoffice deployment pipeline | "Generate `backoffice-cd.yml` GitHub Actions workflow: (1) Trigger on changes to `backend/src/server/admin/**` or `backoffice/**`, (2) `contents: read` permissions only, (3) CodeQL scan with custom query blocking any SQL referencing `tier1_messages` or `safety_audit_log`, (4) Build and deploy admin SPA to Azure Static Web Apps, (5) Smoke test: `curl /api/v1/admin/health` must return 200, (6) Draft PR review gate — no direct merge to main." |
| **@data-privacy-officer** | `admin-data-governance` | Audit and enforce backoffice data boundaries | "Define the formal data access policy for the backoffice admin panel: (1) Allowlist of Tier 3 tables/columns accessible, (2) Blocklist of Tier 1/2 tables/columns that must NEVER appear in admin SQL queries, (3) k-anonymity threshold (minimum 5 users per segment before displaying), (4) Feedback PII stripping regex patterns, (5) Audit log schema for admin actions (who viewed what, when). This skill produces a machine-readable JSON policy file consumed by the backend-developer's admin API validation middleware." |
| **@chief-finance-officer** | `admin-cost-dashboard` | KQL queries for financial monitoring | "Generate KQL workbook templates for Azure Monitor that visualize: (1) Daily LLM token spend by model and agent, (2) Projected monthly Azure bill (extrapolate from daily run rate), (3) Cost per active user (total LLM spend / DAU), (4) Token budget utilization (% of daily 50K per-user budget consumed), (5) Cost comparison: actual vs. blended CPI target ($0.012). These workbooks are the Phase 1 deliverable — ship before the React admin panel." |
| **@chief-product-officer** | `admin-user-stories` | Structured backlog for backoffice | "Generate the full backoffice backlog as GitHub Issues with acceptance criteria. Every issue must specify: (1) Which Tier 3 tables are queried, (2) Which fields are returned, (3) DPO sign-off requirement (label: `dpo-review`), (4) QA canary test requirement. Issues should be tagged `backoffice` and assigned to the appropriate Tech Pod agent." |

---

## 6. New Database Objects Required (Tier 3 Only)

```sql
-- Backoffice: User metadata (relationship phase, subscription tier)
-- Stored in Tier 3 shared database — NOT in Tier 1
-- Phase is set by the Orchestrator agent during routing, stored as aggregated state
CREATE TABLE user_metadata (
    user_id UUID PRIMARY KEY,               -- No FK to Tier 1 users table
    relationship_phase TEXT CHECK (relationship_phase IN (
        'dating', 'commitment', 'crisis', 'separation', 'post-divorce', 'unknown'
    )) DEFAULT 'unknown',
    subscription_tier TEXT CHECK (subscription_tier IN (
        'free', 'premium', 'premium_plus'
    )) DEFAULT 'free',
    is_linked BOOLEAN DEFAULT false,         -- Has a partner joined their room?
    registered_at TIMESTAMPTZ DEFAULT now(),
    last_active_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Backoffice: Anonymized user feedback
CREATE TABLE admin_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT CHECK (category IN ('bug', 'feature', 'praise', 'complaint', 'other')) DEFAULT 'other',
    content TEXT NOT NULL,                   -- PII-stripped on submission
    status TEXT CHECK (status IN ('new', 'reviewed', 'actioned', 'dismissed')) DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Backoffice: Admin action audit log
CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT NOT NULL,                  -- Azure AD object ID of the admin
    action TEXT NOT NULL,                    -- 'view_users', 'view_feedback', 'update_feedback', etc.
    resource_type TEXT NOT NULL,             -- 'user_list', 'feedback', 'stats', etc.
    metadata JSONB DEFAULT '{}',             -- Query params, filters used (not data returned)
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_admin_audit ON admin_audit_log(admin_id, created_at DESC);
```

---

## 7. Implementation Timeline

| Week | Milestone | Owner | Deliverables |
|---|---|---|---|
| **Week 1** | Phase 1: Azure Monitor Workbooks | @cloud-architect, @chief-finance-officer | 4 KQL workbooks deployed (Pipeline Health, LLM Costs, Safety, Errors). Founder has Azure Portal access. |
| **Week 1** | Tier 3 schema migration | @backend-developer | `user_metadata`, `admin_feedback`, `admin_audit_log` tables created. |
| **Week 2** | Admin API routes | @backend-developer | `/api/v1/admin/*` routes live behind admin-auth middleware. Zod validation. DPO field allowlist. |
| **Week 2** | Privacy E2E tests | @fullstack-qa | Canary injection test suite in CI. Zero Tier 1 leaks confirmed. |
| **Week 3** | shadcn/ui admin panel | @ui-ux-expert, @backend-developer | Dashboard, User Directory, Pairing, Phase Distribution, Feedback pages. |
| **Week 3** | CI/CD pipeline | @github-architect | `backoffice-cd.yml` with CodeQL, canary tests, draft PR gate. |
| **Week 4** | DPO audit + go-live | @data-privacy-officer, @fullstack-qa | Final privacy audit. k-anonymity verified. Audit log functioning. Production deploy. |

---

## 8. Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Admin API accidentally queries Tier 1 DB | Low | **Critical** — 3-Tier violation | DB connection config: admin routes use a separate connection pool with credentials that ONLY have access to Tier 3 database. No Tier 1 connection string in admin code. | @cloud-architect |
| User re-identification via backoffice metadata | Medium | High | k-anonymity threshold (suppress < 5 users), no email/name in admin API responses, UUID-only references | @data-privacy-officer |
| Backoffice auth bypass | Low | High | Azure AD `Admin` app role, separate middleware, JWT verification against IdP JWKS | @backend-developer |
| Scope creep delays core product | Medium | Medium | Phase 1 (workbooks) ships in 2 days with zero code. Phase 2 is timeboxed to 1 sprint. | @chief-executive-officer |
| KQL queries hit App Insights rate limits | Low | Low | Redis caching (5-min TTL) on admin stats endpoints | @backend-developer |

---

## 9. Final Consensus

**All 13 agents APPROVE the Hybrid (E + D) approach:**

- **Tech Pod unanimous:** E for immediate operational visibility, D for interactive management. Both maintainable within existing infra.
- **Ops Pod unanimous:** E enables investor-ready metrics this week. D gives the founder a branded, trustworthy admin tool within a sprint.
- **DPO sign-off:** Conditional on (1) Tier 3-only DB connections, (2) k-anonymity enforcement, (3) canary privacy tests in CI, (4) admin audit logging.

**Rejected:** Option A (data leaves VNet), Option B (uncontrolled schema introspection risks Tier 1 exposure).

**Deferred:** Option C (Refine.dev) — revisit if the backoffice grows to require multi-admin CRUD workflows with role-based access beyond what shadcn/ui provides.

---

*Document generated by joint consultation. All agent mandates sourced from `Relio/.github/agents/*.agent.md`.*
