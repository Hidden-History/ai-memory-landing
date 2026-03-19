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
  Check,
  Zap,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const rows = [
  {
    feature: "Semantic Vector Search",
    icon: Search,
    color: "#00F5FF",
    desc: "Meaning-based retrieval, not keyword matching",
  },
  {
    feature: "Semantic Decay",
    icon: Timer,
    color: "#8B5CF6",
    desc: "Memories age naturally like human cognition",
  },
  {
    feature: "3-Layer Security Pipeline",
    icon: Shield,
    color: "#00FF88",
    desc: "Regex + detect-secrets + SpaCy NER",
  },
  {
    feature: "Dual Embedding Routing",
    icon: GitBranch,
    color: "#22D3EE",
    desc: "Code vs prose — each optimized",
  },
  {
    feature: "GitHub / Jira Sync",
    icon: Github,
    color: "#FF2D6A",
    desc: "Full repository + issue history",
  },
  {
    feature: "LLM Observability",
    icon: BarChart3,
    color: "#FFB800",
    desc: "Langfuse pipeline tracing",
  },
  {
    feature: "AI PM Agent (Parzival)",
    icon: Bot,
    color: "#8B5CF6",
    desc: "Technical PM + quality gatekeeper",
  },
];

export function Differentiators() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.03) 0%, transparent 70%)",
          filter: "blur(120px)"
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Zap className="w-3.5 h-3.5" />
            Why AI Memory
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}>
            What No Other{" "}
            <span className="gradient-text-animated">Tool Has</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}>
            Most &quot;AI memory&quot; tools are glorified key-value stores.
            AI Memory is a production-grade vector framework.
          </p>
        </AnimatedSection>

        {/* Comparison rows */}
        <AnimatedSection delay={0.15}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: "1px solid rgba(0, 245, 255, 0.1)",
              background: "rgba(10, 10, 31, 0.6)",
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-[1fr_120px] px-8 py-5"
              style={{
                borderBottom: "1px solid rgba(0, 245, 255, 0.1)",
                background: "rgba(0, 245, 255, 0.03)"
              }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#4A5068", fontFamily: "var(--font-mono)" }}
              >
                Capability
              </span>
              <span
                className="text-center text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#00F5FF", fontFamily: "var(--font-mono)" }}
              >
                AI Memory
              </span>
            </div>

            {/* Rows */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
            >
              {rows.map((row, i) => (
                <motion.div
                  key={row.feature}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="grid grid-cols-[1fr_120px] items-center px-8 py-6 group transition-colors duration-200"
                  style={{
                    borderBottom: i < rows.length - 1
                      ? "1px solid rgba(0, 245, 255, 0.05)"
                      : "none"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 245, 255, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Feature info */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
                      style={{
                        background: `${row.color}10`,
                        border: `1px solid ${row.color}25`
                      }}
                    >
                      <row.icon className="w-4.5 h-4.5" style={{ color: row.color }} />
                    </div>
                    <div>
                      <div
                        className="text-base font-semibold mb-1 transition-colors"
                        style={{ color: "#E8EAF0", fontFamily: "var(--font-heading)" }}
                      >
                        {row.feature}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "#4A5068", fontFamily: "var(--font-body)" }}
                      >
                        {row.desc}
                      </div>
                    </div>
                  </div>

                  {/* Check mark */}
                  <div className="flex justify-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: `${row.color}12`,
                        border: `1px solid ${row.color}30`,
                        boxShadow: `0 0 20px ${row.color}15`
                      }}
                    >
                      <Check className="w-5 h-5" style={{ color: row.color }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Bottom note */}
        <AnimatedSection delay={0.4}>
          <p className="text-center mt-8 text-sm"
            style={{ color: "#4A5068", fontFamily: "var(--font-body)" }}>
            All capabilities are open source and self-hostable.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
