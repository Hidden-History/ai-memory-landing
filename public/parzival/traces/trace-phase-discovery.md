# Trace Report: Discovery Phase Workflow

> **Workflow**: `workflows/phases/discovery/workflow.md`
> **Traced**: 2026-03-19
> **Status**: ISSUE FOUND (1 stale constraint count in constraints.md)

---

## 1. Routing Verification

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Trigger | Phase 1 after init baseline, no approved PRD | Correct per WORKFLOW-MAP | PASS |
| Entry from | WF-INIT-NEW (step-07 approval) or WF-INIT-EXISTING (step-06 approval) | Both reference WF-DISCOVERY as exit | PASS |
| Constraints loaded | Global + Discovery (DC-01 to DC-07) | workflow.md: "CONSTRAINTS-GLOBAL + CONSTRAINTS-DISCOVERY" | PASS |
| Constraints dropped on exit | Discovery constraints | step-07: "Drop: {constraints_path}/discovery/ constraints" | PASS |
| Exit route | WF-ARCHITECTURE | step-07: "Load: {workflows_path}/phases/architecture/workflow.md" | PASS |
| Exit condition | PRD.md approved by user with explicit sign-off | step-07 approval gate requires explicit sign-off | PASS |
| Context slice | goals.md + PRD draft (if exists) | Matches WORKFLOW-MAP table | PASS |

---

## 2. Step Chain Verification

| Step | File | nextStepFile | Target Exists | PASS/FAIL |
|------|------|-------------|---------------|-----------|
| workflow.md | firstStep: `./steps/step-01-assess-existing-inputs.md` | -- | YES | PASS |
| step-01 | `./step-02-analyst-research.md` | -- | YES | PASS |
| step-02 | `./step-03-pm-creates-prd.md` | -- | YES | PASS |
| step-03 | `./step-04-parzival-reviews-prd.md` | -- | YES | PASS |
| step-04 | `./step-05-user-review-iteration.md` | -- | YES | PASS |
| step-05 | `./step-06-prd-finalization.md` | -- | YES | PASS |
| step-06 | `./step-07-approval-gate.md` | -- | YES | PASS |
| step-07 | (none -- terminal step) | -- | N/A | PASS |

### Conditional Skip (step-01)

step-01 classifies the input scenario and can skip step-02:
- **Scenario A** (rich input): Skip step-02, load step-03 directly
- **Scenario B/C** (thin input or existing codebase): Follow nextStepFile to step-02

This is by design — Analyst research is unnecessary when the user has already provided detailed specs. The skip is within the same workflow and doesn't break phase isolation.

### Within-Step Loops

- **step-04**: Review → find issues → dispatch PM correction → re-review. Loops within the step until all checks pass.
- **step-05**: Present to user → feedback → send to PM → PM updates → re-review → present again. Loops until user has no more changes.

Both are within-step iterations, not step chain breaks. Correct pattern.

---

## 3. Constraint Enforcement Verification

Each discovery constraint mapped to the step(s) that enforce it:

| Constraint | Enforced By | How |
|-----------|------------|-----|
| DC-01: MUST produce PRD | step-03 (PM creates), step-04 (Parzival reviews), step-06 (finalization) | PRD is the mandatory output of this workflow |
| DC-02: Explicit user sign-off | step-05 (user review), step-07 (approval gate with [A]/[R]/[H]) | User must explicitly approve; silence is not approval |
| DC-03: Sourced requirements only | step-02 (Analyst: "No invented requirements"), step-04 ("No invented requirements" check) | Both Analyst instruction and Parzival review check for this |
| DC-04: Implementation-free | step-03 ("Implementation-free -- WHAT, not HOW"), step-04 (quality check) | Both PM instruction and Parzival review enforce this |
| DC-05: Acceptance criteria required | step-03 (PRD must include criteria), step-04 (completeness check) | PM instruction requires it, Parzival verifies |
| DC-06: Out of scope stated | step-03 (PRD must include "Out of scope"), step-06 (scope summary) | PM instruction requires it, approval package includes it |
| DC-07: Open questions resolved | step-02 (resolve questions before PRD), step-07 (approval package lists open questions) | Questions are resolved iteratively before exit |

