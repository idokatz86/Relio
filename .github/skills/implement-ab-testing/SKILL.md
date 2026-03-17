---
name: implement-ab-testing
description: Implements deterministic hash-based A/B test infrastructure for onboarding and coach tone experiments, with server-side assignment and admin experiment dashboard.
agents: [backend-developer, cro, scrum-master]
---
# Skill: Implement A/B Test Infrastructure

You implement lightweight server-side A/B testing with deterministic assignment.

## Step 1: Experiment Config
Define experiments in `backend/src/server/ab-test-router.ts`:
```typescript
interface Experiment {
  id: string;           // e.g., 'onboarding_flow'
  name: string;
  variants: string[];   // e.g., ['control', 'variant_a']
  weights: number[];    // Must sum to 1.0
  active: boolean;
}
```

## Step 2: Deterministic Assignment
- Hash `sha256(userId:experimentId)` → bucket [0, 1)
- Map bucket to variant using cumulative weights
- Same userId + experimentId ALWAYS returns same variant (stable)
- Store assignments in memory (production: Redis/DB)

## Step 3: API Endpoints
- GET `/api/v1/ab/assignments` — returns all active experiment variants for current user
- GET `/api/v1/ab/experiments` — admin-only: list all experiments with assignment counts

## Step 4: Client Integration
- On app start, fetch `/api/v1/ab/assignments`
- Store in React context for conditional rendering
- Example: `if (variant === 'variant_a') { showNewOnboarding() }`

## Constraints
- Assignment must be deterministic (no randomness)
- Admin endpoints require admin role
- Experiments can be toggled active/inactive without code deploy
