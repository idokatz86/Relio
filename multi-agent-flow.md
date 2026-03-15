# Relio Multi-Agent Flow Diagram

Below is the Flow Diagram encompassing all 37 agents in the Relio architecture. 

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

    %% --------------------------------
    %% Top Level Node
    %% --------------------------------
    CEO[chief-executive-officer] ::: sys
    ORCH[orchestrator-agent] ::: sys

    CEO -->|Directs Tech & Product Strategy| CTO[chief-technology-officer]
    CEO -->|Directs Business & Legal| Ops[Operations / Exec Pod]
    CEO -->|Directs Mediation Vision| CPO[chief-psychology-officer]
    
    %% --------------------------------
    %% System & Orchestration
    %% --------------------------------
    ORCH -->|Routes User Context| CLIN_TRIAGE(Clinical Triage)

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
        
        CLIN_TRIAGE --> SAFETY[safety-guardian] ::: medical
        SAFETY -->|Clear| PROFILE[individual-profiler] ::: medical
        SAFETY -->|Danger| ESCALATE(Hard Stops / Red Flags)

        PROFILE -->|Analyzes| RD[relationship-dynamics] ::: medical
        RD -->|Phase Routing| PHASES(Conflict Phases)
        
        PHASES --> PDAT[phase-dating] ::: medical
        PHASES --> PCOM[phase-commitment] ::: medical
        PHASES --> PCRIS[phase-crisis] ::: medical
        PHASES --> PSEP[phase-separation] ::: medical
        PHASES --> PPOST[phase-post-divorce] ::: medical
        
        PHASES --> RESOLVE(Clinical Remediation)
        
        RESOLVE --> COACH[communication-coach] ::: medical
        RESOLVE --> PSYEDU[psychoeducation-agent] ::: medical
        
        COACH --> TRACK[progress-tracker] ::: medical
        PSYEDU --> TRACK
    end

    %% Cross-pod interactions
    TRACK -.->|Feedback Loop| ORCH
    PT -.->|Audits Systems| Backend
    SB -.->|EvoSkill Refines| CPO
    SB -.->|EvoSkill Refines| CTO
    DPO -.->|Data Compliance| CA
```
