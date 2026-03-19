"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Bot,
  Code2,
  BrainCircuit,
  Lightbulb,
  ShieldCheck,
  BarChart3,
  LayoutGrid,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Crosshair,
  FlaskConical,
} from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const MAGENTA = "#FF2D6A";
const RED = "#FF4444";

// ─── BMAD Agent Roles ─────────────────────────────────────────────────────

const agentRoles = [
  {
    id: "analyst",
    name: "Analyst",
    icon: BrainCircuit,
    color: CYAN,
    model: "Sonnet",
    modelColor: VIOLET,
    role: "Research & PRD Input",
    what: [
      "Conducts deep research on technical and business context",
      "Gathers requirements from user goals and existing documentation",
      "Produces structured research reports with source citations",
      "Identifies knowledge gaps and flags for resolution",
    ],
    when: "Discovery (step-02), Architecture (as needed), Maintenance (step-03), Research Protocol (Layer 3)",
    constraint: "DC-08",
    constraintNote: "Analyst runs before PM when input is thin (inherited from aim-bmad-dispatch skill)",
  },
  {
    id: "pm",
    name: "PM",
    icon: Lightbulb,
    color: GREEN,
    model: "Sonnet",
    modelColor: VIOLET,
    role: "Project Management & PRD Creation",
    what: [
      "Creates and refines PRD.md during Discovery phase",
      "Translates approved PRD into actionable epics and stories",
      "Maintains sprint-status.yaml and story tracking",
      "Facilitates decision support (DC workflow)",
    ],
    when: "Discovery (step-03, step-06), Architecture (step-06), Planning (step-03, step-04)",
    constraint: null,
    constraintNote: null,
  },
  {
    id: "architect",
    name: "Architect",
    icon: ShieldCheck,
    color: VIOLET,
    model: "Opus",
    modelColor: MAGENTA,
    role: "Technical Design & Cohesion",
    what: [
      "Produces architecture.md with technical decisions and rationale",
      "Evaluates proposed solutions against PRD non-functional requirements",
      "Conducts mandatory cohesion check during Integration phase",
      "Reviews tech stack choices and flags lock-in risks",
    ],
    when: "Architecture (step-02, step-04), Integration (step-04), Release (as needed)",
    constraint: "GC-19 / EC-08",
    constraintNote: "Always uses Opus model — overrides Sonnet default for architecture decisions",
  },
  {
    id: "dev",
    name: "DEV",
    icon: Code2,
    color: AMBER,
    model: "Sonnet",
    modelColor: VIOLET,
    role: "Implementation & Code Review",
    what: [
      "Implements story features from sprint-ready story files",
      "Self-reviews code against DONE WHEN criteria before submission",
      "Responds to Parzival correction instructions during review cycles",
      "Verifies deployment checklist items during Release",
    ],
    when: "Execution (step-03), Integration (step-03, step-06), Release (step-05), Maintenance (step-05)",
    constraint: "EC-06",
    constraintNote: "DEV cannot self-certify completion — Parzival always verifies independently",
  },
  {
    id: "sm",
    name: "SM",
    icon: BarChart3,
    color: MAGENTA,
    model: "Sonnet",
    modelColor: VIOLET,
    role: "Sprint Management",
    what: [
      "Runs sprint retrospective and documents velocity patterns",
      "Plans sprint scope based on observed velocity (max 120% of highest)",
      "Tracks carryover stories and ensures they're re-prioritized first",
      "Maintains sprint-status.yaml accuracy across all state transitions",
    ],
    when: "Planning (step-03, step-04), Release (step-02), Execution (as needed)",
    constraint: "PC-04 / PC-05 / PC-08",
    constraintNote: null,
  },
  {
    id: "ux",
    name: "UX Designer",
    icon: LayoutGrid,
    color: "#22D3EE",
    model: "Sonnet",
    modelColor: VIOLET,
    role: "User Experience (Optional)",
    what: [
      "Designs UI/UX patterns aligned with PRD requirements",
      "Produces wireframes and interaction specifications",
      "Reviews implementation against design intent during review cycles",
      "Ensures accessibility and usability standards are met",
    ],
    when: "Architecture (step-03) — optional, not always invoked",
    constraint: null,
    constraintNote: "Optional role — only activated when Architecture phase workflow requires it",
  },
];

