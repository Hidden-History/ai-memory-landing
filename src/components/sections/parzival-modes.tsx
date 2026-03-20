"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  FileText,
  Users,
  ScrollText,
  GitBranch,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Activity,
} from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const RED = "#FF4444";

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
      text: "Phase constraints are additive layers \u2014 global constraints are never dropped throughout the session.",
    },
    {
      gc: "GC-08",
      text: "If an exit condition is not met, the phase does not advance. No exceptions.",
    },
    {
      gc: "GC-07",
      text: "Never carry tech debt or bugs forward \u2014 issues are fixed in the current cycle.",
    },
  ],
};

const mode2Content = {
  overview:
    "Maintains the comprehensive project record in the oversight directory. Every handoff, log entry, and note is written for Future Parzival \u2014 a fresh instance with zero session context that must be able to understand everything.",
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
      text: "User receives synthesized summaries \u2014 never raw agent output passed through.",
    },
    {
      gc: "GC-11",
      text: "All communication must be specific, verified, referenced, scoped, and measurable.",
    },
  ],
};

const mode3Content = {
  overview:
    "The execution pipeline for delegating implementation work to BMAD agents. Full team orchestration activates only when Parzival has a verified plan ready \u2014 Phase 4 (Execution) or later. Individual agent dispatches (Analyst, PM, Architect) occur in earlier phases via the agent-dispatch cycle.",
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
      "Every agent output passes through the review cycle before reaching the user. Loops until zero legitimate issues confirmed \u2014 max 3 iterations before escalation.",
    loopSteps: "Send \u2192 Monitor \u2192 Review vs DONE WHEN \u2192 Accept or Loop \u2192 Shutdown \u2192 Summary",
  },
  activationNote: {
    title: "Phase 4 Gate",
    text: "Mode 3 full pipeline activates only in Execution, Integration, Release, and Maintenance phases. During Init, Discovery, Architecture, and Planning \u2014 only single-agent dispatch via the agent-dispatch cycle (no team-builder or model-dispatch skills).",
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

/* ── Shared sub-components ────────────────────────────────────── */

function ConstraintTag({
  gc,
  text,
  color,
}: {
  gc: string;
  text: string;
  color: string;
}) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-sm"
      style={{
        background: "rgba(10,13,30,0.92)",
        border: `1px solid ${color}20`,
      }}
    >
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 mt-0.5 tracking-wider"
        style={{
          background: `${color}14`,
          color,
          fontFamily: "var(--font-mono)",
          border: `1px solid ${color}30`,
        }}
      >
        [CONSTRAINT]
      </span>
      <span
        className="text-[10px] font-semibold flex-shrink-0 mt-0.5 tracking-wider"
        style={{
          color: `${color}CC`,
          fontFamily: "var(--font-mono)",
        }}
      >
        {gc}
      </span>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
      >
        {text}
      </p>
    </div>
  );
}

