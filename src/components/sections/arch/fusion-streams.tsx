"use client";

import { motion } from "framer-motion";
import { Infinity, Activity } from "lucide-react";
import { useState } from "react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const MAGENTA = "#FF2D6A";
const GREEN = "#00FF88";
const AMBER = "#F59E0B";
const TEXT = "#E8EAF0";
const TEXT_MUTED = "#7A8AAA";
const TEXT_DIM = "#4A5568";
const BG_CARD = "#0F1428";
const BG_SURFACE = "#0A0D1A";

const pDelays = (dur: number) => Array.from({ length: 4 }, (_, i) => (dur / 4) * i);

function SourceNode({ label, sub, color, size, delay }: {
  label: string; sub: string; color: string; size: number; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex justify-center"
    >
      <div
        className="rounded-2xl flex flex-col items-center justify-center relative"
        style={{
          width: size, height: size,
          background: `${color}10`, border: `2px solid ${color}40`,
          boxShadow: `0 0 40px ${color}15`,
        }}
      >
        <span className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color }}>{label}</span>
        <span className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>{sub}</span>
        <div className="absolute inset-0 rounded-2xl" style={{
          boxShadow: `0 0 30px ${color}25 inset`,
          animation: `pulse-node 3s ease-in-out infinite ${delay}s`,
        }} />
      </div>
    </motion.div>
  );
}

function QualityDots({ filled, color }: { filled: number; color: string }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < filled ? color : `${TEXT_DIM}33` }} />
      ))}
    </div>
  );
}

const PATHS = [
  { path: "1", label: "Best Quality", desc: "[dense\u2192decay, sparse] \u2192 RRF", color: CYAN, badge: "HYBRID+DECAY", quality: 4 },
  { path: "2", label: "Hybrid Only", desc: "[dense, sparse] \u2192 RRF", color: VIOLET, badge: "HYBRID", quality: 3 },
  { path: "3", label: "Decay Only", desc: "Dense with decay reranking", color: AMBER, badge: "DECAY", quality: 2 },
  { path: "4", label: "Plain Dense", desc: "Cosine similarity fallback", color: TEXT_DIM, badge: "DENSE", quality: 1 },
];

const MOBILE_NODES = [
  { label: "Dense", sub: "768d vectors", color: CYAN, delay: 0.3 },
  { label: "Sparse", sub: "BM25 / FastEmbed", color: VIOLET, delay: 0.5 },
  { label: "Late", sub: "ColBERT v2", color: GREEN, delay: 0.7 },
];

const STREAMS = [
  { key: "dense", color: CYAN, left: "16.66%", anim: "flow-dense", dur: 3.5 },
  { key: "sparse", color: VIOLET, left: "50%", anim: "flow-sparse", dur: 4 },
  { key: "late", color: GREEN, left: "83.33%", anim: "flow-late", dur: 3.8 },
];

const SVG_PATHS = [
  { d: "M 108 0 Q 108 80, 324 160", color: CYAN, delay: 0.2 },
  { d: "M 324 0 Q 324 80, 324 160", color: VIOLET, delay: 0.4 },
  { d: "M 540 0 Q 540 80, 324 160", color: GREEN, delay: 0.6 },
];

const CSS = `
@keyframes pulse-node { 0%,100%{opacity:.3} 50%{opacity:.6} }
@keyframes spin-slow { to{transform:rotate(360deg)} }
@keyframes rrf-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }
@keyframes flow-dense { 0%{transform:translate(0,0);opacity:0} 8%{opacity:1} 88%{opacity:1} 100%{transform:translate(108px,160px);opacity:0} }
@keyframes flow-sparse { 0%{transform:translate(0,0);opacity:0} 8%{opacity:1} 88%{opacity:1} 100%{transform:translate(0,160px);opacity:0} }
@keyframes flow-late { 0%{transform:translate(0,0);opacity:0} 8%{opacity:1} 88%{opacity:1} 100%{transform:translate(-108px,160px);opacity:0} }
@keyframes flow-output { 0%{transform:translateY(0);opacity:0} 10%{opacity:1} 85%{opacity:1} 100%{transform:translateY(80px);opacity:0} }
@keyframes flow-mobile { 0%{transform:translateY(0);opacity:0} 10%{opacity:1} 85%{opacity:1} 100%{transform:translateY(40px);opacity:0} }
`;

