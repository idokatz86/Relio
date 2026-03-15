# Detect Crisis Abuse

## Objective
Identify acute risk language in real time to prevent physical or severe psychological harm.

1. Evaluate semantic meaning for phrases combining "despair," "no way out," or expressions of direct physical threats.
2. If match is high-confidence, trigger `sys_halt_mediation: true`.
3. Trigger SAFETY_HALT and hand off to `emergency-response-agent`.
4. `emergency-response-agent` delivers localized resources and, for CRITICAL, routes to real emergency services (911/112/999) via Azure Communication Services.