/* ── LED indicator ────────────────────────────────────────────── */
function LED({
  color,
  active,
}: {
  color: string;
  active: boolean;
}) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      {active && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 32,
            height: 32,
            background: `${color}18`,
            boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}15`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* LED body */}
      <div
        className="relative rounded-full"
        style={{
          width: 20,
          height: 20,
          background: active
            ? `radial-gradient(circle at 35% 35%, ${color}FF, ${color}AA 60%, ${color}60 100%)`
            : `radial-gradient(circle at 35% 35%, ${color}50, ${color}20 60%, ${color}10 100%)`,
          boxShadow: active
            ? `0 0 10px ${color}80, 0 0 24px ${color}30, inset 0 -2px 4px ${color}40`
            : `inset 0 -2px 4px ${color}10`,
          opacity: active ? 1 : 0.3,
          border: `1px solid ${active ? color + "80" : color + "20"}`,
        }}
      />
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export function ParzivalModes() {
  const [activeTab, setActiveTab] = useState("mode1");

  const currentColor = {
    mode1: CYAN,
    mode2: GREEN,
    mode3: AMBER,
  }[activeTab]!;

  const modeNumber = { mode1: "01", mode2: "02", mode3: "03" }[activeTab]!;

  return (
    <section id="modes" className="relative py-20 px-6 overflow-hidden">
      {/* Violet radial background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
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
          <p
            className="text-sm max-w-xl leading-relaxed"
            style={{ color: "#7A8AAA" }}
          >
            Parzival operates in three concurrent modes. Mode 1 and Mode 2 are
            always active. Mode 3 activates only during execution phases —
            never before.
          </p>
        </motion.div>

        {/* ── Mode Switch Dashboard ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "#3A4560", fontFamily: "var(--font-mono)" }}
          >
            Mode Selection Panel
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const modeNum =
                tab.id === "mode1"
                  ? "01"
                  : tab.id === "mode2"
                    ? "02"
                    : "03";
              const statusText =
                tab.id === "mode3"
                  ? isActive
                    ? "ACTIVE"
                    : "PHASE 4+"
                  : isActive
                    ? "ACTIVE"
                    : "STANDBY";
              const statusColor =
                statusText === "ACTIVE" ? GREEN : AMBER;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="relative flex-1 min-w-[200px] cursor-pointer select-none"
                  style={{
                    background: "rgba(10,13,30,0.92)",
                    border: `1px solid ${isActive ? tab.color + "50" : "rgba(139,92,246,0.12)"}`,
                    borderRadius: 4,
                    padding: "20px 16px",
                    boxShadow: isActive
                      ? `0 0 30px ${tab.color}15, 0 0 60px ${tab.color}08, inset 0 1px 0 ${tab.color}15`
                      : "0 8px 24px rgba(0,0,0,0.3)",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                >
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-sm"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 6px)",
                    }}
                  />

                  {/* Top bar accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] rounded-t-sm"
                    style={{
                      background: isActive
                        ? `linear-gradient(90deg, ${tab.color}80, ${tab.color}30)`
                        : `linear-gradient(90deg, ${tab.color}20, transparent)`,
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    {/* Mode number + name */}
                    <div className="text-center">
                      <div
                        className="text-[10px] font-semibold tracking-[0.15em] uppercase"
                        style={{
                          color: isActive ? tab.color : "#3A4560",
                          fontFamily: "var(--font-mono)",
                          transition: "color 0.3s",
                        }}
                      >
                        MODE {modeNum} — {tab.sublabel}
                      </div>
                    </div>

                    {/* LED indicator */}
                    <LED color={tab.color} active={isActive} />

                    {/* Status readout */}
                    <div
                      className="text-[10px] font-bold tracking-[0.2em] uppercase"
                      style={{
                        color: isActive ? statusColor : `${statusColor}80`,
                        fontFamily: "var(--font-mono)",
                        textShadow: isActive
                          ? `0 0 10px ${statusColor}50`
                          : "none",
                        transition: "color 0.3s, text-shadow 0.3s",
                      }}
                    >
                      {statusText}
                    </div>
                  </div>

                  {/* Active indicator glow on bottom */}
                  {isActive && (
                    <motion.div
                      layoutId="switchGlow"
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${tab.color}, transparent)`,
                        boxShadow: `0 0 12px ${tab.color}60`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Phase Timeline — Conveyor Belt ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "#3A4560", fontFamily: "var(--font-mono)" }}
          >
            Phase Assembly Line
          </div>
          <div
            className="overflow-x-auto pb-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(139,92,246,0.25) transparent",
            }}
          >
            <div className="relative min-w-[780px]">
              {/* Track line */}
              <div
                className="absolute left-0 right-0 h-[2px]"
                style={{
                  top: "50%",
                  transform: "translateY(-1px)",
                  background: `linear-gradient(90deg, ${VIOLET}20, ${VIOLET}40 20%, ${VIOLET}40 80%, ${VIOLET}20)`,
                }}
              />

              {/* Animated dot traveling along track */}
              <div
                className="absolute h-[6px] w-[6px] rounded-full"
                style={{
                  top: "50%",
                  transform: "translateY(-3px)",
                  background: CYAN,
                  boxShadow: `0 0 8px ${CYAN}80, 0 0 16px ${CYAN}40`,
                  animation: "conveyor-travel 6s linear infinite",
                }}
              />

              {/* Phase stations */}
              <div className="relative flex items-center justify-between">
                {phases.map((phase) => {
                  const isM3Active = phase.active === "1&2&3";
                  const isCurrent = phase.id === "execution";
                  return (
                    <div
                      key={phase.id}
                      className="relative flex flex-col items-center"
                      style={{ width: "12.5%" }}
                    >
                      <div
                        className="px-2 py-3 rounded-sm text-center relative"
                        style={{
                          background: "rgba(10,13,30,0.92)",
                          border: `1px solid ${isCurrent ? VIOLET + "50" : "rgba(139,92,246,0.15)"}`,
                          boxShadow: isCurrent
                            ? `0 0 20px ${VIOLET}15, 0 0 40px ${VIOLET}08`
                            : "none",
                          minWidth: 82,
                        }}
                      >
                        {/* Phase name */}
                        <div
                          className="text-[10px] font-semibold mb-2 tracking-wide"
                          style={{
                            color: isCurrent ? "#E8EAF0" : "#7A8AAA",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {phase.label}
                        </div>

                        {/* Mode indicator dots */}
                        <div className="flex items-center justify-center gap-1.5">
                          <div
                            className="w-[6px] h-[6px] rounded-full"
                            style={{
                              background: CYAN,
                              boxShadow: `0 0 4px ${CYAN}60`,
                            }}
                            title="M1"
                          />
                          <div
                            className="w-[6px] h-[6px] rounded-full"
                            style={{
                              background: GREEN,
                              boxShadow: `0 0 4px ${GREEN}60`,
                            }}
                            title="M2"
                          />
                          {isM3Active && (
                            <div
                              className="w-[6px] h-[6px] rounded-full"
                              style={{
                                background: AMBER,
                                boxShadow: `0 0 4px ${AMBER}60`,
                              }}
                              title="M3"
                            />
                          )}
                        </div>

                        {/* Current phase highlight bar */}
                        {isCurrent && (
                          <div
                            className="absolute bottom-0 left-[10%] right-[10%] h-[2px]"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${VIOLET}, transparent)`,
                              boxShadow: `0 0 8px ${VIOLET}60`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-3">
            {[
              { label: "M1 — Governance", color: CYAN },
              { label: "M2 — Oversight", color: GREEN },
              { label: "M3 — Orchestration", color: AMBER },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="w-[6px] h-[6px] rounded-full"
                  style={{ background: item.color }}
                />
                <span
                  className="text-[10px]"
                  style={{
                    color: "#3A4560",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Content Panels ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Overview terminal panel */}
            <div
              className="relative p-5 pt-8 rounded-sm mb-6"
              style={{
                background: "rgba(10,13,30,0.92)",
                border: `1px solid ${currentColor}20`,
              }}
            >
              {/* Title bar */}
              <div
                className="absolute top-0 left-0 right-0 h-6 flex items-center px-3 rounded-t-sm"
                style={{
                  background: "rgba(20,25,50,0.6)",
                  borderLeft: `3px solid ${currentColor}80`,
                }}
              >
                <Activity
                  className="w-2.5 h-2.5 mr-2"
                  style={{ color: currentColor }}
                />
                <span
                  className="text-[9px] font-semibold tracking-widest uppercase"
                  style={{
                    color: `${currentColor}AA`,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  MODE {modeNumber} SYSTEM OVERVIEW
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#B8C4D8", fontFamily: "var(--font-mono)" }}
              >
                {activeTab === "mode1" && mode1Content.overview}
                {activeTab === "mode2" && mode2Content.overview}
                {activeTab === "mode3" && mode3Content.overview}
              </p>
            </div>

            {/* ── Mode 1 Content ─────────────────────────────────── */}
            {activeTab === "mode1" && (
              <div className="space-y-5">
                {/* Section label */}
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: CYAN, fontFamily: "var(--font-mono)" }}
                >
                  Phase Lifecycle — Diagnostic Readout
                </div>

                {/* Lifecycle rows */}
                <div className="space-y-1">
                  {mode1Content.lifecycle.map((item, i) => (
                    <div
                      key={item.phase}
                      className="flex items-start gap-3 px-4 py-3 rounded-sm"
                      style={{
                        background: "rgba(10,13,30,0.92)",
                        border: "1px solid rgba(0,245,255,0.08)",
                      }}
                    >
                      {/* Step number badge */}
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-sm flex-shrink-0 mt-0.5"
                        style={{
                          background: `${CYAN}14`,
                          color: CYAN,
                          fontFamily: "var(--font-mono)",
                          border: `1px solid ${CYAN}30`,
                          minWidth: 28,
                          textAlign: "center",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {/* Phase name */}
                      <span
                        className="text-xs font-semibold flex-shrink-0 mt-0.5"
                        style={{
                          color: "#E8EAF0",
                          fontFamily: "var(--font-mono)",
                          minWidth: 100,
                        }}
                      >
                        {item.phase}
                      </span>
                      {/* Artifact */}
                      <span
                        className="text-xs leading-relaxed"
                        style={{
                          color: "#7A8AAA",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {item.artifact}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Key Rules */}
                <div className="pt-2">
                  <div
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3"
                    style={{ color: CYAN, fontFamily: "var(--font-mono)" }}
                  >
                    Constraint Rules
                  </div>
                  <div className="space-y-1">
                    {mode1Content.keyRules.map((rule) => (
                      <ConstraintTag
                        key={rule.gc}
                        gc={rule.gc}
                        text={rule.text}
                        color={CYAN}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Mode 2 Content ─────────────────────────────────── */}
            {activeTab === "mode2" && (
              <div className="space-y-5">
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: GREEN, fontFamily: "var(--font-mono)" }}
                >
                  Documentation Responsibilities
                </div>

                {/* 2-column grid of terminal panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mode2Content.responsibilities.map((resp) => (
                    <div
                      key={resp.title}
                      className="relative p-4 pt-8 rounded-sm"
                      style={{
                        background: "rgba(10,13,30,0.92)",
                        border: `1px solid ${GREEN}15`,
                      }}
                    >
                      {/* Title bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-6 flex items-center px-3 rounded-t-sm"
                        style={{
                          background: "rgba(20,25,50,0.6)",
                          borderLeft: `3px solid ${GREEN}60`,
                        }}
                      >
                        <resp.icon
                          className="w-2.5 h-2.5 mr-2"
                          style={{ color: GREEN }}
                        />
                        <span
                          className="text-[9px] font-semibold tracking-widest uppercase"
                          style={{
                            color: `${GREEN}AA`,
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {resp.title}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color: "#7A8AAA",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {resp.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Key Rules */}
                <div className="pt-2">
                  <div
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3"
                    style={{ color: GREEN, fontFamily: "var(--font-mono)" }}
                  >
                    Constraint Rules
                  </div>
                  <div className="space-y-1">
                    {mode2Content.keyRules.map((rule) => (
                      <ConstraintTag
                        key={rule.gc}
                        gc={rule.gc}
                        text={rule.text}
                        color={GREEN}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Mode 3 Content ─────────────────────────────────── */}
            {activeTab === "mode3" && (
              <div className="space-y-5">
                {/* Activation Gate Warning */}
                <div
                  className="relative p-4 pt-8 rounded-sm"
                  style={{
                    background: "rgba(10,13,30,0.92)",
                    border: `1px solid ${AMBER}25`,
                    boxShadow: `inset 0 0 40px ${AMBER}04`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-6 flex items-center px-3 rounded-t-sm"
                    style={{
                      background: `rgba(245,158,11,0.06)`,
                      borderLeft: `3px solid ${AMBER}80`,
                    }}
                  >
                    <Zap
                      className="w-2.5 h-2.5 mr-2"
                      style={{ color: AMBER }}
                    />
                    <span
                      className="text-[9px] font-semibold tracking-widest uppercase"
                      style={{
                        color: AMBER,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ACTIVATION GATE — {mode3Content.activationNote.title}
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: "#7A8AAA",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {mode3Content.activationNote.text}
                  </p>
                </div>

                {/* Pipeline label */}
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: AMBER, fontFamily: "var(--font-mono)" }}
                >
                  Pipeline Stages
                </div>

                {/* Pipeline steps with vertical connectors */}
                <div className="relative">
                  {mode3Content.pipeline.map((stage, i) => (
                    <div key={stage.step} className="relative">
                      {/* Vertical connector */}
                      {i > 0 && (
                        <div
                          className="flex justify-start ml-[18px]"
                          style={{ height: 20 }}
                        >
                          <div
                            className="w-[2px] h-full"
                            style={{
                              background: `linear-gradient(180deg, ${AMBER}50, ${AMBER}20)`,
                              boxShadow: `0 0 6px ${AMBER}20`,
                            }}
                          />
                        </div>
                      )}

                      {/* Step card */}
                      <div
                        className="relative p-4 pt-8 rounded-sm"
                        style={{
                          background: "rgba(10,13,30,0.92)",
                          border: `1px solid ${AMBER}15`,
                        }}
                      >
                        {/* Title bar */}
                        <div
                          className="absolute top-0 left-0 right-0 h-6 flex items-center px-3 rounded-t-sm"
                          style={{
                            background: "rgba(20,25,50,0.6)",
                            borderLeft: `3px solid ${AMBER}60`,
                          }}
                        >
                          <span
                            className="text-[9px] font-bold tracking-widest mr-3"
                            style={{
                              color: AMBER,
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            STEP {stage.step}
                          </span>
                          <span
                            className="text-[9px] font-semibold tracking-widest uppercase"
                            style={{
                              color: "#E8EAF0",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {stage.name}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Skill badge */}
                            <span
                              className="inline-block text-[10px] px-2 py-0.5 rounded-sm mb-2"
                              style={{
                                background: `${AMBER}10`,
                                color: AMBER,
                                fontFamily: "var(--font-mono)",
                                border: `1px solid ${AMBER}25`,
                              }}
                            >
                              {stage.skill}
                            </span>
                            <p
                              className="text-xs leading-relaxed"
                              style={{
                                color: "#7A8AAA",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              {stage.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Cycle — red-tinted panel */}
                <div
                  className="relative p-4 pt-8 rounded-sm"
                  style={{
                    background: "rgba(10,13,30,0.92)",
                    border: `1px solid ${RED}18`,
                    boxShadow: `inset 0 0 40px ${RED}04`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-6 flex items-center px-3 rounded-t-sm"
                    style={{
                      background: `rgba(255,68,68,0.04)`,
                      borderLeft: `3px solid ${RED}60`,
                    }}
                  >
                    <ShieldCheck
                      className="w-2.5 h-2.5 mr-2"
                      style={{ color: RED }}
                    />
                    <span
                      className="text-[9px] font-semibold tracking-widest uppercase"
                      style={{
                        color: RED,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Review Cycle — Loop Until Zero Issues
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{
                      color: "#7A8AAA",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {mode3Content.reviewCycle.description}
                  </p>
                  <div
                    className="p-3 rounded-sm text-xs leading-relaxed"
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      color: `${RED}CC`,
                      fontFamily: "var(--font-mono)",
                      border: `1px solid ${RED}12`,
                    }}
                  >
                    {mode3Content.reviewCycle.loopSteps}
                  </div>
                </div>

                {/* Key Rules */}
                <div className="pt-2">
                  <div
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3"
                    style={{ color: AMBER, fontFamily: "var(--font-mono)" }}
                  >
                    Constraint Rules
                  </div>
                  <div className="space-y-1">
                    {mode3Content.keyRules.map((rule) => (
                      <ConstraintTag
                        key={rule.gc}
                        gc={rule.gc}
                        text={rule.text}
                        color={AMBER}
                      />
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
