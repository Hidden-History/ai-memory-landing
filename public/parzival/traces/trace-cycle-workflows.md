# Trace Report: Cycle Workflows (5 workflows)

> **Workflows**: `workflows/cycles/` — agent-dispatch, approval-gate, legitimacy-check, research-protocol, review-cycle
> **Traced**: 2026-03-19
> **Status**: CLEAN

---

## Overview

Cycle workflows are reusable atomic operations invoked FROM phase and session workflows. They inherit the calling workflow's constraints — they do not load or drop their own constraints. They return to the calling workflow when complete.

---

## 1. Step Chain Verification (All 5)

| Workflow | Steps | Chain Valid | Pattern |
|----------|-------|------------|---------|
| agent-dispatch | 9 | PASS | Linear (01 → 02 → ... → 09) |
| approval-gate | 4 | PASS | Linear (01 → 02 → 03 → 04) |
| legitimacy-check | 5 | PASS | Linear (01 → 02 → 03 → 04 → 05) |
| research-protocol | 6 | PASS | Linear (01 → 02 → 03 → 04 → 05 → 06) |
| review-cycle | 7 | PASS | **Loop**: 01 → 02 → 03 → 04 → 05 → 03 (loop), exit via 03 → 07 |

All nextStepFile links verified. All targets exist.

---

## 2. Per-Cycle Trace

### Agent Dispatch (9 steps)

The full agent lifecycle: prepare → spawn → activate → instruct → monitor → receive → accept/loop → shutdown → summarize.

| Step | Purpose | Key Verification |
|------|---------|-----------------|
| 01 | Prepare instruction | All STANDARDS fields required (GC-11, GC-21) |
| 02 | Create team | Spawns teammate with team_name (GC-19) |
| 03 | Activate agent | BMAD activation command ONLY — no instruction in same message (GC-20) |
| 04 | Send instruction | Separate message after activation verified |
| 05 | Monitor progress | Clarification, blockers, scope drift, decisions |
| 06 | Receive output | Parzival reviews before any forwarding (GC-09) |
| 07 | Accept or loop | Max 3 correction loops, then escalate |
| 08 | Shutdown teammate | Clean shutdown |
| 09 | Prepare summary | In Parzival's words, not raw output (GC-10) |

**GC compliance verified**: GC-19 (step-02), GC-20 (step-03/04 separation), GC-09 (step-06), GC-10 (step-09), GC-11/21 (step-01).

### Approval Gate (4 steps)

The user approval protocol: prepare → present → process → record.

| Step | Purpose | Key Verification |
|------|---------|-----------------|
| 01 | Prepare package | Complete approval package with all required sections |
| 02 | Present to user | 3 options: Approve / Reject / Hold |
| 03 | Process response | Handle each response type |
| 04 | Record outcome | Log to decision-log if significant |

**No agents dispatched.** No cycles called. Pure Parzival → user interaction.

### Legitimacy Check (5 steps)

Issue classification: read → check files → classify → record → prioritize.

| Step | Purpose | Key Verification |
|------|---------|-----------------|
| 01 | Read issue | Full understanding before classification |
| 02 | Check project files | Verify against PRD, architecture, standards, project-context |
| 03 | Classify | 3-category system: LEGITIMATE (A1-A8) / NON-ISSUE (B1-B4) / UNCERTAIN (C1-C5) |
| 04 | Record | Classification with basis and citations |
| 05 | Assign priority | CRITICAL / HIGH / MEDIUM / LOW for legitimate issues |

**Key design**: step-03 has `classificationCriteria: '../data/classification-criteria.md'` — loads the formal criteria definitions. UNCERTAIN triggers research-protocol. Classification requires project file citations (not opinion).

### Research Protocol (6 steps)

Three-layer verified research: define → project files → documentation → analyst → user → document.

