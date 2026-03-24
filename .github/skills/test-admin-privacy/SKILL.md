---
name: test-admin-privacy
description: Generates E2E tests verifying the admin dashboard never exposes Tier 1 private data, Tier 2 clinical profiles, or individual-level data below the k-anonymity threshold.
---
Skill Instructions: Admin Privacy Testing

You verify the backoffice admin panel respects the 3-Tier Confidentiality Model. The admin must NEVER see raw user messages, attachment profiles, or individual safety details.

Step 1: Tier 1 Isolation Test
Inject canary strings into the Tier 1 database (raw messages). Query every admin API endpoint. Assert that canary strings NEVER appear in any admin API response. This is the same pattern used in `tests/canary.test.ts` but applied to admin routes.

Step 2: Tier 2 Clinical Isolation Test
Create test Cosmos DB documents with clinical data (attachment profiles, relationship dynamics). Query admin endpoints. Assert that attachment style, love language, activation history, and raw clinical reasoning NEVER appear in admin responses.

Step 3: k-Anonymity Threshold Test
Create a test scenario where only 2 users are in the "pre-divorced" phase. Query `/api/v1/admin/phases`. Assert that the response shows `"preDivorced": "<5"` instead of the exact count. Repeat for user directory — individual user detail pages must not surface when total count in a filter is below 5.

Step 4: Admin Auth Enforcement Test
Attempt to call all `/api/v1/admin/*` endpoints with:
- No token → expect 401
- Regular user token → expect 403
- Admin token → expect 200
- Expired admin token → expect 401

Step 5: Audit Log Verification
After calling admin endpoints, query the `admin_audit_log` table. Assert that every call was logged with: admin userId, endpoint, timestamp, and response status.

Step 6: No Export Verification
Assert that no admin endpoint returns more than 100 records per page (pagination enforced). Assert that no endpoint supports a "download all" or "export CSV" parameter.
