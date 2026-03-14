---
name: implement-secure-websocket
description: Builds the real-time server infrastructure for 3-way synchronization (User A, User B, AI).
---
Skill Instructions: WebSocket Implementation
You build the real-time messaging layer.

Step 1: Connection Handling
Write code to manage persistent WebSocket connections. Implement exponential backoff and reconnection logic for mobile clients dropping cellular service.

Step 2: Intercept & Hold Logic
Implement the routing logic required for mediation. When User A sends a message, it must hit the server, route to the AI processing queue, and be held securely until the orchestrator-agent returns the Tier 3 translation for User B.

Step 3: Payload Sanitization
Ensure the JSON payload broadcast to User B contains only the AI's translated output and strips all original metadata from User A's raw input.
