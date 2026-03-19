"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Anchor,
  Compass,
  Users,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Severity colors
const CRITICAL = "#FF4444";
const HIGH = "#F59E0B";
const MEDIUM = "#60A5FA";
const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";

const relationships = [
  {
    role: "Captain",
    actor: "You",
    icon: Anchor,
    color: CYAN,
    bg: "rgba(0,245,255,0.06)",
    border: "rgba(0,245,255,0.2)",
    description: "Set direction, make decisions, approve work",
    badge: "User",
  },
  {
    role: "Navigator",
    actor: "Parzival",
    icon: Compass,
    color: VIOLET,
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.2)",
    description: "Recommend actions, manage agents, enforce quality",
    badge: "AI PM",
  },
  {
    role: "Crew",
    actor: "BMAD Agents",
    icon: Users,
    color: "#00FF88",
    bg: "rgba(0,255,136,0.06)",
    border: "rgba(0,255,136,0.2)",
    description: "Implement, review, analyze under direction",
    badge: "Workers",
  },
];

const isNotItems = [
  {
    gc: "GC-01",
    severity: "CRITICAL",
    color: CRITICAL,
    title: "Never an Implementer",
    description:
      "Parzival never writes, edits, fixes, refactors, or produces implementation output directly. It assigns all implementation to agents.",
  },
  {
    gc: "GC-04",
    severity: "CRITICAL",
    color: CRITICAL,
    title: "Never a Relay",
    description:
      "The user never directly interacts with BMAD agents. Parzival is the single interface — it never passes raw agent output through.",
  },
  {
    gc: "GC-10",
    severity: "MEDIUM",
    color: MEDIUM,
    title: "Never a Decision-Maker",
    description:
      "Parzival recommends and advises. The user makes final decisions. Never presents as authoritative — always advisory.",
  },
];

const isItems = [
  {
    gc: "GC-09",
    severity: "HIGH",
    color: HIGH,
    title: "Always a Quality Gate",
    description:
      "All agent output passes through Parzival's review before reaching the user. Synthesized summaries only — never raw output.",
  },
  {
    gc: "GC-12",
    severity: "CRITICAL",
    color: CRITICAL,
    title: "Always Loops Until Zero Issues",
    description:
      "Dev-review cycles iterate until zero legitimate issues are confirmed. Parzival never accepts DEV self-certification.",
  },
  {
    gc: "GC-05",
    severity: "CRITICAL",
    color: CRITICAL,
    title: "Always Verifies Against Sources",
    description:
      "Every fix is verified against 4 sources: PRD, architecture, project-context, and best practices. Nothing ships without this.",
  },
  {
    gc: "GC-13",
    severity: "HIGH",
    color: HIGH,
    title: "Always Researches Best Practices",
    description:
      "Before new tech decisions or after failed fixes, Parzival researches and documents best practices with sources.",
  },
];

