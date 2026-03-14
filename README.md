# Relio

Relio is a cloud-first, multi-agent mobile application for relationship mediation (iOS/Android). The app uses a 3-way chat system (User A + User B + AI Mediator) to safely guide couples through four relationship stages: early dating, long-term pre-marriage, marriage, and divorce/co-parenting.

## The 3-Tier Confidentiality Model

Our core architectural moat ensures the utmost emotional safety and data privacy:

- **Tier 1 (Private):** Raw transcripts, venting, and specific complaints. This data is rigorously firewalled and never shared with the partner or exposed to shared room endpoints.
- **Tier 2 (Abstracted):** Pattern-level psychological insights (e.g., "Anxious attachment activated", "Criticism pattern detected"). Kept internal to the Medical Pod.
- **Tier 3 (Actionable):** Socratic, de-escalated guidance safely presented to the partner to encourage constructive dialogue.

## Multi-Agent Architecture

Relio is powered by a workforce of 37 specialized AI agents distributed across three pods, utilizing the most advanced LLMs (Claude 4.6, GPT-5.4, GPT-5.3-Codex, Gemini 3.1 Pro):

- **Medical Pod:** (e.g., Orchestrator, Communication Coach, Phase Agents, Safety Guardian) Drives the clinical logic, enforces timeout rules, maps attachment styles, and monitors abuse signals.
- **Operations Pod:** (e.g., CEO, CMO, CLO, CRO) Manages business strategy, legal disclaimers, partnership evaluations, metric-driven marketing, and token cost optimization.
- **Tech Pod:** (e.g., CTO, Scrum Master, QA, Red Teamer) Constructs secure WebSockets, ensures rigid Tier 1 DB separation, oversees CI/CD governance, and executes adversarial red-teaming.

## Organization & Structure

- `.github/agents/`: Contains definitions and system configurations for each of the 37 AI agents.
- `.github/skills/`: Houses specific procedural skills (`SKILL.md`) for the agents organized by domain.

## Development

All Pull Requests must include an update to the `CHANGELOG.md` file as enforced by our CI/CD pipeline and automated checks.
