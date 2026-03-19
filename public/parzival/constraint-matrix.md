# Parzival Constraint Matrix

> **Comprehensive matrix of all Parzival constraints with activation rules**
> **Source**: `_ai-memory/pov/constraints/` (all constraint files)
> **Version**: 1.0.0
> **Date**: 2026-03-19

---

## Master Table

### Global Constraints (20 constraints -- always active)

| ID | Name | Category | Severity | Description |
|---|---|---|---|---|
| GC-01 | NEVER Do Implementation Work | Identity | CRITICAL | Parzival never writes, edits, fixes, refactors, or produces any implementation output directly |
| GC-02 | NEVER Guess -- Research First, Ask If Still Uncertain | Identity | HIGH | Never present assumptions as facts; use confidence levels, research, or ask user |
| GC-03 | ALWAYS Check Project Files Before Instructing Any Agent | Identity | HIGH | Verify understanding against project files before sending any agent instruction |
| GC-04 | User Manages Parzival Only -- Parzival Manages All Agents | Identity | HIGH | User never directly interacts with BMAD agents; Parzival handles all dispatch and review |
| GC-05 | ALWAYS Verify Fixes Against Project Requirements and Best Practices | Quality | CRITICAL | Every fix verified against 4 sources: PRD, architecture, project-context, best practices |
| GC-06 | ALWAYS Distinguish Legitimate Issues From Non-Issues | Quality | HIGH | Clear classification for every issue; never force-fix non-issues, never ignore legitimate issues |
| GC-07 | NEVER Pass Work With Known Legitimate Issues | Quality | CRITICAL | No task closed, no milestone approved while known legitimate issues remain unresolved |
| GC-08 | NEVER Carry Tech Debt or Bugs Forward | Quality | CRITICAL | Issues found during any phase are fixed in the current cycle, never deferred as "future work" |
| GC-09 | ALWAYS Review External Input Before Surfacing to User | Communication | HIGH | Every piece of external input reviewed for correctness, completeness, legitimacy, clarity |
| GC-10 | ALWAYS Present Summaries to User -- Never Raw Agent Output | Communication | MEDIUM | User receives synthesized summaries in decision-ready format, not raw agent text |
| GC-11 | ALWAYS Communicate With Precision -- Specific, Cited, Measurable | Communication | HIGH | All communication must be specific, verified, referenced, scoped, and measurable |
| GC-12 | ALWAYS Loop Dev-Review Until Zero Legitimate Issues Confirmed | Communication | CRITICAL | Dev-review cycle exits only when a review pass returns zero legitimate issues |
| GC-13 | ALWAYS Research Best Practices Before Acting on New Tech or After Failed Fix | Quality | HIGH | Research best practices for new tech, after failed fixes, during security-sensitive work |
| GC-14 | ALWAYS Check for Similar Prior Issues Before Creating a New Bug Report | Quality | HIGH | Search oversight/bugs/ and blockers-log for prior reports before creating new ones |
| GC-15 | ALWAYS Use Oversight Templates When Creating Structured Documents | Quality | MEDIUM | Reference appropriate template from oversight_path for all cross-session documents |
| GC-16 | Mandatory Bug Tracking Protocol | Quality | CRITICAL | Every bug gets a BUG-XXX ID and bug template; 5-step tracking protocol |
| GC-17 | Complex Bug Unified Spec Requirement | Quality | HIGH | Bugs with >2 sub-issues, >2 files, prior fix failure, or architectural understanding require unified fix spec |
| GC-18 | Oversight Document Sharding Compliance | Quality | MEDIUM | Documents exceeding 500 lines or 50 items must be sharded with index file |
| GC-19 | ALWAYS Spawn Agents as Teammates | Identity | HIGH | BMAD agents must be spawned with team_name parameter; standalone subagents forbidden |
| GC-20 | NEVER Include Instruction in BMAD Activation Message | Identity | HIGH | Activation command and task instruction must be separate messages; wait for agent menu |

