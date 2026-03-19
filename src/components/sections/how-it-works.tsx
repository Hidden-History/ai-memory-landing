"use client";

import { motion } from "framer-motion";
import { MessageSquare, Brain, RefreshCw, Zap, Cpu } from "lucide-react";
import { AnimatedSection, stagger, fadeUp } from "@/components/shared/animated-section";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "You Have a Conversation",
    description:
      "Chat with your AI as usual. Mention your role, preferences, or project details naturally.",
    color: "#22D3EE",
  },
  {
    number: "02",
    icon: Brain,
    title: "Memory Gets Vectorized",
    description:
      "The hook pipeline detects memorable context, runs it through security scanning, and stores it as vectors in Qdrant.",
    color: "#8B5CF6",
  },
  {
    number: "03",
    icon: RefreshCw,
    title: "New Session Starts",
    description:
      "Next conversation, semantic search finds the most relevant memories from all 5 collections. No action needed.",
    color: "#00F5FF",
  },
  {
    number: "04",
    icon: Zap,
    title: "Context Injected",
    description:
      "Progressive context injection delivers memories within your token budget — your AI adapts instantly.",
    color: "#FFB800",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.04) 0%, rgba(139,92,246,0.03) 40%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            How It Works
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Four Steps to{" "}
            <span className="gradient-text-animated">Smarter Sessions</span>
          </h2>
        </AnimatedSection>

        {/* Flowing horizontal steps */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute top-24 left-0 right-0 h-px hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.3) 15%, rgba(139,92,246,0.3) 50%, rgba(0,245,255,0.3) 85%, transparent 100%)",
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Step card */}
                <motion.div
                  className="relative p-7 rounded-2xl cursor-default transition-all duration-350 group"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                    border: `1px solid ${step.color}18`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${step.color}45`;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 0 50px ${step.color}10, 0 20px 50px rgba(0,0,0,0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${step.color}18`;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Glowing top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)`,
                      boxShadow: `0 0 12px ${step.color}40`,
                    }}
                  />

                  {/* Step number badge */}
                  <div
                    className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: step.color,
                      color: "#0A0D1A",
                      boxShadow: `0 0 15px ${step.color}50`,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mt-2"
                    style={{
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}25`,
                      boxShadow: `0 0 25px ${step.color}10 inset`,
                    }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
                  >
                    {step.description}
                  </p>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${step.color}06 0%, transparent 60%)`,
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Flow indicator chips */}
        <AnimatedSection delay={0.4}>
          <div
            className="flex items-center justify-center gap-3 mt-16 flex-wrap"
          >
            {[
              { label: "CONVERSATION", color: "#22D3EE" },
              { label: "VECTORIZE", color: "#8B5CF6" },
              { label: "SEARCH", color: "#00F5FF" },
              { label: "INJECT", color: "#FFB800" },
            ].map((label, i) => (
              <div key={label.label} className="flex items-center gap-3">
                <span
                  className="text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-widest"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: label.color,
                    background: `${label.color}0A`,
                    border: `1px solid ${label.color}25`,
                    boxShadow: `0 0 15px ${label.color}08`,
                  }}
                >
                  {label.label}
                </span>
                {i < 3 && (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ color: "#5A6480" }}
                  >
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
