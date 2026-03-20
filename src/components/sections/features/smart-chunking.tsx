"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SplitSquareHorizontal } from "lucide-react";
import {
  AnimatedSection,
  fadeUp,
  slideFromLeft,
  slideFromRight,
  stagger,
} from "@/components/shared/animated-section";

/* ─── Code Block Content ──────────────────────────────────────── */

interface CodeLine {
  num: number;
  text: string;
  indent: number;
}

const chunk1Lines: CodeLine[] = [
  { num: 1, text: "class MemoryStore:", indent: 0 },
  { num: 2, text: "def __init__(self, client):", indent: 1 },
  { num: 3, text: "self.client = client", indent: 2 },
  { num: 4, text: 'self.collection = "code-patterns"', indent: 2 },
];

const chunk2Lines: CodeLine[] = [
  { num: 6, text: "def search(self, query, limit=5):", indent: 1 },
  { num: 7, text: "results = self.client.search(", indent: 2 },
  { num: 8, text: "collection=self.collection,", indent: 3 },
  { num: 9, text: "query_vector=embed(query),", indent: 3 },
  { num: 10, text: "limit=limit", indent: 3 },
  { num: 11, text: ")", indent: 2 },
  { num: 12, text: "return results", indent: 2 },
];

/* ─── Explanation Cards ───────────────────────────────────────── */

