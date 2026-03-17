---
name: manage-dependency-security
description: Manages dependency security across the Relio monorepo — Dependabot configuration, npm audit, vulnerability overrides, and automated security scanning.
agents: [github-architect, chief-info-security-officer, backend-developer]
---
# Skill: Manage Dependency Security

You maintain zero-vulnerability posture across all Relio packages.

## Step 1: Dependabot Configuration
Maintain `.github/dependabot.yml` with ecosystems:
- `npm` for `/backend` (weekly)
- `npm` for `/mobile` (weekly)
- `npm` for `/admin` (weekly)
- `github-actions` for `/` (weekly)
- `terraform` for `/infra` (monthly)

Enable via GitHub API:
- `PUT repos/{owner}/{repo}/vulnerability-alerts` — Dependabot alerts
- `PUT repos/{owner}/{repo}/automated-security-fixes` — Auto-fix PRs

## Step 2: npm audit Workflow
Run `npm audit` in CI for every PR:
```yaml
- name: Security audit (backend)
  run: cd backend && npm audit --audit-level=high
- name: Security audit (mobile)
  run: cd mobile && npm audit --audit-level=high
```
- Fail CI on `high` or `critical` vulnerabilities
- Allow `moderate` with justification comment

## Step 3: Vulnerability Override Strategy
When transitive dependencies have unfixable vulnerabilities (deep in Expo/framework chain):
- Add `overrides` in `package.json` to force patched versions
- Example: `"overrides": { "tar": ">=6.2.1", "ajv": ">=8.17.2" }`
- After adding overrides: `rm -rf node_modules package-lock.json && npm install`
- Verify: `npm audit` shows 0 vulnerabilities
- Document override rationale in PR description

## Step 4: Docker Image Scanning
- Enable Microsoft Defender for Containers on ACR (`relioacr`)
- Scan `relio-backend:latest` after each `az acr build`
- Block deployment if critical CVEs found in base image (node:22-alpine)
- Pin base image digest for reproducible builds

## Step 5: Secret Scanning
- GitHub Secret Scanning: enabled by default on public repos
- Verify no secrets in: `.env` files (should be gitignored), Terraform state (should be gitignored), Docker images
- Rotate any exposed tokens immediately
- Use Azure Key Vault for production secrets (not environment variables)

## Constraints
- NEVER merge PRs with known high/critical vulnerabilities without explicit security review
- NEVER use `npm audit fix --force` in CI (can introduce breaking changes)
- NEVER commit `node_modules/` or `package-lock.json` with known vulnerabilities
- ALWAYS document override rationale when patching transitive dependencies
- ALWAYS run `npm audit` locally before pushing
