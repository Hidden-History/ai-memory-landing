"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  GitBranch,
  Gauge,
  Clock,
  Github,
  Database,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const features = [
  {
    icon: Brain,
    color: "#00F5FF",
    title: "Semantic Decay",
    description:
      "Memories age naturally over time. Stale context fades while frequently accessed knowledge stays sharp — just like human memory.",
    tag: "CORE FEATURE",
    size: "large",
  },
  {
    icon: Shield,
    color: "#00FF88",
    title: "3-Layer Security",
    description:
      "PII detection, secrets scanning, and content filtering pipeline protects every memory before storage.",
    tag: "SECURITY",
    size: "normal",
  },
  {
    icon: GitBranch,
    color: "#8B5CF6",
    title: "Dual Embedding Routing",
    description:
      "Separate embedding models for code and prose — each optimized for its domain.",
    tag: "INTELLIGENCE",
    size: "normal",
  },
  {
    icon: Gauge,
    color: "#FFB800",
    title: "Progressive Context",
    description:
      "Token-budget-aware delivery ensures the most relevant memories fit within your context window.",
    tag: "EFFICIENCY",
    size: "normal",
  },
  {
    icon: Clock,
    color: "#22D3EE",
    title: "Freshness Detection",
    description:
      "Automatically flags stale memories and surfaces the most recently relevant context.",
    tag: "AUTOMATION",
    size: "normal",
  },
  {
    icon: Github,
    color: "#FF2D6A",
    title: "GitHub / Jira Sync",
    description:
      "Repository history and issue tracking data become searchable by meaning, not just keywords.",
    tag: "INTEGRATION",
    size: "normal",
  },
  {
    icon: Database,
    color: "#00F5FF",
    title: "5 Specialized Collections",
    description:
      "Domain-optimized Qdrant collections — code-patterns, conventions, discussions, github, and jira-data.",
    tag: "ARCHITECTURE",
    size: "wide",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-40 px-6">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,45,106,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Features
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Memory That{" "}
            <span className="gradient-text-animated">Actually Works</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{
              color: "#7A8AAA",
              fontFamily: "var(--font-body)",
            }}
          >
            Qdrant-powered vector search with semantic decay, security pipelines,
            and domain-aware embeddings — not a toy.
          </p>
        </AnimatedSection>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`relative p-7 rounded-2xl cursor-default transition-all duration-400 group ${
                feature.size === "large"
                  ? "col-span-2 row-span-2"
                  : feature.size === "wide"
                  ? "col-span-2"
                  : ""
              }`}
              style={{
                background: "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                border: `1px solid ${feature.color}15`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${feature.color}40`;
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(20,25,65,0.95) 0%, rgba(12,16,42,0.98) 100%)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 0 60px ${feature.color}10, 0 20px 50px rgba(0,0,0,0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${feature.color}15`;
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${feature.color}50, transparent)`,
                  opacity: 0.5,
                }}
              />

              {/* Glow orb in corner */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle, ${feature.color}10 0%, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />

              {/* Tag */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest mb-5"
                style={{
                  background: `${feature.color}10`,
                  border: `1px solid ${feature.color}25`,
                  color: feature.color,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: feature.color }}
                />
                {feature.tag}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: `${feature.color}10`,
                  border: `1px solid ${feature.color}25`,
                  boxShadow: `0 0 25px ${feature.color}12 inset`,
                }}
              >
                <feature.icon
                  className={feature.size === "large" ? "w-7 h-7" : "w-5.5 h-5.5"}
                  style={{ color: feature.color }}
                />
              </div>

              {/* Title */}
              <h3
                className={`font-bold mb-3 ${
                  feature.size === "large" ? "text-3xl" : "text-lg"
                }`}
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#E8EAF0",
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className={`leading-relaxed ${
                  feature.size === "large" ? "text-base" : "text-sm"
                }`}
                style={{
                  color: "#7A8AAA",
                  fontFamily: "var(--font-body)",
                }}
              >
                {feature.description}
              </p>

              {/* Large card: extra decorative element */}
              {feature.size === "large" && (
                <div className="absolute bottom-6 right-6 flex items-center gap-2">
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
                    Active
                  </span>
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
                    Self-learning
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
