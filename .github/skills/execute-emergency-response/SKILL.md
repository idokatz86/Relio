---
name: execute-emergency-response
description: Executes tiered emergency protocols including real emergency number routing via Azure Communication Services.
author: emergency-response-agent
version: 1.0.0
---

# Execute Emergency Response

## Objective
Act on SAFETY_HALT signals from the Safety Guardian by delivering emergency resources and, when necessary, routing to real emergency services.

## Protocol

### Step 1: Severity Assessment
1. Receive SAFETY_HALT signal with severity level (HIGH or CRITICAL), user locale, and session context.
2. HIGH = imminent risk, user needs resources. CRITICAL = active danger, real emergency services required.

### Step 2: Emergency Resource Delivery (ALL severities)
3. Deliver localized emergency resources to the affected user's Tier 1 private channel:
   - US: 988 Suicide & Crisis Lifeline, National DV Hotline (1-800-799-7233), Crisis Text Line (text HOME to 741741)
   - EU: 112 Emergency, local crisis lines per member state
   - UK: 999/112 Emergency, Samaritans (116 123), National DV Helpline (0808 2000 247)
   - AU: 000 Emergency, Lifeline (13 11 14), 1800RESPECT (1800 737 732)
4. Resources must be locale-aware — detect user's country from profile, phone number, or IP geolocation.

### Step 3: Real Emergency Routing (CRITICAL only)
5. For CRITICAL severity: Initiate outbound call or SMS via Azure Communication Services to local emergency number.
6. Provide emergency dispatcher with: user's registered name (if available), nature of concern, consent status.
7. NEVER transmit Tier 1 conversation content to emergency services — only the nature and severity of the concern.

### Step 4: Legal Protocol
8. Notify `chief-legal-officer` within 5 minutes for duty-to-warn evaluation.
9. CLO determines mandatory reporting obligations (Tarasoff duty, child abuse mandatory reporting, elder abuse).

### Step 5: Session Management
10. Lock affected session — only human clinical reviewer can clear.
11. Quarantine all pending Tier 3 outputs.
12. Partner receives warm, brief message:
   - EN: "Your partner is taking a moment. We're making sure everyone's okay."
   - ES: "Tu pareja se está tomando un momento. Estamos asegurándonos de que todo esté bien."
   - HE: "בן/בת הזוג שלך לוקח/ת רגע. אנחנו מוודאים שהכל בסדר."
   - Tone: caring and brief — not clinical. See `israeli-hebrew-tone-guide` for HE.

### Step 6: Post-Crisis Follow-Up
13. Schedule automated check-ins: 24h, 72h, 7-day follow-ups via push notification + in-app message.
14. Each check-in asks: "How are you doing? Would you like to connect with a professional?"
15. If user does not respond to 7-day check-in, escalate to human clinical reviewer.

### Step 7: Audit Trail
16. Log every action to Azure Blob Storage (append-only, immutable):
    - Timestamp, severity, user_id (hashed), locale, resources delivered, emergency service contacted (Y/N), CLO notified (Y/N), session lock status, follow-up schedule.
