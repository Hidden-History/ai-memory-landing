"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Users,
  ShieldCheck,
  FileCheck,
  Timer,
  ArrowRight,
  Cpu,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const capabilities = [
  {
    icon: Users,
    title: "Agent Team Orchestration",
    description:
      "Coordinates multiple specialized agents to break down and parallelize complex tasks.",
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.08)",
    border: "rgba(139, 92, 246, 0.15)",
  },
  {
    icon: ShieldCheck,
    title: "Quality Gates",
    description:
      "Automated verification steps ensure every output meets quality standards before delivery.",
    color: "#00FF88",
    bg: "rgba(0, 255, 136, 0.06)",
    border: "rgba(0, 255, 136, 0.15)",
  },
  {
    icon: FileCheck,
    title: "Verified Instructions",
    description:
      "Persistent instruction sets that survive across sessions — no repeated explanations.",
    color: "#00F5FF",
    bg: "rgba(0, 245, 255, 0.06)",
    border: "rgba(0, 245, 255, 0.15)",
  },
  {
    icon: Timer,
    title: "Session Continuity",
    description:
      "Picks up exactly where you left off. Context, progress, and decisions are never lost.",
    color: "#FF2D6A",
    bg: "rgba(255, 45, 106, 0.06)",
    border: "rgba(255, 45, 106, 0.15)",
  },
];

export function Parzival() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: "rgba(139, 92, 246, 0.06)",
              border: "1px solid rgba(139, 92, 246, 0.2)"
            }}
          >
            <Bot className="w-3.5 h-3.5" style={{ color: "#8B5CF6" }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#8B5CF6", fontFamily: "var(--font-mono)" }}
            >
              AI PM Agent
            </span>
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet{" "}
            <span className="gradient-text-animated">Parzival</span>
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
          >
            Your AI project manager that orchestrates agent teams, enforces quality
            gates, and maintains session continuity across your entire workflow.
          </p>
        </AnimatedSection>

        {/* Capabilities grid */}
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
              className="relative p-7 rounded-2xl cursor-default transition-all duration-350 group"
              style={{
                background: cap.bg,
                border: `1px solid ${cap.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${cap.color}40`;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 40px ${cap.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = cap.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: `${cap.color}12`,
                  border: `1px solid ${cap.color}25`
                }}
              >
                <cap.icon className="w-5.5 h-5.5" style={{ color: cap.color }} />
              </div>

              {/* Title */}
              <h3
                className="font-semibold text-lg mb-2"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                {cap.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
              >
                {cap.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="text-center">
          <a
            href="/parzival"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300"
            style={{
              background: "rgba(139, 92, 246, 0.06)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              color: "#8B5CF6",
              fontFamily: "var(--font-heading)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.06)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Learn More About Parzival
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