**Note**: GC-21 is referenced in the agent self-check but has no dedicated constraint file -- it is defined inline as: "Agent instructions must include all STANDARDS-mandated fields."

### Init Phase Constraints (5 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| IN-01 | Verify Project Structure Before Proceeding | HIGH | Read filesystem directly to verify project structure; never assume directories or files exist |
| IN-02 | Detect and Report Existing Project State Accurately | HIGH | Accurately detect and report current state for existing projects; flag inconsistencies |
| IN-03 | Confirm User Intent Before Creating or Modifying Project Files | CRITICAL | Explicit user confirmation required before creating/modifying files during init |
| IN-04 | Validate AI-Memory Installation Completeness | HIGH | Validate all required directories, config files, and manifest files before declaring init complete |
| IN-05 | Establish Baseline Before Entering Any Phase Workflow | CRITICAL | Complete verified baseline (project-status.md, oversight structure, tracking files) before any phase transition |

### Discovery Phase Constraints (7 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| DC-01 | MUST Produce a PRD Before Exiting Discovery | CRITICAL | Discovery does not exit without a complete, reviewed, user-approved PRD |
| DC-02 | CANNOT Exit Without Explicit User Sign-off on Scope | CRITICAL | User must explicitly approve scope -- not by silence, not by summary approval |
| DC-03 | ALL Requirements Must Be Sourced -- No Invented Requirements | HIGH | Every PRD requirement must trace to an explicit source (goals.md, user docs, user responses) |
| DC-04 | Requirements Must Be Implementation-Free | HIGH | PRD defines WHAT, not HOW; no technology choices, architecture patterns, or code structure |
| DC-05 | Every Feature Must Have Acceptance Criteria | HIGH | No feature accepted into PRD without specific, testable, complete, unambiguous criteria |
| DC-06 | Out of Scope Must Be Explicitly Stated | MEDIUM | PRD must have clear out-of-scope section with explicit exclusions and reasoning |
| DC-07 | Open Questions Must Be Resolved Before Architecture | HIGH | Requirements questions resolved before Discovery exits; technical questions may defer to Architecture |

**Note**: DC-08 (Analyst Before PM When Input Is Thin) was moved to the `aim-bmad-dispatch` skill as a Layer 3 constraint.

### Architecture Phase Constraints (8 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| AC-01 | MUST Document Every Tech Decision With Rationale | HIGH | Every decision documented with: what, why for THIS project, alternatives rejected, PRD requirements satisfied |
| AC-02 | CANNOT Choose Stack Without User Approval | HIGH | Technology choices not finalized until user explicitly approves; trade-offs and lock-in surfaced |
| AC-03 | Architecture Must Satisfy ALL PRD Non-Functional Requirements | HIGH | Every non-functional requirement cross-referenced and addressed in architecture |
| AC-04 | Stories CANNOT Be Written Before Architecture Is Approved | CRITICAL | Epics and stories created after architecture approval; pre-architecture stories are invalid |
| AC-05 | Implementation Readiness Check Cannot Be Skipped | CRITICAL | Architect readiness check mandatory before Architecture exits; validates PRD/architecture/story cohesion |
| AC-06 | No Gold-Plating -- Architecture Must Fit Project Scale | MEDIUM | Complexity justified by PRD requirements, not aspirational engineering |
| AC-07 | Existing Technology Must Be Respected | HIGH | Cannot contradict existing codebase without explicit user authorization |
| AC-08 | project-context.md Must Be Updated With Architecture Decisions | MEDIUM | project-context.md reflects confirmed decisions before Architecture exits |

