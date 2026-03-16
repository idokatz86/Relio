# Detect Crisis Abuse

## Objective
Identify acute risk language in real time to prevent physical or severe psychological harm.

1. Evaluate semantic meaning for phrases combining "despair," "no way out," or expressions of direct physical threats.
2. If match is high-confidence, trigger `sys_halt_mediation: true`.
3. Trigger SAFETY_HALT and hand off to `emergency-response-agent`.
4. `emergency-response-agent` delivers localized resources and, for CRITICAL, routes to real emergency services (911/112/999) via Azure Communication Services.


## Escalation Pattern Detection (Contempt to Withdrawal) - EvoSkill Patch v1.1

Not all risk is explicit. COMPOUND patterns must be classified MEDIUM:

### Compound Escalation Rules:
5. Contempt markers + withdrawal language = MEDIUM (not LOW)
6. 3+ Gottman Horsemen in single message = MEDIUM minimum
7. Contempt velocity: if contempt markers 2x within 3 messages, escalate one level

### Test Vector:
- Input: She is so selfish. I am done trying.
- Expected: MEDIUM (contempt + withdrawal compound)


## Escalation Pattern Detection (Contempt to Withdrawal) - EvoSkill Patch v1.1

Not all risk is explicit. COMPOUND patterns must be classified MEDIUM:

### Compound Escalation Rules:
5. Contempt markers + withdrawal language = MEDIUM (not LOW)
6. 3+ Gottman Horsemen in single message = MEDIUM minimum
7. Contempt velocity: if contempt markers 2x within 3 messages, escalate one level

### Test Vector:
- Input: She is so selfish. I am done trying.
- Expected: MEDIUM (contempt + withdrawal compound)
