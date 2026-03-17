"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { AnimatedSection } from "@/components/shared/animated-section";

const terminalLines = [
  { text: "$ claude", color: "text-foreground", delay: 0 },
  {
    text: "Connecting to Qdrant... 5 collections loaded",
    color: "text-muted-darker",
    delay: 600,
  },
  {
    text: "Semantic search across 2,847 vectors",
    color: "text-muted-darker",
    delay: 900,
  },
  { text: "", color: "", delay: 1100 },
  {
    text: '> "Help me refactor the auth middleware"',
    color: "text-primary-light",
    delay: 1400,
  },
  { text: "", color: "", delay: 1700 },
  {
    text: "\u2714 code-patterns: auth middleware pattern (0.94 confidence)",
    color: "text-accent",
    delay: 2000,
  },
  {
    text: "\u2714 conventions: compliance-first approach (0.91 confidence)",
    color: "text-accent",
    delay: 2300,
  },
  {
    text: "\u2714 discussions: auth rewrite rationale (0.88 confidence)",
    color: "text-accent",
    delay: 2600,
  },
  {
    text: "\u2714 github: PR #247 auth refactor (0.85 confidence)",
    color: "text-accent",
    delay: 2900,
  },
  { text: "", color: "", delay: 3100 },
  {
    text: "I found 4 relevant memories across 3 collections.",
    color: "text-green-400",
    delay: 3400,
  },
  {
    text: "The auth middleware was rewritten for compliance in PR #247.",
    color: "text-green-400",
    delay: 3550,
  },
  {
    text: "Let me refactor using the established patterns...",
    color: "text-green-400",
    delay: 3700,
  },
];

export function Integration() {
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
    <section id="integration" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Integration
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Works with{" "}
            <span className="gradient-text">Claude Code</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Built for Claude Code&apos;s hook system. Start a session and your
            AI searches across all 5 collections to find exactly what it needs.
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
                  Terminal &mdash; claude + ai-memory
                </span>
              </div>
              <div className="w-16" />
            </div>

            <div className="p-6 min-h-[380px] font-[family-name:var(--font-mono)] text-sm leading-7 bg-[#06061a]/50">
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
