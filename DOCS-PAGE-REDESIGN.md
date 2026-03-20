# Docs Page Redesign — Implementation Plan

**Project:** AI Memory Landing (`/home/parzival/projects/agent-skills/dev-program/dev-spline-design/ai-memory-landing`)
**Target File:** `src/app/docs/page.tsx` (full rewrite)
**New Files:** Listed in each feature section below
**Date:** 2026-03-20

---

## How to Manage the Docs Page (Read This First)

This section explains how the docs page works for anyone who needs to add, edit, or remove documentation entries. **No database is needed.** Everything is stored in two JavaScript arrays inside two files. The command palette search (Cmd+K) fuzzy-filters one array, and the bento grid renders the other.

---

### How the System Works

The docs page has three areas:

1. **Command palette search** — a Cmd+K dialog that lets users search all doc entries by typing keywords. Powered by the `cmdk` library which does client-side fuzzy matching against a hardcoded array.
2. **Bento grid** — an asymmetric card layout where each card links to a doc section or page. Some cards have mini animated previews.
3. **Terminal quick start** — a fixed terminal block showing 3 setup commands.

There is **no CMS, no markdown parsing, no API, and no database**. All doc entries live as plain JavaScript objects in two files. To add a new doc, you add an object to each file.

---

### Step-by-Step: Adding a New Documentation Entry

#### Step 1: Add to the search (command-search.tsx)

**File:** `src/components/docs/command-search.tsx`

Find the `DOC_SEARCH_ITEMS` array (around line 28). Add a new object:

```typescript
{
  id: "my-new-doc",                           // unique ID (lowercase, kebab-case)
  label: "My New Doc",                         // display name shown in search results
  description: "What this doc covers",         // short description shown below the label
  category: "Core Concepts",                   // group heading — MUST match an existing category (see below)
  icon: Database,                              // Lucide icon — must be imported at top of file
  href: "/docs/my-new-doc",                    // where clicking takes the user (see href rules below)
},
```

