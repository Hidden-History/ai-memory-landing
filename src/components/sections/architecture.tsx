"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Cpu, Shield, Brain, Database } from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const collections = [
  {
    name: "code-patterns",
    tag: "HOW",
    color: "#00F5FF",
    bg: "rgba(0, 245, 255, 0.04)",
    border: "rgba(0, 245, 255, 0.15)",
    hoverBorder: "rgba(0, 245, 255, 0.4)",
    desc: "Implementation patterns",
  },
  {
    name: "conventions",
    tag: "WHAT",
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.04)",
    border: "rgba(139, 92, 246, 0.15)",
    hoverBorder: "rgba(139, 92, 246, 0.4)",
    desc: "Coding standards",
  },
  {
    name: "discussions",
    tag: "WHY",
    color: "#FF2D6A",
    bg: "rgba(255, 45, 106, 0.04)",
    border: "rgba(255, 45, 106, 0.15)",
    hoverBorder: "rgba(255, 45, 106, 0.4)",
    desc: "Decisions & context",
  },
  {
    name: "github",
    tag: "WHEN",
    color: "#22D3EE",
    bg: "rgba(34, 211, 238, 0.04)",
    border: "rgba(34, 211, 238, 0.15)",
    hoverBorder: "rgba(34, 211, 238, 0.4)",
    desc: "Version history",
  },
  {
    name: "jira-data",
    tag: "JIRA",
    color: "#FFB800",
    bg: "rgba(255, 184, 0, 0.04)",
    border: "rgba(255, 184, 0, 0.15)",
    hoverBorder: "rgba(255, 184, 0, 0.4)",
    desc: "Work items",
  },
];

const pipelineSteps = [
  { label: "Claude Code Hook", sub: "Capture", icon: Brain, color: "#8B5CF6" },
  { label: "Security Scanner", sub: "Protect", icon: Shield, color: "#00FF88" },
  { label: "Embedding Router", sub: "Optimize", icon: Cpu, color: "#00F5FF" },
  { label: "Qdrant Ingest", sub: "Store", icon: Database, color: "#FFB800" },
];

export function Architecture() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            Architecture
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}>
            Hook Pipeline to{" "}
            <span className="gradient-text-animated">Vector Store</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}>
            Every memory flows through a security-first pipeline before landing
            in the right Qdrant collection.
          </p>
        </AnimatedSection>

        {/* Pipeline flow */}
        <AnimatedSection delay={0.15}>
          <div className="flex flex-col items-center gap-3 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="flex flex-col md:flex-row items-center gap-3 w-full justify-center"
            >
              {pipelineSteps.map((step, i) => (
                <motion.div key={step.label} variants={fadeUp} className="flex items-center gap-3">
                  {/* Step card */}
                  <div
                    className="relative px-7 py-5 text-center min-w-[170px] rounded-xl transition-all duration-300 group"
                    style={{
                      background: "rgba(10, 10, 31, 0.8)",
                      border: `1px solid ${step.color}20`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${step.color}50`;
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 0 30px ${step.color}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${step.color}20`;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Top glow line */}
                    <div
                      className="absolute top-0 left-3 right-3 h-px rounded-full transition-opacity duration-300"
                      style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`, opacity: 0.6 }}
                    />

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                      style={{
                        background: `${step.color}12`,
                        border: `1px solid ${step.color}25`
                      }}
                    >
                      <step.icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>

                    {/* Step label */}
                    <div
                      className="text-[10px] font-medium uppercase tracking-widest mb-1"
                      style={{ color: step.color, fontFamily: "var(--font-mono)" }}
                    >
                      {step.sub}
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "#E8EAF0", fontFamily: "var(--font-heading)" }}
                    >
                      {step.label}
                    </div>
                  </div>

                  {/* Connector arrows */}
                  {i < pipelineSteps.length - 1 && (
                    <div className="hidden md:flex items-center px-1">
                      <ArrowRight className="w-5 h-5" style={{ color: "rgba(0, 245, 255, 0.3)" }} />
                    </div>
                  )}
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex md:hidden items-center">
                      <ArrowDown className="w-5 h-5" style={{ color: "rgba(0, 245, 255, 0.3)" }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Down arrow to collections */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-1 py-3"
            >
              <div className="w-px h-8" style={{
                background: "linear-gradient(to bottom, rgba(0,245,255,0.3), rgba(0,245,255,0.05))"
              }} />
              <ArrowDown className="w-4 h-4" style={{ color: "rgba(0, 245, 255, 0.3)" }} />
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Collections grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
        >
          {collections.map((col) => (
            <motion.div
              key={col.name}
              variants={fadeUp}
              className="relative p-5 rounded-2xl text-center transition-all duration-350 group cursor-default"
              style={{
                background: col.bg,
                border: `1px solid ${col.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = col.hoverBorder;
                e.currentTarget.style.background = col.bg.replace("0.04", "0.08");
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 30px ${col.color}12`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = col.border;
                e.currentTarget.style.background = col.bg;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 left-0 w-8 h-8 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${col.color}30 0%, transparent 60%)`
                }}
              />

              {/* Tag badge */}
              <div
                className="inline-flex items-center justify-center w-10 h-5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3"
                style={{
                  background: `${col.color}15`,
                  border: `1px solid ${col.color}30`,
                  color: col.color,
                  fontFamily: "var(--font-mono)"
                }}
              >
                {col.tag}
              </div>

              {/* Name */}
              <div
                className="text-xs font-semibold mb-1"
                style={{ color: "#E8EAF0", fontFamily: "var(--font-heading)" }}
              >
                {col.name}
              </div>

              {/* Desc */}
              <div
                className="text-[10px]"
                style={{ color: "#4A5068", fontFamily: "var(--font-body)" }}
              >
                {col.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom annotation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-xs" style={{ color: "#4A5068", fontFamily: "var(--font-mono)" }}>
            jira-data collection is conditional — created only when JIRA_SYNC_ENABLED=true
          </p>
        </motion.div>
      </div>
    </section>
  );
}
