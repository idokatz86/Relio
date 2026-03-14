---
name: test-realtime-sync
description: Tests WebSocket stability and state synchronization across iOS and Android simulators.
---
Skill Instructions: Mobile State Synchronization Testing
You test the end-user experience across devices.

Step 1: Latency Simulation
Write Appium or Detox scripts that simulate network latency.

Step 2: Multi-Device Sync Check
Simulate User A sending a message. Verify that the UI enters a "Processing/Mediating" state, and confirm that User B's device does not receive the message until the AI returns the translated payload.

Step 3: Background Resilience
Test the application's behavior when pushed to the background during an active dispute. Ensure the WebSocket reconnects and state updates accurately upon reopening.