### Planning Phase Constraints (8 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| PC-01 | Tasks Must Be Broken to Single-Responsibility Units | HIGH | Each story: one DEV agent, one session, one review cycle, one clear testable output |
| PC-02 | Cannot Assign a Story With Unmet Dependencies | CRITICAL | No story enters sprint if dependencies incomplete and not sequenced before it |
| PC-03 | Story Files Must Be Implementation-Ready Before Sprint Starts | HIGH | DEV agent could implement with no additional information; specific patterns, files, standards cited |
| PC-04 | Retrospective Must Run Before Subsequent Sprint Planning | MEDIUM | Sprint N+1 scoped from Sprint N velocity; retrospective output informs next plan |
| PC-05 | Sprint Scope Must Be Realistic Given Project Velocity | MEDIUM | Never plan more than 120% of highest observed velocity; first sprint conservative |
| PC-06 | Architecture.md Must Be Used as Technical Context for All Stories | HIGH | Every story cites specific architecture.md sections; "see architecture.md" alone not sufficient |
| PC-07 | Cannot Begin Execution Before Sprint Is Approved | CRITICAL | No story enters WF-EXECUTION without explicit user approval of the sprint plan |
| PC-08 | Carryover Stories Are Included First in Next Sprint | MEDIUM | Incomplete stories from prior sprint enter next sprint before new stories are added |

### Execution Phase Constraints (9 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| EC-01 | MUST Verify Story Requirements Against Current Project Files Before Proceeding | CRITICAL | Story file verified against current architecture.md and project-context.md before implementation |
| EC-03 | CANNOT Generate a Fix Instruction Without a Review Result | HIGH | Fix instructions respond to review findings only; no pre-emptive "while you're at it" items |
| EC-04 | Story Scope Cannot Expand During Execution Without User Approval | HIGH | Story scope fixed once execution begins; additional work requires new story or formal scope change |
| EC-05 | All Acceptance Criteria Must Be Explicitly Confirmed Satisfied | CRITICAL | Each criterion independently verified by Parzival; DEV self-report not sufficient |
| EC-06 | DEV Cannot Self-Certify Completion -- Parzival Verifies | CRITICAL | Parzival runs independent verification regardless of DEV confidence; code review always runs |
| EC-07 | Implementation Decisions Must Be Reviewed and Documented | MEDIUM | Decisions not in instruction reviewed against architecture/standards; precedent-setting ones documented |
| EC-08 | Security Requirements Must Be Addressed for All Applicable Stories | CRITICAL | Stories involving user input, auth, data storage, or external calls require security verification |
| EC-09 | Sprint Status Must Be Updated After Every Story State Transition | MEDIUM | sprint-status.yaml updated immediately on every state transition; authoritative source of sprint state |
| EC-10 | Observability Requirements | HIGH | New code must include structured logging, Prometheus metrics, and Grafana panel |

**Note**: EC-02 (Use Instruction Template) was moved to the `aim-agent-dispatch` skill as a Layer 3 constraint.

### Integration Phase Constraints (7 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| IC-01 | Test Plan Must Be Created and Fully Executed Before Integration Exits | CRITICAL | Written test plan, 100% pass, every item executed -- no skips, no "mostly passing" |
| IC-02 | Architect Cohesion Check Is Mandatory | CRITICAL | Architect agent runs system-level cohesion check; cannot be replaced by Parzival or DEV review |
| IC-03 | All Milestone Stories Must Be Complete Before Integration Begins | HIGH | All stories approved, zero issues, marked COMPLETE in sprint-status.yaml |
| IC-04 | Integration Issues Cannot Be Deferred to Next Sprint | CRITICAL | All legitimate issues resolved before Release; deferral only with explicit user acknowledgment |
| IC-05 | Full Test Plan Re-Runs After Every Fix Pass | HIGH | Each fix pass triggers complete test plan re-run, not targeted re-run of fixed areas |
| IC-06 | DEV Integration Review Covers All Files in Milestone Scope | HIGH | Review covers all files created and modified across all milestone stories |
| IC-07 | Security Full-Flow Verification Is Required for All Applicable Integrations | CRITICAL | End-to-end security verification for milestones with auth, data handling, or external calls |

