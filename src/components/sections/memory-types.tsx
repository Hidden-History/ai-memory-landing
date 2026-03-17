"use client";

import { motion } from "framer-motion";
import { Code2, BookOpen, MessageCircle, Github, Ticket } from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const collections = [
  {
    icon: Code2,
    name: "code-patterns",
    tag: "HOW",
    description: "Implementation patterns, architecture decisions, and code idioms",
    example: "React context + reducer for complex form state",
    color: "text-blue",
    bg: "bg-blue/10",
    borderColor: "border-blue/15",
    accentDot: "bg-blue",
  },
  {
    icon: BookOpen,
    name: "conventions",
    tag: "WHAT",
    description: "Team standards, naming rules, and style preferences",
    example: "Always use named exports, no default exports",
    color: "text-primary-light",
    bg: "bg-primary/10",
    borderColor: "border-primary/15",
    accentDot: "bg-primary",
  },
  {
    icon: MessageCircle,
    name: "discussions",
    tag: "WHY",
    description: "Decision rationale, architectural reasoning, and tradeoffs",
    example: "Chose Qdrant over Pinecone — self-hosted, no vendor lock-in",
    color: "text-accent",
    bg: "bg-accent/10",
    borderColor: "border-accent/15",
    accentDot: "bg-accent",
  },
  {
    icon: Github,
    name: "github",
    tag: "WHEN",
    description: "Commit history, PR discussions, and repo activity searchable by meaning",
    example: "Auth refactor PR #247 — compliance-driven rewrite",
    color: "text-cyan",
    bg: "bg-cyan/10",
    borderColor: "border-cyan/15",
    accentDot: "bg-cyan",
  },
  {
    icon: Ticket,
    name: "jira-data",
    tag: "JIRA",
    description: "Issue tracking data, sprint context, and project planning",
    example: "INGEST-142: Pipeline timeout on large payloads",
    color: "text-green-400",
    bg: "bg-green-500/10",
    borderColor: "border-green-500/15",
    accentDot: "bg-green-500",
  },
];

export function MemoryTypes() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Collections
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            5 Qdrant Collections,{" "}
            <span className="gradient-text">One System</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Each collection is domain-optimized with its own embedding model,
            decay rules, and search configuration.
          </p>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {collections.map((col, i) => (
            <motion.div
              key={col.name}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`gradient-border p-6 group cursor-pointer transition-all duration-350 hover:translate-y-[-2px] ${
                i >= 3 ? "sm:col-span-1" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${col.bg} border ${col.borderColor} flex items-center justify-center flex-shrink-0`}
                >
                  <col.icon className={`w-5 h-5 ${col.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg">
                      {col.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-[family-name:var(--font-mono)] text-muted-darker border border-border">
                      {col.tag}
                    </span>
                  </div>
                  <p className="text-muted text-sm mb-3 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-muted-darker">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${col.accentDot}`}
                    />
                    <span className="italic truncate">
                      &quot;{col.example}&quot;
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
