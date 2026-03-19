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

/* ── Animation Variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Color Tokens ───────────────────────────────────────────── */
const CRITICAL = "#FF4444";
const HIGH = "#F59E0B";
const MEDIUM = "#60A5FA";
const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";

/* ── Data ───────────────────────────────────────────────────── */
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
    color: GREEN,
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

/* ── Inline SVG: Parzival Robot Avatar ──────────────────────── */
function ParzivalAvatar() {
  return (
    <div className="flex justify-center mb-8">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="parzival-avatar"
      >
        <style>{`
          @keyframes eye-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes circuit-dot-left {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          @keyframes circuit-dot-right {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          @keyframes circuit-dot-down {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          .eye-left, .eye-right {
            animation: eye-pulse 2.4s ease-in-out infinite;
          }
          .eye-right {
            animation-delay: 0.3s;
          }
          .avatar-circuit-dot-1 {
            offset-path: path('M 60 78 L 60 110');
            animation: circuit-dot-down 3s ease-in-out infinite;
          }
          .avatar-circuit-dot-2 {
            offset-path: path('M 30 60 L 4 60');
            animation: circuit-dot-left 2.5s ease-in-out infinite 0.5s;
          }
          .avatar-circuit-dot-3 {
            offset-path: path('M 90 60 L 116 60');
            animation: circuit-dot-right 2.5s ease-in-out infinite 1s;
          }
        `}</style>

        {/* Hexagonal face outline */}
        <polygon
          points="60,12 96,32 96,72 60,92 24,72 24,32"
          stroke="#8B5CF6"
          strokeWidth="2"
          fill="rgba(139,92,246,0.05)"
          strokeLinejoin="round"
        />
        {/* Inner hexagonal accent */}
        <polygon
          points="60,22 86,38 86,66 60,82 34,66 34,38"
          stroke="#8B5CF6"
          strokeWidth="0.8"
          fill="none"
          opacity="0.3"
          strokeLinejoin="round"
        />

        {/* Left eye */}
        <rect
          className="eye-left"
          x="40"
          y="44"
          width="12"
          height="6"
          rx="2"
          fill="#00F5FF"
          filter="url(#eyeGlow)"
        />
        {/* Right eye */}
        <rect
          className="eye-right"
          x="68"
          y="44"
          width="12"
          height="6"
          rx="2"
          fill="#00F5FF"
          filter="url(#eyeGlow)"
        />

        {/* Mouth / status bar */}
        <rect x="48" y="62" width="24" height="2" rx="1" fill="#8B5CF6" opacity="0.6" />
        <rect x="52" y="66" width="16" height="1.5" rx="0.75" fill="#8B5CF6" opacity="0.3" />

        {/* Circuit traces - downward */}
        <line x1="60" y1="78" x2="60" y2="110" stroke="#8B5CF6" strokeWidth="1" opacity="0.25" />
        {/* Circuit traces - left */}
        <line x1="30" y1="60" x2="4" y2="60" stroke="#8B5CF6" strokeWidth="1" opacity="0.25" />
        {/* Circuit traces - right */}
        <line x1="90" y1="60" x2="116" y2="60" stroke="#8B5CF6" strokeWidth="1" opacity="0.25" />

        {/* Small dots at trace endpoints */}
        <circle cx="60" cy="110" r="2" fill="#8B5CF6" opacity="0.4" />
        <circle cx="4" cy="60" r="2" fill="#8B5CF6" opacity="0.4" />
        <circle cx="116" cy="60" r="2" fill="#8B5CF6" opacity="0.4" />

        {/* Traveling dots on circuits */}
        <circle className="avatar-circuit-dot-1" r="2" fill="#00F5FF" />
        <circle className="avatar-circuit-dot-2" r="2" fill="#00F5FF" />
        <circle className="avatar-circuit-dot-3" r="2" fill="#00F5FF" />

        {/* Glow filter for eyes */}
        <defs>
          <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/* ── Blinking Cursor ────────────────────────────────────────── */
function BlinkingCursor() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 14,
        background: VIOLET,
        marginLeft: 4,
        verticalAlign: "middle",
        animation: "cursor-blink 1s step-end infinite",
      }}
    >
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

