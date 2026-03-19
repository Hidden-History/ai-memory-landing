"use client";

import { ParzivalIdentity } from "@/components/sections/parzival-identity";
import { ParzivalModes } from "@/components/sections/parzival-modes";
import { ParzivalWorkflows } from "@/components/sections/parzival-workflows";
import { ParzivalConstraints } from "@/components/sections/parzival-constraints";
import { ParzivalAgents } from "@/components/sections/parzival-agents";
import { ParzivalSpecs } from "@/components/sections/parzival-specs";
import { ParzivalCTA } from "@/components/sections/parzival-cta";
import { ParzivalNav } from "@/components/sections/parzival-nav";

export default function ParzivalPage() {
  return (
    <main className="min-h-screen">
      <ParzivalNav />
      <div id="identity"><ParzivalIdentity /></div>
      <div className="section-divider" />
      <div id="modes"><ParzivalModes /></div>
      <div className="section-divider" />
      <div id="workflows"><ParzivalWorkflows /></div>
      <div className="section-divider" />
      <div id="constraints"><ParzivalConstraints /></div>
      <div className="section-divider" />
      <div id="interface"><ParzivalAgents /></div>
      <div className="section-divider" />
      <div id="specs"><ParzivalSpecs /></div>
      <div className="section-divider" />
      <ParzivalCTA />
    </main>
  );
}
