"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  Play,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Layers,
} from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const MAGENTA = "#FF2D6A";

const tabMeta = [
  { id: "session", label: "Session", sub: "7 workflows", color: CYAN },
  { id: "init", label: "Init", sub: "2 workflows", color: GREEN },
  { id: "phase", label: "Phase", sub: "7 workflows", color: VIOLET },
  { id: "cycle", label: "Cycle", sub: "5 workflows", color: AMBER },
];

const sessionWorkflows = [
  {
    code: "ST",
    name: "Session Start",
    steps: 5,
    purpose: "Load context, compile status, present to user",
    constraints: "Global only",
  },
  {
    code: "SU",
    name: "Quick Status",
    steps: 1,
    purpose: "Read-only status snapshot",
    constraints: "Global only",
  },
  {
    code: "BL",
    name: "Blocker Analysis",
    steps: 3,
    purpose: "Capture, analyze, and log blockers",
    constraints: "Global + Phase",
  },
  {
    code: "DC",
    name: "Decision Support",
    steps: 3,
    purpose: "Structure decisions with options and tradeoffs",
    constraints: "Global + Phase",
  },
  {
    code: "VE",
    name: "Verification",
    steps: 4,
    purpose: "Run verification protocol (story/code/production)",
    constraints: "Global + Phase",
  },
  {
    code: "HO",
    name: "Handoff",
    steps: 3,
    purpose: "Mid-session state snapshot",
    constraints: "Global + Phase",
  },
  {
    code: "CL",
    name: "Session Close",
    steps: 4,
    purpose: "Full closeout with tracking updates and Qdrant save",
    constraints: "Global + Phase",
  },
];

const initWorkflows = [
  {
    name: "Init New",
    steps: "7 steps",
    purpose: "New project from scratch. Establish baseline.",
    exit: "WF-DISCOVERY",
    routes: "project-status.md + goals.md created, user approves via gate",
    color: GREEN,
  },
  {
    name: "Init Existing",
    steps: "6 steps + 4 branches",
    purpose: "Existing project onboarding. Audit, classify, baseline.",
    exit: "Correct phase (determined by audit)",
    routes: "Branch A: Active Mid-Sprint → Execution / Branch B: Messy/Undocumented → Discovery / Branch C: Paused/Restarting → Planning or Execution / Branch D: Handoff From Team → varies",
    color: GREEN,
  },
];

const phaseWorkflows = [
  {
    phase: "Discovery",
    number: 1,
    steps: 7,
    agents: "Analyst, PM",
    purpose: "PRD creation",
    exit: "Architecture",
    exitCondition: "PRD.md approved by user with explicit sign-off",
    artifacts: "PRD.md",
    color: CYAN,
  },
  {
    phase: "Architecture",
    number: 2,
    steps: 9,
    agents: "Architect, PM, UX Designer (optional)",
    purpose: "Technical blueprint",
    exit: "Planning",
    exitCondition: "architecture.md approved + epics created + readiness check passed",
    artifacts: "architecture.md, epics, project-context.md update",
    color: CYAN,
  },
  {
    phase: "Planning",
    number: 3,
    steps: 7,
    agents: "SM",
    purpose: "Sprint planning",
    exit: "Execution",
    exitCondition: "sprint-status.yaml initialized + at least one story ready",
    artifacts: "sprint-status.yaml, story files",
    color: GREEN,
  },
  {
    phase: "Execution",
    number: 4,
    steps: 7,
    agents: "DEV (implement + review)",
    purpose: "Story implementation",
    exit: "Planning or Integration",
    exitCondition: "Zero legitimate issues, user approves (story complete) or milestone hit (integration)",
    artifacts: "Completed story implementations",
    color: AMBER,
  },
  {
    phase: "Integration",
    number: 5,
    steps: 8,
    agents: "DEV, Architect",
    purpose: "Quality gate",
    exit: "Release or Execution",
    exitCondition: "Full test plan passed + cohesion check passed + zero issues",
    artifacts: "Test plan, cohesion check results",
    color: MAGENTA,
  },
  {
    phase: "Release",
    number: 6,
    steps: 7,
    agents: "SM, DEV",
    purpose: "Ship preparation",
    exit: "Maintenance",
    exitCondition: "Changelog complete + rollback plan exists + user sign-off",
    artifacts: "Changelog, rollback plan, deployment checklist, release notes",
    color: VIOLET,
  },
  {
    phase: "Maintenance",
    number: 7,
    steps: 7,
    agents: "Analyst, DEV",
    purpose: "Post-release fixes",
    exit: "Planning or Execution",
    exitCondition: "Issue resolved to zero legitimate issues + user approved",
    artifacts: "Triaged issues, approved fixes",
    color: CYAN,
  },
];

