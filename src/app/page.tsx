"use client";

import { Hero } from "@/components/sections/hero";
import { Differentiators } from "@/components/sections/differentiators";
import { Features } from "@/components/sections/features";
import { Architecture } from "@/components/sections/architecture";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Integrations } from "@/components/sections/integrations";
import { Parzival } from "@/components/sections/parzival";
import { CodeExample } from "@/components/sections/code-example";
import { QuickStart } from "@/components/sections/quick-start";
import { MemoryTypes } from "@/components/sections/memory-types";
import { Integration } from "@/components/sections/integration";
import { Pricing } from "@/components/sections/pricing";
import { GitHubCTA } from "@/components/sections/github-cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="section-divider" />
      <Differentiators />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <Architecture />
      <div className="section-divider" />
      <HowItWorks />
      <div className="section-divider" />
      <Integrations />
      <div className="section-divider" />
      <Parzival />
      <div className="section-divider" />
      <CodeExample />
      <div className="section-divider" />
      <QuickStart />
      <div className="section-divider" />
      <MemoryTypes />
      <div className="section-divider" />
      <Integration />
      <div className="section-divider" />
      <Pricing />
      <div className="section-divider" />
      <GitHubCTA />
    </main>
  );
}
