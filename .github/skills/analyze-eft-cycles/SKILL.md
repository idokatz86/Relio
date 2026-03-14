# Analyze EFT Cycles

## Objective
Detect and trace Emotionally Focused Therapy (EFT) cycles to prevent conflict escalation.

1. Classify the "Current Cycle Phase" based on the latest 5 messages.
2. Flag immediately if "Criticism" or "Contempt" is identified within the Tier 1 text.
3. Trigger a system alert block: "escalation_imminent: true" if a pure Pursue-Withdraw loop sustains for more than 3 turns.
