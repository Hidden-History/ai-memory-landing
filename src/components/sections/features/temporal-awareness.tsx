"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

/* ── Decay curve data ────────────────────────────────── */

interface DecayCurve {
  label: string;
  halfLife: number;
  color: string;
  points: number[];
}

const days = [0, 7, 14, 21, 28, 42, 56, 70, 84];

const curves: DecayCurve[] = [
  {
    label: "code-patterns",
    halfLife: 14,
    color: "#00F5FF",
    points: [1.0, 0.71, 0.5, 0.35, 0.25, 0.125, 0.063, 0.031, 0.016],
  },
  {
    label: "discussions",
    halfLife: 21,
    color: "#8B5CF6",
    points: [1.0, 0.79, 0.63, 0.5, 0.4, 0.25, 0.16, 0.1, 0.063],
  },
  {
    label: "conventions",
    halfLife: 60,
    color: "#00FF88",
    points: [1.0, 0.92, 0.85, 0.79, 0.74, 0.63, 0.54, 0.46, 0.4],
  },
];

/* ── Freshness tiers ─────────────────────────────────── */

interface FreshnessTier {
  label: string;
  range: string;
  color: string;
}

const freshnessTiers: FreshnessTier[] = [
  { label: "Fresh", range: "0-2 commits", color: "#00FF88" },
  { label: "Aging", range: "3-9 commits", color: "#FFB800" },
  { label: "Stale", range: "10-24 commits", color: "#FF8C00" },
  { label: "Expired", range: "25+ commits", color: "#FF2D6A" },
];

/* ── SVG chart constants ─────────────────────────────── */

const CHART_W = 600;
const CHART_H = 300;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 40;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;

const X_TICKS = [0, 15, 30, 45, 60, 75, 90];
const Y_TICKS = [0.0, 0.25, 0.5, 0.75, 1.0];

function dayToX(day: number): number {
  return PAD_L + (day / 90) * PLOT_W;
}

function scoreToY(score: number): number {
  return PAD_T + (1 - score) * PLOT_H;
}

