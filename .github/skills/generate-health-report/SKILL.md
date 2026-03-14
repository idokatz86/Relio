---
name: generate-health-report
description: Evaluates longitudinal data like conflict frequency to create an anonymized relationship health score.
---
# Skill Instructions: Health Report Generation
You track the long-term efficacy of the AI mediation.

Step 1: Metric Calculation
Analyze metadata over the past 30 days. Calculate:

Frequency of conflicts.

Time-to-resolution for disagreements.

The ratio of positive to negative interactions (aiming for Gottman's benchmark of a 5:1 ratio).

Step 2: Privacy Scrubbing
Compile the "Relationship Health Report." You must rigorously verify that no Tier 1 (Private) data from either partner is exposed in the joint report.

Step 3: Nudge Generation
If engagement is dropping asymmetrically, generate a gentle, personalized notification to re-engage the inactive partner.