# Parzival System Specification — Index

**Purpose**: Authoritative source of truth for how the Parzival oversight system works.
**Location**: `oversight/specs/parzival/`
**Last Updated**: 2026-03-19

---

## Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [PARZIVAL-AGENT-SPEC.md](./PARZIVAL-AGENT-SPEC.md) | Complete agent specification — identity, 3 operating modes, behavioral rules, gatekeeper role | Complete (reviewed, 2 fabrications removed, Mode 3 clarified) |
| [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md) | Structural map — constraints (8 categories), workflows (4 categories, 21 total), data, skills, templates, oversight directory | Complete (reviewed, step count corrected to 118, Mode 3 clarified) |
| [ROUTING-MAP.md](./ROUTING-MAP.md) | Visual routing — master flowchart, per-workflow step chains, constraint load/drop points, exit routes | Complete (reviewed, no issues found) |
| [constraint-matrix.md](./constraint-matrix.md) | Constraint activation matrix — every constraint ID, which phase, when active, when dropped | Complete (reviewed, agent-dispatch scope clarified) |
| [verification-checklist.md](./verification-checklist.md) | Reusable verification checklist for future POV modifications | Complete (13 sections) |

## Trace Reports

| Workflow | Steps | Status |
|----------|-------|--------|
| [trace-init-new.md](./traces/trace-init-new.md) | 7 steps | Complete (3 issues fixed in step-03) |
| [trace-init-existing.md](./traces/trace-init-existing.md) | 6 steps + 4 branches | Complete (1 path fix in step-03, 2 observations) |
| [trace-session-workflows.md](./traces/trace-session-workflows.md) | 22 steps (7 workflows) | Complete (all clean) |
| [trace-phase-discovery.md](./traces/trace-phase-discovery.md) | 7 steps | Complete (stale constraint counts fixed across ALL 7 phase files) |
| [trace-phase-architecture.md](./traces/trace-phase-architecture.md) | 9 steps | Complete (clean — 1 LOW observation) |
| [trace-phase-planning.md](./traces/trace-phase-planning.md) | 7 steps | Complete (clean) |
| [trace-phase-execution.md](./traces/trace-phase-execution.md) | 7 steps | Complete (clean — 2 LOW observations) |
| [trace-phase-integration.md](./traces/trace-phase-integration.md) | 8 steps | Complete (clean) |
| [trace-phase-release.md](./traces/trace-phase-release.md) | 7 steps | Complete (1 fix: constraint drop/load added) |
| [trace-phase-maintenance.md](./traces/trace-phase-maintenance.md) | 7 steps | Complete (1 fix: constraint drop/load added) |
| [trace-cycle-workflows.md](./traces/trace-cycle-workflows.md) | 31 steps (5 cycles) | Complete (all clean) |

## How to Use

1. **Understanding Parzival**: Start with PARZIVAL-AGENT-SPEC.md
2. **Understanding structure**: Read SYSTEM-ARCHITECTURE.md
3. **Understanding routing**: Read ROUTING-MAP.md
4. **Checking constraint isolation**: Consult constraint-matrix.md
5. **Verifying a specific workflow**: Read the corresponding trace report
6. **After modifying POV files**: Run verification-checklist.md
