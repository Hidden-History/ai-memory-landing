"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const MAGENTA = "#FF2D6A";
const GREEN = "#00FF88";
const TEXT_DIM = "#4A5568";
const BG_CARD = "#0F1428";

/* ── deterministic "random" particles for the left panel ── */
const CHAOS_PARTICLES = [
  { cx: 60, cy: 40, r: 3.5, dx: 70, dy: -50, dur: 2.4, delay: 0, color: "rgba(0,245,255,0.4)", flash: false },
  { cx: 180, cy: 130, r: 4, dx: -60, dy: 40, dur: 3.1, delay: 0.3, color: "rgba(255,45,106,0.4)", flash: true },
  { cx: 310, cy: 70, r: 3, dx: -40, dy: 60, dur: 2.8, delay: 0.7, color: "rgba(0,245,255,0.35)", flash: false },
  { cx: 120, cy: 160, r: 5, dx: 55, dy: -35, dur: 3.6, delay: 0.1, color: "rgba(255,45,106,0.4)", flash: true },
  { cx: 250, cy: 30, r: 3.5, dx: -80, dy: 45, dur: 2.2, delay: 0.5, color: "rgba(122,138,170,0.5)", flash: false },
  { cx: 340, cy: 150, r: 4.5, dx: 50, dy: -65, dur: 3.9, delay: 0.9, color: "rgba(122,138,170,0.45)", flash: false },
  { cx: 90, cy: 95, r: 3, dx: -45, dy: -55, dur: 2.6, delay: 0.4, color: "rgba(255,45,106,0.35)", flash: true },
  { cx: 280, cy: 110, r: 4, dx: 65, dy: 30, dur: 3.3, delay: 0.6, color: "rgba(0,245,255,0.35)", flash: false },
];

/* ── ordered particles for the right panel ── */
const CHANNEL_Y = [50, 100, 150]; // y=25%, 50%, 75% of 200
const CHANNEL_COLORS = [CYAN, VIOLET, GREEN];
const ORDER_PARTICLES = [
  { channel: 0, offset: 0, delay: 0 },
  { channel: 0, offset: 140, delay: 0.6 },
  { channel: 0, offset: 280, delay: 1.2 },
  { channel: 1, offset: 40, delay: 0.3 },
  { channel: 1, offset: 200, delay: 0.9 },
  { channel: 1, offset: 340, delay: 1.5 },
  { channel: 2, offset: 80, delay: 0.2 },
  { channel: 2, offset: 240, delay: 1.0 },
];

/* ── CSS keyframes (injected once via <style>) ── */
const keyframes = `
${CHAOS_PARTICLES.map(
  (p, i) => `
@keyframes chaos-${i} {
  0%, 100% { transform: translate(0, 0); opacity: ${0.3 + (i % 4) * 0.1}; }
  50% { transform: translate(${p.dx}px, ${p.dy}px); opacity: ${p.flash ? 0.7 : 0.4 + (i % 3) * 0.1}; }
}`
).join("\n")}

${CHAOS_PARTICLES.filter((p) => p.flash)
  .map(
    (_, i) => `
@keyframes flash-${i} {
  0%, 80%, 100% { fill: rgba(255,45,106,0.35); }
  90% { fill: rgba(255,45,106,0.8); }
}`
  )
  .join("\n")}

@keyframes flow {
  0%   { transform: translateX(-20px); opacity: 0; }
  10%  { opacity: 0.8; }
  90%  { opacity: 0.8; }
  100% { transform: translateX(420px); opacity: 0; }
}
`;

export function SignalComparison() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
        {/* ── Left: Random Injection ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex-1 rounded-xl overflow-hidden"
          style={{
            background: BG_CARD,
            borderTop: `3px solid ${MAGENTA}`,
          }}
        >
          <div
            className="relative flex flex-col items-center p-5"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 60%, rgba(255,45,106,0.06) 0%, transparent 70%)`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={18} color={MAGENTA} />
              <span className="text-sm font-semibold" style={{ color: MAGENTA }}>
                Random Injection
              </span>
            </div>

            <svg
              viewBox="0 0 400 200"
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
              style={{ maxHeight: 200 }}
            >
              {CHAOS_PARTICLES.map((p, i) => (
                <circle
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill={p.color}
                  style={{
                    animation: `chaos-${i} ${p.dur}s ease-in-out ${p.delay}s infinite${
                      p.flash ? `, flash-${CHAOS_PARTICLES.slice(0, i + 1).filter((x) => x.flash).length - 1} ${p.dur * 1.5}s ease ${p.delay}s infinite` : ""
                    }`,
                  }}
                />
              ))}
            </svg>

            <span
              className="mt-3 text-xs font-mono"
              style={{ color: MAGENTA, opacity: 0.6 }}
            >
              signal-to-noise: LOW
            </span>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div className="hidden md:flex flex-col items-center justify-center px-5">
          <div className="w-px flex-1" style={{ background: TEXT_DIM, opacity: 0.3 }} />
          <span
            className="my-2 text-xs font-bold tracking-wider"
            style={{ color: TEXT_DIM }}
          >
            VS
          </span>
          <div className="w-px flex-1" style={{ background: TEXT_DIM, opacity: 0.3 }} />
        </div>

        {/* ── Right: Signal-Triggered ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex-1 rounded-xl overflow-hidden"
          style={{
            background: BG_CARD,
            borderTop: `3px solid ${CYAN}`,
          }}
        >
          <div
            className="relative flex flex-col items-center p-5"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 60%, rgba(0,245,255,0.06) 0%, transparent 70%)`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} color={CYAN} />
              <span className="text-sm font-semibold" style={{ color: CYAN }}>
                Signal-Triggered
              </span>
            </div>

            <svg
              viewBox="0 0 400 200"
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
              style={{ maxHeight: 200, overflow: "visible" }}
            >
              {/* channel lines */}
              {CHANNEL_Y.map((y, i) => (
                <motion.line
                  key={`ch-${i}`}
                  x1={10}
                  y1={y}
                  x2={390}
                  y2={y}
                  stroke={CHANNEL_COLORS[i]}
                  strokeOpacity={0.15}
                  strokeWidth={1}
                  strokeDasharray="6 4"
                  pathLength={0}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                />
              ))}

              {/* flowing particles */}
              {ORDER_PARTICLES.map((p, i) => (
                <circle
                  key={`op-${i}`}
                  cx={0}
                  cy={CHANNEL_Y[p.channel]}
                  r={4}
                  fill={CHANNEL_COLORS[p.channel]}
                  opacity={0.7}
                  style={{
                    filter: `drop-shadow(0 0 4px ${CHANNEL_COLORS[p.channel]})`,
                    animation: `flow 4.5s linear ${p.delay}s infinite`,
                  }}
                />
              ))}
            </svg>

            <span
              className="mt-3 text-xs font-mono"
              style={{ color: CYAN }}
            >
              signal-to-noise: HIGH
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