// ─── Confidence Levels ─────────────────────────────────────────────────────

const confidenceLevels = [
  {
    level: "Verified",
    abbr: "VER",
    color: GREEN,
    definition: "Exact claim appears in cited source file — no extrapolation.",
    format: "[Verified — source-file]",
    example: "GC-01 is classified as CRITICAL in constraints.md (line 3).",
  },
  {
    level: "Informed",
    abbr: "INF",
    color: CYAN,
    definition: "Direct logical consequence of verified facts, but not verbatim in one source.",
    format: "[Informed — reasoning]",
    example: "Mode 3 activates in Execution because the pipeline requires a verified plan.",
  },
  {
    level: "Inferred",
    abbr: "INFR",
    color: AMBER,
    definition: "Reasoning from patterns or prior context — plausible but not directly supported.",
    format: "[Inferred — reasoning]",
    example: "A constraint violation in a prior session might explain current behavior.",
  },
  {
    level: "Uncertain",
    abbr: "UNC",
    color: MAGENTA,
    definition: "Insufficient information for a confident claim. Must research or ask.",
    format: "[Uncertain — what is needed]",
    example: "Which phase constraint was active when this decision was made? Need to check.",
  },
  {
    level: "Unknown",
    abbr: "UNK",
    color: RED,
    definition: "No basis for a position. Must research or ask.",
    format: "[Unknown — no information available]",
    example: "No session logs exist for the period before Parzival was installed.",
  },
];

// ─── Complexity Assessments ──────────────────────────────────────────────

const complexityLevels = [
  {
    level: "Straightforward",
    color: GREEN,
    definition: "Single component, clear path. No coordination needed.",
    example: "Add a single button component with an onClick handler.",
  },
  {
    level: "Moderate",
    color: CYAN,
    definition: "Multiple components or some unknowns. Requires some coordination.",
    example: "Implement authentication with a known library, multiple form fields.",
  },
  {
    level: "Significant",
    color: AMBER,
    definition: "Touches many parts, requires coordination across agent teams.",
    example: "Add real-time notifications across multiple services with state sync.",
  },
  {
    level: "Complex",
    color: RED,
    definition: "Architectural changes, high risk, many unknowns.",
    example: "Migrate database schema across a live multi-tenant system.",
  },
];

// ─── Menu Commands ────────────────────────────────────────────────────────

const menuCommands = [
  { code: "HP", label: "Help", type: "exec", route: "_ai-memory/core/tasks/help.md" },
  { code: "CH", label: "Chat", type: "inline", route: "Inline (no workflow)" },
  { code: "ST", label: "Session Start", type: "exec", route: "workflows/session/start/workflow.md" },
  { code: "SU", label: "Quick Status", type: "exec", route: "workflows/session/status/workflow.md" },
  { code: "BL", label: "Blocker Analysis", type: "exec", route: "workflows/session/blocker/workflow.md" },
  { code: "DC", label: "Decision Support", type: "exec", route: "workflows/session/decision/workflow.md" },
  { code: "VE", label: "Verification", type: "exec", route: "workflows/session/verify/workflow.md" },
  { code: "CR", label: "Code Review", type: "exec", route: "_ai-memory/agents/code-reviewer.md" },
  { code: "BR", label: "Best Practices", type: "exec", route: ".claude/skills/aim-best-practices-researcher/SKILL.md" },
  { code: "FR", label: "Freshness Report", type: "exec", route: ".claude/skills/aim-freshness-report/SKILL.md" },
  { code: "TP", label: "Team Builder", type: "exec", route: ".claude/skills/aim-parzival-team-builder/SKILL.md" },
  { code: "HO", label: "Handoff", type: "exec", route: "workflows/session/handoff/workflow.md" },
  { code: "CL", label: "Session Close", type: "exec", route: "workflows/session/close/workflow.md" },
  { code: "DA", label: "Dispatch Agent", type: "exec", route: "workflows/cycles/agent-dispatch/workflow.md" },
  { code: "EX", label: "Exit", type: "inline", route: "Dismiss Parzival (no workflow)" },
];

