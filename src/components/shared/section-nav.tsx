"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SectionNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SectionNavProps {
  sections: SectionNavItem[];
  accentColor?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const TEXT_DIM = "#4A5568";

// ─── Component ──────────────────────────────────────────────────────────────────

export function SectionNav({ sections, accentColor = "#00F5FF" }: SectionNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-1">
      {sections.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-end"
            aria-label={`Navigate to ${label}`}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-full mr-2 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap"
                  style={{
                    background: `${accentColor}1A`,
                    border: `1px solid ${accentColor}30`,
                    color: accentColor,
                  }}
                >
                  {label}
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: isActive ? `${accentColor}15` : "transparent",
                border: `1px solid ${isActive ? accentColor + "60" : accentColor + "20"}`,
                boxShadow: isActive ? `0 0 20px ${accentColor}30` : "none",
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: isActive ? accentColor : TEXT_DIM }} />
              {isActive && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: `${accentColor}10`, animationDuration: "2s" }}
                />
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
