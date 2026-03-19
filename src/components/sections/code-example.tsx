"use client";

import { useState } from "react";
import { FolderOpen, Copy, Check, Terminal } from "lucide-react";
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
  delimiter: "#3A4560",
  key: "#00F5FF",
  content: "#C8D0E0",
  highlight: "#8B5CF6",
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
      <div
        className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Cpu className="w-3.5 h-3.5" />
            Collection Format
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Qdrant <span className="gradient-text-animated">Vector Storage</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Each memory is a vector with rich payload metadata — confidence scores,
            decay rates, and semantic embeddings for instant retrieval.
          </p>
        </AnimatedSection>

        {/* Floating Terminal Window */}
        <AnimatedSection delay={0.15}>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,245,255,0.15)",
              background: "linear-gradient(135deg, rgba(8,10,28,0.98) 0%, rgba(5,7,20,0.99) 100%)",
              boxShadow:
                "0 0 0 1px rgba(0,245,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.7), 0 0 100px rgba(0,245,255,0.05)",
            }}
          >
            {/* Terminal title bar */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: "1px solid rgba(0,245,255,0.08)",
                background: "rgba(0,245,255,0.02)",
              }}
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
              </div>

              {/* Terminal icon + title */}
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" style={{ color: "#00F5FF" }} />
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "#5A6480",
                  }}
                >
                  qdrant-memory-cli
                </span>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: copied ? "rgba(0,255,136,0.1)" : "rgba(0,245,255,0.05)",
                  border: copied ? "1px solid rgba(0,255,136,0.2)" : "1px solid rgba(0,245,255,0.1)",
                  color: copied ? "#00FF88" : "#7A8AAA",
                }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Tabs bar */}
            <div
              className="flex items-center px-4 py-2 gap-1"
              style={{ borderBottom: "1px solid rgba(0,245,255,0.06)" }}
            >
              {(Object.keys(codeFiles) as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 text-xs transition-all duration-200 cursor-pointer rounded-lg"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: activeTab === tab ? "rgba(0,245,255,0.06)" : "transparent",
                    color: activeTab === tab ? "#00F5FF" : "#5A6480",
                    border: activeTab === tab ? "1px solid rgba(0,245,255,0.15)" : "1px solid transparent",
                  }}
                >
                  {codeFiles[tab].filename}
                </button>
              ))}

              {/* Blinking cursor */}
              <div className="ml-2 flex items-center gap-1">
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "#3A4560" }}
                >
                  $
                </span>
                <div
                  className="w-2 h-4 rounded-sm"
                  style={{ background: "#00F5FF", animation: "blink 1.2s step-end infinite" }}
                />
              </div>
            </div>

            {/* Code content */}
            <div
              className="p-6 overflow-x-auto"
              style={{ background: "rgba(3,4,12,0.8)" }}
            >
              <pre
                className="text-[13px] leading-7"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <code>
                  {file.lines.map((line, i) => (
                    <div
                      key={`${activeTab}-${i}`}
                      className="flex rounded transition-colors duration-150"
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,245,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span
                        className="select-none w-8 flex-shrink-0 text-right mr-6 text-xs leading-7"
                        style={{ color: "#3A4560" }}
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

            {/* File path footer */}
            <div
              className="flex items-center gap-2.5 px-5 py-3"
              style={{
                borderTop: "1px solid rgba(0,245,255,0.06)",
                background: "rgba(0,245,255,0.015)",
              }}
            >
              <FolderOpen className="w-3.5 h-3.5" style={{ color: "#5A6480" }} />
              <span
                className="text-[11px]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "#5A6480",
                }}
              >
                {file.path}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "rgba(0,245,255,0.06)",
                    border: "1px solid rgba(0,245,255,0.12)",
                    color: "#00F5FF",
                  }}
                >
                  UTF-8
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "rgba(139,92,246,0.06)",
                    border: "1px solid rgba(139,92,246,0.12)",
                    color: "#8B5CF6",
                  }}
                >
                  JSON
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Key stats below terminal */}
        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: "1536", label: "Vector Dimensions", color: "#00F5FF" },
              { value: "0.94", label: "Avg. Confidence", color: "#8B5CF6" },
              { value: "<12ms", label: "Query Latency", color: "#00FF88" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(15,20,50,0.8) 0%, rgba(10,13,35,0.9) 100%)",
                  border: `1px solid ${stat.color}15`,
                }}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)", color: stat.color }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "#5A6480" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
