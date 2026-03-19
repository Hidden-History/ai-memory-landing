"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  Play,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Layers,
  Cpu,
  Zap,
} from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const MAGENTA = "#FF2D6A";

/* ─── Tab Meta ────────────────────────────────────────────────────────── */

const tabMeta = [
  { id: "session", label: "Session", sub: "7 workflows", color: CYAN },
  { id: "init", label: "Init", sub: "2 workflows", color: GREEN },
  { id: "phase", label: "Phase", sub: "7 workflows", color: VIOLET },
  { id: "cycle", label: "Cycle", sub: "5 workflows", color: AMBER },
];

/* ─── Data (unchanged) ───────────────────────────────────────────────── */

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
    routes:
      "Branch A: Active Mid-Sprint → Execution / Branch B: Messy/Undocumented → Discovery / Branch C: Paused/Restarting → Planning or Execution / Branch D: Handoff From Team → varies",
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
    exitCondition:
      "architecture.md approved + epics created + readiness check passed",
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
    exitCondition:
      "sprint-status.yaml initialized + at least one story ready",
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
    exitCondition:
      "Zero legitimate issues, user approves (story complete) or milestone hit (integration)",
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
    exitCondition:
      "Full test plan passed + cohesion check passed + zero issues",
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
    exitCondition:
      "Changelog complete + rollback plan exists + user sign-off",
    artifacts:
      "Changelog, rollback plan, deployment checklist, release notes",
    color: VIOLET,
  },
  {
    phase: "Maintenance",
    number: 7,
    steps: 7,
    agents: "Analyst, DEV",
    purpose: "Post-release fixes",
    exit: "Planning or Execution",
    exitCondition:
      "Issue resolved to zero legitimate issues + user approved",
    artifacts: "Triaged issues, approved fixes",
    color: CYAN,
  },
];

