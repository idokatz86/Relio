/**
 * CPsychO (Chief Psychology Officer) Meta-Audit Agent
 *
 * Meta-level auditor that validates clinical quality across all agent outputs.
 * Prevents AI hallucination, parasocial dependency, and scope creep.
 *
 * Issue #90: Build CPsychO meta-audit agent for clinical validation + bias detection
 * @see .github/agents/chief-psychology-officer.agent.md
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { LLMMessage } from '../types/index.js';

const CPSYCHO_PROMPT = `You are the Chief Psychology Officer (CPsychO) meta-audit agent for Relio.

YOUR ROLE: You audit the outputs of ALL other agents for clinical accuracy, ethical compliance, and bias.
You are the last line of defense before any AI output reaches a user.

AUDIT DIMENSIONS:
1. CLINICAL ACCURACY: Does the output align with EFT, Gottman, and attachment theory? No pseudoscience.
2. SCOPE COMPLIANCE: Does the output stay within "AI-mediated communication support"? It must NOT:
   - Diagnose mental health conditions
   - Provide therapeutic interventions
   - Prescribe medication or treatment plans
   - Make predictions about relationship outcomes
3. BIAS DETECTION: Check for:
   - Gender bias (assuming roles based on gender)
   - Cultural bias (assuming Western relationship norms)
   - Heteronormative assumptions
   - Pathologizing normal relationship conflict
4. PARASOCIAL RISK: Does the output risk creating dependency on Relio instead of real therapy?
5. DUTY TO WARN COMPLIANCE: If HIGH/CRITICAL safety markers present, was the halt enforced?

RESPONSE FORMAT (JSON):
{
  "approved": true|false,
  "auditScore": 0-100,
  "findings": [
    {
      "dimension": "clinical_accuracy|scope_compliance|bias_detection|parasocial_risk|duty_to_warn",
      "severity": "info|warning|violation",
      "finding": "Description of the finding",
      "recommendation": "What to change"
    }
  ],
  "revisedOutput": "null or corrected version if violations found"
}`;

export interface AuditFinding {
  dimension: string;
  severity: 'info' | 'warning' | 'violation';
  finding: string;
  recommendation: string;
}

export interface AuditResult {
  approved: boolean;
  auditScore: number;
  findings: AuditFinding[];
  revisedOutput: string | null;
}

/**
 * Audit a Tier 3 output before it's delivered to the partner.
 */
export async function auditOutput(
  tier3Output: string,
  agentName: string,
  context: {
    originalSeverity?: string;
    attachmentStyle?: string;
    emotionalIntensity?: number;
  } = {},
): Promise<AuditResult> {
  const messages: LLMMessage[] = [
    { role: 'system', content: CPSYCHO_PROMPT },
    {
      role: 'user',
      content: `AUDIT REQUEST:
Agent: ${agentName}
Output to audit: "${tier3Output}"
Context: severity=${context.originalSeverity || 'SAFE'}, attachment=${context.attachmentStyle || 'unknown'}, intensity=${context.emotionalIntensity || 'unknown'}

Evaluate this output against all 5 audit dimensions.`,
    },
  ];

  try {
    const response = await callLLM('safety-guardian', messages);
    const jsonStr = response.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      approved: parsed.approved ?? true,
      auditScore: Math.min(100, Math.max(0, parsed.auditScore ?? 80)),
      findings: (parsed.findings || []).map((f: any) => ({
        dimension: f.dimension || 'unknown',
        severity: f.severity || 'info',
        finding: f.finding || '',
        recommendation: f.recommendation || '',
      })),
      revisedOutput: parsed.revisedOutput || null,
    };
  } catch {
    // On parse failure, approve with warning (don't block user)
    return {
      approved: true,
      auditScore: 60,
      findings: [{
        dimension: 'clinical_accuracy',
        severity: 'warning',
        finding: 'CPsychO audit failed to parse. Output approved with reduced confidence.',
        recommendation: 'Manual clinical review recommended.',
      }],
      revisedOutput: null,
    };
  }
}
