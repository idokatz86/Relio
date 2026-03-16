---
name: route-onboarding-pipeline
description: Routes new users through the onboarding pipeline, selecting phase agents based on relationship stage and establishing baseline profiles.
agents: [orchestrator-agent, individual-profiler, safety-guardian]
---
# Skill: Route Onboarding Pipeline

You configure how the Orchestrator handles newly registered users through the onboarding-to-first-session pipeline.

## Step 1: Stage-to-Agent Routing
When a user completes onboarding with a relationship stage selection, route their first session to the correct phase agent:

| User Selection | Internal Stage | Phase Agent | Fallback |
|---------------|---------------|-------------|----------|
| "We're just getting started" | `dating` | `phase-dating` | Default if skipped |
| "We're building something real" | `commitment` | `phase-commitment` | — |
| "We're in a rough patch" | `crisis` | `phase-crisis` | — |
| "We're navigating a transition" | `separation` | `phase-separation` | — |
| "We're co-parenting" | `post_divorce` | `phase-post-divorce` | — |
| "I'd rather not say" | `dating` | `phase-dating` | Adaptive re-route after session 1 |

- If user selects "I'd rather not say", default to `phase-dating` but flag the session for adaptive routing
- After the first session, the Orchestrator re-evaluates based on conversation content and may re-route to a more appropriate phase agent

## Step 2: Solo User Pipeline
When a user is in `SOLO` state (no partner linked):
- Route ALL messages to 1-on-1 AI coaching mode
- Available agents: Communication Coach (1-on-1 mode), Individual Profiler, Psychoeducation Agent
- Safety Guardian monitors all input (same as coupled mode)
- Orchestrator skips Tier 3 translation (no partner to send to)
- Instead, provide direct coaching feedback: validation, reframing, psychoeducation

## Step 3: Baseline Profile Establishment
During the user's first session (or from attachment quiz results):
- Individual Profiler creates initial attachment profile
- Map quiz answers to attachment dimensions:
  - Anxious (protest behaviors, reassurance-seeking)
  - Avoidant (deactivation, emotional withdrawal)
  - Secure (balanced, flexible response)
  - Disorganized (approach-avoidance cycling)
- Store baseline in Cosmos DB `attachment_profiles` container
- This baseline informs ALL future agent interactions

## Step 4: Couple Formation Trigger
When two users become coupled (invite accepted):
- Create shared room in WebSocket server
- Orchestrator transitions from solo to mediation mode
- First couple session: both users receive welcome message
- Orchestrator runs parallel Safety Guardian check on both users' history
- Phase agent selected based on Partner A's stage (Partner B's stage is secondary input)
- If stages conflict (A=dating, B=crisis): use the MORE severe stage (crisis)

## Step 5: Safety Integration During Onboarding
- Safety Guardian is ACTIVE from the first message (no delay, no warmup)
- Passive language monitoring: no explicit DV screening questions during onboarding
- If abuse markers detected in first session: Safety Guardian escalates immediately
- Emergency resources visible on all onboarding screens (footer, non-intrusive)
- At-risk user's Tier 1 context flagged for heightened monitoring

<thought_process_template>
Before routing any new user:
1. What stage did they select? If skipped, default to dating with adaptive flag.
2. Are they solo or coupled? Solo → coaching mode. Coupled → mediation mode.
3. Do quiz results exist? If yes, seed the Individual Profiler baseline.
4. Does any early conversation content suggest a different stage than selected?
5. Is the Safety Guardian detecting any concerning patterns?
6. If couple with mismatched stages, which is more severe?
</thought_process_template>

## Constraints
- NEVER skip Safety Guardian monitoring for new users (even during onboarding)
- NEVER reveal Partner A's stage selection to Partner B
- NEVER use clinical labels in user-facing outputs ("crisis" → "rough patch")
- NEVER pressurize solo users to invite a partner (solo is a valid permanent state)
- Always allow stage re-selection from Settings without losing conversation history
