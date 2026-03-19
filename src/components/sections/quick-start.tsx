"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Zap } from "lucide-react";

const terminalLines = [
  { text: "# 1. Clone the repo", color: "#4A5068", delay: 0 },
  { text: "$ git clone https://github.com/Hidden-History/ai-memory.git", color: "#E8EAF0", delay: 400 },
  { text: "$ cd ai-memory", color: "#E8EAF0", delay: 700 },
  { text: "", color: "", delay: 900 },
  { text: "# 2. Start Docker services", color: "#4A5068", delay: 1100 },
  { text: "$ docker compose up -d", color: "#E8EAF0", delay: 1500 },
  { text: "✓ Qdrant ready on :6333", color: "#00FF88", delay: 2000 },
  { text: "✓ Embedding service on :28080", color: "#00FF88", delay: 2200 },
  { text: "", color: "", delay: 2500 },
  { text: "# 3. Install to your project", color: "#4A5068", delay: 2700 },
  { text: "$ ./scripts/install.sh ~/projects/my-app", color: "#E8EAF0", delay: 3100 },
  { text: "", color: "", delay: 3400 },
  { text: "┌─ AI Memory Installer ─────────────────────────────┐", color: "#8B5CF6", delay: 3700 },
  { text: "│                                                     │", color: "#8B5CF6", delay: 3800 },
  { text: "│  Project: my-app                                   │", color: "#8B5CF6", delay: 3900 },
  { text: "│  Installing hooks...        ✓                      │", color: "#00FF88", delay: 4200 },
  { text: "│  Installing skills...      ✓                      │", color: "#00FF88", delay: 4400 },
  { text: "│  Testing connection...     ✓                      │", color: "#00FF88", delay: 4600 },
  { text: "│                                                     │", color: "#8B5CF6", delay: 4700 },
  { text: "└───────────────────────────────────────────────────┘", color: "#8B5CF6", delay: 4800 },
  { text: "", color: "", delay: 5100 },
  { text: "✓ AI Memory is ready. Claude will remember everything.", color: "#00FF88", delay: 5400 },
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
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Zap className="w-3.5 h-3.5" />
            Quick Start
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Up and Running in{" "}
            <span className="gradient-text-animated">3 Steps</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
          >
            Clone the repo, start Docker services, and run the installer.
            That&apos;s it — your AI will remember everything.
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
              {/* Traffic lights */}
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
                  ai-memory — terminal
                </span>
              </div>
              <div className="w-16" />
            </div>

            {/* Terminal content */}
            <div
              className="p-7 min-h-[480px] text-sm leading-7"
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
