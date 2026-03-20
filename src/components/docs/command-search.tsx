"use client";

import { Command } from "cmdk";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Download,
  Database,
  Webhook,
  Shield,
  Github,
  BarChart3,
  Code2,
  Layers,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface SearchItem {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: LucideIcon;
  href: string;
}

const DOC_SEARCH_ITEMS: SearchItem[] = [
  { id: "install", label: "Installation", description: "Docker stack setup, environment configuration", category: "Getting Started", icon: Download, href: "#install" },
  { id: "quickstart", label: "Quick Start", description: "3 commands to running AI Memory", category: "Getting Started", icon: Zap, href: "#quickstart" },
  { id: "collections", label: "Collections", description: "5 Qdrant collections — code-patterns, conventions, discussions, github, jira-data", category: "Core Concepts", icon: Database, href: "#collections" },
  { id: "architecture", label: "Architecture", description: "Pipeline overview, signal-triggered memory, dual embedding", category: "Core Concepts", icon: Layers, href: "/docs/architecture" },
  { id: "hooks", label: "Hooks", description: "Claude Code hook pipeline — conversation to vector storage", category: "Core Concepts", icon: Webhook, href: "#hooks" },
  { id: "security", label: "Security", description: "3-layer pipeline — PII detection, secrets scanning, content filtering", category: "Security & Ops", icon: Shield, href: "#security" },
  { id: "monitoring", label: "Monitoring", description: "Prometheus metrics, Grafana dashboards, health checks", category: "Security & Ops", icon: BarChart3, href: "#monitoring" },
  { id: "integrations", label: "Integrations", description: "GitHub sync, Jira sync, Langfuse observability", category: "Integrations", icon: Github, href: "#integrations" },
  { id: "api", label: "API Reference", description: "REST API for collection access, search, memory management", category: "Integrations", icon: Code2, href: "#api" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Getting Started": "#00FF88",
  "Core Concepts": "#00F5FF",
  "Security & Ops": "#FF2D6A",
  "Integrations": "#8B5CF6",
};

export function CommandSearch() {
  const [open, setOpen] = useState(false);

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

  const handleSelect = useCallback((href: string) => {
    setOpen(false);
    if (href.startsWith("/")) {
      window.location.href = href;
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      {/* Hero search trigger */}
      <button
        onClick={() => setOpen(true)}
        className="group w-full max-w-2xl mx-auto flex items-center gap-3 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 hover:border-[rgba(0,245,255,0.35)] focus-visible:border-[rgba(0,245,255,0.35)]"
        style={{
          background: "rgba(15, 20, 50, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(0, 245, 255, 0.15)",
        }}
        aria-label="Search documentation"
      >
        <Search className="w-5 h-5 flex-shrink-0" style={{ color: "#5A6480" }} />
        <span
          className="flex-1 text-left text-base"
          style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
        >
          Search documentation...
        </span>
        <kbd
          className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs"
          style={{
            fontFamily: "var(--font-mono)",
            background: "rgba(0, 245, 255, 0.08)",
            border: "1px solid rgba(0, 245, 255, 0.15)",
            color: "#00F5FF",
          }}
        >
          <span className="text-[10px]">&#8984;</span>K
        </kbd>
      </button>

      {/* Command palette dialog */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search documentation"
        className="fixed inset-0 z-[9999]"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        />

        {/* Dialog content */}
        <div
          className="fixed left-1/2 -translate-x-1/2 w-full max-w-xl overflow-hidden rounded-2xl"
          style={{
            top: "20vh",
            background: "rgba(15, 20, 50, 0.95)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(0, 245, 255, 0.15)",
            boxShadow: "0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,255,0.05)",
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: "#5A6480" }} />
            <Command.Input
              placeholder="Search documentation..."
              className="flex-1 h-14 bg-transparent text-lg outline-none placeholder:text-[#5A6480]"
              style={{ color: "#E8EAF0", fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Results */}
          <Command.List className="max-h-[50vh] overflow-y-auto p-3">
            <Command.Empty
              className="py-12 text-center text-sm"
              style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
            >
              No results found.
            </Command.Empty>

            {Object.entries(
              DOC_SEARCH_ITEMS.reduce<Record<string, SearchItem[]>>((acc, item) => {
                (acc[item.category] ??= []).push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <Command.Group
                key={category}
                heading={category}
                className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em]"
                style={{
                  // @ts-expect-error -- CSS custom property for group heading color
                  "--heading-color": CATEGORY_COLORS[category] ?? "#7A8AAA",
                }}
              >
                <style>{`[cmdk-group][style*="--heading-color"] [cmdk-group-heading] { color: var(--heading-color); font-family: var(--font-mono); }`}</style>
                {items.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.description}`}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors duration-150 data-[selected=true]:bg-[rgba(0,245,255,0.06)] data-[selected=true]:border data-[selected=true]:border-[rgba(0,245,255,0.15)]"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${CATEGORY_COLORS[item.category] ?? "#7A8AAA"}12`,
                        border: `1px solid ${CATEGORY_COLORS[item.category] ?? "#7A8AAA"}25`,
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: CATEGORY_COLORS[item.category] ?? "#7A8AAA" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: "#E8EAF0" }}>
                        {item.label}
                      </div>
                      <div className="text-xs truncate" style={{ color: "#7A8AAA" }}>
                        {item.description}
                      </div>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>

          {/* Footer hint */}
          <div
            className="flex items-center gap-4 px-5 py-3 border-t text-[11px]"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              color: "#5A6480",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">&#8593;&#8595;</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">&#9166;</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">esc</kbd> close</span>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}
