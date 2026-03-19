"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Shield,
  GitBranch,
  Gauge,
  Clock,
  Github,
  Database,
  BarChart3,
  Bot,
  Layers,
  Zap,
} from "lucide-react";
import {
  AnimatedSection,
  fadeUp,
  stagger,
} from "@/components/shared/animated-section";

/* ─── Capability Data ──────────────────────────────────────────── */

type CapabilitySize = "hero" | "wide" | "normal";
type HoverEffect = "decay" | "scanline" | "commits" | "pulse" | "default";

interface Capability {
  id: string;
  icon: typeof Brain;
  color: string;
  title: string;
  description: string;
  tag: string;
  size: CapabilitySize;
  hoverEffect: HoverEffect;
  href?: string;
}

const capabilities: Capability[] = [
  {
    id: "semantic-decay",
    icon: Brain,
    color: "#8B5CF6",
    title: "Semantic Decay",
    description:
      "Memories age naturally over time. Stale context fades while frequently accessed knowledge stays sharp — just like human cognition.",
    tag: "CORE ENGINE",
    size: "hero",
    hoverEffect: "decay",
  },
  {
    id: "security-pipeline",
    icon: Shield,
    color: "#00FF88",
    title: "3-Layer Security Pipeline",
    description:
      "Regex + detect-secrets + SpaCy NER — PII detection and content filtering before any memory hits storage.",
    tag: "SECURITY",
    size: "normal",
    hoverEffect: "scanline",
  },
  {
    id: "dual-embedding",
    icon: GitBranch,
    color: "#22D3EE",
    title: "Dual Embedding Routing",
    description:
      "Separate embedding models for code and prose — each optimized for its domain for maximum retrieval precision.",
    tag: "INTELLIGENCE",
    size: "normal",
    hoverEffect: "default",
  },
  {
    id: "collections",
    icon: Layers,
    color: "#00F5FF",
    title: "5 Specialized Collections",
    description:
      "Domain-optimized Qdrant collections — code-patterns, conventions, discussions, github, and jira-data.",
    tag: "ARCHITECTURE",
    size: "wide",
    hoverEffect: "default",
  },
  {
    id: "github-sync",
    icon: Github,
    color: "#FF2D6A",
    title: "GitHub / Jira Sync",
    description:
      "Repository history and issue tracking data become searchable by meaning, not just keywords.",
    tag: "INTEGRATION",
    size: "normal",
    hoverEffect: "commits",
  },
  {
    id: "progressive-context",
    icon: Gauge,
    color: "#FFB800",
    title: "Progressive Context Injection",
    description:
      "Token-budget-aware delivery ensures the most relevant memories fit within your context window.",
    tag: "EFFICIENCY",
    size: "normal",
    hoverEffect: "default",
  },
  {
    id: "freshness",
    icon: Clock,
    color: "#22D3EE",
    title: "Freshness Detection",
    description:
      "Automatically flags stale memories and surfaces the most recently relevant context.",
    tag: "AUTOMATION",
    size: "normal",
    hoverEffect: "default",
  },
  {
    id: "observability",
    icon: BarChart3,
    color: "#FFB800",
    title: "LLM Observability",
    description:
      "Langfuse pipeline tracing built-in — full visibility into every memory operation, retrieval, and embedding call.",
    tag: "MONITORING",
    size: "normal",
    hoverEffect: "default",
  },
  {
    id: "parzival",
    icon: Bot,
    color: "#8B5CF6",
    title: "AI PM Agent (Parzival)",
    description:
      "Technical PM + quality gatekeeper. Your AI never misses a requirement.",
    tag: "AGENT",
    size: "normal",
    hoverEffect: "pulse",
    href: "/parzival",
  },
  {
    id: "qdrant",
    icon: Database,
    color: "#00F5FF",
    title: "Qdrant Vector Store",
    description:
      "Production-grade vector database — self-hosted, no vendor lock-in, built for scale.",
    tag: "INFRASTRUCTURE",
    size: "normal",
    hoverEffect: "default",
  },
];

/* ─── Collection Dots (for the wide card) ──────────────────────── */

const collectionDots = [
  { label: "code-patterns", color: "#00F5FF" },
  { label: "conventions", color: "#8B5CF6" },
  { label: "discussions", color: "#FF2D6A" },
  { label: "github", color: "#00FF88" },
  { label: "jira-data", color: "#FFB800" },
];