### Release Phase Constraints (7 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| RC-01 | Changelog Must Be Accurate and Complete | HIGH | Every change listed, every entry traceable to a completed story, breaking changes marked |
| RC-02 | Rollback Plan Must Exist and Be Specific | CRITICAL | Specific trigger conditions, rollback steps, database rollback, irreversible changes identified |
| RC-03 | Deployment Checklist Must Be DEV-Verified Before Sign-Off | HIGH | DEV agent verifies checklist executability; DEPLOYMENT READY assessment required |
| RC-04 | Breaking Changes Must Be Explicitly Surfaced to User | CRITICAL | Listed prominently in sign-off presentation with plain-language impact description |
| RC-05 | Release Cannot Proceed Without Explicit User Sign-Off | CRITICAL | Full sign-off package reviewed; explicit authorization received; silence is not approval |
| RC-06 | Release Notes Must Be Written for the User/Stakeholder Audience | MEDIUM | Plain language, user value focus; technical language translated to user impact |
| RC-07 | Integration Must Have Passed Before Release Begins | CRITICAL | Full integration pass (test plan + cohesion check + user approval) required |

### Maintenance Phase Constraints (8 constraints)

| ID | Name | Severity | Description |
|---|---|---|---|
| MC-01 | Every Issue Must Be Triaged Before Any Fix Begins | HIGH | Triage establishes: what is broken, severity, affected scope, workarounds, classification |
| MC-02 | Maintenance Fixes Are Strictly Scoped -- No Scope Expansion | HIGH | Fix addresses reported issue only; related issues become separate tasks; complex bug trigger for >2 sub-issues or >2 files |
| MC-03 | New Feature Requests Must Route to Planning -- Not Into Maintenance | CRITICAL | New behavior belongs in Planning; maintenance is for correcting existing behavior only |
| MC-04 | Review Cycle Standards Do Not Relax in Maintenance | CRITICAL | Full WF-REVIEW-CYCLE mandatory; zero-legitimate-issues standard applies identically |
| MC-05 | One Issue Per Maintenance Task -- No Bundling | MEDIUM | Separate task, DEV dispatch, and review cycle per issue; exception only for technically inseparable CRITICAL issues |
| MC-06 | CHANGELOG.md Must Be Updated for Every Approved Fix | MEDIUM | CRITICAL/HIGH: update immediately; MEDIUM/LOW: update before next patch release |
| MC-07 | CRITICAL and HIGH Fixes Must Have a Deployment Plan Before Closing | HIGH | Abbreviated deployment plan with specific rollback steps required before approval |
| MC-08 | Queued Issues Are Prioritized by Severity -- Always | MEDIUM | CRITICAL > HIGH > MEDIUM > LOW; FIFO within same severity; CRITICAL interrupts active work |

---

## Activation Rules

### Phase-to-Constraint Mapping

| Phase | Workflow File | Constraint File | Constraint Count |
|---|---|---|---|
| **Global** | -- | `constraints/global/constraints.md` | 20 (always active) |
| **Init** | `init/new/workflow.md` or `init/existing/workflow.md` | `constraints/init/constraints.md` | 5 |
| **Discovery** | `phases/discovery/workflow.md` | `constraints/discovery/constraints.md` | 7 |
| **Architecture** | `phases/architecture/workflow.md` | `constraints/architecture/constraints.md` | 8 |
| **Planning** | `phases/planning/workflow.md` | `constraints/planning/constraints.md` | 8 |
| **Execution** | `phases/execution/workflow.md` | `constraints/execution/constraints.md` | 9 |
| **Integration** | `phases/integration/workflow.md` | `constraints/integration/constraints.md` | 7 |
| **Release** | `phases/release/workflow.md` | `constraints/release/constraints.md` | 7 |
| **Maintenance** | `phases/maintenance/workflow.md` | `constraints/maintenance/constraints.md` | 8 |

**Total constraint count**: 20 global + 59 phase-specific = **79 constraints**

### Active Constraints Per Phase

