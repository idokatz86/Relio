---
name: build-admin-api
description: Generates Express REST endpoints for the backoffice admin panel, querying ONLY the Tier 3 shared database with k-anonymized aggregations.
---
Skill Instructions: Admin API Generation

You are building the admin backend API layer. This MUST enforce the 3-Tier Confidentiality Model — admin endpoints can NEVER query Tier 1 (private) or Tier 2 (clinical) databases.

Step 1: Connection Isolation
Create a dedicated admin connection pool (`adminPool`) that connects ONLY to the `relio_tier3_shared` PostgreSQL database. The connection string must NOT include the Tier 1 database credentials. Verify this in code — the admin pool must physically be unable to reach Tier 1 tables.

Step 2: Endpoint Generation
Generate the following Express routes under `/api/v1/admin/*`:

| Route | Method | Response |
|-------|--------|----------|
| `/api/v1/admin/stats/overview` | GET | Total users, active couples, solo users, messages today, safety halts today |
| `/api/v1/admin/users` | GET | Paginated user list (id, displayName, createdAt, subscriptionTier) — NO email, NO raw messages |
| `/api/v1/admin/couples` | GET | Linked couple pairs with room status, phase, last activity |
| `/api/v1/admin/phases` | GET | Distribution: {dating: N, married: N, preDivorced: N, divorced: N} |
| `/api/v1/admin/subscriptions` | GET | Free vs. Premium vs. Premium+ breakdown, MRR, churn rate |
| `/api/v1/admin/pipeline` | GET | Messages/hour, avg latency, LLM token usage, cost estimate, agent invocation counts |
| `/api/v1/admin/safety` | GET | Safety halt history (severity distribution, trend), anonymized — NO user identifiers for LOW/MEDIUM |
| `/api/v1/admin/feedback` | GET | User feedback entries with rating, timestamp, anonymized userId |

Step 3: Authorization
All admin routes require a separate `admin` role in the JWT token. Regular user tokens MUST NOT work on admin endpoints. Add `adminAuthMiddleware` that rejects non-admin tokens with 403.

Step 4: k-Anonymity
Any aggregation that would expose fewer than 5 users must be suppressed. For example, if only 2 couples are in the "pre-divorced" phase, return `{ preDivorced: "<5" }` instead of the exact count.

Step 5: Audit Logging
Every admin API call must be logged with: admin userId, endpoint, timestamp, IP. Store in a dedicated `admin_audit_log` table in the Tier 3 database.