const cycleWorkflows = [
  {
    name: "agent-dispatch",
    steps: 9,
    purpose: "Agent lifecycle: dispatch, instruct, monitor, shutdown",
    invokedBy: "Discovery, Architecture, Planning, Execution, Integration, Release, Maintenance, Init Existing",
    exit: "Returns to calling workflow step",
    color: AMBER,
  },
  {
    name: "approval-gate",
    steps: 4,
    purpose: "User approval protocol: Approve / Reject / Hold",
    invokedBy: "Every phase exit + every task completion + decision points",
    exit: "Approve → next workflow / Reject → return to calling workflow with feedback / Hold → pauses",
    color: GREEN,
  },
  {
    name: "legitimacy-check",
    steps: 5,
    purpose: "Issue triage: LEGITIMATE / NON-ISSUE / UNCERTAIN",
    invokedBy: "Review Cycle, Maintenance, Integration",
    exit: "Returns to calling workflow with classification",
    color: CYAN,
  },
  {
    name: "research-protocol",
    steps: 6,
    purpose: "Verified research when confidence drops below INFORMED",
    invokedBy: "Any phase when uncertainty arises + Legitimacy Check when UNCERTAIN",
    exit: "Returns to calling workflow with verified answer or user-provided answer",
    color: VIOLET,
  },
  {
    name: "review-cycle",
    steps: "7 (+ loop)",
    purpose: "Dev-review loop until zero legitimate issues confirmed",
    invokedBy: "Execution, Integration, Maintenance",
    exit: "Returns to calling workflow (typically to approval-gate)",
    color: MAGENTA,
  },
];

const WorkflowCard = ({
  code,
  name,
  meta,
  purpose,
  badge,
  badgeColor,
  accentColor,
  extra,
}: {
  code?: string;
  name: string;
  meta?: string;
  purpose: string;
  badge?: string;
  badgeColor?: string;
  accentColor: string;
  extra?: React.ReactNode;
}) => (
  <div
    className="p-4 rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
    style={{
      background: "rgba(15,20,50,0.6)",
      border: `1px solid ${accentColor}18`,
    }}
  >
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className="flex items-center gap-2">
        {code && (
          <span
            className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
            style={{
              background: `${accentColor}12`,
              color: accentColor,
            }}
          >
            {code}
          </span>
        )}
        <span className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
          {name}
        </span>
      </div>
      {badge && (
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
          style={{
            background: `${badgeColor ?? accentColor}10`,
            color: badgeColor ?? accentColor,
          }}
        >
          {badge}
        </span>
      )}
    </div>
    <p className="text-xs leading-relaxed mb-2" style={{ color: "#7A8AAA" }}>
      {purpose}
    </p>
    {extra}
  </div>
);

