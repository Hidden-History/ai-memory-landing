"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { GitBranch, Lock } from "lucide-react";
import { useRef, useState } from "react";

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
      <div className="mt-5 rounded-lg p-4 text-sm font-mono" style={{ background: `${MAGENTA}10`, border: `1px solid ${MAGENTA}20` }}>
        <div className="space-y-2">
          <div className="flex items-center gap-3"><span style={{ color: MAGENTA }}>L1</span><span style={{ color: TEXT_MUTED }}>Regex patterns</span><span className="ml-auto text-xs" style={{ color: TEXT_DIM }}>~1ms</span></div>
          <div className="flex items-center gap-3"><span style={{ color: MAGENTA }}>L2</span><span style={{ color: TEXT_MUTED }}>detect-secrets entropy</span><span className="ml-auto text-xs" style={{ color: TEXT_DIM }}>~10ms</span></div>
          <div className="flex items-center gap-3"><span style={{ color: MAGENTA }}>L3</span><span style={{ color: TEXT_MUTED }}>SpaCy NER (PII)</span><span className="ml-auto text-xs" style={{ color: TEXT_DIM }}>~50-100ms</span></div>
        </div>
      </div>
    );
  }
  if (step.step === 6) {
    return (
      <div className="mt-5 rounded-lg p-4 text-sm font-mono" style={{ background: `${VIOLET}10`, border: `1px solid ${VIOLET}20` }}>
        <div className="space-y-2">
          <div className="flex items-center gap-3"><span style={{ color: CYAN }}>prose</span><span style={{ color: TEXT_DIM }}>&rarr;</span><span style={{ color: TEXT_MUTED }}>jina-embeddings-v2-base-en</span></div>
          <div className="flex items-center gap-3"><span style={{ color: VIOLET }}>code</span><span style={{ color: TEXT_DIM }}>&rarr;</span><span style={{ color: TEXT_MUTED }}>jina-embeddings-v2-base-code</span></div>
          <div className="mt-2 text-xs" style={{ color: TEXT_DIM }}>Output: 768-dimensional vector per chunk</div>
        </div>
      </div>
    );
  }
  if (step.step === 7) {
    return (
      <div className="mt-5 rounded-lg p-4 text-sm font-mono" style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}20` }}>
        <div className="flex flex-wrap gap-2">
          {["group_id", "type", "timestamp", "content_hash", "is_current", "authority_tier", "freshness_status"].map((field) => (
            <span key={field} className="px-2 py-0.5 rounded text-xs" style={{ background: `${GREEN}15`, color: GREEN }}>{field}</span>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ── Main component ── */
export function PipelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const stepProgress = useTransform(scrollYProgress, [0.02, 0.95], [0, 8]);

  useMotionValueEvent(stepProgress, "change", (v) => {
    setActiveStep(Math.round(Math.max(0, Math.min(8, v))));
  });

  const currentStep = PIPELINE_STEPS[activeStep];

  /* Card entrance variants */
  const cardVariants = {
    hidden: { opacity: 0, rotateX: 12, y: 30, scale: 0.95, filter: "blur(6px)" },
    visible: { opacity: 1, rotateX: 0, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, rotateX: -6, y: -20, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.3 } },
  };

  return (
    <>
      <section id="pipeline" ref={sectionRef} className="relative" style={{ height: "450vh" }}>
        {/* ── Sticky viewport ── */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Ambient color bloom */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${currentStep.color}06, transparent 70%)` }}
            aria-hidden="true"
          />

          {/* ── Content container ── */}
          <div className="h-full flex flex-col max-w-6xl mx-auto px-8 pt-24 pb-8">

            {/* ── Header — full size, stays visible throughout scroll ── */}
            <div className="flex-shrink-0 mb-10 text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
                style={{ background: `${GREEN}12`, color: GREEN, border: `1px solid ${GREEN}25` }}
              >
                <GitBranch size={14} />
                Memory Processing Pipeline
              </div>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
                style={{ color: TEXT, fontFamily: "var(--font-heading)" }}
              >
                9 Steps from Capture to Searchable
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
                Every piece of content flows through a deterministic pipeline — from
                initial capture to fully indexed, searchable memory.
              </p>
            </div>

            {/* ── Main layout: Progress rail + Card ── */}
            <div className="flex-1 flex gap-8 min-h-0">

              {/* ── Left: Vertical progress rail with step nodes ── */}
              <div className="hidden lg:flex flex-col items-center flex-shrink-0 py-4" style={{ width: 56 }}>
                <div className="relative flex flex-col justify-between h-full">
                  {/* Background track */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0"
                    style={{ width: 3, background: `${TEXT_DIM}15`, borderRadius: 4 }}
                    aria-hidden="true"
                  />
                  {/* Active fill */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 transition-all duration-500"
                    style={{
                      width: 3,
                      height: `${((activeStep + 0.5) / 9) * 100}%`,
                      background: `linear-gradient(to bottom, ${PIPELINE_STEPS[0].color}, ${currentStep.color})`,
                      borderRadius: 4,
                      boxShadow: `0 0 12px ${currentStep.color}30`,
                    }}
                    aria-hidden="true"
                  />

                  {/* Step nodes */}
                  {PIPELINE_STEPS.map((s, i) => {
                    const isActive = i === activeStep;
                    const isReached = i <= activeStep;

                    return (
                      <div key={i} className="relative z-10 flex items-center justify-center" style={{ width: 56, height: 40 }}>
                        {/* Pulse ring */}
                        {isActive && (
                          <div
                            className="absolute rounded-full"
                            style={{
                              width: 38, height: 38,
                              border: `1.5px solid ${s.color}`,
                              animation: "pipeline-node-pulse 2s ease-in-out infinite",
                              opacity: 0.4,
                            }}
                          />
                        )}
                        {/* Node */}
                        <motion.div
                          className="flex items-center justify-center rounded-lg text-xs font-bold"
                          style={{ width: 28, height: 28, zIndex: 2 }}
                          animate={{
                            background: isActive ? s.color : isReached ? `${s.color}25` : `${BG_CARD}`,
                            borderColor: isActive ? s.color : isReached ? `${s.color}50` : `${TEXT_DIM}40`,
                            borderWidth: 2,
                            borderStyle: "solid",
                            color: isActive ? "#030308" : isReached ? s.color : TEXT_DIM,
                            boxShadow: isActive ? `0 0 16px ${s.color}40` : "none",
                            scale: isActive ? 1.15 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {s.step}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Connecting line from rail to card ── */}
              <div className="hidden lg:flex items-center flex-shrink-0" style={{ width: 48 }}>
                <svg width="48" height="100%" viewBox="0 0 48 100" preserveAspectRatio="none" className="h-full">
                  <line
                    x1="0" y1="50" x2="48" y2="50"
                    stroke={currentStep.color}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    opacity="0.3"
                  />
                  {/* Animated dot traveling along the connector */}
                  <circle r="2.5" fill={currentStep.color} opacity="0.8">
                    <animate attributeName="cx" values="0;48;0" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="50;50;50" dur="3s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>

              {/* ── Right: Active step card ── */}
              <div className="flex-1 flex items-center min-h-0" style={{ perspective: 1000 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    className="w-full rounded-2xl p-8 lg:p-10 relative overflow-hidden"
                    style={{
                      background: "rgba(15, 20, 40, 0.55)",
                      backdropFilter: "blur(24px) saturate(140%)",
                      WebkitBackdropFilter: "blur(24px) saturate(140%)",
                      border: `1px solid ${currentStep.color}25`,
                      boxShadow: `
                        0 0 60px ${currentStep.color}06,
                        0 12px 40px rgba(0,0,0,0.35),
                        inset 0 1px 0 rgba(255,255,255,0.04)
                      `,
                    }}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${currentStep.color}50, transparent)` }}
                    />

                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                      style={{ background: `linear-gradient(to bottom, ${currentStep.color}, ${currentStep.color}30)` }}
                    />

                    {/* Step badge row */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="flex items-center justify-center rounded-xl text-lg font-bold"
                        style={{
                          width: 52, height: 52,
                          background: `${currentStep.color}15`,
                          color: currentStep.color,
                          border: `2px solid ${currentStep.color}40`,
                          boxShadow: `0 0 20px ${currentStep.color}10`,
                        }}
                      >
                        {currentStep.step}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-semibold tracking-[0.2em] block mb-0.5" style={{ color: currentStep.color }}>
                          {currentStep.label}
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-bold" style={{ color: TEXT }}>
                          {currentStep.name}
                        </h3>
                      </div>
                      <div className="ml-auto text-right hidden sm:block">
                        <span className="text-xs font-mono" style={{ color: TEXT_DIM }}>STEP</span>
                        <span className="text-2xl font-bold ml-1" style={{ color: `${currentStep.color}60` }}>{currentStep.step}</span>
                        <span className="text-sm" style={{ color: TEXT_DIM }}>/9</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-base lg:text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
                      {currentStep.desc}
                    </p>

                    {/* Detail box */}
                    <StepDetail step={currentStep} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ── Invariants — appears at scroll end ── */}
            <motion.div
              className="flex-shrink-0 mt-4"
              style={{ opacity: useTransform(scrollYProgress, [0.88, 0.96], [0, 1]) }}
            >
              <div
                className="rounded-xl p-5 flex items-start gap-4"
                style={{
                  background: "rgba(15, 20, 40, 0.45)",
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${MAGENTA}18`,
                }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-lg"
                  style={{ width: 32, height: 32, background: `${MAGENTA}12`, border: `1px solid ${MAGENTA}25` }}
                >
                  <Lock size={16} color={MAGENTA} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold mb-2 tracking-wide uppercase" style={{ color: TEXT }}>Pipeline Invariants</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                    {INVARIANTS.map((inv, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: MAGENTA }} />
                        <span className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{inv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pulse keyframe ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pipeline-node-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0; }
        }
      `}} />

      {/* ── Mobile Layout (<1024px) ── */}
      <div className="lg:hidden relative px-8 py-20">
        <div className="absolute left-9 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${VIOLET}40, ${GREEN}40)` }} aria-hidden="true" />
        <div className="space-y-6 pl-14">
          {PIPELINE_STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              className="relative rounded-xl p-6"
              style={{ background: "rgba(15,20,40,0.6)", backdropFilter: "blur(16px)", border: `1px solid ${TEXT_DIM}20` }}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="absolute flex items-center justify-center rounded-full text-xs font-bold" style={{ left: -46, top: 24, width: 32, height: 32, background: `${s.color}20`, color: s.color, border: `2px solid ${s.color}50` }}>{s.step}</div>
              <span className="text-xs font-mono tracking-widest" style={{ color: s.color }}>{s.label}</span>
              <h3 className="text-xl font-bold mt-1 mb-2" style={{ color: TEXT }}>{s.name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{s.desc}</p>
              <StepDetail step={s} />
            </motion.div>
          ))}
        </div>
        <motion.div className="mt-12 rounded-xl p-6" style={{ background: BG_CARD, border: `1px solid ${MAGENTA}25` }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: `${MAGENTA}15`, border: `1px solid ${MAGENTA}30` }}><Lock size={18} color={MAGENTA} /></div>
            <h3 className="text-lg font-bold" style={{ color: TEXT }}>Pipeline Invariants</h3>
          </div>
          <ul className="space-y-3">
            {INVARIANTS.map((inv, i) => (<li key={i} className="flex items-start gap-3"><span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: MAGENTA }} /><span className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{inv}</span></li>))}
          </ul>
        </motion.div>
      </div>
    </>
  );
}
