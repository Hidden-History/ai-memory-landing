"use client";

import { motion } from "framer-motion";
import { Brain, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

/* ── Colors ─────────────────────────────────────────── */

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const MAGENTA = "#FF2D6A";
const GREEN = "#00FF88";

/* ── Concentric circles decoration ──────────────────── */

function ConcentricCircles() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-10">
      {/* Outer ring — cyan */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1.5px solid ${CYAN}30`,
          boxShadow: `0 0 20px ${CYAN}10, inset 0 0 20px ${CYAN}05`,
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Middle ring — violet */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 16,
          border: `1.5px solid ${VIOLET}40`,
          boxShadow: `0 0 15px ${VIOLET}10, inset 0 0 15px ${VIOLET}05`,
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Inner ring — magenta */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 32,
          border: `1.5px solid ${MAGENTA}50`,
          boxShadow: `0 0 12px ${MAGENTA}15, inset 0 0 12px ${MAGENTA}08`,
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${CYAN}15, ${VIOLET}15)`,
            boxShadow: `0 0 30px ${CYAN}10`,
          }}
        >
          <Brain className="w-6 h-6" style={{ color: CYAN }} />
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */

export function FeaturesCTA() {
  return (
    <section id="cta" className="relative py-32 px-6 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(139,92,246,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative text-center">
        {/* Decorative circles */}
        <AnimatedSection>
          <ConcentricCircles />
        </AnimatedSection>

        {/* Headline */}
        <AnimatedSection delay={0.1}>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            Every Decision Has a{" "}
            <span className="gradient-text-animated">Reason.</span>
          </h2>
        </AnimatedSection>

        {/* Description */}
        <AnimatedSection delay={0.2}>
          <p
            className="text-lg max-w-xl mx-auto leading-relaxed mb-12"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Signal-triggered retrieval, zero-truncation chunking, temporal decay
            — built to solve one problem: right information at the right time.
          </p>
        </AnimatedSection>

        {/* CTA buttons */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {/* Primary — Get Started */}
            <a
              href="https://github.com/Hidden-History/ai-memory"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-hover group inline-flex items-center justify-center gap-2"
              style={{
                background: CYAN,
                color: "#0A0D1A",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 32px",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.25s ease",
                boxShadow: `0 0 20px rgba(0,245,255,0.25)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 40px rgba(0,245,255,0.45)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px rgba(0,245,255,0.25)`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary — Read the Docs */}
            <a
              href="/docs"
              className="magnetic-hover group inline-flex items-center justify-center gap-2"
              style={{
                background: "transparent",
                color: "#E8EAF0",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "13px 32px",
                borderRadius: 12,
                border: `1px solid ${VIOLET}55`,
                textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${VIOLET}12`;
                e.currentTarget.style.borderColor = `${VIOLET}88`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = `${VIOLET}55`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Read the Docs
            </a>
          </div>

          {/* Tertiary link */}
          <a
            href="/docs/architecture"
            className="inline-flex items-center gap-1 text-sm transition-colors duration-200 group"
            style={{
              fontFamily: "var(--font-body)",
              color: "#5A6480",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#7A8AAA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#5A6480";
            }}
          >
            View Architecture
            <span className="group-hover:translate-x-1 transition-transform inline-block">
              →
            </span>
          </a>
        </AnimatedSection>

        {/* Version badge */}
        <AnimatedSection delay={0.4} className="mt-12">
          <div className="flex items-center justify-center">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: "rgba(15,20,50,0.8)",
                border: "1px solid rgba(0,245,255,0.1)",
              }}
            >
              {/* Green status dot */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: GREEN }}
                />
                <div
                  className="absolute inset-0 w-2 h-2 rounded-full animate-ping-slow"
                  style={{ backgroundColor: `${GREEN}40` }}
                />
              </div>
              <span
                className="text-[11px]"
                style={{ fontFamily: "var(--font-mono)", color: "#7A8AAA" }}
              >
                v3.5 &bull; 2026-03-08 &bull; Active Development
              </span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
