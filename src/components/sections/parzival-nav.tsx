"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Compass, GitBranch, ShieldAlert, Users, FileCode2 } from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";

const sections = [
  { id: "identity", label: "Identity", icon: Compass },
  { id: "modes", label: "Modes", icon: Compass },
  { id: "workflows", label: "Workflows", icon: GitBranch },
  { id: "constraints", label: "Constraints", icon: ShieldAlert },
  { id: "interface", label: "Interface", icon: Users },
  { id: "specs", label: "Specs", icon: FileCode2 },
];

export function ParzivalNav() {
  const [active, setActive] = useState("identity");
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });
    setVisible(window.scrollY > 200);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActive(topEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed left-0 top-0 bottom-0 z-40 pointer-events-none"
    >
      <div className="flex items-center h-full">
        <div
          className="pointer-events-auto rounded-r-2xl overflow-hidden"
          style={{
            background: "rgba(10,13,26,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid rgba(139,92,246,0.2)`,
            borderLeft: "none",
            boxShadow: "8px 0 32px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.05)",
          }}
        >
          {/* Horizontal tabs stacked vertically */}
          <div className="flex flex-col">
            {sections.map((s, i) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="relative flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  style={{
                    color: isActive ? CYAN : "#7A8AAA",
                    background: isActive ? "rgba(0,245,255,0.12)" : "transparent",
                    borderBottom: i < sections.length - 1 ? `1px solid rgba(255,255,255,0.05)` : "none",
                    textShadow: isActive ? `0 0 16px ${CYAN}, 0 0 32px ${CYAN}80` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#B8C4D8";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#7A8AAA";
                  }}
                >
                  <s.icon className="w-3 h-3 flex-shrink-0" />
                  <span>{s.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="parzivalNavIndicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5"
                      style={{ background: CYAN }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
