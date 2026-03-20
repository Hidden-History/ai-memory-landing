"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  Layers,
  Lock,
  AlertTriangle,
} from "lucide-react";

/* ─── Colors ─────────────────────────────────────────────────────────── */

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const RED = "#FF4444";
const MAGENTA = "#FF2D6A";

const CRIT = RED;
const HIGH_COL = AMBER;
const MED = "#60A5FA";

/* ─── Global Constraints ─────────────────────────────────────────────── */

const globalIdentity = [
  { id: "GC-01", name: "Never Do Implementation Work", sev: "CRITICAL", desc: "Parzival never writes, edits, fixes, refactors, or produces any implementation output directly." },
  { id: "GC-02", name: "Never Guess — Research First", sev: "HIGH", desc: "Never present assumptions as facts; use confidence levels, research, or ask user." },
  { id: "GC-03", name: "Always Check Project Files Before Instructing", sev: "HIGH", desc: "Verify understanding against project files before sending any agent instruction." },
  { id: "GC-04", name: "User Manages Parzival Only", sev: "HIGH", desc: "User never directly interacts with BMAD agents. Parzival handles all dispatch and review." },
  { id: "GC-19", name: "Always Spawn Agents as Teammates", sev: "HIGH", desc: "BMAD agents must be spawned with team_name parameter. Standalone subagents forbidden." },
  { id: "GC-20", name: "Never Include Instruction in BMAD Activation", sev: "HIGH", desc: "Activation command and task instruction must be separate messages. Wait for agent menu first." },
];

const globalQuality = [
  { id: "GC-05", name: "Always Verify Fixes Against 4 Sources", sev: "CRITICAL", desc: "Every fix verified against: PRD, architecture, project-context, best practices." },
  { id: "GC-06", name: "Always Distinguish Legitimate Issues From Non-Issues", sev: "HIGH", desc: "Clear classification for every issue. Never force-fix non-issues. Never ignore legitimate issues." },
  { id: "GC-07", name: "Never Pass Work With Known Legitimate Issues", sev: "CRITICAL", desc: "No task closed, no milestone approved while known legitimate issues remain unresolved." },
  { id: "GC-08", name: "Never Carry Tech Debt or Bugs Forward", sev: "CRITICAL", desc: "Issues found during any phase are fixed in the current cycle. Never deferred as future work." },
  { id: "GC-13", name: "Always Research Best Practices Before New Tech", sev: "HIGH", desc: "Research best practices for new tech, after failed fixes, during security-sensitive work." },
  { id: "GC-14", name: "Always Check for Prior Issues Before New Bug Report", sev: "HIGH", desc: "Search oversight/bugs/ and blockers-log for prior reports before creating new ones." },
  { id: "GC-15", name: "Always Use Oversight Templates", sev: "MEDIUM", desc: "Reference appropriate template from oversight_path for all cross-session documents." },
  { id: "GC-16", name: "Mandatory Bug Tracking Protocol", sev: "CRITICAL", desc: "Every bug gets a BUG-XXX ID and bug template. 5-step tracking protocol." },
  { id: "GC-17", name: "Complex Bug Unified Spec Requirement", sev: "HIGH", desc: "Bugs with >2 sub-issues, >2 files, prior fix failure, or architectural scope require unified fix spec." },
  { id: "GC-18", name: "Oversight Document Sharding Compliance", sev: "MEDIUM", desc: "Documents exceeding 500 lines or 50 items must be sharded with an index file." },
];

const globalComm = [
  { id: "GC-09", name: "Always Review External Input Before Surfacing", sev: "HIGH", desc: "Every piece of external input reviewed for correctness, completeness, legitimacy, clarity." },
  { id: "GC-10", name: "Always Present Summaries — Never Raw Output", sev: "MEDIUM", desc: "User receives synthesized summaries in decision-ready format. Never raw agent text." },
  { id: "GC-11", name: "Always Communicate With Precision", sev: "HIGH", desc: "All communication must be specific, verified, referenced, scoped, and measurable." },
  { id: "GC-12", name: "Always Loop Dev-Review Until Zero Issues", sev: "CRITICAL", desc: "Dev-review cycle exits only when a review pass returns zero legitimate issues confirmed." },
];