| Step | Purpose | Key Verification |
|------|---------|-----------------|
| 01 | Define question | Clear, specific, answerable |
| 02 | Layer 1: Project files | Check local files first |
| 03 | Layer 2: Documentation | Check docs, specs, READMEs |
| 04 | Layer 3: Analyst research | Dispatch Analyst via agent-dispatch (if layers 1-2 insufficient) |
| 05 | Escalate to user | If all layers fail, ask user |
| 06 | Document answer | Record in appropriate file with source |

**Layered approach**: Each layer exits early if the answer is found. Only escalates when lower layers are insufficient.

### Review Cycle (7 steps, loop pattern)

The most complex cycle — the quality gate for all implementation work.

**Loop structure**:
```
step-01 (verify completeness)
  → step-02 (trigger code review via agent-dispatch)
    → step-03 (process review report — classify all issues)
      ├─ if legitimate issues → step-04 (build correction) → step-05 (receive fixes) → back to step-03
      └─ if zero issues → step-07 (exit cycle)
step-06 is a reference step (cycle tracking data)
```

| Step | Purpose | Key Verification |
|------|---------|-----------------|
| 01 | Verify completeness | Check against DONE WHEN criteria |
| 02 | Trigger code review | DEV dispatched via agent-dispatch for review |
| 03 | Process review report | Each issue classified via legitimacy-check. Has `exitStepFile` for zero-issues path |
| 04 | Build correction | Batched corrections for all legitimate issues |
| 05 | Receive fixes | Verify each fix, loop to step-03 |
| 06 | Cycle tracking | Reference step — tracking data format |
| 07 | Exit cycle | Verify ALL exit conditions, prepare summary |

**Critical design features**:
- step-03 has dual paths: `nextStepFile` (issues found) and `exitStepFile` (zero issues)
- step-05 loops back to step-03, creating the fix-review-classify loop
- step-07 checks cannot-exit conditions before allowing exit
- Zero-issue reports on complex tasks are questioned (step-03, section 2)
- Pre-existing issues are fixed in current cycle, not deferred (step-03, section 5)
- Uncertain issues trigger research-protocol (step-03, section 4)

---

## 3. Cycle Nesting Verification

Cycles invoke other cycles. Maximum observed depth:

```
review-cycle
  → agent-dispatch (step-02: DEV code review)
  → legitimacy-check (step-03: classify each issue)
    → research-protocol (if UNCERTAIN)
      → agent-dispatch (step-04: Analyst research)
```

**4 levels deep.** All nesting is correct — each cycle invokes only appropriate sub-cycles.

| Cycle | Can Invoke |
|-------|-----------|
| agent-dispatch | None (terminal cycle) |
| approval-gate | None (terminal cycle) |
| legitimacy-check | research-protocol (for UNCERTAIN) |
| research-protocol | agent-dispatch (Analyst in step-04) |
| review-cycle | agent-dispatch (DEV), legitimacy-check (every issue) |

---

## 4. Cross-Cutting Verification

| Check | Status |
|-------|--------|
| No cycle loads or drops constraints | PASS (inherit from caller) |
| No cycle changes current_phase | PASS |
| All return to calling workflow | PASS |
| agent-dispatch enforces GC-19 (team_name) and GC-20 (separate activation) | PASS |
| review-cycle loop has verified exit conditions | PASS |
| legitimacy-check uses formal classification criteria (not opinion) | PASS |
| research-protocol layers prevent unnecessary agent dispatch | PASS |

---

## 5. Summary

| Category | Result |
|----------|--------|
| Step chain integrity | PASS (31 steps across 5 cycles, all linked) |
| Loop mechanism | PASS (review-cycle step-03 has dual paths via nextStepFile/exitStepFile) |
| Nesting | PASS (4 levels max, all appropriate) |
| Constraint handling | PASS (all inherit from caller, none modify) |
| GC compliance | PASS (agent-dispatch enforces GC-19, GC-20, GC-09, GC-10, GC-11) |

**Overall**: All 5 cycle workflows are clean. No issues found. The review-cycle loop mechanism using `exitStepFile` is a well-designed pattern for conditional branching.
