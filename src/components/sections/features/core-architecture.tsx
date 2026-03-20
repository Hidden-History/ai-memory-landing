"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import {
  AnimatedSection,
  fadeUp,
  stagger,
} from "@/components/shared/animated-section";

/* ─── Flow Diagram Nodes ──────────────────────────────────────── */

const flowNodes = [
  { id: "input", label: "Input", color: "#FFB800" },
  { id: "security", label: "Security", color: "#00FF88" },
  { id: "embedding", label: "Embedding", color: "#8B5CF6" },
  { id: "collections", label: "Collections", color: "#00F5FF" },
  { id: "output", label: "Output", color: "#FF2D6A" },
];

/* ─── Collection Cards ────────────────────────────────────────── */

interface CollectionCard {
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  items: string[];
}

const collections: CollectionCard[] = [
  {
    tag: "HOW",
    tagColor: "#00F5FF",
    title: "code-patterns",
    description:
      "Implementation patterns, code snippets, and reusable solutions extracted from your codebase.",
    items: [
      "Function signatures",
      "Design patterns",
      "API usage examples",
      "Error handling",
    ],
  },
  {
    tag: "WHAT",
    tagColor: "#8B5CF6",
    title: "conventions",
    description:
      "Team standards, naming conventions, and architectural decisions that define how your project works.",
    items: [
      "Naming conventions",
      "File structure",
      "Code style rules",
      "Architecture decisions",
    ],
  },
  {
    tag: "WHY",
    tagColor: "#FF2D6A",
    title: "discussions",
    description:
      "Context from PR reviews, design discussions, and decision rationales that explain the reasoning.",
    items: [
      "PR review context",
      "Design rationale",
      "Trade-off analysis",
      "Historical context",
    ],
  },
];

/* ─── Trigger Badges ──────────────────────────────────────────── */

const triggers = [
  { label: "Session Start", color: "#00F5FF" },
  { label: "File Change", color: "#8B5CF6" },
  { label: "Error Signal", color: "#FF2D6A" },
  { label: "PR Review", color: "#00FF88" },
  { label: "Context Shift", color: "#FFB800" },
  { label: "Direct Query", color: "#22D3EE" },
];

/* ─── Logo Strip ──────────────────────────────────────────────── */

const logos = [
  { src: "/logos/qdrant.png", alt: "Qdrant" },
  { src: "/logos/python.png", alt: "Python" },
  { src: "/logos/docker.png", alt: "Docker" },
];

/* ─── Animated Flow Diagram ───────────────────────────────────── */

function FlowDiagram() {
  const nodeWidth = 120;
  const nodeHeight = 48;
  const svgWidth = 900;
  const svgHeight = 100;
  const nodeY = 26;
  const spacing = svgWidth / flowNodes.length;

  return (
    <div className="relative w-full mb-16">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* Animated dot marker */}
          <filter id="flow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines between nodes */}
        {flowNodes.slice(0, -1).map((node, i) => {
          const x1 = spacing * i + spacing / 2 + nodeWidth / 2 - 10;
          const x2 = spacing * (i + 1) + spacing / 2 - nodeWidth / 2 + 10;
          const pathD = `M ${x1},${nodeY} L ${x2},${nodeY}`;

          return (
            <g key={`conn-${node.id}`}>
              <path
                d={pathD}
                stroke="rgba(0,245,255,0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              {/* Animated traveling dot */}
              <circle
                r="3"
                fill={flowNodes[i + 1].color}
                filter="url(#flow-glow)"
                opacity="0.8"
              >
                <animateMotion
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={pathD}
                  begin={`${i * 0.6}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* Nodes */}
        {flowNodes.map((node, i) => {
          const cx = spacing * i + spacing / 2;
          return (
            <g key={node.id}>
              <rect
                x={cx - nodeWidth / 2}
                y={nodeY - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx="12"
                fill="rgba(15,20,50,0.9)"
                stroke={`${node.color}40`}
                strokeWidth="1"
              />
              {/* Top accent */}
              <line
                x1={cx - nodeWidth / 2 + 12}
                y1={nodeY - nodeHeight / 2}
                x2={cx + nodeWidth / 2 - 12}
                y2={nodeY - nodeHeight / 2}
                stroke={node.color}
                strokeWidth="2"
                opacity="0.6"
              />
              {/* Dot indicator */}
              <circle
                cx={cx - nodeWidth / 2 + 16}
                cy={nodeY}
                r="4"
                fill={node.color}
                opacity="0.8"
              />
              {/* Label */}
              <text
                x={cx + 6}
                y={nodeY + 4}
                textAnchor="middle"
                fill="#E8EAF0"
                fontSize="13"
                fontFamily="var(--font-heading)"
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Core Architecture Section ────────────────────────────────── */

export function CoreArchitecture() {
  return (
    <section
      id="architecture"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8 mx-auto inline-flex">
            <Layers className="w-3.5 h-3.5" />
            System Architecture
          </div>

          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Signal-Triggered{" "}
            <span className="gradient-text-animated">Retrieval</span>
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Instead of random memory injection at session start, AI Memory uses
            signal-triggered retrieval — memory surfaces when it&apos;s relevant,
            not when it&apos;s present.
          </p>
        </AnimatedSection>

        {/* Flow diagram */}
        <AnimatedSection delay={0.1}>
          <FlowDiagram />
        </AnimatedSection>

        {/* Collection cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
        >
          {collections.map((col) => (
            <motion.div
              key={col.tag}
              variants={fadeUp}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative p-6 rounded-2xl cursor-default group transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
                border: `1px solid ${col.tagColor}15`,
                borderLeft: `3px solid ${col.tagColor}60`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${col.tagColor}40`;
                e.currentTarget.style.borderLeftColor = col.tagColor;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 40px ${col.tagColor}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${col.tagColor}15`;
                e.currentTarget.style.borderLeftColor = `${col.tagColor}60`;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Tag badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest mb-4"
                style={{
                  background: `${col.tagColor}10`,
                  border: `1px solid ${col.tagColor}25`,
                  color: col.tagColor,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: col.tagColor }}
                />
                {col.tag}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#E8EAF0",
                }}
              >
                {col.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
              >
                {col.description}
              </p>

              {/* Memory type list */}
              <ul className="space-y-1.5">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs"
                    style={{
                      color: "#5A6480",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: col.tagColor, opacity: 0.6 }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Trigger badges */}
        <AnimatedSection delay={0.2} className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {triggers.map((trigger) => (
              <span
                key={trigger.label}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-default"
                style={{
                  background: `${trigger.color}08`,
                  border: `1px solid ${trigger.color}20`,
                  color: "#7A8AAA",
                  fontFamily: "var(--font-mono)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${trigger.color}50`;
                  e.currentTarget.style.color = trigger.color;
                  e.currentTarget.style.background = `${trigger.color}12`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${trigger.color}20`;
                  e.currentTarget.style.color = "#7A8AAA";
                  e.currentTarget.style.background = `${trigger.color}08`;
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: trigger.color }}
                />
                {trigger.label}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* Logo strip */}
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6 mt-10 opacity-40 hover:opacity-70 transition-opacity">
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "#3A4560" }}
            >
              Powered by
            </span>
            {logos.map((l) => (
              <img
                key={l.alt}
                src={l.src}
                alt={l.alt}
                className="h-6 w-auto grayscale"
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