/* ─── Phase Constraints ──────────────────────────────────────────────── */

const phaseData = [
  {
    phase: "Init",
    prefix: "IN",
    count: 5,
    color: CYAN,
    constraints: [
      { id: "IN-01", name: "Verify Project Structure Before Proceeding", sev: "HIGH" },
      { id: "IN-02", name: "Detect and Report Existing Project State Accurately", sev: "HIGH" },
      { id: "IN-03", name: "Confirm User Intent Before Creating/Modifying Files", sev: "CRITICAL" },
      { id: "IN-04", name: "Validate AI-Memory Installation Completeness", sev: "HIGH" },
      { id: "IN-05", name: "Establish Baseline Before Entering Any Phase Workflow", sev: "CRITICAL" },
    ],
  },
  {
    phase: "Discovery",
    prefix: "DC",
    count: 7,
    color: GREEN,
    constraints: [
      { id: "DC-01", name: "MUST Produce a PRD Before Exiting Discovery", sev: "CRITICAL" },
      { id: "DC-02", name: "CANNOT Exit Without Explicit User Sign-off on Scope", sev: "CRITICAL" },
      { id: "DC-03", name: "ALL Requirements Must Be Sourced — No Invented Requirements", sev: "HIGH" },
      { id: "DC-04", name: "Requirements Must Be Implementation-Free", sev: "HIGH" },
      { id: "DC-05", name: "Every Feature Must Have Acceptance Criteria", sev: "HIGH" },
      { id: "DC-06", name: "Out of Scope Must Be Explicitly Stated", sev: "MEDIUM" },
      { id: "DC-07", name: "Open Questions Must Be Resolved Before Architecture", sev: "HIGH" },
    ],
  },
  {
    phase: "Architecture",
    prefix: "AC",
    count: 8,
    color: VIOLET,
    constraints: [
      { id: "AC-01", name: "MUST Document Every Tech Decision With Rationale", sev: "HIGH" },
      { id: "AC-02", name: "CANNOT Choose Stack Without User Approval", sev: "HIGH" },
      { id: "AC-03", name: "Architecture Must Satisfy ALL PRD Non-Functional Requirements", sev: "HIGH" },
      { id: "AC-04", name: "Stories CANNOT Be Written Before Architecture Approved", sev: "CRITICAL" },
      { id: "AC-05", name: "Implementation Readiness Check Cannot Be Skipped", sev: "CRITICAL" },
      { id: "AC-06", name: "No Gold-Plating — Architecture Must Fit Project Scale", sev: "MEDIUM" },
      { id: "AC-07", name: "Existing Technology Must Be Respected", sev: "HIGH" },
      { id: "AC-08", name: "project-context.md Must Be Updated With Architecture Decisions", sev: "MEDIUM" },
    ],
  },
  {
    phase: "Planning",
    prefix: "PC",
    count: 8,
    color: CYAN,
    constraints: [
      { id: "PC-01", name: "Tasks Must Be Broken to Single-Responsibility Units", sev: "HIGH" },
      { id: "PC-02", name: "Cannot Assign a Story With Unmet Dependencies", sev: "CRITICAL" },
      { id: "PC-03", name: "Story Files Must Be Implementation-Ready Before Sprint Starts", sev: "HIGH" },
      { id: "PC-04", name: "Retrospective Must Run Before Subsequent Sprint Planning", sev: "MEDIUM" },
      { id: "PC-05", name: "Sprint Scope Must Be Realistic Given Project Velocity", sev: "MEDIUM" },
      { id: "PC-06", name: "Architecture.md Must Be Used as Technical Context for All Stories", sev: "HIGH" },
      { id: "PC-07", name: "Cannot Begin Execution Before Sprint Is Approved", sev: "CRITICAL" },
      { id: "PC-08", name: "Carryover Stories Are Included First in Next Sprint", sev: "MEDIUM" },
    ],
  },
  {
    phase: "Execution",
    prefix: "EC",
    count: 9,
    color: AMBER,
    constraints: [
      { id: "EC-01", name: "MUST Verify Story Requirements Against Current Project Files", sev: "CRITICAL" },
      { id: "EC-03", name: "CANNOT Generate Fix Instruction Without Review Result", sev: "HIGH" },
      { id: "EC-04", name: "Story Scope Cannot Expand During Execution Without Approval", sev: "HIGH" },
      { id: "EC-05", name: "All Acceptance Criteria Must Be Explicitly Confirmed Satisfied", sev: "CRITICAL" },
      { id: "EC-06", name: "DEV Cannot Self-Certify Completion — Parzival Verifies", sev: "CRITICAL" },
      { id: "EC-07", name: "Implementation Decisions Must Be Reviewed and Documented", sev: "MEDIUM" },
      { id: "EC-08", name: "Security Requirements Must Be Addressed for All Applicable Stories", sev: "CRITICAL" },
      { id: "EC-09", name: "Sprint Status Must Be Updated After Every Story State Transition", sev: "MEDIUM" },
      { id: "EC-10", name: "Observability Requirements", sev: "HIGH" },
    ],
  },
  {
    phase: "Integration",
    prefix: "IC",
    count: 7,
    color: MAGENTA,
    constraints: [
      { id: "IC-01", name: "Test Plan Must Be Created and Fully Executed Before Exit", sev: "CRITICAL" },
      { id: "IC-02", name: "Architect Cohesion Check Is Mandatory", sev: "CRITICAL" },
      { id: "IC-03", name: "All Milestone Stories Must Be Complete Before Integration", sev: "HIGH" },
      { id: "IC-04", name: "Integration Issues Cannot Be Deferred to Next Sprint", sev: "CRITICAL" },
      { id: "IC-05", name: "Full Test Plan Re-Runs After Every Fix Pass", sev: "HIGH" },
      { id: "IC-06", name: "DEV Integration Review Covers All Files in Milestone Scope", sev: "HIGH" },
      { id: "IC-07", name: "Security Full-Flow Verification Is Required for Applicable Integrations", sev: "CRITICAL" },
    ],
  },
  {
    phase: "Release",
    prefix: "RC",
    count: 7,
    color: VIOLET,
    constraints: [
      { id: "RC-01", name: "Changelog Must Be Accurate and Complete", sev: "HIGH" },
      { id: "RC-02", name: "Rollback Plan Must Exist and Be Specific", sev: "CRITICAL" },
      { id: "RC-03", name: "Deployment Checklist Must Be DEV-Verified Before Sign-Off", sev: "HIGH" },
      { id: "RC-04", name: "Breaking Changes Must Be Explicitly Surfaced to User", sev: "CRITICAL" },
      { id: "RC-05", name: "Release Cannot Proceed Without Explicit User Sign-Off", sev: "CRITICAL" },
      { id: "RC-06", name: "Release Notes Must Be Written for User/Stakeholder Audience", sev: "MEDIUM" },
      { id: "RC-07", name: "Integration Must Have Passed Before Release Begins", sev: "CRITICAL" },
    ],
  },
  {
    phase: "Maintenance",
    prefix: "MC",
    count: 8,
    color: CYAN,
    constraints: [
      { id: "MC-01", name: "Every Issue Must Be Triaged Before Any Fix Begins", sev: "HIGH" },
      { id: "MC-02", name: "Maintenance Fixes Are Strictly Scoped — No Scope Expansion", sev: "HIGH" },
      { id: "MC-03", name: "New Feature Requests Must Route to Planning — Not Into Maintenance", sev: "CRITICAL" },
      { id: "MC-04", name: "Review Cycle Standards Do Not Relax in Maintenance", sev: "CRITICAL" },
      { id: "MC-05", name: "One Issue Per Maintenance Task — No Bundling", sev: "MEDIUM" },
      { id: "MC-06", name: "CHANGELOG.md Must Be Updated for Every Approved Fix", sev: "MEDIUM" },
      { id: "MC-07", name: "CRITICAL and HIGH Fixes Must Have a Deployment Plan Before Closing", sev: "HIGH" },
      { id: "MC-08", name: "Queued Issues Are Prioritized by Severity — Always", sev: "MEDIUM" },
    ],
  },
];

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const tabs = [
  { id: "global", label: "Global", sub: "20 constraints", color: CYAN },
  { id: "phase", label: "Phase", sub: "59 constraints", color: VIOLET },
  { id: "lifecycle", label: "Lifecycle", sub: "load / drop", color: GREEN },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */

const sevColor = (sev: string) =>
  sev === "CRITICAL" ? CRIT : sev === "HIGH" ? HIGH_COL : MED;

const sevBorder = (sev: string) =>
  sev === "CRITICAL" ? 3 : sev === "HIGH" ? 2 : 1;

/* ─── Warning Panel ──────────────────────────────────────────────────── */

interface WarningPanelProps {
  id: string;
  name: string;
  sev: string;
  desc?: string;
  index: number;
}

const WarningPanel = ({ id, name, sev, desc, index }: WarningPanelProps) => {
  const color = sevColor(sev);
  const bw = sevBorder(sev);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="relative"
      style={{
        background: "rgba(10,13,30,0.92)",
        borderRadius: 4,
        border: `1px solid ${color}20`,
        borderLeft: `${bw}px solid ${color}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
      }}
    >
      {/* scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 4,
          background:
            "repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.02) 3px,rgba(0,0,0,0.02) 6px)",
          zIndex: 1,
        }}
      />

      <div className="relative z-[2] px-4 py-3">
        {/* Header row */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {sev === "CRITICAL" && (
            <AlertTriangle
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{
                color: CRIT,
                filter: `drop-shadow(0 0 4px ${CRIT})`,
              }}
            />
          )}
          <span
            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}30`,
            }}
          >
            {sev}
          </span>
          <span
            className="text-[11px] font-mono font-semibold"
            style={{ color: CYAN }}
          >
            {id}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "#E8EAF0" }}
          >
            {name}
          </span>
        </div>

        {/* Body */}
        {desc && (
          <p
            className="text-[11px] leading-relaxed mt-1"
            style={{ color: "#7A8AAA" }}
          >
            {desc}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Severity Group Header ──────────────────────────────────────────── */

const SeverityGroupHeader = ({
  label,
  color,
  icon: Icon,
  count,
}: {
  label: string;
  color: string;
  icon: typeof AlertTriangle;
  count: number;
}) => (
  <div className="flex items-center gap-2 mb-3 mt-6 first:mt-0">
    <Icon
      className="w-4 h-4"
      style={{ color, filter: `drop-shadow(0 0 3px ${color}40)` }}
    />
    <h3
      className="text-xs font-bold uppercase tracking-widest"
      style={{ color, fontFamily: "var(--font-mono)" }}
    >
      {label}
    </h3>
    <span
      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
      style={{ background: `${color}12`, color }}
    >
      {count}
    </span>
  </div>
);

/* ─── Group constraints by severity ──────────────────────────────────── */

function groupBySeverity(
  items: Array<{ id: string; name: string; sev: string; desc?: string }>
) {
  const critical = items.filter((c) => c.sev === "CRITICAL");
  const high = items.filter((c) => c.sev === "HIGH");
  const medium = items.filter((c) => c.sev === "MEDIUM");
  return { critical, high, medium };
}

/* ─── Stat Box ───────────────────────────────────────────────────────── */

const StatBox = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <div
    className="flex items-center gap-3 px-4 py-3"
    style={{
      background: "rgba(10,13,30,0.92)",
      borderRadius: 4,
      border: `1px solid ${color}20`,
      borderLeft: `3px solid ${color}`,
    }}
  >
    <div
      className="w-9 h-9 rounded flex items-center justify-center text-sm font-mono font-bold"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}25`,
        color,
      }}
    >
      {count}
    </div>
    <div>
      <div
        className="text-xs font-bold"
        style={{ color, fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
      <div className="text-[10px]" style={{ color: "#7A8AAA" }}>
        severity
      </div>
    </div>
  </div>
);

/* ─── Global Constraints View ────────────────────────────────────────── */

const GlobalConstraintsView = () => {
  const allGlobal = [...globalIdentity, ...globalQuality, ...globalComm];
  const { critical, high, medium } = groupBySeverity(allGlobal);
  let runningIdx = 0;

  return (
    <div className="space-y-2">
      {/* Info banner */}
      <div
        className="px-4 py-3 flex items-center gap-3 mb-4"
        style={{
          background: "rgba(10,13,30,0.92)",
          borderRadius: 4,
          border: `1px solid ${CYAN}20`,
          borderLeft: `3px solid ${CYAN}`,
        }}
      >
        <Lock className="w-4 h-4 flex-shrink-0" style={{ color: CYAN }} />
        <p
          className="text-xs leading-relaxed"
          style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
        >
          Global constraints are loaded at Parzival activation —{" "}
          <span style={{ color: CYAN }}>never dropped</span> throughout
          the session. Cannot be overridden by workflow instructions, user
          requests, or agent output.
        </p>
      </div>

      {/* CRITICAL group */}
      {critical.length > 0 && (
        <div>
          <SeverityGroupHeader
            label="CRITICAL CONSTRAINTS"
            color={CRIT}
            icon={AlertTriangle}
            count={critical.length}
          />
          <div
            className="space-y-2 p-3 rounded"
            style={{
              background: `${CRIT}03`,
              borderRadius: 4,
            }}
          >
            {critical.map((c) => {
              const idx = runningIdx++;
              return (
                <WarningPanel key={c.id} {...c} index={idx} />
              );
            })}
          </div>
        </div>
      )}

      {/* HIGH group */}
      {high.length > 0 && (
        <div>
          <SeverityGroupHeader
            label="HIGH PRIORITY"
            color={HIGH_COL}
            icon={ShieldAlert}
            count={high.length}
          />
          <div
            className="space-y-2 p-3 rounded"
            style={{
              background: `${HIGH_COL}03`,
              borderRadius: 4,
            }}
          >
            {high.map((c) => {
              const idx = runningIdx++;
              return (
                <WarningPanel key={c.id} {...c} index={idx} />
              );
            })}
          </div>
        </div>
      )}

      {/* MEDIUM group */}
      {medium.length > 0 && (
        <div>
          <SeverityGroupHeader
            label="STANDARD"
            color={MED}
            icon={ShieldCheck}
            count={medium.length}
          />
          <div
            className="space-y-2 p-3 rounded"
            style={{
              background: `${MED}03`,
              borderRadius: 4,
            }}
          >
            {medium.map((c) => {
              const idx = runningIdx++;
              return (
                <WarningPanel key={c.id} {...c} index={idx} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Phase Constraints View ─────────────────────────────────────────── */

const PhaseConstraintsView = () => (
  <div>
    <div className="space-y-6">
      {phaseData.map((p) => {
        const { critical, high, medium } = groupBySeverity(
          p.constraints.map((c) => ({ ...c, desc: undefined }))
        );
        let runningIdx = 0;

        return (
          <div key={p.phase}>
            {/* Phase header */}
            <div
              className="px-4 py-3 flex items-center justify-between mb-3"
              style={{
                background: "rgba(10,13,30,0.92)",
                borderRadius: 4,
                border: `1px solid ${p.color}25`,
                borderLeft: `3px solid ${p.color}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: p.color,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {p.phase}
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: `${p.color}12`, color: p.color }}
                >
                  {p.prefix}-01 to {p.prefix}-
                  {String(p.count).padStart(2, "0")}
                </span>
              </div>
              <span
                className="text-[11px] font-mono"
                style={{ color: "#7A8AAA" }}
              >
                {p.count} constraints
              </span>
            </div>

            {/* Grouped constraints */}
            <div className="space-y-2 ml-2">
              {critical.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle
                      className="w-3 h-3"
                      style={{ color: CRIT }}
                    />
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        color: CRIT,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      CRITICAL ({critical.length})
                    </span>
                  </div>
                  {critical.map((c) => {
                    const idx = runningIdx++;
                    return (
                      <WarningPanel
                        key={c.id}
                        {...c}
                        index={idx}
                      />
                    );
                  })}
                </>
              )}
              {high.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 mb-1 mt-2">
                    <ShieldAlert
                      className="w-3 h-3"
                      style={{ color: HIGH_COL }}
                    />
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        color: HIGH_COL,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      HIGH ({high.length})
                    </span>
                  </div>
                  {high.map((c) => {
                    const idx = runningIdx++;
                    return (
                      <WarningPanel
                        key={c.id}
                        {...c}
                        index={idx}
                      />
                    );
                  })}
                </>
              )}
              {medium.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 mb-1 mt-2">
                    <ShieldCheck
                      className="w-3 h-3"
                      style={{ color: MED }}
                    />
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        color: MED,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      STANDARD ({medium.length})
                    </span>
                  </div>
                  {medium.map((c) => {
                    const idx = runningIdx++;
                    return (
                      <WarningPanel
                        key={c.id}
                        {...c}
                        index={idx}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {/* Footer note */}
    <div
      className="mt-5 px-4 py-3 flex items-center gap-2"
      style={{
        background: "rgba(10,13,30,0.92)",
        borderRadius: 4,
        border: `1px solid ${VIOLET}20`,
        borderLeft: `2px solid ${VIOLET}`,
      }}
    >
      <AlertTriangle
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: VIOLET }}
      />
      <p
        className="text-xs leading-relaxed"
        style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
      >
        Total: 59 phase constraints across 8 phases. Each phase
        constraint is additive to global constraints — both layers are
        active simultaneously during a phase.
      </p>
    </div>
  </div>
);

/* ─── Lifecycle View ─────────────────────────────────────────────────── */

const LifecycleView = () => {
  const lifecycleSteps = [
    {
      step: "01",
      label: "Parzival Activates",
      detail:
        "Global constraints GC-01 through GC-20 loaded. Never dropped for entire session.",
      color: CYAN,
    },
    {
      step: "02",
      label: "Read project-status.md",
      detail: "Determine current phase from current_phase field.",
      color: CYAN,
    },
    {
      step: "03",
      label: "Load Phase Constraints",
      detail:
        "Phase-specific constraints loaded additively on top of global. Both layers active simultaneously.",
      color: VIOLET,
    },
    {
      step: "04",
      label: "Operate Within Phase",
      detail:
        "Self-check runs every ~10 messages. Any violation corrected immediately.",
      color: GREEN,
    },
    {
      step: "05",
      label: "Phase Exit",
      detail:
        "Phase constraints dropped. Drop is explicit and verified before next phase loads.",
      color: AMBER,
    },
    {
      step: "06",
      label: "Next Phase Entry",
      detail:
        "New phase constraints loaded. Global remains. No cross-phase leakage.",
      color: VIOLET,
    },
  ];

  const isolationRules = [
    {
      rule: "Phase constraints MUST NOT leak into other phases.",
      detail:
        "When a phase exits, its constraints are dropped before the next phase's constraints are loaded.",
    },
    {
      rule: "Loading constraints from the wrong phase is a constraint violation.",
      detail:
        "Example: Loading Execution constraints during Planning would activate EC-01 (verify story) before stories are ready.",
    },
    {
      rule: "If any phase constraint conflicts with a global constraint — the global wins.",
      detail:
        "Global constraints have absolute authority. Phase constraints add specificity; they do not override globals.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Constraint Lifecycle */}
      <div
        className="px-5 py-5"
        style={{
          background: "rgba(10,13,30,0.92)",
          borderRadius: 4,
          border: `1px solid ${GREEN}20`,
          borderLeft: `3px solid ${GREEN}`,
        }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{
            color: GREEN,
            fontFamily: "var(--font-orbitron)",
          }}
        >
          Constraint Lifecycle
        </h3>
        <div className="space-y-0">
          {lifecycleSteps.map((s, i) => (
            <div key={s.step}>
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}25`,
                  }}
                >
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: s.color }}
                  >
                    {s.step}
                  </span>
                </div>
                <div className="pb-1 flex-1 min-w-0">
                  <div
                    className="text-xs font-semibold mb-0.5"
                    style={{
                      color: "#E8EAF0",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    className="text-[11px] leading-relaxed"
                    style={{ color: "#7A8AAA" }}
                  >
                    {s.detail}
                  </div>
                </div>
              </div>
              {i < lifecycleSteps.length - 1 && (
                <div className="flex ml-[13px] my-1">
                  <svg width="2" height="20" viewBox="0 0 2 20">
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="20"
                      stroke={s.color}
                      strokeOpacity={0.25}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                    <circle r="1.5" fill={s.color} opacity={0.8}>
                      <animate
                        attributeName="cy"
                        from="0"
                        to="20"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.85;1"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Phase Isolation */}
      <div
        className="px-5 py-5"
        style={{
          background: "rgba(10,13,30,0.92)",
          borderRadius: 4,
          border: `1px solid ${CRIT}20`,
          borderLeft: `3px solid ${CRIT}`,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle
            className="w-4 h-4"
            style={{
              color: CRIT,
              filter: `drop-shadow(0 0 4px ${CRIT})`,
            }}
          />
          <h3
            className="text-sm font-semibold"
            style={{
              color: CRIT,
              fontFamily: "var(--font-orbitron)",
            }}
          >
            Cross-Phase Isolation
          </h3>
        </div>
        <div className="space-y-3">
          {isolationRules.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="px-4 py-3"
              style={{
                background: `${CRIT}04`,
                borderRadius: 4,
                borderLeft: `2px solid ${CRIT}`,
              }}
            >
              <p
                className="text-xs font-semibold mb-0.5"
                style={{
                  color: "#E8EAF0",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {r.rule}
              </p>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "#7A8AAA" }}
              >
                {r.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Self-Check Schedule */}
      <div
        className="px-5 py-5"
        style={{
          background: "rgba(10,13,30,0.92)",
          borderRadius: 4,
          border: `1px solid ${CYAN}20`,
          borderLeft: `3px solid ${CYAN}`,
        }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{
            color: CYAN,
            fontFamily: "var(--font-orbitron)",
          }}
        >
          Self-Check Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="px-4 py-3"
            style={{
              background: `${CYAN}06`,
              borderRadius: 4,
              borderLeft: `2px solid ${CYAN}`,
            }}
          >
            <div
              className="text-xs font-semibold mb-2"
              style={{
                color: CYAN,
                fontFamily: "var(--font-mono)",
              }}
            >
              Layer 1 — Always Active
            </div>
            <div
              className="text-[11px] leading-relaxed"
              style={{ color: "#7A8AAA" }}
            >
              Every ~10 messages, checks GC-01 through GC-20 (minus
              GC-09, GC-11, GC-16, GC-17, GC-18). Violations
              corrected immediately.
            </div>
          </div>
          <div
            className="px-4 py-3"
            style={{
              background: `${AMBER}06`,
              borderRadius: 4,
              borderLeft: `2px solid ${AMBER}`,
            }}
          >
            <div
              className="text-xs font-semibold mb-2"
              style={{
                color: AMBER,
                fontFamily: "var(--font-mono)",
              }}
            >
              Layer 3 — During Agent Work
            </div>
            <div
              className="text-[11px] leading-relaxed"
              style={{ color: "#7A8AAA" }}
            >
              During agent dispatch/review: additionally checks GC-09
              (review agent output) and GC-11 (precise instructions).
            </div>
          </div>
        </div>
      </div>

      {/* Global Constraint Supremacy */}
      <div
        className="px-4 py-3 flex items-start gap-3"
        style={{
          background: "rgba(10,13,30,0.92)",
          borderRadius: 4,
          border: `1px solid ${VIOLET}20`,
          borderLeft: `3px solid ${VIOLET}`,
        }}
      >
        <Layers
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          style={{ color: VIOLET }}
        />
        <div>
          <p
            className="text-xs font-semibold mb-1"
            style={{
              color: VIOLET,
              fontFamily: "var(--font-mono)",
            }}
          >
            Global Constraint Supremacy
          </p>
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: "#7A8AAA" }}
          >
            When a phase constraint appears to conflict with a global
            constraint — the global constraint wins. Always. Parzival
            does not negotiate, bend for speed, or yield to pressure.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Export ─────────────────────────────────────────────────────── */

export function ParzivalConstraints() {
  const [activeTab, setActiveTab] = useState("global");

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.05) 0%, transparent 70%)",
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
              <ShieldAlert className="w-3.5 h-3.5" />
              Constraint System
            </div>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{
              fontFamily: "var(--font-orbitron)",
              color: "#E8EAF0",
            }}
          >
            79 Constraints · 2{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Layers
            </span>
          </h2>
          <p
            className="text-sm max-w-xl leading-relaxed"
            style={{ color: "#7A8AAA" }}
          >
            Global constraints (always active) + phase constraints
            (additive, loaded on phase entry, dropped on phase exit). If
            a phase constraint conflicts with a global constraint — the
            global wins.
          </p>
        </motion.div>

        {/* Severity Summary Stat Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <StatBox label="CRITICAL" count={28} color={CRIT} />
          <StatBox label="HIGH" count={36} color={HIGH_COL} />
          <StatBox label="MEDIUM" count={15} color={MED} />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center gap-1 mb-8 border-b"
          style={{ borderColor: "rgba(0,245,255,0.1)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-2 px-4 py-3 transition-all duration-200"
            >
              <ShieldCheck
                className="w-4 h-4"
                style={{
                  color:
                    activeTab === tab.id ? tab.color : "#7A8AAA",
                }}
              />
              <span
                className="text-sm font-semibold"
                style={{
                  color:
                    activeTab === tab.id ? tab.color : "#7A8AAA",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {tab.label}
              </span>
              <span
                className="text-xs hidden sm:inline"
                style={{ color: "#7A8AAA" }}
              >
                {tab.sub}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="constraintTab"
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
            {activeTab === "global" && <GlobalConstraintsView />}
            {activeTab === "phase" && <PhaseConstraintsView />}
            {activeTab === "lifecycle" && <LifecycleView />}
          </motion.div>
        </AnimatePresence>

        {/* Enforcement Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 px-4 py-3 flex items-center gap-2"
          style={{
            background: "rgba(10,13,30,0.92)",
            borderRadius: 4,
            border: `1px solid ${CRIT}15`,
            borderLeft: `3px solid ${CRIT}`,
          }}
        >
          <AlertTriangle
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{
              color: CRIT,
              filter: `drop-shadow(0 0 3px ${CRIT})`,
            }}
          />
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
          >
            Constraint enforcement is automatic and continuous.
            Violations trigger immediate self-correction. No constraint
            can be overridden by user request, workflow instruction, or
            agent output.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
