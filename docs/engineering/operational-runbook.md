# Relio Operational Runbook

**Issue #72** | **Version:** 1.0 | **Last Updated:** 2026-03-16

## Architecture Overview

```
Mobile App → Azure Container Apps (relio-backend) → LLM Gateway → GitHub Models / Azure OpenAI
                  ↓                                        
          PostgreSQL Flex (Tier 1 + Tier 3)                
          Cosmos DB Serverless (Tier 2)                    
          Azure Cache for Redis (Sessions)                 
```

**Region:** Sweden Central | **Resource Group:** `relio-rg`

## Key URLs

| Service | URL |
|---------|-----|
| Backend | `https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io` |
| Health Check | `GET /health` |
| App Insights | Azure Portal → relio-appinsights |
| Log Analytics | Azure Portal → relio-logs |

## Common Operations

### Deploy New Backend Version
```bash
# Via CI/CD (preferred — triggers on push to main)
git push origin main

# Manual (emergency)
az acr build --registry relioacr --image relio-backend:latest --file backend/Dockerfile backend/
az containerapp update --name relio-backend --resource-group relio-rg --image relioacr.azurecr.io/relio-backend:latest
```

### Check Container Logs
```bash
az containerapp logs show --name relio-backend --resource-group relio-rg --tail 100
```

### Restart Container App
```bash
az containerapp revision restart --name relio-backend --resource-group relio-rg --revision <revision-name>
```

### Scale Manually
```bash
az containerapp update --name relio-backend --resource-group relio-rg --min-replicas 2 --max-replicas 10
```

## Incident Response

### Safety Guardian HALT Event
1. Check App Insights for `safety` context logs
2. Review the `safety_audit_log` table in Tier 1 database
3. If false positive: no action needed, system works as designed
4. If true positive: verify crisis resources were delivered to client

### LLM Gateway Circuit Breaker Open
1. Check LLM provider status (GitHub Models or Azure OpenAI)
2. Circuit breaker auto-recovers after 30 seconds (half-open → retry)
3. If persistent: check `GITHUB_TOKEN` or `AZURE_OPENAI_API_KEY` validity
4. Manual reset: restart the container app

### Database Connection Issues
1. Check PostgreSQL server status: `az postgres flexible-server show --name relio-postgres-dev --resource-group relio-rg`
2. Verify VNet connectivity (app-subnet → postgres-subnet port 5432)
3. Check connection string in Key Vault: `az keyvault secret show --vault-name relio-kv-dev --name postgres-connection-string`

## Terraform Operations
```bash
cd infra/
terraform init          # First time / after backend change
terraform plan          # Review changes
terraform apply         # Apply (requires approval)
terraform state list    # View managed resources
```

**State:** Azure Blob Storage (`reliotfstate/tfstate/relio.dev.tfstate`)

## Cost Monitoring
- Azure Cost Management alerts set at $50/day and $500/month
- Container Apps: Scale-to-zero enabled for dev
- Redis: Basic C0 (~$16/month)
- PostgreSQL: B_Standard_B1ms (~$13/month)
- Cosmos DB: Serverless (pay-per-RU)
