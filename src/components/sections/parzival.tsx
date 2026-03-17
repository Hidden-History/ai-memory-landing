"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Users,
  ShieldCheck,
  FileCheck,
  Timer,
  ArrowRight,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const capabilities = [
  {
    icon: Users,
    title: "Agent Team Orchestration",
    description:
      "Coordinates multiple specialized agents to break down and parallelize complex tasks.",
    color: "text-blue",
    bg: "bg-blue/10",
  },
  {
    icon: ShieldCheck,
    title: "Quality Gates",
    description:
      "Automated verification steps ensure every output meets quality standards before delivery.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: FileCheck,
    title: "Verified Instructions",
    description:
      "Persistent instruction sets that survive across sessions — no repeated explanations.",
    color: "text-primary-light",
    bg: "bg-primary/10",
  },
  {
    icon: Timer,
    title: "Session Continuity",
    description:
      "Picks up exactly where you left off. Context, progress, and decisions are never lost.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export function Parzival() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/8 border border-accent/15 text-accent text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            <Bot className="w-3 h-3" />
            AI PM Agent
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Meet{" "}
            <span className="gradient-text">Parzival</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Your AI project manager that orchestrates agent teams, enforces
            quality gates, and maintains session continuity across your entire
            workflow.
          </p>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
        >
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="gradient-border p-7 group cursor-pointer transition-all duration-350 hover:translate-y-[-2px]"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${cap.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <cap.icon className={`w-5 h-5 ${cap.color}`} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection delay={0.4} className="text-center">
          <a
            href="/parzival"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-accent/10 text-accent rounded-2xl font-[family-name:var(--font-heading)] font-semibold text-lg hover:bg-accent/20 transition-all duration-300 border border-accent/15 hover:border-accent/30 cursor-pointer"
          >
            Learn More About Parzival
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
