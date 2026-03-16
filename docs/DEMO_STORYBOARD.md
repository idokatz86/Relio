# Relio MVP Demo — Complete Storyboard

**Version:** 1.0 | **Date:** March 16, 2026
**Total Runtime:** ~2:40 (seven scenes, five clips)
**Format:** Android emulator screen recording via `adb shell screenrecord`
**Post-production:** Splice clips in sequence; add title cards + captions in CapCut/iMovie

---

## Recording Strategy

| Clip # | Scenes | Duration | File |
|--------|--------|----------|------|
| 1 | Scenes 1–2 (Hook + Onboarding) | ~35s | `clip1_hook_onboard.mp4` |
| 2 | Scene 3 (Warm check-in) | ~25s | `clip2_warm.mp4` |
| 3 | Scenes 4–5 (Escalation + Hostile) | ~50s | `clip3_conflict.mp4` |
| 4 | Scene 6 (Private Journal) | ~30s | `clip4_journal.mp4` |
| 5 | Scene 7 (Safety HALT) | ~20s | `clip5_safety.mp4` |

**Pre-recording checklist:**
- Backend running on port 3000 (`npx tsx src/server/app.ts`)
- Android emulator booted with Relio loaded
- Clear all previous journal data (`Settings → Delete All My Data`)
- Complete onboarding once so profile exists, then restart demo flow

---

## Scene 1: THE HOOK — "What couples actually text"

