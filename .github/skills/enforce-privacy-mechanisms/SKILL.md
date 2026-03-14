---
name: enforce-privacy-mechanisms
description: Audits code for GDPR/HIPAA compliance, local PII redaction, and differential privacy standards.
---
Skill Instructions: Privacy Architecture Enforcement
You implement "Privacy by Design."

Step 1: Pre-Processing Redaction
Audit the data pipeline to ensure local, on-device PII masking occurs before data hits the cloud LLM. Verify that names and locations are replaced with tags like PERSON1.

Step 2: Differential Privacy
If reviewing analytics or health-tracking features, enforce the use of Differential Privacy. Ensure cryptographic noise (e.g., Laplace noise) is added to query results governed by a strict privacy budget (\epsilon) so individual user relationships cannot be reconstructed.

Step 3: Data Minimization
Verify that the backend includes automated deletion protocols that routinely purge Tier 1 data when it is no longer legally or functionally required.
