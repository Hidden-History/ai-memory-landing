"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

/* ─── Design Tokens ──────────────────────────────────────────── */
const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const MAGENTA = "#FF2D6A";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const TEXT = "#E8EAF0";
const TEXT_MUTED = "#7A8AAA";
const TEXT_DIM = "#4A5568";
const BG_CARD = "#0F1428";

/* ─── Hook Data ──────────────────────────────────────────────── */
const CAPTURE_HOOKS = [
  { name: "user_prompt_capture.py", trigger: "UserPromptSubmit", collection: "discussions", type: "user_message" },
  { name: "agent_response_capture.py", trigger: "Stop", collection: "discussions", type: "agent_response" },
  { name: "post_tool_capture.py", trigger: "PostToolUse (Edit|Write)", collection: "code-patterns", type: "implementation" },
  { name: "error_pattern_capture.py", trigger: "PostToolUse (Bash)", collection: "code-patterns", type: "error_fix" },
  { name: "pre_compact_save.py", trigger: "PreCompact", collection: "discussions", type: "session" },
];
const RETRIEVAL_HOOKS = [
  { name: "error_detection.py", trigger: "PostToolUse (Bash)", collection: "code-patterns", type: "error_fix" },
  { name: "new_file_trigger.py", trigger: "PreToolUse (Write)", collection: "conventions", type: "naming, structure" },
  { name: "first_edit_trigger.py", trigger: "PreToolUse (Edit)", collection: "code-patterns", type: "file_pattern" },
  { name: "context_injection_tier2.py", trigger: "UserPromptSubmit", collection: "discussions, conventions", type: "decision, guideline, session" },
  { name: "session_start.py", trigger: "SessionStart (resume|compact)", collection: "discussions, conventions", type: "session, guideline, decision" },
];

/* ─── Ellipse geometry ───────────────────────────────────────── */
const CX = 400, CY = 180, RX = 320, RY = 120;
const pt = (a: number) => ({ x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) });
const capAngle = (i: number) => Math.PI + ((i + 1) / 6) * Math.PI;
const retAngle = (i: number) => ((i + 1) / 6) * Math.PI;

/* ─── Inline keyframes ───────────────────────────────────────── */
const STYLES = `
@keyframes pulse-dot{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}}
@keyframes node-pulse{0%{transform:scale(1);opacity:.7}50%{transform:scale(1.5);opacity:0}100%{transform:scale(1.5);opacity:0}}
`;

/* ─── Hook Card ──────────────────────────────────────────────── */
function HookCard({ hook, color, index }: { hook: (typeof CAPTURE_HOOKS)[number]; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.45 }}
      className="flex items-start gap-4 rounded-xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(15, 20, 40, 0.5)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${color}18`,
        borderLeft: `3px solid ${color}50`,
      }}
    >
      {/* Number badge */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-lg text-xs font-bold"
        style={{
          width: 32, height: 32,
          background: `${color}15`,
          color,
          border: `1.5px solid ${color}40`,
          boxShadow: `0 0 10px ${color}10`,
        }}
      >
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold mb-1.5 truncate" style={{ fontFamily: "var(--font-mono)", color }}>
          {hook.name}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] px-2.5 py-1 rounded-md"
            style={{ fontFamily: "var(--font-mono)", color: TEXT_MUTED, background: `${color}10`, border: `1px solid ${color}20` }}>
            {hook.trigger}
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-md"
            style={{ fontFamily: "var(--font-mono)", color: TEXT_DIM, background: `${VIOLET}08`, border: `1px solid ${VIOLET}15` }}>
            {hook.collection}
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-md"
            style={{ fontFamily: "var(--font-mono)", color: TEXT_DIM, background: `${GREEN}06`, border: `1px solid ${GREEN}12` }}>
            {hook.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── SVG Oval Diagram (desktop) ─────────────────────────────── */
function OvalDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative hidden md:block mb-16"
    >
      <svg viewBox="0 0 800 360" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
        <defs>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="hook-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={CYAN} strokeWidth="0.3" opacity="0.08" />
          </pattern>
        </defs>
        <rect width="800" height="360" fill="url(#hook-grid)" />

        {/* Elliptical path */}
        <motion.ellipse cx={CX} cy={CY} rx={RX} ry={RY}
          stroke={`${TEXT_DIM}40`} strokeWidth="1.5" strokeDasharray="8 6" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} />

        {/* Side labels */}
        <text x={CX - RX - 50} y={CY} fill={AMBER} fontSize="13" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">STORE</text>
        <text x={CX - RX - 50} y={CY + 16} fill={AMBER} fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.6">{"\u2192"}</text>
        <text x={CX + RX + 50} y={CY} fill={CYAN} fontSize="13" fontWeight="700" fontFamily="var(--font-mono)" textAnchor="middle">QUERY</text>
        <text x={CX + RX + 50} y={CY - 14} fill={CYAN} fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.6">{"\u2190"}</text>

        {/* CAPTURE nodes (top arc) */}
        {CAPTURE_HOOKS.map((hook, i) => {
          const { x, y } = pt(capAngle(i));
          return (
            <g key={`cap-${i}`}>
              <circle cx={x} cy={y} r="14" fill="none" stroke={AMBER} strokeWidth="1.5" opacity="0"
                style={{ transformOrigin: `${x}px ${y}px`, animation: `node-pulse 6s ease-out infinite`, animationDelay: `${i * 0.6}s` }} />
              <circle cx={x} cy={y} r="12" fill={BG_CARD} stroke={AMBER} strokeWidth="1.5" />
              <text x={x} y={y + 4} textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">{i + 1}</text>
              <text x={x} y={y - 20} textAnchor="middle" fill={TEXT_MUTED} fontSize="8.5" fontFamily="var(--font-mono)">
                {hook.name.replace(".py", "")}
              </text>
              <text x={x} y={y - 32} textAnchor="middle" fill={TEXT_MUTED} fontSize="7" fontFamily="var(--font-mono)">
                {hook.trigger}
              </text>
            </g>
          );
        })}

        {/* RETRIEVAL nodes (bottom arc) */}
        {RETRIEVAL_HOOKS.map((hook, i) => {
          const { x, y } = pt(retAngle(i));
          return (
            <g key={`ret-${i}`}>
              <circle cx={x} cy={y} r="14" fill="none" stroke={CYAN} strokeWidth="1.5" opacity="0"
                style={{ transformOrigin: `${x}px ${y}px`, animation: `node-pulse 6s ease-out infinite`, animationDelay: `${(i + 5) * 0.6}s` }} />
              <circle cx={x} cy={y} r="12" fill={BG_CARD} stroke={CYAN} strokeWidth="1.5" />
              <text x={x} y={y + 4} textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">{i + 1}</text>
              <text x={x} y={y + 30} textAnchor="middle" fill={TEXT_MUTED} fontSize="8.5" fontFamily="var(--font-mono)">
                {hook.name.replace(".py", "")}
              </text>
              <text x={x} y={y + 40} textAnchor="middle" fill={TEXT_MUTED} fontSize="7" fontFamily="var(--font-mono)">
                {hook.trigger}
              </text>
            </g>
          );
        })}

        {/* Orbiting particle 1 (AMBER) — follows the ellipse inside SVG */}
        <circle r="5" fill={AMBER} opacity="0.9" filter="url(#node-glow)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path={`M ${CX + RX},${CY} A ${RX},${RY} 0 1,1 ${CX - RX},${CY} A ${RX},${RY} 0 1,1 ${CX + RX},${CY}`}
          />
        </circle>
        {/* Orbiting particle 2 (CYAN) — offset start */}
        <circle r="4" fill={CYAN} opacity="0.9" filter="url(#node-glow)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            begin="-3.5s"
            path={`M ${CX + RX},${CY} A ${RX},${RY} 0 1,1 ${CX - RX},${CY} A ${RX},${RY} 0 1,1 ${CX + RX},${CY}`}
          />
        </circle>
        {/* Orbiting particle 3 (small, fast) */}
        <circle r="3" fill={VIOLET} opacity="0.7" filter="url(#node-glow)">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            begin="-1.5s"
            path={`M ${CX + RX},${CY} A ${RX},${RY} 0 1,1 ${CX - RX},${CY} A ${RX},${RY} 0 1,1 ${CX + RX},${CY}`}
          />
        </circle>
      </svg>
    </motion.div>
  );
}

