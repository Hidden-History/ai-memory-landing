"use client";

import { motion } from "framer-motion";
import {
  Search,
  Timer,
  Shield,
  GitBranch,
  Github,
  BarChart3,
  Bot,
  Zap,
  Database,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const capabilities = [
  {
    feature: "Semantic Vector Search",
    icon: Search,
    color: "#00F5FF",
    desc: "Meaning-based retrieval, not keyword matching",
    detail: "Understands context across 5 collections",
  },
  {
    feature: "Semantic Decay",
    icon: Timer,
    color: "#8B5CF6",
    desc: "Memories age naturally like human cognition",
    detail: "Stale context fades, fresh knowledge stays sharp",
  },
  {
    feature: "3-Layer Security Pipeline",
    icon: Shield,
    color: "#00FF88",
    desc: "Regex + detect-secrets + SpaCy NER",
    detail: "PII detection before any storage occurs",
  },
  {
    feature: "Dual Embedding Routing",
    icon: GitBranch,
    color: "#22D3EE",
    desc: "Code vs prose — each embedding optimized",
    detail: "Separate models for maximum precision",
  },
  {
    feature: "GitHub / Jira Sync",
    icon: Github,
    color: "#FF2D6A",
    desc: "Full repository + issue history searchable",
    detail: "Context from your entire dev workflow",
  },
  {
    feature: "LLM Observability",
    icon: BarChart3,
    color: "#FFB800",
    desc: "Langfuse pipeline tracing built-in",
    detail: "Full visibility into memory operations",
  },
  {
    feature: "AI PM Agent (Parzival)",
    icon: Bot,
    color: "#8B5CF6",
    desc: "Technical PM + quality gatekeeper",
    detail: "Your AI never misses a requirement",
  },
  {
    feature: "Qdrant Vector Store",
    icon: Database,
    color: "#00F5FF",
    desc: "Production-grade vector database",
    detail: "Self-hosted, no vendor lock-in",
  },
];

export function Differentiators() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          {/* Label */}
          <div className="section-label mb-8">
            <Zap className="w-3.5 h-3.5" />
            Why AI Memory
          </div>

          {/* Headline */}
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What No Other Tool{" "}
            <span className="gradient-text-animated">Has Built-In</span>
          </h2>

          {/* Sub */}
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Most &quot;AI memory&quot; tools are glorified key-value stores.
            AI Memory is a production-grade neural framework.
          </p>
        </AnimatedSection>

        {/* Vertical timeline with capability cards */}
        <div className="relative">
          {/* Center timeline line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(0,245,255,0.3) 10%, rgba(139,92,246,0.3) 90%, transparent 100%)",
            }}
          />

          {/* Capability rows */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="relative flex flex-col gap-6"
          >
            {capabilities.map((item, i) => (
              <motion.div
                key={item.feature}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="relative"
              >
                {/* Alternating layout: odd=left, even=right */}
                <div
                  className={`relative flex items-center gap-6 ${
                    i % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Card */}
                  <div
                    className="relative w-[calc(50%-3rem)] p-6 rounded-2xl cursor-default transition-all duration-400 group"
                    style={{
                      background: "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                      border: `1px solid ${item.color}18`,
                      borderRight: i % 2 === 0 ? `1px solid ${item.color}25` : "none",
                      borderLeft: i % 2 !== 0 ? `1px solid ${item.color}25` : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${item.color}45`;
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 0 50px ${item.color}12, 0 20px 40px rgba(0,0,0,0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${item.color}18`;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-6 right-6 h-px rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
                        opacity: 0.6,
                      }}
                    />

                    {/* Icon + color accent */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${item.color}12`,
                          border: `1px solid ${item.color}30`,
                          boxShadow: `0 0 20px ${item.color}15 inset`,
                        }}
                      >
                        <item.icon className="w-5.5 h-5.5" style={{ color: item.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base font-semibold mb-1"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "#E8EAF0",
                          }}
                        >
                          {item.feature}
                        </h3>
                        <p
                          className="text-sm mb-2"
                          style={{
                            color: item.color,
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                          }}
                        >
                          {item.desc}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "#5A6480", fontFamily: "var(--font-body)" }}
                        >
                          {item.detail}
                        </p>
                      </div>
                    </div>

                    {/* Glow on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${item.color}08 0%, transparent 60%)`,
                      }}
                    />
                  </div>

                  {/* Timeline node */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className="w-4 h-4 rounded-full border-2 transition-all duration-300"
                      style={{
                        background: item.color,
                        borderColor: "#0A0D1A",
                        boxShadow: `0 0 15px ${item.color}60`,
                      }}
                    />
                    {/* Pulse ring */}
                    <div
                      className="absolute inset-0 w-4 h-4 rounded-full animate-ping-slow"
                      style={{
                        background: `${item.color}30`,
                        transform: "scale(1.8)",
                      }}
                    />
                  </div>

                  {/* Spacer for alternating side */}
                  <div className="w-[calc(50%-3rem)]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom note */}
        <AnimatedSection delay={0.4}>
          <p
            className="text-center mt-16 text-sm"
            style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
          >
            All capabilities are open source and self-hostable &middot; MIT License
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