/* ── Node-Flow Relationship Diagram ─────────────────────────── */
function RelationshipFlowDiagram() {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-5">
        <Lightbulb className="w-4 h-4" style={{ color: CYAN }} />
        <h2
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: CYAN, fontFamily: "var(--font-mono)" }}
        >
          Relationship Model
        </h2>
      </div>

      {/* Desktop: horizontal flow */}
      <div className="hidden sm:flex items-center justify-center gap-0">
        {relationships.map((rel, i) => {
          const isNavigator = rel.role === "Navigator";
          return (
            <div key={rel.role} className="flex items-center">
              {/* Node card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: isNavigator ? 1.08 : 1 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="terminal-panel relative"
                style={{
                  padding: "20px 18px",
                  minWidth: isNavigator ? 200 : 170,
                  zIndex: isNavigator ? 10 : 1,
                  borderColor: `${rel.color}33`,
                  boxShadow: isNavigator
                    ? `0 16px 48px rgba(0,0,0,0.4), 0 0 60px ${rel.color}15, 0 0 30px ${rel.color}10`
                    : undefined,
                }}
              >
                {/* Terminal header bar label */}
                <div
                  className="absolute top-0 left-0 right-0 h-6 flex items-center px-2 text-[9px] font-mono tracking-wider"
                  style={{ color: `${rel.color}88`, zIndex: 2 }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ background: rel.color }}
                  />
                  NODE_{String(i).padStart(2, "0")}
                </div>

                <div className="pt-4 relative" style={{ zIndex: 2 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center"
                      style={{
                        background: `${rel.color}12`,
                        border: `1px solid ${rel.color}30`,
                      }}
                    >
                      <rel.icon className="w-4 h-4" style={{ color: rel.color }} />
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{
                        background: `${rel.color}12`,
                        border: `1px solid ${rel.color}25`,
                        color: rel.color,
                      }}
                    >
                      {rel.badge}
                    </span>
                  </div>

                  <div
                    className="text-sm font-bold mb-0.5"
                    style={{ color: rel.color, fontFamily: "var(--font-orbitron)" }}
                  >
                    {rel.role}
                  </div>
                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: "#E8EAF0" }}
                  >
                    {rel.actor}
                  </div>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: "#7A8AAA" }}
                  >
                    {rel.description}
                  </p>
                </div>
              </motion.div>

              {/* Connection line + animated dot (except after last node) */}
              {i < relationships.length - 1 && (
                <div className="relative flex items-center" style={{ width: 64 }}>
                  <svg
                    width="64"
                    height="24"
                    viewBox="0 0 64 24"
                    fill="none"
                    className="overflow-visible"
                  >
                    <style>{`
                      @keyframes flow-dot-${i} {
                        0% { offset-distance: 0%; opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { offset-distance: 100%; opacity: 0; }
                      }
                      .flow-dot-${i} {
                        offset-path: path('M 0 12 L 64 12');
                        animation: flow-dot-${i} 2s ease-in-out infinite ${i * 0.6}s;
                      }
                    `}</style>
                    {/* Line */}
                    <line
                      x1="0"
                      y1="12"
                      x2="64"
                      y2="12"
                      stroke={VIOLET}
                      strokeWidth="1"
                      opacity="0.3"
                      strokeDasharray="4 3"
                    />
                    {/* Arrow head */}
                    <polygon
                      points="58,8 64,12 58,16"
                      fill={VIOLET}
                      opacity="0.5"
                    />
                    {/* Traveling dot */}
                    <circle className={`flow-dot-${i}`} r="3" fill={CYAN} />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical flow */}
      <div className="sm:hidden flex flex-col items-center gap-0">
        {relationships.map((rel, i) => {
          const isNavigator = rel.role === "Navigator";
          return (
            <div key={rel.role} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="terminal-panel relative w-full max-w-[280px]"
                style={{
                  padding: "20px 16px",
                  borderColor: `${rel.color}33`,
                  transform: isNavigator ? "scale(1.04)" : undefined,
                  boxShadow: isNavigator
                    ? `0 16px 48px rgba(0,0,0,0.4), 0 0 40px ${rel.color}12`
                    : undefined,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-6 flex items-center px-2 text-[9px] font-mono tracking-wider"
                  style={{ color: `${rel.color}88`, zIndex: 2 }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ background: rel.color }}
                  />
                  NODE_{String(i).padStart(2, "0")}
                </div>

                <div className="pt-4 relative" style={{ zIndex: 2 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center"
                      style={{
                        background: `${rel.color}12`,
                        border: `1px solid ${rel.color}30`,
                      }}
                    >
                      <rel.icon className="w-4 h-4" style={{ color: rel.color }} />
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{
                        background: `${rel.color}12`,
                        border: `1px solid ${rel.color}25`,
                        color: rel.color,
                      }}
                    >
                      {rel.badge}
                    </span>
                  </div>
                  <div
                    className="text-sm font-bold mb-0.5"
                    style={{ color: rel.color, fontFamily: "var(--font-orbitron)" }}
                  >
                    {rel.role}
                  </div>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#E8EAF0" }}>
                    {rel.actor}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#7A8AAA" }}>
                    {rel.description}
                  </p>
                </div>
              </motion.div>

              {/* Vertical connector */}
              {i < relationships.length - 1 && (
                <div className="relative" style={{ height: 40, width: 2 }}>
                  <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="overflow-visible" style={{ position: "absolute", left: -11 }}>
                    <style>{`
                      @keyframes vflow-dot-${i} {
                        0% { offset-distance: 0%; opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { offset-distance: 100%; opacity: 0; }
                      }
                      .vflow-dot-${i} {
                        offset-path: path('M 12 0 L 12 40');
                        animation: vflow-dot-${i} 2s ease-in-out infinite ${i * 0.6}s;
                      }
                    `}</style>
                    <line x1="12" y1="0" x2="12" y2="40" stroke={VIOLET} strokeWidth="1" opacity="0.3" strokeDasharray="4 3" />
                    <polygon points="8,34 12,40 16,34" fill={VIOLET} opacity="0.5" />
                    <circle className={`vflow-dot-${i}`} r="3" fill={CYAN} />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key rule callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 terminal-panel relative"
        style={{ padding: "14px 16px" }}
      >
        <div className="relative flex items-start gap-3" style={{ zIndex: 2 }}>
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: CYAN }} />
          <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
            <span style={{ color: CYAN, fontFamily: "var(--font-mono)" }}>GC-04: </span>
            You manage Parzival only. Parzival manages all agents. You are never asked to
            directly interact with a BMAD agent.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Diagnostic IS / IS NOT Panels ──────────────────────────── */
function DiagnosticPanels() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* IS Panel — Green tinted */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative rounded overflow-hidden"
        style={{
          background: "rgba(10,13,30,0.92)",
          border: "1px solid rgba(0,255,136,0.18)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4), 0 0 40px rgba(0,255,136,0.03)",
        }}
      >
        {/* Green scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,255,136,0.015) 3px, rgba(0,255,136,0.015) 6px)",
            zIndex: 1,
          }}
        />

        {/* Header bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: "rgba(0,255,136,0.06)",
            borderBottom: "1px solid rgba(0,255,136,0.12)",
            borderLeft: "3px solid rgba(0,255,136,0.5)",
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: GREEN, fontFamily: "var(--font-mono)" }}
          >
            Verified Behaviors
          </span>
          <ShieldCheck className="w-3.5 h-3.5 ml-auto" style={{ color: GREEN, opacity: 0.6 }} />
        </div>

        {/* Items */}
        <div className="p-4 space-y-3 relative" style={{ zIndex: 2 }}>
          {isItems.map((item, i) => (
            <motion.div
              key={item.gc}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="p-3 rounded"
              style={{
                background: "rgba(0,255,136,0.03)",
                border: "1px solid rgba(0,255,136,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className="text-[10px] font-mono font-bold tracking-wider"
                  style={{ color: GREEN }}
                >
                  [VERIFIED]
                </span>
                <span
                  className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
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
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.severity}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#E8EAF0" }}
                >
                  {item.title}
                </span>
              </div>
              <p
                className="text-[11px] leading-relaxed pl-0"
                style={{ color: "#7A8AAA" }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* IS NOT Panel — Red tinted */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative rounded overflow-hidden"
        style={{
          background: "rgba(10,13,30,0.92)",
          border: "1px solid rgba(255,68,68,0.18)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4), 0 0 40px rgba(255,68,68,0.03)",
        }}
      >
        {/* Red scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,68,68,0.012) 3px, rgba(255,68,68,0.012) 6px)",
            zIndex: 1,
          }}
        />

        {/* Header bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: "rgba(255,68,68,0.06)",
            borderBottom: "1px solid rgba(255,68,68,0.12)",
            borderLeft: "3px solid rgba(255,68,68,0.5)",
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: CRITICAL, boxShadow: `0 0 6px ${CRITICAL}` }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: CRITICAL, fontFamily: "var(--font-mono)" }}
          >
            Blocked Behaviors
          </span>
          <Ban className="w-3.5 h-3.5 ml-auto" style={{ color: CRITICAL, opacity: 0.6 }} />
        </div>

        {/* Items */}
        <div className="p-4 space-y-3 relative" style={{ zIndex: 2 }}>
          {isNotItems.map((item, i) => (
            <motion.div
              key={item.gc}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="p-3 rounded"
              style={{
                background: "rgba(255,68,68,0.03)",
                border: "1px solid rgba(255,68,68,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className="text-[10px] font-mono font-bold tracking-wider"
                  style={{ color: CRITICAL }}
                >
                  [BLOCKED]
                </span>
                <span
                  className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
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
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.severity}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#E8EAF0" }}
                >
                  {item.title}
                </span>
              </div>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "#7A8AAA" }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Export ─────────────────────────────────────────────── */
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

        {/* ── Parzival SVG Avatar ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          <ParzivalAvatar />
        </motion.div>

        {/* ── Identity Statement + Terminal Subtitle ── */}
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
            className="font-orbitron font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 leading-[1.1]"
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

          {/* Terminal-style subtitle */}
          <div
            className="mb-5 text-xs sm:text-sm tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "#7A8AAA" }}
          >
            <span style={{ color: VIOLET }}>[UNIT: PARZIVAL]</span>{" "}
            <span style={{ color: CYAN }}>[CLASS: NAVIGATOR]</span>{" "}
            <span style={{ color: GREEN }}>[STATUS: ONLINE]</span>
            <BlinkingCursor />
          </div>

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

        {/* ── Relationship Flow Diagram ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RelationshipFlowDiagram />
        </motion.div>

        {/* ── Diagnostic IS / IS NOT Panels ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <DiagnosticPanels />
        </motion.div>

        {/* ── Modes Preview Ticker ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10"
        >
          <div
            className="terminal-panel relative overflow-hidden"
            style={{ padding: 0 }}
          >
            {/* Thin top bar label */}
            <div
              className="flex items-center gap-2 px-4 py-2"
              style={{
                background: "rgba(139,92,246,0.06)",
                borderBottom: "1px solid rgba(139,92,246,0.12)",
                borderLeft: "3px solid rgba(139,92,246,0.5)",
                zIndex: 2,
                position: "relative",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: VIOLET }}
              />
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: VIOLET, fontFamily: "var(--font-mono)" }}
              >
                Mode Configuration
              </span>
            </div>

            {/* Content */}
            <div
              className="relative p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ zIndex: 2 }}
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
                    color: GREEN,
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded"
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
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background:
                          mode.note === "Phase 4+ only"
                            ? "rgba(245,158,11,0.12)"
                            : `${mode.color}10`,
                        color:
                          mode.note === "Phase 4+ only" ? HIGH : mode.color,
                      }}
                    >
                      {mode.note}
                    </span>
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