/* ─── Mobile Timeline ────────────────────────────────────────── */
function MobileTimeline() {
  const TimelineGroup = ({ hooks, color, label }: { hooks: typeof CAPTURE_HOOKS; color: string; label: string }) => (
    <div className="relative pl-8 pb-4">
      <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: `${color}40` }} />
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ fontFamily: "var(--font-mono)", color }}>{label}</div>
      {hooks.map((h, i) => (
        <div key={i} className="relative mb-2">
          <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
          <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: TEXT_MUTED }}>{h.name}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="md:hidden mb-10">
      <TimelineGroup hooks={CAPTURE_HOOKS} color={AMBER} label="Capture Hooks" />
      <div className="flex justify-center py-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: `linear-gradient(135deg, ${AMBER}20, ${CYAN}20)`, border: `1px solid ${TEXT_DIM}30`, color: TEXT_MUTED }}>
          {"\u2193"}
        </div>
      </div>
      <TimelineGroup hooks={RETRIEVAL_HOOKS} color={CYAN} label="Retrieval Hooks" />
    </div>
  );
}

/* ─── Exported Section ───────────────────────────────────────── */
export function HooksSection() {
  return (
    <section id="hooks" className="relative py-40 px-8 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent, ${CYAN}03, transparent)` }} />
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <pattern id="hooks-bp-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={CYAN} strokeWidth="0.3" opacity="0.05" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hooks-bp-grid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8"
            style={{ fontFamily: "var(--font-mono)", color: AMBER, background: `${AMBER}10`, border: `1px solid ${AMBER}25` }}>
            <Brain className="w-3.5 h-3.5" />
            Hook Classification
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            CAPTURE <span style={{ color: TEXT_MUTED, fontWeight: 400 }}>vs</span>{" "}
            <span className="gradient-text-animated">Retrieval</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: TEXT_MUTED, fontFamily: "var(--font-body)" }}>
            Ten hooks split into two lifecycles&mdash;five capture knowledge into the
            vector store, five retrieve it at the moment of need.
          </p>
        </AnimatedSection>

        <OvalDiagram />
        <MobileTimeline />

        {/* Hook Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {([
            { hooks: CAPTURE_HOOKS, color: AMBER, label: "Capture — Store to Database" },
            { hooks: RETRIEVAL_HOOKS, color: CYAN, label: "Retrieval — Query Database" },
          ] as const).map(({ hooks, color, label }) => (
            <div key={label}>
              <div className="text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-3"
                style={{ fontFamily: "var(--font-mono)", color }}>
                <span className="w-2.5 h-2.5 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}60`, animation: "pulse-dot 2s ease infinite" }} />
                {label}
                <div className="h-px flex-1" style={{ background: `${color}20` }} />
              </div>
              <div className="space-y-3">
                {hooks.map((hook, i) => <HookCard key={hook.name} hook={hook} color={color} index={i} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
