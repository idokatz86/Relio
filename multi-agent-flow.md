# Relio Multi-Agent Flow Diagram

Below is the Flow Diagram encompassing all 38 agents in the Relio architecture, including the 7-step mediation pipeline, 4 phase agents, and the Solo Venting Mode (Sprint 15-17).

**Excalidraw Instructions:**
To view and edit this natively in Excalidraw:
1. Copy the code block below (everything between the \`\`\`mermaid and \`\`\`).
2. Go to **Excalidraw.com** (or open a new `.excalidraw` in VS Code).
3. Click `Actions (Top Left Menu) -> Insert -> Mermaid` (or simply press `Cmd+Shift+V` / Paste inside Excalidraw).
4. Paste the content, and it will automatically generate all nodes and arrows as perfectly editable blocks!

```mermaid
graph TD
    %% Styling Classes
    classDef medical fill:#e1f5fe,stroke:#2b82cb,stroke-width:2px,color:#000
    classDef ops fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    classDef tech fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    classDef sys fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef pipeline fill:#fce4ec,stroke:#c62828,stroke-width:2px,color:#000

    %% --------------------------------
    %% Top Level Node
    %% --------------------------------
    CEO[chief-executive-officer] ::: sys

    CEO -->|Directs Tech & Product Strategy| CTO[chief-technology-officer]
    CEO -->|Directs Business & Legal| Ops[Operations / Exec Pod]
    CEO -->|Directs Mediation Vision| CPO[chief-psychology-officer]
    
    %% --------------------------------
    %% 7-Step Mediation Pipeline (v4.0)
    %% --------------------------------
    subgraph Pipeline["7-Step Mediation Pipeline"]
        direction LR
        P1[1. PII Redactor] ::: pipeline
        P2[2. Safety Guardian] ::: pipeline
        P3A[3a. Orchestrator] ::: pipeline
        P3B[3b. Profiler] ::: pipeline
        P3C[3c. Dynamics] ::: pipeline
        P4[4. Phase Agent] ::: pipeline
        P5[5. Coach] ::: pipeline
        P6[6. PII Validator] ::: pipeline

        P1 --> P2
        P2 -->|Clear| P3A
        P2 -->|Clear| P3B
        P2 -->|Clear| P3C
        P3A --> P4
        P3B --> P4
        P3C --> P4
        P4 --> P5
        P5 --> P6
        P2 -->|HALT| EMERG[Emergency Response] ::: medical
    end

    %% --------------------------------
    %% Solo Venting Mode (Sprint 15-17)
    %% --------------------------------
    subgraph SoloMode["Solo Venting Mode (v4.0)"]
        direction LR
        SOLO_IN[User Types Frustration] ::: sys
        SOLO_PIPE[Pipeline Translation] ::: pipeline
        SOLO_OUT[Tier 3 Output] ::: sys
        SOLO_COPY[Copy / Share / Send] ::: sys
        SOLO_ATTACH[Attachment Profiling] ::: medical
        SOLO_PATTERN[Pattern Tracking] ::: medical

        SOLO_IN --> SOLO_PIPE
        SOLO_PIPE --> SOLO_OUT
        SOLO_OUT --> SOLO_COPY
        SOLO_PIPE --> SOLO_ATTACH
        SOLO_PIPE --> SOLO_PATTERN
    end

    SOLO_PIPE -.->|Uses| Pipeline

    %% --------------------------------
    %% Phase Routing (4 lifecycle stages)
    %% --------------------------------
    subgraph Phases["Phase Agents — Full Lifecycle"]
        direction TB
        PDAT[phase-dating] ::: medical
        PMAR[phase-married] ::: medical
        PPRE[phase-pre-divorced] ::: medical
        PDIV[phase-divorced] ::: medical
    end

    P4 -.->|dating| PDAT
    P4 -.->|married| PMAR
    P4 -.->|pre-divorced| PPRE
    P4 -.->|divorced| PDIV

    %% --------------------------------
    %% Operations / Executive Pod
    %% --------------------------------
    subgraph Operations Pod
        direction TB
        CRO[chief-revenue-officer] ::: ops
        CFO[chief-finance-officer] ::: ops
        CSO[chief-strategy-officer] ::: ops
        CMO[chief-marketing-officer] ::: ops
        CLO[chief-legal-officer] ::: ops
        CAO[chief-alliance-officer] ::: ops
        CCO[chief-compete-officer] ::: ops

        CLO -->|Privacy Framework| DPO[data-privacy-officer] ::: ops
    end

    Ops --> CRO
    Ops --> CFO
    Ops --> CSO
    Ops --> CMO
    Ops --> CLO
    Ops --> CAO
    Ops --> CCO

    %% --------------------------------
    %% Technology Pod
    %% --------------------------------
    subgraph Tech Pod
        direction TB
        CTO ::: tech
        CPRD[chief-product-officer] ::: tech
        CISO[chief-info-security-officer] ::: tech

        CTO -->|Manages Architecture| CA[cloud-architect] ::: tech
        CTO -->|R&D Leadership| VPRND[vp-rnd] ::: tech
        
        CPRD -->|UI/UX Vision| UX[ui-ux-expert] ::: tech
        UX --> SM[scrum-master] ::: tech
        
        VPRND -->|Agile Management| SM
        
        SM --> Backend[backend-developer] ::: tech
        SM --> Mobile[native-mobile-developer] ::: tech
        
        CA --> Devops_Stub(DevOps/GitOps)
        Devops_Stub --> GHA[github-architect] ::: tech

        Backend --> QA_F[fullstack-qa] ::: tech
        Mobile --> QA_M[mobile-qa] ::: tech
        
        Mobile --> APP_CERT[app-store-certifier] ::: tech

        CISO -->|Security Audit| PT[penetration-tester] ::: tech
        CISO -->|Builds AI Meta| SB[skills-builder] ::: sys
    end

    %% --------------------------------
    %% Medical / Clinical Pod
    %% --------------------------------
    subgraph Medical Pod
        direction TB
        CPO ::: medical
        
        CPO -->|Governs| P3A
        CPO -->|Audits| PSYEDU[psychoeducation-agent] ::: medical
        CPO -->|Tracks| TRACK[progress-tracker] ::: medical
        
        PCRIS[phase-crisis] ::: medical
        
        P5 --> TRACK
        PSYEDU --> TRACK
    end

    %% Cross-pod interactions
    TRACK -.->|Feedback Loop| P3A
    PT -.->|Audits Systems| Backend
    SB -.->|EvoSkill Refines| CPO
    SB -.->|EvoSkill Refines| CTO
    DPO -.->|Data Compliance| CA
    PCRIS -.->|Flooding Detection| P4
```
