"use client";

import { useState, useEffect } from "react";

const COLLECTIONS = [
  { name: "code-patterns", color: "#00F5FF" },
  { name: "conventions", color: "#8B5CF6" },
  { name: "discussions", color: "#FF2D6A" },
  { name: "github", color: "#00FF88" },
  { name: "jira-data", color: "#FFB800" },
];

export function CollectionsPreview() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % COLLECTIONS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {COLLECTIONS.map((col, i) => (
        <span
          key={col.name}
          className="px-2 py-0.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] transition-all duration-500"
          style={{
            background: i === activeIdx ? `${col.color}25` : `${col.color}10`,
            border: `1px solid ${i === activeIdx ? `${col.color}50` : `${col.color}20`}`,
            color: col.color,
            boxShadow: i === activeIdx ? `0 0 12px ${col.color}20` : "none",
          }}
        >
          {col.name}
        </span>
      ))}
    </div>
  );
}