function buildPath(points: number[]): string {
  return points
    .map((score, i) => {
      const x = dayToX(days[i]);
      const y = scoreToY(score);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function pathLength(points: number[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = dayToX(days[i]) - dayToX(days[i - 1]);
    const dy = scoreToY(points[i]) - scoreToY(points[i - 1]);
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.ceil(len);
}

/* ── Decay Chart Component ───────────────────────────── */

function DecayChart() {
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true, margin: "-60px" });

  return (
    <div ref={chartRef} className="w-full max-w-3xl mx-auto">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        {/* Grid lines */}
        {Y_TICKS.map((tick) => (
          <line
            key={`yg-${tick}`}
            x1={PAD_L}
            y1={scoreToY(tick)}
            x2={CHART_W - PAD_R}
            y2={scoreToY(tick)}
            stroke="rgba(0,245,255,0.06)"
            strokeWidth="1"
          />
        ))}
        {X_TICKS.map((tick) => (
          <line
            key={`xg-${tick}`}
            x1={dayToX(tick)}
            y1={PAD_T}
            x2={dayToX(tick)}
            y2={CHART_H - PAD_B}
            stroke="rgba(0,245,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* X-axis labels */}
        {X_TICKS.map((tick) => (
          <text
            key={`xl-${tick}`}
            x={dayToX(tick)}
            y={CHART_H - PAD_B + 18}
            textAnchor="middle"
            fill="#3A4560"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {tick}
          </text>
        ))}
        <text
          x={CHART_W / 2}
          y={CHART_H - 2}
          textAnchor="middle"
          fill="#5A6480"
          fontSize="10"
          fontFamily="var(--font-mono)"
        >
          Days
        </text>

        {/* Y-axis labels */}
        {Y_TICKS.map((tick) => (
          <text
            key={`yl-${tick}`}
            x={PAD_L - 8}
            y={scoreToY(tick) + 4}
            textAnchor="end"
            fill="#3A4560"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {tick.toFixed(2)}
          </text>
        ))}
        <text
          x={12}
          y={CHART_H / 2}
          textAnchor="middle"
          fill="#5A6480"
          fontSize="10"
          fontFamily="var(--font-mono)"
          transform={`rotate(-90, 12, ${CHART_H / 2})`}
        >
          Score
        </text>

        {/* X-axis tick marks */}
        {X_TICKS.map((tick) => (
          <line
            key={`xt-${tick}`}
            x1={dayToX(tick)}
            y1={CHART_H - PAD_B}
            x2={dayToX(tick)}
            y2={CHART_H - PAD_B + 4}
            stroke="#3A4560"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis tick marks */}
        {Y_TICKS.map((tick) => (
          <line
            key={`yt-${tick}`}
            x1={PAD_L - 4}
            y1={scoreToY(tick)}
            x2={PAD_L}
            y2={scoreToY(tick)}
            stroke="#3A4560"
            strokeWidth="1"
          />
        ))}

        {/* Decay curves with draw-in animation */}
        {curves.map((curve, ci) => {
          const d = buildPath(curve.points);
          const len = pathLength(curve.points);
          return (
            <motion.path
              key={curve.label}
              d={d}
              stroke={curve.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={len}
              initial={{ strokeDashoffset: len }}
              animate={
                inView
                  ? { strokeDashoffset: 0 }
                  : { strokeDashoffset: len }
              }
              transition={{
                duration: 1.5,
                delay: ci * 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{ filter: `drop-shadow(0 0 4px ${curve.color}40)` }}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {curves.map((curve) => (
          <div key={curve.label} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: curve.color,
                boxShadow: `0 0 6px ${curve.color}60`,
              }}
            />
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-mono)", color: "#7A8AAA" }}
            >
              {curve.label}{" "}
              <span style={{ color: "#3A4560" }}>({curve.halfLife}d)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────── */

export function TemporalAwareness() {
  return (
    <section id="temporal" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[25%] right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8">
            <Clock className="w-3.5 h-3.5" />
            Temporal Awareness
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Memories That{" "}
            <span className="gradient-text-animated">Age</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Decay scoring ensures agents prefer recent memories. Freshness
            detection flags stale patterns before they cause harm.
          </p>
        </AnimatedSection>

        {/* Decay chart */}
        <AnimatedSection delay={0.15}>
          <DecayChart />
        </AnimatedSection>

        {/* Formula display */}
        <AnimatedSection delay={0.25}>
          <div
            className="mt-10 p-5 rounded-xl text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(8,10,28,0.98), rgba(5,7,20,0.99))",
              border: "1px solid rgba(0,245,255,0.12)",
              boxShadow:
                "0 0 0 1px rgba(0,245,255,0.04) inset, 0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <code
              className="text-sm sm:text-base"
              style={{ fontFamily: "var(--font-mono)", color: "#E8EAF0" }}
            >
              <span style={{ color: "#00F5FF" }}>final_score</span>{" "}
              <span style={{ color: "#3A4560" }}>=</span>{" "}
              <span style={{ color: "#7A8AAA" }}>(</span>
              <span style={{ color: "#FFB800" }}>0.7</span>{" "}
              <span style={{ color: "#3A4560" }}>&times;</span>{" "}
              <span style={{ color: "#8B5CF6" }}>similarity</span>
              <span style={{ color: "#7A8AAA" }}>)</span>{" "}
              <span style={{ color: "#3A4560" }}>+</span>{" "}
              <span style={{ color: "#7A8AAA" }}>(</span>
              <span style={{ color: "#FFB800" }}>0.3</span>{" "}
              <span style={{ color: "#3A4560" }}>&times;</span>{" "}
              <span style={{ color: "#00FF88" }}>
                0.5
                <sup>
                  (age_days / half_life)
                </sup>
              </span>
              <span style={{ color: "#7A8AAA" }}>)</span>
            </code>
          </div>
        </AnimatedSection>

        {/* Freshness tier badges */}
        <AnimatedSection delay={0.35}>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            {freshnessTiers.map((tier) => (
              <div
                key={tier.label}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl cursor-default transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
                  border: `1px solid ${tier.color}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${tier.color}50`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${tier.color}20`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: tier.color,
                    boxShadow: `0 0 8px ${tier.color}60`,
                  }}
                />
                <div>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: tier.color,
                    }}
                  >
                    {tier.label}
                  </span>
                  <span
                    className="text-xs ml-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "#5A6480",
                    }}
                  >
                    {tier.range}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
