# Trace Report: Release Phase Workflow

> **Workflow**: `workflows/phases/release/workflow.md`
> **Traced**: 2026-03-19
> **Status**: ISSUE FOUND (1 missing constraint lifecycle instruction)

---

## 1. Routing & Step Chain

- **Entry**: WF-INTEGRATION (approval) | **Exit**: WF-MAINTENANCE or WF-PLANNING or project complete
- **Constraints**: Global + Release (RC-01 to RC-07) — loaded on entry, dropped on exit
- **Step chain**: 7 steps, all linked, terminal at step-07. No broken links.

## 2. Constraint Enforcement

| Constraint | Enforced By |
|-----------|------------|
| RC-01: Accurate changelog | step-02 (SM creates from story records, not memory) |
| RC-02: Rollback plan | step-04 (dedicated rollback plan step) |
| RC-03: DEV-verified deployment | step-05 (DEV verification of checklist) |
| RC-04: Surface breaking changes | step-07 approval package lists breaking changes explicitly |
| RC-05: Explicit user sign-off | step-07 approval gate |
| RC-06: User-facing release notes | step-02 (SM creates user-audience notes) |
| RC-07: Integration must pass first | Workflow trigger (only entered from WF-INTEGRATION approval) |

**All 7 release constraints actively enforced.**

## 3. Key Verifications

- Agent dispatches: step-02 (SM via agent-dispatch), step-05 (DEV via agent-dispatch). Both via cycle.
- step-07 approval package includes: breaking changes, irreversible changes, rollback time, deployment time
- step-07 has post-deployment monitoring protocol — reminds user of rollback plan
- 3 exit routes: WF-PLANNING (next sprint), WF-MAINTENANCE (enters maintenance), project complete (archive)

## 4. Issues Found

### ISSUE 1: Missing Explicit Constraint Drop/Load in step-07 (MEDIUM)

**Location**: step-07-approval-gate.md, section 3

**Problem**: The "IF APPROVED" section routes to WF-PLANNING, WF-MAINTENANCE, or project complete, but does NOT include the explicit constraint lifecycle instructions that every other phase terminal step has:
```
Load: {workflows_path}/phases/[next]/workflow.md
Load: {constraints_path}/[next]/ constraints
Drop: {constraints_path}/release/ constraints
```

**Comparison**: Init-new step-07, discovery step-07, architecture step-09, planning step-07, execution step-07, and integration step-08 all explicitly specify the constraint drop/load.

**Risk**: Parzival might not drop release constraints when transitioning to maintenance or planning. Release constraints (RC-01 through RC-07) would leak into the next phase.

**Fix**: Add explicit constraint lifecycle for each exit route:
- Route A (Planning): Drop release constraints, load planning constraints
- Route B (Maintenance): Drop release constraints, load maintenance constraints
- Route C (Complete): Drop release constraints

---

## 5. Summary

| Category | Result |
|----------|--------|
| Step chain | PASS (7 steps) |
| Constraint enforcement | PASS (all 7) |
| Phase isolation | **ISSUE** (missing constraint drop/load at exit) |
| Cycle usage | PASS |
| Phase transition | PASS (routes correct, constraint lifecycle missing) |

**Overall**: 1 medium issue — constraint lifecycle not explicit in terminal step.
