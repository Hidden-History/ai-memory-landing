"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  FileText,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  ShieldCheck,
  ScrollText,
  GitBranch,
  AlertTriangle,
  Zap,
} from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const RED = "#FF4444";
const MAGENTA = "#FF2D6A";

const phases = [
  { id: "init", label: "Init", active: "1&2" },
  { id: "discovery", label: "Discovery", active: "1&2" },
  { id: "architecture", label: "Architecture", active: "1&2" },
  { id: "planning", label: "Planning", active: "1&2" },
  { id: "execution", label: "Execution", active: "1&2&3" },
  { id: "integration", label: "Integration", active: "1&2&3" },
  { id: "release", label: "Release", active: "1&2&3" },
  { id: "maintenance", label: "Maintenance", active: "1&2&3" },
];

const tabs = [
  {
    id: "mode1",
    label: "Mode 1",
    sublabel: "Project Governance",
    icon: Compass,
    color: CYAN,
    active: "All phases",
  },
  {
    id: "mode2",
    label: "Mode 2",
    sublabel: "Documentation & Oversight",
    icon: FileText,
    color: GREEN,
    active: "All phases",
  },
  {
    id: "mode3",
    label: "Mode 3",
    sublabel: "Team Orchestration",
    icon: Users,
    color: AMBER,
    active: "Phase 4 (Execution) or later",
  },
];

const mode1Content = {
  overview:
    "Navigates the project through its lifecycle using the WORKFLOW-MAP routing engine. Parzival loads the correct phase constraints on entry, drops them on exit, and enforces gate conditions before any phase transition.",
  lifecycle: [
    { phase: "Init", artifact: "project-status.md, goals.md, oversight directory" },
    { phase: "Discovery", artifact: "PRD.md (or tech-spec.md for Quick Flow)" },
    { phase: "Architecture", artifact: "architecture.md, epics, project-context.md update" },
    { phase: "Planning", artifact: "sprint-status.yaml, story files" },
    { phase: "Execution", artifact: "Completed story implementations (via agents)" },
    { phase: "Integration", artifact: "Test plan, cohesion check results" },
    { phase: "Release", artifact: "Changelog, rollback plan, deployment checklist" },
    { phase: "Maintenance", artifact: "Triaged issues, approved fixes" },
  ],
  keyRules: [
    {
      gc: "GC-06",
      text: "Phase constraints are additive layers — global constraints are never dropped throughout the session.",
    },
    {
      gc: "GC-08",
      text: "If an exit condition is not met, the phase does not advance. No exceptions.",
    },
    {
      gc: "GC-07",
      text: "Never carry tech debt or bugs forward — issues are fixed in the current cycle.",
    },
  ],
};

const mode2Content = {
  overview:
    "Maintains the comprehensive project record in the oversight directory. Every handoff, log entry, and note is written for Future Parzival — a fresh instance with zero session context that must be able to understand everything.",
  responsibilities: [
    {
      icon: ScrollText,
      title: "Session Handoffs",
      detail: "State snapshots at every session close using templates",
    },
    {
      icon: FileText,
      title: "Decision Records",
      detail: "DEC-### format with options, tradeoffs, and outcome",
    },
    {
      icon: AlertTriangle,
      title: "Bug Reports",
      detail: "BUG-### format with root cause analysis",
    },
    {
      icon: GitBranch,
      title: "Risk & Blocker Logs",
      detail: "Tracked and triaged at every session",
    },
    {
      icon: Compass,
      title: "Project Status",
      detail: "Updated at every session close with phase, tasks, open issues",
    },
  ],
  keyRules: [
    {
      gc: "GC-15",
      text: "Always use oversight templates when creating structured documents. Never deviate.",
    },
    {
      gc: "GC-10",
      text: "User receives synthesized summaries — never raw agent output passed through.",
    },
    {
      gc: "GC-11",
      text: "All communication must be specific, verified, referenced, scoped, and measurable.",
    },
  ],
};

