"use client";

import { useState } from "react";
import { FolderOpen, Copy, Check } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Cpu } from "lucide-react";

const codeFiles = {
  "code-patterns": {
    filename: "code-patterns.json",
    path: "qdrant://collections/code-patterns",
    lines: [
      { text: "{", type: "delimiter" },
      { text: '  "collection": "code-patterns",', type: "key" },
      { text: '  "purpose": "HOW — implementation patterns",', type: "key" },
      { text: '  "embedding_model": "code-optimized",', type: "key" },
      { text: '  "vector_size": 1536,', type: "key" },
      { text: '  "payload": {', type: "delimiter" },
      { text: '    "pattern": "React context + reducer for state",', type: "content" },
      { text: '    "language": "typescript",', type: "content" },
      { text: '    "confidence": 0.94,', type: "highlight" },
      { text: '    "decay_score": 0.87,', type: "highlight" },
      { text: '    "last_accessed": "2026-03-15T10:30:00Z"', type: "content" },
      { text: "  }", type: "delimiter" },
      { text: "}", type: "delimiter" },
    ],
  },
  conventions: {
    filename: "conventions.json",
    path: "qdrant://collections/conventions",
    lines: [
      { text: "{", type: "delimiter" },
      { text: '  "collection": "conventions",', type: "key" },
      { text: '  "purpose": "WHAT — team standards",', type: "key" },
      { text: '  "embedding_model": "prose-optimized",', type: "key" },
      { text: '  "payload": {', type: "delimiter" },
      { text: '    "rule": "Always use named exports",', type: "content" },
      { text: '    "scope": "project-wide",', type: "content" },
      { text: '    "source": "team-decision",', type: "content" },
      { text: '    "confidence": 0.98,', type: "highlight" },
      { text: '    "decay_score": 0.95', type: "highlight" },
      { text: "  }", type: "delimiter" },
      { text: "}", type: "delimiter" },
    ],
  },
  discussions: {
    filename: "discussions.json",
    path: "qdrant://collections/discussions",
    lines: [
      { text: "{", type: "delimiter" },
      { text: '  "collection": "discussions",', type: "key" },
      { text: '  "purpose": "WHY — decision rationale",', type: "key" },
      { text: '  "embedding_model": "prose-optimized",', type: "key" },
      { text: '  "payload": {', type: "delimiter" },
      { text: '    "decision": "Chose Qdrant over Pinecone",', type: "content" },
      { text: '    "rationale": "Self-hosted, no vendor lock-in",', type: "content" },
      { text: '    "participants": ["@parzival", "@team"],', type: "content" },
      { text: '    "confidence": 0.91,', type: "highlight" },
      { text: '    "decay_score": 0.72', type: "highlight" },
      { text: "  }", type: "delimiter" },
      { text: "}", type: "delimiter" },
    ],
  },
};

const typeColor: Record<string, string> = {
  delimiter: "#4A5068",
  key: "#00F5FF",
  content: "#E8EAF0",
  highlight: "#8B5CF6",
  blank: "#4A5068",
};

type TabKey = keyof typeof codeFiles;

export function CodeExample() {
  const [activeTab, setActiveTab] = useState<TabKey>("code-patterns");
  const [copied, setCopied] = useState(false);

  const file = codeFiles[activeTab];

  const handleCopy = () => {
    const text = file.lines.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            Collection Format
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Qdrant <span className="gradient-text-animated">Vector Storage</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
          >
            Each memory is a vector with rich payload metadata — confidence scores,
            decay rates, and semantic embeddings for instant retrieval.
          </p>
        </AnimatedSection>

        {/* Code block */}
        <AnimatedSection delay={0.15}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: "1px solid rgba(0, 245, 255, 0.12)",
              background: "rgba(5, 5, 26, 0.9)",
              boxShadow: "0 0 60px rgba(0,245,255,0.06), 0 20px 60px rgba(0,0,0,0.5)"
            }}
          >
            {/* Tabs bar */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid rgba(0, 245, 255, 0.08)" }}
            >
              <div className="flex">
                {(Object.keys(codeFiles) as TabKey[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-5 py-3 text-xs transition-all duration-200 cursor-pointer border-b-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: activeTab === tab ? "rgba(0, 245, 255, 0.05)" : "transparent",
                      borderBottomColor: activeTab === tab ? "#00F5FF" : "transparent",
                      color: activeTab === tab ? "#00F5FF" : "#4A5068"
                    }}
                  >
                    {codeFiles[tab].filename}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="p-2.5 mr-2 rounded-lg transition-all duration-200 cursor-pointer"
                style={{ color: copied ? "#00FF88" : "#4A5068" }}
                aria-label="Copy code"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Code content */}
            <div className="p-7 overflow-x-auto" style={{ background: "rgba(3, 3, 8, 0.6)" }}>
              <pre
                className="text-[13px] leading-7"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <code>
                  {file.lines.map((line, i) => (
                    <div
                      key={`${activeTab}-${i}`}
                      className="flex rounded"
                      style={{ background: "transparent" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 245, 255, 0.02)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span
                        className="select-none w-8 flex-shrink-0 text-right mr-6 text-xs leading-7"
                        style={{ color: "#4A5068", opacity: 0.5 }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ color: typeColor[line.type] }}>
                        {line.text || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* File path bar */}
            <div
              className="flex items-center gap-2.5 px-5 py-3 text-[11px]"
              style={{
                borderTop: "1px solid rgba(0, 245, 255, 0.06)",
                background: "rgba(0, 245, 255, 0.02)",
                color: "#4A5068",
                fontFamily: "var(--font-mono)"
              }}
            >
              <FolderOpen className="w-3 h-3" />
              {file.path}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