const PhaseCard = ({
  phase,
  number,
  steps,
  agents,
  purpose,
  exit,
  exitCondition,
  artifacts,
  color,
}: (typeof phaseWorkflows)[0]) => (
  <div
    className="p-5 rounded-xl"
    style={{
      background: "rgba(15,20,50,0.6)",
      border: `1px solid ${color}18`,
    }}
  >
    {/* Header */}
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
          style={{
            background: `${color}12`,
            border: `1px solid ${color}25`,
            color: color,
          }}
        >
          {number}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
            {phase}
          </div>
          <div className="text-xs" style={{ color: "#7A8AAA" }}>
            {steps} steps · {purpose}
          </div>
        </div>
      </div>
      <span
        className="text-xs px-2 py-0.5 rounded font-mono flex-shrink-0"
        style={{
          background: `${color}10`,
          color: color,
        }}
      >
        Phase {number}
      </span>
    </div>

    {/* Agents */}
    <div className="flex items-center gap-1.5 mb-3">
      <Users className="w-3 h-3" style={{ color: "#7A8AAA" }} />
      <span className="text-xs" style={{ color: "#7A8AAA" }}>
        Agents:
      </span>
      <span className="text-xs font-medium" style={{ color: "#B8C4D8" }}>
        {agents}
      </span>
    </div>

    {/* Exit */}
    <div
      className="p-3 rounded-lg mb-3"
      style={{
        background: `${color}06`,
        border: `1px solid ${color}12`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <ArrowRight className="w-3 h-3" style={{ color: color }} />
        <span className="text-xs font-semibold" style={{ color }}>
          Exits → {exit}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
        {exitCondition}
      </p>
    </div>

    {/* Artifacts */}
    <div>
      <span className="text-xs font-semibold" style={{ color: "#7A8AAA" }}>
        Artifacts:{" "}
      </span>
      <span className="text-xs" style={{ color: "#B8C4D8" }}>
        {artifacts}
      </span>
    </div>
  </div>
);

export function ParzivalWorkflows() {
  const [activeTab, setActiveTab] = useState("session");

  const color = {
    session: CYAN,
    init: GREEN,
    phase: VIOLET,
    cycle: AMBER,
  }[activeTab];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139,92,246,0.05) 0%, transparent 70%)",
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
              <GitBranch className="w-3.5 h-3.5" />
              Workflow Universe
            </div>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-orbitron)", color: "#E8EAF0" }}
          >
            21 Workflows · 118 Step{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Files
            </span>
          </h2>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: "#7A8AAA" }}>
            Organized into 4 categories. Phase workflows are sequential. Session workflows are
            available any time. Cycle workflows are reusable atomic operations invoked from
            within other workflows.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-1 mb-8 overflow-x-auto"
        >
          {tabMeta.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-2 px-4 py-3 transition-all duration-200 flex-shrink-0"
            >
              <Layers className="w-4 h-4" style={{ color: activeTab === tab.id ? tab.color : "#7A8AAA" }} />
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
                  layoutId="workflowTab"
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
            {/* SESSION */}
            {activeTab === "session" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sessionWorkflows.map((wf) => (
                    <WorkflowCard
                      key={wf.code}
                      code={wf.code}
                      name={wf.name}
                      meta={`${wf.steps} steps`}
                      purpose={wf.purpose}
                      badge={wf.constraints}
                      badgeColor={wf.constraints === "Global only" ? CYAN : VIOLET}
                      accentColor={CYAN}
                    />
                  ))}
                </div>
                <div
                  className="mt-4 p-3 rounded-xl flex items-center gap-2"
                  style={{
                    background: "rgba(0,245,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.1)",
                  }}
                >
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: CYAN }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Session workflows are available at any time from Parzival&apos;s menu (HP → ST,
                    SU, BL, DC, VE, HO, CL). They do not follow a sequential chain.
                  </p>
                </div>
              </div>
            )}

            {/* INIT */}
            {activeTab === "init" && (
              <div className="space-y-4">
                {initWorkflows.map((wf) => (
                  <div
                    key={wf.name}
                    className="p-5 rounded-xl"
                    style={{
                      background: "rgba(15,20,50,0.6)",
                      border: `1px solid ${GREEN}18`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4" style={{ color: GREEN }} />
                        <span className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
                          {wf.name}
                        </span>
                        <span
                          className="text-xs font-mono px-1.5 py-0.5 rounded"
                          style={{
                            background: `${GREEN}10`,
                            color: GREEN,
                          }}
                        >
                          {wf.steps}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: "#7A8AAA" }}>
                      {wf.purpose}
                    </p>

                    {/* Routes */}
                    <div
                      className="p-3 rounded-lg mb-3"
                      style={{
                        background: `${GREEN}06`,
                        border: `1px solid ${GREEN}12`,
                      }}
                    >
                      <div className="text-xs font-semibold mb-1" style={{ color: GREEN }}>
                        Exit → {wf.exit}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                        {(wf as { exitCondition?: string }).exitCondition ?? wf.routes}
                      </p>
                    </div>

                    {/* Branch detail for Init Existing */}
                    {wf.name === "Init Existing" && (
                      <div className="space-y-2">
                        <div
                          className="text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
                        >
                          4 Branch Paths
                        </div>
                        {[
                          {
                            branch: "A",
                            name: "Active Mid-Sprint",
                            exit: "Execution",
                          },
                          {
                            branch: "B",
                            name: "Messy / Undocumented",
                            exit: "Discovery or Architecture",
                          },
                          {
                            branch: "C",
                            name: "Paused / Restarting",
                            exit: "Planning or Execution",
                          },
                          {
                            branch: "D",
                            name: "Handoff From Team",
                            exit: "Varies by audit",
                          },
                        ].map((b) => (
                          <div
                            key={b.branch}
                            className="flex items-center gap-2 p-2 rounded-lg"
                            style={{
                              background: `${GREEN}04`,
                              border: `1px solid ${GREEN}10`,
                            }}
                          >
                            <span
                              className="text-xs font-mono font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                              style={{
                                background: `${GREEN}10`,
                                color: GREEN,
                              }}
                            >
                              {b.branch}
                            </span>
                            <span className="text-xs flex-1" style={{ color: "#B8C4D8" }}>
                              {b.name}
                            </span>
                            <span className="text-xs" style={{ color: "#7A8AAA" }}>
                              → {b.exit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PHASE */}
            {activeTab === "phase" && (
              <div>
                {/* Flow diagram */}
                <div
                  className="p-4 rounded-xl mb-6 overflow-x-auto"
                  style={{
                    background: "rgba(15,20,50,0.5)",
                    border: "1px solid rgba(139,92,246,0.12)",
                  }}
                >
                  <div className="flex items-center gap-1 min-w-max sm:min-w-0">
                    {phaseWorkflows.map((wf, i) => (
                      <div key={wf.phase} className="flex items-center">
                        <div className="text-center px-2">
                          <div
                            className="w-20 h-12 rounded-xl flex items-center justify-center mb-1 mx-auto"
                            style={{
                              background: `${wf.color}10`,
                              border: `1px solid ${wf.color}25`,
                            }}
                          >
                            <span
                              className="text-xs font-mono font-bold"
                              style={{ color: wf.color }}
                            >
                              {wf.phase.slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[9px]" style={{ color: "#7A8AAA" }}>
                            {wf.steps} steps
                          </div>
                        </div>
                        {i < phaseWorkflows.length - 1 && (
                          <ChevronRight
                            className="w-3 h-3 mx-0.5 flex-shrink-0"
                            style={{ color: "#3A4560" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {phaseWorkflows.map((wf) => (
                    <PhaseCard key={wf.phase} {...wf} />
                  ))}
                </div>

                {/* Note */}
                <div
                  className="mt-4 p-3 rounded-xl flex items-center gap-2"
                  style={{
                    background: "rgba(139,92,246,0.04)",
                    border: "1px solid rgba(139,92,246,0.1)",
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" style={{ color: VIOLET }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Execution can loop back to Planning for next stories, or advance to Integration
                    on milestone hit. Maintenance can loop to Execution (bug fix) or Planning
                    (new feature).
                  </p>
                </div>
              </div>
            )}

            {/* CYCLE */}
            {activeTab === "cycle" && (
              <div className="space-y-4">
                {cycleWorkflows.map((wf) => (
                  <div
                    key={wf.name}
                    className="p-5 rounded-xl"
                    style={{
                      background: "rgba(15,20,50,0.6)",
                      border: `1px solid ${wf.color}18`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <RefreshCw
                          className="w-4 h-4"
                          style={{ color: wf.color }}
                        />
                        <span className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
                          {wf.name}
                        </span>
                        <span
                          className="text-xs font-mono px-1.5 py-0.5 rounded"
                          style={{
                            background: `${wf.color}10`,
                            color: wf.color,
                          }}
                        >
                          {wf.steps} steps
                        </span>
                      </div>
                    </div>

                    <p className="text-xs mb-3 leading-relaxed" style={{ color: "#7A8AAA" }}>
                      {wf.purpose}
                    </p>

                    {/* Invoked By */}
                    <div className="mb-3">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#7A8AAA" }}
                      >
                        Invoked by:{" "}
                      </span>
                      <span className="text-xs" style={{ color: "#B8C4D8" }}>
                        {wf.invokedBy}
                      </span>
                    </div>

                    {/* Exit */}
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: `${wf.color}05`,
                        border: `1px solid ${wf.color}12`,
                      }}
                    >
                      <div className="text-xs font-semibold mb-1" style={{ color: wf.color }}>
                        Exit → {wf.exit.split("→")[0]}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                        {wf.exit}
                      </p>
                    </div>
                  </div>
                ))}

                <div
                  className="p-3 rounded-xl flex items-center gap-2"
                  style={{
                    background: "rgba(245,158,11,0.04)",
                    border: "1px solid rgba(245,158,11,0.1)",
                  }}
                >
                  <Layers className="w-3.5 h-3.5 flex-shrink-0" style={{ color: AMBER }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Cycle workflows do not have their own constraint sets. They operate under the
                    constraints of the calling phase. Maximum nesting depth in practice:{" "}
                    <span
                      className="font-mono"
                      style={{ color: AMBER }}
                    >
                      review-cycle → legitimacy-check → research-protocol → agent-dispatch
                    </span>{" "}
                    (4 levels).
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
