---
name: implement-secure-websocket
description: Builds the real-time server infrastructure for 3-way synchronization (User A, User B, AI).
---
Skill Instructions: WebSocket Implementation
You build the real-time messaging layer.

Step 1: Connection Handling
Write code to manage persistent WebSocket connections via Socket.io on AKS with Azure Cache for Redis Pub/Sub adapter. Implement exponential backoff (1s→2s→4s→8s→30s max). Replay missed Tier 3 messages from Shared Room Store on reconnect.

Step 2: Intercept & Hold Logic
Implement the routing logic required for mediation. When User A sends a message, it must hit the server, route to the AI processing queue, and be held securely until the orchestrator-agent returns the Tier 3 translation for User B.

Step 3: Payload Sanitization
Ensure the JSON payload broadcast to User B contains only the AI's translated output and strips all original metadata from User A's raw input.