**All 7 discovery constraints are actively enforced by workflow steps.**

---

## 4. Phase Isolation Verification

| Check | Status | Notes |
|-------|--------|-------|
| No architecture constraints referenced | PASS | |
| No planning or execution concepts in steps | PASS | |
| No code implementation performed | PASS | All work is requirements and documentation |
| Agent dispatches are single-agent (not Mode 3) | PASS | Analyst (step-02), PM (steps 03-05). Sequential, not parallel teams. |
| Agent dispatches use agent-dispatch cycle | PASS | All 4 dispatch points reference `{workflows_path}/cycles/agent-dispatch/workflow.md` |
| No forward-phase work performed | PASS | step-07 scope change protocol mentions future phases but only as impact assessment context |

---

## 5. Cycle Invocation Verification

| Step | Cycle Invoked | Appropriate? |
|------|--------------|-------------|
| step-02 | agent-dispatch (Analyst) | YES -- research before PRD creation |
| step-03 | agent-dispatch (PM) | YES -- PM creates PRD |
| step-04 | agent-dispatch (PM correction, if needed) | YES -- batched corrections |
| step-05 | agent-dispatch (PM correction from user feedback) | YES -- user-driven iteration |
| step-07 | approval-gate | YES -- required at phase exit |

No other cycles invoked. Specifically:
- review-cycle: NOT invoked (correct -- no code to review)
- legitimacy-check: NOT invoked (correct -- no implementation issues to classify)
- research-protocol: NOT invoked explicitly in steps, but could be invoked from step-02 if Analyst needs deeper research. This would be initiated from within the agent-dispatch cycle, not from the discovery step chain itself.

---

## 6. Exit Behavior Verification

On user approval in step-07:

| Action | Verified |
|--------|----------|
| Update project-status.md: phases_complete.discovery = true | YES |
| Update project-status.md: current_phase = architecture | YES |
| Update decisions.md with key PRD decisions | YES |
| Load architecture workflow | YES: `{workflows_path}/phases/architecture/workflow.md` |
| Load architecture constraints | YES: `{constraints_path}/architecture/` |
| Drop discovery constraints | YES: `{constraints_path}/discovery/` |
| Communicate next step to user | YES: "Activating Architect agent to design technical architecture" |

**Clean handoff to WF-ARCHITECTURE confirmed.**

---

## 7. Issues Found

### ISSUE 1: Stale Global Constraint Count in Discovery Constraints (LOW)

**Location**: `constraints/discovery/constraints.md`, lines 13 and 47

**Problem**: States "All 15 global constraints" and "all 15 global constraint checks" but there are 17 global constraints (GC-01 through GC-15, GC-19, GC-20). GC-19 and GC-20 were added after this file was written.

**Impact**: Low -- the self-check schedule already says "PLUS all ... global constraint checks from global/constraints.md" which would catch the full set by reference. But the count is wrong.

**Fix**: Change "15" to "17" in both locations.

---

## 8. Summary

| Category | Result |
|----------|--------|
| Step chain integrity | PASS (7 steps, all linked, conditional skip in step-01 by design) |
| Constraint enforcement | PASS (all 7 DC constraints actively enforced) |
| Constraint isolation | PASS (no cross-phase contamination) |
| Cycle usage | PASS (agent-dispatch for Analyst/PM, approval-gate at exit) |
| Phase transition | PASS (clean exit to WF-ARCHITECTURE) |
| File path accuracy | PASS (all paths correct) |
| Mode 3 isolation | PASS (single-agent dispatches only) |
| Constraint file accuracy | **LOW ISSUE** (stale count "15" should be "17") |

**Overall**: 1 low-severity issue (stale count). Workflow is structurally sound, all constraints enforced, clean phase transitions.
