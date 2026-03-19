"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode2,
  ListTree,
  GitBranch,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Zap,
  Database,
  Layers,
  ScrollText,
  FlaskConical,
  AlertTriangle,
} from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const MAGENTA = "#FF2D6A";

// ─── Directory Tree ────────────────────────────────────────────────────────

const directorySections = [
  {
    title: "Workflows (21 total)",
    color: VIOLET,
    icon: GitBranch,
    entries: [
      { path: "workflows/WORKFLOW-MAP.md", note: "Master routing engine" },
      { path: "workflows/init/new/workflow.md", note: "7 step chain" },
      { path: "workflows/init/existing/workflow.md", note: "6 steps + 4 branches" },
      { path: "workflows/session/start/workflow.md", note: "5 steps" },
      { path: "workflows/session/status/workflow.md", note: "1 step inline" },
      { path: "workflows/session/blocker/workflow.md", note: "3 steps" },
      { path: "workflows/session/decision/workflow.md", note: "3 steps" },
      { path: "workflows/session/verify/workflow.md", note: "4 steps" },
      { path: "workflows/session/handoff/workflow.md", note: "3 steps" },
      { path: "workflows/session/close/workflow.md", note: "4 steps" },
      { path: "workflows/phases/discovery/workflow.md", note: "7 steps" },
      { path: "workflows/phases/architecture/workflow.md", note: "9 steps" },
      { path: "workflows/phases/planning/workflow.md", note: "7 steps" },
      { path: "workflows/phases/execution/workflow.md", note: "7 steps" },
      { path: "workflows/phases/integration/workflow.md", note: "8 steps" },
      { path: "workflows/phases/release/workflow.md", note: "7 steps" },
      { path: "workflows/phases/maintenance/workflow.md", note: "7 steps" },
      { path: "workflows/cycles/agent-dispatch/workflow.md", note: "9 steps" },
      { path: "workflows/cycles/approval-gate/workflow.md", note: "4 steps" },
      { path: "workflows/cycles/legitimacy-check/workflow.md", note: "5 steps" },
      { path: "workflows/cycles/research-protocol/workflow.md", note: "6 steps" },
      { path: "workflows/cycles/review-cycle/workflow.md", note: "7 + loop" },
    ],
  },
  {
    title: "Constraints (79 total)",
    color: CYAN,
    icon: ShieldCheck,
    entries: [
      { path: "constraints/global/constraints.md", note: "GC-01 to GC-20 (20 constraints)" },
      { path: "constraints/init/constraints.md", note: "IN-01 to IN-05 (5)" },
      { path: "constraints/discovery/constraints.md", note: "DC-01 to DC-07 (7)" },
      { path: "constraints/architecture/constraints.md", note: "AC-01 to AC-08 (8)" },
      { path: "constraints/planning/constraints.md", note: "PC-01 to PC-08 (8)" },
      { path: "constraints/execution/constraints.md", note: "EC-01 to EC-10 (9)" },
      { path: "constraints/integration/constraints.md", note: "IC-01 to IC-07 (7)" },
      { path: "constraints/release/constraints.md", note: "RC-01 to RC-07 (7)" },
      { path: "constraints/maintenance/constraints.md", note: "MC-01 to MC-08 (8)" },
    ],
  },
  {
    title: "Skills (7 directories)",
    color: AMBER,
    icon: Zap,
    entries: [
      { path: "skills/aim-parzival-bootstrap/", note: "Cross-session memory retrieval from Qdrant" },
      { path: "skills/aim-parzival-constraints/", note: "Behavioral constraint loading" },
      { path: "skills/aim-parzival-team-builder/", note: "Multi-agent team design and spawn" },
      { path: "skills/aim-agent-dispatch/", note: "Single-agent instruction template" },
      { path: "skills/aim-bmad-dispatch/", note: "BMAD activation protocol" },
      { path: "skills/aim-model-dispatch/", note: "Model selection (Sonnet/Opus)" },
      { path: "skills/aim-agent-lifecycle/", note: "Monitor, review, correction, shutdown" },
    ],
  },
  {
    title: "Templates (7 + 18 oversight)",
    color: GREEN,
    icon: ScrollText,
    entries: [
      { path: "templates/bug-report.template.md", note: "" },
      { path: "templates/correction.template.md", note: "" },
      { path: "templates/decision-log.template.md", note: "" },
      { path: "templates/session-handoff.template.md", note: "" },
      { path: "templates/verification-code.template.md", note: "" },
      { path: "templates/verification-production.template.md", note: "" },
      { path: "templates/verification-story.template.md", note: "" },
      { path: "18 oversight/ templates", note: "bugs, decisions, specs, plans, audits, etc." },
    ],
  },
  {
    title: "Data Files (7)",
    color: MAGENTA,
    icon: Database,
    entries: [
      { path: "data/confidence-levels.md", note: "5 levels" },
      { path: "data/complexity-assessment.md", note: "4 levels" },
      { path: "data/escalation-protocol.md", note: "Critical/High/Medium/Low" },
      { path: "data/issue-classification-criteria.md", note: "A1-A8, B1-B4, C1-C5" },
      { path: "data/document-maintenance.md", note: "Update rules" },
      { path: "data/self-check-constraints.md", note: "Self-check behavior" },
      { path: "data/parzival-master-plan.md", note: "Original design document" },
    ],
  },
];

