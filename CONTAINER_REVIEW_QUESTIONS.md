# Container Review Questions — Parzival Landing Page

## Container 1: Identity & Role (Hero)
- [x] All content accurate? IS/IS NOT items sourced correctly from GC-01–GC-13
- [x] Relationship model (Captain/Navigator/Crew) correctly represented
- [x] Severity color encoding (CRITICAL=red, HIGH=amber, MEDIUM=blue) consistent throughout
- [x] Modes preview ticker links correctly to #modes

## Container 2: Three Operating Modes
- [ ] Phase 4+ gate for Mode 3 visually prominent enough?
- [ ] Pipeline sequence (Team Builder → Agent → BMAD → Model) clear?
- [ ] Review cycle loop steps shown as visual flow instead of plain text?
- [x] Mode 3 activation note: "not Phase 4+ only, but Phase 4+ only" — FIXED: now reads "Phase 4 (Execution) or later" (both tab sublabel and activation box suffix updated)

## Container 3: Workflow Universe
- [ ] Phase flow diagram at top of Phase tab — useful or should be removed?
- [ ] 4 init branches (A/B/C/D) — visually prominent enough?
- [ ] 4-level nesting depth note (review-cycle → legitimacy-check → research-protocol → agent-dispatch) — important to keep visible?
- [ ] All workflow step counts, exit conditions, and agent assignments accurate?

## Container 4: Constraint System
- [x] Quality section labeled "7 constraints" but shows 11 items (GC-05, GC-06, GC-07, GC-08, GC-13, GC-14, GC-15, GC-16, GC-17, GC-18 = 10) — FIXED: label now reads "10 constraints"
- [x] Severity summary strip counts were wrong — FIXED: now 28 CRITICAL / 36 HIGH / 15 MEDIUM (verified against actual constraint data = 79 total)
- [ ] Phase tab: all 8 phases expanded vs some collapsed by default?
- [ ] Any constraint IDs or names that don't match constraint-matrix.md?

## Container 5: Agent Roles & Menu System
[ALL BUILT — review after all sections complete]
- [ ] 6 agent roles shown — should SM and UX be visually distinct from the main 4?
- [ ] Agent cards expand/collapse — should more details be visible without clicking?
- [x] Menu command table — all 15 commands correct? EX is "inline" not "exec" — VERIFIED: EX correctly typed as inline
- [ ] Confidence level examples — are they accurate to Parzival's actual use?
- [ ] Complexity examples — do they illustrate the definitions well?

## Container 6: Technical Specifications
[ALL BUILT — review after all sections complete]
- [x] Directory tree: Is the 118 step file count correct? Source says 118 — VERIFIED: count is 118
- [x] EC-02 and DC-08 noted as "moved to skills" — VERIFIED: neither appears in constraints file, correctly excluded
- [ ] The Verification tab shows "Section 12" as activation sequence verification — is this the right scope?
- [x] File count strip shows 9 constraint index files — VERIFIED: 9 (global + 8 phases)

## Assembly
- [x] Persistent tab/status bar with links to all 6 sections — DONE via ParzivalNav
- [x] Smooth scroll anchor navigation — DONE via scrollIntoView behavior: smooth
- [x] Mobile responsiveness of tab bar — DONE: overflow-x-auto with scrollbar-thin
- [x] No hydration mismatches — DONE: all components use "use client"

## Global Issues — Resolved
1. ✅ Quality count: "7" → "10" (globalQuality has 10 items)
2. ✅ Severity strip: 28/31/20 → 28/36/15 (actual counts from all constraints)
3. ✅ Mode 3 activation: "Phase 4+ only" → "Phase 4 (Execution) or later" (both occurrences)

## Remaining Open Questions
1. **Container 2**: Mode 3 Phase 4 gate — visually prominent enough? (user preference)
2. **Container 2**: Pipeline sequence clarity — Team Builder → Agent → BMAD → Model clear?
3. **Container 2**: Review cycle loop — plain text vs visual flow?
4. **Container 3**: Phase flow diagram at top of Phase tab — useful or remove?
5. **Container 3**: Init as "phase" in tab — docs distinguish init workflows from phases 1-7
6. **Container 3**: 4-level nesting depth note — keep visible?
7. **Container 4**: Phase accordion — all 8 expanded by default vs some collapsed?
8. **Container 4**: Any constraint IDs don't match constraint-matrix.md?
9. **Container 5**: SM and UX visually distinct from main 4 agents?
10. **Container 5**: Agent card expand/collapse — more visible without clicking?
11. **Container 5**: Confidence level examples accuracy?
12. **Container 5**: Complexity examples quality?
13. **Container 6**: Verification "Section 12" scope correct?