**Available categories** (defined in `CATEGORY_COLORS` on line 40):
- `"Getting Started"` — green (#00FF88)
- `"Core Concepts"` — cyan (#00F5FF)
- `"Security & Ops"` — magenta (#FF2D6A)
- `"Integrations"` — violet (#8B5CF6)

To add a **new category**, add a new key to `CATEGORY_COLORS`:
```typescript
const CATEGORY_COLORS: Record<string, string> = {
  "Getting Started": "#00FF88",
  "Core Concepts": "#00F5FF",
  "Security & Ops": "#FF2D6A",
  "Integrations": "#8B5CF6",
  "My New Category": "#FFB800",    // <-- add here
};
```

**Available icons** (already imported at top of file):
`Search`, `Download`, `Database`, `Webhook`, `Shield`, `Github`, `BarChart3`, `Code2`, `Layers`, `Zap`

To use a different Lucide icon, add it to the import statement at the top:
```typescript
import { Search, Download, Database, /* ...existing... */, BookOpen } from "lucide-react";
```
Full icon list: https://lucide.dev/icons/

#### Step 2: Add to the bento grid (bento-grid.tsx)

**File:** `src/components/docs/bento-grid.tsx`

Find the `DOC_CARDS` array (around line 36). Add a new object:

```typescript
{
  id: "my-new-doc",                           // must match the search item id
  title: "My New Doc",                         // card title
  description: "What this doc covers in more detail.", // card description
  icon: Database,                              // Lucide icon — must be imported at top of file
  color: "#00F5FF",                            // accent color for border, icon bg, glow (see color list below)
  colSpan: 4,                                  // card width: 4 = standard, 8 = wide/hero, 12 = full width
  rowSpan: 1,                                  // card height: 1 = standard, 2 = tall
  href: "/docs/my-new-doc",                    // must match the search item href
},
```

**Color values to use** (from the project design system):
| Color | Hex | Use for |
|-------|-----|---------|
| Cyan | `#00F5FF` | Primary features |
| Violet | `#8B5CF6` | Architecture, core systems |
| Magenta | `#FF2D6A` | Security, warnings |
| Green | `#00FF88` | Success, quick actions |
| Amber | `#FFB800` | Monitoring, alerts |
| Blue | `#3B82F6` | Install, API, info |

**Card sizes explained:**
| colSpan | rowSpan | Result | Use for |
|---------|---------|--------|---------|
| 4 | 1 | Standard card | Most docs |
| 4 | 2 | Tall card | Docs with previews or extra content |
| 8 | 1 | Wide card | Important docs (API, etc.) |
| 8 | 2 | Hero card | Most important doc (Architecture) |
| 12 | 1 | Full width | Banners, announcements |

**Card order matters** — cards render in array order and fill the grid left-to-right, top-to-bottom. Place wider cards first in a row.

#### Step 3: Create the destination page

**href rules:**
- `"/docs/my-new-doc"` — links to a separate page. You must create the file `src/app/docs/my-new-doc/page.tsx`.
- `"#my-section-id"` — scrolls to a section on the same docs page. You must add a `<section id="my-section-id">` in `src/app/docs/page.tsx`.

**To create a new sub-page** at `/docs/my-new-doc`:

1. Create the directory: `src/app/docs/my-new-doc/`
2. Create the file: `src/app/docs/my-new-doc/page.tsx`
3. Use this template:

```tsx
"use client";

import { motion } from "framer-motion";
import { Particles } from "@/components/shared/page-decorations";

export default function MyNewDocPage() {
  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-mesh z-0" />
      <Particles />

      <main id="main" className="relative z-10">
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(0, 245, 255, 0.06)",
                  border: "1px solid rgba(0, 245, 255, 0.15)",
                  color: "#00F5FF",
                }}
              >
                Documentation
              </div>

              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                My New Doc Title
              </h1>

              {/* Content goes here */}
              <div className="prose prose-invert max-w-none" style={{ color: "#7A8AAA" }}>
                <p>Your documentation content here.</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
```

**To add an on-page section** instead (scrolls to it via `#anchor`):

In `src/app/docs/page.tsx`, add a new `<section>` with a matching `id` attribute. Add it before the closing `</main>` tag, with a `<SectionDivider />` above it:

```tsx
<SectionDivider />

<section id="my-section-id" className="py-20 px-6">
  <div className="max-w-5xl mx-auto">
    <h2
      className="text-3xl sm:text-4xl font-bold mb-4"
      style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
    >
      Section Title
    </h2>
    <p style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}>
      Content here.
    </p>
  </div>
</section>
```

If you add an on-page section, also add it to the **sidebar** so users can navigate to it:

**File:** `src/components/docs/docs-sidebar.tsx`

Find the `SIDEBAR_ITEMS` array (line 24) and add:
```typescript
{ id: "my-section-id", label: "My Section", icon: Database },
```

#### Step 4: (Optional) Add a card preview animation

Card previews are small animated visualizations inside bento cards. They are optional. Existing previews:
- `ArchitecturePreview` — pipeline step dots
- `CollectionsPreview` — cycling collection badges
- `SecurityPreview` — 3-layer scan bars
- `HooksPreview` — flow diagram with animated arrows

To add one:
1. Create a file: `src/components/docs/card-previews/my-preview.tsx`
2. Export a component (keep it under 80 lines, CSS/SVG only, no canvas)
3. Import it in `bento-grid.tsx` and add `preview: <MyPreview />` to the card object

---

### Step-by-Step: Editing an Existing Doc Entry

1. Find the entry in `DOC_SEARCH_ITEMS` (command-search.tsx) — update label, description, or href
2. Find the matching entry in `DOC_CARDS` (bento-grid.tsx) — update the same fields
3. If you changed the `href`, update or create the destination page/section

---

### Step-by-Step: Removing a Doc Entry

1. Remove the object from `DOC_SEARCH_ITEMS` in `command-search.tsx`
2. Remove the matching object from `DOC_CARDS` in `bento-grid.tsx`
3. If the sidebar references it, remove it from `SIDEBAR_ITEMS` in `docs-sidebar.tsx`
4. Optionally delete the destination page file if no longer needed

---

### Step-by-Step: Editing the Terminal Quick Start Commands

**File:** `src/components/docs/terminal-quickstart.tsx`

Find the `COMMANDS` array (around line 10):
```typescript
const COMMANDS = [
  { prompt: "$", command: "git clone https://github.com/Hidden-History/ai-memory.git && cd ai-memory", delay: 0 },
  { prompt: "$", command: "cp .env.example .env && docker compose up -d", delay: 0.8 },
  { prompt: "$", command: "curl http://localhost:8000/health", delay: 1.6 },
];
```

- `prompt` — the prompt character shown before the command (usually `$`)
- `command` — the actual command text
- `delay` — seconds before the typing animation starts for this line (increase by ~0.8 per line)

The response line is in the `RESPONSE` constant just below:
```typescript
const RESPONSE = {
  text: '{"status": "healthy", "collections": 5, "qdrant": "connected"}',
  delay: 2.4,
};
```

---

### File Map (Where Everything Lives)

```
src/app/docs/page.tsx                        ← Main docs page (hero, grid, terminal)
src/components/docs/command-search.tsx        ← Search items array + Cmd+K dialog
src/components/docs/bento-grid.tsx            ← Card data array + bento layout
src/components/docs/docs-sidebar.tsx          ← Sidebar nav items array
src/components/docs/terminal-quickstart.tsx   ← Terminal commands array
src/components/docs/tilt-card.tsx             ← Card hover tilt effect (don't edit)
src/components/docs/card-previews/            ← Mini animations inside cards
src/hooks/use-active-section.ts              ← Sidebar scroll tracking (don't edit)
src/hooks/use-copy-clipboard.ts              ← Copy button logic (don't edit)
src/app/globals.css                          ← CSS animations (scroll-reveal, etc.)
```

---

### Quick Reference: Complete Example (Adding "Tutorials" Doc)

**1. command-search.tsx** — add to `DOC_SEARCH_ITEMS`:
```typescript
{ id: "tutorials", label: "Tutorials", description: "Step-by-step guides for common workflows", category: "Getting Started", icon: BookOpen, href: "/docs/tutorials" },
```
(Also add `BookOpen` to the lucide-react import at the top)

**2. bento-grid.tsx** — add to `DOC_CARDS`:
```typescript
{
  id: "tutorials",
  title: "Tutorials",
  description: "Step-by-step guides for common workflows and real-world usage patterns.",
  icon: BookOpen,
  color: "#00FF88",
  colSpan: 4,
  rowSpan: 1,
  href: "/docs/tutorials",
},
```
(Also add `BookOpen` to the lucide-react import at the top)

**3. Create** `src/app/docs/tutorials/page.tsx` using the template above.

**4. Run** `npm run build` to verify no errors.

---

## Goal

Replace the current minimal docs page (hero + 7 uniform cards) with a cutting-edge 2026 documentation landing page featuring 8 advanced design features: command palette search, bento grid layout, scroll-driven animations, interactive card previews, floating sidebar navigation, aurora mesh background, perspective tilt cards, and a terminal quick-start block.

---

## Pre-Implementation Checklist

- [ ] Install new dependency: `npm install cmdk`
- [ ] Verify existing dependencies are available: `framer-motion`, `lucide-react`, `react-syntax-highlighter`, `react-intersection-observer`, `clsx`, `tailwind-merge`
- [ ] Read and understand the existing design system in `src/app/globals.css` before writing any new CSS
- [ ] Build passes before starting: `npm run build`

---

## Architecture Overview

```
src/app/docs/page.tsx                    ← Full rewrite (orchestrator)
src/components/docs/command-search.tsx   ← NEW: Command palette (Cmd+K)
src/components/docs/bento-grid.tsx       ← NEW: Bento layout + card data
src/components/docs/tilt-card.tsx        ← NEW: Perspective tilt wrapper
src/components/docs/terminal-quickstart.tsx ← NEW: Terminal typing block
src/components/docs/docs-sidebar.tsx     ← NEW: Floating sidebar nav
src/components/docs/card-previews/      ← NEW: Directory for card preview micro-visualizations
  architecture-preview.tsx
  collections-preview.tsx
  security-preview.tsx
  hooks-preview.tsx
src/hooks/use-active-section.ts          ← NEW: Intersection Observer hook
src/hooks/use-copy-clipboard.ts          ← NEW: Copy-to-clipboard hook
```

---

## Existing Design System Reference

All new code MUST use these existing tokens. Do NOT create new color variables or font families.

### Colors (CSS Variables from globals.css)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-base` | `#0A0D1A` | Page background |
| `--color-bg-surface` | `#0F1428` | Card backgrounds |
| `--color-bg-elevated` | `#141932` | Floating elements |
| `--color-bg-card` | `rgba(15, 20, 50, 0.75)` | Semi-transparent cards |
| `--color-border` | `rgba(0, 245, 255, 0.14)` | Default border |
| `--color-border-bright` | `rgba(0, 245, 255, 0.35)` | Active/hover border |
| `--color-primary` | `#00F5FF` | Cyan — primary accent |
| `--color-secondary` | `#8B5CF6` | Violet — secondary accent |
| `--color-accent` | `#FF2D6A` | Magenta — tertiary accent |
| `--color-success` | `#00FF88` | Green — success states |
| `--color-warning` | `#FFB800` | Amber — warning states |
| `--color-blue` | `#3B82F6` | Blue — info states |
| `--color-text` | `#E8EAF0` | Primary text |
| `--color-text-muted` | `#7A8AAA` | Secondary text (descriptions) |
| `--color-text-dim` | `#5A6480` | Tertiary text (labels) |

### Color Constants (lib/colors.ts)

```typescript
import { CYAN, VIOLET, MAGENTA, GREEN, AMBER, SLATE, MUTED } from "@/lib/colors";
// CYAN="#00F5FF" VIOLET="#8B5CF6" MAGENTA="#FF2D6A" GREEN="#00FF88"
// AMBER="#FFB800" SLATE="#E8EAF0" MUTED="#7A8AAA"
```

### Font Families

| Variable | Font | Weights | Usage |
|----------|------|---------|-------|
| `var(--font-heading)` | Orbitron | 400, 700, 900 | Headings, titles |
| `var(--font-impact)` | Bebas Neue | 400 | Large impact text, stats |
| `var(--font-body)` | Outfit | 300, 500, 700 | Body copy |
| `var(--font-mono)` | JetBrains Mono | 400, 500, 600 | Code, labels, badges |

Apply via: `style={{ fontFamily: "var(--font-heading)" }}` or `className="font-[family-name:var(--font-mono)]"`

### Existing CSS Utility Classes (use these, don't recreate)

| Class | Effect |
|-------|--------|
| `.bg-mesh` | Animated gradient mesh background |
| `.neural-grid` | Grid overlay (3.5% opacity) |
| `.glass-card` | Glassmorphic card with hover |
| `.gradient-border` | Animated cyan→violet→magenta border |
| `.gradient-text` | Static gradient text |
| `.gradient-text-animated` | Animated gradient text (8s) |
| `.glow-primary` | Cyan glow box-shadow |
| `.glow-text` | Text glow shadow |
| `.magnetic-hover` | Smooth hover transform |
| `.terminal-panel` | Terminal UI styling |
| `.section-label` | Badge with shimmer animation |
| `.neon-line-h` / `.neon-line-v` | Neon line accents |

### Existing Animation Classes

| Class | Duration | Effect |
|-------|----------|--------|
| `.animate-float` | 6s | Gentle float |
| `.animate-float-slow` | 8s | Slower float |
| `.animate-pulse-glow` | 4s | Pulsing glow |
| `.animate-spin-slow` | 30s | Slow rotation |
| `.animate-scan-sweep` | 8s | Scan line |

### Existing Components to Reuse

| Component | Import | Usage |
|-----------|--------|-------|
| `cn()` | `@/lib/utils` | Class merging (clsx + tw-merge) |
| `Button` | `@/components/ui/button` | Variants: default, outline, ghost, secondary. Sizes: default, xs, sm, lg |
| `ShineBorder` | `@/components/ui/shine-border` | Props: `borderRadius`, `borderWidth`, `duration`, `color`, `children` |
| `AnimatedSection` | `@/components/shared/animated-section` | Props: `children`, `className?`, `delay?`. Uses fadeUp + IntersectionObserver |
| `SectionNav` | `@/components/shared/section-nav` | Props: `sections: { id, label, icon }[]`, `accentColor?` |
| `Particles` | `@/components/shared/page-decorations` | Fixed particle overlay (z-10) |
| `SectionDivider` | `@/components/shared/page-decorations` | LED-strobe horizontal divider |

### Key Dependencies Already Installed

```json
{
  "framer-motion": "^12.38.0",
  "lucide-react": "^0.577.0",
  "react-syntax-highlighter": "^16.1.1",
  "react-intersection-observer": "^10.0.3",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.5.0",
  "@react-three/fiber": "^9.5.0",
  "next": "16.1.7",
  "react": "19.2.3"
}
```

### Path Alias

`@/*` resolves to `./src/*` (tsconfig.json)

---

## Feature 1: Command Palette Search (Cmd+K)

**New dependency:** `cmdk` (install via `npm install cmdk`)
**New file:** `src/components/docs/command-search.tsx`

### Requirements

- [ ] Large search input centered in hero area with placeholder "Search documentation... Cmd+K"
- [ ] `Cmd+K` (Mac) / `Ctrl+K` (Windows) keyboard shortcut opens a floating dialog overlay
- [ ] The search input in the hero AND the keyboard shortcut both open the same command dialog
- [ ] Dialog contains doc categories grouped by type with icons
- [ ] Fuzzy filtering built into cmdk — no custom filter needed
- [ ] Keyboard navigation (arrow keys, Enter to select)
- [ ] Selection navigates to the relevant section (scroll or route)
- [ ] Dialog has backdrop blur overlay matching site aesthetic
- [ ] `Escape` closes the dialog
- [ ] Must be `"use client"` component

### Search Items Data

```typescript
const DOC_SEARCH_ITEMS = [
  // Getting Started
  { id: "install", label: "Installation", description: "Docker stack setup, environment configuration", category: "Getting Started", icon: Download, href: "#install" },
  { id: "quickstart", label: "Quick Start", description: "3 commands to running AI Memory", category: "Getting Started", icon: Zap, href: "#quickstart" },

  // Core Concepts
  { id: "collections", label: "Collections", description: "5 Qdrant collections — code-patterns, conventions, discussions, github, jira-data", category: "Core Concepts", icon: Database, href: "#collections" },
  { id: "architecture", label: "Architecture", description: "Pipeline overview, signal-triggered memory, dual embedding", category: "Core Concepts", icon: Layers, href: "/docs/architecture" },
  { id: "hooks", label: "Hooks", description: "Claude Code hook pipeline — conversation to vector storage", category: "Core Concepts", icon: Webhook, href: "#hooks" },

  // Security & Ops
  { id: "security", label: "Security", description: "3-layer pipeline — PII detection, secrets scanning, content filtering", category: "Security & Ops", icon: Shield, href: "#security" },
  { id: "monitoring", label: "Monitoring", description: "Prometheus metrics, Grafana dashboards, health checks", category: "Security & Ops", icon: BarChart3, href: "#monitoring" },

  // Integrations
  { id: "integrations", label: "Integrations", description: "GitHub sync, Jira sync, Langfuse observability", category: "Integrations", icon: Github, href: "#integrations" },
  { id: "api", label: "API Reference", description: "REST API for collection access, search, memory management", category: "Integrations", icon: Code2, href: "#api" },
];
```

### Styling Specifications

**Hero search input:**
- Width: `max-w-2xl`, centered
- Background: `rgba(15, 20, 50, 0.6)` with `backdrop-filter: blur(16px)`
- Border: `1px solid rgba(0, 245, 255, 0.15)` — brightens to `0.35` on focus
- Font: `var(--font-mono)`, size `text-base`
- Padding: `px-6 py-4`
- Right side: `Cmd+K` badge (`px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono`)
- Glow on focus: `box-shadow: 0 0 30px rgba(0,245,255,0.12)`
- Left side: Search icon (lucide `Search`, 20px, color `text-dim`)

**Command dialog overlay:**
- Backdrop: `bg-black/60 backdrop-blur-sm`
- Dialog: `max-w-xl mx-auto mt-[20vh]`
- Background: `rgba(15, 20, 50, 0.95)` with `backdrop-filter: blur(24px)`
- Border: `1px solid rgba(0, 245, 255, 0.15)`
- Border radius: `rounded-2xl`
- Shadow: `0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,255,0.05)`
- Input inside dialog: no visible border, transparent background, `text-lg`
- Group headings: `text-xs font-mono uppercase tracking-widest text-dim`
- Items: `px-4 py-3 rounded-xl` — selected state: `bg-primary/8 border border-primary/15`
- Item icon: `w-5 h-5` in color matching the category
- Item description: `text-sm text-muted`
- Empty state: "No results found" centered, `text-muted`

### Implementation Pattern

```tsx
"use client";
import { Command } from "cmdk";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Keyboard listener for Cmd+K / Ctrl+K
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };
  document.addEventListener("keydown", down);
  return () => document.removeEventListener("keydown", down);
}, []);
```

---

## Feature 2: Bento Grid Layout

**New file:** `src/components/docs/bento-grid.tsx`

### Requirements

- [ ] 12-column CSS Grid layout with `gap-4` (16px)
- [ ] Cards have variable spans based on importance
- [ ] Responsive: 12-col on desktop (lg+), 8-col on tablet (md), single column on mobile
- [ ] Each card slot receives its content as children (card previews are separate components)
- [ ] Grid uses Tailwind classes, NOT a separate CSS file

### Card Layout Map

```
Desktop (lg: 1024px+):
┌──────────────────────┬───────────┐
│   Architecture (8)   │ Install   │
│                      │   (4)     │
├───────────┬──────────┴───────────┤
│Collections│     Hooks (4)        │
│   (4)     ├──────────────────────┤
│  (tall)   │   Security (4)       │
├───────────┼──────────────────────┤
│  GitHub   │   Monitoring         │
│   (4)     │      (4)             │
├───────────┴──────────┬───────────┤
│      API (8)         │ Quickstart│
│                      │   (4)     │
└──────────────────────┴───────────┘

Tablet (md: 768px-1023px):
2 columns, each card spans full width or half

Mobile (<768px):
Single column, all cards full width
```

### Card Data with Grid Spans

```typescript
const DOC_CARDS = [
  {
    id: "architecture",
    title: "Architecture",
    description: "Pipeline overview, signal-triggered memory capture, dual-embedding routing, and the 9-step processing flow.",
    icon: Layers,
    color: VIOLET,
    colSpan: 8,    // hero card
    rowSpan: 2,
    href: "/docs/architecture",
    hasPreview: true,  // gets an interactive preview component
  },
  {
    id: "install",
    title: "Installation",
    description: "Docker stack setup, environment configuration, and first-run guide.",
    icon: Download,
    color: "#3B82F6",
    colSpan: 4,
    rowSpan: 2,
    href: "#install",
  },
  {
    id: "collections",
    title: "Collections",
    description: "5 Qdrant collections — code-patterns, conventions, discussions, github, jira-data.",
    icon: Database,
    color: CYAN,
    colSpan: 4,
    rowSpan: 2,    // tall card
    href: "#collections",
    hasPreview: true,
  },
  {
    id: "hooks",
    title: "Hooks",
    description: "Claude Code hook pipeline — how memories flow from conversation to vector storage.",
    icon: Webhook,
    color: MAGENTA,
    colSpan: 4,
    rowSpan: 1,
    href: "#hooks",
    hasPreview: true,
  },
  {
    id: "security",
    title: "Security",
    description: "3-layer security pipeline — PII detection, secrets scanning, and content filtering.",
    icon: Shield,
    color: MAGENTA,
    colSpan: 4,
    rowSpan: 1,
    href: "#security",
    hasPreview: true,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "GitHub sync, Jira sync, and Langfuse observability configuration.",
    icon: Github,
    color: CYAN,
    colSpan: 4,
    rowSpan: 1,
    href: "#integrations",
  },
  {
    id: "monitoring",
    title: "Monitoring",
    description: "Prometheus metrics, Grafana dashboards, and health check endpoints.",
    icon: BarChart3,
    color: AMBER,
    colSpan: 4,
    rowSpan: 1,
    href: "#monitoring",
  },
  {
    id: "api",
    title: "API Reference",
    description: "REST API reference for direct collection access, search, and memory management.",
    icon: Code2,
    color: "#3B82F6",
    colSpan: 8,    // wide card
    rowSpan: 1,
    href: "#api",
  },
  {
    id: "quickstart",
    title: "Quick Start",
    description: "3 commands to a running AI Memory instance.",
    icon: Zap,
    color: GREEN,
    colSpan: 4,
    rowSpan: 1,
    href: "#quickstart",
  },
];
```

### Tailwind Grid Implementation

```tsx
<div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
  {DOC_CARDS.map((card) => (
    <div
      key={card.id}
      className={cn(
        // Mobile: always full width
        "col-span-1",
        // Tablet
        card.colSpan >= 8 ? "md:col-span-8" : "md:col-span-4",
        // Desktop
        card.colSpan === 12 ? "lg:col-span-12" :
        card.colSpan === 8 ? "lg:col-span-8" :
        "lg:col-span-4",
        // Row spans
        card.rowSpan === 2 && "lg:row-span-2",
      )}
    >
      <TiltCard>
        <BentoCard card={card} />
      </TiltCard>
    </div>
  ))}
</div>
```

### Individual Card Styling

Each bento card:
- Background: `rgba(15, 20, 40, 0.55)` with `backdrop-filter: blur(24px) saturate(140%)`
- Border: `1px solid ${card.color}20` — hover: `${card.color}40`
- Border radius: `rounded-2xl`
- Padding: `p-6` (standard), `p-8` (hero cards with colSpan >= 8)
- Top accent line: `absolute top-0 left-0 right-0 h-px` with `linear-gradient(90deg, transparent, ${card.color}50, transparent)`
- Left color bar: `absolute left-0 top-0 bottom-0 w-[2px]` with `linear-gradient(to bottom, ${card.color}, ${card.color}30)`
- Shadow: `0 0 40px ${card.color}04, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`
- Hover shadow: `0 0 60px ${card.color}08, 0 12px 40px rgba(0,0,0,0.4)`
- Transition: `transition-all duration-300`
- Cursor: `cursor-pointer`
- Full height: `h-full` (important for bento layout alignment)

Card content layout:
- Icon badge: `w-10 h-10 rounded-xl` with `${card.color}15` bg and `${card.color}40` border
- Title: `font-[family-name:var(--font-heading)] font-semibold text-lg` (standard) or `text-xl` (hero)
- Description: `text-sm leading-relaxed` color `#7A8AAA`
- Preview component renders below description in hero/tall cards
- Arrow icon: `ArrowRight` in bottom-right, `opacity-0 group-hover:opacity-100 transition-opacity`

---

## Feature 3: CSS Scroll-Driven Animations

**Modified file:** `src/app/globals.css` (add new keyframe + utility class)

### Requirements

- [ ] Cards animate in as they enter viewport using CSS `animation-timeline: view()`
- [ ] Fallback for Firefox: elements are visible by default (no JS needed)
- [ ] Reading progress bar at top of page using `animation-timeline: scroll()`
- [ ] All animations respect `prefers-reduced-motion`

### CSS to Add to globals.css

```css
/* ── Scroll-driven card reveal ── */
@keyframes scroll-reveal {
  from {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }
}

.scroll-reveal {
  animation: scroll-reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 80%;
}

/* Staggered delay variants for bento cards */
.scroll-reveal-delay-1 { animation-delay: 0.05s; }
.scroll-reveal-delay-2 { animation-delay: 0.1s; }
.scroll-reveal-delay-3 { animation-delay: 0.15s; }

/* Firefox / unsupported fallback */
@supports not (animation-timeline: view()) {
  .scroll-reveal {
    opacity: 1;
    transform: none;
    filter: none;
    animation: none;
  }
}

/* ── Reading progress bar ── */
@keyframes reading-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00F5FF, #8B5CF6, #FF2D6A);
  transform-origin: left;
  animation: reading-progress linear;
  animation-timeline: scroll(root block);
  z-index: 9999;
}

@supports not (animation-timeline: scroll()) {
  .reading-progress { display: none; }
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .reading-progress {
    animation: none !important;
    opacity: 1;
    transform: none;
    filter: none;
  }
}
```

---

## Feature 4: Interactive Doc Card Previews

**New files:**
- `src/components/docs/card-previews/architecture-preview.tsx`
- `src/components/docs/card-previews/collections-preview.tsx`
- `src/components/docs/card-previews/security-preview.tsx`
- `src/components/docs/card-previews/hooks-preview.tsx`

### Requirements

- [ ] Each preview is a lightweight, self-contained animation (no heavy 3D, no canvas)
- [ ] Previews render inside bento cards below the description text
- [ ] All previews are CSS/SVG only or minimal Framer Motion — NO react-three-fiber
- [ ] Must be `"use client"` components
- [ ] Keep each preview under 80 lines of code

### Architecture Preview

Mini pipeline diagram — 9 small step dots connected by a line, with a traveling pulse dot.

```
[1]──[2]──[3]──[4]──[5]──[6]──[7]──[8]──[9]
              ●→ (traveling dot)
```

- Container: `h-16` with `overflow: hidden`
- 9 circles: `w-3 h-3 rounded-full` with colors from PIPELINE_STEPS
- Connecting line: `h-px` between each, color `rgba(255,255,255,0.1)`
- Traveling dot: CSS animation moving left to right, `2s linear infinite`, color cycles through step colors
- Layout: `flex items-center gap-1`

### Collections Preview

5 collection badges that cycle/pulse showing activity.

```
[code-patterns] [conventions] [discussions] [github] [jira-data]
```

- 5 small badges: `px-2 py-0.5 rounded-full text-[10px] font-mono`
- Colors: CYAN, VIOLET, MAGENTA, GREEN, AMBER
- Background: `${color}12`, border: `${color}25`
- One badge pulses brighter at a time, cycling every 1.5s
- Layout: `flex flex-wrap gap-1.5`

### Security Preview

3-layer scan visualization — three horizontal bars that fill sequentially.

```
L1 ████████████ ~1ms    (regex)
L2 ████████░░░░ ~10ms   (entropy)
L3 ██████░░░░░░ ~50ms   (NER)
```

- 3 rows: `h-1.5 rounded-full` with animated width
- Colors: `MAGENTA` at different opacities (100%, 70%, 40%)
- Fill animation: CSS `@keyframes` or Framer Motion, staggered start
- Labels: `text-[9px] font-mono` showing layer names
- Container: `space-y-2`

### Hooks Preview

Simplified data flow — 3 nodes connected by animated dashed lines.

```
[Hook] ──→ [Process] ──→ [Store]
```

- 3 small rounded rectangles: `px-2 py-1 rounded text-[9px] font-mono`
- Connected by `border-dashed` lines with animated `stroke-dashoffset`
- Arrow heads via CSS `::after` triangles
- Colors: VIOLET → CYAN → GREEN

---

## Feature 5: Floating Sidebar Navigation

**New files:**
- `src/components/docs/docs-sidebar.tsx`
- `src/hooks/use-active-section.ts`

### Requirements

- [ ] Fixed left sidebar, visible only on `xl:` (1280px+) breakpoint
- [ ] Lists doc categories with icons and labels
- [ ] Active section highlights based on scroll position (Intersection Observer)
- [ ] On mobile/tablet: hidden — users rely on command palette search instead
- [ ] Smooth scroll to section on click
- [ ] Positioned to the left of main content, not overlapping

### use-active-section.ts Hook

```typescript
"use client";
import { useState, useEffect, useRef } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sectionIds]);

  return activeId;
}
```

### Sidebar Styling

- Position: `fixed left-8 top-1/2 -translate-y-1/2`
- Background: `rgba(15, 20, 50, 0.6)` with `backdrop-filter: blur(16px)`
- Border: `1px solid rgba(0, 245, 255, 0.1)`
- Border radius: `rounded-2xl`
- Padding: `p-3`
- Width: `w-48`
- Z-index: `z-40`

Sidebar items:
- Default: `px-3 py-2 rounded-xl text-sm text-dim hover:text-muted transition-colors`
- Active: `bg-primary/8 text-primary border border-primary/15`
- Icon: `w-4 h-4 mr-2 inline`
- Font: `font-[family-name:var(--font-mono)]`
- Click handler: `document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })`

---

## Feature 6: Aurora Mesh Background with Noise Grain

**Modified file:** `src/app/docs/page.tsx` (add background layers)

### Requirements

- [ ] Aurora mesh background using existing `bg-mesh` class (already available)
- [ ] Add SVG noise grain texture overlay
- [ ] Existing `<Particles />` component from page-decorations
- [ ] Background layers: mesh (z-0) → particles (z-10) → grain (z-[9998]) → content (z-10+)
- [ ] Grain overlay does NOT block pointer events

### SVG Noise Filter (add inline in page component)

```tsx
{/* SVG noise filter — rendered once, hidden */}
<svg className="absolute w-0 h-0" aria-hidden="true">
  <filter id="docs-grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2" stitchTiles="stitch" />
  </filter>
</svg>
```

### CSS for Grain Overlay (add to globals.css)

```css
.grain-overlay::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  filter: url(#docs-grain);
  opacity: 0.018;
  mix-blend-mode: overlay;
}
```

Note: The existing `body::before` in globals.css already applies a grain texture at `0.018` opacity. Verify this is sufficient before adding another layer. If it is, skip the additional grain — just use `bg-mesh` + `<Particles />`.

### Page Background Structure

```tsx
<>
  {/* Background layers */}
  <div className="fixed inset-0 bg-mesh z-0" />
  <Particles />

  {/* Reading progress bar */}
  <div className="reading-progress" />

  {/* Main content */}
  <main id="main" className="relative z-10 grain-overlay">
    ...
  </main>
</>
```

---

## Feature 7: Perspective Tilt Cards

**New file:** `src/components/docs/tilt-card.tsx`

### Requirements

- [ ] Wraps each bento card
- [ ] On mouse move: card rotates slightly toward cursor (max ±4 degrees)
- [ ] On mouse leave: smoothly resets to flat
- [ ] Perspective: `1000px`
- [ ] Transition: `400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
- [ ] Throttled to 100ms to avoid excessive re-renders
- [ ] Must respect `prefers-reduced-motion` — disable tilt if reduced motion is preferred
- [ ] `"use client"` component

### Implementation

```tsx
"use client";

import { useState, useCallback, useRef, type MouseEvent, type ReactNode } from "react";

function throttle<T extends (...args: unknown[]) => void>(func: T, delay: number): T {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    func(...args);
  }) as T;
}

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // default 4
}

export function TiltCard({ children, className, maxTilt = 4 }: TiltCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const onMouseMove = useCallback(
    throttle((e: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion.current) return;
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = Math.max(-maxTilt, Math.min(maxTilt, ((y - centerY) / centerY) * maxTilt));
      const rotateY = Math.max(-maxTilt, Math.min(maxTilt, ((centerX - x) / centerX) * maxTilt));
      setRotate({ x: rotateX, y: rotateY });
    }, 100),
    [maxTilt]
  );

  const onMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)",
        willChange: "transform",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