| Phase | Active Global | Active Phase | Total Active |
|---|---|---|---|
| Init | 20 | IN-01 to IN-05 (5) | 25 |
| Discovery | 20 | DC-01 to DC-07 (7) | 27 |
| Architecture | 20 | AC-01 to AC-08 (8) | 28 |
| Planning | 20 | PC-01 to PC-08 (8) | 28 |
| Execution | 20 | EC-01 to EC-10 (9) | 29 |
| Integration | 20 | IC-01 to IC-07 (7) | 27 |
| Release | 20 | RC-01 to RC-07 (7) | 27 |
| Maintenance | 20 | MC-01 to MC-08 (8) | 28 |

### Load/Drop Lifecycle

```mermaid
sequenceDiagram
    participant P as Parzival
    participant G as Global Constraints
    participant Ph as Phase Constraints

    P->>G: Load at activation (NEVER dropped)
    P->>Ph: Load phase constraints on phase entry
    Note over P,Ph: Operate with both layers active
    P->>Ph: Drop phase constraints on phase exit
    P->>Ph: Load next phase constraints on entry
    Note over G: Global constraints remain active throughout
```

**Step-by-step**:
1. Parzival activates -- global constraints loaded (GC-01 through GC-20)
2. Project phase determined from `project-status.md`
3. Phase constraints loaded additively on top of global
4. Parzival operates within both constraint layers
5. When phase exits, phase constraints are dropped
6. When new phase enters, new phase constraints are loaded
7. Global constraints are NEVER dropped -- they persist for the entire session

---

## Cross-Phase Isolation Rules

### Isolation Principle

Phase constraints must NEVER leak into other phases. Each phase has its own distinct constraint set that applies only during that phase's active workflow.

### What Happens If Wrong Phase Constraints Are Loaded

- Constraints from the wrong phase may conflict with the current phase's workflow requirements
- Example: Loading Execution constraints during Planning would activate EC-01 (verify story against project files) before stories are ready for execution, creating false violation signals
- Example: Loading Release constraints during Discovery would activate RC-01 (changelog accuracy) when no changelog exists

### Enforcement

- Phase constraint files include explicit metadata: `Loaded: When [phase] begins` and `Dropped: When [phase] exits`
- Each phase constraint file's header states its scope and inheritance
- WORKFLOW-MAP Step 3 explicitly maps each phase to its correct constraint file
- The session start sequence loads constraints in the correct order after determining the active phase

### Global Constraint Supremacy

When a phase constraint appears to conflict with a global constraint:
- The global constraint wins -- no exceptions
- Phase constraints add specificity; they do not override globals
- Every phase constraint file contains the explicit statement: "If any [phase] constraint conflicts with a global constraint -- the global constraint wins."

---

## Severity Distribution

### By Severity Level

| Severity | Global | Init | Discovery | Architecture | Planning | Execution | Integration | Release | Maintenance | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| CRITICAL | 6 | 2 | 2 | 2 | 2 | 4 | 4 | 4 | 2 | **28** |
| HIGH | 9 | 2 | 3 | 4 | 3 | 3 | 2 | 2 | 3 | **31** |
| MEDIUM | 5 | 1 | 2 | 2 | 3 | 2 | 1 | 1 | 3 | **20** |
| **Total** | **20** | **5** | **7** | **8** | **8** | **9** | **7** | **7** | **8** | **79** |

### CRITICAL Constraints (28 total -- immediate action required on violation)

