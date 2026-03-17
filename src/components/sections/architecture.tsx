"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const collections = [
  { name: "code-patterns", tag: "HOW", color: "border-blue/30 bg-blue/8" },
  { name: "conventions", tag: "WHAT", color: "border-primary/30 bg-primary/8" },
  { name: "discussions", tag: "WHY", color: "border-accent/30 bg-accent/8" },
  { name: "github", tag: "WHEN", color: "border-cyan/30 bg-cyan/8" },
  { name: "jira-data", tag: "JIRA", color: "border-green-500/30 bg-green-500/8" },
];

const pipelineSteps = [
  "Claude Code Hook",
  "Security Scanner",
  "Embedding Router",
  "Qdrant Ingest",
];

export function Architecture() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Architecture
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Hook Pipeline to{" "}
            <span className="gradient-text">Vector Store</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Every memory flows through a security-first pipeline before landing
            in the right Qdrant collection.
          </p>
        </AnimatedSection>

        {/* Pipeline flow */}
        <AnimatedSection delay={0.15}>
          <div className="flex flex-col items-center gap-3 mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="flex flex-col md:flex-row items-center gap-3 w-full justify-center"
            >
              {pipelineSteps.map((step, i) => (
                <motion.div key={step} variants={fadeUp} className="flex items-center gap-3">
                  <div className="gradient-border px-6 py-4 text-center min-w-[160px]">
                    <span className="text-[10px] font-[family-name:var(--font-mono)] text-muted-darker uppercase tracking-wider block mb-1">
                      Step {i + 1}
                    </span>
                    <span className="text-sm font-[family-name:var(--font-heading)] font-semibold text-foreground">
                      {step}
                    </span>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <>
                      <ArrowRight className="w-4 h-4 text-primary/50 hidden md:block" />
                      <ArrowDown className="w-4 h-4 text-primary/50 md:hidden" />
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Arrow down to collections */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-1 py-4"
            >
              <div className="w-px h-8 bg-gradient-to-b from-primary/40 to-primary/10" />
              <ArrowDown className="w-4 h-4 text-primary/40" />
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Collections grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {collections.map((col) => (
            <motion.div
              key={col.name}
              variants={fadeUp}
              className={`rounded-2xl border ${col.color} p-5 text-center transition-all duration-300 hover:translate-y-[-2px] cursor-pointer`}
            >
              <span className="text-[10px] font-[family-name:var(--font-mono)] text-muted-darker uppercase tracking-wider block mb-2">
                {col.tag}
              </span>
              <span className="text-sm font-[family-name:var(--font-heading)] font-semibold text-foreground">
                {col.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