// ─── File Count Summary ─────────────────────────────────────────────────────

const fileCounts = [
  { category: "Workflow files", count: 21 },
  { category: "Step files", count: 118 },
  { category: "Branch files", count: 4 },
  { category: "Constraint files", count: 79 },
  { category: "Constraint index files", count: 9 },
  { category: "Data files", count: 7 },
  { category: "Template files (pov)", count: 7 },
  { category: "Skill directories", count: 7 },
  { category: "Oversight template files", count: 18 },
];

// ─── Activation Sequence ────────────────────────────────────────────────

const activationSteps = [
  {
    step: "01",
    label: "Load persona",
    detail: "parzival.md — identity and constraints are now active",
    color: CYAN,
  },
  {
    step: "02",
    label: "Load config.yaml",
    detail:
      "Store {user_name}, {communication_language}, {oversight_path}, {constraints_path}, {workflows_path}. STOP if config not loaded.",
    color: CYAN,
  },
  {
    step: "03",
    label: "Store user identity",
    detail: "Store {user_name} for all greetings and communications",
    color: CYAN,
  },
  {
    step: "04",
    label: "Load global constraints",
    detail:
      "Read constraints/global/constraints.md. Read project-status.md to determine phase. Load phase constraint file if found. STOP if global constraints not loaded.",
    color: VIOLET,
  },
  {
    step: "05",
    label: "Load skill definitions",
    detail:
      "Load from {project-root}/.claude/skills/ (aim- prefixed files). Core skills: aim-parzival-bootstrap, aim-parzival-constraints. Dispatch skills use inline reference until skill files exist.",
    color: AMBER,
  },
  {
    step: "06",
    label: "Load workflow map",
    detail: "Read workflows/WORKFLOW-MAP.md — determines routing for this session",
    color: AMBER,
  },
  {
    step: "07",
    label: "Check project status",
    detail: "Read project-status.md in project root — determines current phase",
    color: MAGENTA,
  },
  {
    step: "08",
    label: "Load phase context",
    detail:
      "Load only the files needed for this phase (context slice — phase artifacts, relevant tracking files)",
    color: MAGENTA,
  },
  {
    step: "09",
    label: "Greet user + present menu",
    detail: "Confirm state. STOP and WAIT for user input — do NOT auto-proceed",
    color: GREEN,
  },
];

// ─── Verification Checklist ─────────────────────────────────────────────

