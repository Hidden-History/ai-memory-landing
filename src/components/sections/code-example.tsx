"use client";

import { useState } from "react";
import { FolderOpen, Copy, Check } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

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

  const typeColor: Record<string, string> = {
    delimiter: "text-muted-darker/60",
    key: "text-primary-light",
    content: "text-foreground/75",
    highlight: "text-accent",
    blank: "",
  };

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Collection Format
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Qdrant <span className="gradient-text">Vector Storage</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Each memory is a vector with rich payload metadata — confidence
            scores, decay rates, and semantic embeddings for instant retrieval.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="gradient-border overflow-hidden glow-primary">
            <div className="flex items-center justify-between border-b border-border/50 px-1 bg-surface/30">
              <div className="flex">
                {(Object.keys(codeFiles) as TabKey[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3.5 text-xs font-[family-name:var(--font-mono)] transition-all duration-200 cursor-pointer border-b-2 ${
                      activeTab === tab
                        ? "text-primary-light border-primary bg-primary/5"
                        : "text-muted-darker hover:text-muted border-transparent"
                    }`}
                  >
                    {codeFiles[tab].filename}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="p-2.5 mr-2 text-muted-darker hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="p-6 overflow-x-auto bg-[#06061a]/50">
              <pre className="font-[family-name:var(--font-mono)] text-[13px] leading-7">
                <code>
                  {file.lines.map((line, i) => (
                    <div
                      key={`${activeTab}-${i}`}
                      className="flex hover:bg-white/[0.02] rounded"
                    >
                      <span className="select-none text-muted-darker/40 w-8 flex-shrink-0 text-right mr-6 text-xs leading-7">
                        {i + 1}
                      </span>
                      <span className={typeColor[line.type]}>
                        {line.text || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            <div className="border-t border-border/30 px-5 py-2.5 flex items-center gap-2.5 text-[11px] text-muted-darker font-[family-name:var(--font-mono)] bg-surface/20">
              <FolderOpen className="w-3 h-3" />
              {file.path}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