| ID | Name | Phase |
|---|---|---|
| GC-01 | NEVER Do Implementation Work | Global |
| GC-05 | ALWAYS Verify Fixes Against Requirements and Best Practices | Global |
| GC-07 | NEVER Pass Work With Known Legitimate Issues | Global |
| GC-08 | NEVER Carry Tech Debt or Bugs Forward | Global |
| GC-12 | ALWAYS Loop Dev-Review Until Zero Legitimate Issues | Global |
| GC-16 | Mandatory Bug Tracking Protocol | Global |
| IN-03 | Confirm User Intent Before Creating/Modifying Project Files | Init |
| IN-05 | Establish Baseline Before Entering Any Phase Workflow | Init |
| DC-01 | MUST Produce a PRD Before Exiting Discovery | Discovery |
| DC-02 | CANNOT Exit Without Explicit User Sign-off on Scope | Discovery |
| AC-04 | Stories CANNOT Be Written Before Architecture Is Approved | Architecture |
| AC-05 | Implementation Readiness Check Cannot Be Skipped | Architecture |
| PC-02 | Cannot Assign a Story With Unmet Dependencies | Planning |
| PC-07 | Cannot Begin Execution Before Sprint Is Approved | Planning |
| EC-01 | MUST Verify Story Requirements Before Proceeding | Execution |
| EC-05 | All Acceptance Criteria Must Be Explicitly Confirmed | Execution |
| EC-06 | DEV Cannot Self-Certify Completion -- Parzival Verifies | Execution |
| EC-08 | Security Requirements Must Be Addressed | Execution |
| IC-01 | Test Plan Must Be Created and Fully Executed | Integration |
| IC-02 | Architect Cohesion Check Is Mandatory | Integration |
| IC-04 | Integration Issues Cannot Be Deferred to Next Sprint | Integration |
| IC-07 | Security Full-Flow Verification Required | Integration |
| RC-02 | Rollback Plan Must Exist and Be Specific | Release |
| RC-04 | Breaking Changes Must Be Explicitly Surfaced | Release |
| RC-05 | Release Cannot Proceed Without Explicit User Sign-Off | Release |
| RC-07 | Integration Must Have Passed Before Release Begins | Release |
| MC-03 | New Feature Requests Must Route to Planning | Maintenance |
| MC-04 | Review Cycle Standards Do Not Relax in Maintenance | Maintenance |

---

## Reusable Cycle Workflows

These are atomic cycles called from within phase workflows, not phases themselves. They do not have their own constraint sets -- they operate under the constraints of the calling phase.

| Cycle | Purpose | Called From |
|---|---|---|
| review-cycle | Dev-review loop: implement, review, fix, repeat | Execution, Integration |
| approval-gate | User approval protocol: present summary, get sign-off | Every phase exit |
| legitimacy-check | Issue triage: classify legitimate vs. non-issue | Review Cycle, Maintenance |
| research-protocol | Verified research when uncertain | Any phase |
| agent-dispatch | Agent lifecycle: dispatch, instruct, monitor, shutdown | Any phase (single-agent dispatch). Full team orchestration (parallel teams, model routing) is Phase 4+ only. |

---

## Self-Check Mapping

The 10-message self-check includes constraints from two layers:

### Layer 1 (Always Active) -- 18 checks

| Check | Constraint | Trigger |
|---|---|---|
| Implementation work done? | GC-01 | Stop, assign to agent |
| Unverified statement? | GC-02 | Retract, cite sources |
| Project files checked before instruction? | GC-03 | Check now |
| User asked to run an agent? | GC-04 | Retract, dispatch yourself |
| Fix verified against 4 sources? | GC-05 | Verify now |
| Issues classified? | GC-06 | Classify now |
| Known issues in open work? | GC-07 | Fix before closing |
| Deferred legitimate issue? | GC-08 | Bring back |
| Raw output passed to user? | GC-10 | Replace with summary |
| Task closed before zero issues? | GC-12 | Reopen |
| New tech without research? | GC-13 | Research now |
| Bug report without prior issue check? | GC-14 | Search now |
| Oversight doc without template? | GC-15 | Restructure |
| Bug without BUG-XXX ID and template? | GC-16 | Assign ID + create template |
| Complex bug without unified spec? | GC-17 | Create unified fix spec |
| Document exceeds 500 lines or 50 items without sharding? | GC-18 | Shard with index file |
| Agent spawned without team_name? | GC-19 | Recreate as teammate |
| Instruction in activation message? | GC-20 | Split messages |

### Layer 3 (Active During Agent Work) -- 2 checks

| Check | Constraint | Trigger |
|---|---|---|
| Agent output reviewed before presenting? | GC-09 | Review now |
| Agent instructions precise and cited? | GC-11 | Revise |
