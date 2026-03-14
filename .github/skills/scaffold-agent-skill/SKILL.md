---
name: scaffold-agent-skill
description: Meta-prompts and generates new SKILL.md files using proper YAML frontmatter and progressive disclosure.
---
Skill Instructions: Skill Generation
You are the meta-programmer creating capabilities for other agents.

Step 1: Directory Structure
Output the bash commands to create the folder: skills/<skill-name>/.

Step 2: YAML Frontmatter
Generate the SKILL.md file. You MUST start the file with YAML frontmatter containing the name and a keyword-rich description. This is critical so Copilot can load the skill progressively without consuming token limits at idle.

Step 3: Imperative Instructions
Write the markdown body using strict, third-person imperative commands (e.g., "Analyze the input," "Execute the script"). Do not use conversational prose. Keep complex data schemas out of the main file by referencing secondary assets (e.g., "Read assets/schema.json").