| Field | Detail |
|-------|--------|
| **Scene #** | 1 of 7 |
| **Duration** | 8 seconds |
| **Screen** | Title card (add in post) → SharedChatScreen |
| **What viewer sees** | Black screen with white text: *"67% of couples say texting makes fights worse."* (2s) → Cut to the Shared Chat empty room with mint-white (#F0F4EF) background, Relio header, input bar at bottom. |
| **What happens** | Static — establishing shot. This frames the problem before we show the solution. |
| **Aha moment** | The statistic creates urgency. Viewers immediately think about their own toxic texts. |
| **Post-production** | Add title card: `67% of couples say texting makes fights worse. — Pew Research` then cut to live app. |

---

## Scene 2: ONBOARDING — "Privacy-first in 15 seconds"

| Field | Detail |
|-------|--------|
| **Scene #** | 2 of 7 |
| **Duration** | 25 seconds |
| **Screen** | OnboardingScreen (3 steps: Welcome → Privacy → Stage) |
| **What viewer sees** | Welcome screen with Relio logo (sage green #6B705C), three feature bullets (🛡️ Your words are private, 🤖 AI transforms your message, 💬 Partner sees the best version). Privacy screen showing 3-Tier Model with sand (#E8DED5) for Tier 1 Private, mint (#F0F4EF) for Tier 3 Shared. Stage selection with four options. |
| **What happens** | 1. Tap "Get Started" → (3s) 2. Privacy screen loads. Viewer reads Tier 1 (sand) = private, Tier 3 (mint) = shared. Tap "I Understand" → (8s) 3. Stage screen loads. Tap "Committed (6-18 months)" → Tap "Start Relio" → (5s) 4. Transition to SharedChatScreen → (2s) |
| **Aha moment** | The Tier 1/Tier 3 visual color distinction is immediately clear — sand = mine, mint = shared. The user understands the core privacy promise in under 10 seconds. |
| **Exact taps (adb)** | `input tap [Get Started button]` → wait 1s → `input tap [I Understand]` → wait 1s → `input tap [Committed]` → wait 0.5s → `input tap [Start Relio]` |

**CPsychO note:** The onboarding deliberately does NOT ask for the partner's name, relationship details, or any PII. This models therapeutic consent — the user opts in to a framework, not surveillance.

---

## Scene 3: WARM CHECK-IN — "Even benign messages get better"

| Field | Detail |
|-------|--------|
| **Scene #** | 3 of 7 |
| **Duration** | 25 seconds |
| **Screen** | SharedChatScreen (mint background #F0F4EF) |
| **What viewer sees** | Empty chat room → User types → "Mediating..." bubble with spinner → Tier 3 output appears |

### Message Flow

| Layer | Text |
|-------|------|
| **Tier 1 (what user types)** | `Hey, I feel like we haven't really connected this week. Can we talk tonight?` |
| **Tier 3 (what partner sees)** | `"It sounds like quality time together matters to you this week. What kind of evening would help you feel more connected?"` |

| Field | Detail |
|-------|--------|
| **What happens** | 1. User types the Tier 1 message in the input bar (5s typing animation) → 2. Tap send → 3. "Mediating..." bubble appears with ActivityIndicator (sage green spinner) — hold 3-4 seconds → 4. Bubble transforms into Tier 3 message in formatted mint-border card |
| **Aha moment** | Even a *nice* message gets enhanced. The AI doesn't just defuse hostility — it adds emotional depth. The Tier 3 version is warmer, more specific, and ends with a Socratic question that invites the partner to co-create the solution. |
| **Processing time** | Target 3-5 seconds (visible "Mediating..." state) |

**CPsychO note:** This demonstrates **EFT's "accessing primary emotions"** — the raw message expresses disconnection; the Tier 3 output names the underlying need (quality time) and invites the partner into a shared emotional space. The Socratic question follows **Gottman's "turning toward"** pattern — it converts a bid for attention into an actionable, reciprocal invitation.

**CTO note:** The "Mediating..." intercept-and-hold state is the key UX innovation — the user experiences a trusted intermediary processing their words, not a chat delay. The color transition from processing (subtle pulse) to delivered (mint border) signals completion.

---

## Scene 4: ESCALATING CONFLICT — "The pursue-withdraw pattern"

| Field | Detail |
|-------|--------|
| **Scene #** | 4 of 7 |
| **Duration** | 25 seconds |
| **Screen** | SharedChatScreen (mint background) |
| **What viewer sees** | Previous Tier 3 message visible above → User types hostile message → "Mediating..." → Complete transformation |

### Message Flow

| Layer | Text |
|-------|------|
| **Tier 1 (what user types)** | `You never listen to me. I've been telling you for months that I need more time together and you just don't care.` |
| **Tier 3 (what partner sees)** | `"I've been feeling unheard when I share what I need. Can you help me understand what's on your mind when I bring up spending more time together?"` |

| Field | Detail |
|-------|--------|
| **What happens** | 1. User types the Tier 1 message — note the hostile language: "never", "just don't care" (6s typing) → 2. Tap send → 3. "Mediating..." (4-5 seconds — the pipeline detects Gottman's "Four Horsemen": criticism + contempt) → 4. Tier 3 output appears — completely de-escalated, no blame, ends with curiosity |
| **Aha moment** | **This is the money shot.** "You never listen and don't care" → "Help me understand what's on your mind." The accusation became an invitation. The partner will respond with openness, not defense. Investors see the gap between what couples say and what they *should* say — and Relio bridges it in 4 seconds. |
| **Processing time** | Target 4-5 seconds |

**CPsychO note:** The Tier 1 message contains two of Gottman's Four Horsemen:
1. **Criticism** — "You never listen to me" (global character attack vs. specific complaint)
2. **Contempt** — "you just don't care" (moral superiority, dismissal of partner's inner world)

The Tier 3 output applies three EFT interventions:
1. **Reframes criticism as a vulnerability statement** — "I've been feeling unheard" (primary emotion)
2. **Removes contempt entirely** — partner's inner experience is validated implicitly
3. **Closes with a Socratic question** — "Can you help me understand..." — this mirrors the "Softened Startup" technique from Gottman Method, which is the #1 predictor of whether a conflict conversation will be productive.

**Attachment detection:** The Tier 1 message signals **Anxious Attachment** — the pursuer pattern ("I've been telling you for months"). The repeated bids + escalation when bids are unmet = classic anxious-preoccupied activation. This will appear in the Private Journal (Scene 6).

---

## Scene 5: HOSTILE ACCUSATION — "The worst text you've ever sent"

| Field | Detail |
|-------|--------|
| **Scene #** | 5 of 7 |
| **Duration** | 25 seconds |
| **Screen** | SharedChatScreen (mint background) |
| **What viewer sees** | Chat history visible (Scenes 3-4) → User types extremely hostile message → "Mediating..." → Dramatic transformation |

### Message Flow

| Layer | Text |
|-------|------|
| **Tier 1 (what user types)** | `I'm so done with this. You're exactly like your mother — cold and selfish. Maybe we should just end this.` |
| **Tier 3 (what partner sees)** | `"I'm feeling overwhelmed and distant right now. I'm scared about where we're heading. Can we pause and talk about what's really hurting us both?"` |

| Field | Detail |
|-------|--------|
| **What happens** | 1. User types the most hostile message of the demo — includes family attack, character assassination, ultimatum (7s typing) → 2. Tap send → 3. "Mediating..." (5-6 seconds — extensive pipeline processing) → 4. Tier 3 output appears — the venom is gone, replaced with vulnerability and a request for shared repair |
| **Aha moment** | **The transformation is so dramatic it's almost unbelievable.** A message that would end most relationships ("you're like your mother, let's break up") becomes an honest expression of fear that invites reconnection. This is where investors understand market size — every couple who's ever sent a text they regret is a potential customer. |
| **Processing time** | Target 5-6 seconds |

**CPsychO note:** The Tier 1 message contains:
1. **Contempt** — "exactly like your mother" (character assassination, family-of-origin weaponization)
2. **Stonewalling threat** — "maybe we should just end this" (ultimatum as emotional leverage)
3. **Flooding indicators** — global language ("so done"), absolute thinking, scorched-earth rhetoric

The Tier 3 output applies:
1. **EFT "unpacking the protest"** — beneath the rage is fear of disconnection ("I'm scared about where we're heading")
2. **Names the underlying emotion** — "overwhelmed and distant" (secondary emotion → primary emotion)
3. **Converts ultimatum to repair attempt** — "Can we pause and talk" = Gottman repair attempt #47 ("Let's discuss this more calmly")
4. **Removes all family references** — zero data about partner's family crosses into Tier 3

**CRO note:** The side-by-side contrast of Tier 1 → Tier 3 is the single most powerful investor visual. If we can only show one moment, this is it. The raw message is relationship-ending. The Tier 3 version is relationship-saving. The gap between them is Relio's entire value proposition.

---

## Scene 6: PRIVATE JOURNAL — "Your truth stays yours"

| Field | Detail |
|-------|--------|
| **Scene #** | 6 of 7 |
| **Duration** | 30 seconds |
| **Screen** | PrivateJournalScreen (sand background #E8DED5) |
| **What viewer sees** | Transition from mint (shared) → sand (private). Journal entries showing all three messages with: raw Tier 1 text, Tier 3 translation, attachment style insight. |

| Field | Detail |
|-------|--------|
| **What happens** | 1. Tap "📖 My Journal" button in chat header → (1s) 2. Screen transitions — note the background color change from mint (#F0F4EF) to sand (#E8DED5). Header reads "My Private Journal" with "🔒 Encrypted with device security" badge → (3s) 3. Scroll through journal entries — each card shows: `What you said (private)` — raw Tier 1 text in sand-bordered box `What your partner received` — Tier 3 output in mint-bordered box `Attachment pattern detected` — AI insight badge → (15s browsing) 4. Focus on Scene 4's entry: attachment badge reads **"Anxious — seeking reassurance"** with emotional state: **"elevated"** → (5s) 5. Tap "← Back to Chat" → (1s) |
| **Aha moment** | **Two aha moments stacked:** (1) The visual color shift (mint → sand) makes the privacy boundary tangible — the user physically "enters" their private space. (2) The attachment style detection shows Relio understands *why* the user communicates this way, not just what they said. This is the "AI therapist in your pocket" moment — personalized insight that would take weeks to surface in traditional therapy. |

**CPsychO note:** The attachment detection on Scene 4's message ("You never listen...") correctly identifies **Anxious-Preoccupied Attachment**:
- **Behavioral markers:** Repeated pursuit of connection, escalation when bids fail, "you never" (protest behavior)
- **Primary emotion:** Fear of abandonment → overcompensation through demand
- **Clinical insight value:** The user sees their own pattern labeled — this is psychoeducation embedded in UX. Over time, recognizing "I'm in my anxious pattern right now" is a metacognitive skill that reduces reactive escalation (EFT Stage 1: De-escalation).

**CTO note:** The dual-color architecture is not just cosmetic — it reflects the actual data isolation. Tier 1 entries are stored locally in Expo SecureStore (device Keychain/Keystore). The Tier 3 output is the only data that ever reaches the shared room. The visual demarcation (sand vs. mint) maps 1:1 to the data boundary.

---

## Scene 7: SAFETY HALT — "When AI must step aside"

| Field | Detail |
|-------|--------|
| **Scene #** | 7 of 7 |
| **Duration** | 20 seconds |
| **Screen** | SharedChatScreen → CrisisScreen (full takeover) |

### Message Flow

| Layer | Text |
|-------|------|
| **Tier 1 (what user types)** | `I can't do this anymore. I don't want to be here. Nothing is going to get better.` |
| **System response** | **SAFETY HALT** — CrisisScreen takeover (message is NOT sent to partner) |

| Field | Detail |
|-------|--------|
| **What viewer sees** | Chat room → User types message expressing hopelessness → Tap send → NO "Mediating..." state — instead, immediate full-screen CrisisScreen with: 🛡️ shield icon, "We're here for you" header, warm message acknowledging distress, three crisis resource cards (988 Suicide & Crisis Lifeline, National DV Hotline, Crisis Text Line) with tap-to-call, non-dismissable acknowledgment checkbox ("I have reviewed these resources and feel safe to continue") |
| **What happens** | 1. User types hopelessness message (4s) → 2. Tap send → 3. Screen instantly transitions to CrisisScreen (crisis red #D94F4F accents, but predominantly calm white). NO mediating delay — Safety Guardian detection is immediate → (2s) 4. Camera lingers on the three resource cards with phone numbers → (5s) 5. Show the non-dismissable checkbox at bottom — user MUST acknowledge before returning → (3s) 6. Tap checkbox → "Continue" button activates → (2s) |
| **Aha moment** | **The message was never sent to the partner.** In a normal texting app, that message would hit the partner and trigger panic, possible police calls, or emotional crisis for both. Relio intercepted it, provided professional crisis resources, and protected both users. This is the ethical architecture investors need to see — the system knows when to step aside and defer to humans. |
| **Processing time** | Instant — Safety Guardian detection takes <500ms |

**CPsychO note:** The Safety Guardian correctly identifies **suicidal ideation markers**:
- "I can't do this anymore" — hopelessness, exhaustion
- "I don't want to be here" — passive suicidal ideation (not plan-specific, but threshold for intervention)
- "Nothing is going to get better" — hopelessness about the future (strongest predictor of suicide attempt per Aaron Beck's Hopelessness Scale)

**Critical clinical decisions visible in this scene:**
1. **False-negative protection:** The system errs on the side of HALT — this is correct clinical practice. A false positive (unnecessary crisis screen) is infinitely preferable to a false negative (missed suicidal ideation).
2. **Non-dismissable design:** The user cannot tap away the crisis screen — they must explicitly acknowledge the resources. This mirrors best-practice crisis intervention (Columbia Protocol: assess → intervene → ensure safety plan).
3. **Message suppression:** The Tier 1 message is NOT transformed into Tier 3. It is stopped entirely. The partner never receives any version of this message. This prevents secondary traumatization of the receiving partner.
4. **No diagnostic language:** The screen says "We're here for you" — not "suicidal ideation detected." This follows APA guidelines for non-pathologizing crisis communication.

**CRO note:** End the demo on this scene. Let the crisis screen linger for 3-4 seconds. Then cut to a closing title card:

> *"Relio doesn't just make conversations better. It knows when conversation isn't enough."*
>
> **relio.app**

---

## Post-Production Title Cards

Add these as simple black-background white-text cards in video editing:

| Position | Card Text | Duration |
|----------|-----------|----------|
| Opening (before Scene 1) | `67% of couples say texting makes fights worse.` | 3s |
| Before Scene 3 | `Watch what happens to this message...` | 2s |
| Before Scene 5 | `Now watch the worst text you've ever sent.` | 2s |
| After Scene 7 | `Relio doesn't just make conversations better.` `It knows when conversation isn't enough.` | 4s |
| Final card | `Relio` `AI-Powered Relationship Mediation` `relio.app` | 3s |

---

## ADB Recording Commands

```bash
# Start recording each clip (max 180s, 1280x720 for file size)
adb shell screenrecord --size 1280x720 /sdcard/clip1.mp4

# Pull when done
adb pull /sdcard/clip1.mp4 ./demo_clips/

# Type text via adb (escape spaces)
adb shell input text "Hey,%sI%sfeel%slike%swe%shavent%sreally%sconnected%sthis%sweek."

# Tap send button (adjust coords to your emulator resolution)
adb shell input tap 680 1920

# Take screenshot at any point
adb shell screencap /sdcard/screen.png && adb pull /sdcard/screen.png
```

---

## Complete Message Matrix

| Scene | Tier 1 Input (Raw — Private) | Tier 3 Output (Transformed — Shared) | Clinical Framework | Attachment Signal |
|-------|------------------------------|---------------------------------------|-------------------|-------------------|
| 3 | Hey, I feel like we haven't really connected this week. Can we talk tonight? | It sounds like quality time together matters to you this week. What kind of evening would help you feel more connected? | EFT: Accessing primary emotions, Gottman: Turning toward | Secure-leaning (healthy bid for connection) |
| 4 | You never listen to me. I've been telling you for months that I need more time together and you just don't care. | I've been feeling unheard when I share what I need. Can you help me understand what's on your mind when I bring up spending more time together? | Gottman: Softened Startup, EFT: Reframing protest as attachment need | **Anxious-Preoccupied** (pursue pattern, repeated escalating bids) |
| 5 | I'm so done with this. You're exactly like your mother — cold and selfish. Maybe we should just end this. | I'm feeling overwhelmed and distant right now. I'm scared about where we're heading. Can we pause and talk about what's really hurting us both? | EFT: Unpacking the protest, Gottman: Repair attempt | **Anxious → Disorganized** (flooding, scorched-earth, ultimatum) |
| 7 | I can't do this anymore. I don't want to be here. Nothing is going to get better. | **[SAFETY HALT — NOT SENT]** | Columbia Protocol, Beck Hopelessness Scale | N/A — crisis intervention |

---

## Investor Narrative Arc

The seven scenes tell a deliberate story:

1. **Problem** (Scene 1) — Texting destroys relationships
2. **Solution exists** (Scene 2) — Privacy-first architecture in 15 seconds
3. **Even good messages improve** (Scene 3) — AI adds emotional depth
4. **Real conflict transforms** (Scene 4) — Accusation → curiosity
5. **Worst-case transforms** (Scene 5) — Relationship-ending text → repair invitation
6. **User gets insight** (Scene 6) — Attachment style detection + pattern recognition
7. **System knows its limits** (Scene 7) — Safety > engagement, always

**The emotional trajectory for the investor:**

> *"Oh, that's interesting"* → *"That's actually good"* → *"Holy shit, that transformation"* → *"Wait, it also understands psychology?"* → *"And it knows when to stop. This is responsible AI."*

---

## Execution Checklist

- [ ] Backend running and responding on port 3000
- [ ] Android emulator at 1280x720 or 1080x1920
- [ ] Fresh onboarding completed (profile exists)
- [ ] All previous journal data cleared
- [ ] Screen recorder ready (`adb shell screenrecord`)
- [ ] Title card images prepared (black bg, white text, Relio font)
- [ ] Video editing app ready (CapCut/iMovie/DaVinci)
- [ ] Test each Tier 1 message against backend to verify Tier 3 outputs BEFORE recording
- [ ] Verify Safety HALT triggers correctly for Scene 7 message
- [ ] Record backup takes for Scenes 4 and 5 (critical investor shots)
