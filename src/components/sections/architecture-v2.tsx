"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Brain, Shield, Zap, GitBranch } from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const MAGENTA = "#FF2D6A";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const DEEP_BG = "#030308";

// ─── Particle Mesh Canvas ───────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

function ParticleMesh({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const colors = [CYAN, VIOLET, MAGENTA];
    const particles: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      color: colors[i % colors.length],
      opacity: Math.random() * 0.4 + 0.1,
    }));
    particlesRef.current = particles;

    let frame = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      frame++;

      // Move particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        // Pulse
        const pulse = Math.sin(frame * 0.02 + p.id) * 0.1 + 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * pulse;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────

export function ArchitectureHero() {
  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Banner image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/ai-memory-3.png')",
          filter: "brightness(0.35) saturate(0.7)",
        }}
      />

      {/* Deep gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,3,8,0.6) 0%, rgba(3,3,8,0.1) 30%, rgba(3,3,8,0.1) 60%, rgba(3,3,8,0.95) 100%)",
        }}
      />

      {/* Particle mesh layered on top */}
      <div className="absolute inset-0 z-10">
        <ParticleMesh className="opacity-60" />
      </div>

      {/* Neural grid overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Label */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: "rgba(0,245,255,0.06)",
              border: "1px solid rgba(0,245,255,0.2)",
              boxShadow: "0 0 30px rgba(0,245,255,0.08) inset",
            }}
          >
            <Cpu className="w-3.5 h-3.5" style={{ color: CYAN }} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: CYAN,
                letterSpacing: "0.2em",
              }}
            >
              Core Architecture Principle V3.5
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl mb-6 leading-[1.05]"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            background: `linear-gradient(135deg, #E8EAF0 0%, ${CYAN} 50%, ${VIOLET} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Right Information
          <br />
          <span style={{ color: CYAN }}>at the Right Time</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl text-base sm:text-lg leading-relaxed mb-12"
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(232,234,240,0.55)",
          }}
        >
          A signal-triggered retrieval system — not random memory injection.
          5 specialized collections. 6 automatic triggers. 9-step security pipeline.
          Built on Qdrant with temporal decay, dual embeddings, and GitHub/Jira sync.
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { value: "5", label: "Collections", color: CYAN },
            { value: "6", label: "Auto Triggers", color: VIOLET },
            { value: "9", label: "Pipeline Steps", color: GREEN },
            { value: "v3.5", label: "Architecture", color: MAGENTA },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{
                background: "rgba(10,13,30,0.7)",
                border: `1px solid ${stat.color}25`,
                backdropFilter: "blur(16px)",
                boxShadow: `0 0 30px ${stat.color}08 inset`,
              }}
            >
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: stat.color,
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "rgba(232,234,240,0.5)",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span
          className="text-[9px] uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-mono)", color: "rgba(0,245,255,0.35)" }}
        >
          Scroll
        </span>
        <div
          className="w-px h-8 rounded-full"
          style={{
            background: `linear-gradient(180deg, rgba(0,245,255,0.5), transparent)`,
            boxShadow: "0 0 8px rgba(0,245,255,0.3)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
      </motion.div>
    </section>
  );
}

// ─── Principle Section ─────────────────────────────────────────────────────