const mode3Content = {
  overview:
    "The execution pipeline for delegating implementation work to BMAD agents. Full team orchestration activates only when Parzival has a verified plan ready — Phase 4 (Execution) or later. Individual agent dispatches (Analyst, PM, Architect) occur in earlier phases via the agent-dispatch cycle.",
  pipeline: [
    {
      step: "01",
      name: "Team Builder",
      skill: "aim-parzival-team-builder",
      detail:
        "Designs agent teams when parallel work is needed. Identifies independent work units and file ownership boundaries.",
    },
    {
      step: "02",
      name: "Agent Dispatch",
      skill: "aim-agent-dispatch",
      detail:
        "Creates verified instruction prompts with all STANDARDS-mandated fields: TASK, CONTEXT, REQUIREMENTS (with file citations), SCOPE (in/out), OUTPUT EXPECTED, DONE WHEN, STANDARDS, BLOCKER PROTOCOL.",
    },
    {
      step: "03",
      name: "BMAD Dispatch",
      skill: "aim-bmad-dispatch",
      detail:
        "Spawns teammates with team_name. Sends activation command, waits for agent menu, then sends task instruction as separate message (GC-20).",
    },
    {
      step: "04",
      name: "Model Dispatch",
      skill: "aim-model-dispatch",
      detail:
        "Routes to correct LLM: DEV/Sonnet by default, Opus for Architect or escalation, Analyst/PM/SM use Sonnet.",
    },
  ],
  reviewCycle: {
    description:
      "Every agent output passes through the review cycle before reaching the user. Loops until zero legitimate issues confirmed — max 3 iterations before escalation.",
    loopSteps: "Send → Monitor → Review vs DONE WHEN → Accept or Loop → Shutdown → Summary",
  },
  activationNote: {
    title: "Phase 4 Gate",
    text: "Mode 3 full pipeline activates only in Execution, Integration, Release, and Maintenance phases. During Init, Discovery, Architecture, and Planning — only single-agent dispatch via the agent-dispatch cycle (no team-builder or model-dispatch skills).",
    color: AMBER,
  },
  keyRules: [
    {
      gc: "GC-12",
      text: "Dev-review cycle exits only when a review pass returns zero legitimate issues. DEV self-certification is never accepted.",
    },
    {
      gc: "GC-19",
      text: "Always spawn agents as teammates with team_name parameter. Standalone subagents are forbidden.",
    },
    {
      gc: "GC-20",
      text: "Activation command and task instruction must be separate messages. Never include instruction in activation message.",
    },
  ],
};

