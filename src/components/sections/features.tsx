"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  GitBranch,
  Gauge,
  Clock,
  Github,
  Database,
  Sparkles,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const features = [
  {
    icon: Brain,
    title: "Semantic Decay",
    description:
      "Memories age naturally over time. Stale context fades while frequently accessed knowledge stays sharp — just like human memory.",
    className: "md:col-span-2 md:row-span-2",
    gradient: "from-primary/15 via-accent/5 to-transparent",
    iconBg: "bg-primary/15",
    large: true,
  },
  {
    icon: Shield,
    title: "3-Layer Security",
    description:
      "PII detection, secrets scanning, and content filtering pipeline protects every memory before storage.",
    className: "md:col-span-1",
    gradient: "from-green-500/15 via-transparent to-transparent",
    iconBg: "bg-green-500/15",
  },
  {
    icon: GitBranch,
    title: "Dual Embedding Routing",
    description:
      "Separate embedding models for code and prose — each optimized for its domain.",
    className: "md:col-span-1",
    gradient: "from-blue/15 via-transparent to-transparent",
    iconBg: "bg-blue/15",
  },
  {
    icon: Gauge,
    title: "Progressive Context Injection",
    description:
      "Token-budget-aware delivery ensures the most relevant memories fit within your context window.",
    className: "md:col-span-1",
    gradient: "from-accent/15 via-transparent to-transparent",
    iconBg: "bg-accent/15",
  },
  {
    icon: Clock,
    title: "Freshness Detection",
    description:
      "Automatically flags stale memories and surfaces the most recently relevant context.",
    className: "md:col-span-1",
    gradient: "from-cyan/10 via-transparent to-transparent",
    iconBg: "bg-cyan/15",
  },
  {
    icon: Github,
    title: "GitHub / Jira Sync",
    description:
      "Repository history and issue tracking data become searchable by meaning, not just keywords.",
    className: "md:col-span-1",
    gradient: "from-primary/10 via-transparent to-transparent",
    iconBg: "bg-primary/15",
  },
  {
    icon: Database,
    title: "5 Specialized Collections",
    description:
      "Domain-optimized Qdrant collections — code-patterns, conventions, discussions, github, and jira-data.",
    className: "md:col-span-1",
    gradient: "from-blue/10 via-transparent to-transparent",
    iconBg: "bg-blue/15",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            Features
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Memory That <span className="gradient-text">Actually Works</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Qdrant-powered vector search with semantic decay, security
            pipelines, and domain-aware embeddings &mdash; not a toy.
          </p>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`gradient-border p-7 relative overflow-hidden group cursor-pointer transition-all duration-350 hover:translate-y-[-2px] ${feature.className}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <div
                  className={`icon-glow w-12 h-12 rounded-2xl ${feature.iconBg} border border-white/5 flex items-center justify-center mb-5`}
                >
                  <feature.icon className="w-5 h-5 text-primary-light" />
                </div>
                <h3
                  className={`font-[family-name:var(--font-heading)] font-semibold mb-3 ${
                    feature.large ? "text-2xl" : "text-lg"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-muted leading-relaxed ${
                    feature.large ? "text-base" : "text-sm"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