const verificationSections = [
  { id: "1", title: "Step Chain Integrity", items: 6 },
  { id: "2", title: "Phase Isolation", items: 6 },
  { id: "3", title: "Constraint References", items: 4 },
  { id: "4", title: "Workflow Exit Behavior", items: 6 },
  { id: "5", title: "Constraint Count Consistency", items: 5 },
  { id: "6", title: "Constraint File Structure", items: 4 },
  { id: "7", title: "Constraint Matrix Sync", items: 4 },
  { id: "8", title: "Menu Path Verification", items: 7 },
  { id: "9", title: "WORKFLOW-MAP Sync", items: 4 },
  { id: "10", title: "Data File Cross-Reference", items: 5 },
  { id: "11", title: "Template File Verification", items: 5 },
  { id: "12", title: "Activation Sequence Verification", items: 9 },
  { id: "13", title: "Installer Shim Verification", items: 5 },
];

// ─── Data Flow ─────────────────────────────────────────────────────────

const dataFlowSteps = [
  { label: "config.yaml", detail: "Path resolution, user identity, team settings" },
  { label: "parzival.md", detail: "Loads persona and identity" },
  { label: "global constraints", detail: "GC-01 to GC-20 — never dropped" },
  { label: "WORKFLOW-MAP", detail: "Determines session routing" },
  { label: "project-status.md", detail: "Current phase, active task, open issues" },
  { label: "phase workflow", detail: "Loads workflow steps for current phase" },
  { label: "phase constraints", detail: "Additive on top of global" },
  { label: "context slice", detail: "Only files needed for this phase" },
  { label: "cycle workflows", detail: "agent-dispatch, review-cycle, approval-gate..." },
  { label: "BMAD agents", detail: "Spawned with team_name, reviewed before surfacing" },
  { label: "oversight docs", detail: "Handoffs, bug reports, decision logs" },
];

// ─── Sub-components ──────────────────────────────────────────────────────

