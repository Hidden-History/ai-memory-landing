# Features Page Build Plan

> **Created:** 2026-03-19
> **Status:** Planning
> **Route:** `/features`
> **Goal:** Deep-dive technical showcase of AI Memory's 7 core features with unique visualizations per section, logo strips, and right-side SectionNav.

---

## Table of Contents

1. [Page Overview](#1-page-overview)
2. [Pre-work](#2-pre-work)
3. [Section Build Order](#3-section-build-order)
4. [Section Specifications](#4-section-specifications)
5. [Playwright Verification Strategy](#5-playwright-verification-strategy)
6. [Master Checklist](#6-master-checklist)

---

## 1. Page Overview

### Architecture

```
src/app/features/
  └── page.tsx                    # Route entry — imports all sections

src/components/sections/features/
  ├── features-hero.tsx           # Section 1: Hero
  ├── core-architecture.tsx       # Section 2: Core Architecture
  ├── smart-chunking.tsx          # Section 3: Smart Chunking
  ├── context-injection.tsx       # Section 4: Context Injection
  ├── temporal-awareness.tsx      # Section 5: Temporal Awareness
  ├── github-integration.tsx      # Section 6: GitHub Integration
  ├── observability.tsx           # Section 7: Observability
  ├── security-pipeline.tsx       # Section 8: Security Pipeline
  └── features-cta.tsx            # Section 9: CTA
```

### Layout Variety Map

| # | Section | Layout Type | Animation Style |
|---|---------|------------|-----------------|
| 1 | Hero | Full-width centered, particle network | blurIn + stagger |
| 2 | Core Architecture | Full-width animated flow diagram | Path drawing + node pulse |
| 3 | Smart Chunking | Two-column split (code left, text right) | slideFromLeft / slideFromRight |
| 4 | Context Injection | Centered horizontal budget meter | scaleIn + animated fill |
| 5 | Temporal Awareness | Interactive chart with decay curves | fadeUp + CSS animation |
| 6 | GitHub Integration | Horizontal scroll belt (9 content types) | Auto-scroll carousel |
| 7 | Observability | Tabbed view (Path A vs Path B) | Tab crossfade |
| 8 | Security Pipeline | Vertical 3-layer pipeline | Staggered slideFromLeft |
| 9 | CTA | Centered terminal card | fadeUp |

### Shared DNA

- Right-side `SectionNav` (cyan accent, 9 entries)
- Navbar/Footer from root layout (already wired)
- Global `bg-mesh` + particles from home page pattern
- Color palette: Cyan `#00F5FF`, Violet `#8B5CF6`, Magenta `#FF2D6A`, Green `#00FF88`, Amber `#FFB800`
- Typography: Orbitron headings, Outfit body, JetBrains Mono code
- Framer Motion animations, glass card materials
- "Powered By" logo strips beneath relevant sections

---

## 2. Pre-work

### 2.1 Copy Logos

Copy relevant logos from `E:\projects\Logo downloader\logos\` to `public/logos/`:

```
public/logos/
  ├── qdrant.png          # from vector_database/ (if available) or download
  ├── python.png          # from python_development/
  ├── docker.png          # from containerization/
  ├── github.png          # from version_control/
  ├── git.png             # from version_control/
  ├── langfuse.png        # from agent_observability/
  ├── prometheus.png      # from monitoring/
  ├── grafana.png         # from monitoring/
  ├── claude.png          # from ai_coding/
  ├── owasp.png           # from security/
  ├── sentence-transformers.png  # from embedding_training/
  └── pydantic.png        # from ai_agent_framework/
```

**Checklist:**
- [ ] Create `public/logos/` directory
- [ ] Copy all 12 logos listed above
- [ ] Verify all images load (no broken paths)

### 2.2 Create Route

- [ ] Create `src/app/features/page.tsx` — basic shell with "use client", imports placeholder
- [ ] Create `src/components/sections/features/` directory

### 2.3 Wire Navigation

- [ ] Add "Features" link to navbar (`src/components/sections/navbar.tsx`)
  - Link: `/features`
  - Position: Between "Home" and "Architecture" (or wherever appropriate in the nav order)
- [ ] Add "Features" link to footer if not already present
- [ ] Verify nav link works and highlights on the features page

### 2.4 Playwright Test Setup

- [ ] Create `tests/features-page.spec.ts` with base test structure
- [ ] Test helper: page navigation to `/features`
- [ ] Test helper: section visibility assertion
- [ ] Test helper: logo image load assertion

---

## 3. Section Build Order

Build one section at a time. After each section:
1. Add it to `page.tsx`
2. Run Playwright verification
3. Fix any issues
4. Move to next section

```
Step 1:  Pre-work (logos, route, nav) → Playwright: route exists, nav works
Step 2:  Hero section                  → Playwright: hero renders, headline visible
Step 3:  Core Architecture             → Playwright: diagram nodes visible, logo strip
Step 4:  Smart Chunking                → Playwright: two-column layout, code block
Step 5:  Context Injection             → Playwright: budget meter, tier labels
Step 6:  Temporal Awareness            → Playwright: decay chart, half-life labels
Step 7:  GitHub Integration            → Playwright: carousel renders, 9 type cards
Step 8:  Observability                 → Playwright: tabs work, path switching
Step 9:  Security Pipeline             → Playwright: 3 layers visible, scan animation
Step 10: CTA                          → Playwright: buttons render, links work
Step 11: SectionNav                    → Playwright: nav dots visible, scroll works
Step 12: Final QA                      → Playwright: full page screenshot, all sections
```

---

## 4. Section Specifications

### Section 1: Hero (`features-hero.tsx`)

**Content:**
- Section label: "Features" badge
- Headline: "Under the Hood" with gradient text on "Hood"
- Subheadline: "Every component explained. From capture to retrieval, chunking to decay — the technical architecture that makes AI Memory work."
- Stat row: "7 Core Systems" | "9-Step Pipeline" | "768d Vectors" | "5 Collections"

**Visual:**
- Animated particle network background (similar to architecture page ParticleMesh but lighter)
- Stats enter with `scaleIn` animation

**Layout:** Full-width centered, `max-w-5xl`, generous `py-32`

**Data source:** Core-Architecture-Principle-V2.md (summary stats)

**Export:** `export function FeaturesHero()`

---

### Section 2: Core Architecture (`core-architecture.tsx`)

**Content:**
- Label: "System Architecture" with Layers icon
- Headline: "Signal-Triggered Retrieval"
- Description: "Instead of random memory injection at session start, AI Memory uses signal-triggered retrieval — memory surfaces when it's relevant, not when it's present."
- 3 collection cards: HOW (code-patterns, cyan), WHAT (conventions, violet), WHY (discussions, magenta)
- Below: 6 trigger badges showing the automatic triggers
- Logo strip: Qdrant, Python, Docker

**Visual:**
- Animated flow: Input → 3 collections (branching) → Retrieval → Output
- SVG paths with animated data packets
- Collection cards have colored left borders matching their type

**Layout:** Full-width flow diagram + 3-column card grid below

**Data source:** Core-Architecture-Principle-V2.md

**Export:** `export function CoreArchitecture()`

---

### Section 3: Smart Chunking (`smart-chunking.tsx`)

**Content:**
- Label: "Intelligent Chunking" with Scissors icon
- Headline: "Code-Aware Content Division"
- Description: "Different content types get different treatment. AST-aware chunking for code preserves function boundaries. Semantic chunking for prose respects topic shifts."

**Visual — Two-column split:**
- **Left column:** Animated code block showing a Python function being chunked
  - Highlight lines showing chunk boundaries (colored underlines)
  - Labels: "AST boundary detected", "512 tokens", "20% overlap"
- **Right column:** Explanation cards
  - Card 1: "AST-Aware" — code uses function/class boundaries
  - Card 2: "Semantic" — prose uses topic shift detection
  - Card 3: "Context Headers" — "+70.1% Recall@5" stat with explanation
  - Card 4: "Smart Truncation" — error messages preserve key info

**Logo strip:** Sentence Transformers

**Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-8`

**Data source:** Chunking-Strategy-V2.md

**Export:** `export function SmartChunking()`

---

### Section 4: Context Injection (`context-injection.tsx`)

**Content:**
- Label: "Context Injection" with Syringe/Zap icon
- Headline: "Right Memory, Right Time"
- Description: "Two-tier progressive injection delivers exactly the context agents need — bootstrap at session start, adaptive on every turn."

**Visual — Budget meter animation:**
- Tier 1 bar: "Bootstrap" — 2500 token budget, fills on load with cyan
  - Labels: conventions, decisions, agent context
- Tier 2 bar: "Adaptive" — 500-1500 token range, fills dynamically
  - Three signal indicators: Quality (50%), Density (30%), Topic Drift (20%)
- Confidence gate indicator: "Skip if score < 0.6" with red/green threshold line
- Below: Three weighted signal cards showing the adaptive formula

**Logo strip:** Claude, Pydantic

**Layout:** Centered, `max-w-4xl`, vertical stack of meter + signals

**Data source:** Context-Injection-V2.md

**Export:** `export function ContextInjection()`

---

### Section 5: Temporal Awareness (`temporal-awareness.tsx`)

**Content:**
- Label: "Temporal Awareness" with Clock icon
- Headline: "Memories That Age"
- Description: "Decay scoring + freshness detection ensure agents prefer recent, relevant memories. Stale patterns are flagged before they cause harm."

**Visual — Decay curve chart:**
- CSS/SVG chart showing decay curves for different half-lives:
  - code-patterns: 14 days (steep curve, cyan)
  - discussions: 21 days (medium curve, violet)
  - conventions: 60 days (gradual curve, green)
- X-axis: Days (0-90), Y-axis: Score multiplier (0-1.0)
- Formula display: `final_score = (0.7 × similarity) + (0.3 × 0.5^(age/half_life))`
- Below chart: Freshness tier badges
  - Fresh (0-2 commits, green)
  - Aging (3-9, amber)
  - Stale (10-24, orange)
  - Expired (25+, red)

**Layout:** Chart centered `max-w-3xl`, freshness badges in a row below

**Data source:** Temporal-Awareness-V1.md

**Export:** `export function TemporalAwareness()`

---

### Section 6: GitHub Integration (`github-integration.tsx`)

**Content:**
- Label: "GitHub Integration" with Github icon
- Headline: "Your Repository, Searchable by Meaning"
- Description: "Full repository sync — issues, PRs, commits, code, CI results — all searchable semantically, not just by keywords."

**Visual — Horizontal scroll belt:**
- 9 content type cards in auto-scrolling carousel:
  1. Issues (cyan) — "Issue titles, bodies, labels, assignees"
  2. Issue Comments (cyan) — "Discussion threads on issues"
  3. Pull Requests (violet) — "PR descriptions, review status"
  4. PR Diffs (violet) — "Code changes with file context"
  5. PR Reviews (violet) — "Review comments and approvals"
  6. Commits (green) — "Commit messages and file lists"
  7. Code Blobs (magenta) — "AST-chunked source files"
  8. CI Results (amber) — "Build/test pass/fail with logs"
  9. Releases (cyan) — "Release notes and changelogs"
- Cards: ~240px wide, glass card styling, icon + title + description
- Auto-scroll: 30s cycle, pause on hover

**Below carousel:** Stats row
- "SHA-256 Dedup" | "ETag Caching" | "5K req/hr Rate Limit" | "Adaptive Backoff"

**Logo strip:** GitHub, Git

**Layout:** Full-width carousel (breaks max-width), stats within `max-w-5xl`

**Data source:** GitHub-Integration-V1.md

**Export:** `export function GitHubIntegration()`

---

### Section 7: Observability (`observability.tsx`)

**Content:**
- Label: "Observability" with BarChart3 icon
- Headline: "Full Pipeline Visibility"
- Description: "Langfuse V3 SDK integration traces every capture, retrieval, and injection. Two integration paths cover hooks and services."

**Visual — Tabbed view:**
- Tab A: "Hook Path" (Path A)
  - Flow: `emit_trace_event()` → JSON buffer → `trace_flush_worker` → OTel → Langfuse
  - Each step is a small node card connected by arrows
- Tab B: "Service Path" (Path B)
  - Flow: `get_client()` → direct SDK → OTel → Langfuse
  - Simpler 3-node flow
- Below tabs: Key config badges
  - "V3 SDK Only" | "OTel Attributes" | "10K char max" | "flush() in hooks"

**Logo strip:** Langfuse, Prometheus, Grafana

**Layout:** Tabbed panel `max-w-5xl`, badges row below

**Data source:** LANGFUSE-INTEGRATION-SPEC.md

**Export:** `export function Observability()`

---

### Section 8: Security Pipeline (`security-pipeline.tsx`)

**Content:**
- Label: "Security Pipeline" with Shield icon
- Headline: "3-Layer Protection"
- Description: "Every memory passes through regex pattern scanning, entropy-based secrets detection, and SpaCy NER — before any storage occurs."

**Visual — Vertical 3-layer pipeline:**
- Layer 1: "Regex Pattern Scan" (~1ms)
  - Icon: regex pattern symbol
  - Description: "SSN, credit cards, API keys, passwords"
  - Color: green (fast, lightweight)
- Layer 2: "Entropy Detection" (~10ms)
  - Icon: shield with lock
  - Description: "detect-secrets engine, high-entropy strings"
  - Color: amber (medium)
- Layer 3: "SpaCy NER" (~50-100ms)
  - Icon: brain/AI
  - Description: "Named Entity Recognition for names, organizations, locations"
  - Color: magenta (heavy, thorough)
- Connection lines between layers with animated data packets flowing down
- Result badges: "CLEAN → Store" (green) | "BLOCKED → Discard" (red)

**Logo strip:** OWASP

**Layout:** Vertical centered `max-w-3xl`, staggered entrance

**Data source:** AI-Memory-Behavior-Spec-V1.md (security section)

**Export:** `export function SecurityPipeline()`

---

### Section 9: CTA (`features-cta.tsx`)

**Content:**
- Headline: "Every Decision Has a Reason."
- Description: "The architecture is the product. Signal-triggered retrieval, zero-truncation chunking, temporal decay — built to solve one problem: right information at the right time."
- Primary CTA: "Get Started" → GitHub repo link
- Secondary CTA: "Read the Docs" → `/docs`
- Tertiary: "View Architecture →" → `/docs/architecture`

**Visual:**
- Decorative node element (nested circles like architecture CTA)
- Version badge at bottom

**Layout:** Centered, `max-w-3xl`, generous padding

**Export:** `export function FeaturesCTA()`

---

## 5. Playwright Verification Strategy

### Test File: `tests/features-page.spec.ts`

Each section gets verified after being built. Tests run incrementally.

### Test Categories

**A. Route & Navigation Tests**
```
- [ ] /features route loads (200 status)
- [ ] Page title contains "Features"
- [ ] Navbar "Features" link is present and active on /features
- [ ] Navbar "Features" link navigates to /features
```

**B. Per-Section Visibility Tests**
```
For each section:
- [ ] Section element is present in DOM (by id or test-id)
- [ ] Section heading text is visible
- [ ] Section label badge is visible
- [ ] Key content elements render (cards, diagrams, code blocks)
```

**C. Logo Strip Tests**
```
- [ ] Logo images load without 404 (check naturalWidth > 0)
- [ ] Correct number of logos per section
```

**D. Interactive Element Tests**
```
- [ ] Observability tabs switch content on click
- [ ] GitHub carousel contains 9 cards
- [ ] Temporal chart renders SVG paths
- [ ] Security pipeline layers are stacked vertically
```

**E. SectionNav Tests**
```
- [ ] Right-side nav renders on xl viewport
- [ ] Correct number of nav dots (9)
- [ ] Clicking a dot scrolls to the section
```

**F. Full Page Tests**
```
- [ ] All 9 sections render in order
- [ ] No adjacent sections use the same layout pattern
- [ ] No JavaScript console errors
- [ ] Page loads in < 5s
- [ ] Full page screenshot matches design intent
```

### Test Execution Per Step

After building each section:
```bash
npx playwright test tests/features-page.spec.ts --grep "Section N"
```

After all sections:
```bash
npx playwright test tests/features-page.spec.ts
```

---

## 6. Master Checklist

### Pre-work
- [ ] Create `public/logos/` directory
- [ ] Copy 12 logo images from E:\ drive
- [ ] Create `src/app/features/page.tsx` (shell)
- [ ] Create `src/components/sections/features/` directory
- [ ] Add "Features" to navbar links
- [ ] Add "Features" to footer links
- [ ] Create `tests/features-page.spec.ts` (base structure)
- [ ] Verify route loads at `/features`
- [ ] **Playwright: route & nav tests pass**

### Section 1: Hero
- [ ] Create `features-hero.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: hero heading visible, stats render**

### Section 2: Core Architecture
- [ ] Create `core-architecture.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: flow diagram nodes visible, 3 collection cards, logo strip loads**

### Section 3: Smart Chunking
- [ ] Create `smart-chunking.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: two-column layout renders, code block visible, 4 explanation cards**

### Section 4: Context Injection
- [ ] Create `context-injection.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: budget meters render, 3 signal cards, confidence gate visible**

### Section 5: Temporal Awareness
- [ ] Create `temporal-awareness.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: SVG chart renders, 3 decay curves, 4 freshness badges**

### Section 6: GitHub Integration
- [ ] Create `github-integration.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: carousel renders, 9 content type cards present, logo strip loads**

### Section 7: Observability
- [ ] Create `observability.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: 2 tabs render, tab switching works, flow nodes visible**

### Section 8: Security Pipeline
- [ ] Create `security-pipeline.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: 3 layers render vertically, timing labels visible, result badges**

### Section 9: CTA
- [ ] Create `features-cta.tsx`
- [ ] Add to `page.tsx`
- [ ] **Playwright: CTA buttons render, links are correct**

### Section Nav + Final
- [ ] Add `SectionNav` to `page.tsx` (cyan accent, 9 sections)
- [ ] **Playwright: nav dots visible on xl, correct count**
- [ ] **Playwright: full page — all 9 sections in order, no console errors**
- [ ] **Playwright: full page screenshot captured**
- [ ] Commit and push

---

## Implementation Notes

### Logo Strip Component Pattern

Reusable inline pattern for logo strips:

```tsx
function LogoStrip({ logos }: { logos: { src: string; alt: string }[] }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-8 opacity-50 hover:opacity-80 transition-opacity">
      <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#3A4560' }}>
        Powered by
      </span>
      {logos.map(logo => (
        <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-6 w-auto grayscale" />
      ))}
    </div>
  );
}
```

### Design Conventions

- All sections: `"use client"`, framer-motion, lucide-react
- Colors: Standard palette from globals.css
- Fonts: `var(--font-heading)`, `var(--font-body)`, `var(--font-mono)`
- Text: `#E8EAF0` (primary), `#7A8AAA` (muted), `#3A4560` (dim)
- Card backgrounds: `linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))`
- Section padding: `py-32 px-6`
- Max width: `max-w-5xl mx-auto` (except full-width sections)
- Each section needs an `id` attribute matching the SectionNav entries