export function ArchitecturePrinciple() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,245,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="section-label">
            <Zap className="w-3.5 h-3.5" />
            Foundational Principle
          </div>
        </motion.div>

        {/* Large typographic statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p
            className="leading-[1.15] mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#E8EAF0",
            }}
          >
            Instead of injecting{" "}
            <span
              style={{
                color: MAGENTA,
                textShadow: "0 0 40px rgba(255,45,106,0.4)",
              }}
            >
              random memories
            </span>{" "}
            <br className="hidden sm:block" />
            at session start,
          </p>
          <p
            className="leading-[1.15]"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            it uses{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px rgba(0,245,255,0.3))",
              }}
            >
              signal-triggered retrieval
            </span>
            <br className="hidden sm:block" />
            <span style={{ color: "rgba(232,234,240,0.4)" }}>
              {" "}
              when specific events occur.
            </span>
          </p>
        </motion.div>

        {/* Sub explanation */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 max-w-2xl mx-auto text-sm leading-relaxed"
          style={{
            fontFamily: "var(--font-body)",
            color: "#7A8AAA",
          }}
        >
          High signal-to-noise ratio. The system acts on precise triggers — error patterns,
          naming conventions, decision keywords, best practice queries. Memory surfaces
          when it is{" "}
          <span style={{ color: CYAN, fontWeight: 500 }}>relevant</span>, not when it is{" "}
          <span style={{ color: MAGENTA, fontWeight: 500 }}>present</span>.
        </motion.p>

        {/* Decorative pulse ring */}
        <div className="relative mt-16 inline-block">
          <div
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
            style={{
              background: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.15)",
              boxShadow: "0 0 60px rgba(0,245,255,0.08) inset",
            }}
          >
            <Brain className="w-8 h-8" style={{ color: CYAN }} />
          </div>
          <div
            className="absolute inset-0 rounded-full animate-ping-slow"
            style={{
              border: "1px solid rgba(0,245,255,0.15)",
              animationDuration: "4s",
            }}
          />
          <div
            className="absolute inset-[-20px] rounded-full animate-ping-slow"
            style={{
              border: "1px solid rgba(0,245,255,0.06)",
              animationDuration: "5s",
              animationDelay: "1s",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Collections Diagram ────────────────────────────────────────────────────

const collectionData = {
  core: [
    {
      name: "code-patterns",
      tag: "HOW",
      color: CYAN,
      desc: "Implementation, error_fix, refactor, file_pattern",
      types: ["implementation", "error_fix", "refactor", "file_pattern"],
    },
    {
      name: "conventions",
      tag: "WHAT",
      color: VIOLET,
      desc: "Rules, guidelines, naming, port, structure",
      types: ["rule", "guideline", "naming", "port", "structure"],
    },
    {
      name: "discussions",
      tag: "WHY",
      color: MAGENTA,
      desc: "Decisions, sessions, blockers, preferences",
      types: [
        "decision",
        "session",
        "blocker",
        "preference",
        "github_issue",
        "github_pr",
        "github_commit",
        "github_code_blob",
      ],
    },
  ],
  conditional: [
    {
      name: "jira-data",
      tag: "JIRA",
      color: AMBER,
      desc: "Issues + comments, conditional on jira_sync_enabled",
      types: ["jira_issue", "jira_comment"],
    },
  ],
};

function CollectionNode({
  name,
  tag,
  color,
  desc,
  types,
  delay = 0,
}: {
  name: string;
  tag: string;
  color: string;
  desc: string;
  types: string[];
  delay?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,13,30,0.8)",
        border: `1px solid ${color}18`,
        boxShadow: `0 0 0 1px ${color}06 inset`,
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
      />

      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                style={{
                  background: `${color}12`,
                  color: color,
                  fontFamily: "var(--font-mono)",
                  border: `1px solid ${color}25`,
                }}
              >
                {tag}
              </span>
            </div>
            <div
              className="text-sm font-semibold mb-1"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#E8EAF0",
              }}
            >
              {name}
            </div>
            <div className="text-xs leading-relaxed" style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}>
              {desc}
            </div>
          </div>
          <div
            className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-transform duration-200 mt-0.5"
            style={{ color: "#7A8AAA", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded types */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden border-t"
          style={{ borderColor: `${color}10` }}
        >
          <div className="p-4 flex flex-wrap gap-2">
            {types.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-1 rounded-lg font-mono"
                style={{
                  background: `${color}08`,
                  color: color,
                  border: `1px solid ${color}15`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function ArchitectureCollections() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-6">
            <Database className="w-3.5 h-3.5" />
            Collection Organization
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            3 Core + 2 Conditional
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#7A8AAA" }}>
            Maps to three fundamental question types:{" "}
            <span style={{ color: CYAN }}>HOW</span> things are built,{" "}
            <span style={{ color: VIOLET }}>WHAT</span> rules to follow,{" "}
            <span style={{ color: MAGENTA }}>WHY</span> decisions were made.
          </p>
        </motion.div>

        {/* Core collections */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-3"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(232,234,240,0.35)",
              background: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.1)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
            />
            Core Collections — Always Active
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {collectionData.core.map((col, i) => (
            <CollectionNode key={col.name} {...col} delay={i * 0.08} />
          ))}
        </div>

        {/* Conditional collections */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(232,234,240,0.35)",
              background: "rgba(139,92,246,0.04)",
              border: "1px solid rgba(139,92,246,0.1)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: AMBER, boxShadow: `0 0 6px ${AMBER}` }}
            />
            Conditional — Requires Feature Flag
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {collectionData.conditional.map((col, i) => (
            <CollectionNode key={col.name} {...col} delay={i * 0.08} />
          ))}
        </div>

        {/* Qdrant config note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 p-4 rounded-2xl"
          style={{
            background: "rgba(0,245,255,0.03)",
            border: "1px solid rgba(0,245,255,0.08)",
          }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GREEN }} />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: GREEN, fontFamily: "var(--font-mono)" }}>
                HNSW + Scalar Quantization
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                m=16, ef_construct=100, int8 quantization with 0.99 quantile.
                4x compression at ~99% accuracy. All vectors{" "}
                <code style={{ color: CYAN }}>on_disk=True</code>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pipeline Flow ─────────────────────────────────────────────────────────

const pipelineSteps = [
  {
    step: 1,
    label: "CAPTURE",
    name: "Hook Event / Sync",
    desc: "Content arrives via Claude Code hook or sync engine",
    detail: "Hooks: user_prompt, agent_response, post_tool, error_pattern, pre_compact",
    color: VIOLET,
    icon: Brain,
  },
  {
    step: 2,
    label: "LOG",
    name: "Activity Log",
    desc: "Full content → activity log (audit, never modified)",
    detail: "append-only JSONL. Preserves raw input for forensic replay.",
    color: CYAN,
    icon: Database,
  },
  {
    step: 3,
    label: "DETECT",
    name: "Content Type",
    desc: "Content type detection: prose, code, config, etc.",
    detail: "Determines chunking strategy and embedding model routing",
    color: AMBER,
    icon: Cpu,
  },
  {
    step: 4,
    label: "SCAN",
    name: "Security Scanner",
    desc: "3-layer PII/secrets scan",
    detail: "Regex → detect-secrets entropy → SpaCy NER. PASS / MASK / BLOCK",
    color: MAGENTA,
    icon: Shield,
  },
  {
    step: 5,
    label: "CHUNK",
    name: "IntelligentChunker",
    desc: "Content-type-aware chunking with metadata",
    detail: "Hook provides type. Chunker selects strategy. Produces 1-N chunks.",
    color: CYAN,
    icon: GitBranch,
  },
  {
    step: 6,
    label: "EMBED",
    name: "Dual Model Embedding",
    desc: "Jina v2 prose or code model per chunk",
    detail: "prose → natural language. code model → code-patterns, github_code_blob",
    color: VIOLET,
    icon: Zap,
  },
  {
    step: 7,
    label: "STORE",
    name: "Qdrant Ingest",
    desc: "All chunks → Qdrant with full metadata",
    detail: "group_id, type, timestamp, content_hash, is_current, authority_tier",
    color: GREEN,
    icon: Database,
  },
  {
    step: 8,
    label: "ENQUEUE",
    name: "Queue Worker",
    desc: "Chunk point_ids queued for async classification",
    detail: "Non-blocking. Does not slow down capture.",
    color: AMBER,
    icon: Cpu,
  },
  {
    step: 9,
    label: "CLASSIFY",
    name: "LLM Classifier",
    desc: "Rule filter → LLM → refines type on stored chunks",
    detail: "Refines type AFTER storage. Async via queue worker.",
    color: VIOLET,
    icon: Brain,
  },
];

function PipelineStepCard({ step, index }: { step: (typeof pipelineSteps)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative"
    >
      {/* Connector line */}
      {index < pipelineSteps.length - 1 && (
        <div
          className="absolute left-6 top-full w-px z-10"
          style={{
            height: "24px",
            background: `linear-gradient(to bottom, ${step.color}30, ${pipelineSteps[index + 1].color}20)`,
          }}
        />
      )}

      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        style={{
          background: "rgba(10,13,30,0.7)",
          border: `1px solid ${step.color}15`,
          transition: "all 0.3s ease",
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${step.color}35`;
          e.currentTarget.style.boxShadow = `0 0 40px ${step.color}08`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${step.color}15`;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
          style={{ background: step.color, boxShadow: `0 0 8px ${step.color}60` }}
        />

        <div className="flex items-start gap-4 p-4 pl-5">
          {/* Step number */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: `${step.color}12`,
              border: `1px solid ${step.color}25`,
            }}
          >
            <span
              className="text-[10px] font-bold"
              style={{ color: step.color, fontFamily: "var(--font-mono)" }}
            >
              {step.step}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: step.color, fontFamily: "var(--font-mono)" }}
                >
                  {step.label}
                </span>
              </div>
              <span
                className="text-xs font-semibold"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                {step.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-1" style={{ color: "#7A8AAA" }}>
              {step.desc}
            </p>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 pt-2 border-t"
                style={{ borderColor: `${step.color}10` }}
              >
                <p
                  className="text-[11px] font-mono leading-relaxed"
                  style={{ color: step.color, opacity: 0.8 }}
                >
                  {step.detail}
                </p>
              </motion.div>
            )}
          </div>

          {/* Expand indicator */}
          <div
            className="flex-shrink-0 text-[10px] transition-transform duration-200 mt-1"
            style={{
              color: "#7A8AAA",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ArchitecturePipeline() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,92,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-6">
            <GitBranch className="w-3.5 h-3.5" />
            Memory Processing Pipeline
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            9 Steps from Capture to Searchable
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#7A8AAA" }}>
            Every memory — whether from a Claude Code hook or a sync engine — follows
            the same immutable pipeline. Store-first architecture ensures no data loss.
          </p>
        </motion.div>

        {/* Pipeline steps */}
        <div className="flex flex-col gap-3">
          {pipelineSteps.map((step, i) => (
            <PipelineStepCard key={step.step} step={step} index={i} />
          ))}
        </div>

        {/* Key invariants */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 p-5 rounded-2xl"
          style={{
            background: "rgba(255,45,106,0.04)",
            border: "1px solid rgba(255,45,106,0.1)",
          }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MAGENTA }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-2" style={{ color: MAGENTA, fontFamily: "var(--font-mono)" }}>
                Pipeline Invariants
              </p>
              <ul className="space-y-1.5">
                {[
                  "Full content ALWAYS logged (activity log is append-only, never modified)",
                  "BLOCKED content discarded — not stored, but still logged",
                  "Classification runs async — never blocks capture",
                  "Embedding model selected by content type (prose vs code)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#7A8AAA" }}>
                    <span style={{ color: MAGENTA }} className="flex-shrink-0 mt-0.5">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Hook Classification ───────────────────────────────────────────────────

const captureHooks = [
  { name: "user_prompt_capture.py", trigger: "UserPromptSubmit", collection: "discussions", type: "user_message" },
  { name: "agent_response_capture.py", trigger: "Stop", collection: "discussions", type: "agent_response" },
  { name: "post_tool_capture.py", trigger: "PostToolUse (Edit|Write)", collection: "code-patterns", type: "implementation" },
  { name: "error_pattern_capture.py", trigger: "PostToolUse (Bash)", collection: "code-patterns", type: "error_fix" },
  { name: "pre_compact_save.py", trigger: "PreCompact", collection: "discussions", type: "session" },
];

const retrievalHooks = [
  { name: "error_detection.py", trigger: "PostToolUse (Bash)", collection: "code-patterns", type: "error_fix" },
  { name: "new_file_trigger.py", trigger: "PreToolUse (Write)", collection: "conventions", type: "naming, structure" },
  { name: "first_edit_trigger.py", trigger: "PreToolUse (Edit)", collection: "code-patterns", type: "file_pattern" },
  { name: "context_injection_tier2.py", trigger: "UserPromptSubmit", collection: "discussions, conventions", type: "decision, guideline, session" },
  { name: "session_start.py", trigger: "SessionStart (resume|compact)", collection: "discussions, conventions", type: "session, guideline, decision" },
];

function HookCard({ hook, side, index }: { hook: (typeof captureHooks)[0]; side: "capture" | "retrieval"; index: number }) {
  const color = side === "capture" ? AMBER : CYAN;
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "capture" ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="p-3.5 rounded-xl"
      style={{
        background: `${color}04`,
        border: `1px solid ${color}12`,
      }}
    >
      <div className="text-[10px] font-mono font-semibold mb-1.5 truncate" style={{ color: color }}>
        {hook.name}
      </div>
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${color}10`, color: `${color}80`, fontFamily: "var(--font-mono)" }}>
            TRIGGER
          </span>
          <span className="text-[10px] truncate" style={{ color: "#7A8AAA" }}>{hook.trigger}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${color}10`, color: `${color}80`, fontFamily: "var(--font-mono)" }}>
            TYPE
          </span>
          <span className="text-[10px] truncate" style={{ color: "#7A8AAA" }}>{hook.type}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function ArchitectureHooks() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Divider glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.02), transparent)" }}
      />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-6">
            <Brain className="w-3.5 h-3.5" />
            Hook Classification
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            CAPTURE vs Retrieval
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#7A8AAA" }}>
            Hooks are classified by function: CAPTURE stores to memory, RETRIEVAL queries it.
            Each runs at precise lifecycle events in Claude Code.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CAPTURE */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-mono)",
                color: AMBER,
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: AMBER, boxShadow: `0 0 6px ${AMBER}` }}
              />
              CAPTURE — Store to Database
            </div>
            <div className="flex flex-col gap-2">
              {captureHooks.map((hook, i) => (
                <HookCard key={hook.name} hook={hook} side="capture" index={i} />
              ))}
            </div>
          </div>

          {/* RETRIEVAL */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5"
              style={{
                fontFamily: "var(--font-mono)",
                color: CYAN,
                background: "rgba(0,245,255,0.08)",
                border: "1px solid rgba(0,245,255,0.2)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
              />
              RETRIEVAL — Query Database
            </div>
            <div className="flex flex-col gap-2">
              {retrievalHooks.map((hook, i) => (
                <HookCard key={hook.name} hook={hook} side="retrieval" index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Triggers Section ─────────────────────────────────────────────────────

const triggers = [
  {
    num: 1,
    name: "Error Detection",
    hook: "PostToolUse (Bash)",
    capture: "error_pattern_capture.py",
    retrieve: "error_detection.py",
    collection: "code-patterns",
    filter: 'type="error_fix"',
    signal: 'error text, "Exception:", "Traceback", exit != 0',
    color: MAGENTA,
    waveform: [0.3, 0.6, 0.4, 0.8, 0.2, 0.9, 0.5],
  },
  {
    num: 2,
    name: "New File Creation",
    hook: "PreToolUse (Write)",
    capture: "—",
    retrieve: "new_file_trigger.py",
    collection: "conventions",
    filter: 'type IN (naming, structure)',
    signal: "Write tool, file does not exist",
    color: CYAN,
    waveform: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  },
  {
    num: 3,
    name: "First Edit to File",
    hook: "PreToolUse (Edit)",
    capture: "post_tool_capture.py",
    retrieve: "first_edit_trigger.py",
    collection: "code-patterns",
    filter: 'type="file_pattern"',
    signal: "First edit to file in session",
    color: VIOLET,
    waveform: [0.2, 0.4, 0.6, 0.8, 0.7, 0.5, 0.3],
  },
  {
    num: 4,
    name: "Decision Keywords",
    hook: "UserPromptSubmit",
    capture: "—",
    retrieve: "context_injection_tier2.py",
    collection: "discussions",
    filter: 'type="decision"',
    signal: '"why did we", "what was decided", "remember when"',
    color: GREEN,
    waveform: [0.1, 0.3, 0.5, 0.4, 0.6, 0.3, 0.2],
  },
  {
    num: 5,
    name: "Best Practices Keywords",
    hook: "UserPromptSubmit",
    capture: "—",
    retrieve: "context_injection_tier2.py",
    collection: "conventions",
    filter: 'type="guideline"',
    signal: '"best practice", "convention", "how should I"',
    color: AMBER,
    waveform: [0.4, 0.7, 0.3, 0.9, 0.2, 0.6, 0.4],
  },
  {
    num: 6,
    name: "Session History Keywords",
    hook: "UserPromptSubmit",
    capture: "pre_compact_save.py",
    retrieve: "context_injection_tier2.py",
    collection: "discussions",
    filter: 'type="session"',
    signal: '"what have we done", "project status", "what\'s next"',
    color: CYAN,
    waveform: [0.6, 0.3, 0.8, 0.2, 0.7, 0.4, 0.5],
  },
];

function Waveform({ bars, color }: { bars: number[]; color: string }) {
  return (
    <div className="flex items-end gap-px h-6">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full animate-pulse"
          style={{
            height: `${h * 100}%`,
            background: color,
            opacity: 0.4 + h * 0.4,
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${1.5 + h}s`,
          }}
        />
      ))}
    </div>
  );
}

function TriggerCard({ trigger, index }: { trigger: (typeof triggers)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,13,30,0.7)",
        border: `1px solid ${trigger.color}12`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${trigger.color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${trigger.color}12`;
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        {/* Waveform */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${trigger.color}10`,
            border: `1px solid ${trigger.color}20`,
          }}
        >
          <Waveform bars={trigger.waveform} color={trigger.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-mono font-bold"
              style={{ color: trigger.color }}
            >
              TRIGGER {trigger.num}
            </span>
          </div>
          <div
            className="text-sm font-semibold mb-0.5"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            {trigger.name}
          </div>
          <div className="text-[10px] truncate" style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}>
            {trigger.hook}
          </div>
        </div>

        <div
          className="flex-shrink-0 text-[10px] transition-transform duration-200 mt-1"
          style={{
            color: "#7A8AAA",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </div>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t p-4 grid grid-cols-2 gap-3"
          style={{ borderColor: `${trigger.color}10` }}
        >
          {[
            { label: "CAPTURE", value: trigger.capture },
            { label: "RETRIEVE", value: trigger.retrieve },
            { label: "COLLECTION", value: trigger.collection },
            { label: "FILTER", value: trigger.filter },
            { label: "SIGNAL", value: trigger.signal, span: true },
          ].map((row) => (
            <div key={row.label} className={row.span ? "col-span-2" : ""}>
              <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: `${trigger.color}60` }}>
                {row.label}
              </div>
              <div className="text-[11px] font-mono leading-relaxed" style={{ color: "#7A8AAA" }}>
                {row.value}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export function ArchitectureTriggers() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,245,255,0.02) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-6">
            <Zap className="w-3.5 h-3.5" />
            Automatic Triggers
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            6 Signal-Based Triggers
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#7A8AAA" }}>
            The system acts on precise signals — not on every user message or every tool use.
            High signal-to-noise ratio ensures memory surfaces when relevant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {triggers.map((trigger, i) => (
            <TriggerCard key={trigger.num} trigger={trigger} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Triple Fusion ────────────────────────────────────────────────────────

function FusionNode({
  label,
  sub,
  color,
  x,
  y,
  size = "md",
}: {
  label: string;
  sub: string;
  color: string;
  x: number;
  y: number;
  size?: "sm" | "md" | "lg";
}) {
  const s = size === "lg" ? 52 : size === "sm" ? 36 : 44;
  const fontSize = size === "lg" ? "text-xs" : size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div
      className="absolute flex flex-col items-center justify-center rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        width: s,
        height: s,
        background: `radial-gradient(circle at 35% 35%, ${color}18, rgba(3,3,8,0.9))`,
        border: `1.5px solid ${color}40`,
        boxShadow: `0 0 30px ${color}15, 0 0 60px ${color}08 inset`,
        zIndex: 2,
      }}
    >
      <span className={`font-bold ${fontSize} uppercase tracking-wider`} style={{ color, fontFamily: "var(--font-mono)" }}>
        {label}
      </span>
      {size !== "sm" && (
        <span className="text-[8px] mt-0.5" style={{ color: `${color}80`, fontFamily: "var(--font-mono)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function FusionArrow({ from, to, color }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <line
        x1={`${from.x}%`} y1={`${from.y}%`}
        x2={`${to.x}%`} y2={`${to.y}%`}
        stroke={`url(#grad-${color.replace("#", "")})`}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        style={{
          filter: `drop-shadow(0 0 4px ${color}40)`,
          animation: "dash-flow 2s linear infinite",
        }}
      />
    </svg>
  );
}

export function ArchitectureTripleFusion() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-6">
            <Cpu className="w-3.5 h-3.5" />
            Triple Fusion Hybrid Search
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            Dense + Sparse + Late Interaction
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#7A8AAA" }}>
            Three complementary search modalities combined via Qdrant&apos;s native
            Reciprocal Rank Fusion (RRF). v2.2.1 introduced ColBERT opt-in.
          </p>
        </motion.div>

        {/* Fusion diagram */}
        <div
          className="relative w-full mx-auto mb-12"
          style={{ height: "320px" }}
        >
          {/* Arrows */}
          <FusionArrow from={{ x: 20, y: 25 }} to={{ x: 42, y: 50 }} color={CYAN} />
          <FusionArrow from={{ x: 50, y: 10 }} to={{ x: 50, y: 38 }} color={VIOLET} />
          <FusionArrow from={{ x: 80, y: 25 }} to={{ x: 58, y: 50 }} color={GREEN} />
          <FusionArrow from={{ x: 42, y: 62 }} to={{ x: 50, y: 78 }} color={MAGENTA} />
          <FusionArrow from={{ x: 58, y: 62 }} to={{ x: 50, y: 78 }} color={MAGENTA} />

          {/* Dense node */}
          <FusionNode label="Dense" sub="Jina v2 EN/Code" color={CYAN} x={20} y={25} />
          {/* Sparse node */}
          <FusionNode label="Sparse" sub="BM25 / FastEmbed" color={VIOLET} x={50} y={10} size="lg" />
          {/* Late Interaction node */}
          <FusionNode label="Late" sub="ColBERT v2 (opt-in)" color={GREEN} x={80} y={25} />
          {/* RRF node */}
          <FusionNode label="RRF" sub="Fused" color={MAGENTA} x={50} y={78} size="lg" />

          {/* Labels */}
          <div className="absolute" style={{ left: "20%", top: "14%", transform: "translate(-50%, -50%)" }}>
            <span className="text-[9px] font-mono" style={{ color: CYAN, opacity: 0.6 }}>768d vectors</span>
          </div>
          <div className="absolute" style={{ left: "50%", top: "2%", transform: "translate(-50%, -50%)" }}>
            <span className="text-[9px] font-mono" style={{ color: VIOLET, opacity: 0.6 }}>named "bm25"</span>
          </div>
          <div className="absolute" style={{ left: "80%", top: "14%", transform: "translate(-50%, -50%)" }}>
            <span className="text-[9px] font-mono" style={{ color: GREEN, opacity: 0.6 }}>token-level</span>
          </div>

          {/* Layer labels */}
          <div className="absolute left-0 right-0 flex justify-between px-8" style={{ top: "88%" }}>
            <span className="text-[9px] font-mono" style={{ color: "#3D4A5C" }}>Dense prefetch → decay → RRF</span>
            <span className="text-[9px] font-mono" style={{ color: "#3D4A5C" }}>DEC-062: decay BEFORE fusion</span>
          </div>
        </div>

        {/* 4-path composition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { path: "1", label: "Best Quality", desc: "[dense→decay, sparse] → RRF", color: CYAN, badge: "HYBRID+DECAY" },
              { path: "2", label: "Hybrid Only", desc: "[dense, sparse] → RRF", color: VIOLET, badge: "HYBRID" },
              { path: "3", label: "Decay Only", desc: "Dense with decay reranking", color: AMBER, badge: "DECAY" },
              { path: "4", label: "Plain Dense", desc: "Cosine similarity fallback", color: "rgba(232,234,240,0.3)", badge: "DENSE" },
            ].map((p) => (
              <div
                key={p.path}
                className="p-3 rounded-xl"
                style={{
                  background: `${p.color}06`,
                  border: `1px solid ${p.color}18`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: p.color }}
                  >
                    PATH {p.path}
                  </span>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded font-mono"
                    style={{ background: `${p.color}12`, color: `${p.color}80` }}
                  >
                    {p.badge}
                  </span>
                </div>
                <div className="text-xs font-semibold mb-1" style={{ color: "#E8EAF0", fontFamily: "var(--font-heading)" }}>
                  {p.label}
                </div>
                <div className="text-[10px] font-mono leading-relaxed" style={{ color: "#7A8AAA" }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Reference Table ───────────────────────────────────────────────────────

const referenceGroups = [
  {
    group: "Source of Truth",
    docs: [
      { title: "Chunking-Strategy-V2.md", desc: "AST, semantic, markdown, late chunking, smart truncation" },
      { title: "Memory-System-Components-V1.md", desc: "Access, Processing, Storage layers" },
      { title: "Temporal-Awareness-V1.md", desc: "Decay scoring + freshness detection" },
      { title: "Security-Pipeline-V1.md", desc: "3-layer scanning, graduated trust, SOPS encryption" },
    ],
    color: MAGENTA,
  },
  {
    group: "Integration",
    docs: [
      { title: "GitHub-Integration-V1.md", desc: "REST API, 9 document types, AST code chunking" },
      { title: "Embedding-Architecture-V1.md", desc: "Dual model routing: prose + code Jina v2" },
      { title: "LANGFUSE-INTEGRATION-SPEC.md", desc: "V3 SDK only, OTel, dual integration paths" },
    ],
    color: CYAN,
  },
  {
    group: "Parzival Pipeline",
    docs: [
      { title: "Parzival-Pipeline-V2.md", desc: "4-layer bootstrap, PCB architecture, step-file closeout" },
      { title: "Context-Injection-V2.md", desc: "Two-tier progressive context injection, confidence gating" },
      { title: "Intent-Skills-V1.md", desc: "Intent-based routing, skills architecture" },
    ],
    color: VIOLET,
  },
];

export function ArchitectureReference() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 neural-grid opacity-15" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-6">
            <Cpu className="w-3.5 h-3.5" />
            Document References
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            Full Specifications
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#7A8AAA" }}>
            Core Architecture Principle is a summary. These are the authoritative sources
            for each subsystem.
          </p>
        </motion.div>

        <div className="space-y-10">
          {referenceGroups.map((group, gi) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: group.color,
                  background: `${group.color}08`,
                  border: `1px solid ${group.color}20`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: group.color, boxShadow: `0 0 6px ${group.color}` }} />
                {group.group}
              </div>

              <div className="space-y-2">
                {group.docs.map((doc) => (
                  <div
                    key={doc.title}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      background: "rgba(10,13,30,0.6)",
                      border: `1px solid ${group.color}10`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold mb-0.5 truncate" style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}>
                        {doc.title}
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: "#7A8AAA" }}>
                        {doc.desc}
                      </div>
                    </div>
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5"
                      style={{
                        background: `${group.color}10`,
                        border: `1px solid ${group.color}20`,
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-50">
                        <path d="M1.5 6.5L6.5 1.5M6.5 1.5H3M6.5 1.5V5" stroke={group.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────

export function ArchitectureCTA() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,245,255,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative node diagram */}
          <div className="relative w-24 h-24 mx-auto mb-10">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)",
                border: "1px solid rgba(0,245,255,0.15)",
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            />
            <div
              className="absolute inset-6 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,245,255,0.06)",
                border: "1px solid rgba(0,245,255,0.3)",
                boxShadow: "0 0 40px rgba(0,245,255,0.15) inset",
              }}
            >
              <Brain className="w-5 h-5" style={{ color: CYAN }} />
            </div>
            {/* Orbiting dots */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={deg}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? CYAN : VIOLET,
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${deg}deg) translateX(36px) translateY(-50%)`,
                  transformOrigin: "center",
                  boxShadow: i % 2 === 0 ? `0 0 6px ${CYAN}` : `0 0 6px ${VIOLET}`,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>

          <h2
            className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            The architecture is the product.
          </h2>
          <p
            className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Every decision — the 3-core collections, signal-triggered retrieval,
            store-first pipeline, dual embeddings — exists to solve one problem:
            <span style={{ color: CYAN }}> right information at the right time</span>,
            without noise, without loss.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{
                fontFamily: "var(--font-heading)",
                background: `linear-gradient(135deg, ${CYAN}18, ${VIOLET}18)`,
                border: `1px solid ${CYAN}30`,
                color: CYAN,
                boxShadow: `0 0 30px ${CYAN}10`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 50px ${CYAN}20`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${CYAN}10`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Cpu className="w-4 h-4" />
              Read the Docs
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{
                fontFamily: "var(--font-heading)",
                background: "rgba(232,234,240,0.04)",
                border: "1px solid rgba(232,234,240,0.1)",
                color: "rgba(232,234,240,0.6)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,234,240,0.2)";
                e.currentTarget.style.color = "rgba(232,234,240,0.9)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,234,240,0.1)";
                e.currentTarget.style.color = "rgba(232,234,240,0.6)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View Source
            </a>
          </div>

          {/* Version badge */}
          <div
            className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono"
            style={{
              color: "rgba(232,234,240,0.3)",
              background: "rgba(0,245,255,0.03)",
              border: "1px solid rgba(0,245,255,0.08)",
            }}
          >
            <span>v3.5</span>
            <span style={{ color: "#3D4A5C" }}>·</span>
            <span>Last updated 2026-03-08</span>
            <span style={{ color: "#3D4A5C" }}>·</span>
            <span style={{ color: GREEN }}>●</span>
            <span>Active Development</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
