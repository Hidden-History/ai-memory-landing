# Parzival POV Verification Checklist

> **Purpose**: Reusable checklist for verifying the Parzival POV module after any modification
> **Created**: 2026-03-19
> **Source**: Derived from full trace of 21 workflows, 122 step files, 79 constraints
> **Usage**: Run after any edit to `_ai-memory/pov/` files. Check only sections relevant to what changed.

---

## Quick Reference: What to Check After Each Change Type

| Change Type | Sections to Check |
|-------------|------------------|
| Edited a step file | 1, 2, 3 |
| Added/removed a step | 1, 2, 3, 4 |
| Edited a constraint file | 5, 6 |
| Added/removed a constraint | 5, 6, 7 |
| Edited a workflow.md | 1, 4, 8 |
| Added a new workflow | 1, 4, 5, 8, 9 |
| Edited a data file | 10 |
| Edited a template | 11 |
| Edited parzival.md | 8, 12 |
| Edited config.yaml | 12 |

---

## 1. Step Chain Integrity

For every workflow that was modified:

- [ ] `workflow.md` has `firstStep` pointing to an existing file in `steps/`
- [ ] Every step file has `nextStepFile` pointing to an existing file (or none for terminal steps)
- [ ] The chain is complete: firstStep → ... → terminal step with no broken links
- [ ] Terminal steps have no `nextStepFile` field (or it's explicitly null)
- [ ] No step links to a step in a DIFFERENT workflow
- [ ] Conditional skips (if any) reference files by explicit path, not just "Step N"

**Verification command**:
```bash
for f in _ai-memory/pov/workflows/[path]/steps/*.md; do
  next=$(grep -m1 "^nextStepFile:" "$f" | sed "s/nextStepFile: '//;s/'//g;s/nextStepFile: //")
  echo "$(basename $f) -> ${next:-(terminal)}"
done
```

---

## 2. Phase Isolation

For every step file that was modified:

- [ ] Step does NOT reference constraints from another phase
- [ ] Step does NOT reference steps from another workflow
- [ ] Step does NOT perform work that belongs in a different phase
- [ ] Step does NOT dispatch agents inappropriate for the current phase
- [ ] If step references data files, they are in `data/` or the cycle's own `data/`
- [ ] If step references templates, they are in `templates/`

**Common violations to watch for**:
- Init steps doing Discovery work (creating PRD content)
- Discovery steps doing Architecture work (choosing tech stack)
- Planning steps doing Execution work (dispatching DEV for implementation)
- Pre-Phase-4 steps using team-builder or model-dispatch skills

---

## 3. Constraint References

For every step that references a constraint:

- [ ] The referenced constraint ID exists (check `constraints/[phase]/` directory)
- [ ] The referenced constraint is ACTIVE during this workflow's phase
- [ ] The constraint filename matches the reference (e.g., IN-04 → `IN-04-validate-installation.md`)
- [ ] No step references a constraint from a phase that isn't loaded

---

## 4. Workflow Exit Behavior

For every workflow terminal step:

- [ ] Approval gate cycle is invoked (not bypassed)
- [ ] `project-status.md` is updated on approval
- [ ] Current phase constraints are explicitly DROPPED
- [ ] Next phase constraints are explicitly LOADED
- [ ] Next workflow is explicitly loaded by path: `{workflows_path}/phases/[next]/workflow.md`
- [ ] Exit condition matches WORKFLOW-MAP phase transition table

**Known pattern**: All 9 phase terminal steps must have explicit constraint drop/load. If missing, constraints leak into the next phase.

---

## 5. Constraint Count Consistency

After adding or removing a global constraint:

- [ ] `constraints/global/constraints.md` — count in summary table matches file count
- [ ] ALL 7 phase constraint files — "Inherits: All N global constraints" matches actual count
- [ ] ALL 7 phase constraint files — "PLUS all N global constraint checks" matches actual count
- [ ] ALL 7 phase constraint files — "GC-01 through GC-XX" range is correct
- [ ] `parzival.md` self-check — lists all global constraint IDs
- [ ] `data/self-check-constraints.md` — matches parzival.md self-check

**Current count**: 20 global constraints (GC-01 through GC-20)

---

## 6. Constraint File Structure

For every constraint file:

- [ ] Has frontmatter with: id, name, severity, phase
- [ ] Severity is one of: CRITICAL, HIGH, MEDIUM
- [ ] Phase matches the directory it's in
- [ ] `constraints.md` index lists all constraints in the directory
- [ ] Count in index matches file count in directory

---

## 7. Constraint Matrix Sync

After any constraint change:

- [ ] `oversight/specs/parzival/constraint-matrix.md` reflects the change
- [ ] Total constraint count is correct (currently 79: 20 global + 59 phase)
- [ ] Severity distribution table is correct
- [ ] CRITICAL constraint listing is complete

---

## 8. Menu Path Verification

After modifying parzival.md menu or workflow file locations:

- [ ] Every `exec="path"` in the menu resolves to an existing file
- [ ] Session workflow paths match `workflows/session/[name]/workflow.md`
- [ ] Cycle workflow paths match `workflows/cycles/[name]/workflow.md`
- [ ] Skill paths reference `.claude/skills/` (shims generated by installer)
- [ ] HP (Help) path: `_ai-memory/core/tasks/help.md`
- [ ] CR (Code Review) path: `_ai-memory/agents/code-reviewer.md`
- [ ] DA (Dispatch) path: `workflows/cycles/agent-dispatch/workflow.md`

---

## 9. WORKFLOW-MAP Sync

After adding a workflow or changing exit routes:

- [ ] WORKFLOW-MAP Step 2 phase routing matches actual workflow.md files
- [ ] WORKFLOW-MAP Step 3 context slice table is current
- [ ] Phase transition table matches actual terminal step exit behavior
- [ ] Error handling section covers new edge cases

---

## 10. Data File Cross-Reference

After modifying a data file:

- [ ] `data/classification-criteria.md` — Categories A (A1-A8), B (B1-B4), C (C1-C5) match what legitimacy-check step-03 expects
- [ ] `data/confidence-levels.md` — 5 levels match parzival.md behavioral rules
- [ ] `data/escalation-protocol.md` — 4 levels match parzival.md escalation rules
- [ ] `data/complexity-assessment.md` — 4 levels match parzival.md complexity rules
- [ ] `cycles/legitimacy-check/data/classification-criteria.md` — matches `data/issue-classification-criteria.md`

---

## 11. Template File Verification

After modifying or adding templates:

- [ ] All templates referenced in workflow frontmatter exist in `templates/`
- [ ] Template content matches what the referencing step expects to use
- [ ] Templates for session workflows: `session-handoff.template.md`, `decision-log.template.md`
- [ ] Templates for verification: `verification-story.template.md`, `verification-code.template.md`, `verification-production.template.md`
- [ ] Templates for agents: `bug-report.template.md`, `correction.template.md`

---

## 12. Activation Sequence Verification

After modifying parzival.md or config.yaml:

- [ ] config.yaml has all required fields: user_name, communication_language, constraints_path, workflows_path, oversight_path
- [ ] parzival.md activation steps reference correct config.yaml path
- [ ] parzival.md activation step 4 loads `constraints/global/constraints.md`
- [ ] parzival.md activation step 6 loads `workflows/WORKFLOW-MAP.md`
- [ ] Menu items match the order and labels in parzival.md exactly

---

## 13. Installer Shim Verification

After adding a new skill to `_ai-memory/pov/skills/`:

- [ ] Skill directory has a `SKILL.md` file
- [ ] After install, `.claude/skills/[skill-name]/SKILL.md` shim exists
- [ ] Shim has correct frontmatter (copied from source SKILL.md)
- [ ] Shim has `**LOAD**: Read and follow _ai-memory/pov/skills/[name]/SKILL.md` directive
- [ ] `generate_parzival_skill_shims()` in install.sh iterates correctly

---

## Appendix: File Counts (as of 2026-03-19)

| Category | Count |
|----------|-------|
| Workflows (workflow.md) | 21 |
| Step files | 118 |
| Branch files | 4 |
| Constraint files (individual) | 79 |
| Constraint index files | 9 |
| Data files | 7 |
| Template files (pov/templates/) | 7 |
| Skill directories | 7 |
| Oversight template files | 18 |
