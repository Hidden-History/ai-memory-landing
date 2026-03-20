"use client";

const NODES = [
  { label: "Hook", color: "#8B5CF6" },
  { label: "Process", color: "#00F5FF" },
  { label: "Store", color: "#00FF88" },
];

export function HooksPreview() {
  return (
    <div className="mt-4 flex items-center gap-2">
      {NODES.map((node, i) => (
        <div key={node.label} className="flex items-center gap-2">
          <span
            className="px-2 py-1 rounded text-[9px] font-[family-name:var(--font-mono)] font-medium"
            style={{
              background: `${node.color}12`,
              border: `1px solid ${node.color}30`,
              color: node.color,
            }}
          >
            {node.label}
          </span>
          {i < NODES.length - 1 && (
            <svg width="20" height="8" viewBox="0 0 20 8" className="flex-shrink-0">
              <line
                x1="0" y1="4" x2="14" y2="4"
                stroke={NODES[i + 1].color}
                strokeWidth="1"
                strokeDasharray="3 2"
                opacity="0.5"
              >
                <animate attributeName="stroke-dashoffset" values="0;-5" dur="1s" repeatCount="indefinite" />
              </line>
              <polygon points="14,1 20,4 14,7" fill={NODES[i + 1].color} opacity="0.5" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
