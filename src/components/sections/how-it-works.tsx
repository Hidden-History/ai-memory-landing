"use client";

import { motion } from "framer-motion";
import { MessageSquare, Brain, RefreshCw, Zap, ArrowRight, Cpu } from "lucide-react";
import { AnimatedSection, stagger, fadeUp } from "@/components/shared/animated-section";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "You Have a Conversation",
    description:
      "Chat with your AI as usual. Mention your role, preferences, or project details naturally.",
    color: "#22D3EE",
    bg: "rgba(34, 211, 238, 0.06)",
    border: "rgba(34, 211, 238, 0.15)",
  },
  {
    number: "02",
    icon: Brain,
    title: "Memory Gets Vectorized",
    description:
      "The hook pipeline detects memorable context, runs it through security scanning, and stores it as vectors in Qdrant.",
    color: "#00F5FF",
    bg: "rgba(0, 245, 255, 0.06)",
    border: "rgba(0, 245, 255, 0.15)",
  },
  {
    number: "03",
    icon: RefreshCw,
    title: "New Session Starts",
    description:
      "Next conversation, semantic search finds the most relevant memories from all 5 collections. No action needed.",
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.06)",
    border: "rgba(139, 92, 246, 0.15)",
  },
  {
    number: "04",
    icon: Zap,
    title: "Context Injected",
    description:
      "Progressive context injection delivers memories within your token budget — your AI adapts instantly.",
    color: "#FFB800",
    bg: "rgba(255, 184, 0, 0.06)",
    border: "rgba(255, 184, 0, 0.15)",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />

      <div className="max-w-5xl mx-auto relative">
        <AnimatedSection className="text-center mb-24">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            How It Works
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Four Steps to{" "}
            <span className="gradient-text-animated">Smarter Sessions</span>
          </h2>
        </AnimatedSection>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative p-8 rounded-2xl cursor-default transition-all duration-350 group"
                style={{
                  background: step.bg,
                  border: `1px solid ${step.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${step.color}40`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 0 40px ${step.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = step.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Step number */}
                <div
                  className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    color: step.color,
                    background: `${step.color}12`,
                    border: `1px solid ${step.color}25`,
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: `${step.color}12`,
                    border: `1px solid ${step.color}25`
                  }}
                >
                  <step.icon className="w-6.5 h-6.5" style={{ color: step.color }} />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
                >
                  {step.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Flow indicator */}
        <AnimatedSection delay={0.5}>
          <div
            className="flex items-center justify-center gap-3 mt-14 flex-wrap"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {["Conversation", "Vectorize", "Search", "Inject"].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    color: "#4A5068",
                    background: "rgba(0,245,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.1)"
                  }}
                >
                  {label}
                </span>
                {i < 3 && (
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: "rgba(0,245,255,0.3)" }} />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
