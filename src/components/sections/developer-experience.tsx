"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Code2,
  Zap,
  Database,
  Copy,
  Check,
  Terminal,
  BookOpen,
  MessageCircle,
  Github,
  Ticket,
} from "lucide-react";

/* ── Tab definitions ────────────────────────────────── */

type TabKey = "code-example" | "quick-start" | "memory-types";

const tabs: { key: TabKey; label: string; icon: typeof Code2 }[] = [
  { key: "code-example", label: "Code Example", icon: Code2 },
  { key: "quick-start", label: "Quick Start", icon: Zap },
  { key: "memory-types", label: "Memory Types", icon: Database },
];

/* ── Code Example data ──────────────────────────────── */

const codeLines: { text: string; color: string }[] = [
  { text: "from qdrant_client import QdrantClient", color: "#8B5CF6" },
  { text: "from sentence_transformers import SentenceTransformer", color: "#8B5CF6" },
  { text: "", color: "" },
  { text: "# Connect to AI Memory's Qdrant instance", color: "#3A4560" },
  { text: 'client = QdrantClient(host="localhost", port=6333)', color: "#E8EAF0" },
  { text: 'model = SentenceTransformer("all-MiniLM-L6-v2")', color: "#E8EAF0" },
  { text: "", color: "" },
  { text: "# Semantic search across all collections", color: "#3A4560" },
  { text: 'query = "auth middleware refactor pattern"', color: "#00FF88" },
  { text: "vector = model.encode(query).tolist()", color: "#E8EAF0" },
  { text: "", color: "" },
  { text: "results = client.search(", color: "#E8EAF0" },
  { text: '    collection_name="code-patterns",', color: "#00F5FF" },
  { text: "    query_vector=vector,", color: "#00F5FF" },
  { text: "    limit=5,", color: "#00F5FF" },
  { text: '    score_threshold=0.75,', color: "#00F5FF" },
  { text: ")", color: "#E8EAF0" },
  { text: "", color: "" },
  { text: "for hit in results:", color: "#E8EAF0" },
  { text: '    print(f"{hit.payload[\'pattern\']} — {hit.score:.2f}")', color: "#22D3EE" },
  { text: '    # React context + reducer for state — 0.94', color: "#3A4560" },
  { text: '    # Auth middleware chain pattern  — 0.91', color: "#3A4560" },
];

/* ── Quick Start data ───────────────────────────────── */

const quickStartSteps = [
  {
    step: 1,
    title: "Clone the Repository",
    command: "git clone https://github.com/Hidden-History/ai-memory.git && cd ai-memory",
    description: "Pull the AI Memory repository with all configuration and scripts included.",
    color: "#00F5FF",
  },
  {
    step: 2,
    title: "Start Docker Services",
    command: "docker compose up -d",
    description: "Launches Qdrant on :6333 and the embedding service on :28080. All data is persisted in Docker volumes.",
    color: "#8B5CF6",
  },
  {
    step: 3,
    title: "Install to Your Project",
    command: "./scripts/install.sh ~/projects/my-app",
    description: "Installs Claude Code hooks, skills, and CLAUDE.md into your project directory.",
    color: "#FF2D6A",
  },
  {
    step: 4,
    title: "Start a Session",
    command: "claude",
    description: "That's it. Claude now searches all 5 collections on every session start and remembers everything.",
    color: "#00FF88",
  },
];

/* ── Memory Types data ──────────────────────────────── */

interface MemoryCollection {
  name: string;
  tag: string;
  icon: typeof Code2;
  color: string;
  types: string[];
}

const memoryCollections: MemoryCollection[] = [
  {
    name: "code-patterns",
    tag: "HOW",
    icon: Code2,
    color: "#00F5FF",
    types: [
      "architecture-pattern",
      "implementation-idiom",
      "error-handling",
      "state-management",
      "api-pattern",
      "testing-pattern",
      "performance-optimization",
    ],
  },
  {
    name: "conventions",
    tag: "WHAT",
    icon: BookOpen,
    color: "#8B5CF6",
    types: [
      "naming-rule",
      "style-preference",
      "import-convention",
      "project-structure",
      "commit-format",
      "documentation-standard",
    ],
  },
  {
    name: "discussions",
    tag: "WHY",
    icon: MessageCircle,
    color: "#FF2D6A",
    types: [
      "decision-rationale",
      "architecture-tradeoff",
      "migration-plan",
      "incident-review",
      "design-debate",
      "scope-decision",
    ],
  },
  {
    name: "github",
    tag: "WHEN",
    icon: Github,
    color: "#22D3EE",
    types: [
      "commit-context",
      "pr-discussion",
      "review-comment",
      "release-note",
      "issue-resolution",
      "branch-strategy",
    ],
  },
  {
    name: "jira-data",
    tag: "JIRA",
    icon: Ticket,
    color: "#FFB800",
    types: [
      "sprint-context",
      "epic-summary",
      "bug-report",
      "feature-request",
      "backlog-priority",
      "acceptance-criteria",
    ],
  },
];

/* ── Tab panels ─────────────────────────────────────── */

function CodeExamplePanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = codeLines.map((l) => l.text).join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(0,245,255,0.15)",
        background:
          "linear-gradient(135deg, rgba(8,10,28,0.98) 0%, rgba(5,7,20,0.99) 100%)",
        boxShadow:
          "0 0 0 1px rgba(0,245,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.7), 0 0 100px rgba(0,245,255,0.05)",
      }}
    >
      {/* Terminal title bar */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: "1px solid rgba(0,245,255,0.08)",
          background: "rgba(0,245,255,0.02)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" style={{ color: "#00F5FF" }} />
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
          >
            search_memory.py
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer"
          style={{
            fontFamily: "var(--font-mono)",
            background: copied ? "rgba(0,255,136,0.1)" : "rgba(0,245,255,0.05)",
            border: copied
              ? "1px solid rgba(0,255,136,0.2)"
              : "1px solid rgba(0,245,255,0.1)",
            color: copied ? "#00FF88" : "#7A8AAA",
          }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code content */}
      <div className="p-6 overflow-x-auto" style={{ background: "rgba(3,4,12,0.8)" }}>
        <pre
          className="text-[13px] leading-7"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <code>
            {codeLines.map((line, i) => (
              <div
                key={i}
                className="flex rounded transition-colors duration-150 hover:bg-primary/[0.02]"
              >
                <span
                  className="select-none w-8 flex-shrink-0 text-right mr-6 text-xs leading-7"
                  style={{ color: "#3A4560" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: line.color || "#E8EAF0" }}>
                  {line.text || "\u00A0"}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{
          borderTop: "1px solid rgba(0,245,255,0.06)",
          background: "rgba(0,245,255,0.015)",
        }}
      >
        <span
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
        >
          qdrant://collections/code-patterns
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded"
            style={{
              fontFamily: "var(--font-mono)",
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.12)",
              color: "#8B5CF6",
            }}
          >
            Python
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickStartPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {quickStartSteps.map((step) => (
        <div
          key={step.step}
          className="relative p-6 rounded-2xl group transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
            border: `1px solid ${step.color}18`,
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-4 right-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)`,
            }}
          />

          {/* Step number */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{
                background: `${step.color}10`,
                border: `1px solid ${step.color}25`,
                color: step.color,
                fontFamily: "var(--font-heading)",
                boxShadow: `0 0 20px ${step.color}08 inset`,
              }}
            >
              {step.step}
            </div>
            <h3
              className="font-semibold text-base"
              style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
            >
              {step.title}
            </h3>
          </div>

          {/* Command */}
          <div
            className="flex items-center gap-2 text-xs rounded-lg px-3 py-2.5 mb-3"
            style={{
              background: "rgba(3,4,12,0.8)",
              border: `1px solid ${step.color}15`,
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ color: "#3A4560" }}>$</span>
            <span style={{ color: step.color }}>{step.command}</span>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function MemoryTypesPanel() {
  return (
    <div className="space-y-6">
      {memoryCollections.map((col) => {
        const Icon = col.icon;
        return (
          <div key={col.name}>
            {/* Collection header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `${col.color}10`,
                  border: `1px solid ${col.color}25`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: col.color }} />
              </div>
              <span
                className="font-semibold text-sm"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                {col.name}
              </span>
              <span
                className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                style={{
                  background: `${col.color}10`,
                  border: `1px solid ${col.color}25`,
                  color: col.color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {col.tag}
              </span>
            </div>

            {/* Tag grid */}
            <div className="flex flex-wrap gap-2">
              {col.types.map((type) => (
                <button
                  type="button"
                  key={type}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-default"
                  style={{
                    background: `${col.color}08`,
                    border: `1px solid ${col.color}15`,
                    color: `${col.color}CC`,
                    fontFamily: "var(--font-mono)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${col.color}14`;
                    e.currentTarget.style.borderColor = `${col.color}30`;
                    e.currentTarget.style.color = col.color;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${col.color}08`;
                    e.currentTarget.style.borderColor = `${col.color}15`;
                    e.currentTarget.style.color = `${col.color}CC`;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = `${col.color}14`;
                    e.currentTarget.style.borderColor = `${col.color}30`;
                    e.currentTarget.style.color = col.color;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = `${col.color}08`;
                    e.currentTarget.style.borderColor = `${col.color}15`;
                    e.currentTarget.style.color = `${col.color}CC`;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  {type}
                </button>
              ))}

            </div>
          </div>
        );
      })}

      {/* Total count */}
      <div
        className="text-center pt-4"
        style={{ borderTop: "1px solid rgba(0,245,255,0.06)" }}
      >
        <span
          className="text-sm"
          style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
        >
          31 memory types across 5 collections
        </span>
      </div>
    </div>
  );
}

/* ── Framer variants ────────────────────────────────── */

const panelVariants = {
  enter: { opacity: 0, y: 12, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
};

/* ── Main component ─────────────────────────────────── */

export function DeveloperExperience() {
  const [activeTab, setActiveTab] = useState<TabKey>("code-example");

  return (
    <section id="developer-experience" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8">
            <Code2 className="w-3.5 h-3.5" />
            Developer Experience
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for{" "}
            <span className="gradient-text-animated">Developers</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Vector search, quick setup, and 31 memory types across 5 Qdrant
            collections — everything you need to give your AI persistent memory.
          </p>
        </AnimatedSection>

        {/* Tab navigation */}
        <AnimatedSection delay={0.1}>
          <div className="flex justify-center mb-10">
            <div
              className="inline-flex items-center gap-1 p-1.5 rounded-2xl relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                border: "1px solid rgba(0,245,255,0.1)",
              }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer z-10"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: isActive ? "#E8EAF0" : "#5A6480",
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isActive ? "#00F5FF" : "#5A6480" }}
                    />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-indicator"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "rgba(0,245,255,0.06)",
                          border: "1px solid rgba(0,245,255,0.15)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Tab content */}
        <AnimatedSection delay={0.2}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {activeTab === "code-example" && <CodeExamplePanel />}
              {activeTab === "quick-start" && <QuickStartPanel />}
              {activeTab === "memory-types" && <MemoryTypesPanel />}
            </motion.div>
          </AnimatePresence>
        </AnimatedSection>
      </div>
    </section>
  );
}
