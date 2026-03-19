"use client";

import { motion } from "framer-motion";
import { FileCode2 } from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const MAGENTA = "#FF2D6A";
const RED = "#FF4444";

// ─── Specification Items ────────────────────────────────────────────────

const specItems = [
  {
    label: "WORKFLOWS",
    value: "21",
    description: "Phase, session, and cycle workflows with strict step chains",
    color: VIOLET,
  },
  {
    label: "STEP FILES",
    value: "118",
    description: "Individual workflow steps enforcing sequential execution",
    color: CYAN,
  },
  {
    label: "CONSTRAINTS",
    value: "79",
    description: "Behavioral rules — global (20) + phase-specific (59)",
    color: GREEN,
  },
  {
    label: "CONSTRAINT FILES",
    value: "9",
    description: "Index files organizing constraints by lifecycle phase",
    color: CYAN,
  },
  {
    label: "AGENT ROLES",
    value: "6",
    description: "BMAD agent types — Analyst, PM, Architect, DEV, SM, UX",
    color: AMBER,
  },
  {
    label: "SKILLS",
    value: "7",
    description: "Skill directories — bootstrap, constraints, dispatch, lifecycle",
    color: MAGENTA,
  },
  {
    label: "TEMPLATES",
    value: "25",
    description: "7 POV templates + 18 oversight document templates",
    color: GREEN,
  },
  {
    label: "DATA FILES",
    value: "7",
    description: "Confidence, complexity, escalation, classification, maintenance",
    color: VIOLET,
  },
  {
    label: "ACTIVATION STEPS",
    value: "9",
    description: "Strict-order boot sequence with 2 hard STOP gates",
    color: RED,
  },
  {
    label: "VERIFICATION SECTIONS",
    value: "13",
    description: "POV modification checklist — step chains, isolation, sync",
    color: AMBER,
  },
  {
    label: "MENU COMMANDS",
    value: "15",
    description: "User-facing command codes — fuzzy match, never reordered",
    color: CYAN,
  },
  {
    label: "LIFECYCLE PHASES",
    value: "7",
    description: "Discovery, Architecture, Planning, Execution, Integration, Release, Maintenance",
    color: MAGENTA,
  },
];

// ─── Main Component ──────────────────────────────────────────────────────

export function ParzivalSpecs() {
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
              <FileCode2 className="w-3.5 h-3.5" />
              Technical Specifications
            </div>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-orbitron)", color: "#E8EAF0" }}
          >
            TECHNICAL{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SPECIFICATIONS
            </span>
          </h2>
          <p
            className="text-sm max-w-xl leading-relaxed"
            style={{ color: "#7A8AAA" }}
          >
            Complete structural inventory of the Parzival POV module. Every file,
            constraint, and workflow quantified.
          </p>
        </motion.div>

        {/* System Profile Header */}
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
              borderLeft: `3px solid ${VIOLET}`,
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
              SYSTEM PROFILE
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
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: VIOLET,
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              SYSTEM PROFILE — PARZIVAL v2.0
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
                fontSize: 10,
                color: "#7A8AAA",
                letterSpacing: "0.04em",
              }}
            >
              BUILD:{" "}
              <span style={{ color: CYAN }}>2025.01</span>
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
                fontSize: 10,
                color: "#7A8AAA",
                letterSpacing: "0.04em",
              }}
            >
              ARCH:{" "}
              <span style={{ color: CYAN }}>BMAD-POV</span>
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
                fontSize: 10,
                color: "#7A8AAA",
                letterSpacing: "0.04em",
              }}
            >
              RUNTIME:{" "}
              <span style={{ color: CYAN }}>CLAUDE CODE</span>
            </span>
          </div>
        </motion.div>

        {/* Spec Grid — 2 cols mobile, 3 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(139,92,246,0.08)", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(139,92,246,0.15)" }}>
          {specItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              style={{
                background: "rgba(10,13,30,0.92)",
                padding: "16px 14px",
              }}
            >
              {/* Spec name */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "#7A8AAA",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>

              {/* Large value */}
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 32,
                  fontWeight: 800,
                  color: item.color,
                  lineHeight: 1.1,
                  marginBottom: 6,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.value}
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 10,
                  color: "#7A8AAA",
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
