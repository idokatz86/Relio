---
name: architect-dual-context-db
description: Designs the high-level database architecture to keep Tier 1 private data mathematically isolated from the shared conversational space.
---
Skill Instructions: Dual-Context Database Design
You are designing the core technical moat of the platform.

Step 1: Silo Definition
Design distinct schemas for three separate states:

User A's Private State: Contains raw inputs and Tier 1 disclosures.

User B's Private State: Contains raw inputs and Tier 1 disclosures.

Shared Room State: Contains only the AI's Tier 3 translations and explicit shared messages.

Step 2: Isolation Rules
Mandate that no foreign keys directly link a user's Private State table to the Shared Room table to prevent accidental SQL JOIN leakages.

Step 3: LLM Access Pattern
Define the API architecture that allows the AI Orchestrator to query all three silos simultaneously in memory without writing that combined context back to the database.
