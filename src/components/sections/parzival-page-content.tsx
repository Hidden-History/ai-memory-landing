"use client";

import { useState, useEffect } from "react";
import { Compass, Settings, GitBranch, ShieldAlert, Users, FileCode2 } from "lucide-react";
import { SectionNav } from "@/components/shared/section-nav";
import { Particles, SectionDivider } from "@/components/shared/page-decorations";
import { ParzivalIdentity } from "@/components/sections/parzival-identity";
import { ParzivalModes } from "@/components/sections/parzival-modes";
import { ParzivalWorkflows } from "@/components/sections/parzival-workflows";
import { ParzivalConstraints } from "@/components/sections/parzival-constraints";
import { ParzivalAgents } from "@/components/sections/parzival-agents";
import { ParzivalSpecs } from "@/components/sections/parzival-specs";
import { ParzivalCTA } from "@/components/sections/parzival-cta";

// ─── Section Nav Configuration ─────────────────────────────────────────────────

const PARZIVAL_SECTIONS = [
  { id: "identity", label: "Identity", icon: Compass },
  { id: "modes", label: "Modes", icon: Settings },
  { id: "workflows", label: "Workflows", icon: GitBranch },
  { id: "constraints", label: "Constraints", icon: ShieldAlert },
  { id: "interface", label: "Interface", icon: Users },
  { id: "specs", label: "Specs", icon: FileCode2 },
];

// ─── Circuit Connector Divider ─────────────────────────────────────────────────

function CircuitConnector() {
  return (
    <div className="relative h-16 flex items-center justify-center">
      <div
        className="w-px h-full"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(139,92,246,0.3), transparent)",
        }}
      />
      <div
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: "#8B5CF6",
          boxShadow: "0 0 8px #8B5CF6",
        }}
      />
    </div>
  );
}

// ─── HUD Overlay ───────────────────────────────────────────────────────────────

function HudOverlay() {
  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none"
      aria-hidden="true"
    >
      {/* Top-left diagnostic readout */}
      <div
        className="absolute top-4 left-4 flex items-center gap-1.5"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}
      >
        <span style={{ color: "rgba(139,92,246,0.8)" }}>[</span>
        <span style={{ color: "#8B5CF6" }}>PARZIVAL v2.0</span>
        <span style={{ color: "rgba(139,92,246,0.4)" }}>|</span>
        <span style={{ color: "rgba(139,92,246,0.6)" }}>SYSTEM:</span>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{
            background: "#00FF88",
            boxShadow: "0 0 6px #00FF88, 0 0 12px rgba(0,255,136,0.4)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
        <span style={{ color: "#00FF88" }}>ACTIVE</span>
        <span style={{ color: "rgba(139,92,246,0.8)" }}>]</span>
      </div>

      {/* Top-right session indicator */}
      <div
        className="absolute top-4 right-4"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}
      >
        <span style={{ color: "rgba(34,211,238,0.4)" }}>[</span>
        <span style={{ color: "rgba(34,211,238,0.5)" }}>SESSION: NOMINAL</span>
        <span style={{ color: "rgba(34,211,238,0.4)" }}>]</span>
      </div>

      {/* Bottom-left telemetry line */}
      <div
        className="absolute bottom-4 left-4 flex items-center gap-2"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}
      >
        <span style={{ color: "rgba(139,92,246,0.3)" }}>
          MEM: 0x7F4A &bull; PID: 2049 &bull; UPTIME: 99.97%
        </span>
      </div>

      {/* Bottom-right frame counter */}
      <div
        className="absolute bottom-4 right-4"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}
      >
        <span style={{ color: "rgba(34,211,238,0.25)" }}>
          FRM: 60.0 &bull; LAT: 0.8ms
        </span>
      </div>

      {/* Corner bracket decorations — top-left */}
      <div
        className="absolute top-10 left-4 w-6 h-6"
        style={{
          borderLeft: "1px solid rgba(139,92,246,0.2)",
          borderTop: "1px solid rgba(139,92,246,0.2)",
        }}
      />

      {/* Corner bracket decorations — top-right */}
      <div
        className="absolute top-10 right-4 w-6 h-6"
        style={{
          borderRight: "1px solid rgba(139,92,246,0.2)",
          borderTop: "1px solid rgba(139,92,246,0.2)",
        }}
      />

      {/* Corner bracket decorations — bottom-left */}
      <div
        className="absolute bottom-10 left-4 w-6 h-6"
        style={{
          borderLeft: "1px solid rgba(139,92,246,0.2)",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
        }}
      />

      {/* Corner bracket decorations — bottom-right */}
      <div
        className="absolute bottom-10 right-4 w-6 h-6"
        style={{
          borderRight: "1px solid rgba(139,92,246,0.2)",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
        }}
      />
    </div>
  );
}

// ─── Page Content Component ─────────────────────────────────────────────────────

export function ParzivalPageContent() {
  const [hudVisible, setHudVisible] = useState(false);

  useEffect(() => {
    const handler = () => setHudVisible(window.scrollY > 100);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <main id="main" className="min-h-screen relative">
      {/* Circuit board background */}
      <div className="fixed inset-0 circuit-trace z-0" aria-hidden="true" />
      <Particles />

      {/* Scan line */}
      <div className="scan-line" aria-hidden="true" />

      {/* HUD overlay — appears after scrolling 100px */}
      {hudVisible && <HudOverlay />}

      {/* Right-side section nav */}
      <SectionNav sections={PARZIVAL_SECTIONS} accentColor="#8B5CF6" />

      {/* Page content */}
      <div className="relative z-10">
        <div id="identity">
          <ParzivalIdentity />
        </div>
        <SectionDivider />
        <div id="modes">
          <ParzivalModes />
        </div>
        <SectionDivider />
        <div id="workflows">
          <ParzivalWorkflows />
        </div>
        <SectionDivider />
        <div id="constraints">
          <ParzivalConstraints />
        </div>
        <SectionDivider />
        <div id="interface">
          <ParzivalAgents />
        </div>
        <SectionDivider />
        <div id="specs">
          <ParzivalSpecs />
        </div>
        <SectionDivider />
        <ParzivalCTA />
      </div>
    </main>
  );
}
