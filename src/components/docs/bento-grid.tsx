"use client";

import {
  Layers,
  Download,
  Database,
  Webhook,
  Shield,
  Github,
  BarChart3,
  Code2,
  Zap,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TiltCard } from "./tilt-card";
import { ArchitecturePreview } from "./card-previews/architecture-preview";
import { CollectionsPreview } from "./card-previews/collections-preview";
import { SecurityPreview } from "./card-previews/security-preview";
import { HooksPreview } from "./card-previews/hooks-preview";
import { type ReactNode } from "react";

interface DocCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  colSpan: number;
  rowSpan: number;
  href: string;
  preview?: ReactNode;
}

const DOC_CARDS: DocCard[] = [
  {
    id: "architecture",
    title: "Architecture",
    description: "Pipeline overview, signal-triggered memory capture, dual-embedding routing, and the 9-step processing flow.",
    icon: Layers,
    color: "#8B5CF6",
    colSpan: 8,
    rowSpan: 2,
    href: "/docs/architecture",
    preview: <ArchitecturePreview />,
  },
  {
    id: "install",
    title: "Installation",
    description: "Docker stack setup, environment configuration, and first-run guide.",
    icon: Download,
    color: "#3B82F6",
    colSpan: 4,
    rowSpan: 2,
    href: "#install",
  },
  {
    id: "collections",
    title: "Collections",
    description: "5 Qdrant collections — code-patterns, conventions, discussions, github, jira-data.",
    icon: Database,
    color: "#00F5FF",
    colSpan: 4,
    rowSpan: 2,
    href: "#collections",
    preview: <CollectionsPreview />,
  },
  {
    id: "hooks",
    title: "Hooks",
    description: "Claude Code hook pipeline — how memories flow from conversation to vector storage.",
    icon: Webhook,
    color: "#FF2D6A",
    colSpan: 4,
    rowSpan: 1,
    href: "#hooks",
    preview: <HooksPreview />,
  },
  {
    id: "security",
    title: "Security",
    description: "3-layer security pipeline — PII detection, secrets scanning, and content filtering.",
    icon: Shield,
    color: "#FF2D6A",
    colSpan: 4,
    rowSpan: 1,
    href: "#security",
    preview: <SecurityPreview />,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "GitHub sync, Jira sync, and Langfuse observability configuration.",
    icon: Github,
    color: "#00F5FF",
    colSpan: 4,
    rowSpan: 1,
    href: "#integrations",
  },
  {
    id: "monitoring",
    title: "Monitoring",
    description: "Prometheus metrics, Grafana dashboards, and health check endpoints.",
    icon: BarChart3,
    color: "#FFB800",
    colSpan: 4,
    rowSpan: 1,
    href: "#monitoring",
  },
  {
    id: "api",
    title: "API Reference",
    description: "REST API reference for direct collection access, search, and memory management.",
    icon: Code2,
    color: "#3B82F6",
    colSpan: 8,
    rowSpan: 1,
    href: "#api",
  },
  {
    id: "quickstart-card",
    title: "Quick Start",
    description: "3 commands to a running AI Memory instance.",
    icon: Zap,
    color: "#00FF88",
    colSpan: 4,
    rowSpan: 1,
    href: "#quickstart",
  },
];

function BentoCard({ card }: { card: DocCard }) {
  const isHero = card.colSpan >= 8;

  const handleClick = () => {
    if (card.href.startsWith("/")) {
      window.location.href = card.href;
    } else {
      document.querySelector(card.href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: "rgba(15, 20, 40, 0.55)",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        border: `1px solid ${card.color}20`,
        boxShadow: `0 0 40px ${card.color}04, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${card.color}40`;
        e.currentTarget.style.boxShadow = `0 0 60px ${card.color}08, 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${card.color}20`;
        e.currentTarget.style.boxShadow = `0 0 40px ${card.color}04, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`;
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)` }}
      />

      {/* Left color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: `linear-gradient(to bottom, ${card.color}, ${card.color}30)` }}
      />

      {/* Content */}
      <div className={cn("relative p-6", isHero && "p-8")}>
        {/* Icon + Title row */}
        <div className="flex items-start gap-4 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${card.color}15`,
              border: `1px solid ${card.color}40`,
            }}
          >
            <card.icon className="w-5 h-5" style={{ color: card.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold mb-1",
                isHero ? "text-xl" : "text-lg"
              )}
              style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
            >
              {card.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#7A8AAA" }}
            >
              {card.description}
            </p>
          </div>
          <ArrowRight
            className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
            style={{ color: card.color }}
          />
        </div>

        {/* Card preview */}
        {card.preview}
      </div>
    </div>
  );
}

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
      {DOC_CARDS.map((card, i) => (
        <div
          key={card.id}
          className={cn(
            "col-span-1 scroll-reveal",
            card.colSpan >= 8 ? "md:col-span-8" : "md:col-span-4",
            card.colSpan === 12
              ? "lg:col-span-12"
              : card.colSpan === 8
              ? "lg:col-span-8"
              : "lg:col-span-4",
            card.rowSpan === 2 && "lg:row-span-2"
          )}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <TiltCard>
            <BentoCard card={card} />
          </TiltCard>
        </div>
      ))}
    </div>
  );
}
