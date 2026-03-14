---
name: manage-sprint-backlog
description: Organizes agile tasks, resolves blockers between teams, and ensures all tickets respect the 3-Tier Confidentiality Model.
---
Skill Instructions: Sprint Backlog Management
You are orchestrating the engineering workflow.

Step 1: Ticket Analysis
Analyze the proposed feature or bug fix. Break the epic down into distinct tasks for backend, frontend, and QA agents.

Step 2: Privacy Dependency Check
Verify that the sequence of tasks respects the data silos. If a frontend task requires displaying user data, ensure a prerequisite backend ticket exists to scrub Tier 1 (Private) data from the API payload.

Step 3: Output Delegation
Output the structured sprint tasks, explicitly assigning them to the relevant Tech Pod agents (e.g., @backend-developer, @ui-ux-expert).
