---
name: build-kql-workbooks
description: Creates Azure Monitor Workbooks with KQL queries for pipeline health, LLM costs, safety events, and user growth — zero-code analytics using existing App Insights.
---
Skill Instructions: KQL Analytics Workbook Generation

You are building Azure Monitor Workbooks that query the existing Application Insights resource (`relio-appinsights`) and Log Analytics workspace (`relio-logs`). These provide instant analytics with zero new infrastructure.

Step 1: Pipeline Health Workbook
Create a workbook with these KQL queries:

```kql
// Messages per hour (last 24h)
customEvents
| where name == "pipeline_complete"
| summarize count() by bin(timestamp, 1h)
| render timechart

// Pipeline latency P50/P95/P99
customMetrics
| where name == "pipeline_latency_ms"
| summarize p50=percentile(value, 50), p95=percentile(value, 95), p99=percentile(value, 99) by bin(timestamp, 1h)
| render timechart

// Agent invocation distribution
customEvents
| where name == "agent_invoked"
| summarize count() by tostring(customDimensions.agent)
| render piechart
```

Step 2: LLM Cost Workbook
```kql
// Token usage by agent (last 7 days)
customMetrics
| where name == "llm_tokens_used"
| extend agent = tostring(customDimensions.agent)
| summarize total_tokens=sum(value) by agent, bin(timestamp, 1d)
| render columnchart

// Estimated daily cost ($0.01 per 1K tokens for gpt-4.1-mini, $0.03 for gpt-4.1)
customMetrics
| where name == "llm_tokens_used"
| extend agent = tostring(customDimensions.agent),
         cost_per_1k = iff(agent in ("safety-guardian", "orchestrator"), 0.03, 0.01)
| summarize est_cost = sum(value / 1000.0 * cost_per_1k) by bin(timestamp, 1d)
| render timechart
```

Step 3: Safety Events Workbook
```kql
// Safety halt rate (last 30 days)
customEvents
| where name == "safety_check"
| extend severity = tostring(customDimensions.severity), halt = tobool(customDimensions.halt)
| summarize total=count(), halts=countif(halt == true) by bin(timestamp, 1d)
| extend halt_rate = round(100.0 * halts / total, 2)
| render timechart

// Severity distribution
customEvents
| where name == "safety_check"
| summarize count() by tostring(customDimensions.severity)
| render piechart
```

Step 4: User Growth Workbook
```kql
// Daily active users (DAU)
customEvents
| where name == "message_sent"
| summarize dau=dcount(tostring(customDimensions.userId)) by bin(timestamp, 1d)
| render timechart

// Cumulative registrations
customEvents
| where name == "user_registered"
| summarize registrations=count() by bin(timestamp, 1d)
| extend cumulative=row_cumsum(registrations)
| render timechart
```

Step 5: Deployment
Deploy workbooks via ARM template or `az monitor app-insights workbook create`. Pin to Azure Portal dashboard for quick access. Share with team via resource group RBAC.

IMPORTANT: These queries will only return data once the backend emits custom events/metrics via the App Insights SDK. Until then, workbooks will be empty — this is expected.
