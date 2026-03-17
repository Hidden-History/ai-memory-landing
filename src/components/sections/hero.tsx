"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Github } from "lucide-react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Layer 0 — Background: ambient glow orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/5 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/5 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/4 rounded-full blur-[200px]" />
      </div>

      {/* Layer 1 — Spline 3D scene (between background and text) */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <iframe
          src="https://my.spline.design/claritystream-SPAAezZX4iV8xCQZMFLk2Flg/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full scale-110"
          title="AI Memory 3D Scene"
          loading="lazy"
        />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 mb-12 rounded-full border border-border bg-surface/40 backdrop-blur-xl text-sm text-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Open Source &middot; Qdrant Vector DB
          </motion.div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-heading)] text-7xl sm:text-8xl md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-bold tracking-tighter leading-[0.95] mb-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="block"
            >
              Cure AI
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="block gradient-text-animated"
            >
              Amnesia
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-xl sm:text-2xl text-muted max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            Qdrant-backed vector database with semantic search across 5
            specialized collections. Semantic decay, 3-layer security, and
            dual-embedding routing &mdash; your AI never forgets.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://github.com/Hidden-History/ai-memory"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 px-10 py-5 bg-primary text-white rounded-2xl font-[family-name:var(--font-heading)] font-semibold text-lg sm:text-xl hover:bg-primary-light transition-all duration-300 glow-primary cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </a>
            <a
              href="https://github.com/Hidden-History/ai-memory"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-10 py-5 border border-border rounded-2xl font-[family-name:var(--font-heading)] font-medium text-lg sm:text-xl hover:bg-surface-hover hover:border-border-hover transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex items-center justify-center gap-10 mt-20 text-sm text-muted-darker"
          >
            {[
              { label: "Collections", value: "5" },
              { label: "Memory Types", value: "31" },
              { label: "MIT Licensed", value: "Free" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-6 bg-border" />}
                <div className="text-center">
                  <div className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-2xl sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-muted-darker/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-muted-darker rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
