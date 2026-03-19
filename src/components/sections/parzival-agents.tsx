"use client";

import { motion } from "framer-motion";
import {
  Users,
  BrainCircuit,
  Lightbulb,
  ShieldCheck,
  Code2,
  BarChart3,
  LayoutGrid,
} from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const MAGENTA = "#FF2D6A";

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

// ─── Agent Card ──────────────────────────────────────────────────────────

const AgentCard = ({
  agent,
  index,
}: {
  agent: (typeof agentRoles)[0];
  index: number;
}) => {
  const capabilities = agent.what.map((w) => {
    const words = w.split(" ");
    return words.slice(0, 3).join(" ");
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        background: "rgba(10,13,30,0.92)",
        borderRadius: 4,
        border: `1px solid rgba(139,92,246,0.2)`,
        borderLeft: `3px solid ${agent.color}`,
        overflow: "hidden",
      }}
    >
      {/* Header bar — 24px */}
      <div
        style={{
          height: 24,
          background: "rgba(20,25,50,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: GREEN,
              boxShadow: `0 0 6px ${GREEN}`,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "#E8EAF0",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {agent.name}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: agent.color,
            background: `${agent.color}15`,
            padding: "1px 6px",
            borderRadius: 2,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {agent.role.split(" ")[0]}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 12px 14px" }}>
        {/* Icon + Role description */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          <agent.icon
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: agent.color }}
          />
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: agent.color,
                marginBottom: 2,
                fontWeight: 600,
              }}
            >
              {agent.role}
            </p>
            <p style={{ fontSize: 11, color: "#7A8AAA", lineHeight: 1.5 }}>
              {agent.what[0]}
            </p>
          </div>
        </div>

        {/* Model badge */}
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: agent.modelColor,
              background: `${agent.modelColor}12`,
              border: `1px solid ${agent.modelColor}30`,
              padding: "2px 8px",
              borderRadius: 2,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            MODEL: {agent.model.toUpperCase()}
          </span>
        </div>

        {/* Capabilities tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {capabilities.map((cap, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "#7A8AAA",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "2px 6px",
                borderRadius: 2,
                letterSpacing: "0.02em",
              }}
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Constraint note */}
        {(agent.constraint || agent.constraintNote) && (
          <div
            style={{
              marginTop: 10,
              padding: "6px 8px",
              background: `${agent.color}06`,
              border: `1px solid ${agent.color}15`,
              borderRadius: 2,
            }}
          >
            {agent.constraint && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: agent.color,
                  fontWeight: 700,
                }}
              >
                [{agent.constraint}]{" "}
              </span>
            )}
            <span style={{ fontSize: 10, color: "#7A8AAA" }}>
              {agent.constraintNote ?? ""}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────

export function ParzivalAgents() {
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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="section-label">
              <Users className="w-3.5 h-3.5" />
              Agent Roster
            </div>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-orbitron)", color: "#E8EAF0" }}
          >
            AGENT{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ROSTER
            </span>
          </h2>
          <p
            className="text-sm max-w-xl leading-relaxed"
            style={{ color: "#7A8AAA" }}
          >
            Diagnostic readout of the six BMAD agent roles that Parzival dispatches.
            Each agent operates under strict behavioral constraints with model-specific
            assignments.
          </p>
        </motion.div>

        {/* Team Status Header Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "rgba(10,13,30,0.92)",
            borderRadius: 4,
            border: "1px solid rgba(139,92,246,0.2)",
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          {/* 24px header bar */}
          <div
            style={{
              height: 24,
              background: "rgba(20,25,50,0.6)",
              borderLeft: `3px solid ${GREEN}`,
              borderRadius: "4px 4px 0 0",
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "#7A8AAA",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              TEAM DIAGNOSTICS
            </span>
          </div>
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: GREEN,
                  boxShadow: `0 0 8px ${GREEN}`,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: GREEN,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                {agentRoles.length} AGENTS REGISTERED
              </span>
            </div>
            <span
              style={{
                width: 1,
                height: 14,
                background: "rgba(255,255,255,0.08)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#7A8AAA",
                letterSpacing: "0.05em",
              }}
            >
              STATUS:{" "}
              <span style={{ color: GREEN }}>OPERATIONAL</span>
            </span>
            <span
              style={{
                width: 1,
                height: 14,
                background: "rgba(255,255,255,0.08)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#7A8AAA",
                letterSpacing: "0.05em",
              }}
            >
              DEFAULT MODEL:{" "}
              <span style={{ color: VIOLET }}>SONNET</span>
            </span>
          </div>
        </motion.div>

        {/* Agent Grid — 2 columns desktop, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agentRoles.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
