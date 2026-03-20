"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Zap } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

/* ── Signal card data ────────────────────────────────── */

interface SignalCard {
  label: string;
  weight: string;
  description: string;
  color: string;
}

const signals: SignalCard[] = [
  {
    label: "Quality Signal",
    weight: "50%",
    description: "Best retrieval score",
    color: "#00F5FF",
  },
  {
    label: "Density Signal",
    weight: "30%",
    description: "Proportion above threshold",
    color: "#8B5CF6",
  },
  {
    label: "Topic Drift",
    weight: "20%",
    description: "Cosine distance from previous",
    color: "#FF2D6A",
  },
];

/* ── Tag pills ───────────────────────────────────────── */

const bootstrapTags = ["conventions", "decisions", "agent context"];
const adaptiveTags = ["Quality 50%", "Density 30%", "Topic Drift 20%"];

/* ── Logo strip ──────────────────────────────────────── */

const logos = [
  { src: "/logos/claude.png", alt: "Claude" },
  { src: "/logos/pydantic.png", alt: "Pydantic" },
];

/* ── Budget Meter Bar ────────────────────────────────── */

function BudgetBar({
  label,
  tokenLabel,
  tags,
  gradient,
  delay,
  inView,
}: {
  label: string;
  tokenLabel: string;
  tags: string[];
  gradient: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <div className="space-y-2">
      {/* Labels row */}
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
        >
          {label}
        </span>
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "#7A8AAA" }}
        >
          {tokenLabel}
        </span>
      </div>

      {/* Bar container */}
      <div
        className="relative h-8 rounded-lg overflow-hidden"
        style={{
          background: "rgba(10,13,35,0.8)",
          border: "1px solid rgba(0,245,255,0.1)",
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg"
          style={{ background: gradient }}
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : { width: "0%" }}
          transition={{
            duration: 1.2,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px]"
            style={{
              fontFamily: "var(--font-mono)",
              background: "rgba(0,245,255,0.06)",
              border: "1px solid rgba(0,245,255,0.12)",
              color: "#7A8AAA",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Confidence Gate ─────────────────────────────────── */

function ConfidenceGate() {
  /* The marker sits at 0.6 along a 0-1 scale = 60% */
  const markerPos = 60;

  return (
    <div
      className="relative p-4 rounded-xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
        border: "1px solid rgba(0,245,255,0.1)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium"
          style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
        >
          Confidence Gate
        </span>
        <span
          className="text-[10px]"
          style={{ fontFamily: "var(--font-mono)", color: "#7A8AAA" }}
        >
          Skip injection if best_score &lt; 0.6
        </span>
      </div>

      {/* Bar with green/red zones */}
      <div className="relative h-3 rounded-full overflow-hidden">
        {/* Red zone (0 – 0.6) */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-full"
          style={{
            width: `${markerPos}%`,
            background:
              "linear-gradient(90deg, rgba(255,45,106,0.25), rgba(255,45,106,0.35))",
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase tracking-wider opacity-50 font-mono">Skip</span>
        </div>
        {/* Green zone (0.6 – 1.0) */}
        <div
          className="absolute inset-y-0 right-0 rounded-r-full"
          style={{
            width: `${100 - markerPos}%`,
            background:
              "linear-gradient(90deg, rgba(0,255,136,0.3), rgba(0,255,136,0.45))",
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase tracking-wider opacity-50 font-mono">Inject</span>
        </div>
        {/* Threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5"
          style={{
            left: `${markerPos}%`,
            background: "#E8EAF0",
            boxShadow: "0 0 6px rgba(232,234,240,0.5)",
          }}
        />
      </div>

      {/* Tick labels */}
      <div className="flex justify-between mt-1">
        <span
          className="text-[9px]"
          style={{ fontFamily: "var(--font-mono)", color: "#3A4560" }}
        >
          0.0
        </span>
        <span
          className="text-[9px]"
          style={{
            fontFamily: "var(--font-mono)",
            color: "#E8EAF0",
            marginLeft: `${markerPos - 5}%`,
            position: "absolute",
          }}
        >
          0.6
        </span>
        <span
          className="text-[9px]"
          style={{ fontFamily: "var(--font-mono)", color: "#3A4560" }}
        >
          1.0
        </span>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────── */

export function ContextInjection() {
  const barsRef = useRef(null);
  const barsInView = useInView(barsRef, { once: true, margin: "-60px" });

  return (
    <section id="injection" className="relative py-20 px-6">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.04) 0%, rgba(139,92,246,0.03) 50%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8">
            <Zap className="w-3.5 h-3.5" />
            Context Injection
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Right Memory,{" "}
            <span className="gradient-text-animated">Right Time</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Two-tier progressive injection delivers exactly the context agents
            need — bootstrap at session start, adaptive on every turn.
          </p>
        </AnimatedSection>

        {/* Budget meter animation */}
        <AnimatedSection delay={0.15}>
          <div ref={barsRef} className="space-y-6 mb-6">
            {/* Tier 1 — Bootstrap */}
            <BudgetBar
              label="Tier 1 — Bootstrap"
              tokenLabel="2,500 tokens"
              tags={bootstrapTags}
              gradient="#00F5FF"
              delay={0}
              inView={barsInView}
            />

            {/* Tier 2 — Adaptive */}
            <BudgetBar
              label="Tier 2 — Adaptive"
              tokenLabel="500-1,500 tokens"
              tags={adaptiveTags}
              gradient="linear-gradient(90deg, #00F5FF, #8B5CF6)"
              delay={0.3}
              inView={barsInView}
            />
          </div>
        </AnimatedSection>

        {/* Confidence gate */}
        <AnimatedSection delay={0.25}>
          <div className="mb-10">
            <ConfidenceGate />
          </div>
        </AnimatedSection>

        {/* Signal cards */}
        <AnimatedSection delay={0.35}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {signals.map((signal) => (
              <div
                key={signal.label}
                className="relative p-5 rounded-2xl group cursor-default transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
                  border: `1px solid ${signal.color}18`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${signal.color}40`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${signal.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${signal.color}18`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${signal.color}40`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${signal.color}10`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${signal.color}18`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-4 right-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${signal.color}60, transparent)`,
                  }}
                />

                {/* Weight */}
                <div
                  className="text-3xl font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-impact, var(--font-heading))",
                    color: signal.color,
                    textShadow: `0 0 20px ${signal.color}30`,
                  }}
                >
                  {signal.weight}
                </div>

                {/* Label */}
                <div
                  className="text-sm font-semibold mb-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#E8EAF0",
                  }}
                >
                  {signal.label}
                </div>

                {/* Description */}
                <div
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "#7A8AAA",
                  }}
                >
                  {signal.description}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Logo strip */}
        <AnimatedSection delay={0.45}>
          <div className="flex items-center justify-center gap-6 mt-12 opacity-40 hover:opacity-70 transition-opacity">
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "#3A4560" }}
            >
              Powered by
            </span>
            {logos.map((l) => (
              <Image
                key={l.alt}
                src={l.src}
                alt={l.alt}
                width={80}
                height={24}
                className="h-6 w-auto grayscale"
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
