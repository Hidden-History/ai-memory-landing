"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  AnimatedSection,
  blurIn,
  scaleIn,
  stagger,
} from "@/components/shared/animated-section";

/* ─── Particle Network Background ─────────────────────────────── */

const particles = [
  { x: "12%", y: "18%", delay: 0 },
  { x: "85%", y: "25%", delay: 0.8 },
  { x: "35%", y: "72%", delay: 1.5 },
  { x: "68%", y: "15%", delay: 2.2 },
  { x: "22%", y: "55%", delay: 0.4 },
  { x: "78%", y: "65%", delay: 1.1 },
  { x: "50%", y: "40%", delay: 1.8 },
];

const connections: [number, number][] = [
  [0, 4],
  [1, 3],
  [2, 5],
  [3, 6],
  [4, 6],
  [5, 1],
  [6, 2],
];

function ParticleNetwork() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={particles[a].x}
            y1={particles[a].y}
            x2={particles[b].x}
            y2={particles[b].y}
            stroke="rgba(0,245,255,0.08)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.04, 0.12, 0.04] }}
            transition={{
              duration: 6,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            background: "#00F5FF",
            boxShadow: "0 0 8px rgba(0,245,255,0.4)",
          }}
          animate={{
            y: [0, -8, 0, 6, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Stat Data ────────────────────────────────────────────────── */

const stats = [
  { value: "7", label: "Core Systems", color: "#00F5FF" },
  { value: "9", label: "Step Pipeline", color: "#8B5CF6" },
  { value: "768d", label: "Vectors", color: "#FF2D6A" },
  { value: "5", label: "Collections", color: "#00FF88" },
];

/* ─── Features Hero Section ────────────────────────────────────── */

export function FeaturesHero() {
  return (
    <section
      id="hero"
      className="relative py-32 px-6 flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <ParticleNetwork />
      <div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative text-center">
        {/* Section label */}
        <AnimatedSection className="flex justify-center mb-8">
          <div className="section-label">
            <Sparkles className="w-3.5 h-3.5" />
            Features
          </div>
        </AnimatedSection>

        {/* Headline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={blurIn}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            Under the{" "}
            <span className="gradient-text-animated">Hood</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <AnimatedSection delay={0.15}>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed mb-12"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Every component explained. From capture to retrieval, chunking to
            decay — the technical architecture that makes AI Memory work.
          </p>
        </AnimatedSection>

        {/* Hero image panel */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl mx-auto mb-16"
        >
          {/* HUD label */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.3))" }} />
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
            >
              Architecture Overview
            </span>
            <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(270deg, transparent, rgba(0,245,255,0.3))" }} />
          </div>

          {/* Image positioning context — chips anchor here */}
          <div className="relative">
            {/* Outer glow ring — stays stable behind float */}
            <div
              className="absolute inset-0 rounded-3xl animate-pulse-glow pointer-events-none"
              style={{
                boxShadow: "0 0 80px rgba(0,245,255,0.12), 0 0 120px rgba(139,92,246,0.08)",
                transform: "scale(1.03)",
              }}
            />

            {/* Float group — image + chips move together */}
            <div className="relative animate-float-slow">
              {/* Image container */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  border: "1px solid rgba(0,245,255,0.2)",
                  boxShadow:
                    "0 0 0 1px rgba(0,245,255,0.06) inset, 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,245,255,0.08)",
                }}
              >
                <Image
                  src="/ai-memory-5.png"
                  alt="AI Memory architecture — exploded view showing pipeline layers from input through security, embedding, storage, and retrieval"
                  width={1456}
                  height={720}
                  className="w-full h-auto"
                  priority
                />

                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,245,255,0.03) 0%, transparent 10%, transparent 90%, rgba(0,245,255,0.03) 100%)",
                  }}
                />

                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg" style={{ borderColor: "rgba(0,245,255,0.5)" }} />
                <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 rounded-tr-lg" style={{ borderColor: "rgba(0,245,255,0.5)" }} />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 rounded-bl-lg" style={{ borderColor: "rgba(0,245,255,0.5)" }} />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 rounded-br-lg" style={{ borderColor: "rgba(0,245,255,0.5)" }} />
              </div>

              {/* Floating accent chips — positioned relative to float group */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute -top-4 right-6 sm:right-10 px-4 py-2 rounded-full text-xs font-medium z-10"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(15,20,50,0.9)",
                  border: "1px solid rgba(0,245,255,0.3)",
                  color: "#00F5FF",
                  boxShadow: "0 0 20px rgba(0,245,255,0.15)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  9-Step Pipeline
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 left-6 sm:left-10 px-4 py-2 rounded-full text-xs font-medium z-10"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(15,20,50,0.9)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#8B5CF6",
                  boxShadow: "0 0 20px rgba(139,92,246,0.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                768d Vector Embeddings
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-4 px-3 py-1.5 rounded-full text-[10px] font-medium z-10"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(15,20,50,0.9)",
                  border: "1px solid rgba(0,255,136,0.3)",
                  color: "#00FF88",
                  boxShadow: "0 0 15px rgba(0,255,136,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  3-Layer Security
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stat row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative p-5 rounded-2xl text-center cursor-default group transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
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
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `${stat.color}40`;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 30px ${stat.color}10`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${stat.color}15`;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-4 right-4 h-px rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)`,
                  opacity: 0.6,
                }}
              />
              <div
                className="text-3xl sm:text-4xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-impact, var(--font-heading))",
                  color: stat.color,
                  textShadow: `0 0 20px ${stat.color}30`,
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-[10px] font-medium uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
