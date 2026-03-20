"use client";

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
import { Particles } from "@/components/shared/page-decorations";

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

export default function Home() {
  return (
    <>
      {/* Global background layers */}
      <div className="fixed inset-0 bg-mesh z-0" />
      <Particles />

      {/* Right-side section nav */}
      <SectionNav sections={HOME_SECTIONS} />

      <main id="main" className="relative z-10">
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
    </>
  );
}