const cycleWorkflows = [
  {
    name: "agent-dispatch",
    steps: 9,
    purpose: "Agent lifecycle: dispatch, instruct, monitor, shutdown",
    invokedBy:
      "Discovery, Architecture, Planning, Execution, Integration, Release, Maintenance, Init Existing",
    exit: "Returns to calling workflow step",
    color: AMBER,
  },
  {
    name: "approval-gate",
    steps: 4,
    purpose: "User approval protocol: Approve / Reject / Hold",
    invokedBy:
      "Every phase exit + every task completion + decision points",
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
    invokedBy:
      "Any phase when uncertainty arises + Legitimacy Check when UNCERTAIN",
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

/* ─── SVG Connector Helpers ──────────────────────────────────────────── */

/** Vertical connector with animated traveling dot */
const VerticalConnector = ({
  color,
  height = 40,
}: {
  color: string;
  height?: number;
}) => (
  <div className="flex justify-center" style={{ height }}>
    <svg
      width="2"
      height={height}
      viewBox={`0 0 2 ${height}`}
      className="overflow-visible"
    >
      <line
        x1="1"
        y1="0"
        x2="1"
        y2={height}
        stroke={color}
        strokeOpacity={0.3}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <circle r="2.5" fill={color} opacity={0.9}>
        <animate
          attributeName="cy"
          from="0"
          to={String(height)}
          dur="1.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.1;0.85;1"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

/** Horizontal connector with animated traveling dot */
const HorizontalConnector = ({
  color,
  width = 32,
}: {
  color: string;
  width?: number;
}) => (
  <div className="flex items-center" style={{ width }}>
    <svg
      width={width}
      height="12"
      viewBox={`0 0 ${width} 12`}
      className="overflow-visible"
    >
      <line
        x1="0"
        y1="6"
        x2={width}
        y2="6"
        stroke={color}
        strokeOpacity={0.3}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      {/* arrowhead */}
      <polygon
        points={`${width - 5},3 ${width},6 ${width - 5},9`}
        fill={color}
        opacity={0.5}
      />
      <circle r="2" fill={color} cy="6" opacity={0.9}>
        <animate
          attributeName="cx"
          from="0"
          to={String(width)}
          dur="1.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.1;0.85;1"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

/* ─── Terminal Node ──────────────────────────────────────────────────── */

interface TerminalNodeProps {
  label: string;
  detail: string;
  badge?: string;
  color: string;
  isLast?: boolean;
  borderWidth?: number;
}

const TerminalNode = ({
  label,
  detail,
  badge,
  color,
  isLast,
  borderWidth = 2,
}: TerminalNodeProps) => (
  <div
    className="relative px-4 py-3"
    style={{
      background: "rgba(10,13,30,0.92)",
      borderRadius: 4,
      border: `1px solid ${color}30`,
      borderLeft: `${borderWidth}px solid ${color}`,
      boxShadow: isLast
        ? `0 0 18px ${color}18, 0 8px 24px rgba(0,0,0,0.3)`
        : `0 8px 24px rgba(0,0,0,0.3)`,
    }}
  >
    {/* scanline overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        borderRadius: 4,
        background:
          "repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.02) 3px,rgba(0,0,0,0.02) 6px)",
      }}
    />
    <div className="relative z-[2] flex items-center gap-2 mb-1">
      {badge && (
        <span
          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
          style={{ background: `${color}18`, color }}
        >
          {badge}
        </span>
      )}
      <span
        className="text-xs font-semibold"
        style={{ color: "#E8EAF0", fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      {isLast && (
        <CheckCircle
          className="w-3.5 h-3.5 ml-auto"
          style={{ color: GREEN, filter: `drop-shadow(0 0 4px ${GREEN})` }}
        />
      )}
    </div>
    <p
      className="relative z-[2] text-[11px] leading-relaxed"
      style={{ color: "#7A8AAA" }}
    >
      {detail}
    </p>
  </div>
);

/* ─── Session Flowchart ──────────────────────────────────────────────── */

const SessionFlowchart = () => {
  /** Render session workflows as a two-column grid of connected nodes */
  const col1 = sessionWorkflows.slice(0, 4);
  const col2 = sessionWorkflows.slice(4);

  const renderColumn = (
    items: typeof sessionWorkflows,
    startIdx: number
  ) => (
    <div className="flex flex-col gap-0">
      {items.map((wf, i) => (
        <div key={wf.code}>
          <TerminalNode
            label={wf.name}
            detail={wf.purpose}
            badge={wf.code}
            color={
              wf.constraints === "Global only" ? CYAN : VIOLET
            }
            isLast={false}
            borderWidth={2}
          />
          {i < items.length - 1 && (
            <VerticalConnector color={CYAN} height={28} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Hub node */}
      <div className="flex justify-center mb-2">
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{
            background: "rgba(10,13,30,0.92)",
            borderRadius: 4,
            border: `1px solid ${CYAN}40`,
            borderLeft: `3px solid ${CYAN}`,
            boxShadow: `0 0 20px ${CYAN}12`,
          }}
        >
          <Cpu className="w-3.5 h-3.5" style={{ color: CYAN }} />
          <span
            className="text-xs font-bold"
            style={{ color: CYAN, fontFamily: "var(--font-mono)" }}
          >
            HP MENU
          </span>
          <span className="text-[10px]" style={{ color: "#7A8AAA" }}>
            any-time access
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <VerticalConnector color={CYAN} height={20} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {renderColumn(col1, 0)}
        {renderColumn(col2, 4)}
      </div>

      {/* Note */}
      <div
        className="mt-5 px-4 py-3 flex items-center gap-2"
        style={{
          background: "rgba(10,13,30,0.92)",
          borderRadius: 4,
          border: `1px solid ${CYAN}20`,
          borderLeft: `2px solid ${CYAN}`,
        }}
      >
        <Clock
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: CYAN }}
        />
        <p
          className="text-xs leading-relaxed"
          style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
        >
          Session workflows are available at any time from
          Parzival&apos;s menu (HP → ST, SU, BL, DC, VE, HO, CL).
          They do not follow a sequential chain.
        </p>
      </div>
    </div>
  );
};

/* ─── Init Flowchart ─────────────────────────────────────────────────── */

const InitFlowchart = () => {
  const branches = [
    { branch: "A", name: "Active Mid-Sprint", exit: "Execution" },
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
    { branch: "D", name: "Handoff From Team", exit: "Varies by audit" },
  ];

  return (
    <div className="space-y-8">
      {initWorkflows.map((wf) => (
        <div key={wf.name}>
          {/* Workflow title node */}
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-4 h-4" style={{ color: GREEN }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "#E8EAF0" }}
            >
              {wf.name}
            </span>
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ background: `${GREEN}12`, color: GREEN }}
            >
              {wf.steps}
            </span>
          </div>

          {/* Purpose node */}
          <TerminalNode
            label={wf.name}
            detail={wf.purpose}
            color={GREEN}
            borderWidth={2}
          />
          <VerticalConnector color={GREEN} height={28} />

          {/* Exit node */}
          <TerminalNode
            label={`Exit → ${wf.exit}`}
            detail={
              (wf as { exitCondition?: string }).exitCondition ??
              wf.routes
            }
            color={GREEN}
            badge="EXIT"
            isLast={wf.name !== "Init Existing"}
            borderWidth={2}
          />

          {/* Branch paths for Init Existing */}
          {wf.name === "Init Existing" && (
            <div className="mt-4 ml-4">
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{
                  color: "#7A8AAA",
                  fontFamily: "var(--font-mono)",
                }}
              >
                4 BRANCH PATHS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branches.map((b) => (
                  <div key={b.branch} className="flex items-start gap-2">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: `${GREEN}12`,
                        border: `1px solid ${GREEN}30`,
                      }}
                    >
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: GREEN }}
                      >
                        {b.branch}
                      </span>
                    </div>
                    <div>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#E8EAF0" }}
                      >
                        {b.name}
                      </span>
                      <span
                        className="text-xs block"
                        style={{ color: "#7A8AAA" }}
                      >
                        → {b.exit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Phase State Machine ────────────────────────────────────────────── */

const PhaseStateMachine = () => (
  <div>
    {/* Horizontal flow strip */}
    <div
      className="px-4 py-3 mb-6 overflow-x-auto"
      style={{
        background: "rgba(10,13,30,0.92)",
        borderRadius: 4,
        border: `1px solid ${VIOLET}20`,
        borderLeft: `3px solid ${VIOLET}`,
      }}
    >
      <div className="flex items-center gap-0 min-w-max">
        {phaseWorkflows.map((wf, i) => (
          <div key={wf.phase} className="flex items-center">
            <div
              className="px-3 py-2 text-center"
              style={{
                background: `${wf.color}08`,
                border: `1px solid ${wf.color}25`,
                borderRadius: 4,
                minWidth: 72,
              }}
            >
              <div
                className="text-[10px] font-mono font-bold"
                style={{ color: wf.color }}
              >
                {wf.phase.slice(0, 3).toUpperCase()}
              </div>
              <div
                className="text-[9px]"
                style={{ color: "#7A8AAA" }}
              >
                {wf.steps}s
              </div>
            </div>
            {i < phaseWorkflows.length - 1 && (
              <HorizontalConnector
                color={wf.color}
                width={28}
              />
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Phase detail cards as vertical state machine */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {phaseWorkflows.map((wf) => (
        <div
          key={wf.phase}
          className="relative px-5 py-4"
          style={{
            background: "rgba(10,13,30,0.92)",
            borderRadius: 4,
            border: `1px solid ${wf.color}20`,
            borderLeft: `3px solid ${wf.color}`,
          }}
        >
          {/* scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 4,
              background:
                "repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.02) 3px,rgba(0,0,0,0.02) 6px)",
            }}
          />
          {/* Header */}
          <div className="relative z-[2] flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
                style={{
                  background: `${wf.color}12`,
                  border: `1px solid ${wf.color}25`,
                  color: wf.color,
                }}
              >
                {wf.number}
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: "#E8EAF0",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {wf.phase}
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "#7A8AAA" }}
                >
                  {wf.steps} steps · {wf.purpose}
                </div>
              </div>
            </div>
            <span
              className="text-[10px] px-2 py-0.5 rounded font-mono flex-shrink-0"
              style={{ background: `${wf.color}10`, color: wf.color }}
            >
              Phase {wf.number}
            </span>
          </div>

          {/* Agents */}
          <div className="relative z-[2] flex items-center gap-1.5 mb-3">
            <Users
              className="w-3 h-3"
              style={{ color: "#7A8AAA" }}
            />
            <span
              className="text-[11px]"
              style={{ color: "#7A8AAA" }}
            >
              Agents:
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: "#B8C4D8" }}
            >
              {wf.agents}
            </span>
          </div>

          {/* Exit */}
          <div
            className="relative z-[2] p-3 rounded mb-3"
            style={{
              background: `${wf.color}06`,
              border: `1px solid ${wf.color}15`,
              borderRadius: 4,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight
                className="w-3 h-3"
                style={{ color: wf.color }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: wf.color, fontFamily: "var(--font-mono)" }}
              >
                Exit → {wf.exit}
              </span>
            </div>
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: "#7A8AAA" }}
            >
              {wf.exitCondition}
            </p>
          </div>

          {/* Artifacts */}
          <div className="relative z-[2]">
            <span
              className="text-[11px] font-semibold"
              style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
            >
              Artifacts:{" "}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "#B8C4D8" }}
            >
              {wf.artifacts}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Note */}
    <div
      className="mt-5 px-4 py-3 flex items-center gap-2"
      style={{
        background: "rgba(10,13,30,0.92)",
        borderRadius: 4,
        border: `1px solid ${VIOLET}20`,
        borderLeft: `2px solid ${VIOLET}`,
      }}
    >
      <RefreshCw
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: VIOLET }}
      />
      <p
        className="text-xs leading-relaxed"
        style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
      >
        Execution can loop back to Planning for next stories, or
        advance to Integration on milestone hit. Maintenance can loop
        to Execution (bug fix) or Planning (new feature).
      </p>
    </div>
  </div>
);

/* ─── Cycle Flowchart ────────────────────────────────────────────────── */

const CycleFlowchart = () => (
  <div>
    <div className="space-y-3">
      {cycleWorkflows.map((wf, idx) => (
        <div key={wf.name}>
          <div
            className="relative px-5 py-4"
            style={{
              background: "rgba(10,13,30,0.92)",
              borderRadius: 4,
              border: `1px solid ${wf.color}20`,
              borderLeft: `3px solid ${wf.color}`,
            }}
          >
            {/* scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 4,
                background:
                  "repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.02) 3px,rgba(0,0,0,0.02) 6px)",
              }}
            />
            {/* Header */}
            <div className="relative z-[2] flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <RefreshCw
                  className="w-4 h-4"
                  style={{ color: wf.color }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#E8EAF0",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {wf.name}
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: `${wf.color}12`,
                    color: wf.color,
                  }}
                >
                  {wf.steps} steps
                </span>
              </div>
            </div>

            <p
              className="relative z-[2] text-[11px] mb-3 leading-relaxed"
              style={{ color: "#7A8AAA" }}
            >
              {wf.purpose}
            </p>

            {/* Invoked By */}
            <div className="relative z-[2] mb-3">
              <span
                className="text-[11px] font-semibold"
                style={{
                  color: "#7A8AAA",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Invoked by:{" "}
              </span>
              <span
                className="text-[11px]"
                style={{ color: "#B8C4D8" }}
              >
                {wf.invokedBy}
              </span>
            </div>

            {/* Exit */}
            <div
              className="relative z-[2] p-3 rounded"
              style={{
                background: `${wf.color}06`,
                border: `1px solid ${wf.color}15`,
                borderRadius: 4,
              }}
            >
              <div
                className="text-[11px] font-semibold mb-1"
                style={{
                  color: wf.color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                Exit → {wf.exit.split("→")[0]}
              </div>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "#7A8AAA" }}
              >
                {wf.exit}
              </p>
            </div>
          </div>

          {idx < cycleWorkflows.length - 1 && (
            <VerticalConnector color={wf.color} height={20} />
          )}
        </div>
      ))}
    </div>

    {/* Note */}
    <div
      className="mt-5 px-4 py-3 flex items-start gap-2"
      style={{
        background: "rgba(10,13,30,0.92)",
        borderRadius: 4,
        border: `1px solid ${AMBER}20`,
        borderLeft: `2px solid ${AMBER}`,
      }}
    >
      <Layers
        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
        style={{ color: AMBER }}
      />
      <p
        className="text-xs leading-relaxed"
        style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
      >
        Cycle workflows do not have their own constraint sets. They
        operate under the constraints of the calling phase. Maximum
        nesting depth in practice:{" "}
        <span style={{ color: AMBER }}>
          review-cycle → legitimacy-check → research-protocol →
          agent-dispatch
        </span>{" "}
        (4 levels).
      </p>
    </div>
  </div>
);

/* ─── Main Export ─────────────────────────────────────────────────────── */

export function ParzivalWorkflows() {
  const [activeTab, setActiveTab] = useState("session");

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
            style={{
              fontFamily: "var(--font-orbitron)",
              color: "#E8EAF0",
            }}
          >
            21 Workflows · 118 Step{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Files
            </span>
          </h2>
          <p
            className="text-sm max-w-xl leading-relaxed"
            style={{ color: "#7A8AAA" }}
          >
            Organized into 4 categories. Phase workflows are
            sequential. Session workflows are available any time. Cycle
            workflows are reusable atomic operations invoked from
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
              <Zap
                className="w-4 h-4"
                style={{
                  color:
                    activeTab === tab.id ? tab.color : "#7A8AAA",
                }}
              />
              <div className="text-left">
                <div
                  className="text-sm font-semibold"
                  style={{
                    color:
                      activeTab === tab.id ? tab.color : "#7A8AAA",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {tab.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "#7A8AAA" }}
                >
                  {tab.sub}
                </div>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="workflowTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: tab.color }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
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
            {activeTab === "session" && <SessionFlowchart />}
            {activeTab === "init" && <InitFlowchart />}
            {activeTab === "phase" && <PhaseStateMachine />}
            {activeTab === "cycle" && <CycleFlowchart />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
