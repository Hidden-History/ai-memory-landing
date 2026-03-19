"use client";

import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Github,
  Database,
  Container,
  BarChart3,
  Activity,
  Code2,
  Brain,
  FlaskConical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Integration definitions ────────────────────────── */

interface IntegrationItem {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const integrations: IntegrationItem[] = [
  {
    name: "GitHub",
    description: "PR history & commit context",
    icon: Github,
    color: "#E8EAF0",
  },
  {
    name: "Qdrant",
    description: "Vector search engine",
    icon: Database,
    color: "#00F5FF",
  },
  {
    name: "Docker",
    description: "One-command deployment",
    icon: Container,
    color: "#2496ED",
  },
  {
    name: "Langfuse",
    description: "LLM observability & traces",
    icon: FlaskConical,
    color: "#FF6B35",
  },
  {
    name: "Prometheus",
    description: "Metrics & alerting",
    icon: Activity,
    color: "#E6522C",
  },
  {
    name: "Grafana",
    description: "Dashboard visualization",
    icon: BarChart3,
    color: "#F46800",
  },
  {
    name: "Python",
    description: "SDK & scripting support",
    icon: Code2,
    color: "#3776AB",
  },
  {
    name: "Claude",
    description: "Native hook integration",
    icon: Brain,
    color: "#00F5FF",
  },
];

/* ── Single card ────────────────────────────────────── */

function BeltCard({ item }: { item: IntegrationItem }) {
  const Icon = item.icon;
  return (
    <div
      className="relative flex-shrink-0 w-[280px] p-5 rounded-2xl cursor-default group transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, rgba(15,20,50,0.85) 0%, rgba(10,13,35,0.92) 100%)`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${item.color}25`,
        boxShadow: `0 0 0 1px ${item.color}06 inset, 0 12px 32px rgba(0,0,0,0.35)`,
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-4 right-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
        }}
      />

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${item.color}10`,
            border: `1px solid ${item.color}25`,
            boxShadow: `0 0 20px ${item.color}08 inset`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: item.color }} />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div
            className="font-semibold text-sm"
            style={{ color: item.color, fontFamily: "var(--font-heading)" }}
          >
            {item.name}
          </div>
          <div
            className="text-xs mt-0.5 truncate"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            {item.description}
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${item.color}08 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */

export function IntegrationsBelt() {
  // Duplicate items for seamless loop
  const doubled = [...integrations, ...integrations];

  return (
    <section id="integrations" className="relative py-32 px-6 overflow-hidden">
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

      {/* Section header (within max-w-6xl) */}
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection className="text-center mb-16">
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
            GitHub, Docker, Langfuse, Qdrant, Claude, Prometheus, Grafana — AI
            Memory plugs into your existing infrastructure.
          </p>
        </AnimatedSection>
      </div>

      {/* Full-width carousel container */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--color-bg-base), transparent)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, var(--color-bg-base), transparent)",
          }}
        />

        {/* Scrolling track */}
        <div
          className="flex gap-5 belt-scroll"
          style={{
            width: "max-content",
          }}
        >
          {doubled.map((item, i) => (
            <BeltCard key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* Additional note */}
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection delay={0.3}>
          <p
            className="text-center mt-12 text-sm"
            style={{ color: "#5A6480", fontFamily: "var(--font-mono)" }}
          >
            Plus: TypeScript, OpenAI, Anthropic, Jira, age encryption, SOPS, and
            more.
          </p>
        </AnimatedSection>
      </div>

      {/* Scoped styles */}
      <style>{`
        @keyframes belt-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .belt-scroll {
          animation: belt-scroll 30s linear infinite;
        }

        .belt-scroll:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .belt-scroll {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
