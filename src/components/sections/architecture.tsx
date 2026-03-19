"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Cpu, Shield, Brain, Database } from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const collections = [
  {
    name: "code-patterns",
    tag: "HOW",
    color: "#00F5FF",
    desc: "Implementation patterns",
  },
  {
    name: "conventions",
    tag: "WHAT",
    color: "#8B5CF6",
    desc: "Coding standards",
  },
  {
    name: "discussions",
    tag: "WHY",
    color: "#FF2D6A",
    desc: "Decisions & context",
  },
  {
    name: "github",
    tag: "WHEN",
    color: "#22D3EE",
    desc: "Version history",
  },
  {
    name: "jira-data",
    tag: "JIRA",
    color: "#FFB800",
    desc: "Work items",
  },
];

const pipelineSteps = [
  { label: "Claude Code Hook", sub: "CAPTURE", icon: Brain, color: "#8B5CF6" },
  { label: "Security Scanner", sub: "PROTECT", icon: Shield, color: "#00FF88" },
  { label: "Embedding Router", sub: "OPTIMIZE", icon: Cpu, color: "#00F5FF" },
  { label: "Qdrant Ingest", sub: "STORE", icon: Database, color: "#FFB800" },
];

export function Architecture() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div
        className="absolute top-[20%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            Architecture
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Hook Pipeline to{" "}
            <span className="gradient-text-animated">Vector Store</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Every memory flows through a security-first pipeline before landing
            in the right Qdrant collection.
          </p>
        </AnimatedSection>

        {/* 3D Pipeline Flow */}
        <AnimatedSection delay={0.15}>
          {/* Pipeline cards in a flowing arc */}
          <div className="relative flex flex-col items-center gap-4 mb-16">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="relative w-full max-w-lg"
              >
                {/* Connector line above (except first) */}
                {i > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div
                      className="w-px h-8"
                      style={{
                        background: `linear-gradient(to bottom, transparent, ${pipelineSteps[i - 1].color}60)`,
                      }}
                    />
                    <ArrowDown className="w-4 h-4" style={{ color: pipelineSteps[i - 1].color, opacity: 0.5 }} />
                  </div>
                )}

                {/* Step card */}
                <div
                  className="relative p-6 rounded-2xl transition-all duration-400 group"
                  style={{
                    background: "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                    border: `1px solid ${step.color}18`,
                    boxShadow: `0 0 0 1px ${step.color}08 inset`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${step.color}50`;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 0 60px ${step.color}12, 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${step.color}15 inset`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${step.color}18`;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${step.color}08 inset`;
                  }}
                >
                  {/* Glowing top line */}
                  <div
                    className="absolute top-0 left-6 right-6 h-px rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
                      boxShadow: `0 0 10px ${step.color}40`,
                    }}
                  />

                  <div className="flex items-center gap-5">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${step.color}12`,
                        border: `1px solid ${step.color}30`,
                        boxShadow: `0 0 25px ${step.color}10 inset`,
                      }}
                    >
                      <step.icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>

                    <div>
                      <div
                        className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1"
                        style={{ color: step.color, fontFamily: "var(--font-mono)" }}
                      >
                        {step.sub}
                      </div>
                      <div
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
                      >
                        {step.label}
                      </div>
                    </div>

                    {/* Step number */}
                    <div className="ml-auto">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          fontFamily: "var(--font-mono)",
                          background: `${step.color}12`,
                          border: `1px solid ${step.color}30`,
                          color: step.color,
                        }}
                      >
                        {i + 1}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Arrow to collections */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-2 mb-12"
        >
          <div
            className="w-px h-12"
            style={{
              background: "linear-gradient(to bottom, rgba(0,245,255,0.3), rgba(0,245,255,0.05))",
            }}
          />
          <div
            className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-mono)",
              color: "#5A6480",
              background: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.1)",
            }}
          >
            5 Specialized Collections
          </div>
        </motion.div>

        {/* Collections grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-3 sm:grid-cols-5 gap-3"
        >
          {collections.map((col, i) => (
            <motion.div
              key={col.name}
              variants={fadeUp}
              className="relative p-5 rounded-2xl text-center transition-all duration-350 group cursor-default"
              style={{
                background: "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                border: `1px solid ${col.color}15`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${col.color}50`;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 0 40px ${col.color}12`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${col.color}15`;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top glow line */}
              <div
                className="absolute top-0 left-4 right-4 h-px rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${col.color}60, transparent)`,
                  opacity: 0.5,
                }}
              />

              {/* Tag */}
              <div
                className="inline-flex items-center justify-center w-10 h-5 rounded-full text-[8px] font-bold uppercase tracking-widest mb-3"
                style={{
                  background: `${col.color}12`,
                  border: `1px solid ${col.color}30`,
                  color: col.color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {col.tag}
              </div>

              {/* Name */}
              <div
                className="text-xs font-semibold mb-1 leading-tight"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                {col.name}
              </div>

              {/* Desc */}
              <div className="text-[10px]" style={{ color: "#5A6480", fontFamily: "var(--font-body)" }}>
                {col.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p
            className="text-xs px-4 py-2 rounded-full inline-block"
            style={{
              fontFamily: "var(--font-mono)",
              color: "#5A6480",
              background: "rgba(0,245,255,0.03)",
              border: "1px solid rgba(0,245,255,0.08)",
            }}
          >
            jira-data collection is conditional — created only when{" "}
            <code style={{ color: "#00F5FF" }}>JIRA_SYNC_ENABLED=true</code>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