interface ExplanationCard {
  title: string;
  color: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

const explanationCards: ExplanationCard[] = [
  {
    title: "AST-Aware",
    color: "#00F5FF",
    description:
      "Code uses function/class boundaries from stdlib ast.parse()",
  },
  {
    title: "Semantic",
    color: "#8B5CF6",
    description:
      "Prose uses topic shift detection with 15% overlap",
  },
  {
    title: "Context Headers",
    color: "#00FF88",
    description: "File path, class, method, imports enrichment",
    stat: "+70.1%",
    statLabel: "Recall@5",
  },
  {
    title: "Smart Truncation",
    color: "#FFB800",
    description:
      "Error messages preserve key info, tail of stack trace only",
  },
];

/* ─── Stylized Code Block ─────────────────────────────────────── */

function CodeBlock() {
  const indentPx = 20;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(8,10,25,0.95)",
        border: "1px solid rgba(0,245,255,0.12)",
        boxShadow:
          "0 16px 48px rgba(0,0,0,0.5), 0 0 60px rgba(0,245,255,0.03)",
      }}
    >
      {/* Terminal title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{
          background: "rgba(20,25,50,0.6)",
          borderBottom: "1px solid rgba(0,245,255,0.08)",
        }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span
          className="text-[10px] ml-2 uppercase tracking-widest"
          style={{ color: "#3A4560", fontFamily: "var(--font-mono)" }}
        >
          memory_store.py
        </span>
      </div>

      <div className="p-4">
        {/* Chunk 1 boundary */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-px" style={{ background: "rgba(0,245,255,0.3)" }} />
          <span
            className="text-[9px] uppercase tracking-widest px-2"
            style={{ color: "#00F5FF", fontFamily: "var(--font-mono)" }}
          >
            Chunk 1
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(0,245,255,0.3)" }} />
        </div>

        {/* Chunk 1 lines */}
        {chunk1Lines.map((line) => (
          <div key={line.num} className="flex items-baseline gap-3">
            <span
              className="text-[11px] w-5 text-right flex-shrink-0 select-none"
              style={{ color: "#3A4560", fontFamily: "var(--font-mono)" }}
            >
              {line.num}
            </span>
            <span
              className="text-[12px] leading-6"
              style={{
                color: "#E8EAF0",
                fontFamily: "var(--font-mono)",
                paddingLeft: `${line.indent * indentPx}px`,
              }}
            >
              {line.text}
            </span>
          </div>
        ))}

        {/* Boundary labels row */}
        <div className="flex items-center gap-3 my-3 px-8">
          {["AST boundary", "512 tokens", "20% overlap"].map((label, i) => (
            <span
              key={label}
              className="text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                color: i === 0 ? "#00F5FF" : i === 1 ? "#8B5CF6" : "#FFB800",
                background:
                  i === 0
                    ? "rgba(0,245,255,0.08)"
                    : i === 1
                    ? "rgba(139,92,246,0.08)"
                    : "rgba(255,184,0,0.08)",
                border: `1px solid ${
                  i === 0
                    ? "rgba(0,245,255,0.2)"
                    : i === 1
                    ? "rgba(139,92,246,0.2)"
                    : "rgba(255,184,0,0.2)"
                }`,
                fontFamily: "var(--font-mono)",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Chunk 2 boundary */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-px" style={{ background: "rgba(139,92,246,0.3)" }} />
          <span
            className="text-[9px] uppercase tracking-widest px-2"
            style={{ color: "#8B5CF6", fontFamily: "var(--font-mono)" }}
          >
            Chunk 2
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(139,92,246,0.3)" }} />
        </div>

        {/* Chunk 2 lines */}
        {chunk2Lines.map((line) => (
          <div key={line.num} className="flex items-baseline gap-3">
            <span
              className="text-[11px] w-5 text-right flex-shrink-0 select-none"
              style={{ color: "#3A4560", fontFamily: "var(--font-mono)" }}
            >
              {line.num}
            </span>
            <span
              className="text-[12px] leading-6"
              style={{
                color: "#E8EAF0",
                fontFamily: "var(--font-mono)",
                paddingLeft: `${line.indent * indentPx}px`,
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Smart Chunking Section ──────────────────────────────────── */

export function SmartChunking() {
  return (
    <section
      id="chunking"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8 mx-auto inline-flex">
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            Intelligent Chunking
          </div>

          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Code-Aware{" "}
            <span className="gradient-text-animated">Content Division</span>
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Different content types get different treatment. AST-aware chunking
            for code preserves function boundaries. Semantic chunking for prose
            respects topic shifts.
          </p>
        </AnimatedSection>

        {/* Two-column split */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left column — Code block */}
          <motion.div
            variants={slideFromLeft}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CodeBlock />
          </motion.div>

          {/* Right column — Explanation cards */}
          <motion.div
            variants={slideFromRight}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-4"
          >
            {explanationCards.map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                className="relative p-5 rounded-xl cursor-default group transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
                  border: `1px solid ${card.color}15`,
                  borderLeft: `3px solid ${card.color}50`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${card.color}40`;
                  e.currentTarget.style.borderLeftColor = card.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${card.color}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${card.color}15`;
                  e.currentTarget.style.borderLeftColor = `${card.color}50`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${card.color}40`;
                  e.currentTarget.style.borderLeftColor = card.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${card.color}08`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${card.color}15`;
                  e.currentTarget.style.borderLeftColor = `${card.color}50`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {/* Title */}
                    <h4
                      className="text-sm font-bold mb-1"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: card.color,
                      }}
                    >
                      {card.title}
                    </h4>

                    {/* Description */}
                    <p
                      className="text-xs leading-relaxed"
                      style={{
                        color: "#7A8AAA",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* Stat (if present) */}
                  {card.stat && (
                    <div className="text-right flex-shrink-0">
                      <div
                        className="text-2xl font-bold"
                        style={{
                          fontFamily:
                            "var(--font-impact, var(--font-heading))",
                          color: card.color,
                          textShadow: `0 0 15px ${card.color}30`,
                        }}
                      >
                        {card.stat}
                      </div>
                      <div
                        className="text-[9px] uppercase tracking-widest"
                        style={{
                          color: "#5A6480",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {card.statLabel}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Logo strip */}
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6 mt-16 opacity-40 hover:opacity-70 transition-opacity">
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "#3A4560" }}
            >
              Powered by
            </span>
            <Image
              src="/logos/sentence-transformers.png"
              alt="Sentence Transformers"
              width={120}
              height={24}
              className="h-6 w-auto grayscale"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
