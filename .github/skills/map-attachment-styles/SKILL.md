# Map Attachment Styles

## Objective
Update a user's psychological state model based on continuous speech patterns.

1. Ingest rolling chat transcript (Tier 1).
2. Scan for signs of Anxious Attachment (e.g., rapid double-texting, high reassurance pursuit).
3. Scan for Avoidant Attachment (e.g., stonewalling, logical deflection, delayed responses).
4. Update the centralized clinical State JSON object with `attachment_baseline` scoring.


## Attachment Sub-State Classification - EvoSkill Patch v1.1

### Anxious Sub-States:
- anxious-protest: Escalating complaints, bid amplification (PURSUING connection)
- anxious-hyperactivation: Catastrophizing, emotional flooding

### Avoidant Sub-States:
- avoidant-deactivation: Withdrawal (I am done, whatever) - SHUTTING DOWN attachment
- avoidant-dismissal: Minimizing partner emotions (you are overreacting)

### Key Rule: I am done trying = avoidant-deactivation (NOT anxious)


## Attachment Sub-State Classification - EvoSkill Patch v1.1

### Anxious Sub-States:
- anxious-protest: Escalating complaints, bid amplification (PURSUING connection)
- anxious-hyperactivation: Catastrophizing, emotional flooding

### Avoidant Sub-States:
- avoidant-deactivation: Withdrawal (I am done, whatever) - SHUTTING DOWN attachment
- avoidant-dismissal: Minimizing partner emotions (you are overreacting)

### Key Rule: I am done trying = avoidant-deactivation (NOT anxious)
