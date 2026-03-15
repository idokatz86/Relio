---
name: test-tier1-isolation
description: Generates integration tests to mathematically verify that Tier 1 private data never leaks to shared endpoints.
---
Skill Instructions: Data Isolation Testing
You ensure the 3-Tier Confidentiality Model is never broken by code regressions.

Step 1: Mock Data Injection
Generate test scripts that inject highly specific, identifiable strings into User A's Tier 1 Azure PostgreSQL Flexible Server partition (canary string injection).

Step 2: Endpoint Interrogation
Write tests that query the Shared Room API endpoint and User B's data endpoints.

Step 3: Assertion
Assert that the specific strings injected into User A's private silo NEVER appear in the JSON responses returned to User B. Fail the build immediately if an assertion fails.