/* ─── Decay Animation Bar ──────────────────────────────────────── */

function DecayBar() {
  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ color: "#7A8AAA", fontFamily: "var(--font-mono)" }}
        >
          Memory Freshness
        </span>
        <span
          className="text-[10px]"
          style={{ color: "#8B5CF6", fontFamily: "var(--font-mono)" }}
        >
          Active Decay
        </span>
      </div>
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(139,92,246,0.1)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #8B5CF6 0%, rgba(139,92,246,0.4) 70%, rgba(139,92,246,0.08) 100%)",
          }}
          animate={{
            width: ["85%", "60%", "75%", "50%", "85%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-y-0 rounded-full"
          style={{
            width: "4px",
            background: "#E8EAF0",
            boxShadow: "0 0 8px rgba(139,92,246,0.8)",
          }}
          animate={{
            left: ["85%", "60%", "75%", "50%", "85%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="flex justify-between">
        <span
          className="text-[9px]"
          style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
        >
          Fresh
        </span>
        <span
          className="text-[9px]"
          style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
        >
          Decayed
        </span>
      </div>
    </div>
  );
}

/* ─── Scanline Overlay ─────────────────────────────────────────── */

function ScanlineOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00FF88, transparent)",
              boxShadow: "0 0 12px rgba(0,255,136,0.5)",
            }}
            initial={{ top: "-2px" }}
            animate={{ top: "calc(100% + 2px)" }}
            transition={{
              duration: 0.8,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Commit Dots Animation ────────────────────────────────────── */

function CommitDots({ active }: { active: boolean }) {
  return (
    <div className="mt-4 flex items-center gap-1.5">
      <div
        className="flex-1 h-[2px] relative overflow-hidden rounded-full"
        style={{ background: "rgba(255,45,106,0.15)" }}
      >
        {active && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-0 h-full w-3 rounded-full"
                style={{ background: "#FF2D6A" }}
                initial={{ left: "-12px" }}
                animate={{ left: "calc(100% + 12px)" }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </>
        )}
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: active ? "#FF2D6A" : "rgba(255,45,106,0.25)" }}
          animate={
            active
              ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }
              : {}
          }
          transition={{
            duration: 0.6,
            delay: i * 0.12,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Violet Pulse Ring (Parzival) ─────────────────────────────── */

function PulsatingRing({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-2xl pointer-events-none"
              style={{
                inset: "-2px",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [1, 1.04 + i * 0.02, 1.08 + i * 0.03],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Capability Card ──────────────────────────────────────────── */

function CapabilityCard({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const isHero = capability.size === "hero";
  const isWide = capability.size === "wide";

  /* Decay hover effect — fade description text then recover */
  const handleDecayEnter = useCallback(() => {
    if (descRef.current) {
      descRef.current.style.transition = "opacity 0.2s ease-out";
      descRef.current.style.opacity = "0.3";
      setTimeout(() => {
        if (descRef.current) {
          descRef.current.style.transition = "opacity 0.4s ease-in";
          descRef.current.style.opacity = "1";
        }
      }, 250);
    }
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setHovered(true);
      const el = e.currentTarget;
      el.style.borderColor = `${capability.color}40`;
      el.style.background =
        "linear-gradient(135deg, rgba(20,25,65,0.95) 0%, rgba(12,16,42,0.98) 100%)";
      el.style.transform = "translateY(-4px)";
      el.style.boxShadow = `0 0 60px ${capability.color}10, 0 20px 50px rgba(0,0,0,0.5)`;

      if (capability.hoverEffect === "decay") {
        handleDecayEnter();
      }
    },
    [capability.color, capability.hoverEffect, handleDecayEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setHovered(false);
      const el = e.currentTarget;
      el.style.borderColor = `${capability.color}15`;
      el.style.background =
        "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)";
      el.style.transform = "translateY(0)";
      el.style.boxShadow = "none";
    },
    [capability.color]
  );

  const CardTag = capability.href ? "a" : "div";
  const linkProps = capability.href
    ? { href: capability.href, target: undefined, rel: undefined }
    : {};

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative p-7 rounded-2xl cursor-default transition-all duration-400 group ${
        isHero
          ? "col-span-2 row-span-2"
          : isWide
          ? "col-span-2"
          : ""
      }`}
      style={{
        background:
          "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
        border: `1px solid ${capability.color}15`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${capability.color}50, transparent)`,
          opacity: 0.5,
        }}
      />

      {/* Glow orb in corner */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${capability.color}10 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Scanline overlay for security card */}
      {capability.hoverEffect === "scanline" && (
        <ScanlineOverlay active={hovered} />
      )}

      {/* Pulse rings for Parzival card */}
      {capability.hoverEffect === "pulse" && (
        <PulsatingRing active={hovered} />
      )}

      {/* Tag */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest mb-5"
        style={{
          background: `${capability.color}10`,
          border: `1px solid ${capability.color}25`,
          color: capability.color,
          fontFamily: "var(--font-mono)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: capability.color }}
        />
        {capability.tag}
      </div>

      {/* Icon */}
      <div
        className={`rounded-2xl flex items-center justify-center mb-5 ${
          isHero ? "w-16 h-16" : "w-14 h-14"
        }`}
        style={{
          background: `${capability.color}10`,
          border: `1px solid ${capability.color}25`,
          boxShadow: `0 0 25px ${capability.color}12 inset`,
        }}
      >
        <capability.icon
          className={isHero ? "w-8 h-8" : "w-5.5 h-5.5"}
          style={{ color: capability.color }}
        />
      </div>

      {/* Title */}
      <CardTag {...linkProps}>
        <h3
          className={`font-bold mb-3 ${isHero ? "text-3xl" : "text-lg"}`}
          style={{
            fontFamily: "var(--font-heading)",
            color: "#E8EAF0",
          }}
        >
          {capability.title}
          {capability.href && (
            <span
              className="inline-block ml-2 text-xs opacity-50 group-hover:opacity-100 transition-opacity"
              style={{ color: capability.color }}
            >
              &rarr;
            </span>
          )}
        </h3>
      </CardTag>

      {/* Description */}
      <p
        ref={descRef}
        className={`leading-relaxed ${isHero ? "text-base" : "text-sm"}`}
        style={{
          color: "#7A8AAA",
          fontFamily: "var(--font-body)",
        }}
      >
        {capability.description}
      </p>

      {/* Hero card: decay bar animation */}
      {isHero && <DecayBar />}

      {/* Hero card: status badges */}
      {isHero && (
        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <span
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
              color: "#8B5CF6",
            }}
          >
            Active
          </span>
          <span
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              background: "rgba(0,245,255,0.06)",
              border: "1px solid rgba(0,245,255,0.15)",
              color: "#00F5FF",
            }}
          >
            Self-learning
          </span>
        </div>
      )}

      {/* Wide card: collection dots */}
      {isWide && (
        <div className="mt-5 flex items-center gap-3">
          {collectionDots.map((dot) => (
            <div key={dot.label} className="flex items-center gap-1.5">
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: dot.color,
                  boxShadow: `0 0 8px ${dot.color}50`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  delay: collectionDots.indexOf(dot) * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span
                className="text-[10px] hidden sm:inline"
                style={{
                  color: "#5A6480",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {dot.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* GitHub card: commit dots */}
      {capability.hoverEffect === "commits" && (
        <CommitDots active={hovered} />
      )}

      {/* Bottom hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${capability.color}08 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}

/* ─── Capabilities Section ─────────────────────────────────────── */

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-32 px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,45,106,0.03) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Zap className="w-3.5 h-3.5" />
            Capabilities
          </div>

          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Everything Your AI{" "}
            <span className="gradient-text-animated">Needs to Remember</span>
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{
              color: "#7A8AAA",
              fontFamily: "var(--font-body)",
            }}
          >
            Production-grade neural memory with semantic decay, security
            pipelines, and domain-aware embeddings — not a glorified key-value
            store.
          </p>
        </AnimatedSection>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]"
        >
          {capabilities.map((capability, i) => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              index={i}
            />
          ))}
        </motion.div>

        {/* Bottom note */}
        <AnimatedSection delay={0.4}>
          <p
            className="text-center mt-16 text-sm"
            style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
          >
            All capabilities are open source and self-hostable &middot; MIT
            License
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
