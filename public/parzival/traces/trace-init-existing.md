# Trace Report: Init Existing Workflow

> **Workflow**: `workflows/init/existing/workflow.md`
> **Traced**: 2026-03-19
> **Status**: ISSUES FOUND (1 path error, 2 observations)

---

## 1. Routing Verification

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Trigger | project-status.md exists but baseline incomplete, OR project exists with no project-status.md | Correct per WORKFLOW-MAP Step 1 | PASS |
| Constraints loaded | Global + Init (IN-01 to IN-05) | workflow.md header: "CONSTRAINTS-GLOBAL + CONSTRAINTS-INIT" | PASS |
| Constraints dropped on exit | Init constraints | step-06: "Drop {constraints_path}/init/ constraints" | PASS |
| Exit route | Correct phase based on audit | step-06 has branch-specific routing table | PASS |
| Exit condition | Audit complete, state documented, user confirms | step-06 approval gate requires explicit sign-off | PASS |

---

## 2. Step Chain Verification

### Common Path

| Step | File | nextStepFile | Target Exists | PASS/FAIL |
|------|------|-------------|---------------|-----------|
| workflow.md | firstStep: `./steps/step-01-read-existing-files.md` | -- | YES | PASS |
| step-01 | `./step-02-run-analyst-audit.md` | -- | YES | PASS |
| step-02 | `./step-03-identify-branch.md` | -- | YES | PASS |
| step-03 | (none -- branches to 4 branch files) | -- | N/A | PASS (by design) |
| step-04 | `./step-05-verify-understanding.md` | -- | YES | PASS |
| step-05 | `./step-06-present-and-approve.md` | -- | YES | PASS |
| step-06 | (none -- terminal step) | -- | N/A | PASS |

### Branch Reconnection (step-03 → branches → step-04)

step-03 has no `nextStepFile` because it routes to one of 4 branch files. The reconnection to step-04 is specified in two places:

1. **step-03 section 5**: "After Branch Work Completes ... Load `./step-04-establish-baseline.md`"
2. **Each branch file**: "When all branch steps are complete, return to the common path: step-04-establish-baseline.md"

Both point to the same target. The branching pattern works because:
- step-03 determines the branch and loads the branch file
- The branch file executes its steps
- The branch file's completion note returns to step-04
- step-04 resumes the common path with nextStepFile → step-05 → step-06

### Branch File Existence

| Branch | File | Exists |
|--------|------|--------|
| A: Active Mid-Sprint | `branches/branch-a-active-sprint/branch-steps.md` | YES |
| B: Legacy/Undocumented | `branches/branch-b-messy-undocumented/branch-steps.md` | YES |
| C: Paused/Restarting | `branches/branch-c-paused-restarting/branch-steps.md` | YES |
| D: Team Handoff | `branches/branch-d-handoff-from-team/branch-steps.md` | YES |

---

## 3. Constraint Reference Verification

| Step/Branch | Constraint Referenced | Constraint Active? | Correct? |
|-------------|----------------------|-------------------|----------|
| step-02 | agent-dispatch cycle (Analyst) | Cycles inherit calling constraints | PASS |
| step-03 | None explicitly | -- | PASS |
| branch-b | IN-04 (validate installation) | YES (init constraints loaded) | PASS |
| branch-d | None explicitly | -- | PASS |
| step-06 | Approval gate cycle | Cycles inherit calling constraints | PASS |
| step-06 | Drops init, loads target phase constraints | Correct lifecycle | PASS |

**No steps reference constraints from other phases.**

---

## 4. Phase Isolation Verification

| Check | Status | Notes |
|-------|--------|-------|
| No discovery constraints referenced during init | PASS | |
| No execution constraints referenced during init | PASS | |
| Agent dispatch in init is single-agent only (not Mode 3) | PASS | step-02 dispatches Analyst; branch-b dispatches Analyst + PM; branch-d dispatches Analyst. All single-agent, read/audit operations |
| No implementation work performed | PASS | All agent dispatches are for audit/documentation, not implementation |
| Branches determine exit route, not execute phase work | PASS | Each branch ends with "Determine Exit Route" pointing to the correct phase |

### Branch-by-Branch Isolation Check

**Branch A (Active Mid-Sprint)**:
- Reads sprint status, stories, code — all read-only audit actions
- Notes issues "for the review cycle" — documenting, not running the cycle
- Exit: WF-EXECUTION or WF-PLANNING (appropriate)
- **Verdict**: CLEAN

**Branch B (Legacy/Undocumented)**:
- Dispatches Analyst to generate project-context.md — audit action
- Dispatches PM to update outdated PRD — see OBSERVATION 1
- Creates missing baseline files — consistent with IN-05
- Exit: WF-DISCOVERY, WF-ARCHITECTURE, or WF-PLANNING (appropriate)
- **Verdict**: OBSERVATION noted

**Branch C (Paused/Restarting)**:
- Validates requirements, sprint state, external changes — all verification
- No agent dispatches within branch
- Exit: WF-EXECUTION, WF-PLANNING, or WF-DISCOVERY (appropriate)
- **Verdict**: CLEAN

**Branch D (Team Handoff)**:
- Deep Analyst audit — appropriate for zero-context handoff
- Documents user answers in decisions.md — appropriate
- Exit: varies by confirmed state
- **Verdict**: CLEAN

---

## 5. Cycle Invocation Verification