export function ParzivalIdentity() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Radial glow behind hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="section-label">
            <Bot className="w-3.5 h-3.5" />
            Core Identity
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
        </motion.div>

        {/* Identity Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-mono font-medium"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: VIOLET,
            }}
          >
            <Compass className="w-3 h-3" />
            Technical Project Manager &amp; Quality Gatekeeper
          </div>

          <h1
            className="font-orbitron font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <span style={{ color: "#E8EAF0" }}>Meet </span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 50%, #FF2D6A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Parzival
            </span>
          </h1>

          <p
            className="text-base sm:text-lg max-w-2xl leading-relaxed"
            style={{ color: "#7A8AAA" }}
          >
            The radar, map reader, and navigator of your AI agent team. The user
            is the captain who steers the ship — Parzival plans, delegates,
            tracks, and verifies. All agent output passes through its quality gate
            before reaching you.
          </p>
        </motion.div>

        {/* Relationship Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <Lightbulb
              className="w-4 h-4"
              style={{ color: CYAN }}
            />
            <h2
              className="text-sm font-semibold uppercase tracking-widest"
              style={{
                color: CYAN,
                fontFamily: "var(--font-mono)",
              }}
            >
              Relationship Model
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relationships.map((rel, i) => (
              <motion.div
                key={rel.role}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative p-5 rounded-2xl"
                style={{
                  background: rel.bg,
                  border: `1px solid ${rel.border}`,
                }}
              >
                {/* Corner accents */}
                <div
                  className="absolute top-0 left-0 w-4 h-4"
                  style={{
                    borderTop: `2px solid ${rel.color}`,
                    borderLeft: `2px solid ${rel.color}`,
                    borderRadius: "8px 0 0 0",
                    opacity: 0.6,
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-4 h-4"
                  style={{
                    borderBottom: `2px solid ${rel.color}`,
                    borderRight: `2px solid ${rel.color}`,
                    borderRadius: "0 0 8px 0",
                    opacity: 0.6,
                  }}
                />

                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${rel.color}15`, border: `1px solid ${rel.color}30` }}
                  >
                    <rel.icon className="w-4 h-4" style={{ color: rel.color }} />
                  </div>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: `${rel.color}12`,
                      border: `1px solid ${rel.color}25`,
                      color: rel.color,
                    }}
                  >
                    {rel.badge}
                  </span>
                </div>

                <div className="mb-1">
                  <span
                    className="text-sm font-bold"
                    style={{ color: rel.color, fontFamily: "var(--font-orbitron)" }}
                  >
                    {rel.role}
                  </span>
                </div>
                <div className="text-xs font-semibold mb-2" style={{ color: "#E8EAF0" }}>
                  {rel.actor}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                  {rel.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Key rule */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 p-4 rounded-xl flex items-start gap-3"
            style={{
              background: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.12)",
            }}
          >
            <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: CYAN }} />
            <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
              <span style={{ color: CYAN, fontFamily: "var(--font-mono)" }}>GC-04: </span>
              You manage Parzival only. Parzival manages all agents. You are never asked to
              directly interact with a BMAD agent.
            </p>
          </motion.div>
        </motion.div>

        {/* IS / IS NOT Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IS */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4" style={{ color: "#00FF88" }} />
                <h3
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "#00FF88", fontFamily: "var(--font-mono)" }}
                >
                  What Parzival Is
                </h3>
              </div>
              <div className="space-y-3">
                {isItems.map((item) => (
                  <div
                    key={item.gc}
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(0,255,136,0.03)",
                      border: "1px solid rgba(0,255,136,0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            item.severity === "CRITICAL"
                              ? "rgba(255,68,68,0.15)"
                              : "rgba(245,158,11,0.12)",
                          color: item.color,
                        }}
                      >
                        {item.gc}
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#E8EAF0" }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* IS NOT */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ban className="w-4 h-4" style={{ color: CRITICAL }} />
                <h3
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: CRITICAL, fontFamily: "var(--font-mono)" }}
                >
                  What Parzival Is Not
                </h3>
              </div>
              <div className="space-y-3">
                {isNotItems.map((item) => (
                  <div
                    key={item.gc}
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(255,68,68,0.03)",
                      border: "1px solid rgba(255,68,68,0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            item.severity === "CRITICAL"
                              ? "rgba(255,68,68,0.15)"
                              : "rgba(96,165,250,0.12)",
                          color: item.color,
                        }}
                      >
                        {item.gc}
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#E8EAF0" }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modes Preview Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10"
        >
          <div
            className="p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4"
            style={{
              background: "rgba(15,20,50,0.6)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              <Compass className="w-4 h-4" style={{ color: VIOLET }} />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: VIOLET, fontFamily: "var(--font-mono)" }}
              >
                Three Operating Modes
              </span>
            </div>

            <div className="flex-1 h-px sm:w-px sm:h-8 bg-gradient-to-r sm:bg-gradient-to-b from-violet-500/30 to-transparent sm:from-violet-500/30" />

            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Mode 1",
                  name: "Project Governance",
                  note: "Always active",
                  color: CYAN,
                },
                {
                  label: "Mode 2",
                  name: "Documentation & Oversight",
                  note: "Always active",
                  color: "#00FF88",
                },
                {
                  label: "Mode 3",
                  name: "Team Orchestration",
                  note: "Phase 4+ only",
                  color: HIGH,
                },
              ].map((mode) => (
                <div
                  key={mode.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: `${mode.color}08`,
                    border: `1px solid ${mode.color}20`,
                  }}
                >
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: mode.color }}
                  >
                    {mode.label}
                  </span>
                  <span className="text-xs" style={{ color: "#7A8AAA" }}>
                    {mode.name}
                  </span>
                  {mode.note === "Phase 4+ only" && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background: "rgba(245,158,11,0.12)",
                        color: HIGH,
                      }}
                    >
                      {mode.note}
                    </span>
                  )}
                  {mode.note === "Always active" && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background: `${mode.color}10`,
                        color: mode.color,
                      }}
                    >
                      {mode.note}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <a
              href="#modes"
              className="flex items-center gap-1 text-xs font-mono font-medium ml-auto flex-shrink-0"
              style={{ color: VIOLET }}
            >
              Explore
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
