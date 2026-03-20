# AI Memory Landing — Design Overhaul Plan

> **Created:** 2026-03-19
> **Status:** Phase 0-3, 5 COMPLETE — Phase 4 (Spline Robot) pending
> **Goal:** Transform three pages into a cohesive site with distinct per-page identities — eliminating boxy repetition, adding leading-edge design, and giving each page its own visual personality while sharing the same DNA.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Shared DNA (All Pages)](#2-shared-dna-all-pages)
3. [Phase 0 — Pre-work & Asset Swaps](#3-phase-0--pre-work--asset-swaps)
4. [Phase 1 — Home Page: Command Center](#4-phase-1--home-page-command-center)
5. [Phase 2 — Parzival Page: Mechanical Intelligence](#5-phase-2--parzival-page-mechanical-intelligence)
6. [Phase 3 — Architecture Page: Digital Holographic](#6-phase-3--architecture-page-digital-holographic)
7. [Phase 4 — Spline Robot Integration](#7-phase-4--spline-robot-integration)
8. [Phase 5 — Cross-cutting Polish](#8-phase-5--cross-cutting-polish)
9. [Design Research Sources](#9-design-research-sources)
10. [Best Practices Reference](#10-best-practices-reference)
11. [Master Checklist](#11-master-checklist)

---

## 1. Design Philosophy

### The Problem

All three pages currently look the same — identical glass cards, identical hover effects (`translateY(-3px)`), identical `fadeUp` animations, identical section-divider patterns. The home page has 13 sections of repetitive cards stacked vertically. There is no visual personality per page.

### The Solution

**Same DNA, Different Feel.** Each page shares the core design system but has its own visual identity:

| Page | Identity | Feel | Dominant Colors |
|------|----------|------|-----------------|
| **Home** (`/`) | Command Center | Confident, product-forward, varied layouts | Balanced cyan/violet/magenta |
| **Architecture** (`/docs/architecture`) | Digital Holographic | Futuristic data visualization, interconnected | Cyan + Green (system/data) |
| **Parzival** (`/parzival`) | Mechanical Intelligence | Robot diagnostic HUD, precise, self-aware | Violet + Magenta (Parzival identity) |

### Design Principles

1. **Layout variety kills monotony** — No two adjacent sections should use the same layout pattern
2. **Animation should be contextual** — Security cards scan, decay cards fade, data cards pulse
3. **Each page needs a signature element** — Something visually unique you remember
4. **Less is more on the home page** — 7-8 focused sections, not 13
5. **Interactivity > decoration** — Hover states, scroll reveals, and data flows beat static gradients

---

## 2. Shared DNA (All Pages)

These elements remain consistent across all pages to maintain cohesion:

### Keep As-Is
- [x] **Color palette** — Cyan `#00F5FF`, Violet `#8B5CF6`, Magenta `#FF2D6A`, Green `#00FF88`, Amber `#FFB800`
- [x] **Typography** — Orbitron (headings), Bebas Neue (impact callouts), Outfit (body), JetBrains Mono (code)
- [x] **Glass card material** — Base `.glass-card` style stays as one option among several card types
- [x] **Grain texture overlay** — `body::before` SVG noise stays
- [x] **Framer Motion** — Same library, same easing curves `[0.25, 0.46, 0.45, 0.94]`
- [x] **Navbar + Footer** — Consistent navigation across all pages
- [x] **Section label badges** — `.section-label` style stays
- [x] **CSS custom properties** — `globals.css` design tokens stay

### Enhance Globally
- [ ] **Unified right-side section nav on ALL pages** — Port the Architecture page's `SectionNav` pattern (right-side circular dots with label on active, intersection observer, smooth scroll) to Home and Parzival pages. This replaces Parzival's left-side `ParzivalNav`. Creates consistent navigation language site-wide.
- [ ] Add new animation variants beyond `fadeUp` (see Phase 5)
- [ ] Add new card variants: "terminal panel", "holographic panel", "diagnostic card"
- [ ] Activate `.magnetic-hover` on all CTAs (currently defined but unused)
- [ ] Add character-by-character headline animation utility
- [ ] Enhance section transitions (replace uniform section-dividers with contextual transitions)

---

## 3. Phase 0 — Pre-work & Asset Swaps

### 3.1 Image Swap

Swap hero images between Home and Architecture pages. Containers, sizing, and styling stay identical — only the `src` changes.

| Location | Current Image | New Image |
|----------|--------------|-----------|
| Home hero right panel (`hero.tsx`) | `/ai-memory-4.png` | `/ai-memory-3.png` |
| Architecture hero background (`architecture-v2.tsx`) | `/ai-memory-3.png` | `/ai-memory-4.png` |

**Checklist:**
- [ ] In `src/components/sections/hero.tsx` — change `src="/ai-memory-4.png"` to `src="/ai-memory-3.png"`
- [ ] In `src/components/sections/architecture-v2.tsx` `HeroSection` — change `backgroundImage: "url('/ai-memory-3.png')"` to `backgroundImage: "url('/ai-memory-4.png')"`
- [ ] Verify both images render correctly at their respective sizes
- [ ] Check that architecture background dimming/filters still look right with the new image

### 3.2 New Global CSS Additions

Add new card variants and animation utilities to `globals.css`:

- [ ] `.terminal-panel` — Hard corners (or single rounded corner), thin top bar with status dot + title, monospace body, for Parzival page
- [ ] `.holo-panel` — Slight perspective transform, chromatic aberration border, HUD corner brackets with coordinate readout, for Architecture page
- [ ] `.circuit-trace` — Background pattern of right-angle lines with junction dots, for Parzival page
- [ ] `.data-stream` — Animated flowing line between sections, for Architecture page
- [ ] `.scan-line` — Horizontal line that slowly moves down the viewport, for Parzival page
- [ ] New animation keyframes: `slideFromLeft`, `slideFromRight`, `scaleIn`, `revealFromCenter`, `typewriter`, `scanSweep`

### 3.3 Unified Right-Side Section Nav

**Reference implementation:** `SectionNav` in `src/components/sections/architecture-v2.tsx` (lines 86-161)

The architecture page's right-side nav is the best navigation pattern in the site — minimal, non-intrusive, always accessible. Port this to all pages.

**Create:** `src/components/shared/section-nav.tsx`

- [ ] Extract `SectionNav` from `architecture-v2.tsx` into a shared, configurable component
- [ ] Accept props: `sections: { id: string; label: string; icon: LucideIcon }[]`
- [ ] Accept optional `accentColor` prop (defaults to cyan) — allows per-page color theming:
  - Home page: cyan (default)
  - Architecture page: cyan (matches current)
  - Parzival page: violet (matches identity)
- [ ] Behavior: Fixed right side, `top-1/2 -translate-y-1/2`, `hidden xl:flex`, circular icon buttons, active label tooltip, intersection observer, smooth scroll
- [ ] **Home page:** Add `SectionNav` with entries for each of the 8 consolidated sections
- [ ] **Parzival page:** Replace `ParzivalNav` (left-side panel) with the shared `SectionNav` (right-side dots, violet accent)
- [ ] **Architecture page:** Refactor existing `SectionNav` to use the shared component
- [ ] Remove `src/components/sections/parzival-nav.tsx` after migration (or keep as unused reference)

### 3.4 New Shared Components

- [ ] `src/components/shared/hud-brackets.tsx` — Reusable HUD corner bracket overlay with optional coordinate label
- [ ] `src/components/shared/data-flow-line.tsx` — Animated SVG line connecting two sections (replaces `section-divider` on architecture page)
- [ ] `src/components/shared/char-reveal.tsx` — Character-by-character text reveal animation for headlines

---

## 4. Phase 1 — Home Page: Command Center

### 4.1 Section Consolidation

**Current (13 sections):**
```
Hero → Differentiators → Features → Architecture → HowItWorks → Integrations →
Parzival → CodeExample → QuickStart → MemoryTypes → Integration → Pricing → GitHubCTA
```

**Target (8 sections):**
```
Hero → Capabilities → System Architecture → Integrations → Parzival Teaser →
Developer Experience → Pricing → CTA
```

**Merge map:**

| New Section | Merges From | Layout Type |
|------------|-------------|-------------|
| **Capabilities** | Differentiators + Features | Bento grid with mixed card sizes + micro-animations per card |
| **System Architecture** | Architecture + HowItWorks | Visual flow diagram with animated connections |
| **Integrations** | Integrations + Integration | Horizontal scroll belt with logo cards |
| **Developer Experience** | CodeExample + QuickStart | Tabbed showcase (Code / Quick Start / Memory Types) |

**Removed from home page (content moved to docs):**
- MemoryTypes → move to `/docs` or keep as tab in Developer Experience
- Integration (redundant with Integrations section)

### 4.2 Hero Improvements

**File:** `src/components/sections/hero.tsx`

- [ ] Swap image to `/ai-memory-3.png` (Phase 0)
- [ ] Increase Spline 3D iframe opacity from `0.30` to `0.50-0.60`
- [ ] Reduce overlay gradient opacity so the 3D scene is more visible
- [ ] Add character-by-character reveal animation to "CURE AI AMNESIA" headline
- [ ] Stats row: Use `NumberFlow` (already in dependencies) for animated number counting
- [ ] Make the hero image panel interactive — slight parallax tilt on mouse move using `useMotionValue`

**Why:** Interactive 3D in hero sections is a top 2026 differentiator (Figma trends). The Spline scene is already loaded but hidden at 30% — we're paying the performance cost without the visual benefit.

### 4.3 Capabilities Section (Merged Differentiators + Features)

**Replaces:** `differentiators.tsx` + `features.tsx`

- [ ] Create new `src/components/sections/capabilities.tsx`
- [ ] Use bento grid layout with dramatically mixed sizes:
  - 1 hero card (full-width, tall) for Semantic Decay with embedded decay animation
  - 2 medium cards side by side for Security + Dual Embedding
  - 3 small stat cards in a row
  - 1 wide card for Qdrant collections with inline collection visualization
  - 2 normal cards for remaining features
- [ ] Each card gets a unique hover micro-interaction:
  - Security card: scanline sweep effect
  - Decay card: content visually fades then sharpens
  - GitHub card: mini commit graph animation
  - Qdrant card: collection dots that connect on hover
- [ ] Remove the vertical timeline (too rigid/boxy)
- [ ] Keep the section label + headline pattern

**Why:** Evil Martians found bento grids are among the most effective feature layouts when "thoughtfully composed with mixed sizes." Cards with unique interactions create memorability.

### 4.4 System Architecture Section

**Replaces:** `architecture.tsx` + `how-it-works.tsx`

- [ ] Create new `src/components/sections/system-overview.tsx`
- [ ] Visual flow diagram: animated SVG showing data flowing from input → collections → retrieval
- [ ] Use `framer-motion` path drawing for connection lines
- [ ] Interactive: hover on a node to highlight its connections
- [ ] Brief text overlay, not full card descriptions (this is a teaser — full detail is on `/docs/architecture`)
- [ ] Add CTA: "Explore Full Architecture →" linking to `/docs/architecture`

### 4.5 Integrations Belt

**Replaces:** `integrations.tsx` + `integration.tsx`

- [ ] Create new `src/components/sections/integrations-belt.tsx`
- [ ] Horizontal scroll belt (auto-scrolling carousel) with integration cards
- [ ] Each card: logo + name + one-line description
- [ ] Scroll pauses on hover
- [ ] Full-width design breaking out of the `max-w-6xl` container

**Why:** Evil Martians found auto-scrolling carousels with integration logos signal maturity and fit more content than grids.

### 4.6 Developer Experience Tabs

**Replaces:** `code-example.tsx` + `quick-start.tsx` + `memory-types.tsx`

- [ ] Create new `src/components/sections/developer-experience.tsx`
- [ ] Three tabs: "Code Example" | "Quick Start" | "Memory Types"
- [ ] Animated tab transitions using `AnimatePresence`
- [ ] Code blocks use existing `react-syntax-highlighter`
- [ ] Keeps all content, just consolidates into one focused section

### 4.7 Home Page — Add Right-Side Section Nav

- [ ] Import shared `SectionNav` into `src/app/page.tsx`
- [ ] Define sections array matching the 8 consolidated sections: Hero, Capabilities, System Architecture, Integrations, Parzival, Developer Experience, Pricing, CTA
- [ ] Use cyan accent color (default)
- [ ] Ensure all section `id` attributes match the nav entries

### 4.8 Home Page Layout Variety Enforcement

After consolidation, verify layout variety:

| # | Section | Layout Type | Animation |
|---|---------|------------|-----------|
| 1 | Hero | Two-column with 3D | Parallax + character reveal |
| 2 | Capabilities | Bento grid (mixed sizes) | Staggered scale-in + unique hovers |
| 3 | System Architecture | Full-width visual flow | Path drawing + node pulse |
| 4 | Integrations | Horizontal scroll belt | Auto-scroll carousel |
| 5 | Parzival Teaser | Asymmetric card + CTA | Slide from left |
| 6 | Developer Experience | Tabbed content | Tab crossfade |
| 7 | Pricing | Existing cards (keep) | Existing animations |
| 8 | CTA | Centered with decorative orb | Scale-in + orbit |

- [ ] Confirm no two adjacent sections use the same layout pattern
- [ ] Remove all `section-divider` elements — replace with generous spacing (`py-32` to `py-40`)
- [ ] Add subtle background variation between sections (alternating mesh glow positions)

---

## 5. Phase 2 — Parzival Page: Mechanical Intelligence

### 5.1 Page-level Identity

**File:** `src/app/parzival/page.tsx`

- [ ] Add page-specific background: circuit board trace pattern (violet lines, right-angle paths, junction dots)
- [ ] Add persistent HUD overlay elements:
  - Top-left: `[PARZIVAL v2.0 | SYSTEM: ACTIVE]` in monospace
  - Top-right: animated clock/uptime counter
  - A thin horizontal scan line that slowly traverses the page (CSS animation, `position: fixed`)
- [ ] Replace `section-divider` with circuit-trace connector lines between sections
- [ ] Set page-specific color emphasis: violet + magenta dominant, cyan as accent only

### 5.2 Parzival Avatar / Visual Identity

**File:** `src/components/sections/parzival-identity.tsx`

- [ ] Create animated SVG avatar for Parzival:
  - Stylized robot/AI head silhouette
  - Glowing violet eyes with pulse animation
  - Circuit trace patterns on the face/body
  - Subtle idle animation (breathing glow, eye tracking)
- [ ] Place avatar prominently in the Identity section hero area
- [ ] The avatar becomes the visual anchor — memorable, character-defining
- [ ] Reserve space for Spline robot model integration (Phase 4)

**Why:** Robotics UI patterns on Dribbble consistently feature a strong visual centerpiece. A character page without a character visual is a missed opportunity.

### 5.3 Terminal Panel Card Variant

Replace glass cards with terminal-style panels throughout the Parzival page:

- [ ] **Terminal panel design:**
  - Rectangular with minimal border-radius (4px or `rounded-sm`)
  - Thin top bar (24px) with: colored status dot (green/amber/red) + panel title in monospace + optional close/minimize icons (decorative only)
  - Body has very subtle scanline overlay
  - Border: 1px solid with violet tint
  - Background: slightly more opaque than glass cards (less blur, more solid)
- [ ] Apply to: Identity cards, IS/IS NOT items, Mode content, Workflow steps, Constraint rules, Agent cards, Spec items

### 5.4 Identity Section Redesign

**File:** `src/components/sections/parzival-identity.tsx`

- [ ] Add Parzival avatar/visual (5.2) above the title
- [ ] Relationship Model cards: Render as connected nodes in a horizontal flow diagram, not three equal cards
  - Captain (left) → Navigator (center, highlighted) → Crew (right)
  - Animated connection lines between them
  - Navigator card is larger/elevated to show Parzival's central role
- [ ] IS / IS NOT section: Render as diagnostic comparison panels
  - Left panel: green scan line overlay, `[VERIFIED]` stamps on items
  - Right panel: red scan line overlay, `[BLOCKED]` stamps on items
  - Items enter with a diagnostic "checking..." animation then resolve to verified/blocked
- [ ] GC badges: Style as mechanical identifier plates (hard borders, monospace, slight emboss)

### 5.5 Modes Section Redesign

**File:** `src/components/sections/parzival-modes.tsx`

- [ ] Replace tab navigation with a mechanical mode-switch dashboard:
  - Three physical-looking toggle switches or dial indicators
  - LED-style status lights (green = active, amber = conditional)
  - Clicking a mode "activates" it with a switch animation
- [ ] Phase timeline: Render as a conveyor belt or assembly line visual
  - Phases are stations on the line
  - Active modes light up at each station
  - Animated progress indicator moves along the belt
- [ ] Content panels: Use terminal panel variant (5.3)
- [ ] Lifecycle items: Render as a vertical diagnostic readout with step numbers, status indicators, and artifact labels

### 5.6 Navigation — Switch to Unified Right-Side Nav

**Replaces:** `src/components/sections/parzival-nav.tsx` (left-side panel)

- [ ] Remove `ParzivalNav` import and usage from `src/app/parzival/page.tsx`
- [ ] Add shared `SectionNav` component with violet accent color
- [ ] Sections: Identity, Modes, Workflows, Constraints, Interface, Specs
- [ ] Icons: Keep existing icon mapping (Compass, Compass, GitBranch, ShieldAlert, Users, FileCode2)
- [ ] The right-side dot nav matches Architecture page pattern — creates site-wide consistency
- [ ] On Parzival page: active dot uses violet glow instead of cyan (per-page identity color)

### 5.7 Remaining Parzival Sections

- [ ] **Workflows** (`parzival-workflows.tsx`): Render as flowchart/state machine diagram, not card list
- [ ] **Constraints** (`parzival-constraints.tsx`): Render as a "warning panel" with severity-colored borders, klaxon-style icons, mechanical urgency
- [ ] **Agents** (`parzival-agents.tsx`): Render as a "crew roster" — each agent is a diagnostic card with role, status, model assignment, and a small icon avatar
- [ ] **Specs** (`parzival-specs.tsx`): Render as a technical data sheet with grid layout, specification numbers in large monospace, and section delineators
- [ ] **CTA** (`parzival-cta.tsx`): Keep existing structure but apply terminal panel styling

---

## 6. Phase 3 — Architecture Page: Digital Holographic

### 6.1 Page-level Identity

**File:** `src/components/sections/architecture-v2.tsx`

- [ ] Swap background image to `/ai-memory-4.png` (Phase 0)
- [ ] Enhance blueprint grid: Add animated "scanning" lines that sweep across periodically (horizontal radar sweep)
- [ ] Replace `section-divider` between sections with animated data-stream lines — glowing SVG paths that trace from bottom of one section to top of next
- [ ] Color emphasis: Lean into cyan + green (data/system colors), violet as accent only
- [ ] Add persistent holographic noise/shimmer to page background (subtle chromatic aberration effect)

### 6.2 Holographic Panel Card Variant

- [ ] **Holographic panel design:**
  - Slight CSS `perspective(1000px)` + `rotateY(1deg)` transform (barely perceptible depth)
  - Chromatic aberration on borders: thin red/blue color split on edges (CSS box-shadow trick)
  - HUD-style corner brackets with coordinate labels: `[NODE-05 | QDRANT]`
  - Faint horizontal scan lines inside the card
  - On hover: card "focuses" — perspective normalizes, border brightens, holographic shimmer intensifies
- [ ] Apply to: Collection cards, trigger cards, reference cards, pipeline detail panel

### 6.3 Hero Section Enhancement

**In `HeroSection()` within `architecture-v2.tsx`:**

- [ ] Image swap to `/ai-memory-4.png`
- [ ] Add holographic data particles that flow upward from the bottom (like data ascending through a system)
- [ ] Stats grid: Add animated number counting with `NumberFlow`
- [ ] Add subtle holographic flicker to the title text (CSS `@keyframes` with opacity micro-variations)

### 6.4 Pipeline Section Overhaul

**The pipeline is the architecture page's signature section.**

- [ ] Rebuild `PipelineFlow` as a true SVG/Canvas flow diagram:
  - Nodes are positioned in a flowing S-curve or circuit layout (not a flat horizontal line)
  - Curved connection paths between nodes with gradient strokes
  - Animated data packets (small glowing dots) travel along the paths continuously
  - Each node pulses when a packet passes through it
- [ ] Pipeline detail panel: Apply holographic panel variant
- [ ] Add "zoom" interaction — clicking a node expands it inline with more detail

### 6.5 Triple Fusion Diagram Rebuild

**Current issue:** Absolute positioning with percentages breaks on different viewports.

- [ ] Rebuild using CSS Grid or Flexbox for node positioning (responsive)
- [ ] Connection lines: Use SVG `<path>` with computed positions (measure node positions at render time)
- [ ] Animate paths with `stroke-dasharray` + `stroke-dashoffset` for drawing effect
- [ ] Add flowing particle trails along the paths (small dots moving from Dense/Sparse/ColBERT toward RRF)
- [ ] Make responsive: stack vertically on mobile with simplified connections

### 6.6 Collections Section Enhancement

- [ ] Apply holographic panel variant to collection cards
- [ ] Add a mini data visualization inside each card — small animated dot plot showing relative collection sizes
- [ ] Type badges inside cards: Add a subtle pulse animation to draw attention

### 6.7 Section Navigation Enhancement

**Current:** Right-side dot nav with labels.

- [ ] Add a vertical progress bar connecting the dots (fills as you scroll)
- [ ] Active section: Add a holographic ripple effect on the active dot
- [ ] On desktop: Show a mini section title tooltip that follows the scroll position

### 6.8 Data Flow Section Transitions

Replace `section-divider` with animated connectors:

- [ ] Between Hero → Overview: Vertical data stream (particles flowing down)
- [ ] Between Overview → Collections: Branching lines (one line splits into three for the three collection types)
- [ ] Between Collections → Pipeline: Converging lines (collections feed into the pipeline)
- [ ] Between remaining sections: Standard data stream lines

---

## 7. Phase 4 — Spline Robot Integration

> **Note:** This phase happens last, after all other design work is complete.

### 7.1 Spline Robot for Parzival Page

- [ ] Integrate the existing Spline robot model (mouse-reactive) into the Parzival page
- [ ] Placement options (decide during implementation):
  - **Option A:** Replace the SVG avatar in the Identity section hero
  - **Option B:** Fixed position in bottom-right corner, following scroll (like a companion)
  - **Option C:** Full-width behind the Identity section (similar to home hero Spline treatment)
- [ ] Ensure mouse interaction works with the robot model
- [ ] Add overlay gradient to blend the Spline scene with the page background
- [ ] Optimize: Lazy-load the Spline scene, show SVG avatar as placeholder until loaded

### 7.2 Performance Considerations

- [ ] Test page load time with Spline model
- [ ] Add `loading="lazy"` to the iframe
- [ ] Consider `IntersectionObserver` to only load when scrolled into view
- [ ] Fallback: If Spline fails to load, the SVG avatar remains

---

## 8. Phase 5 — Cross-cutting Polish

### 8.1 Animation Variety

Add these new animation variants to `src/components/shared/animated-section.tsx`:

- [ ] `slideFromLeft` — `{ opacity: 0, x: -40 } → { opacity: 1, x: 0 }`
- [ ] `slideFromRight` — `{ opacity: 0, x: 40 } → { opacity: 1, x: 0 }`
- [ ] `scaleIn` — `{ opacity: 0, scale: 0.8 } → { opacity: 1, scale: 1 }`
- [ ] `revealFromCenter` — `{ opacity: 0, scaleX: 0 } → { opacity: 1, scaleX: 1 }`
- [ ] `blurIn` — `{ opacity: 0, filter: "blur(12px)" } → { opacity: 1, filter: "blur(0px)" }`

Apply contextually:
- Timeline/flow items: `slideFromLeft` or `slideFromRight`
- Stat numbers: `scaleIn`
- Diagrams: `revealFromCenter`
- Section headings: `blurIn`

### 8.2 Typography Enhancement

- [ ] Use Bebas Neue for impactful single-word callouts (already loaded, currently underused)
- [ ] Add character-by-character reveal animation for key headlines (Home hero, section titles)
- [ ] Add variable font weight on hover for nav items

### 8.3 Micro-interactions

- [ ] Activate `.magnetic-hover` on all CTA buttons
- [ ] Section label badges: Add subtle pulse/shimmer animation
- [ ] Cards: Replace uniform `translateY(-3px)` with contextual hover states
- [ ] Add cursor glow effect on interactive elements (subtle radial gradient following cursor)

### 8.4 Performance Audit

- [ ] Run Lighthouse audit on all three pages
- [ ] Check that `prefers-reduced-motion` media query disables all new animations (existing code handles this)
- [ ] Verify no layout shift (CLS) from animation reveals
- [ ] Test on mobile: ensure all responsive breakpoints work
- [ ] Test that Spline iframes don't block main thread

### 8.5 Accessibility Check

- [ ] All new animations respect `prefers-reduced-motion`
- [ ] New HUD overlay text has sufficient contrast (WCAG AA minimum)
- [ ] Terminal panel card variant maintains text readability
- [ ] Interactive elements (mode switches, pipeline nodes) are keyboard accessible
- [ ] Screen reader: HUD decorative elements use `aria-hidden="true"`

---

## 9. Design Research Sources

### Developer Tool Landing Pages
- [Evil Martians: We studied 100 DevTool Landing Pages](https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025) — Layout patterns, hero section best practices, feature block storytelling, CTA design
- [SaaSFrame: 10 SaaS Landing Page Trends for 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples) — Narrative headlines, interactive product previews

### 2026 Web Design Trends
- [Figma: Top Web Design Trends for 2026](https://www.figma.com/resource-library/web-design-trends/) — Interactive 3D, bold typography, dark mode as standard
- [Really Good Designs: Web Design Trends 2026](https://reallygooddesigns.com/web-design-trends-2026/) — Exploratory layouts, chromatic mash-ups, oversized typography, scroll-triggered animations
- [Elementor: Web Design Trends 2026](https://elementor.com/blog/web-design-trends-2026/) — Mixed scroll directions, motion as brand identity
- [Hostinger: Web Design Trends 2026](https://www.hostinger.com/tutorials/web-design-trends) — Retrofuturism, sci-fi aesthetics, immersive 3D
- [UXPilot: 14 Web Design Trends 2026](https://uxpilot.ai/blogs/web-design-trends-2026) — Chromatic mash-ups, glitchy effects, neon-like gradients

### Dark UI & Glassmorphism
- [Dark Glassmorphism: The Aesthetic That Will Define UI in 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f) — Semi-transparent surfaces over vibrant gradients, text legibility with tinted overlays
- [Inverness Design Studio: Glassmorphism 2026](https://invernessdesignstudio.com/glassmorphism-what-it-is-and-how-to-use-it-in-2026) — Modern GPU rendering, performance considerations
- [UXPilot: 12 Glassmorphism Best Practices](https://uxpilot.ai/blogs/glassmorphism-ui) — Contrast ratios, ambient gradient placement

### Robot & Mechanical UI
- [Dribbble: Robotics UI Design](https://dribbble.com/search/robotics-ui-design) — HUD overlays, diagnostic readouts, mechanical interfaces
- [Dribbble: Robotic UI Themes](https://dribbble.com/tags/robotic-ui) — Terminal panels, circuit patterns, status indicators
- [Figma: Robotics Website UI](https://www.figma.com/community/file/1416404529253249881/robotics-website-ui) — Robot-themed web layout patterns
- [MockFlow: UI Design Trends 2026](https://mockflow.com/blog/ui-design-trends) — "Intentional incompleteness — UI that leans into raw, schematic, brutally clear layouts"

### Holographic & Futuristic UI
- [Dribbble: Holographic UI](https://dribbble.com/tags/holographic-ui) — Hovering panels, holographic renders, glowing nodes
- [Aesthetics in the AI Era: 2026 Visual Trends](https://medium.com/design-bootcamp/aesthetics-in-the-ai-era-visual-web-design-trends-for-2026-5a0f75a10e98) — Y3K design, half-digital half-organic environments
- [Tubik Studio: UI Design Trends 2026](https://blog.tubikstudio.com/ui-design-trends-2026/) — Believable motion, intentional rawness

### Landing Page Best Practices
- [Moburst: Landing Page Design Trends 2026](https://www.moburst.com/blog/landing-page-design-trends-2026/) — Conversion-focused layouts
- [TheeDigital: 20 Top Web Design Trends 2026](https://www.theedigital.com/blog/web-design-trends) — Dark mode as standard, high-contrast palettes
- [99designs: 50+ Futuristic Web Design Ideas](https://99designs.com/inspiration/websites/futuristic) — Futuristic website gallery and inspiration

---

## 10. Best Practices Reference

### From Evil Martians (100 DevTool Pages Study)

1. **Hero section:** Centered hero with headline + supporting visual below feels stable and trustworthy. Two CTAs — primary bold with specific language + secondary distinct style.
2. **No salesy messaging.** Clever simplicity wins. Clean design, solid typography, breathing room.
3. **Feature storytelling hierarchy:** Function lists (weakest) → Action-oriented → Problem-oriented → Bold statements → Mission statements (strongest).
4. **Layout variety matters:** Mix bento blocks, chess layout, horizontal belts, tabbed features, step-by-step flows, and rich cards. Never use the same layout twice in a row.
5. **Social proof:** Curated testimonials or hard metrics (GitHub stars, usage stats). Place immediately after hero.
6. **Integration logos:** Signal maturity. Auto-scrolling carousels fit more content.
7. **Final CTA:** Visually distinct "safety net" for visitors who scrolled without clicking. Single clear action.
8. **Supporting content:** FAQ and changelog signal active development but are lower priority.

### From 2026 Design Trends Research

1. **Interactive 3D** is a top differentiator — invest in making Spline scenes more prominent.
2. **Typography as experience** — words that stretch, shift, unravel on scroll. Animated headlines.
3. **Chromatic mash-ups** — glowing gradients mixed with grainy textures create a tactile, premium feel.
4. **Motion as brand identity** — signature animations that feel unique to your product.
5. **Dark mode first** — not just acceptable, expected. High-contrast accents on deep backgrounds signal premium.
6. **Scroll-triggered storytelling** — parallax layers, staggered reveals, and section transitions that guide the eye.

### Glassmorphism Best Practices

1. **Semi-transparent panels over ambient gradients** — the gradients must be vibrant enough to show through.
2. **Text legibility fix:** Add a subtle solid tint (10-30% opacity) behind text on glass panels.
3. **Don't overuse:** Glass works best as a highlight — not every card should be glass.
4. **Performance:** Modern GPUs handle blur well in 2026, but test on mobile.

---

## 11. Master Checklist

### Phase 0 — Pre-work ✅
- [x] Swap `ai-memory-4.png` ↔ `ai-memory-3.png` between Hero and Architecture
- [x] Add new CSS card variants (terminal-panel, holo-panel, circuit-trace) to `globals.css`
- [x] Add new animation keyframes to `globals.css`
- [x] Create shared `SectionNav` component (`src/components/shared/section-nav.tsx`)
- [x] Refactor architecture page to use shared `SectionNav`
- [x] Create `hud-brackets.tsx` shared component — _implemented inline in architecture-v2.tsx and parzival pages_
- [x] Create `data-flow-line.tsx` shared component — _implemented as DataStreamDivider in architecture-v2.tsx_
- [ ] Create `char-reveal.tsx` shared component — _deferred, not critical_

### Phase 1 — Home Page ✅
- [x] Increase Spline 3D opacity in hero (30% → 55%)
- [x] Bebas Neue impact font on "AMNESIA" + stat numbers
- [x] Create `capabilities.tsx` (merged Differentiators + Features bento grid)
- [x] Add unique hover micro-interactions per capability card (scanline, decay fade, commit dots, pulse)
- [x] Create `system-overview.tsx` (merged Architecture + HowItWorks flow diagram)
- [x] Create `integrations-belt.tsx` (horizontal scroll carousel)
- [x] Create `developer-experience.tsx` (tabbed Code/QuickStart/MemoryTypes)
- [x] Add shared `SectionNav` to home page (cyan accent, 8 sections)
- [x] Update `page.tsx` with new section structure (13 → 8 sections)
- [x] Remove `section-divider` elements, use generous spacing instead
- [x] Verify layout variety — no two adjacent sections use same pattern
- [x] Production build passes

### Phase 2 — Parzival Page ✅
- [x] Add circuit board trace background pattern
- [x] Add persistent HUD overlay elements (`[PARZIVAL v2.0 | SYSTEM: ACTIVE]`, telemetry)
- [x] Add scan line animation
- [x] Create Parzival SVG avatar with glow + circuit patterns
- [x] Convert all cards to terminal panel variant
- [x] Redesign Identity section: avatar + node flow for relationships + diagnostic IS/IS NOT panels
- [x] Redesign Modes section: mechanical mode-switch dashboard + conveyor belt timeline
- [x] Replace `ParzivalNav` (left panel) with shared `SectionNav` (right-side dots, violet accent)
- [x] Redesign Workflows as flowchart/state machine with animated SVG connectors
- [x] Redesign Constraints as severity-grouped warning panels (CRITICAL/HIGH/MEDIUM)
- [x] Redesign Agents as crew roster diagnostic cards with team status header
- [x] Redesign Specs as technical data sheet grid with large values
- [x] Apply terminal panel styling to CTA (simulated terminal prompt)
- [x] Replace section-dividers with circuit-trace connectors
- [x] Production build passes

### Phase 3 — Architecture Page ✅
- [x] Swap background image to `/ai-memory-4.png`
- [x] Add animated radar sweep to blueprint grid
- [x] Replace section-dividers with data-stream animated connectors (8 contextual color pairs)
- [x] Apply holographic treatment to collection cards (perspective, chromatic aberration, HUD labels)
- [x] Enhance hero with upward-flowing data particles
- [x] Add holographic flicker to title text
- [x] Rebuild Triple Fusion diagram with responsive CSS grid layout
- [x] Implement contextual data-flow transitions between sections
- [x] Bebas Neue impact font on stat numbers
- [x] Production build passes

### Phase 4 — Spline Robot ⏳ (Pending)
- [ ] Integrate Spline robot model into Parzival page
- [ ] Choose placement (avatar replacement / fixed companion / background)
- [ ] Add mouse interaction support
- [ ] Add overlay gradient blending
- [ ] Implement lazy loading with SVG avatar fallback
- [ ] Test performance impact

### Phase 5 — Cross-cutting Polish ✅
- [x] Add animation variants: slideFromLeft, slideFromRight, scaleIn, blurIn
- [x] Activate magnetic hover on all CTAs (hero, navbar, parzival, architecture)
- [x] Add section label shimmer animation (::after sweep)
- [x] Typography: Bebas Neue `--font-impact` token for callouts
- [ ] Run Lighthouse performance audit (all 3 pages) — _deferred to QA_
- [ ] Run accessibility audit — _deferred to QA_
- [ ] Test all responsive breakpoints — _deferred to QA_
- [ ] Final visual QA — _deferred to QA_

---

## Implementation Order

```
Phase 0 (Pre-work)           ██████████  ✅ COMPLETE
Phase 1 (Home Page)           ██████████  ✅ COMPLETE
Phase 2 (Parzival)            ██████████  ✅ COMPLETE
Phase 3 (Architecture)        ██████████  ✅ COMPLETE
Phase 4 (Spline Robot)        ░░░░░░░░░░  ⏳ PENDING (awaiting Spline model)
Phase 5 (Polish)              ████████░░  ✅ CORE COMPLETE (QA deferred)
```

> **All core design work is complete.** Phase 4 (Spline robot integration) will be done once the robot model is ready. QA testing (Lighthouse, accessibility, responsive) should be done before final deployment.
