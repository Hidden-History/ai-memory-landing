"use client";

const LAYERS = [
  { label: "L1 Regex", width: "100%", delay: "0s", color: "#FF2D6A" },
  { label: "L2 Entropy", width: "75%", delay: "0.3s", color: "#FF2D6A" },
  { label: "L3 NER", width: "55%", delay: "0.6s", color: "#FF2D6A" },
];

export function SecurityPreview() {
  return (
    <div className="mt-4 space-y-2.5">
      {LAYERS.map((layer) => (
        <div key={layer.label} className="flex items-center gap-3">
          <span
            className="text-[9px] font-[family-name:var(--font-mono)] w-16 flex-shrink-0"
            style={{ color: `${layer.color}90` }}
          >
            {layer.label}
          </span>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: `${layer.color}10` }}>
            <div
              className="h-full rounded-full"
              style={{
                width: layer.width,
                background: `linear-gradient(90deg, ${layer.color}60, ${layer.color})`,
                animation: `scan-fill 2s ease-out ${layer.delay} infinite`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