const DirectorySection = ({
  title,
  color,
  icon: Icon,
  entries,
}: {
  title: string;
  color: string;
  icon: React.ElementType;
  entries: { path: string; note: string }[];
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${color}18` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs font-semibold" style={{ color }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "#7A8AAA" }}>
            {entries.length} entries
          </span>
          <ChevronRight
            className="w-3.5 h-3.5 transition-transform duration-200"
            style={{
              color: "#7A8AAA",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="px-3 pb-3 border-t"
              style={{ borderColor: `${color}10` }}
            >
              {entries.map((e) => (
                <div
                  key={e.path}
                  className="flex items-start gap-2 py-1.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span
                    className="text-[10px] font-mono flex-shrink-0 mt-px"
                    style={{ color: color }}
                  >
                    {e.path}
                  </span>
                  {e.note && (
                    <span className="text-[10px]" style={{ color: "#7A8AAA" }}>
                      — {e.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VerificationCard = ({
  section,
}: {
  section: (typeof verificationSections)[0];
}) => (
  <div
    className="p-3 rounded-xl flex items-start gap-3"
    style={{
      background: `${VIOLET}04`,
      border: `1px solid ${VIOLET}12`,
    }}
  >
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: `${VIOLET}10`,
        border: `1px solid ${VIOLET}20`,
      }}
    >
      <span className="text-xs font-mono font-bold" style={{ color: VIOLET }}>
        {section.id}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold mb-0.5" style={{ color: "#E8EAF0" }}>
        {section.title}
      </div>
      <div className="text-xs" style={{ color: "#7A8AAA" }}>
        {section.items} checks
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────

const tabs = [
  { id: "directory", label: "Directory Tree", color: VIOLET },
  { id: "activation", label: "Activation", color: CYAN },
  { id: "dataflow", label: "Data Flow", color: GREEN },
  { id: "verification", label: "Verification", color: AMBER },
];

export function ParzivalSpecs() {
  const [activeTab, setActiveTab] = useState("directory");
  const color = tabs.find((t) => t.id === activeTab)?.color ?? VIOLET;

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
              <FileCode2 className="w-3.5 h-3.5" />
              Technical Specifications
            </div>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-orbitron)", color: "#E8EAF0" }}
          >
            Under the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Hood
            </span>
          </h2>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: "#7A8AAA" }}>
            Complete structural map of the Parzival POV module. Directory tree, activation sequence,
            information flow, and the verification checklist for POV modifications.
          </p>
        </motion.div>

        {/* File Count Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-8"
        >
          {fileCounts.map((fc) => (
            <div
              key={fc.category}
              className="text-center p-2 rounded-xl"
              style={{
                background: `${color}05`,
                border: `1px solid ${color}12`,
              }}
            >
              <div
                className="text-lg font-bold font-mono mb-0.5"
                style={{ color, fontFamily: "var(--font-mono)" }}
              >
                {fc.count}
              </div>
              <div className="text-[9px] leading-tight" style={{ color: "#7A8AAA" }}>
                {fc.category}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center gap-1 mb-8 overflow-x-auto border-b"
          style={{ borderColor: "rgba(0,245,255,0.1)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-2 px-4 py-3 transition-all duration-200 flex-shrink-0"
            >
              <ListTree
                className="w-4 h-4"
                style={{ color: activeTab === tab.id ? tab.color : "#7A8AAA" }}
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
              {activeTab === tab.id && (
                <motion.div
                  layoutId="specsTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: tab.color }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── DIRECTORY ── */}
            {activeTab === "directory" && (
              <div className="space-y-3">
                {directorySections.map((section) => (
                  <DirectorySection key={section.title} {...section} />
                ))}
              </div>
            )}

            {/* ── ACTIVATION ── */}
            {activeTab === "activation" && (
              <div className="space-y-3">
                {/* Header note */}
                <div
                  className="p-4 rounded-xl flex items-start gap-3 mb-4"
                  style={{
                    background: "rgba(0,245,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.12)",
                  }}
                >
                  <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: CYAN }} />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: CYAN }}>
                      9-Step Strict Order — STOP on failure
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                      Steps 2 and 4 have hard STOP conditions. If config.yaml cannot be loaded
                      (step 02) or global constraints cannot be loaded (step 04), Parzival halts
                      and reports the error. Step 09 is the final gate: Parzival presents state
                      and stops — it never auto-proceeds.
                    </p>
                  </div>
                </div>

                {activationSteps.map((step, i) => (
                  <div key={step.step} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${step.color}12`,
                          border: `1px solid ${step.color}25`,
                        }}
                      >
                        <span
                          className="text-xs font-mono font-bold"
                          style={{ color: step.color }}
                        >
                          {step.step}
                        </span>
                      </div>
                      {i < activationSteps.length - 1 && (
                        <div
                          className="w-px flex-1 my-1"
                          style={{
                            background: `linear-gradient(180deg, ${step.color}20, ${activationSteps[i + 1].color}20)`,
                            minHeight: 12,
                          }}
                        />
                      )}
                    </div>
                    <div className="pb-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold" style={{ color: "#E8EAF0" }}>
                          {step.label}
                        </span>
                        {step.step === "02" || step.step === "04" ? (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                            style={{
                              background: "rgba(255,68,68,0.12)",
                              color: "#FF4444",
                            }}
                          >
                            STOP on failure
                          </span>
                        ) : step.step === "09" ? (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                            style={{
                              background: "rgba(0,255,136,0.12)",
                              color: GREEN,
                            }}
                          >
                            WAIT for user
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── DATA FLOW ── */}
            {activeTab === "dataflow" && (
              <div>
                <div
                  className="p-4 rounded-xl mb-5"
                  style={{
                    background: "rgba(0,255,136,0.03)",
                    border: "1px solid rgba(0,255,136,0.12)",
                  }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Information flows from config resolution through constraint loading, workflow
                    routing, and agent dispatch, to oversight documentation. Every artifact
                    produced feeds back into future session context.
                  </p>
                </div>

                <div className="space-y-2">
                  {dataFlowSteps.map((step, i) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${GREEN}10`,
                          border: `1px solid ${GREEN}25`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-xs font-mono font-semibold"
                          style={{ color: GREEN }}
                        >
                          {step.label}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs" style={{ color: "#7A8AAA" }}>
                          {step.detail}
                        </span>
                      </div>
                      {i < dataFlowSteps.length - 1 && (
                        <ArrowRight
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: "#3A4560" }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Quality gate note */}
                <div
                  className="mt-5 p-4 rounded-xl"
                  style={{
                    background: "rgba(255,68,68,0.04)",
                    border: "1px solid rgba(255,68,68,0.1)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4" style={{ color: "#FF4444" }} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#FF4444", fontFamily: "var(--font-mono)" }}
                    >
                      GC-12 — Quality Gate: Loop Until Zero Issues
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "#7A8AAA" }}>
                    Every agent output passes through the review cycle before reaching the user.
                    The cycle loops until a review pass returns zero legitimate issues. Max 3
                    loops before escalation. DEV self-certification is never accepted.
                  </p>
                  <div
                    className="font-mono text-xs p-2 rounded-lg leading-relaxed"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      color: "#7A8AAA",
                      border: "1px solid rgba(255,68,68,0.08)",
                    }}
                  >
                    Send → Monitor → Review vs DONE WHEN → Accept or Loop → Shutdown → Summary
                  </div>
                </div>
              </div>
            )}

            {/* ── VERIFICATION ── */}
            {activeTab === "verification" && (
              <div>
                <div
                  className="p-4 rounded-xl mb-5"
                  style={{
                    background: "rgba(245,158,11,0.04)",
                    border: "1px solid rgba(245,158,11,0.12)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="w-4 h-4" style={{ color: AMBER }} />
                    <span className="text-xs font-semibold" style={{ color: AMBER }}>
                      13-Section POV Verification Checklist
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    Run after any modification to{" "}
                    <code
                      className="px-1 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        color: CYAN,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      _ai-memory/pov/
                    </code>
                    . Check only sections relevant to the change type. Full reference
                    maintained at{" "}
                    <code
                      className="px-1 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        color: CYAN,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      oversight/specs/parzival/verification-checklist.md
                    </code>
                    .
                  </p>
                </div>

                {/* Change Type → Sections mapping */}
                <div
                  className="p-4 rounded-xl mb-5"
                  style={{
                    background: "rgba(15,20,50,0.5)",
                    border: "1px solid rgba(139,92,246,0.15)",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-3"
                    style={{ color: VIOLET }}
                  >
                    What to Check by Change Type
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { change: "Edited a step file", checks: "Sections 1, 2, 3" },
                      { change: "Added/removed a step", checks: "Sections 1, 2, 3, 4" },
                      { change: "Edited a constraint file", checks: "Sections 5, 6" },
                      { change: "Added/removed a constraint", checks: "Sections 5, 6, 7" },
                      { change: "Edited a workflow.md", checks: "Sections 1, 4, 8" },
                      { change: "Added a new workflow", checks: "Sections 1, 4, 5, 8, 9" },
                      { change: "Edited a data file", checks: "Section 10" },
                      { change: "Edited a template", checks: "Section 11" },
                      { change: "Edited parzival.md", checks: "Sections 8, 12" },
                      { change: "Edited config.yaml", checks: "Section 12" },
                    ].map((item) => (
                      <div
                        key={item.change}
                        className="flex items-start gap-2 p-2 rounded-lg"
                        style={{
                          background: "rgba(0,0,0,0.15)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <span className="text-xs flex-1" style={{ color: "#B8C4D8" }}>
                          {item.change}
                        </span>
                        <span
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{
                            background: `${VIOLET}10`,
                            color: VIOLET,
                          }}
                        >
                          {item.checks}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All 13 sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {verificationSections.map((section) => (
                    <VerificationCard key={section.id} section={section} />
                  ))}
                </div>

                {/* Step chain integrity note */}
                <div
                  className="mt-4 p-3 rounded-xl flex items-start gap-2"
                  style={{
                    background: "rgba(255,68,68,0.04)",
                    border: "1px solid rgba(255,68,68,0.1)",
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#FF4444" }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                    All 9 phase terminal steps must have explicit constraint drop/load. If missing,
                    constraints leak into the next phase — a critical violation of cross-phase
                    isolation.
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
