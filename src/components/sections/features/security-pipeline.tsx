"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Search, Lock, Brain } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { GREEN, AMBER, MAGENTA } from "@/lib/colors";

const RED = "#EF4444";

/* ── Layer definitions ──────────────────────────────── */

interface PipelineLayer {
  title: string;
  timing: string;
  timingColor: string;
  icon: typeof Search;
  description: string;
  accentColor: string;
}

const layers: PipelineLayer[] = [
  {
    title: "Regex Pattern Scan",
    timing: "~1ms",
    timingColor: GREEN,
    icon: Search,
    description: "SSN, credit cards, API keys, passwords, email addresses",
    accentColor: GREEN,
  },
  {
    title: "Entropy Detection",
    timing: "~10ms",
    timingColor: AMBER,
    icon: Lock,
    description:
      "detect-secrets engine scans for high-entropy strings that look like secrets",
    accentColor: AMBER,
  },
  {
    title: "SpaCy NER",
    timing: "~50-100ms",
    timingColor: MAGENTA,
    icon: Brain,
    description:
      "Named Entity Recognition identifies names, organizations, locations, and other PII",
    accentColor: MAGENTA,
  },
];

/* ── Result badges ──────────────────────────────────── */

const results = [
  {
    label: "CLEAN",
    action: "Store",
    color: GREEN,
    description: "Memory stored in Qdrant",
  },
  {
    label: "BLOCKED",
    action: "Discard",
    color: RED,
    description: "Content logged but not stored",
  },
];

/* ── Slide-from-left variant ────────────────────────── */

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

/* ── Connecting line with animated dot ──────────────── */

function ConnectorLine({
  fromColor,
  toColor,
}: {
  fromColor: string;
  toColor: string;
}) {
  return (
    <div className="flex justify-center">
      <div
        className="relative w-[2px] h-10"
        style={{
          background: `linear-gradient(180deg, ${fromColor}60, ${toColor}60)`,
        }}
      >
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full"
          style={{
            background: fromColor,
            boxShadow: `0 0 8px ${fromColor}80, 0 0 20px ${fromColor}40`,
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */

export function SecurityPipeline() {
  return (
    <section id="security" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[25%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,45,106,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8">
            <Shield className="w-3.5 h-3.5" />
            Security Pipeline
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            3-Layer{" "}
            <span className="gradient-text-animated">Protection</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Every memory passes through regex pattern scanning, entropy-based
            secrets detection, and SpaCy NER — before any storage occurs.
          </p>
        </AnimatedSection>

        {/* Pipeline layers */}
        <div className="space-y-0">
          {layers.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <div key={layer.title}>
                {/* Connector line (between layers, not before first) */}
                {i > 0 && (
                  <ConnectorLine
                    fromColor={layers[i - 1].accentColor}
                    toColor={layer.accentColor}
                  />
                )}

                {/* Layer card */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={slideFromLeft}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative rounded-2xl p-6 group transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
                    border: `1px solid ${layer.accentColor}18`,
                    borderLeft: `3px solid ${layer.accentColor}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${layer.accentColor}40`;
                    e.currentTarget.style.borderLeftColor = layer.accentColor;
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.boxShadow = `0 0 30px ${layer.accentColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${layer.accentColor}18`;
                    e.currentTarget.style.borderLeftColor = layer.accentColor;
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = `${layer.accentColor}40`;
                    e.currentTarget.style.borderLeftColor = layer.accentColor;
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.boxShadow = `0 0 30px ${layer.accentColor}10`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${layer.accentColor}18`;
                    e.currentTarget.style.borderLeftColor = layer.accentColor;
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Top glow line on hover */}
                  <div
                    className="absolute top-0 left-4 right-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${layer.accentColor}60, transparent)`,
                    }}
                  />

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${layer.accentColor}10`,
                        border: `1px solid ${layer.accentColor}25`,
                        boxShadow: `0 0 20px ${layer.accentColor}08 inset`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: layer.accentColor }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-base font-semibold"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "#E8EAF0",
                          }}
                        >
                          {layer.title}
                        </h3>
                        {/* Timing badge */}
                        <span
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-bold"
                          style={{
                            fontFamily: "var(--font-mono)",
                            background: `${layer.timingColor}10`,
                            border: `1px solid ${layer.timingColor}25`,
                            color: layer.timingColor,
                          }}
                        >
                          {layer.timing}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: "#7A8AAA",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Final connector from pipeline to results */}
        <ConnectorLine fromColor={MAGENTA} toColor="#5A6480" />

        {/* Result badges */}
        <AnimatedSection delay={0.5} className="mt-2">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {results.map((result) => (
              <div
                key={result.label}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200"
                style={{
                  background: `${result.color}08`,
                  border: `1px solid ${result.color}20`,
                }}
              >
                {/* Status dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: result.color }}
                  />
                  <div
                    className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping-slow"
                    style={{ backgroundColor: `${result.color}40` }}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: result.color,
                      }}
                    >
                      {result.label}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "#5A6480",
                      }}
                    >
                      →
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "#E8EAF0",
                      }}
                    >
                      {result.action}
                    </span>
                  </div>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "#5A6480",
                    }}
                  >
                    {result.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Logo strip — OWASP */}
        <AnimatedSection delay={0.6} className="mt-14">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Image
                  src="/logos/owasp.png"
                  alt="OWASP"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                  style={{
                    filter: "brightness(0) invert(1) opacity(0.7)",
                  }}
                />
              </div>
              <span
                className="text-[9px] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
              >
                OWASP
              </span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
