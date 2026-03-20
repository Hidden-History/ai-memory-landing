"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import {
  Layers,
  Database,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "docs-hero", label: "Overview", icon: Layers },
  { id: "docs-grid", label: "Browse", icon: Database },
  { id: "quickstart", label: "Quick Start", icon: Zap },
];

const SECTION_IDS = SIDEBAR_ITEMS.map((item) => item.id);

export function DocsSidebar() {
  const activeId = useActiveSection(SECTION_IDS);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
      aria-label="Documentation sections"
    >
      <div
        className="rounded-2xl p-2.5"
        style={{
          background: "rgba(15, 20, 50, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(0, 245, 255, 0.1)",
        }}
      >
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer",
                    isActive
                      ? "text-[#00F5FF]"
                      : "text-[#5A6480] hover:text-[#7A8AAA]"
                  )}
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: isActive ? "rgba(0, 245, 255, 0.06)" : "transparent",
                    border: isActive ? "1px solid rgba(0, 245, 255, 0.15)" : "1px solid transparent",
                  }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
