"use client";

import { ArchitectureHero } from "@/components/sections/architecture-v2";
import { ArchitecturePrinciple } from "@/components/sections/architecture-v2";
import { ArchitectureCollections } from "@/components/sections/architecture-v2";
import { ArchitecturePipeline } from "@/components/sections/architecture-v2";
import { ArchitectureHooks } from "@/components/sections/architecture-v2";
import { ArchitectureTriggers } from "@/components/sections/architecture-v2";
import { ArchitectureTripleFusion } from "@/components/sections/architecture-v2";
import { ArchitectureReference } from "@/components/sections/architecture-v2";
import { ArchitectureCTA } from "@/components/sections/architecture-v2";

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen">
      {/* Global animation keyframes */}
      <style>{`
        @keyframes dash-flow {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(36px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(36px) rotate(-360deg); }
        }
        @keyframes orbit-reverse {
          from { transform: rotate(0deg) translateX(36px) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(36px) rotate(360deg); }
        }
      `}</style>

      <div id="hero"><ArchitectureHero /></div>
      <div className="section-divider" />
      <div id="principle"><ArchitecturePrinciple /></div>
      <div className="section-divider" />
      <div id="collections"><ArchitectureCollections /></div>
      <div className="section-divider" />
      <div id="pipeline"><ArchitecturePipeline /></div>
      <div className="section-divider" />
      <div id="hooks"><ArchitectureHooks /></div>
      <div className="section-divider" />
      <div id="triggers"><ArchitectureTriggers /></div>
      <div className="section-divider" />
      <div id="fusion"><ArchitectureTripleFusion /></div>
      <div className="section-divider" />
      <div id="reference"><ArchitectureReference /></div>
      <div className="section-divider" />
      <ArchitectureCTA />
    </main>
  );
}
