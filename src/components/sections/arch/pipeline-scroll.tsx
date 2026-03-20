"use client";

import { motion } from "framer-motion";
import { GitBranch, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Design tokens ── */
const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const MAGENTA = "#FF2D6A";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const TEXT = "#E8EAF0";
const TEXT_MUTED = "#7A8AAA";
const TEXT_DIM = "#4A5568";
const BG_CARD = "#0F1428";
const BG_SURFACE = "#0A0D1A";

/* ── Pipeline steps data ── */
const PIPELINE_STEPS = [
  { step: 1, label: "CAPTURE", name: "Hook / Sync", desc: "Content arrives via Claude Code hook or sync engine. User prompts, agent responses, tool outputs, and file changes are intercepted at specific lifecycle events.", color: VIOLET },
  { step: 2, label: "LOG", name: "Activity Log", desc: "Full content is appended to an immutable JSONL audit log. This is the append-only source of truth — content is never modified or deleted from the log.", color: CYAN },
  { step: 3, label: "DETECT", name: "Content Type", desc: "Content is analyzed to detect whether it's prose, code, configuration, or mixed. This determines the chunking strategy and embedding model used downstream.", color: AMBER },
  { step: 4, label: "SCAN", name: "Security", desc: "3-layer security pipeline: Regex patterns (~1ms), detect-secrets entropy analysis (~10ms), and SpaCy NER for PII detection (~50-100ms). Any match blocks the content.", color: MAGENTA },
  { step: 5, label: "CHUNK", name: "Chunker", desc: "Intelligent content-type-aware chunking. AST-aware for code, semantic boundaries for prose, heading-based for markdown. Smart truncation preserves context.", color: CYAN },
  { step: 6, label: "EMBED", name: "Dual Model", desc: "Jina v2 dual-model routing: prose content uses the text model, code content uses the code model. Each chunk gets a 768-dimensional embedding vector.", color: VIOLET },
  { step: 7, label: "STORE", name: "Qdrant", desc: "All chunks stored in Qdrant with full metadata: group_id, type, timestamp, content_hash, is_current, authority_tier, and freshness_status.", color: GREEN },
  { step: 8, label: "ENQUEUE", name: "Queue", desc: "Chunks are enqueued for async classification. This happens after storage — the store-first architecture ensures no data loss even if classification fails.", color: AMBER },
  { step: 9, label: "CLASSIFY", name: "LLM", desc: "An LLM refines the memory type classification. Initial type detection is rule-based; this step provides semantic understanding for edge cases.", color: VIOLET },
];

const INVARIANTS = [
  "Content is always stored before classification — no data loss on downstream failure",
  "Security scanning cannot be bypassed — all content passes through all 3 layers",
  "The activity log is append-only — historical records are never mutated",
  "Embedding model selection is deterministic — same content type always routes the same way",
];

/* ── Detail boxes for specific steps ── */
function StepDetail({ step }: { step: (typeof PIPELINE_STEPS)[number] }) {
  if (step.step === 4) {
    return (
      <div
        className="mt-4 rounded-lg p-4 text-sm font-mono"
        style={{ background: `${MAGENTA}10`, border: `1px solid ${MAGENTA}20` }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span style={{ color: MAGENTA }}>L1</span>
            <span style={{ color: TEXT_MUTED }}>Regex patterns</span>
            <span className="ml-auto text-xs" style={{ color: TEXT_DIM }}>~1ms</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: MAGENTA }}>L2</span>
            <span style={{ color: TEXT_MUTED }}>detect-secrets entropy</span>
            <span className="ml-auto text-xs" style={{ color: TEXT_DIM }}>~10ms</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: MAGENTA }}>L3</span>
            <span style={{ color: TEXT_MUTED }}>SpaCy NER (PII)</span>
            <span className="ml-auto text-xs" style={{ color: TEXT_DIM }}>~50-100ms</span>
          </div>
        </div>
      </div>
    );
  }
  if (step.step === 6) {
    return (
      <div
        className="mt-4 rounded-lg p-4 text-sm font-mono"
        style={{ background: `${VIOLET}10`, border: `1px solid ${VIOLET}20` }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span style={{ color: CYAN }}>prose</span>
            <span style={{ color: TEXT_DIM }}>&rarr;</span>
            <span style={{ color: TEXT_MUTED }}>jina-embeddings-v2-base-en</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: VIOLET }}>code</span>
            <span style={{ color: TEXT_DIM }}>&rarr;</span>
            <span style={{ color: TEXT_MUTED }}>jina-embeddings-v2-base-code</span>
          </div>
          <div className="mt-2 text-xs" style={{ color: TEXT_DIM }}>
            Output: 768-dimensional vector per chunk
          </div>
        </div>
      </div>
    );
  }
  if (step.step === 7) {
    return (
      <div
        className="mt-4 rounded-lg p-4 text-sm font-mono"
        style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}20` }}
      >
        <div className="flex flex-wrap gap-2">
          {["group_id", "type", "timestamp", "content_hash", "is_current", "authority_tier", "freshness_status"].map((field) => (
            <span
              key={field}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: `${GREEN}15`, color: GREEN }}
            >
              {field}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ── CSS keyframes ── */
const keyframes = `
@keyframes pipeline-particle {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateY(100%); opacity: 0; }
}
`;

/* ── Main component ── */
export function PipelineSection() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, i) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i);
        },
        { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
      );
      observer.observe(ref);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section
      id="pipeline"
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 20%, ${VIOLET}06, transparent 70%)`,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      <div className="max-w-7xl mx-auto relative">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
            style={{
              background: `${GREEN}12`,
              color: GREEN,
              border: `1px solid ${GREEN}25`,
            }}
          >
            <GitBranch size={14} />
            Memory Processing Pipeline
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ color: TEXT, fontFamily: "var(--font-heading)" }}
          >
            9 Steps from Capture to Searchable
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: TEXT_MUTED }}
          >
            Every piece of content flows through a deterministic pipeline — from
            initial capture to fully indexed, searchable memory.
          </p>
        </motion.div>

        {/* ── Desktop Scrollytelling (≥1024px) ── */}
        <div className="hidden lg:flex gap-12">
          {/* Left column: Sticky pipeline diagram */}
          <div className="w-[40%]">
            <div
              className="sticky"
              style={{ top: 120 }}
            >
              <div className="relative flex flex-col items-center py-8">
                {/* Vertical connecting line */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: 20,
                    bottom: 20,
                    width: 2,
                    background: `linear-gradient(to bottom, ${VIOLET}, ${CYAN}, ${AMBER}, ${MAGENTA}, ${CYAN}, ${VIOLET}, ${GREEN}, ${AMBER}, ${VIOLET})`,
                    opacity: 0.2,
                  }}
                  aria-hidden="true"
                />
                {/* Active segment overlay */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{
                    top: 20,
                    height: `${((activeStep + 1) / PIPELINE_STEPS.length) * 100}%`,
                    maxHeight: "calc(100% - 40px)",
                    width: 3,
                    background: `linear-gradient(to bottom, ${PIPELINE_STEPS[0].color}, ${PIPELINE_STEPS[Math.min(activeStep, PIPELINE_STEPS.length - 1)].color})`,
                    opacity: 0.7,
                  }}
                  aria-hidden="true"
                />
                {/* Animated particles */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`particle-${i}`}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: 20,
                      bottom: 20,
                      width: 6,
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                    <div
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{
                        background: PIPELINE_STEPS[activeStep].color,
                        boxShadow: `0 0 6px ${PIPELINE_STEPS[activeStep].color}`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        animation: `pipeline-particle 4s linear ${i * 1}s infinite`,
                      }}
                    />
                  </div>
                ))}

                {/* Step nodes */}
                {PIPELINE_STEPS.map((s, i) => {
                  const isActive = i === activeStep;
                  const isCompleted = i < activeStep;
                  const isFuture = i > activeStep;

                  return (
                    <motion.div
                      key={s.step}
                      className="relative z-10 flex items-center gap-4 w-full px-6"
                      style={{ marginBottom: i < PIPELINE_STEPS.length - 1 ? 28 : 0 }}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        opacity: isFuture ? 0.4 : 1,
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {/* Node circle */}
                      <motion.div
                        className="flex-shrink-0 flex items-center justify-center rounded-xl text-sm font-bold"
                        style={{ width: 40, height: 40 }}
                        animate={{
                          background: isActive ? s.color : isCompleted ? `${s.color}30` : `${BG_CARD}`,
                          borderColor: isActive ? s.color : isCompleted ? `${s.color}60` : TEXT_DIM,
                          borderWidth: 2,
                          borderStyle: "solid",
                          color: isActive ? BG_SURFACE : isCompleted ? s.color : TEXT_DIM,
                          boxShadow: isActive
                            ? `0 0 20px ${s.color}50, 0 0 40px ${s.color}20`
                            : "0 0 0px transparent",
                        }}
                        transition={{ duration: 0.35 }}
                      >
                        {s.step}
                      </motion.div>

                      {/* Label */}
                      <div className="flex flex-col">
                        <span
                          className="text-xs font-mono tracking-wider"
                          style={{
                            color: isActive ? s.color : isCompleted ? s.color : TEXT_DIM,
                            opacity: isFuture ? 0.5 : 1,
                          }}
                        >
                          {s.label}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{
                            color: isActive ? TEXT : isCompleted ? TEXT_MUTED : TEXT_DIM,
                          }}
                        >
                          {s.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Scrollable content panels */}
          <div className="w-[60%] space-y-8">
            {PIPELINE_STEPS.map((s, i) => (
              <div
                key={s.step}
                ref={(el) => { stepRefs.current[i] = el; }}
                className="rounded-xl p-8"
                style={{
                  minHeight: 250,
                  background: BG_CARD,
                  border: `1px solid ${activeStep === i ? `${s.color}40` : `${TEXT_DIM}20`}`,
                  transition: "border-color 0.35s ease",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {/* Step badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        width: 28,
                        height: 28,
                        background: `${s.color}20`,
                        color: s.color,
                        border: `1px solid ${s.color}40`,
                      }}
                    >
                      {s.step}
                    </div>
                    <span
                      className="text-xs font-mono tracking-widest"
                      style={{ color: s.color }}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: TEXT }}
                  >
                    {s.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: TEXT_MUTED }}
                  >
                    {s.desc}
                  </p>

                  {/* Detail box for specific steps */}
                  <StepDetail step={s} />
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile Layout (<1024px) ── */}
        <div className="lg:hidden relative">
          {/* Thin vertical connecting line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-0.5"
            style={{
              background: `linear-gradient(to bottom, ${VIOLET}40, ${GREEN}40)`,
            }}
            aria-hidden="true"
          />

          <div className="space-y-6 pl-14">
            {PIPELINE_STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                className="relative rounded-xl p-6"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${TEXT_DIM}20`,
                }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                {/* Step circle on the line */}
                <div
                  className="absolute flex items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    left: -46,
                    top: 24,
                    width: 32,
                    height: 32,
                    background: `${s.color}20`,
                    color: s.color,
                    border: `2px solid ${s.color}50`,
                  }}
                >
                  {s.step}
                </div>

                {/* Step label */}
                <span
                  className="text-xs font-mono tracking-widest"
                  style={{ color: s.color }}
                >
                  {s.label}
                </span>

                {/* Step name */}
                <h3
                  className="text-xl font-bold mt-1 mb-2"
                  style={{ color: TEXT }}
                >
                  {s.name}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: TEXT_MUTED }}
                >
                  {s.desc}
                </p>

                {/* Detail box */}
                <StepDetail step={s} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Pipeline Invariants ── */}
        <motion.div
          className="mt-20 rounded-xl p-8"
          style={{
            background: BG_CARD,
            border: `1px solid ${MAGENTA}25`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 36,
                height: 36,
                background: `${MAGENTA}15`,
                border: `1px solid ${MAGENTA}30`,
              }}
            >
              <Lock size={18} color={MAGENTA} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: TEXT }}>
              Pipeline Invariants
            </h3>
          </div>
          <ul className="space-y-3">
            {INVARIANTS.map((inv, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: MAGENTA }}
                />
                <span className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {inv}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
