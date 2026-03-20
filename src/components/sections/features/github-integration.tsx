"use client";

import {
  Github,
  MessageSquare,
  GitPullRequest,
  FileDiff,
  CheckCircle,
  GitCommit,
  FileCode,
  Activity,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

/* ── Content type cards ──────────────────────────────── */

interface ContentType {
  title: string;
  color: string;
  icon: LucideIcon;
  description: string;
}

const contentTypes: ContentType[] = [
  {
    title: "Issues",
    color: "#00F5FF",
    icon: Github,
    description: "Issue titles, bodies, labels, assignees",
  },
  {
    title: "Issue Comments",
    color: "#00F5FF",
    icon: MessageSquare,
    description: "Discussion threads on issues",
  },
  {
    title: "Pull Requests",
    color: "#8B5CF6",
    icon: GitPullRequest,
    description: "PR descriptions, review status",
  },
  {
    title: "PR Diffs",
    color: "#8B5CF6",
    icon: FileDiff,
    description: "Code changes with file context",
  },
  {
    title: "PR Reviews",
    color: "#8B5CF6",
    icon: CheckCircle,
    description: "Review comments and approvals",
  },
  {
    title: "Commits",
    color: "#00FF88",
    icon: GitCommit,
    description: "Commit messages and file lists",
  },
  {
    title: "Code Blobs",
    color: "#FF2D6A",
    icon: FileCode,
    description: "AST-chunked source files",
  },
  {
    title: "CI Results",
    color: "#FFB800",
    icon: Activity,
    description: "Build/test pass/fail with logs",
  },
  {
    title: "Releases",
    color: "#00F5FF",
    icon: Tag,
    description: "Release notes and changelogs",
  },
];

/* ── Stats row ───────────────────────────────────────── */

const stats = ["SHA-256 Dedup", "ETag Caching", "5K req/hr", "Adaptive Backoff"];

/* ── Logo strip ──────────────────────────────────────── */

const logos = [
  { src: "/logos/github.png", alt: "GitHub" },
  { src: "/logos/git.png", alt: "Git" },
];

/* ── Single carousel card ────────────────────────────── */

function CarouselCard({ item }: { item: ContentType }) {
  const Icon = item.icon;
  return (
    <div
      className="relative flex-shrink-0 w-[240px] p-5 rounded-2xl cursor-default group transition-all duration-300"
      style={{
        background:
          "linear-gradient(135deg, rgba(15,20,50,0.85) 0%, rgba(10,13,35,0.92) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderLeft: `3px solid ${item.color}`,
        borderTop: `1px solid ${item.color}15`,
        borderRight: `1px solid ${item.color}15`,
        borderBottom: `1px solid ${item.color}15`,
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

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${item.color}10`,
            border: `1px solid ${item.color}25`,
            boxShadow: `0 0 20px ${item.color}08 inset`,
          }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: item.color }} />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div
            className="font-semibold text-sm mb-1"
            style={{ fontFamily: "var(--font-heading)", color: item.color }}
          >
            {item.title}
          </div>
          <div
            className="text-[11px] leading-relaxed"
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

/* ── Main Component ──────────────────────────────────── */

export function GitHubIntegration() {
  /* Duplicate items for seamless loop */
  const doubled = [...contentTypes, ...contentTypes];

  return (
    <section id="github" className="relative py-32 px-6 overflow-hidden">
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

      {/* Section header (max-w-5xl) */}
      <div className="max-w-5xl mx-auto relative">
        <AnimatedSection className="text-center mb-16">
          <div className="section-label mb-8">
            <Github className="w-3.5 h-3.5" />
            GitHub Integration
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Repository,{" "}
            <span className="gradient-text-animated">Searchable by Meaning</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
          >
            Full repository sync — issues, PRs, commits, code, CI results — all
            searchable semantically, not just by keywords.
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
          className="flex gap-5 github-belt-scroll"
          style={{ width: "max-content" }}
        >
          {doubled.map((item, i) => (
            <CarouselCard key={`${item.title}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* Stats row (max-w-4xl) */}
      <div className="max-w-4xl mx-auto relative">
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {stats.map((stat) => (
              <div
                key={stat}
                className="flex items-center justify-center p-4 rounded-xl text-center cursor-default transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,20,50,0.9), rgba(10,13,35,0.95))",
                  border: "1px solid rgba(0,245,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,245,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ fontFamily: "var(--font-mono)", color: "#7A8AAA" }}
                >
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Logo strip */}
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6 mt-10 opacity-40 hover:opacity-70 transition-opacity">
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "#3A4560" }}
            >
              Powered by
            </span>
            {logos.map((l) => (
              <img
                key={l.alt}
                src={l.src}
                alt={l.alt}
                className="h-6 w-auto grayscale"
              />
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Scoped styles */}
      <style>{`
        @keyframes github-belt-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .github-belt-scroll {
          animation: github-belt-scroll 35s linear infinite;
        }

        .github-belt-scroll:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .github-belt-scroll {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
