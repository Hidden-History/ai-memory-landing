"use client";

import { useState, useEffect } from "react";

/* ── Section Divider: horizontal color-cycling line + vertical stem with traveling dot ── */
export function SectionDivider() {
  return (
    <div className="relative flex flex-col items-center" aria-hidden="true">
      {/* Horizontal line — color cycles via animation */}
      <div
        className="w-full max-w-[80%] h-px"
        style={{
          backgroundImage: "linear-gradient(90deg, transparent 0%, #00F5FF 25%, #8B5CF6 50%, #FF2D6A 75%, transparent 100%)",
          backgroundSize: "300% 100%",
          animation: "divider-color-shift 8s ease infinite",
        }}
      />
      {/* Vertical stem with gradient */}
      <div className="relative h-16 flex items-center justify-center">
        <div
          className="w-px h-full"
          style={{
            background: "linear-gradient(180deg, #00F5FF30, #8B5CF630)",
          }}
        />
        {/* Traveling dot — animates up/down */}
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: "#00F5FF",
            boxShadow: "0 0 8px #00F5FF, 0 0 16px #00F5FF",
            animation: "data-particle 2s ease-in-out infinite",
          }}
        />
        {/* Junction dot at center */}
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: "#8B5CF6",
            boxShadow: "0 0 10px #8B5CF660",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>
    </div>
  );
}

/* ── Floating particles (client-only to avoid hydration mismatch) ── */
export function Particles() {
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
      Array.from({ length: 12 }, (_, i) => ({
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
