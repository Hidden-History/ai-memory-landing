"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/shared/animated-section";

/* ── Integration definitions ────────────────────────── */

const integrations = [
  {
    name: "GitHub",
    src: "/github-icon.svg",
    color: "#E8EAF0",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.12)",
    filter: "brightness(0) invert(1)",
  },
  {
    name: "Qdrant",
    src: "/qdrant-logo.svg",
    color: "#00F5FF",
    bg: "rgba(0,245,255,0.06)",
    border: "rgba(0,245,255,0.15)",
    filter: "none",
  },
  {
    name: "Docker",
    src: "/docker.svg",
    color: "#2496ED",
    bg: "rgba(36,150,237,0.06)",
    border: "rgba(36,150,237,0.15)",
    filter: "none",
  },
  {
    name: "Langfuse",
    src: "/langfuse.png",
    color: "#FF6B35",
    bg: "rgba(255,107,53,0.06)",
    border: "rgba(255,107,53,0.15)",
    filter: "none",
  },
  {
    name: "Prometheus",
    src: "/prometheus.svg",
    color: "#E6522C",
    bg: "rgba(230,82,44,0.06)",
    border: "rgba(230,82,44,0.15)",
    filter: "none",
  },
  {
    name: "Grafana",
    src: "/grafana.svg",
    color: "#F46800",
    bg: "rgba(244,104,0,0.06)",
    border: "rgba(244,104,0,0.15)",
    filter: "none",
  },
  {
    name: "Python",
    src: "/python.svg",
    color: "#3776AB",
    bg: "rgba(55,118,171,0.06)",
    border: "rgba(55,118,171,0.15)",
    filter: "none",
  },
  {
    name: "Ollama",
    src: "/ollama-logo.svg",
    color: "#FFFFFF",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.15)",
    filter: "none",
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.04) 0%, rgba(139,92,246,0.03) 50%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-20">
          <div className="section-label mb-8">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            Ecosystem
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Integrates with{" "}
            <span className="gradient-text-animated">Everything</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            GitHub, Docker, Langfuse, Qdrant, Prometheus, Grafana — AI Memory plugs
            into your existing infrastructure.
          </p>
        </AnimatedSection>

        {/* Logo grid */}
        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {integrations.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="relative p-6 rounded-2xl text-center cursor-default transition-all duration-300 group"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
                  border: `1px solid ${item.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${item.color}50`;
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 0 40px ${item.color}18, 0 20px 40px rgba(0,0,0,0.4)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = item.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-4 right-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
                  }}
                />

                {/* Logo container */}
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center p-2"
                  style={{
                    background: `${item.color}0E`,
                    border: `1.5px solid ${item.color}35`,
                    boxShadow: `0 0 25px ${item.color}10 inset, 0 0 20px ${item.color}15`,
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    style={{ filter: item.filter }}
                  />
                </div>

                {/* Name */}
                <div
                  className="text-sm font-semibold"
                  style={{ color: item.color, fontFamily: "var(--font-body)" }}
                >
                  {item.name}
                </div>

                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${item.color}06 0%, transparent 60%)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Additional note */}
        <AnimatedSection delay={0.3}>
          <p
            className="text-center mt-10 text-sm"
            style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
          >
            Plus: TypeScript, OpenAI, Anthropic, age encryption, SOPS, and more.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
