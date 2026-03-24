---
name: design-admin-dashboard
description: Designs the backoffice admin dashboard UI using shadcn/ui + React, with privacy-aware data visualization and the Relio warm earth-tone design language.
---
Skill Instructions: Admin Dashboard UI Design

You are designing the internal admin dashboard. It must visually distinguish itself from the user-facing app — admin sees AGGREGATED data, never raw Tier 1 content.

Step 1: Technology Stack
Use React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts for charts. Deploy as a separate route or subdomain on the same Container App (e.g., `/admin` path or `admin.relio.app`).

Step 2: Page Layout
Design 8 admin pages:

1. **Dashboard (Home)** — KPI cards: Total Users, Active Couples, Solo Users, Messages Today, MRR, Safety Halts. Trend sparklines for 7-day and 30-day.

2. **User Directory** — Searchable table with columns: Display Name, Signup Date, Subscription Tier, Phase, Coupled/Solo, Last Active. Click to view (anonymized) user detail card. NO raw messages visible.

3. **Couple Pairing** — Visual grid showing paired couples (connected dots) and solo users (single dots). Filter by phase. Show invite-pending status.

4. **Phase Distribution** — Pie chart + bar chart showing how many couples are in each relationship phase (Dating, Married, Pre-Divorced, Divorced). k-anonymity: suppress groups < 5.

5. **Subscription Analytics** — Free/Premium/Premium+ funnel chart. MRR trend line. Churn rate by cohort. Conversion rate (free→paid). LTV estimate.

6. **Pipeline Metrics** — Real-time: messages/hour, avg pipeline latency (p50/p95/p99), LLM token usage by agent, cost per message trend. Historical: daily/weekly/monthly.

7. **Feedback Center** — Sortable table of user feedback: rating (1-5 stars), timestamp, comment text, phase at time of feedback. Average rating trend. Sentiment word cloud.

8. **System Health** — Container App replicas, Redis connected clients, PostgreSQL connections, circuit breaker state, error rate. Link to Azure Monitor for deep-dive.

Step 3: Design Language
- Use the Relio earth-tone palette (sage `#6B705C`, warm sand `#E8DED5`, terracotta `#B08968`) for the admin theme
- Admin layout: sidebar navigation + top header with admin user info
- Cards use `shadcn/ui Card` with subtle shadows
- Charts use Recharts with Relio color palette
- Responsive: works on laptop (primary) and tablet

Step 4: Privacy Indicators
Every page must show a "Data Scope: Tier 3 Only" badge in the top-right corner, reinforcing to the admin that they are viewing anonymized/shared data. If any view could theoretically surface individual-level data for < 5 users, show a "k-anonymity applied" tooltip.

Step 5: Access Control
- Admin dashboard requires login with `role: admin` JWT
- Show "Access denied" page for non-admin users
- Session timeout: 30 minutes of inactivity
- No "export all data" button — intentionally omitted to prevent mass data extraction
