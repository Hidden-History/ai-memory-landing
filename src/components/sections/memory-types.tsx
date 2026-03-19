"use client";

import { motion } from "framer-motion";
import { Code2, BookOpen, MessageCircle, Github, Ticket, Database } from "lucide-react";
import { AnimatedSection, fadeUp, stagger } from "@/components/shared/animated-section";

const collections = [
  {
    icon: Code2,
    name: "code-patterns",
    tag: "HOW",
    description: "Implementation patterns, architecture decisions, and code idioms",
    example: "React context + reducer for complex form state",
    color: "#00F5FF",
    bg: "rgba(0,245,255,0.04)",
    border: "rgba(0,245,255,0.12)",
  },
  {
    icon: BookOpen,
    name: "conventions",
    tag: "WHAT",
    description: "Team standards, naming rules, and style preferences",
    example: "Always use named exports, no default exports",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.04)",
    border: "rgba(139,92,246,0.12)",
  },
  {
    icon: MessageCircle,
    name: "discussions",
    tag: "WHY",
    description: "Decision rationale, architectural reasoning, and tradeoffs",
    example: "Chose Qdrant over Pinecone — self-hosted, no vendor lock-in",
    color: "#FF2D6A",
    bg: "rgba(255,45,106,0.04)",
    border: "rgba(255,45,106,0.12)",
  },
  {
    icon: Github,
    name: "github",
    tag: "WHEN",
    description: "Commit history, PR discussions, and repo activity searchable by meaning",
    example: "Auth refactor PR #247 — compliance-driven rewrite",
    color: "#22D3EE",
    bg: "rgba(34,211,238,0.04)",
    border: "rgba(34,211,238,0.12)",
  },
  {
    icon: Ticket,
    name: "jira-data",
    tag: "JIRA",
    description: "Issue tracking data, sprint context, and project planning",
    example: "INGEST-142: Pipeline timeout on large payloads",
    color: "#FFB800",
    bg: "rgba(255,184,0,0.04)",
    border: "rgba(255,184,0,0.12)",
  },
];

export function MemoryTypes() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,45,106,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <Database className="w-3.5 h-3.5" />
            Collections
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            5 Qdrant Collections,{" "}
            <span className="gradient-text-animated">One System</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Each collection is domain-optimized with its own embedding model,
            decay rules, and search configuration.
          </p>
        </AnimatedSection>

        {/* Collection cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {collections.map((col, i) => (
            <motion.div
              key={col.name}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative p-6 rounded-2xl cursor-default transition-all duration-350 group"
              style={{
                background: "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                border: `1px solid ${col.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${col.color}40`;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 0 50px ${col.color}10, 0 20px 50px rgba(0,0,0,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = col.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top glow line */}
              <div
                className="absolute top-0 left-0 right-0 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${col.color}60, transparent)`,
                }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mb-4"
                style={{
                  background: `${col.color}10`,
                  border: `1px solid ${col.color}25`,
                  boxShadow: `0 0 20px ${col.color}08 inset`,
                }}
              >
                <col.icon className="w-5 h-5" style={{ color: col.color }} />
              </div>

              {/* Name + tag */}
              <div className="flex items-center gap-2.5 mb-2">
                <h3
                  className="font-semibold text-lg"
                  style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
                >
                  {col.name}
                </h3>
                <span
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    background: `${col.color}10`,
                    border: `1px solid ${col.color}25`,
                    color: col.color,
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {col.tag}
                </span>
              </div>

              {/* Description */}
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
              >
                {col.description}
              </p>

              {/* Example */}
              <div
                className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                style={{
                  background: `${col.color}08`,
                  border: `1px solid ${col.color}15`,
                  fontFamily: "var(--font-mono)"
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: col.color }}
                />
                <span className="italic truncate" style={{ color: col.color, opacity: 0.8 }}>
                  &quot;{col.example}&quot;
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
