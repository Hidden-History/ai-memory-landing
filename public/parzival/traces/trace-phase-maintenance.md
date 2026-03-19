# Trace Report: Maintenance Phase Workflow

> **Workflow**: `workflows/phases/maintenance/workflow.md`
> **Traced**: 2026-03-19
> **Status**: ISSUE FOUND (1 missing constraint lifecycle instruction)

---

## 1. Routing & Step Chain

- **Entry**: WF-RELEASE (approval) | **Exit**: Loop to step-01 (next issue), WF-PLANNING (new feature), WF-EXECUTION (hotfix), or remain idle
- **Constraints**: Global + Maintenance (MC-01 to MC-08) — loaded on entry, dropped on exit
- **Step chain**: 7 steps, all linked, terminal at step-07. No broken links.
- **Additional exit**: step-02 can exit early if issue classified as new feature → WF-PLANNING

## 2. Constraint Enforcement

| Constraint | Enforced By |
|-----------|------------|
| MC-01: Triage before fix | step-01 (dedicated triage step) |
| MC-02: Strict fix scope | step-04 (tightly scoped maintenance task) + anti-pattern |
| MC-03: Features route to planning | step-02 (classification decision tree routes features to WF-PLANNING) |
| MC-04: Full review standards | step-06 (review cycle, same standards as execution) |
| MC-05: One issue per task | Anti-pattern: "Never fix multiple issues in one DEV dispatch" |
| MC-06: Changelog updated | step-07 (updates CHANGELOG.md for approved fixes) |
| MC-07: Deployment plan for critical | step-07 (CRITICAL/HIGH: recommend immediate deployment) |
| MC-08: Severity priority order | workflow.md operational protocols (queue management by severity) |

**All 8 maintenance constraints actively enforced.**

## 3. Key Verifications

- step-02 classification decision tree correctly separates bugs vs. features
- step-02 early exit to WF-PLANNING for new features (MC-03 compliance)
- step-03 dispatches Analyst via agent-dispatch (diagnosis for complex bugs)
- step-05 dispatches DEV via agent-dispatch
- step-06 invokes review-cycle (same zero-issues standard as execution)
- step-07 loop pattern: per-issue terminal, loops to step-01 for next queued issue
- Patch release escalation protocol for 3+ accumulated fixes
- Issue queue management in workflow.md operational protocols section

## 4. Issues Found

### ISSUE 1: Missing Explicit Constraint Drop/Load in step-07 (MEDIUM)

**Location**: step-07-approval-gate.md

**Problem**: Same as release — when routing to WF-PLANNING, step-07 does not explicitly specify:
```
Drop: {constraints_path}/maintenance/ constraints
Load: {constraints_path}/planning/ constraints
```

The step says "route to WF-PLANNING if new feature work is needed" but doesn't include the constraint lifecycle instruction.

**Note**: When maintenance loops to step-01 (next issue), constraints correctly remain active (still in maintenance). The gap is only on the exit to WF-PLANNING.

**Fix**: Add explicit constraint drop/load for the WF-PLANNING exit route.

---

## 5. Summary

| Category | Result |
|----------|--------|
| Step chain | PASS (7 steps + loop + early exit) |
| Constraint enforcement | PASS (all 8) |
| Phase isolation | **ISSUE** (missing constraint drop/load at exit to Planning) |
| Cycle usage | PASS |
| Phase transition | PASS (routes correct, constraint lifecycle missing) |

**Overall**: 1 medium issue — constraint lifecycle not explicit in terminal step for Planning exit.
