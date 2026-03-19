"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github, Zap } from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";

export function ParzivalCTA() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(15,20,50,0.9) 0%, rgba(10,13,35,0.95) 100%)",
            border: `1px solid rgba(139,92,246,0.25)`,
            boxShadow: `
              0 0 0 1px rgba(0,245,255,0.04) inset,
              0 40px 80px rgba(0,0,0,0.6),
              0 0 120px rgba(139,92,246,0.08)
            `,
          }}
        >
          {/* Corner glow accents */}
          <div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />

          {/* Inner glow line */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "linear-gradient(135deg, rgba(0,245,255,0.08) 0%, transparent 50%, rgba(139,92,246,0.08) 100%)",
            }}
          />

          <div className="relative z-10 px-8 py-14 md:py-16 text-center">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: `rgba(139,92,246,0.1)`,
                border: `1px solid rgba(139,92,246,0.3)`,
                boxShadow: `0 0 40px rgba(139,92,246,0.15), 0 0 80px rgba(139,92,246,0.08) inset`,
              }}
            >
              <Zap className="w-7 h-7" style={{ color: VIOLET }} />
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-orbitron)", color: "#E8EAF0" }}
            >
              Ready to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00F5FF 0%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Deploy Parzival
              </span>
              ?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm leading-relaxed mb-10 max-w-lg mx-auto"
              style={{ color: "#7A8AAA" }}
            >
              Parzival ships with AI Memory. Install the full stack and start orchestrating agent
              teams with zero-legitimate-issues quality gates, session continuity, and complete
              oversight documentation.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Primary: Install */}
              <a
                href="https://github.com/Hidden-History/ai-memory#installation"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base"
                style={{
                  background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
                  color: "#0A0D1A",
                  fontFamily: "var(--font-orbitron)",
                  boxShadow: `0 0 40px rgba(0,245,255,0.25), 0 0 80px rgba(139,92,246,0.15)`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 60px rgba(0,245,255,0.4), 0 0 120px rgba(139,92,246,0.25)`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 40px rgba(0,245,255,0.25), 0 0 80px rgba(139,92,246,0.15)`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Github className="w-5 h-5" />
                Install AI Memory
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Secondary: View Source */}
              <a
                href="/parzival"
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base"
                style={{
                  background: "transparent",
                  border: `1px solid rgba(139,92,246,0.35)`,
                  color: "#E8EAF0",
                  fontFamily: "var(--font-orbitron)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.08)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <ExternalLink className="w-4 h-4" style={{ color: VIOLET }} />
                View POV Source
              </a>
            </motion.div>

            {/* Spec note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-6 text-xs"
              style={{ color: "#3A4560", fontFamily: "var(--font-mono)" }}
            >
              Source specs:{" "}
              <span style={{ color: "#7A8AAA" }}>
                public/parzival/ — PARZIVAL-AGENT-SPEC · SYSTEM-ARCHITECTURE · ROUTING-MAP ·
                constraint-matrix · verification-checklist
              </span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
