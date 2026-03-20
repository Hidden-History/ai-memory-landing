"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BarChart3 } from "lucide-react";
import {
  AnimatedSection,
  slideFromLeft,
} from "@/components/shared/animated-section";

/* ── Colors ─────────────────────────────────────────── */

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";
const AMBER = "#FFB800";
const MAGENTA = "#FF2D6A";
const RED = "#EF4444";

/* ── Tab key ────────────────────────────────────────── */

type TabKey = "hook" | "service";

/* ── Node definitions ───────────────────────────────── */

interface FlowNode {
  label: string;
  color: string;
  subtitle: string;
}

const hookNodes: FlowNode[] = [
  { label: "emit_trace_event()", color: CYAN, subtitle: "Hook scripts" },
  { label: "JSON Buffer", color: VIOLET, subtitle: "Temporary storage" },
  { label: "trace_flush_worker", color: GREEN, subtitle: "Background worker" },
  { label: "OTel", color: AMBER, subtitle: "OpenTelemetry" },
  { label: "Langfuse", color: MAGENTA, subtitle: "Dashboard" },
];

const serviceNodes: FlowNode[] = [
  { label: "get_client()", color: CYAN, subtitle: "Direct SDK" },
  { label: "OTel", color: AMBER, subtitle: "OpenTelemetry" },
  { label: "Langfuse", color: MAGENTA, subtitle: "Dashboard" },
];

/* ── Config badges ──────────────────────────────────── */

const badges = [
  { label: "V3 SDK Only", color: RED, critical: true },
  { label: "OTel Attributes", color: CYAN, critical: false },
  { label: "10K char max", color: AMBER, critical: false },
  { label: "flush() in hooks", color: GREEN, critical: false },
];

/* ── Logo strip ─────────────────────────────────────── */

const logos = [
  { src: "/logos/langfuse.png", name: "Langfuse" },
  { src: "/logos/prometheus.png", name: "Prometheus" },
  { src: "/logos/grafana.png", name: "Grafana" },
];

/* ── Arrow connector ────────────────────────────────── */

function Arrow() {
  return (
    <div className="flex items-center justify-center flex-shrink-0 px-1">
      <svg
        width="28"
        height="12"
        viewBox="0 0 28 12"
        fill="none"
        className="opacity-40"
      >
        <line x1="0" y1="6" x2="22" y2="6" stroke={CYAN} strokeWidth="1.5" />
        <polyline
          points="20,2 26,6 20,10"
          stroke={CYAN}
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ── Flow node card ─────────────────────────────────── */

function NodeCard({ node, index }: { node: FlowNode; index: number }) {
  return (
    <motion.div
      variants={slideFromLeft}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex-shrink-0 relative rounded-xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
        border: `1px solid ${node.color}20`,
        borderTop: `3px solid ${node.color}`,
        minWidth: 120,
      }}
    >
      <div className="px-3 py-3 text-center">
        <div
          className="text-[11px] font-semibold mb-1 whitespace-nowrap"
          style={{ fontFamily: "var(--font-mono)", color: node.color }}
        >
          {node.label}
        </div>
        <div
          className="text-[9px] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
        >
          {node.subtitle}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Flow panel ─────────────────────────────────────── */

function FlowPanel({ nodes }: { nodes: FlowNode[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center justify-center flex-wrap gap-y-3 py-8 px-4 overflow-x-auto"
    >
      {nodes.map((node, i) => (
        <div key={node.label} className="flex items-center">
          <NodeCard node={node} index={i} />
          {i < nodes.length - 1 && <Arrow />}
        </div>
      ))}
    </motion.div>
  );
}

/* ── Panel animation variants ───────────────────────── */

const panelVariants = {
  enter: { opacity: 0, y: 12, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
};

/* ── Main component ─────────────────────────────────── */

export function Observability() {
  const [activeTab, setActiveTab] = useState<TabKey>("hook");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "hook", label: "Hook Path" },
    { key: "service", label: "Service Path" },
  ];

  return (
    <section id="observability" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8">
            <BarChart3 className="w-3.5 h-3.5" />
            Observability
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Full Pipeline{" "}
            <span className="gradient-text-animated">Visibility</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Langfuse V3 SDK integration traces every capture, retrieval, and
            injection. Two integration paths cover hooks and services.
          </p>
        </AnimatedSection>

        {/* Tab navigation */}
        <AnimatedSection delay={0.1}>
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex items-center gap-1 p-1.5 rounded-2xl relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                border: "1px solid rgba(0,245,255,0.1)",
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer z-10"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: isActive ? "#E8EAF0" : "#5A6480",
                    }}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="obs-tab-indicator"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "rgba(0,245,255,0.06)",
                          border: "1px solid rgba(0,245,255,0.15)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Tab content */}
        <AnimatedSection delay={0.2}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(8,10,28,0.98) 0%, rgba(5,7,20,0.99) 100%)",
              border: "1px solid rgba(0,245,255,0.1)",
              boxShadow:
                "0 0 0 1px rgba(0,245,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.7), 0 0 100px rgba(0,245,255,0.05)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {activeTab === "hook" && <FlowPanel nodes={hookNodes} />}
                {activeTab === "service" && <FlowPanel nodes={serviceNodes} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </AnimatedSection>

        {/* Config badges */}
        <AnimatedSection delay={0.3} className="mt-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: `${badge.color}08`,
                  border: `1px solid ${badge.color}30`,
                  color: badge.color,
                  boxShadow: badge.critical
                    ? `0 0 12px ${badge.color}15`
                    : "none",
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: badge.color }}
                />
                {badge.label}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Logo strip */}
        <AnimatedSection delay={0.4} className="mt-14">
          <div className="flex items-center justify-center gap-10">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                    style={{
                      filter:
                        "brightness(0) invert(1) opacity(0.7)",
                    }}
                  />
                </div>
                <span
                  className="text-[9px] uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
                >
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
