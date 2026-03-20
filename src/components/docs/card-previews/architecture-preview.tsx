"use client";

const STEPS = [
  { color: "#8B5CF6" }, { color: "#00F5FF" }, { color: "#FFB800" },
  { color: "#FF2D6A" }, { color: "#00F5FF" }, { color: "#8B5CF6" },
  { color: "#00FF88" }, { color: "#FFB800" }, { color: "#8B5CF6" },
];

export function ArchitecturePreview() {
  return (
    <div className="mt-4 flex items-center gap-1 overflow-hidden h-10">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              background: `${step.color}30`,
              border: `1.5px solid ${step.color}60`,
              boxShadow: `0 0 6px ${step.color}20`,
            }}
          />
          {i < STEPS.length - 1 && (
            <div className="w-3 h-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
          )}
        </div>
      ))}
      {/* Traveling pulse */}
      <div
        className="absolute h-2 w-2 rounded-full"
        style={{
          background: "#00F5FF",
          boxShadow: "0 0 8px #00F5FF, 0 0 16px #00F5FF40",
          animation: "pipeline-travel 3s linear infinite",
        }}
      />
    </div>
  );
}
