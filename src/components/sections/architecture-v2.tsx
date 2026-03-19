"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, Brain, Shield, Zap, GitBranch, ChevronRight, ExternalLink, Layers, Activity, Target, Infinity, Lock, Eye } from "lucide-react";
import { SectionNav } from "@/components/shared/section-nav";

// ─── Design System ──────────────────────────────────────────────────────────────

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const MAGENTA = "#FF2D6A";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const TEXT = "#E8EAF0";
const TEXT_MUTED = "#7A8AAA";
const TEXT_DIM = "#4A5568";
const BG_DEEP = "#030308";
const BG_SURFACE = "#0A0D1A";
const BG_CARD = "#0F1428";
const BG_ELEVATED = "#141932";

// ─── Blueprint Grid Background ───────────────────────────────────────────────────

function BlueprintGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="blueprint-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={CYAN} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      </svg>

      {/* Crosshair markers at corners */}
      <svg className="absolute top-8 left-8 w-6 h-6 opacity-20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="none" stroke={CYAN} strokeWidth="0.5" />
        <line x1="12" y1="0" x2="12" y2="6" stroke={CYAN} strokeWidth="0.5" />
        <line x1="12" y1="18" x2="12" y2="24" stroke={CYAN} strokeWidth="0.5" />
        <line x1="0" y1="12" x2="6" y2="12" stroke={CYAN} strokeWidth="0.5" />
        <line x1="18" y1="12" x2="24" y2="12" stroke={CYAN} strokeWidth="0.5" />
      </svg>
      <svg className="absolute top-8 right-8 w-6 h-6 opacity-20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="none" stroke={CYAN} strokeWidth="0.5" />
        <line x1="12" y1="0" x2="12" y2="6" stroke={CYAN} strokeWidth="0.5" />
        <line x1="12" y1="18" x2="12" y2="24" stroke={CYAN} strokeWidth="0.5" />
        <line x1="0" y1="12" x2="6" y2="12" stroke={CYAN} strokeWidth="0.5" />
        <line x1="18" y1="12" x2="24" y2="12" stroke={CYAN} strokeWidth="0.5" />
      </svg>

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-cyan-400/20" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-cyan-400/20" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-cyan-400/20" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-cyan-400/20" />

      {/* Bottom info bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[9px] font-mono opacity-30" style={{ color: CYAN }}>
        <span>ARCHITECTURE v3.5</span>
        <span className="text-gray-600">●</span>
        <span>QDRANT-BACKED</span>
        <span className="text-gray-600">●</span>
        <span>SIGNAL-TRIGGERED</span>
      </div>
    </div>
  );
}

// ─── Section Navigation ─────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "collections", label: "Collections", icon: Database },
  { id: "pipeline", label: "Pipeline", icon: GitBranch },
  { id: "hooks", label: "Hooks", icon: Zap },
  { id: "triggers", label: "Triggers", icon: Target },
  { id: "fusion", label: "Triple Fusion", icon: Infinity },
  { id: "reference", label: "Reference", icon: ExternalLink },
];

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
    const particles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.5 + 0.5,
      color: colors[i % colors.length],
      opacity: Math.random() * 0.35 + 0.1,
    }));
    particlesRef.current = particles;

    let frame = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      frame++;

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
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.12;
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
        const pulse = Math.sin(frame * 0.015 + p.id) * 0.15 + 0.85;
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
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-24 pb-16 overflow-x-hidden">

      {/* Layer 1: Banner image - contained within viewport */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/ai-memory-4.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "center calc(100% - 10px)",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.28) saturate(0.8) contrast(1.1)",
        }}
      />

      {/* Layer 2: Gradient overlay - semi-transparent to show image */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(3,3,8,0.75) 0%, rgba(3,3,8,0.35) 30%, rgba(3,3,8,0.15) 50%, rgba(3,3,8,0.4) 75%, rgba(3,3,8,0.85) 100%)
          `,
        }}
      />

      {/* Layer 3: Blueprint grid */}
      <BlueprintGrid />

      {/* Layer 4: Radial color halos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 20% 30%, rgba(0,245,255,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(139,92,246,0.07) 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 50% 80%, rgba(255,45,106,0.05) 0%, transparent 45%)
          `,
        }}
      />

      {/* Layer 5: Particle mesh */}
      <div className="absolute inset-0 z-10">
        <ParticleMesh className="opacity-60" />
      </div>

      {/* Layer 6: Floating geometric accents */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {/* Large rotating hexagon */}
        <div
          className="absolute animate-spin-slow"
          style={{
            top: "10%",
            right: "8%",
            width: "140px",
            height: "140px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: `linear-gradient(135deg, ${CYAN}08, ${VIOLET}04)`,
            border: `1px solid ${CYAN}15`,
            animationDuration: "80s",
            opacity: 0.5,
          }}
        />
        {/* Floating triangle */}
        <div
          className="absolute animate-float-delayed"
          style={{
            top: "25%",
            left: "8%",
            width: 0,
            height: 0,
            borderLeft: "25px solid transparent",
            borderRight: "25px solid transparent",
            borderBottom: `45px solid ${VIOLET}08`,
            opacity: 0.4,
            animationDuration: "14s",
          }}
        />
        {/* Orb bottom-left */}
        <div
          className="absolute animate-float-slow"
          style={{
            bottom: "20%",
            left: "10%",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${MAGENTA}10 0%, transparent 70%)`,
            border: `1px solid ${MAGENTA}20`,
            animationDuration: "16s",
            boxShadow: `0 0 50px ${MAGENTA}08 inset`,
          }}
        />
        {/* Pulsing dot */}
        <div
          className="absolute animate-ping-slow"
          style={{
            bottom: "35%",
            right: "15%",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: CYAN,
            boxShadow: `0 0 12px ${CYAN}, 0 0 24px ${CYAN}`,
            animationDuration: "3s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center -mt-10">

        {/* Header badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-12"
          style={{
            background: "rgba(0,245,255,0.05)",
            border: `1px solid ${CYAN}25`,
            boxShadow: `0 0 40px ${CYAN}08 inset`,
          }}
        >
          <div className="relative flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: CYAN, boxShadow: `0 0 8px ${CYAN}` }}
            />
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: CYAN, animationDuration: "2s", opacity: 0.3 }}
            />
          </div>
          <span
            className="text-[11px] font-mono font-semibold tracking-[0.15em] uppercase"
            style={{ color: CYAN, fontFamily: "var(--font-mono)" }}
          >
            Core Architecture Principle — V3.5
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-10 leading-[1.05]"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, ${TEXT} 0%, ${CYAN} 50%, ${VIOLET} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Right Information
          </span>
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            at the Right Time
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="max-w-2xl mx-auto text-lg leading-relaxed mb-16"
          style={{
            fontFamily: "var(--font-body)",
            color: TEXT_MUTED,
            fontSize: "1.125rem",
          }}
        >
          A signal-triggered retrieval system. 5 specialized collections.
          6 automatic triggers. 9-step security pipeline.
          Built on Qdrant with temporal decay, dual embeddings, and GitHub/Jira sync.
        </motion.p>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-5"
        >
          {[
            { value: "5", label: "Collections", color: CYAN },
            { value: "6", label: "Auto Triggers", color: VIOLET },
            { value: "9", label: "Pipeline Steps", color: GREEN },
            { value: "v3.5", label: "Architecture", color: MAGENTA },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative px-6 py-5 rounded-2xl text-center"
              style={{
                background: `${stat.color}05`,
                border: `1px solid ${stat.color}20`,
              }}
            >
              <div
                className="absolute top-0 left-4 right-4 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}40, transparent)`,
                }}
              />
              <div
                className="text-4xl font-bold mb-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: stat.color,
                  textShadow: `0 0 30px ${stat.color}40`,
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs font-medium"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: TEXT_MUTED,
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-mono)", color: `${CYAN}50` }}>
          Scroll to Explore
        </span>
        <div
          className="w-px h-12 rounded-full"
          style={{
            background: `linear-gradient(180deg, ${CYAN}, transparent)`,
            boxShadow: `0 0 10px ${CYAN}40`,
          }}
        />
      </motion.div>
    </section>
  );
}

