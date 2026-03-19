"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Github, Zap } from "lucide-react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, 100]);

  return (
    <section
      ref={ref}
      className="relative min-h-dvh flex items-center overflow-hidden"
    >
      {/* ── Animated Mesh Background ────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Deep ambient orbs — more vibrant */}
        <div
          className="absolute top-[-10%] left-[10%] w-[700px] h-[700px] rounded-full animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[5%] w-[600px] h-[600px] rounded-full animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)",
            filter: "blur(100px)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-[30%] right-[25%] w-[400px] h-[400px] rounded-full animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, rgba(255,45,106,0.08) 0%, transparent 65%)",
            filter: "blur(80px)",
            animationDelay: "4s",
          }}
        />

        {/* Geometric floating shapes */}
        <div
          className="shape-hex animate-float"
          style={{ top: "15%", right: "20%", animationDelay: "0s" }}
        />
        <div
          className="shape-hex animate-float-delayed"
          style={{
            top: "60%",
            right: "8%",
            width: "80px",
            height: "80px",
            animationDelay: "3s",
          }}
        />
        <div
          className="shape-tri"
          style={{ top: "40%", left: "5%", animationDelay: "1.5s" }}
        />
      </div>

      {/* ── Spline 3D Background ───────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <iframe
          src="https://my.spline.design/claritystream-SPAAezZX4iV8xCQZMFLk2Flg/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full scale-125 opacity-55"
          title="AI Memory 3D Scene"
          loading="lazy"
        />
        {/* Overlay gradient to blend with background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,13,26,0.6) 0%, rgba(10,13,26,0.15) 50%, rgba(10,13,26,0.5) 100%)",
          }}
        />
      </div>

      {/* ── Hero Content — Two Column ──────────────────────── */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-20"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* ── LEFT: Text Content ───────────────────────── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-10 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md"
              style={{ boxShadow: "0 0 30px rgba(0,245,255,0.1), inset 0 1px 0 rgba(0,245,255,0.1)" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-mono)", color: "#7A8AAA" }}
              >
                Open Source &middot; Qdrant Vector DB &middot; MIT
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-bold leading-[0.9] mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span
                className="block text-7xl sm:text-8xl lg:text-[5.5rem] xl:text-[7rem]"
                style={{ color: "#E8EAF0" }}
              >
                CURE AI
              </span>
              <span
                className="block text-7xl sm:text-8xl lg:text-[5.5rem] xl:text-[7rem] gradient-text-animated"
              >
                AMNESIA
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed"
              style={{
                color: "#7A8AAA",
                fontFamily: "var(--font-body)",
              }}
            >
              Qdrant-backed vector database with semantic search across 5
              specialized collections. Semantic decay, 3-layer security, and
              dual-embedding routing &mdash; your AI{" "}
              <span style={{ color: "#00F5FF" }}>never forgets.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16"
            >
              <a
                href="https://github.com/Hidden-History/ai-memory"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: "var(--font-heading)",
                  background: "linear-gradient(135deg, #00F5FF 0%, #00C4CC 100%)",
                  color: "#0A0D1A",
                  boxShadow:
                    "0 0 40px rgba(0,245,255,0.35), 0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {/* Shimmer overlay on hover */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                    transform: "translateX(-100%)",
                  }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </a>

              <a
                href="https://github.com/Hidden-History/ai-memory"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-10 py-5 rounded-2xl font-medium text-lg transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: "var(--font-heading)",
                  background: "rgba(15,20,50,0.7)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "#E8EAF0",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,245,255,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(0,245,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-8"
            >
              {[
                { value: "5", label: "Collections" },
                { value: "31", label: "Memory Types" },
                { value: "MIT", label: "Free Forever" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && (
                    <div
                      className="w-px h-8"
                      style={{
                        background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.3), transparent)",
                      }}
                    />
                  )}
                  <div>
                    <div
                      className="font-bold text-3xl"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "#00F5FF",
                        textShadow: "0 0 20px rgba(0,245,255,0.4)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "#5A6480",
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Hero Image Panel ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex-shrink-0 w-full max-w-md lg:max-w-none lg:w-[480px] xl:w-[560px]"
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-3xl animate-pulse-glow"
              style={{
                background: "transparent",
                boxShadow:
                  "0 0 80px rgba(0,245,255,0.15), 0 0 120px rgba(139,92,246,0.1)",
                transform: "scale(1.05)",
              }}
            />

            {/* Main image container */}
            <div
              className="relative rounded-3xl overflow-hidden animate-float-slow"
              style={{
                border: "1px solid rgba(0,245,255,0.2)",
                boxShadow:
                  "0 0 0 1px rgba(0,245,255,0.06) inset, 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,245,255,0.08)",
              }}
            >
              <img
                src="/ai-memory-3.png"
                alt="AI Memory System"
                className="w-full h-auto object-cover"
                style={{ display: "block" }}
              />

              {/* Scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,245,255,0.03) 0%, transparent 10%, transparent 90%, rgba(0,245,255,0.03) 100%)",
                }}
              />

              {/* Corner brackets */}
              <div
                className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg"
                style={{ borderColor: "rgba(0,245,255,0.5)" }}
              />
              <div
                className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 rounded-tr-lg"
                style={{ borderColor: "rgba(0,245,255,0.5)" }}
              />
              <div
                className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 rounded-bl-lg"
                style={{ borderColor: "rgba(0,245,255,0.5)" }}
              />
              <div
                className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 rounded-br-lg"
                style={{ borderColor: "rgba(0,245,255,0.5)" }}
              />
            </div>

            {/* Floating accent chips */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute -top-4 -right-4 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                fontFamily: "var(--font-mono)",
                background: "rgba(15,20,50,0.9)",
                border: "1px solid rgba(0,255,136,0.3)",
                color: "#00FF88",
                boxShadow: "0 0 20px rgba(0,255,136,0.15)",
              }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                5 Collections Active
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-3 -left-4 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                fontFamily: "var(--font-mono)",
                background: "rgba(15,20,50,0.9)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#8B5CF6",
                boxShadow: "0 0 20px rgba(139,92,246,0.12)",
              }}
            >
              Semantic Decay Engine
            </motion.div>
          </motion.div>
        </div>

        {/* ── Scroll Indicator ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="scroll-indicator w-7 h-11 rounded-full flex justify-center pt-3"
          >
            <div className="scroll-indicator-dot w-1.5 h-3 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