```

---

## Feature 8: Terminal Quick-Start Block

**New files:**
- `src/components/docs/terminal-quickstart.tsx`
- `src/hooks/use-copy-clipboard.ts`

### Requirements

- [ ] Dark terminal panel below the bento grid
- [ ] Title bar with traffic light dots (red/yellow/green) and "terminal" label
- [ ] 3 command lines that type themselves when scrolled into view
- [ ] Each line has a "Copy" button that appears on hover
- [ ] Blinking cursor at the end of the last typed line
- [ ] Uses `framer-motion` for typing animation, triggered by `whileInView`
- [ ] `"use client"` component

### use-copy-clipboard.ts Hook

```typescript
"use client";
import { useState, useCallback } from "react";

export function useCopyToClipboard(duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, [duration]);

  return { copied, copy };
}
```

### Terminal Commands

```typescript
const QUICKSTART_COMMANDS = [
  { prompt: "$", command: "git clone https://github.com/Hidden-History/ai-memory.git && cd ai-memory", delay: 0 },
  { prompt: "$", command: "cp .env.example .env && docker compose up -d", delay: 0.8 },
  { prompt: "$", command: "curl http://localhost:8000/health", delay: 1.6 },
];

const RESPONSE_LINE = { text: '{"status": "healthy", "collections": 5, "qdrant": "connected"}', color: GREEN, delay: 2.4 };
```

### Terminal Styling

- Container: full-width within `max-w-5xl` content area
- Background: `#0C0E1A` (darker than cards)
- Border: `1px solid rgba(0, 245, 255, 0.1)`
- Border radius: `rounded-2xl`
- Overflow: `hidden`

