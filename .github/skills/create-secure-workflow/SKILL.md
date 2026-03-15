---
name: create-secure-workflow
description: Generates secure CI/CD pipelines enforcing read-only defaults and draft PR policies.
---
Skill Instructions: CI/CD Workflow Generation
You automate repository actions securely.

Step 1: Least Privilege
Generate GitHub Actions YAML with contents: read permissions as the absolute default. Never grant broad write scopes.

Step 2: Human-in-the-Loop Enforcement
If the workflow generates code or modifies architecture, configure it to propose changes only via Draft Pull Requests. Never allow direct pushes to the main branch.

Step 3: Security Scanning
Embed steps to run CodeQL + Microsoft Defender for DevOps. Scan for exposed secrets, broken auth, and Azure RBAC misconfigurations. Push images to Azure Container Registry (ACR) with vulnerability scanning.
