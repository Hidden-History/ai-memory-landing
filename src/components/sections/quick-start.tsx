"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { AnimatedSection } from "@/components/shared/animated-section";

const terminalLines = [
  {
    text: "# 1. Start the stack",
    color: "text-muted-darker",
    delay: 0,
  },
  {
    text: "$ ./stack.sh start",
    color: "text-foreground",
    delay: 400,
  },
  {
    text: "Starting Qdrant...         \u2714 Ready on :6333",
    color: "text-green-400",
    delay: 900,
  },
  {
    text: "Starting Langfuse...       \u2714 Ready on :3000",
    color: "text-green-400",
    delay: 1200,
  },
  {
    text: "Starting Prometheus...     \u2714 Ready on :9090",
    color: "text-green-400",
    delay: 1500,
  },
  { text: "", color: "", delay: 1800 },
  {
    text: "# 2. Verify collections",
    color: "text-muted-darker",
    delay: 2100,
  },
  {
    text: "$ curl localhost:6333/collections | jq '.result.collections[].name'",
    color: "text-foreground",
    delay: 2500,
  },
  {
    text: '"code-patterns"',
    color: "text-primary-light",
    delay: 3000,
  },
  {
    text: '"conventions"',
    color: "text-primary-light",
    delay: 3150,
  },
  {
    text: '"discussions"',
    color: "text-primary-light",
    delay: 3300,
  },
  {
    text: '"github"',
    color: "text-primary-light",
    delay: 3450,
  },
  {
    text: '"jira-data"',
    color: "text-primary-light",
    delay: 3600,
  },
  { text: "", color: "", delay: 3800 },
  {
    text: "# 3. Install hooks",
    color: "text-muted-darker",
    delay: 4000,
  },
  {
    text: "$ claude install ai-memory",
    color: "text-foreground",
    delay: 4400,
  },
  {
    text: "\u2714 Hooks installed. AI Memory is ready.",
    color: "text-green-400",
    delay: 4900,
  },
];

export function QuickStart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = terminalLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), terminalLines[i].delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Quick Start
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Up and Running in{" "}
            <span className="gradient-text">3 Commands</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Start the Docker stack, verify your collections, and install the
            Claude Code hooks. That&apos;s it.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div
            ref={ref}
            className="gradient-border overflow-hidden glow-primary"
          >
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/30 bg-surface/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] text-muted-darker font-[family-name:var(--font-mono)]">
                  Terminal &mdash; quick start
                </span>
              </div>
              <div className="w-16" />
            </div>

            <div className="p-6 min-h-[420px] font-[family-name:var(--font-mono)] text-sm leading-7 bg-[#06061a]/50">
              {terminalLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={line.color}
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
              {visibleLines > 0 && visibleLines < terminalLines.length && (
                <span className="inline-block w-2 h-5 bg-primary-light/80 animate-pulse ml-0.5" />
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