export function ParzivalModes() {
  const [activeTab, setActiveTab] = useState("mode1");

  const contentMap: Record<string, typeof mode1Content> = {
    mode1: mode1Content,
    mode2: mode2Content as unknown as typeof mode1Content,
    mode3: mode3Content as unknown as typeof mode1Content,
  };
  const currentContent = contentMap[activeTab];

  const currentColor = {
    mode1: CYAN,
    mode2: GREEN,
    mode3: AMBER,
  }[activeTab];

  return (
    <section id="modes" className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,245,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="section-label">
              <Compass className="w-3.5 h-3.5" />
              Operating Modes
            </div>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{
              fontFamily: "var(--font-orbitron)",
              color: "#E8EAF0",
            }}
          >
            Three Concurrent{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Modes
            </span>
          </h2>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: "#7A8AAA" }}>
            Parzival operates in three concurrent modes. Mode 1 and Mode 2 are always
            active. Mode 3 activates only during execution phases — never before.
          </p>
        </motion.div>

        {/* Phase Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 overflow-x-auto"
        >
          <div className="flex items-center gap-0 min-w-max sm:min-w-0">
            {phases.map((phase, i) => {
              const isM3Active = phase.active === "1&2&3";
              const isCurrent = phase.id === "execution";
              return (
                <div key={phase.id} className="flex items-center">
                  <div className="relative">
                    <div
                      className="w-28 h-20 flex flex-col items-center justify-center gap-1 border-r border-0 relative"
                      style={{}}
                    >
                      {/* Phase box */}
                      <div
                        className="px-3 py-1.5 rounded-lg text-center transition-all duration-300"
                        style={{
                          background: isCurrent
                            ? `${VIOLET}15`
                            : `${CYAN}06`,
                          border: `1px solid ${isCurrent ? VIOLET + "40" : CYAN + "25"}`,
                        }}
                      >
                        <div
                          className="text-xs font-semibold mb-0.5"
                          style={{
                            color: isCurrent ? VIOLET : CYAN,
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {phase.label}
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className="text-[9px] px-1 py-0.5 rounded"
                            style={{
                              background: `${CYAN}10`,
                              color: CYAN,
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            M1
                          </span>
                          <span
                            className="text-[9px] px-1 py-0.5 rounded"
                            style={{
                              background: `${GREEN}10`,
                              color: GREEN,
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            M2
                          </span>
                          {isM3Active && (
                            <span
                              className="text-[9px] px-1 py-0.5 rounded"
                              style={{
                                background: `${AMBER}10`,
                                color: AMBER,
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              M3
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Connector line */}
                      {i < phases.length - 1 && (
                        <div
                          className="absolute right-0 top-1/2 w-4 h-px z-10"
                          style={{
                            background: `linear-gradient(90deg, ${isM3Active ? VIOLET + "40" : CYAN + "20"}, ${phases[i + 1].active === "1&2&3" ? VIOLET + "40" : CYAN + "20"})`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: CYAN }} />
              <span className="text-xs" style={{ color: "#7A8AAA" }}>Mode 1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: GREEN }} />
              <span className="text-xs" style={{ color: "#7A8AAA" }}>Mode 2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: AMBER }} />
              <span className="text-xs" style={{ color: "#7A8AAA" }}>Mode 3</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center gap-2 mb-8 border-b"
          style={{ borderColor: "rgba(0,245,255,0.1)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-2 px-4 py-3 transition-all duration-200"
            >
              <tab.icon
                className="w-4 h-4"
                style={{
                  color: activeTab === tab.id ? tab.color : "#7A8AAA",
                }}
              />
              <span
                className="text-sm font-semibold"
                style={{
                  color: activeTab === tab.id ? tab.color : "#7A8AAA",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {tab.label}
              </span>
              <span
                className="text-xs hidden sm:inline"
                style={{ color: "#7A8AAA" }}
              >
                {tab.sublabel}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Overview */}
            <div
              className="p-5 rounded-2xl mb-6"
              style={{
                background: `${currentColor}05`,
                border: `1px solid ${currentColor}18`,
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#B8C4D8" }}>
                {currentContent.overview}
              </p>
            </div>

            {/* Mode 1: Lifecycle Table */}
            {activeTab === "mode1" && (
              <div className="space-y-4">
                <h3
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: CYAN, fontFamily: "var(--font-mono)" }}
                >
                  Phase Lifecycle & Artifacts
                </h3>
                <div className="space-y-2">
                  {mode1Content.lifecycle.map((item, i) => (
                    <div
                      key={item.phase}
                      className="flex items-start gap-4 p-3 rounded-xl"
                      style={{
                        background: "rgba(15,20,50,0.5)",
                        border: "1px solid rgba(0,245,255,0.08)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: `${CYAN}10`,
                          border: `1px solid ${CYAN}20`,
                        }}
                      >
                        <span
                          className="text-xs font-mono font-semibold"
                          style={{ color: CYAN }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-semibold mb-0.5"
                          style={{ color: "#E8EAF0" }}
                        >
                          {item.phase}
                        </div>
                        <div
                          className="text-xs leading-relaxed"
                          style={{ color: "#7A8AAA" }}
                        >
                          {item.artifact}
                        </div>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 flex-shrink-0 mt-1"
                        style={{ color: "#3A4560" }}
                      />
                    </div>
                  ))}
                </div>
                {/* Key Rules */}
                <div className="pt-4">
                  <h3
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: CYAN, fontFamily: "var(--font-mono)" }}
                  >
                    Key Constraint Rules
                  </h3>
                  <div className="space-y-2">
                    {mode1Content.keyRules.map((rule) => (
                      <div
                        key={rule.gc}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{
                          background: "rgba(15,20,50,0.5)",
                          border: "1px solid rgba(0,245,255,0.08)",
                        }}
                      >
                        <span
                          className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                          style={{
                            background: `${CYAN}12`,
                            color: CYAN,
                          }}
                        >
                          {rule.gc}
                        </span>
                        <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                          {rule.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Responsibilities */}
            {activeTab === "mode2" && (
              <div className="space-y-4">
                <h3
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: GREEN, fontFamily: "var(--font-mono)" }}
                >
                  Documentation Responsibilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mode2Content.responsibilities.map((resp) => (
                    <div
                      key={resp.title}
                      className="p-4 rounded-xl"
                      style={{
                        background: "rgba(0,255,136,0.03)",
                        border: "1px solid rgba(0,255,136,0.1)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <resp.icon className="w-4 h-4" style={{ color: GREEN }} />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "#E8EAF0" }}
                        >
                          {resp.title}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                        {resp.detail}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Key Rules */}
                <div className="pt-4">
                  <h3
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: GREEN, fontFamily: "var(--font-mono)" }}
                  >
                    Governing Constraints
                  </h3>
                  <div className="space-y-2">
                    {mode2Content.keyRules.map((rule) => (
                      <div
                        key={rule.gc}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{
                          background: "rgba(0,255,136,0.03)",
                          border: "1px solid rgba(0,255,136,0.1)",
                        }}
                      >
                        <span
                          className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                          style={{
                            background: `${GREEN}12`,
                            color: GREEN,
                          }}
                        >
                          {rule.gc}
                        </span>
                        <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                          {rule.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Pipeline */}
            {activeTab === "mode3" && (
              <div className="space-y-5">
                {/* Activation Gate */}
                <div
                  className="p-4 rounded-xl flex items-start gap-3"
                  style={{
                    background: "rgba(245,158,11,0.06)",
                    border: "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: AMBER }} />
                  <div>
                    <div
                      className="text-xs font-semibold mb-1"
                      style={{ color: AMBER, fontFamily: "var(--font-mono)" }}
                    >
                      {mode3Content.activationNote.title}: Phase 4 (Execution) or later
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                      {mode3Content.activationNote.text}
                    </p>
                  </div>
                </div>

                {/* Pipeline */}
                <h3
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: AMBER, fontFamily: "var(--font-mono)" }}
                >
                  Pipeline Stages
                </h3>
                <div className="space-y-3">
                  {mode3Content.pipeline.map((stage, i) => (
                    <div
                      key={stage.step}
                      className="relative p-4 rounded-xl"
                      style={{
                        background: "rgba(15,20,50,0.5)",
                        border: "1px solid rgba(245,158,11,0.1)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${AMBER}12`,
                            border: `1px solid ${AMBER}25`,
                          }}
                        >
                          <span
                            className="text-xs font-mono font-bold"
                            style={{ color: AMBER }}
                          >
                            {stage.step}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-sm font-semibold"
                              style={{ color: "#E8EAF0" }}
                            >
                              {stage.name}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded font-mono"
                              style={{
                                background: `${AMBER}08`,
                                color: AMBER,
                              }}
                            >
                              {stage.skill}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                            {stage.detail}
                          </p>
                        </div>
                      </div>
                      {/* Connector arrow */}
                      {i < mode3Content.pipeline.length - 1 && (
                        <div
                          className="absolute left-5 -bottom-3 w-px h-3"
                          style={{
                            background: `linear-gradient(180deg, ${AMBER}30, transparent)`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Review Cycle */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(255,68,68,0.04)",
                    border: "1px solid rgba(255,68,68,0.12)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4" style={{ color: RED }} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: RED, fontFamily: "var(--font-mono)" }}
                    >
                      Review Cycle — Loop Until Zero Issues
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#7A8AAA" }}>
                    {mode3Content.reviewCycle.description}
                  </p>
                  <div
                    className="p-3 rounded-lg font-mono text-xs leading-relaxed"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      color: "#7A8AAA",
                      border: "1px solid rgba(255,68,68,0.08)",
                    }}
                  >
                    {mode3Content.reviewCycle.loopSteps}
                  </div>
                </div>

                {/* Key Rules */}
                <div>
                  <h3
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: AMBER, fontFamily: "var(--font-mono)" }}
                  >
                    Governing Constraints
                  </h3>
                  <div className="space-y-2">
                    {mode3Content.keyRules.map((rule) => (
                      <div
                        key={rule.gc}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{
                          background: "rgba(15,20,50,0.5)",
                          border: "1px solid rgba(245,158,11,0.1)",
                        }}
                      >
                        <span
                          className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                          style={{
                            background: `${AMBER}12`,
                            color: AMBER,
                          }}
                        >
                          {rule.gc}
                        </span>
                        <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                          {rule.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
