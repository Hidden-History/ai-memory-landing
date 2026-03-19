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
  Cpu,
  Eye,
} from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const features = [
  {
    icon: Brain,
    iconColor: "#00F5FF",
    title: "Semantic Decay",
    description:
      "Memories age naturally over time. Stale context fades while frequently accessed knowledge stays sharp — just like human memory.",
    gradient: "rgba(0, 245, 255, 0.04)",
    borderColor: "rgba(0, 245, 255, 0.12)",
    hoverBorder: "rgba(0, 245, 255, 0.35)",
    orbClass: "icon-orb-cyan",
    large: true,
    tag: "CORE",
    tagColor: "#00F5FF",
  },
  {
    icon: Shield,
    iconColor: "#00FF88",
    title: "3-Layer Security",
    description:
      "PII detection, secrets scanning, and content filtering pipeline protects every memory before storage.",
    gradient: "rgba(0, 255, 136, 0.04)",
    borderColor: "rgba(0, 255, 136, 0.12)",
    hoverBorder: "rgba(0, 255, 136, 0.35)",
    orbClass: "icon-orb-cyan",
    tag: "SECURITY",
    tagColor: "#00FF88",
  },
  {
    icon: GitBranch,
    iconColor: "#8B5CF6",
    title: "Dual Embedding Routing",
    description:
      "Separate embedding models for code and prose — each optimized for its domain.",
    gradient: "rgba(139, 92, 246, 0.04)",
    borderColor: "rgba(139, 92, 246, 0.12)",
    hoverBorder: "rgba(139, 92, 246, 0.35)",
    orbClass: "icon-orb-violet",
    tag: "INTELLIGENCE",
    tagColor: "#8B5CF6",
  },
  {
    icon: Gauge,
    iconColor: "#FFB800",
    title: "Progressive Context",
    description:
      "Token-budget-aware delivery ensures the most relevant memories fit within your context window.",
    gradient: "rgba(255, 184, 0, 0.04)",
    borderColor: "rgba(255, 184, 0, 0.12)",
    hoverBorder: "rgba(255, 184, 0, 0.35)",
    orbClass: "icon-orb-amber",
    tag: "EFFICIENCY",
    tagColor: "#FFB800",
  },
  {
    icon: Clock,
    iconColor: "#22D3EE",
    title: "Freshness Detection",
    description:
      "Automatically flags stale memories and surfaces the most recently relevant context.",
    gradient: "rgba(34, 211, 238, 0.04)",
    borderColor: "rgba(34, 211, 238, 0.12)",
    hoverBorder: "rgba(34, 211, 238, 0.35)",
    orbClass: "icon-orb-cyan",
    tag: "AUTOMATION",
    tagColor: "#22D3EE",
  },
  {
    icon: Github,
    iconColor: "#FF2D6A",
    title: "GitHub / Jira Sync",
    description:
      "Repository history and issue tracking data become searchable by meaning, not just keywords.",
    gradient: "rgba(255, 45, 106, 0.04)",
    borderColor: "rgba(255, 45, 106, 0.12)",
    hoverBorder: "rgba(255, 45, 106, 0.35)",
    orbClass: "icon-orb-magenta",
    tag: "INTEGRATION",
    tagColor: "#FF2D6A",
  },
  {
    icon: Database,
    iconColor: "#00F5FF",
    title: "5 Specialized Collections",
    description:
      "Domain-optimized Qdrant collections — code-patterns, conventions, discussions, github, and jira-data.",
    gradient: "rgba(0, 245, 255, 0.04)",
    borderColor: "rgba(0, 245, 255, 0.12)",
    hoverBorder: "rgba(0, 245, 255, 0.35)",
    orbClass: "icon-orb-cyan",
    tag: "ARCHITECTURE",
    tagColor: "#00F5FF",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-40 px-6">
      {/* Neural grid background */}
      <div className="absolute inset-0 neural-grid opacity-40" />

      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,45,106,0.03) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-24">
          <div className="section-label mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}>
            Memory That{" "}
            <span className="gradient-text-animated">Actually Works</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}>
            Qdrant-powered vector search with semantic decay, security pipelines,
            and domain-aware embeddings — not a toy.
          </p>
        </AnimatedSection>

        {/* Feature grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
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
              className={`relative p-7 rounded-2xl cursor-pointer transition-all duration-400 group ${
                feature.large ? "md:col-span-2" : ""
              }`}
              style={{
                background: feature.gradient,
                border: `1px solid ${feature.borderColor}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = feature.hoverBorder;
                e.currentTarget.style.background = feature.gradient.replace("0.04", "0.08");
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 40px ${feature.iconColor}15, 0 12px 40px rgba(0,0,0,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = feature.borderColor;
                e.currentTarget.style.background = feature.gradient;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Tag */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase mb-5"
                style={{
                  background: `${feature.iconColor}12`,
                  border: `1px solid ${feature.iconColor}30`,
                  color: feature.tagColor,
                  fontFamily: "var(--font-mono)"
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: feature.tagColor }} />
                {feature.tag}
              </div>

              {/* Icon */}
              <div className={`w-13 h-13 rounded-xl flex items-center justify-center mb-5 ${feature.orbClass}`}>
                <feature.icon className="w-6 h-6" style={{ color: feature.iconColor }} />
              </div>

              {/* Title */}
              <h3
                className={`font-semibold mb-3 ${feature.large ? "text-2xl" : "text-lg"}`}
                style={{
                  fontFamily: "var(--font-heading)",
                  color: feature.large ? "#E8EAF0" : "#E8EAF0"
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: feature.large ? "#8892A8" : "#8892A8",
                  fontFamily: "var(--font-body)"
                }}
              >
                {feature.description}
              </p>

              {/* Corner glow accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle, ${feature.iconColor}08 0%, transparent 70%)`,
                  transform: "translate(30%, -30%)",
                  filter: "blur(30px)"
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
