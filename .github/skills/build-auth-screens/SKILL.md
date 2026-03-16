---
name: build-auth-screens
description: Builds React Native authentication screens (Login, Age Verify, Consent, Onboarding, Partner Invite) with biometric gate enforcement.
agents: [native-mobile-developer, ui-ux-expert, mobile-qa]
---
# Skill: Build Auth Screens (React Native + Expo)

You build all authentication, onboarding, and invitation screens for the Relio mobile app.

## Step 1: LoginScreen.tsx
- Three auth options in priority order: Apple Sign In, Google Sign In, Email magic link
- Integrate with Azure AD B2C via `expo-auth-session` (PKCE flow)
- Apple Sign In is MANDATORY (App Store guideline 4.8)
- Follow Relio earth-tone design system: warm sand background, sage green primary buttons
- Loading states during OAuth redirect. Error handling with user-friendly messages
- Store tokens (access + refresh) in `expo-secure-store` (NEVER AsyncStorage)
- Token refresh logic: auto-refresh when < 5min remaining before expiry

## Step 2: AgeVerifyScreen.tsx
- Date-of-birth picker (month/day/year)
- Under 18: friendly block message "Relio is for adults 18+. Come back when you're 18!"
- Under 13: COPPA hard block — zero data collected, no account created
- If Apple/Google IdP returns age claim, use that (more authoritative)
- Accessibility: voice-over labels for all inputs

## Step 3: ConsentScreen.tsx
Three sequential consent steps (all required before proceeding):
1. **Not Therapy** — "Relio is NOT therapy, counseling, or a substitute for professional mental health care." [Checkbox]
2. **Privacy Model** — 3-Tier explanation with interactive before/after demo. "Your raw words are NEVER shown to your partner." [Checkbox]
3. **AI Processing** — GDPR Art. 22 consent. "Relio uses AI to detect patterns and rephrase your words." [Checkbox]
- Each checkbox calls `POST /api/v1/consent` with type + version
- Link to full ToS and Privacy Policy at bottom of each screen
- All three must be checked to proceed

## Step 4: OnboardingScreen.tsx — Stage Selection
- Five card-based options (NOT radio buttons): Dating, Commitment, Crisis, Separation, Co-parenting
- Each card: 1 emoji + 1 user-friendly label + 1 sentence description
- NO clinical language: "We're in a rough patch" not "Crisis phase"
- "I'd rather not say" option → defaults to `dating` agent
- Selection changeable anytime from Settings
- No option pre-selected (avoid anchoring bias)

## Step 5: InvitePartnerScreen.tsx
- Display 6-char invite code in large format with hyphen: `RLO-K7M`
- Copy-to-clipboard button
- QR code display (fetched from `/api/v1/qr/:code`)
- Share button using React Native's native share sheet (deep link)
- "Your partner hasn't joined yet" status with re-invite button
- Timer showing expiry countdown

## Step 6: AcceptInviteScreen.tsx
- Auto-opened via deep link (`relio.app/invite/{code}`)
- Shows Partner A's first name only
- Accept / Decline buttons
- On accept: celebration animation → navigate to SharedChatScreen
- On decline: silent — no notification to Partner A. Generic "link expired" if blocked.

## Step 7: Biometric Gate
- Use `expo-local-authentication` for FaceID/TouchID/fingerprint
- Enforce on every app re-open (configurable: every time / after 5min / after 1hr)
- Fallback to app PIN if biometric unavailable
- Settings toggle to configure timing
- NEVER skip biometric in production builds

## Constraints
- NEVER store sensitive data in AsyncStorage (use expo-secure-store)
- NEVER show Partner A's full profile to Partner B during invitation
- NEVER auto-select a relationship stage
- All screens must support dark mode and accessibility (VoiceOver/TalkBack)
- Emergency resource footer visible on every onboarding screen
