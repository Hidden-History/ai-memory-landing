"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Zap,
  Shield,
  GitBranch,
  Database,
  Search,
  Brain,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

/* ─── Node Definitions ──────────────────────────────────────────── */
const nodes = [
  {
    id: "capture",
    label: "Capture",
    sub: "Hooks & Sync",
    icon: Zap,
    color: "#FFB800",
    tooltip: "Git hooks and file watchers detect memorable context automatically",
  },
  {
    id: "secure",
    label: "Secure",
    sub: "3-Layer Pipeline",
    icon: Shield,
    color: "#00FF88",
    tooltip: "Secrets scanning, PII redaction, and content validation in sequence",
  },
  {
    id: "embed",
    label: "Embed",
    sub: "Dual Model Routing",
    icon: GitBranch,
    color: "#8B5CF6",
    tooltip: "Routes to optimal embedding model based on content type and length",
  },
  {
    id: "store",
    label: "Store",
    sub: "5 Qdrant Collections",
    icon: Database,
    color: "#00F5FF",
    tooltip: "Vectors land in the right collection — code, conventions, discussions, github, or jira",
  },
  {
    id: "retrieve",
    label: "Retrieve",
    sub: "Signal-Triggered",
    icon: Search,
    color: "#FF2D6A",
    tooltip: "Semantic search activates on session start and context-shift signals",
  },
  {
    id: "deliver",
    label: "Deliver",
    sub: "Context Injection",
    icon: Brain,
    color: "#22D3EE",
    tooltip: "Progressive injection delivers memories within your token budget",
  },
];

/* ─── Stats ─────────────────────────────────────────────────────── */
const stats = [
  { value: "5", label: "Collections", color: "#00F5FF" },
  { value: "9", label: "Pipeline Steps", color: "#8B5CF6" },
  { value: "6", label: "Auto Triggers", color: "#FFB800" },
];

/* ─── SVG Path Builder ──────────────────────────────────────────── */
/* Builds curved connector paths for the S-curve layout.
   Desktop: 3-col x 2-row grid, flowing right on row 1, left on row 2.
   The SVG overlays the grid and paths connect node centers. */