Title bar:
- Background: `rgba(15, 20, 50, 0.8)`
- Height: `h-10`
- Left: 3 dots (red `#FF5F57`, yellow `#FEBC2E`, green `#28C840`), `w-3 h-3 rounded-full`
- Center: `text-xs font-mono text-dim` — "terminal"
- Border bottom: `1px solid rgba(255,255,255,0.05)`

Code area:
- Padding: `p-6`
- Font: `font-[family-name:var(--font-mono)] text-sm`
- Line height: `leading-loose` (for spacing between commands)
- Prompt `$` color: `#7A8AAA`
- Command text color: `#E8EAF0`
- Response text color: `#00FF88`

Copy button:
- Position: `absolute right-4` on each line's row
- Style: `px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20`
- Shows on line hover: `opacity-0 group-hover:opacity-100 transition-opacity`
- Copied state: text changes to "Copied!" with `text-success`

### Typing Animation Pattern

```tsx
// Each line uses whileInView to trigger
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-50px" }}
  transition={{ staggerChildren: 0.03, delayChildren: line.delay }}
>
  {line.command.split("").map((char, i) => (
    <motion.span
      key={i}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
    >
      {char}
    </motion.span>
  ))}
</motion.div>
```

Blinking cursor:
```tsx
<motion.span
  animate={{ opacity: [1, 0] }}
  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
  className="inline-block w-2 h-5 bg-primary ml-0.5"
/>
```

