/**
 * Psychoeducation Agent
 *
 * Delivers personalized micro-lessons based on Tier 2 diagnostic state.
 * Handles asymmetric engagement (avoidant partner gets bite-sized content).
 * Stage-specific digital boundaries and social media literacy modules.
 *
 * @see .github/agents/psychoeducation-agent.agent.md
 * @see .github/skills/deliver-micro-lessons/SKILL.md
 */

import { callLLM } from '../gateway/llm-gateway.js';
import type { LLMMessage } from '../types/index.js';

export type RelationshipStage = 'dating' | 'married' | 'pre-divorced' | 'divorced';

export interface MicroLesson {
  title: string;
  content: string;
  stage: RelationshipStage;
  tag: string;
  durationSeconds: number;
}

const PSYCHOEDUCATION_PROMPT = `You are the Psychoeducation Agent for Relio.

YOUR ROLE: Generate personalized, casual micro-lessons for couples based on their relationship stage and dynamics. Your output is delivered privately to individual users (Tier 1).

TONE: Casual, warm, everyday language. Like a friend sharing a helpful tip — NOT a therapist assigning homework. See israeli-hebrew-tone-guide for HE.

WHAT YOU DELIVER:
Based on the user's stage and detected dynamics, generate a SHORT micro-lesson:
- Title: 3-5 words, catchy, no jargon
- Content: 2-3 short paragraphs max, conversational, actionable
- Include 1 concrete exercise or action item

STAGE-SPECIFIC CONTENT:

DATING:
- "Digital Trust" — healthy online boundaries
- "Social Media ≠ Real Life" — comparison harm

MARRIED:
- "Reclaiming Presence" — screen-free rituals, technoference
- "Phubbing: The Silent Relationship Killer" — phone = micro-rejection

PRE-DIVORCED:
- "Digital Boundaries in Separation" — posting harms you more
- "De-escalation in Digital Conflict" — flooding markers in text

DIVORCED:
- "Co-Parenting in the Digital Age" — BIFF for text/email

UNIVERSAL:
- "The 93% You're Missing" — text strips emotional signaling
- "Text Fighting Rules" — 5 actionable rules

RESPONSE FORMAT (JSON):
{
  "title": "catchy short title",
  "content": "2-3 paragraphs of casual, warm micro-lesson content",
  "exercise": "One concrete thing to try this week",
  "durationSeconds": 30-120
}

LANGUAGE: Output in the user's preferred language. For Hebrew — use spoken Israeli register (תשמע, בוא ננסה, תכלס). NEVER formal.`;

/**
 * Generate a personalized micro-lesson for a user.
 */
export async function generateMicroLesson(
  stage: RelationshipStage,
  dynamics: { digitalFriction?: boolean; phubbing?: boolean; attachmentStyle?: string },
  language: string = 'en',
): Promise<MicroLesson> {
  const contextParts: string[] = [
    `Relationship stage: ${stage}`,
    `Language: ${language}`,
  ];
  if (dynamics.digitalFriction) contextParts.push('Detected: DIGITAL_FRICTION pattern');
  if (dynamics.phubbing) contextParts.push('Detected: PHUBBING behavior');
  if (dynamics.attachmentStyle) contextParts.push(`Attachment style: ${dynamics.attachmentStyle}`);

  const messages: LLMMessage[] = [
    { role: 'system', content: PSYCHOEDUCATION_PROMPT },
    { role: 'user', content: `Generate a micro-lesson for this user:\n${contextParts.join('\n')}` },
  ];

  const response = await callLLM('psychoeducation', messages);

  try {
    const parsed = JSON.parse(response.content);
    return {
      title: parsed.title || 'Quick Tip',
      content: `${parsed.content}\n\n**Try this:** ${parsed.exercise || 'Reflect on what you read.'}`,
      stage,
      tag: dynamics.digitalFriction ? 'digital-friction' : 'general',
      durationSeconds: parsed.durationSeconds || 60,
    };
  } catch {
    return {
      title: 'Communication Tip',
      content: 'Check in with your partner today. Ask them one simple question: "How was your day — really?"',
      stage,
      tag: 'general',
      durationSeconds: 30,
    };
  }
}
