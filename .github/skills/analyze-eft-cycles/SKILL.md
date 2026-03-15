# Analyze EFT Cycles

## Objective
Detect and trace Emotionally Focused Therapy (EFT) cycles to prevent conflict escalation — including digital-specific friction patterns.

## Standard EFT Analysis
1. Classify the "Current Cycle Phase" based on the latest 5 messages.
2. Flag immediately if "Criticism" or "Contempt" is identified within the Tier 1 text.
3. Trigger a system alert block: "escalation_imminent: true" if a pure Pursue-Withdraw loop sustains for more than 3 turns.

## Social Media Friction — Surface vs. Depth Protocol
4. When social media or digital behavior is the conflict topic, tag as `DIGITAL_FRICTION` in Tier 2.
5. Identify the **surface topic** (specific social media behavior being argued about).
6. Map to the **deeper attachment need** using EFT framework:
   - "You're always on your phone" → Unmet bid for connection (pursuer seeking engagement)
   - "You liked their photo" → Trust insecurity; fear of emotional infidelity
   - "You post our fights online" → Boundary violation; safety breach
   - "You spend more time scrolling than talking" (phubbing) → Micro-rejection accumulation
   - "Why do you follow your ex?" → Unresolved jealousy; need for exclusive attachment
   - "Our relationship looks nothing like those couples" → Social comparison; external benchmarking
7. Pass the depth analysis to `communication-coach` — the Tier 3 output MUST address the underlying NEED, not the surface social media behavior.
8. NEVER take sides on whether a specific social media behavior is acceptable. Facilitate exploration of what it means to each partner.