---

## Page Orchestrator: `src/app/docs/page.tsx`

### Full Page Structure

```tsx
"use client";

import { Particles } from "@/components/shared/page-decorations";
import { CommandSearch } from "@/components/docs/command-search";
import { BentoGrid } from "@/components/docs/bento-grid";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { TerminalQuickstart } from "@/components/docs/terminal-quickstart";
import { SectionDivider } from "@/components/shared/page-decorations";

export default function DocsPage() {
  return (
    <>
      {/* Background layers */}
      <div className="fixed inset-0 bg-mesh z-0" />
      <Particles />

      {/* Reading progress bar */}
      <div className="reading-progress" />

      {/* Sidebar nav (xl only) */}
      <DocsSidebar />

      <main id="main" className="relative z-10">

        {/* ── Hero: Search-first ── */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="section-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
              Documentation
            </div>

            {/* Headline */}
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 tracking-tight" style={{ color: "#E8EAF0" }}>
              AI Memory <span className="gradient-text-animated">Docs</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-12" style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}>
              Everything you need to set up, configure, and operate AI Memory in production.
            </p>

            {/* Command palette search input */}
            <CommandSearch />
          </div>
        </section>

        <SectionDivider />

        {/* ── Bento Grid: Doc Categories ── */}
        <section id="docs-grid" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <BentoGrid />
          </div>
        </section>

        <SectionDivider />

        {/* ── Terminal Quick Start ── */}
        <section id="quickstart" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#E8EAF0" }}>
                Up and Running in <span style={{ color: "#00FF88" }}>60 Seconds</span>
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}>
                Three commands. That's it.
              </p>
            </div>
            <TerminalQuickstart />
          </div>
        </section>

      </main>
    </>
  );
}
```

