# Parzival Landing Page — Build Plan

**Project**: `/parzival` page for `ai-memory-landing`
**Goal**: Comprehensive, reference-grade documentation page for Parzival oversight agent
**Build Order**: One container at a time, verify each before proceeding

---

## Design System

| Token | Value |
|---|---|
| **Aesthetic** | Editorial / Technical Manual |
| **Background** | Dark (matches existing project) |
| **Headings font** | Syne |
| **Constraint IDs / Mono** | JetBrains Mono |
| **CRITICAL severity** | Red accent `#FF4444` |
| **HIGH severity** | Amber `#F59E0B` |
| **MEDIUM severity** | Muted blue `#60A5FA` |
| **Motion** | Subtle — tab transitions, smooth scroll. No playful animations. |

---

## 6 Containers (Build Order)

### [ ] Container 1 — Identity & Role (Hero)
- **File**: `src/components/sections/parzival-identity.tsx`
- **Task ID**: #15
- **Covers**: Core identity statement, relationship model (User=Captain/Parzival=Navigator/BMAD=Crew), IS/IS NOT boundaries (GC-01–GC-04), 30-second pitch
- **Verify**: Dark editorial style, Syne headings, JetBrains Mono for constraint IDs, GC-01/02/03/04 visually distinct

### [ ] Container 2 — Three Operating Modes (Tabbed)
- **File**: `src/components/sections/parzival-modes.tsx`
- **Task ID**: #19
- **Covers**: Mode 1 (Project Governance/8-phase), Mode 2 (Documentation & Oversight), Mode 3 (Team Orchestration/Phase 4+ only), Mode availability timeline
- **Verify**: Tabbed sub-sections, Mode 1/2 always active shown prominently, Mode 3 activation gate (Phase 4+) visually distinct

### [ ] Container 3 — Workflow Universe (Tabbed)
- **File**: `src/components/sections/parzival-workflows.tsx`
- **Task ID**: #21
- **Covers**: Session (7), Init (2+4 branches), Phase (7 sequential with exit conditions), Cycle (5 atomic ops)
- **Verify**: Tabbed by category, phase section shows sequential flow, exit conditions clear

### [ ] Container 4 — Constraint System (Tabbed)
- **File**: `src/components/sections/parzival-constraints.tsx`
- **Task ID**: #16
- **Covers**: Global (20, Identity/Quality/Communication), Phase (59, 8 phases), Lifecycle (load/drop), Cross-Phase Isolation
- **Verify**: Severity color encoding (CRITICAL=red, HIGH=amber, MEDIUM=blue), GC/PC/DC/AC/etc prefixes visible, 79 total count accurate

### [ ] Container 5 — Agent Roles & Menu System
- **File**: `src/components/sections/parzival-agents.tsx`
- **Task ID**: #17
- **Covers**: 5 BMAD roles, 15 menu commands with routing paths, 5-tier confidence levels, 4-tier complexity assessments
- **Verify**: Menu codes in monospace, roles visually distinct, confidence/complexity tables complete

### [ ] Container 6 — Technical Specifications (Reference)
- **File**: `src/components/sections/parzival-specs.tsx`
- **Task ID**: #20
- **Covers**: Directory tree, activation sequence (9 steps), data flow, verification checklist (13 sections), quality gate discipline (GC-12)
- **Verify**: File counts accurate (21 workflows, 118 steps, 79 constraints, 7 skills), all 9 activation steps present

### [ ] Assembly — /parzival page
- **File**: `src/app/parzival/page.tsx`
- **Task ID**: #18
- **Action**: Wire all 6 containers with persistent tab navigation bar, anchor links, consistent dark editorial aesthetic
- **Verify**: Tabs route correctly, no layout shift, all 6 sections accessible, mobile responsive

---

## Data Sources

All content from:
- `public/parzival/PARZIVAL-AGENT-SPEC.md`
- `public/parzival/SYSTEM-ARCHITECTURE.md`
- `public/parzival/ROUTING-MAP.md`
- `public/parzival/constraint-matrix.md`
- `public/parzival/verification-checklist.md`
- `public/parzival/INDEX.md`
