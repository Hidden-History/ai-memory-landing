"use client";

import { motion } from "framer-motion";
import { Particles, SectionDivider } from "@/components/shared/page-decorations";
import { CommandSearch } from "@/components/docs/command-search";
import { BentoGrid } from "@/components/docs/bento-grid";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { TerminalQuickstart } from "@/components/docs/terminal-quickstart";

export default function DocsPage() {
  return (
    <>
      {/* Background layers */}
      <div className="fixed inset-0 bg-mesh z-0" />
      <Particles />

      {/* Reading progress bar */}
      <div className="reading-progress" />

      {/* Sidebar nav (xl only) */}
      <DocsSidebar />

      <main id="main" className="relative z-10">
        {/* ── Hero: Search-first ── */}
        <section id="docs-hero" className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "rgba(0, 245, 255, 0.06)",
                  border: "1px solid rgba(0, 245, 255, 0.15)",
                  color: "#00F5FF",
                }}
              >
                Documentation
              </div>

              {/* Headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 tracking-tight"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                AI Memory{" "}
                <span className="gradient-text-animated">Docs</span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-lg max-w-2xl mx-auto leading-relaxed mb-12"
                style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
              >
                Everything you need to set up, configure, and operate AI Memory
                in production.
              </p>

              {/* Command palette search input */}
              <CommandSearch />
            </motion.div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Bento Grid: Doc Categories ── */}
        <section id="docs-grid" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <BentoGrid />
          </div>
        </section>

        <SectionDivider />

        {/* ── Terminal Quick Start ── */}
        <section id="quickstart" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                Up and Running in{" "}
                <span style={{ color: "#00FF88" }}>60 Seconds</span>
              </h2>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
              >
                Three commands. That&apos;s it.
              </p>
            </div>
            <TerminalQuickstart />
          </div>
        </section>
      </main>
    </>
  );
}
