"use client";

import { Brain, MessageSquare, RefreshCw, Zap, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "You Have a Conversation",
    description:
      "Chat with your AI as usual. Mention your role, preferences, or project details naturally.",
    color: "text-blue",
    bg: "bg-blue/10",
    borderColor: "border-blue/20",
  },
  {
    number: "02",
    icon: Brain,
    title: "Memory Gets Vectorized",
    description:
      "The hook pipeline detects memorable context, runs it through security scanning, and stores it as vectors in Qdrant.",
    color: "text-primary-light",
    bg: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    number: "03",
    icon: RefreshCw,
    title: "New Session Starts",
    description:
      "Next conversation, semantic search finds the most relevant memories from all 5 collections. No action needed.",
    color: "text-accent",
    bg: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    number: "04",
    icon: Zap,
    title: "Context Injected",
    description:
      "Progressive context injection delivers memories within your token budget — your AI adapts instantly.",
    color: "text-cyan",
    bg: "bg-cyan/10",
    borderColor: "border-cyan/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            How It Works
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Four Steps to{" "}
            <span className="gradient-text">Smarter Sessions</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <div className="gradient-border p-8 h-full group cursor-pointer transition-all duration-350 hover:translate-y-[-2px]">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.borderColor} flex items-center justify-center`}
                    >
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-[family-name:var(--font-mono)] text-muted-darker bg-surface/90 px-1.5 py-0.5 rounded-md border border-border">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <div className="flex items-center justify-center gap-3 mt-10 text-muted-darker">
            {["Conversation", "Vectorize", "Search", "Inject"].map(
              (label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-[family-name:var(--font-mono)]">
                    {label}
                  </span>
                  {i < 3 && <ArrowRight className="w-3 h-3" />}
                </div>
              )
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
