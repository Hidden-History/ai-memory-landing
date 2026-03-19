"use client";

import { useState, useEffect } from "react";
import { Zap, Layers, Globe, Bot, Code, DollarSign, Github, Sparkles } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { Capabilities } from "@/components/sections/capabilities";
import { SystemOverview } from "@/components/sections/system-overview";
import { IntegrationsBelt } from "@/components/sections/integrations-belt";
import { Parzival } from "@/components/sections/parzival";
import { DeveloperExperience } from "@/components/sections/developer-experience";
import { Pricing } from "@/components/sections/pricing";
import { GitHubCTA } from "@/components/sections/github-cta";
import { SectionNav } from "@/components/shared/section-nav";

/* ── Section nav items ───────────────────────────────────────────── */
const HOME_SECTIONS = [
  { id: "hero", label: "Home", icon: Sparkles },
  { id: "capabilities", label: "Capabilities", icon: Zap },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "parzival-teaser", label: "Parzival", icon: Bot },
  { id: "developer-experience", label: "Developer", icon: Code },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "cta", label: "GitHub", icon: Github },
];

/* ── Floating particles (client-only to avoid hydration mismatch) ── */
function Particles() {
  const [particles, setParticles] = useState<
    {
      id: number;
      size: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
      opacity: number;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.4 + 0.1,
        color:
          i % 3 === 0
            ? "#00F5FF"
            : i % 3 === 1
            ? "#8B5CF6"
            : "#FF2D6A",
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.color,
            opacity: p.opacity,
            filter: "blur(0.5px)",
            animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating geometric shapes for hero area ────────── */
function GeometricAccents() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large faint hexagon top-right */}
      <div
        className="shape-hex animate-spin-slow"
        style={{
          top: "5%",
          right: "3%",
          width: "200px",
          height: "200px",
          opacity: 0.4,
          animationDuration: "40s",
        }}
      />
      {/* Small hexagon bottom-left */}
      <div
        className="shape-hex animate-float-delayed"
        style={{
          bottom: "15%",
          left: "2%",
          width: "60px",
          height: "60px",
          opacity: 0.3,
        }}
      />
      {/* Triangle top-left */}
      <div
        className="shape-tri"
        style={{
          top: "20%",
          left: "8%",
          opacity: 0.3,
          animationDuration: "15s",
        }}
      />
      {/* Triangle bottom-right */}
      <div
        className="shape-tri"
        style={{
          bottom: "25%",
          right: "10%",
          opacity: 0.25,
          animationDuration: "18s",
          animationDirection: "reverse",
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Global background layers */}
      <div className="fixed inset-0 bg-mesh" style={{ zIndex: 0 }} />
      <GeometricAccents />
      <Particles />

      {/* Right-side section nav */}
      <SectionNav sections={HOME_SECTIONS} />

      <main className="relative z-10">
        <div id="hero">
          <Hero />
        </div>
        <div id="capabilities">
          <Capabilities />
        </div>
        <div id="architecture">
          <SystemOverview />
        </div>
        <div id="integrations">
          <IntegrationsBelt />
        </div>
        <div id="parzival-teaser">
          <Parzival />
        </div>
        <div id="developer-experience">
          <DeveloperExperience />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="cta">
          <GitHubCTA />
        </div>
      </main>

      <style>{`
        @keyframes particle-drift {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) translateX(-10px);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-40px) translateX(5px);
            opacity: 0.35;
          }
        }
      `}</style>
    </>
  );
}
