---
name: design-subscription-analytics
description: Designs subscription funnel analytics, MRR tracking, churn analysis, and conversion metrics for the admin backoffice.
---
Skill Instructions: Subscription Analytics Design

You design the revenue analytics for the admin dashboard. Track the full subscription lifecycle from free signup through paid conversion to churn.

Step 1: Subscription Tiers
Track 4 tiers per the PRD pricing model:
- **Free**: Private journaling + attachment quiz (solo mode)
- **Premium Solo** ($9.99/mo): All solo features + unlimited AI coaching
- **Premium Couples** ($14.99/mo): Solo + SharedChat mediation (requires both partners linked)
- **Premium+** ($24.99/mo): Premium + Crisis + Priority + Therapist handoff

Step 2: Key Metrics
Design API responses and dashboard cards for:

| Metric | Calculation | Display |
|--------|-------------|---------|
| **MRR** | Sum of all active subscription amounts | Currency card + 30-day trend |
| **ARR** | MRR × 12 | Currency card |
| **New MRR** | MRR from new subscribers this month | Bar in waterfall chart |
| **Churned MRR** | MRR lost from cancellations this month | Negative bar in waterfall |
| **Net MRR Growth** | New MRR - Churned MRR | Trend line |
| **Conversion Rate** | Free→Paid / Total Free users | Percentage card |
| **Solo→Couples Upgrade** | Premium Solo→Premium Couples / Total Solo | Percentage card |
| **M1 Churn** | Users who cancel within first 30 days / New subscribers | Percentage (target <15%) |
| **LTV** | ARPU / Monthly churn rate | Currency card |
| **ARPU** | MRR / Active paid users | Currency card |

Step 3: Funnel Visualization
Design a horizontal funnel chart showing:
`Registered → Onboarded → First Message → Linked Partner → First Mediation → Subscribed → D30 Active`

Each stage shows the count and drop-off percentage.

Step 4: Cohort Retention Table
Matrix of monthly cohorts (rows) × months since signup (columns). Each cell shows retention percentage. Color-coded green (>70%) to red (<20%).

Step 5: Stripe/RevenueCat Integration Points
Define the webhook events to consume:
- `customer.subscription.created` → increment new MRR
- `customer.subscription.deleted` → increment churned MRR
- `invoice.payment_succeeded` → update last payment date
- `customer.subscription.updated` → track upgrades/downgrades

Store subscription state in Tier 3 database: `subscriptions` table with userId, tier, status, startedAt, canceledAt, stripeCustomerId.