---

## Post-Implementation Checklist

### Build & Type Safety
- [ ] `npm run build` passes with zero errors
- [ ] No TypeScript errors (especially framer-motion Variants types — use tuple casts for ease arrays)
- [ ] No unused imports or variables

### Visual Quality
- [ ] All bento cards render correctly at 1440px, 1024px, 768px, 375px
- [ ] Command palette opens with Cmd+K / Ctrl+K
- [ ] Command palette search filters correctly
- [ ] Perspective tilt is smooth, resets on mouse leave
- [ ] Terminal typing animation triggers on scroll into view
- [ ] Reading progress bar fills correctly as page scrolls
- [ ] Scroll-reveal animations work in Chrome/Safari (graceful fallback in Firefox)
- [ ] Card preview micro-animations are running
- [ ] Aurora mesh background visible behind content
- [ ] Sidebar active section tracking matches scroll position

### Consistency with Site Design
- [ ] All colors use existing design tokens (no hardcoded hex that isn't in the system)
- [ ] All fonts use existing font variables
- [ ] Card styling matches the glass-card aesthetic used across other pages
- [ ] Badge styling matches `.section-label` pattern
- [ ] Glow effects match existing `glow-primary` / `glow-text` patterns
- [ ] Page has `bg-mesh` + `<Particles />` like the home page

### Accessibility
- [ ] Command palette is keyboard navigable (arrow keys, Enter, Escape)
- [ ] All interactive cards have `cursor-pointer`
- [ ] Focus states visible on all interactive elements
- [ ] `prefers-reduced-motion` disables: tilt, typing animation, scroll-driven animations
- [ ] Terminal code block has proper contrast ratio
- [ ] Search input has proper `aria-label`
- [ ] SVG decorations have `aria-hidden="true"`

### Performance
- [ ] No react-three-fiber or canvas elements on the docs page
- [ ] Card preview animations are CSS/SVG only (no requestAnimationFrame loops)
- [ ] TiltCard mouse handler is throttled (100ms)
- [ ] Command palette dialog uses `Command.Dialog` (portal, lazy rendered)
- [ ] No layout shift on page load

---

## File Checklist (All Files to Create/Modify)

### New Files
- [ ] `src/components/docs/command-search.tsx`
- [ ] `src/components/docs/bento-grid.tsx`
- [ ] `src/components/docs/tilt-card.tsx`
- [ ] `src/components/docs/terminal-quickstart.tsx`
- [ ] `src/components/docs/docs-sidebar.tsx`
- [ ] `src/components/docs/card-previews/architecture-preview.tsx`
- [ ] `src/components/docs/card-previews/collections-preview.tsx`
- [ ] `src/components/docs/card-previews/security-preview.tsx`
- [ ] `src/components/docs/card-previews/hooks-preview.tsx`
- [ ] `src/hooks/use-active-section.ts`
- [ ] `src/hooks/use-copy-clipboard.ts`

### Modified Files
- [ ] `src/app/docs/page.tsx` — Full rewrite
- [ ] `src/app/globals.css` — Add scroll-reveal, reading-progress, grain-overlay classes
- [ ] `package.json` — Add `cmdk` dependency (via `npm install cmdk`)

### Unchanged Files (reference only)
- `src/app/layout.tsx` — No changes needed (Navbar, Footer, fonts already handled)
- `src/lib/colors.ts` — Use as-is
- `src/lib/utils.ts` — Use `cn()` as-is
- `src/components/shared/*` — Use existing components as-is