function ConnectorPaths({
  hoveredNode,
}: {
  hoveredNode: string | null;
}) {
  /* Each segment connects consecutive node pairs.
     We define them as cubic bezier curves in a viewBox that
     overlays the grid. The viewBox is 900x400 to match the
     proportional layout of a 3-col x 2-row grid. */

  const segments = [
    // Row 1: node 0 → 1 → 2 (left to right)
    { from: 0, to: 1, d: "M 150,100 C 250,100 250,100 350,100" },
    { from: 1, to: 2, d: "M 450,100 C 550,100 550,100 650,100" },
    // S-curve down: node 2 → 3 (right side, drops to row 2)
    { from: 2, to: 3, d: "M 750,100 C 800,100 850,200 800,300 C 780,340 720,300 650,300" },
    // Row 2: node 3 → 4 → 5 (right to left)
    { from: 3, to: 4, d: "M 550,300 C 450,300 450,300 350,300" },
    { from: 4, to: 5, d: "M 250,300 C 150,300 150,300 50,300" },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
      viewBox="0 0 900 400"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Gradient for connection paths */}
        <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.6" />
        </linearGradient>

        {/* Brighter gradient for hovered paths */}
        <linearGradient id="path-gradient-bright" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="1" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00F5FF" stopOpacity="1" />
        </linearGradient>

        {/* Glow filter for data packets */}
        <filter id="packet-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection paths */}
      {segments.map((seg, i) => {
        const isAdjacentToHover =
          hoveredNode !== null &&
          (nodes[seg.from].id === hoveredNode || nodes[seg.to].id === hoveredNode);

        return (
          <g key={i}>
            {/* Base path (dim) */}
            <path
              d={seg.d}
              stroke={isAdjacentToHover ? "url(#path-gradient-bright)" : "url(#path-gradient)"}
              strokeWidth={isAdjacentToHover ? 2.5 : 1.5}
              strokeDasharray="6 4"
              opacity={isAdjacentToHover ? 1 : 0.4}
              style={{ transition: "all 0.3s ease" }}
            />

            {/* Animated data packet */}
            <circle
              r="3"
              fill="#00F5FF"
              filter="url(#packet-glow)"
              opacity="0.9"
            >
              <animateMotion
                dur={`${3 + i * 0.6}s`}
                repeatCount="indefinite"
                path={seg.d}
                begin={`${i * 0.8}s`}
              />
            </circle>

            {/* Second packet, offset */}
            <circle
              r="2"
              fill="#8B5CF6"
              filter="url(#packet-glow)"
              opacity="0.7"
            >
              <animateMotion
                dur={`${3.5 + i * 0.5}s`}
                repeatCount="indefinite"
                path={seg.d}
                begin={`${i * 0.8 + 1.5}s`}
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Mobile Connector (vertical) ───────────────────────────────── */
function MobileConnector({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div className="flex justify-center lg:hidden">
      <div className="relative h-10 w-px">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${fromColor}60, ${toColor}60)`,
          }}
        />
        {/* Animated dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full animate-packet-vertical"
          style={{
            background: "#00F5FF",
            boxShadow: "0 0 6px #00F5FF, 0 0 12px rgba(0,245,255,0.4)",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Flow Node Card ────────────────────────────────────────────── */
function FlowNode({
  node,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  node: (typeof nodes)[number];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const Icon = node.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className="relative p-5 rounded-2xl cursor-default transition-all duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
          border: `1px solid ${isHovered ? node.color + "60" : node.color + "18"}`,
          boxShadow: isHovered
            ? `0 0 40px ${node.color}18, 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${node.color}15 inset`
            : `0 0 0 1px ${node.color}08 inset`,
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        {/* Glowing top accent line */}
        <div
          className="absolute top-0 left-4 right-4 h-px rounded-full transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${node.color}, transparent)`,
            boxShadow: `0 0 10px ${node.color}40`,
            opacity: isHovered ? 1 : 0.4,
          }}
        />

        {/* Step number */}
        <div
          className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-mono)",
            background: isHovered ? node.color : `${node.color}25`,
            color: isHovered ? "#0A0D1A" : node.color,
            boxShadow: isHovered ? `0 0 12px ${node.color}50` : "none",
            transition: "all 0.3s ease",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
          style={{
            background: `${node.color}${isHovered ? "20" : "10"}`,
            border: `1px solid ${node.color}${isHovered ? "50" : "25"}`,
            boxShadow: isHovered
              ? `0 0 20px ${node.color}25 inset, 0 0 30px ${node.color}10`
              : `0 0 15px ${node.color}08 inset`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: node.color }} />
        </div>

        {/* Label */}
        <h4
          className="text-base font-semibold mb-0.5"
          style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
        >
          {node.label}
        </h4>

        {/* Sub label */}
        <p
          className="text-[11px] font-medium tracking-wide"
          style={{ fontFamily: "var(--font-mono)", color: node.color, opacity: 0.8 }}
        >
          {node.sub}
        </p>

        {/* Hover glow background */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${node.color}08 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Pulse ring when hovered (simulates data packet arrival) */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none animate-node-pulse"
            style={{
              border: `1px solid ${node.color}40`,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-20 px-4 py-2.5 rounded-xl text-xs leading-relaxed text-center max-w-[220px] pointer-events-none transition-all duration-300"
        style={{
          fontFamily: "var(--font-body)",
          color: "#E8EAF0",
          background: "rgba(10,13,35,0.95)",
          border: `1px solid ${node.color}30`,
          boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 20px ${node.color}10`,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-4px)",
        }}
      >
        {/* Tooltip arrow */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
          style={{
            background: "rgba(10,13,35,0.95)",
            borderTop: `1px solid ${node.color}30`,
            borderLeft: `1px solid ${node.color}30`,
          }}
        />
        {node.tooltip}
      </div>
    </motion.div>
  );
}

/* ─── System Overview Section ───────────────────────────────────── */
export function SystemOverview() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section id="architecture" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-25" />
      <div
        className="absolute top-[15%] right-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,45,106,0.03) 0%, transparent 55%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* ─── Section Header ───────────────────────────────────── */}
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            System Architecture
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            From Hook to{" "}
            <span className="gradient-text-animated">Context Injection</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Every memory flows through a security-first pipeline — captured,
            secured, embedded, stored, and delivered back as intelligent context.
          </p>
        </AnimatedSection>

        {/* ─── Flow Diagram ─────────────────────────────────────── */}
        <AnimatedSection delay={0.15}>
          <div className="relative">
            {/* SVG connector overlay (desktop only) */}
            <ConnectorPaths hoveredNode={hoveredNode} />

            {/* Desktop: 3-col x 2-row S-curve grid */}
            {/* Row 1: Capture → Secure → Embed (left to right) */}
            {/* Row 2: Deliver ← Retrieve ← Store (right to left, visually reversed) */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-x-16 gap-y-20">
              {/* Row 1 */}
              {nodes.slice(0, 3).map((node, i) => (
                <FlowNode
                  key={node.id}
                  node={node}
                  index={i}
                  isHovered={hoveredNode === node.id}
                  onHover={() => setHoveredNode(node.id)}
                  onLeave={() => setHoveredNode(null)}
                />
              ))}

              {/* Row 2: reversed order so the S-curve reads right-to-left */}
              {[...nodes.slice(3)].reverse().map((node, i) => {
                const originalIndex = nodes.indexOf(node);
                return (
                  <FlowNode
                    key={node.id}
                    node={node}
                    index={originalIndex}
                    isHovered={hoveredNode === node.id}
                    onHover={() => setHoveredNode(node.id)}
                    onLeave={() => setHoveredNode(null)}
                  />
                );
              })}
            </div>

            {/* Mobile/Tablet: vertical stack with connectors */}
            <div className="flex flex-col lg:hidden">
              {nodes.map((node, i) => (
                <div key={node.id}>
                  {i > 0 && (
                    <MobileConnector
                      fromColor={nodes[i - 1].color}
                      toColor={node.color}
                    />
                  )}
                  <FlowNode
                    node={node}
                    index={i}
                    isHovered={hoveredNode === node.id}
                    onHover={() => setHoveredNode(node.id)}
                    onLeave={() => setHoveredNode(null)}
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ─── Stat Row ─────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-3 gap-4 mt-20 max-w-2xl mx-auto"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="relative p-5 rounded-2xl text-center transition-all duration-300 group cursor-default"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                border: `1px solid ${stat.color}15`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${stat.color}40`;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 30px ${stat.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${stat.color}15`;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top glow */}
              <div
                className="absolute top-0 left-4 right-4 h-px rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)`,
                  opacity: 0.5,
                }}
              />
              <div
                className="text-3xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: stat.color,
                  textShadow: `0 0 20px ${stat.color}30`,
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs font-medium uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── CTA Link ─────────────────────────────────────────── */}
        <AnimatedSection delay={0.4}>
          <div className="text-center mt-14">
            <a
              href="/docs/architecture"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group"
              style={{
                fontFamily: "var(--font-body)",
                color: "#00F5FF",
                background: "rgba(0,245,255,0.06)",
                border: "1px solid rgba(0,245,255,0.2)",
                boxShadow: "0 0 20px rgba(0,245,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,245,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(0,245,255,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,245,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0,245,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Explore Full Architecture
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </AnimatedSection>
      </div>

    </section>
  );
}
