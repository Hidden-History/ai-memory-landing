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
  X,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const rows = [
  {
    feature: "Semantic Vector Search",
    icon: Search,
    us: true,
    them: false,
    color: "text-blue",
  },
  {
    feature: "Semantic Decay",
    icon: Timer,
    us: true,
    them: false,
    color: "text-accent",
  },
  {
    feature: "3-Layer Security Pipeline",
    icon: Shield,
    us: true,
    them: false,
    color: "text-green-400",
  },
  {
    feature: "Dual Embedding Routing",
    icon: GitBranch,
    us: true,
    them: false,
    color: "text-cyan",
  },
  {
    feature: "GitHub / Jira Sync",
    icon: Github,
    us: true,
    them: false,
    color: "text-primary-light",
  },
  {
    feature: "LLM Observability",
    icon: BarChart3,
    us: true,
    them: false,
    color: "text-yellow-400",
  },
  {
    feature: "AI PM Agent (Parzival)",
    icon: Bot,
    us: true,
    them: false,
    color: "text-accent",
  },
];

export function Differentiators() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Why AI Memory
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            What No Other{" "}
            <span className="gradient-text">Tool Has</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Most &quot;AI memory&quot; tools are glorified key-value stores. AI
            Memory is a production-grade vector framework.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="shine-border p-2 sm:p-4">
            <div className="w-full py-4">
              {/* Header */}
              <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] px-8 py-5 border-b border-border/20">
                <span className="text-base font-[family-name:var(--font-mono)] text-muted-darker uppercase tracking-wider">
                  Capability
                </span>
                <span className="text-center text-base font-[family-name:var(--font-heading)] font-semibold text-primary-light">
                  AI Memory
                </span>
                <span className="text-center text-base font-[family-name:var(--font-heading)] font-semibold text-muted-darker">
                  Others
                </span>
              </div>

              {/* Rows */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
              >
                {rows.map((row, i) => (
                  <motion.div
                    key={row.feature}
                    variants={fadeUp}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className={`grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] items-center px-8 py-5 group hover:bg-white/[0.03] transition-colors ${
                      i < rows.length - 1 ? "border-b border-border/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <row.icon
                        className={`w-5 h-5 ${row.color} flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`}
                      />
                      <span className="text-base text-foreground/80 group-hover:text-foreground transition-colors">
                        {row.feature}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-9 h-9 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-red-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