// ─── RRF Node (shared between desktop/mobile) ──────────────────────────────────

function RRFNode({ size, ringR, vb }: { size: string; ringR: number; vb: string }) {
  return (
    <div
      className={`${size} rounded-2xl flex flex-col items-center justify-center relative`}
      style={{
        background: `${MAGENTA}12`, border: `2px solid ${MAGENTA}50`,
        boxShadow: `0 0 80px ${MAGENTA}25`, animation: "rrf-breathe 3s ease-in-out infinite",
      }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox={vb} style={{ animation: "spin-slow 30s linear infinite" }}>
        <circle cx={ringR} cy={ringR} r={ringR - 8} fill="none" stroke={MAGENTA} strokeWidth="1" strokeDasharray="8 6" opacity="0.4" />
      </svg>
      <span className="text-lg font-bold relative z-10" style={{ fontFamily: "var(--font-heading)", color: MAGENTA }}>RRF</span>
      <span className="text-[10px] mt-1 relative z-10" style={{ color: TEXT_MUTED }}>Reciprocal Rank Fusion</span>
      <div className="absolute inset-0 rounded-2xl" style={{
        boxShadow: `0 0 40px ${MAGENTA}30 inset`, animation: "pulse-node 2s ease-in-out infinite 0.3s",
      }} />
    </div>
  );
}

// ─── Path Card with cursor spotlight ────────────────────────────────────────────

function PathCard({ p, i }: { p: (typeof PATHS)[number]; i: number }) {
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  return (
    <motion.div
      key={p.path}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 * i, duration: 0.45 }}
      className={`p-5 rounded-2xl relative overflow-hidden${i === 0 ? " col-span-2 lg:col-span-2" : ""}`}
      style={{ background: BG_CARD, border: `1px solid ${p.color}15` }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
      }}
      onMouseLeave={() => setSpotlight(prev => ({ ...prev, active: false }))}
    >
      {/* Cursor spotlight glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spotlight.active ? 1 : 0,
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, ${p.color}08, transparent)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: p.color }}>{p.path}</span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono" style={{ background: `${p.color}12`, color: p.color }}>{p.badge}</span>
        </div>
        <div className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{p.label}</div>
        <code className="text-xs font-mono block mb-3" style={{ color: TEXT_MUTED }}>{p.desc}</code>
        <QualityDots filled={p.quality} color={p.color} />
      </div>
    </motion.div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────

export function TripleFusionSection() {
  return (
    <section id="fusion" className="relative py-20 px-8">
      <style>{CSS}</style>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${VIOLET}06, transparent 70%)`,
      }} />

      {/* Dot-grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(#00F5FF 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }} />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${VIOLET}10`, border: `1px solid ${VIOLET}25` }}>
            <Infinity className="w-3.5 h-3.5" style={{ color: VIOLET }} />
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: VIOLET }}>Triple Fusion Hybrid Search</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: TEXT }}>
            Dense + Sparse + Late Interaction
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: TEXT_MUTED }}>
            Three complementary search modalities combined via Qdrant&apos;s native Reciprocal Rank Fusion (RRF).
          </p>
        </motion.div>

        {/* Fusion Diagram */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative mb-12">

          {/* ═══ Desktop (md+) ═══ */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-8 mb-0">
              <SourceNode label="Dense" sub="768d vectors" color={CYAN} size={112} delay={0.3} />
              <SourceNode label="Sparse" sub="BM25 / FastEmbed" color={VIOLET} size={128} delay={0.5} />
              <SourceNode label="Late" sub="ColBERT v2" color={GREEN} size={112} delay={0.7} />
            </div>

            {/* SVG paths + particles (all inside SVG so scaling is consistent) */}
            <div className="relative h-40">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 648 160" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                <defs>
                  <filter id="stream-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Dashed path lines */}
                {SVG_PATHS.map((p) => (
                  <motion.path
                    key={p.d}
                    d={p.d}
                    fill="none"
                    stroke={p.color}
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    style={{ opacity: 0.35 }}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: p.delay }}
                  />
                ))}
                {/* Animated particles following the exact SVG paths */}
                {SVG_PATHS.map((p) =>
                  [0, 1, 2, 3].map((i) => (
                    <circle key={`${p.d}-p${i}`} r="3.5" fill={p.color} opacity="0.9" filter="url(#stream-glow)">
                      <animateMotion
                        dur={`${3.5 + p.delay}s`}
                        repeatCount="indefinite"
                        begin={`${(3.5 + p.delay) / 4 * i}s`}
                        path={p.d}
                      />
                    </circle>
                  ))
                )}
              </svg>
            </div>

            {/* RRF merge node */}
            <div className="flex justify-center">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.5 }}>
                <RRFNode size="w-40 h-40" ringR={80} vb="0 0 160 160" />
              </motion.div>
            </div>

            {/* Output stream */}
            <div className="relative h-24 flex justify-center">
              <div className="w-px h-full" style={{ background: `linear-gradient(180deg, ${MAGENTA}60, ${CYAN}20, transparent)` }} />
              {[0, 0.7, 1.4].map((d, i) => (
                <div key={`out-${i}`} className="absolute rounded-full" style={{
                  width: 5, height: 5, background: "#fff",
                  boxShadow: `0 0 8px ${CYAN}, 0 0 14px ${CYAN}80`,
                  left: "50%", top: 0, marginLeft: -2.5,
                  animation: `flow-output 2s ease-in ${d}s infinite`,
                }} />
              ))}
            </div>
          </div>

          {/* ═══ Mobile (<md) ═══ */}
          <div className="md:hidden flex flex-col items-center gap-0">
            {MOBILE_NODES.map((node) => (
              <div key={node.label} className="flex flex-col items-center">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: node.delay }}>
                  <div className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center relative" style={{
                    background: `${node.color}10`, border: `2px solid ${node.color}40`,
                    boxShadow: `0 0 40px ${node.color}15`,
                  }}>
                    <span className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: node.color }}>{node.label}</span>
                    <span className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>{node.sub}</span>
                    <div className="absolute inset-0 rounded-2xl" style={{
                      boxShadow: `0 0 30px ${node.color}25 inset`, animation: "pulse-node 3s ease-in-out infinite",
                    }} />
                  </div>
                </motion.div>
                <div className="relative h-12 w-px">
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${node.color}40, ${MAGENTA}40)` }} />
                  {[0, 0.8].map((d, i) => (
                    <div key={`m-${node.label}-${i}`} className="absolute rounded-full" style={{
                      width: 4, height: 4, background: node.color,
                      boxShadow: `0 0 6px ${node.color}`,
                      left: -1.5, top: 0,
                      animation: `flow-mobile 1.6s ease-in-out ${d}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            ))}

            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
              <RRFNode size="w-36 h-36" ringR={72} vb="0 0 144 144" />
            </motion.div>
          </div>
        </motion.div>

        {/* 4-Path Composition Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PATHS.map((p, i) => (
            <PathCard key={p.path} p={p} i={i} />
          ))}
        </div>

        {/* DEC-062 Note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-4 rounded-xl flex items-start gap-3"
          style={{ background: `${VIOLET}05`, border: `1px solid ${VIOLET}15` }}
        >
          <Activity className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: VIOLET }} />
          <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
            <strong style={{ color: VIOLET }}>DEC-062:</strong> The decay formula MUST be applied
            BEFORE RRF fusion (to the dense prefetch results), never after. Applying decay to RRF
            output would zero out semantics.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
