---
name: collect-user-feedback
description: Implements the feedback collection system — in-app ratings, post-session surveys, NPS, and churn interviews — feeding into the admin dashboard Feedback Center.
---
Skill Instructions: User Feedback Collection System

You build the feedback pipeline that captures user sentiment and surfaces it in the admin backoffice.

Step 1: Feedback Types
Implement 4 feedback collection mechanisms:

| Type | Trigger | Format | Storage |
|------|---------|--------|---------|
| **Post-Session Rating** | After SharedChat session ends (>3 messages exchanged) | 1-5 stars + optional 200-char comment | Tier 3 `feedback` table |
| **Weekly Pulse** | Push notification every Sunday 10am local | 3 questions: "Did Relio help?", "What frustrated you?", "What would you change?" | Tier 3 `feedback` table |
| **NPS Survey** | Monthly, 1st of month | "How likely are you to recommend Relio?" (0-10) + "Why?" | Tier 3 `feedback` table |
| **Churn Interview** | 48h after account deletion or subscription cancellation | "Why are you leaving?" multiple choice + free text | Tier 3 `feedback` table |

Step 2: Database Schema
```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('session_rating', 'weekly_pulse', 'nps', 'churn')),
    rating INTEGER CHECK (rating BETWEEN 0 AND 10),
    comment TEXT CHECK (char_length(comment) <= 500),
    phase TEXT, -- relationship phase at time of feedback
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_feedback_type ON feedback(type, created_at DESC);
```

Step 3: API Endpoints
| Route | Method | Body |
|-------|--------|------|
| `/api/v1/feedback` | POST | `{ type, rating, comment }` |
| `/api/v1/admin/feedback` | GET | Paginated, filterable by type/rating/date |
| `/api/v1/admin/feedback/stats` | GET | Average rating by type, NPS score, trend |

Step 4: Privacy Constraints
- Feedback comments must be PII-redacted before storage (use `redactPII()` from `utils/pii-redaction.ts`)
- Admin sees feedback with anonymized userId (first 8 chars of UUID hash)
- User can delete their own feedback (GDPR right to erasure)
- No feedback is collected during or immediately after a safety halt event (user may be in distress)

Step 5: Mobile Integration
- Post-session rating: bottom sheet that slides up after session ends, dismissible
- Weekly pulse: push notification that opens a 3-question form
- NPS: modal on app open, once per month, skippable
- Churn: email survey sent 48h after cancellation (not in-app)