| Step/Branch | Cycle Invoked | Appropriate for Init? |
|-------------|--------------|----------------------|
| step-02 | agent-dispatch (Analyst) | YES -- WORKFLOW-MAP says "Agents: Analyst (for codebase audit if needed)" |
| branch-b | agent-dispatch (Analyst) | YES -- generating project-context from scan |
| branch-b | agent-dispatch (PM) | YES with reservation -- see OBSERVATION 1 |
| branch-d | agent-dispatch (Analyst) | YES -- deeper audit for zero-context scenario |
| step-05 | aim-best-practices-researcher (skill) | YES -- seeds knowledge base before phase work |
| step-06 | approval-gate | YES -- required at phase exit |

No other cycles invoked. Specifically:
- review-cycle: NOT invoked (correct -- no implementation to review)
- legitimacy-check: NOT invoked (correct -- auditing, not classifying issues)

---

## 6. Exit Behavior Verification

step-06 has comprehensive routing for all branch+state combinations:

| Branch | State | Exit Route | Constraints Loaded | Correct? |
|--------|-------|-----------|-------------------|----------|
| A (Active Sprint) | Continuing story | WF-EXECUTION + execution constraints | YES | PASS |
| B (Legacy) | No PRD | WF-DISCOVERY + discovery constraints | YES | PASS |
| B (Legacy) | PRD exists, no arch | WF-ARCHITECTURE + architecture constraints | YES | PASS |
| B (Legacy) | Both exist | WF-PLANNING + planning constraints | YES | PASS |
| C (Paused) | Sprint valid | WF-EXECUTION + execution constraints | YES | PASS |
| C (Paused) | Sprint stale | WF-PLANNING + planning constraints | YES | PASS |
| D (Handoff) | Varies | Appropriate phase | YES | PASS |

For ALL exits: init constraints dropped, target phase constraints loaded, project-status.md updated, user confirms.

---

## 7. Issues Found

### ISSUE 1: Ambiguous Branch File Paths in step-03 (MEDIUM)

**Location**: step-03-identify-branch.md, section 4 (lines 81-86)

**Problem**: step-03 references branch files with `./branches/...` paths:
```
- **Branch A:** Load `./branches/branch-a-active-sprint/branch-steps.md`
```

step-03 is located at `init/existing/steps/step-03-identify-branch.md`. The `./` prefix resolves relative to its own directory (`steps/`), which would mean `steps/branches/...` — but the branches are at `init/existing/branches/`.

workflow.md uses the same `./branches/...` notation but is located at `init/existing/workflow.md`, where it resolves correctly.

**Risk**: An agent strictly interpreting `./` as relative to the current file's location would look in the wrong directory. In practice, LLMs tend to resolve paths relative to the workflow context, so this may not cause runtime failures. But it's imprecise.

**Fix**: Change step-03 references to use explicit paths:
```
- **Branch A:** Load `{workflows_path}/init/existing/branches/branch-a-active-sprint/branch-steps.md`
```

Or use relative paths from step-03's location:
```
- **Branch A:** Load `../branches/branch-a-active-sprint/branch-steps.md`
```

---

### OBSERVATION 1: Branch B Dispatches PM to Update PRD (LOW)

**Location**: branch-b-messy-undocumented.md, section 3

**Content**: "IF PRD exists but is outdated: ... Activate PM via agent dispatch to update PRD based on audit findings"

**Question**: Is updating a PRD within init's scope, or is that Discovery's job?

**Analysis**:
- Init's purpose: understand the current state and establish baseline
- Discovery's purpose: produce a validated PRD
- Branch B is updating an EXISTING outdated PRD to reflect current reality — this serves the init goal of accurate documentation
- If the PRD update were skipped, Parzival couldn't accurately determine whether to route to Discovery or Architecture (routing depends on PRD validity)

**Verdict**: Acceptable. The PM updates the PRD to reflect reality (audit-driven correction), not to create new requirements (which would be Discovery work). The user must still approve the updated PRD. However, this could be simplified by just routing to WF-DISCOVERY with a note that the PRD needs updating — Discovery's DC-01 constraint ("MUST Produce a PRD Before Exiting Discovery") would handle it.

**No fix required** — flagged for awareness.

---

### OBSERVATION 2: Branch D Exit Route Is Less Prescriptive (LOW)

**Location**: branch-d-handoff-from-team.md, section 7

**Content**: "Route to appropriate phase based on what was confirmed"

**Comparison**: Branches A, B, and C give specific criteria (e.g., "If sprint valid → WF-EXECUTION; if sprint stale → WF-PLANNING"). Branch D just says "appropriate phase."

**Analysis**: This is intentional — handoff scenarios are the most variable. The confirmed state could lead to any phase. step-06's routing table handles the actual decision. Branch D's job is to confirm the state; step-06's job is to route.

**No fix required** — but branch D could optionally list the criteria that inform routing (e.g., "If PRD and architecture exist and are verified → WF-PLANNING or WF-EXECUTION").

---

## 8. Summary

| Category | Result |
|----------|--------|
| Step chain integrity | PASS (6 common steps + 4 branches, all links valid) |
| Branch reconnection | PASS (step-03 → branch → step-04 is specified in both step-03 and each branch file) |
| Constraint isolation | PASS (no cross-phase contamination) |
| Cycle usage | PASS (agent-dispatch for Analyst/PM audit, approval-gate at exit) |
| Phase transition | PASS (comprehensive routing table in step-06) |
| File path accuracy | **ISSUE** (step-03 branch file paths ambiguous) |
| Mode 3 isolation | PASS (single-agent dispatches only, no team orchestration) |

**Overall**: 1 path issue to fix, 2 observations noted. Structurally sound workflow with correct branching and reconnection logic.
