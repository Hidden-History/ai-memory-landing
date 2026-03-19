"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Cpu } from "lucide-react";

const terminalLines = [
  { text: "$ claude", color: "#E8EAF0", delay: 0 },
  { text: "Connecting to Qdrant... 5 collections loaded", color: "#4A5068", delay: 600 },
  { text: "Semantic search across 2,847 vectors", color: "#4A5068", delay: 900 },
  { text: "", color: "", delay: 1100 },
  { text: '> "Help me refactor the auth middleware"', color: "#00F5FF", delay: 1400 },
  { text: "", color: "", delay: 1700 },
  { text: "✓ code-patterns: auth middleware pattern (0.94)", color: "#00FF88", delay: 2000 },
  { text: "✓ conventions: compliance-first approach (0.91)", color: "#8B5CF6", delay: 2300 },
  { text: "✓ discussions: auth rewrite rationale (0.88)", color: "#FF2D6A", delay: 2600 },
  { text: "✓ github: PR #247 auth refactor (0.85)", color: "#22D3EE", delay: 2900 },
  { text: "", color: "", delay: 3100 },
  { text: "Found 4 relevant memories across 3 collections.", color: "#00FF88", delay: 3400 },
  { text: "Auth middleware rewritten for compliance in PR #247.", color: "#00FF88", delay: 3550 },
  { text: "Refactoring using established patterns...", color: "#00FF88", delay: 3700 },
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
    <section id="integration" className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            Integration
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Works with{" "}
            <span className="gradient-text-animated">Claude Code</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
          >
            Built for Claude Code&apos;s hook system. Start a session and your AI
            searches across all 5 collections to find exactly what it needs.
          </p>
        </AnimatedSection>

        {/* Terminal */}
        <AnimatedSection delay={0.15}>
          <div
            ref={ref}
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: "1px solid rgba(0, 245, 255, 0.12)",
              background: "rgba(5, 5, 26, 0.9)",
              boxShadow: "0 0 60px rgba(0,245,255,0.06), 0 20px 60px rgba(0,0,0,0.5)"
            }}
          >
            {/* Terminal chrome */}
            <div
              className="flex items-center gap-3 px-5 py-3.5"
              style={{
                borderBottom: "1px solid rgba(0, 245, 255, 0.08)",
                background: "rgba(0, 245, 255, 0.02)"
              }}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
              </div>
              <div className="flex-1 text-center">
                <span
                  className="text-[11px]"
                  style={{ color: "#4A5068", fontFamily: "var(--font-mono)" }}
                >
                  claude — ai-memory session
                </span>
              </div>
              <div className="w-16" />
            </div>

            {/* Terminal content */}
            <div
              className="p-7 min-h-[380px] text-sm leading-7"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {terminalLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    color: line.color,
                    minHeight: line.text === "" ? "1.5rem" : "auto"
                  }}
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
              {visibleLines > 0 && visibleLines < terminalLines.length && (
                <span
                  className="inline-block w-2 h-5 rounded-sm animate-pulse"
                  style={{ backgroundColor: "#00F5FF", marginTop: "2px" }}
                />
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