// ─── Sub-components ──────────────────────────────────────────────────────

const AgentCard = ({ agent }: { agent: (typeof agentRoles)[0] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(15,20,50,0.6)",
        border: `1px solid ${agent.color}18`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${agent.color}12`,
              border: `1px solid ${agent.color}25`,
            }}
          >
            <agent.icon className="w-4 h-4" style={{ color: agent.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
                {agent.name}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: `${agent.modelColor}10`,
                  color: agent.modelColor,
                }}
              >
                {agent.model}
              </span>
            </div>
            <div className="text-xs" style={{ color: "#7A8AAA" }}>
              {agent.role}
            </div>
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{
            color: "#7A8AAA",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Expanded */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 border-t"
              style={{ borderColor: `${agent.color}12` }}
            >
              {/* What */}
              <div className="pt-3 mb-3">
                <div
                  className="text-xs font-semibold mb-2"
                  style={{ color: agent.color }}
                >
                  What it does
                </div>
                <ul className="space-y-1.5">
                  {agent.what.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-3 h-3 mt-0.5 flex-shrink-0"
                        style={{ color: agent.color }}
                      />
                      <span className="text-xs" style={{ color: "#7A8AAA" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* When */}
              <div className="mb-3">
                <div
                  className="text-xs font-semibold mb-1.5"
                  style={{ color: agent.color }}
                >
                  When activated
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                  {agent.when}
                </p>
              </div>

              {/* Constraint */}
              {agent.constraint && (
                <div
                  className="p-2.5 rounded-lg"
                  style={{
                    background: `${agent.color}06`,
                    border: `1px solid ${agent.color}15`,
                  }}
                >
                  <span className="text-xs font-mono font-semibold" style={{ color: agent.color }}>
                    {agent.constraint}
                  </span>
                  <span className="text-xs ml-1" style={{ color: "#7A8AAA" }}>
                    — {agent.constraintNote}
                  </span>
                </div>
              )}
              {!agent.constraint && agent.constraintNote && (
                <div
                  className="p-2.5 rounded-lg"
                  style={{
                    background: `${agent.color}06`,
                    border: `1px solid ${agent.color}15`,
                  }}
                >
                  <span className="text-xs" style={{ color: "#7A8AAA" }}>
                    {agent.constraintNote}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConfidenceRow = ({ level }: { level: (typeof confidenceLevels)[0] }) => (
  <div
    className="p-4 rounded-xl"
    style={{
      background: `${level.color}05`,
      border: `1px solid ${level.color}15`,
    }}
  >
    <div className="flex items-center justify-between gap-3 mb-2">
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-mono font-bold w-8 h-6 rounded flex items-center justify-center"
          style={{
            background: `${level.color}12`,
            color: level.color,
          }}
        >
          {level.abbr}
        </span>
        <span className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
          {level.level}
        </span>
      </div>
      <span
        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
        style={{
          background: `${level.color}10`,
          color: level.color,
        }}
      >
        {level.format}
      </span>
    </div>
    <p className="text-xs mb-2 leading-relaxed" style={{ color: "#7A8AAA" }}>
      {level.definition}
    </p>
    <p
      className="text-xs font-mono p-2 rounded-lg leading-relaxed"
      style={{
        background: "rgba(0,0,0,0.2)",
        color: level.color,
        border: `1px solid ${level.color}15`,
      }}
    >
      {level.example}
    </p>
  </div>
);

const ComplexityRow = ({ level }: { level: (typeof complexityLevels)[0] }) => (
  <div
    className="flex items-start gap-3 p-3 rounded-xl"
    style={{
      background: `${level.color}04`,
      border: `1px solid ${level.color}12`,
    }}
  >
    <div
      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{
        background: `${level.color}12`,
        border: `1px solid ${level.color}25`,
      }}
    >
      <span className="text-[9px] font-mono font-bold" style={{ color: level.color }}>
        {level.level[0]}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
          {level.level}
        </span>
      </div>
      <p className="text-xs mb-1.5 leading-relaxed" style={{ color: "#7A8AAA" }}>
        {level.definition}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
        {level.example}
      </p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────

const tabs = [
  { id: "roles", label: "Agent Roles", sub: "6 roles", color: VIOLET },
  { id: "menu", label: "Menu Commands", sub: "15 commands", color: CYAN },
  { id: "confidence", label: "Confidence", sub: "5 levels", color: GREEN },
  { id: "complexity", label: "Complexity", sub: "4 levels", color: AMBER },
];

export function ParzivalAgents() {
  const [activeTab, setActiveTab] = useState("roles");

  const color = tabs.find((t) => t.id === activeTab)?.color ?? VIOLET;

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,245,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="section-label">
              <Users className="w-3.5 h-3.5" />
              Interface Reference
            </div>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-orbitron)", color: "#E8EAF0" }}
          >
            Agent Roles &amp;{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Parzival Menu
            </span>
          </h2>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: "#7A8AAA" }}>
            The user-facing interface of Parzival. Six BMAD agent roles that Parzival dispatches.
            Fifteen menu commands available at any time. Confidence and complexity assessment
            systems that govern how Parzival communicates uncertainty.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-1 mb-8 overflow-x-auto border-b"
          style={{ borderColor: "rgba(0,245,255,0.1)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-2 px-4 py-3 transition-all duration-200 flex-shrink-0"
            >
              <Users
                className="w-4 h-4"
                style={{ color: activeTab === tab.id ? tab.color : "#7A8AAA" }}
              />
              <div className="text-left">
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: activeTab === tab.id ? tab.color : "#7A8AAA",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {tab.label}
                </div>
                <div className="text-xs" style={{ color: "#7A8AAA" }}>
                  {tab.sub}
                </div>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="agentsTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: tab.color }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {/* AGENT ROLES */}
            {activeTab === "roles" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {agentRoles.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            )}

            {/* MENU COMMANDS */}
            {activeTab === "menu" && (
              <div>
                {/* Note */}
                <div
                  className="p-3 rounded-xl flex items-start gap-2 mb-5"
                  style={{
                    background: "rgba(0,245,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.1)",
                  }}
                >
                  <Bot className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: CYAN }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Type a command code, menu number, or a fuzzy text match (case-insensitive
                    substring). Menu items display in exact order — never reordered, omitted,
                    abbreviated, or rephrased (Rule 7).
                  </p>
                </div>

                {/* Table */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${CYAN}15` }}
                >
                  {/* Header */}
                  <div
                    className="grid grid-cols-12 gap-3 px-4 py-2 border-b"
                    style={{
                      background: `${CYAN}08`,
                      borderColor: `${CYAN}15`,
                    }}
                  >
                    <div className="col-span-2 text-xs font-mono font-semibold" style={{ color: CYAN }}>
                      Code
                    </div>
                    <div className="col-span-4 text-xs font-semibold" style={{ color: CYAN }}>
                      Label
                    </div>
                    <div className="col-span-2 text-xs font-semibold" style={{ color: CYAN }}>
                      Type
                    </div>
                    <div className="col-span-4 text-xs font-semibold" style={{ color: CYAN }}>
                      Route / File
                    </div>
                  </div>

                  {/* Rows */}
                  {menuCommands.map((cmd, i) => (
                    <div
                      key={cmd.code}
                      className="grid grid-cols-12 gap-3 px-4 py-3 items-start hover:bg-white/[0.02] transition-colors"
                      style={{
                        borderBottom:
                          i < menuCommands.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : undefined,
                      }}
                    >
                      <div className="col-span-2">
                        <span
                          className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: `${CYAN}10`,
                            color: CYAN,
                          }}
                        >
                          {cmd.code}
                        </span>
                      </div>
                      <div className="col-span-4">
                        <span className="text-sm" style={{ color: "#E8EAF0" }}>
                          {cmd.label}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                          style={{
                            background:
                              cmd.type === "exec"
                                ? `${VIOLET}10`
                                : `${GREEN}10`,
                            color: cmd.type === "exec" ? VIOLET : GREEN,
                          }}
                        >
                          {cmd.type}
                        </span>
                      </div>
                      <div className="col-span-4">
                        <span
                          className="text-[10px] font-mono leading-relaxed"
                          style={{ color: "#7A8AAA" }}
                        >
                          {cmd.route}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Type Legend */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: VIOLET }}
                    />
                    <span className="text-xs" style={{ color: "#7A8AAA" }}>
                      exec — triggers a workflow file
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: GREEN }}
                    />
                    <span className="text-xs" style={{ color: "#7A8AAA" }}>
                      inline — handled directly by Parzival
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CONFIDENCE LEVELS */}
            {activeTab === "confidence" && (
              <div>
                <div
                  className="p-3 rounded-xl flex items-start gap-2 mb-5"
                  style={{
                    background: "rgba(0,255,136,0.04)",
                    border: "1px solid rgba(0,255,136,0.1)",
                  }}
                >
                  <Crosshair className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: GREEN }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Every claim Parzival makes must carry a confidence tag with source citation.
                    When reporting multiple facts, each item is tagged individually — never batch
                    multiple claims under one tag. Getting a confidence level wrong is worse than
                    omitting it.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {confidenceLevels.map((level) => (
                    <ConfidenceRow key={level.level} level={level} />
                  ))}
                </div>

                <div
                  className="mt-4 p-3 rounded-xl flex items-start gap-2"
                  style={{
                    background: "rgba(245,158,11,0.04)",
                    border: "1px solid rgba(245,158,11,0.1)",
                  }}
                >
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: AMBER }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    <span style={{ color: AMBER, fontFamily: "var(--font-mono)" }}>GC-02: </span>
                    Never present assumptions as facts. When uncertain, state so explicitly and
                    recommend research or user input.
                  </p>
                </div>
              </div>
            )}

            {/* COMPLEXITY */}
            {activeTab === "complexity" && (
              <div>
                <div
                  className="p-3 rounded-xl flex items-start gap-2 mb-5"
                  style={{
                    background: "rgba(245,158,11,0.04)",
                    border: "1px solid rgba(245,158,11,0.1)",
                  }}
                >
                  <FlaskConical className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: AMBER }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Parzival{" "}
                    <span
                      className="font-semibold"
                      style={{ color: AMBER }}
                    >
                      never provides time estimates
                    </span>{" "}
                    — only complexity assessments. This is a hard constraint: no exceptions,
                    no approximations, no "probably a few hours." The four complexity levels
                    provide a shared vocabulary for sizing work.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {complexityLevels.map((level) => (
                    <ComplexityRow key={level.level} level={level} />
                  ))}
                </div>

                <div
                  className="mt-4 p-3 rounded-xl flex items-start gap-2"
                  style={{
                    background: "rgba(255,68,68,0.04)",
                    border: "1px solid rgba(255,68,68,0.1)",
                  }}
                >
                  <HelpCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: RED }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    <span style={{ color: RED, fontFamily: "var(--font-mono)" }}>Rule: </span>
                    Never translate complexity assessments into time estimates in conversation. If
                    asked "how long will this take?", respond with the complexity level and what
                    factors determine the actual duration.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