// ─── Overview / Principle Section ──────────────────────────────────────────────

function OverviewSection() {
  return (
    <section id="overview" className="relative py-40 px-8">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${VIOLET}10`, border: `1px solid ${VIOLET}25` }}>
            <Layers className="w-3.5 h-3.5" style={{ color: VIOLET }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: VIOLET }}>Foundational Principle</span>
          </div>
        </motion.div>

        {/* Main statement - centered */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-2xl md:text-4xl leading-relaxed mb-6" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            Instead of{" "}
            <span style={{ color: MAGENTA }}>random memory injection</span>
            {" "}at session start,
          </p>
          <p className="text-2xl md:text-4xl leading-relaxed" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            it uses{" "}
            <span style={{ color: CYAN }}>signal-triggered retrieval</span>
            {" "}when specific events occur.
          </p>
        </motion.div>

        {/* Explanation cards - horizontal layout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {/* Left: Explanation */}
          <div
            className="p-8 rounded-2xl"
            style={{
              background: BG_CARD,
              border: `1px solid ${CYAN}15`,
            }}
          >
            <p className="text-base leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
              High signal-to-noise ratio. The system acts on precise triggers — error patterns,
              naming conventions, decision keywords, best practice queries.
            </p>
            <p className="text-base leading-relaxed" style={{ color: TEXT_MUTED }}>
              Memory surfaces when it is{" "}
              <span style={{ color: CYAN, fontWeight: 600 }}>relevant</span>, not when it is{" "}
              <span style={{ color: MAGENTA, fontWeight: 600 }}>present</span>.
            </p>
          </div>

          {/* Right: Visual indicator */}
          <div
            className="p-8 rounded-2xl flex flex-col justify-center"
            style={{
              background: `${MAGENTA}05`,
              border: `1px solid ${MAGENTA}15`,
            }}
          >
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: `${MAGENTA}10`, border: `1px solid ${MAGENTA}25` }}
                >
                  <span className="text-2xl" style={{ filter: "grayscale(1)", opacity: 0.5 }}>↯</span>
                </div>
                <div className="text-xs font-mono" style={{ color: MAGENTA }}>Random</div>
              </div>
              <div className="text-2xl" style={{ color: TEXT_DIM }}>→</div>
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: `${CYAN}10`, border: `1px solid ${CYAN}25` }}
                >
                  <span className="text-2xl" style={{ color: CYAN }}>◎</span>
                </div>
                <div className="text-xs font-mono" style={{ color: CYAN }}>Signal</div>
              </div>
            </div>
            <div className="text-center text-xs font-mono" style={{ color: TEXT_DIM }}>
              Signal-to-noise ratio: HIGH
            </div>
          </div>
        </motion.div>

        {/* Key stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6"
        >
          {[
            { icon: Database, label: "5 Specialized", sub: "Collections", color: CYAN },
            { icon: Zap, label: "6 Automatic", sub: "Triggers", color: VIOLET },
            { icon: Shield, label: "3-Layer", sub: "Security Pipeline", color: GREEN },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div
              key={sub}
              className="flex items-center gap-5 p-6 rounded-2xl"
              style={{
                background: `${color}05`,
                border: `1px solid ${color}15`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}10`, border: `1px solid ${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color }}>
                  {label}
                </div>
                <div className="text-sm" style={{ color: TEXT_MUTED }}>
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Collections Section ─────────────────────────────────────────────────────────

const COLLECTIONS_DATA = [
  {
    id: "code-patterns",
    tag: "HOW",
    color: CYAN,
    desc: "Implementation, error fixes, refactoring patterns, file-specific knowledge",
    types: [
      { name: "implementation", desc: "How features were built" },
      { name: "error_fix", desc: "Errors and their solutions" },
      { name: "refactor", desc: "Refactoring patterns" },
      { name: "file_pattern", desc: "File-specific patterns" },
    ],
  },
  {
    id: "conventions",
    tag: "WHAT",
    color: VIOLET,
    desc: "Rules, guidelines, naming standards, file structure conventions",
    types: [
      { name: "rule", desc: "Hard rules (MUST do)" },
      { name: "guideline", desc: "Soft guidelines (SHOULD do)" },
      { name: "naming", desc: "Naming conventions" },
      { name: "structure", desc: "File/folder conventions" },
    ],
  },
  {
    id: "discussions",
    tag: "WHY",
    color: MAGENTA,
    desc: "Decisions, sessions, blockers, preferences, GitHub data",
    types: [
      { name: "decision", desc: "Architectural decisions" },
      { name: "session", desc: "Session summaries" },
      { name: "blocker", desc: "Project blockers" },
      { name: "preference", desc: "User preferences" },
      { name: "github_*", desc: "9 GitHub document types" },
    ],
  },
  {
    id: "jira-data",
    tag: "JIRA",
    color: AMBER,
    desc: "Issues + comments (conditional, requires jira_sync_enabled)",
    types: [
      { name: "jira_issue", desc: "Issue summary, description, metadata" },
      { name: "jira_comment", desc: "Issue comments" },
    ],
    conditional: true,
  },
];

function CollectionCard({ collection, index }: { collection: typeof COLLECTIONS_DATA[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl p-6"
      style={{
        background: BG_CARD,
        border: `1px solid ${collection.color}20`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1">
          {/* Tag + Name */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider"
              style={{
                background: `${collection.color}15`,
                color: collection.color,
                border: `1px solid ${collection.color}30`,
              }}
            >
              {collection.tag}
            </span>
            {collection.conditional && (
              <span
                className="px-2 py-1 rounded text-[9px] font-mono"
                style={{ background: `${AMBER}10`, color: AMBER, border: `1px solid ${AMBER}25` }}
              >
                CONDITIONAL
              </span>
            )}
          </div>

          <h3
            className="text-xl font-bold mb-1"
            style={{ fontFamily: "var(--font-heading)", color: TEXT }}
          >
            {collection.id}
          </h3>

          <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            {collection.desc}
          </p>
        </div>
      </div>

      {/* Types grid - always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {collection.types.map((type) => (
          <div
            key={type.name}
            className="p-3 rounded-xl"
            style={{ background: `${collection.color}08` }}
          >
            <code
              className="text-xs font-mono font-semibold block mb-1"
              style={{ color: collection.color }}
            >
              {type.name}
            </code>
            <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
              {type.desc}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CollectionsSection() {
  return (
    <section id="collections" className="relative py-40 px-8" style={{ background: BG_SURFACE }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(${CYAN} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }} />

      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${CYAN}10`, border: `1px solid ${CYAN}25` }}>
            <Database className="w-3.5 h-3.5" style={{ color: CYAN }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: CYAN }}>Collection Organization</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            3 Core + 2 Conditional
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            Maps to three fundamental question types:{" "}
            <span style={{ color: CYAN }}>HOW</span> things are built,{" "}
            <span style={{ color: VIOLET }}>WHAT</span> rules to follow,{" "}
            <span style={{ color: MAGENTA }}>WHY</span> decisions were made.
          </p>
        </motion.div>

        {/* Collections grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {COLLECTIONS_DATA.map((col, i) => (
            <CollectionCard key={col.id} collection={col} index={i} />
          ))}
        </div>

        {/* Qdrant config info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl flex items-start gap-5"
          style={{
            background: `${GREEN}05`,
            border: `1px solid ${GREEN}15`,
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}20` }}
          >
            <Shield className="w-5 h-5" style={{ color: GREEN }} />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1" style={{ fontFamily: "var(--font-mono)", color: GREEN }}>
              HNSW + Scalar Quantization
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
              m=16, ef_construct=100, int8 quantization with 0.99 quantile.{" "}
              <span style={{ color: CYAN }}>4x compression</span> at ~99% accuracy. All vectors <code style={{ color: CYAN }}>on_disk=True</code>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pipeline Section ───────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  { step: 1, label: "CAPTURE", name: "Hook / Sync", desc: "Content arrives via Claude Code hook or sync engine", color: VIOLET },
  { step: 2, label: "LOG", name: "Activity Log", desc: "Full content → append-only JSONL audit log", color: CYAN },
  { step: 3, label: "DETECT", name: "Content Type", desc: "Detect prose, code, config for routing", color: AMBER },
  { step: 4, label: "SCAN", name: "Security", desc: "3-layer PII/secrets: Regex → Entropy → SpaCy", color: MAGENTA },
  { step: 5, label: "CHUNK", name: "Chunker", desc: "Intelligent content-type-aware chunking", color: CYAN },
  { step: 6, label: "EMBED", name: "Dual Model", desc: "Jina v2 prose or code model per chunk", color: VIOLET },
  { step: 7, label: "STORE", name: "Qdrant", desc: "All chunks with full metadata", color: GREEN },
  { step: 8, label: "ENQUEUE", name: "Queue", desc: "Async classification worker", color: AMBER },
  { step: 9, label: "CLASSIFY", name: "LLM", desc: "Refine type after storage", color: VIOLET },
];

function PipelineFlow() {
  return (
    <div className="relative py-8 overflow-x-auto">
      {/* Connection line */}
      <div
        className="absolute top-[3.25rem] left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, ${VIOLET}30, ${CYAN}30, ${AMBER}30, ${MAGENTA}30, ${CYAN}30, ${VIOLET}30, ${GREEN}30, ${AMBER}30, ${VIOLET}30)`,
        }}
      />

      {/* Animated particles flowing along the line */}
      <div className="absolute top-[3.25rem] left-0 right-0 h-1 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: i % 2 === 0 ? CYAN : VIOLET,
              boxShadow: `0 0 12px ${i % 2 === 0 ? CYAN : VIOLET}, 0 0 24px ${i % 2 === 0 ? CYAN : VIOLET}`,
              animation: `flowParticle ${3 + i * 0.2}s linear infinite`,
              animationDelay: `${i * 0.25}s`,
              left: "-6px",
            }}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="relative flex justify-between items-start min-w-[800px] px-4">
        {PIPELINE_STEPS.map((step, index) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Step number circle */}
            <div
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: `${step.color}12`,
                border: `2px solid ${step.color}40`,
                boxShadow: `0 0 30px ${step.color}15`,
              }}
            >
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)", color: step.color }}
              >
                {step.step}
              </span>

              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  border: `1px solid ${step.color}30`,
                  animation: "pulse-ring 2s ease-out infinite",
                  animationDelay: `${index * 0.15}s`,
                }}
              />
            </div>

            {/* Label */}
            <div className="text-center">
              <div
                className="text-[10px] font-mono font-bold tracking-wider mb-1"
                style={{ color: step.color }}
              >
                {step.label}
              </div>
              <div
                className="text-xs font-semibold whitespace-nowrap"
                style={{ fontFamily: "var(--font-heading)", color: TEXT }}
              >
                {step.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        @keyframes flowParticle {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw)); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes pulse-node {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function PipelineDetails() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="mt-12 grid md:grid-cols-2 gap-8">
      {/* Step selector */}
      <div>
        <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "var(--font-mono)", color: TEXT_MUTED }}>
          PIPELINE STEPS
        </h4>
        <div className="space-y-2">
          {PIPELINE_STEPS.map((step, i) => (
            <button
              key={step.step}
              onClick={() => setSelected(i)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                background: selected === i ? `${step.color}10` : "transparent",
                border: `1px solid ${selected === i ? step.color + "30" : "transparent"}`,
              }}
            >
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
                style={{ background: `${step.color}15`, color: step.color }}
              >
                {step.step}
              </span>
              <span className="text-sm" style={{ color: selected === i ? TEXT : TEXT_MUTED }}>
                {step.name}
              </span>
              <ChevronRight
                className="w-4 h-4 ml-auto"
                style={{ color: selected === i ? step.color : TEXT_DIM }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 rounded-2xl"
        style={{
          background: BG_CARD,
          border: `1px solid ${PIPELINE_STEPS[selected].color}20`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="px-3 py-1 rounded-lg text-xs font-mono font-bold"
            style={{
              background: `${PIPELINE_STEPS[selected].color}15`,
              color: PIPELINE_STEPS[selected].color,
            }}
          >
            {PIPELINE_STEPS[selected].label}
          </span>
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            {PIPELINE_STEPS[selected].name}
          </span>
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
          {PIPELINE_STEPS[selected].desc}
        </p>

        {/* Example detail based on step */}
        {selected === 3 && (
          <div className="mt-4 p-4 rounded-xl font-mono text-xs" style={{ background: `${MAGENTA}08`, border: `1px solid ${MAGENTA}15` }}>
            <div className="text-[10px] mb-2" style={{ color: MAGENTA }}>LAYER 1-3</div>
            <div className="space-y-1" style={{ color: TEXT_MUTED }}>
              <div>1. Regex Pattern (~1ms)</div>
              <div>2. detect-secrets Entropy (~10ms)</div>
              <div>3. SpaCy NER (~50-100ms)</div>
            </div>
          </div>
        )}
        {selected === 5 && (
          <div className="mt-4 p-4 rounded-xl font-mono text-xs" style={{ background: `${VIOLET}08`, border: `1px solid ${VIOLET}15` }}>
            <div className="text-[10px] mb-2" style={{ color: VIOLET }}>DUAL MODEL ROUTING</div>
            <div className="space-y-1" style={{ color: TEXT_MUTED }}>
              <div>• prose model → natural language</div>
              <div>• code model → code-patterns, github_code_blob</div>
            </div>
          </div>
        )}
        {selected === 6 && (
          <div className="mt-4 p-4 rounded-xl font-mono text-xs" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}15` }}>
            <div className="text-[10px] mb-2" style={{ color: GREEN }}>METADATA FIELDS</div>
            <div className="space-y-1" style={{ color: TEXT_MUTED }}>
              <div>group_id, type, timestamp</div>
              <div>content_hash, is_current</div>
              <div>authority_tier, freshness_status</div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function PipelineSection() {
  return (
    <section id="pipeline" className="relative py-40 px-8 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${VIOLET}06, transparent 70%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            <GitBranch className="w-3.5 h-3.5" style={{ color: GREEN }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: GREEN }}>Memory Processing Pipeline</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            9 Steps from Capture to Searchable
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            Every memory follows the same immutable pipeline. Store-first architecture ensures no data loss.
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <PipelineFlow />
        <PipelineDetails />

        {/* Key invariants */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl"
          style={{
            background: `${MAGENTA}05`,
            border: `1px solid ${MAGENTA}15`,
          }}
        >
          <div className="flex items-start gap-4">
            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: MAGENTA }} />
            <div>
              <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "var(--font-mono)", color: MAGENTA }}>
                Pipeline Invariants
              </h4>
              <ul className="space-y-2">
                {[
                  "Full content ALWAYS logged (activity log is append-only, never modified)",
                  "BLOCKED content discarded — logged but not stored",
                  "Classification runs async — never blocks capture",
                  "Embedding model selected by content type (prose vs code)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: TEXT_MUTED }}>
                    <span style={{ color: MAGENTA }} className="flex-shrink-0">→</span>
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

// ─── Hooks Section ─────────────────────────────────────────────────────────────

const CAPTURE_HOOKS = [
  { name: "user_prompt_capture.py", trigger: "UserPromptSubmit", collection: "discussions", type: "user_message" },
  { name: "agent_response_capture.py", trigger: "Stop", collection: "discussions", type: "agent_response" },
  { name: "post_tool_capture.py", trigger: "PostToolUse (Edit|Write)", collection: "code-patterns", type: "implementation" },
  { name: "error_pattern_capture.py", trigger: "PostToolUse (Bash)", collection: "code-patterns", type: "error_fix" },
  { name: "pre_compact_save.py", trigger: "PreCompact", collection: "discussions", type: "session" },
];

const RETRIEVAL_HOOKS = [
  { name: "error_detection.py", trigger: "PostToolUse (Bash)", collection: "code-patterns", type: "error_fix" },
  { name: "new_file_trigger.py", trigger: "PreToolUse (Write)", collection: "conventions", type: "naming, structure" },
  { name: "first_edit_trigger.py", trigger: "PreToolUse (Edit)", collection: "code-patterns", type: "file_pattern" },
  { name: "context_injection_tier2.py", trigger: "UserPromptSubmit", collection: "discussions, conventions", type: "decision, guideline, session" },
  { name: "session_start.py", trigger: "SessionStart (resume|compact)", collection: "discussions, conventions", type: "session, guideline, decision" },
];

function HookRow({ hook, side, index }: { hook: typeof CAPTURE_HOOKS[0]; side: "capture" | "retrieval"; index: number }) {
  const color = side === "capture" ? AMBER : CYAN;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "capture" ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="p-5 rounded-xl"
      style={{
        background: `${color}05`,
        border: `1px solid ${color}15`,
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <code
            className="text-sm font-mono font-semibold"
            style={{ color }}
          >
            {hook.name}
          </code>
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-mono flex-shrink-0"
            style={{ background: `${color}12`, color: `${color}80` }}
          >
            {hook.collection}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] px-2 py-1 rounded font-mono"
              style={{ background: `${color}10`, color: `${color}80` }}
            >
              TRIGGER
            </span>
            <span className="text-sm" style={{ color: TEXT_MUTED }}>{hook.trigger}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] px-2 py-1 rounded font-mono"
              style={{ background: `${color}10`, color: `${color}80` }}
            >
              TYPE
            </span>
            <span className="text-sm" style={{ color: TEXT_MUTED }}>{hook.type}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HooksSection() {
  return (
    <section id="hooks" className="relative py-40 px-8" style={{ background: BG_SURFACE }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `linear-gradient(180deg, transparent, ${CYAN}03, transparent)`,
      }} />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}25` }}>
            <Brain className="w-3.5 h-3.5" style={{ color: AMBER }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: AMBER }}>Hook Classification</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            CAPTURE vs Retrieval
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            Hooks are classified by function: CAPTURE stores to memory, RETRIEVAL queries it.
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* CAPTURE */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6"
              style={{
                background: `${AMBER}10`,
                border: `1px solid ${AMBER}25`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: AMBER, boxShadow: `0 0 8px ${AMBER}` }} />
              <span className="text-xs font-mono font-bold" style={{ color: AMBER }}>CAPTURE</span>
              <span className="text-xs" style={{ color: TEXT_DIM }}>— Store to Database</span>
            </div>
            <div className="space-y-3">
              {CAPTURE_HOOKS.map((hook, i) => (
                <HookRow key={hook.name} hook={hook} side="capture" index={i} />
              ))}
            </div>
          </div>

          {/* RETRIEVAL */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6"
              style={{
                background: `${CYAN}10`,
                border: `1px solid ${CYAN}25`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
              <span className="text-xs font-mono font-bold" style={{ color: CYAN }}>RETRIEVAL</span>
              <span className="text-xs" style={{ color: TEXT_DIM }}>— Query Database</span>
            </div>
            <div className="space-y-3">
              {RETRIEVAL_HOOKS.map((hook, i) => (
                <HookRow key={hook.name} hook={hook} side="retrieval" index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Triggers Section ──────────────────────────────────────────────────────────

const TRIGGERS = [
  {
    num: 1,
    name: "Error Detection",
    hook: "PostToolUse (Bash)",
    collection: "code-patterns",
    filter: 'type="error_fix"',
    signal: 'Error text, "Exception:", "Traceback", exit != 0',
    color: MAGENTA,
  },
  {
    num: 2,
    name: "New File Creation",
    hook: "PreToolUse (Write)",
    collection: "conventions",
    filter: 'type IN (naming, structure)',
    signal: "Write tool, file does not exist",
    color: CYAN,
  },
  {
    num: 3,
    name: "First Edit to File",
    hook: "PreToolUse (Edit)",
    collection: "code-patterns",
    filter: 'type="file_pattern"',
    signal: "First edit to file in session",
    color: VIOLET,
  },
  {
    num: 4,
    name: "Decision Keywords",
    hook: "UserPromptSubmit",
    collection: "discussions",
    filter: 'type="decision"',
    signal: '"why did we", "what was decided", "remember when"',
    color: GREEN,
  },
  {
    num: 5,
    name: "Best Practices Keywords",
    hook: "UserPromptSubmit",
    collection: "conventions",
    filter: 'type="guideline"',
    signal: '"best practice", "convention", "how should I"',
    color: AMBER,
  },
  {
    num: 6,
    name: "Session History Keywords",
    hook: "UserPromptSubmit",
    collection: "discussions",
    filter: 'type="session"',
    signal: '"what have we done", "project status", "what\'s next"',
    color: CYAN,
  },
];

function TriggerCard({ trigger, index }: { trigger: typeof TRIGGERS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: BG_CARD,
        border: `1px solid ${trigger.color}15`,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-5">
          {/* Trigger number - more prominent with glow */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative"
            style={{
              background: `${trigger.color}15`,
              border: `2px solid ${trigger.color}35`,
              boxShadow: `0 0 20px ${trigger.color}20`,
            }}
          >
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-heading)", color: trigger.color }}
            >
              {trigger.num}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="text-lg font-bold mb-1"
              style={{ fontFamily: "var(--font-heading)", color: TEXT }}
            >
              {trigger.name}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: TEXT_MUTED }}>
                {trigger.hook}
              </span>
              <span className="text-xs" style={{ color: TEXT_DIM }}>•</span>
              <span className="text-xs font-mono" style={{ color: trigger.color }}>
                {trigger.collection}
              </span>
            </div>
          </div>

          <div
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200"
            style={{
              background: `${trigger.color}10`,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5L5 6.5L8 3.5" stroke={trigger.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-5 grid grid-cols-1 gap-4"
              style={{ borderTop: `1px solid ${trigger.color}10` }}
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: `${trigger.color}60` }}>
                  Signal
                </div>
                <code
                  className="text-sm font-mono block p-3 rounded-lg"
                  style={{ background: `${trigger.color}08`, color: trigger.color }}
                >
                  {trigger.signal}
                </code>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: `${trigger.color}60` }}>
                  Query Filter
                </div>
                <code
                  className="text-sm font-mono block p-3 rounded-lg"
                  style={{ background: `${trigger.color}08`, color: trigger.color }}
                >
                  {trigger.filter}
                </code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TriggersSection() {
  return (
    <section id="triggers" className="relative py-40 px-8">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${GREEN}04, transparent 70%)`,
      }} />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            <Target className="w-3.5 h-3.5" style={{ color: GREEN }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: GREEN }}>Automatic Triggers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            6 Signal-Based Triggers
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            The system acts on precise signals — not on every user message or every tool use.
          </p>
        </motion.div>

        {/* Triggers grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRIGGERS.map((trigger, i) => (
            <TriggerCard key={trigger.num} trigger={trigger} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Triple Fusion Section ─────────────────────────────────────────────────────

function TripleFusionSection() {
  return (
    <section id="fusion" className="relative py-40 px-8" style={{ background: BG_SURFACE }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${VIOLET}06, transparent 70%)`,
      }} />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${VIOLET}10`, border: `1px solid ${VIOLET}25` }}>
            <Infinity className="w-3.5 h-3.5" style={{ color: VIOLET }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: VIOLET }}>Triple Fusion Hybrid Search</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            Dense + Sparse + Late Interaction
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            Three complementary search modalities combined via Qdrant&apos;s native Reciprocal Rank Fusion (RRF).
          </p>
        </motion.div>

        {/* Fusion diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-96 mb-12"
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Dense → RRF */}
            <motion.line
              x1="15%" y1="25%" x2="50%" y2="80%"
              stroke={CYAN}
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              style={{ opacity: 0.4 }}
            />
            {/* Sparse → RRF */}
            <motion.line
              x1="50%" y1="15%" x2="50%" y2="80%"
              stroke={VIOLET}
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.4 }}
              style={{ opacity: 0.4 }}
            />
            {/* ColBERT → RRF */}
            <motion.line
              x1="85%" y1="25%" x2="50%" y2="80%"
              stroke={GREEN}
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              style={{ opacity: 0.4 }}
            />
          </svg>

          {/* Nodes */}
          {/* Dense */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute left-[15%] top-[20%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center relative"
              style={{
                background: `${CYAN}10`,
                border: `2px solid ${CYAN}40`,
                boxShadow: `0 0 40px ${CYAN}15`,
              }}
            >
              <span className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: CYAN }}>Dense</span>
              <span className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>768d vectors</span>
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `0 0 30px ${CYAN}25 inset`, animation: "pulse-node 3s ease-in-out infinite" }} />
            </div>
          </motion.div>

          {/* Sparse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute left-1/2 top-[12%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="w-32 h-32 rounded-2xl flex flex-col items-center justify-center relative"
              style={{
                background: `${VIOLET}10`,
                border: `2px solid ${VIOLET}40`,
                boxShadow: `0 0 40px ${VIOLET}15`,
              }}
            >
              <span className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: VIOLET }}>Sparse</span>
              <span className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>BM25 / FastEmbed</span>
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `0 0 30px ${VIOLET}25 inset`, animation: "pulse-node 3s ease-in-out infinite 0.5s" }} />
            </div>
          </motion.div>

          {/* ColBERT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute left-[85%] top-[20%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center relative"
              style={{
                background: `${GREEN}10`,
                border: `2px solid ${GREEN}40`,
                boxShadow: `0 0 40px ${GREEN}15`,
              }}
            >
              <span className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: GREEN }}>Late</span>
              <span className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>ColBERT v2</span>
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `0 0 30px ${GREEN}25 inset`, animation: "pulse-node 3s ease-in-out infinite 1s" }} />
            </div>
          </motion.div>

          {/* RRF (center bottom) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute left-1/2 top-[82%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="w-36 h-36 rounded-2xl flex flex-col items-center justify-center relative"
              style={{
                background: `${MAGENTA}12`,
                border: `2px solid ${MAGENTA}50`,
                boxShadow: `0 0 60px ${MAGENTA}20`,
              }}
            >
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: MAGENTA }}>RRF</span>
              <span className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>Reciprocal Rank Fusion</span>
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `0 0 40px ${MAGENTA}30 inset`, animation: "pulse-node 2s ease-in-out infinite 0.3s" }} />
            </div>
          </motion.div>
        </motion.div>

        {/* 4-path composition */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { path: "1", label: "Best Quality", desc: "[dense→decay, sparse] → RRF", color: CYAN, badge: "HYBRID+DECAY" },
            { path: "2", label: "Hybrid Only", desc: "[dense, sparse] → RRF", color: VIOLET, badge: "HYBRID" },
            { path: "3", label: "Decay Only", desc: "Dense with decay reranking", color: AMBER, badge: "DECAY" },
            { path: "4", label: "Plain Dense", desc: "Cosine similarity fallback", color: TEXT_DIM, badge: "DENSE" },
          ].map((p) => (
            <div
              key={p.path}
              className="p-5 rounded-2xl"
              style={{
                background: `${p.color}05`,
                border: `1px solid ${p.color}15`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: p.color }}>
                  {p.path}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[9px] font-mono"
                  style={{ background: `${p.color}12`, color: p.color }}
                >
                  {p.badge}
                </span>
              </div>
              <div className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{p.label}</div>
              <code className="text-xs font-mono" style={{ color: TEXT_MUTED }}>{p.desc}</code>
            </div>
          ))}
        </div>

        {/* DEC-062 note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-4 rounded-xl flex items-start gap-3"
          style={{ background: `${VIOLET}05`, border: `1px solid ${VIOLET}15` }}
        >
          <Activity className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VIOLET }} />
          <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
            <strong style={{ color: VIOLET }}>DEC-062:</strong> The decay formula MUST be applied BEFORE RRF fusion
            (to the dense prefetch results), never after. Applying decay to RRF output would zero out semantics.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Reference Section ─────────────────────────────────────────────────────────

const REFERENCE_GROUPS = [
  {
    group: "Source of Truth",
    color: MAGENTA,
    docs: [
      { title: "Chunking-Strategy-V2.md", desc: "AST, semantic, markdown, late chunking, smart truncation" },
      { title: "Memory-System-Components-V1.md", desc: "Access, Processing, Storage layers" },
      { title: "Temporal-Awareness-V1.md", desc: "Decay scoring + freshness detection" },
      { title: "Security-Pipeline-V1.md", desc: "3-layer scanning, graduated trust, SOPS encryption" },
    ],
  },
  {
    group: "Integration",
    color: CYAN,
    docs: [
      { title: "GitHub-Integration-V1.md", desc: "REST API, 9 document types, AST code chunking" },
      { title: "Embedding-Architecture-V1.md", desc: "Dual model routing: prose + code Jina v2" },
      { title: "LANGFUSE-INTEGRATION-SPEC.md", desc: "V3 SDK only, OTel, dual integration paths" },
    ],
  },
  {
    group: "Parzival Pipeline",
    color: VIOLET,
    docs: [
      { title: "Parzival-Pipeline-V2.md", desc: "4-layer bootstrap, PCB architecture, step-file closeout" },
      { title: "Context-Injection-V2.md", desc: "Two-tier progressive context injection, confidence gating" },
      { title: "Intent-Skills-V1.md", desc: "Intent-based routing, skills architecture" },
    ],
  },
];

function ReferenceSection() {
  return (
    <section id="reference" className="relative py-40 px-8" style={{ background: BG_SURFACE }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(${CYAN} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }} />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${CYAN}10`, border: `1px solid ${CYAN}25` }}>
            <ExternalLink className="w-3.5 h-3.5" style={{ color: CYAN }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: CYAN }}>Document References</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            Full Specifications
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            Core Architecture Principle is a summary. These are the authoritative sources for each subsystem.
          </p>
        </motion.div>

        {/* Reference groups */}
        <div className="space-y-12">
          {REFERENCE_GROUPS.map((group, gi) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1 }}
            >
              {/* Group header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: group.color, boxShadow: `0 0 10px ${group.color}` }}
                />
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: group.color }}>
                  {group.group}
                </h3>
                <div className="flex-1 h-px" style={{ background: `${group.color}20` }} />
              </div>

              {/* Docs - full width single column */}
              <div className="space-y-3">
                {group.docs.map((doc) => (
                  <div
                    key={doc.title}
                    className="p-5 rounded-xl flex items-center gap-4"
                    style={{
                      background: BG_CARD,
                      border: `1px solid ${group.color}15`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-semibold mb-0.5"
                        style={{ fontFamily: "var(--font-heading)", color: TEXT }}
                      >
                        {doc.title}
                      </h4>
                      <p className="text-xs" style={{ color: TEXT_MUTED }}>
                        {doc.desc}
                      </p>
                    </div>
                    <Eye className="w-4 h-4 flex-shrink-0" style={{ color: `${group.color}50` }} />
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

// ─── CTA Section ───────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative py-40 px-8 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${CYAN}05, transparent 65%)`,
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative">
        {/* Decorative node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-24 h-24 mx-auto mb-12"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `${CYAN}08`,
              border: `1px solid ${CYAN}20`,
            }}
          />
          <div
            className="absolute inset-3 rounded-full"
            style={{
              background: `${VIOLET}10`,
              border: `1px solid ${VIOLET}20`,
            }}
          />
          <div
            className="absolute inset-6 rounded-full flex items-center justify-center"
            style={{
              background: `${CYAN}12`,
              border: `1px solid ${CYAN}30`,
              boxShadow: `0 0 40px ${CYAN}15 inset`,
            }}
          >
            <Brain className="w-6 h-6" style={{ color: CYAN }} />
          </div>
          {/* Orbiting dots */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={deg}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? CYAN : VIOLET,
                left: "50%",
                top: "50%",
                transform: `rotate(${deg}deg) translateX(40px) translateY(-50%)`,
                transformOrigin: "center",
                boxShadow: i % 2 === 0 ? `0 0 8px ${CYAN}` : `0 0 8px ${VIOLET}`,
              }}
            />
          ))}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{ fontFamily: "var(--font-heading)", color: TEXT }}
        >
          The architecture is the product.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: TEXT_MUTED }}
        >
          Every decision — the 3-core collections, signal-triggered retrieval,
          store-first pipeline, dual embeddings — exists to solve one problem:{" "}
          <span style={{ color: CYAN }}>right information at the right time</span>,
          without noise, without loss.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
            style={{
              fontFamily: "var(--font-heading)",
              background: `linear-gradient(135deg, ${CYAN}15, ${VIOLET}15)`,
              border: `1px solid ${CYAN}30`,
              color: CYAN,
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
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: TEXT_MUTED,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View Source
          </a>
        </motion.div>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 inline-flex items-center gap-3 px-4 py-2 rounded-full"
          style={{
            background: `${CYAN}05`,
            border: `1px solid ${CYAN}15`,
          }}
        >
          <span className="text-xs font-mono" style={{ color: TEXT_DIM }}>v3.5</span>
          <span className="text-gray-600">•</span>
          <span className="text-xs font-mono" style={{ color: TEXT_DIM }}>2026-03-08</span>
          <span className="text-gray-600">•</span>
          <span className="text-xs font-mono flex items-center gap-1.5" style={{ color: GREEN }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
            Active Development
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export function ArchitecturePage() {
  return (
    <main className="min-h-screen relative" style={{ background: BG_DEEP }}>
      {/* Fixed elements */}
      <SectionNav sections={SECTIONS} />

      {/* Sections */}
      <HeroSection />
      <OverviewSection />
      <CollectionsSection />
      <PipelineSection />
      <HooksSection />
      <TriggersSection />
      <TripleFusionSection />
      <ReferenceSection />
      <CTASection />
    </main>
  );
}

