"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";

const CYAN = "#00F5FF";
const VIOLET = "#8B5CF6";
const GREEN = "#00FF88";

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

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: "rgba(10,13,30,0.92)",
            borderRadius: 4,
            border: "1px solid rgba(139,92,246,0.2)",
            overflow: "hidden",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.4), 0 0 60px rgba(139,92,246,0.03)",
          }}
        >
          {/* Terminal header bar — 24px */}
          <div
            style={{
              height: 24,
              background: "rgba(20,25,50,0.6)",
              borderLeft: `3px solid ${GREEN}`,
              borderRadius: "4px 4px 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: GREEN,
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              [ PARZIVAL SYSTEM — READY FOR DEPLOYMENT ]
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: "24px 20px 20px" }}>
            {/* Simulated terminal output */}
            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.04)",
                padding: "16px 14px",
                marginBottom: 24,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                lineHeight: 2,
              }}
            >
              <div style={{ color: GREEN }}>
                <span style={{ color: "#7A8AAA" }}>&gt;</span> SYSTEM STATUS: ALL CHECKS PASSED
              </div>
              <div style={{ color: CYAN }}>
                <span style={{ color: "#7A8AAA" }}>&gt;</span> AGENTS REGISTERED: 6 / 6
              </div>
              <div style={{ color: VIOLET }}>
                <span style={{ color: "#7A8AAA" }}>&gt;</span> CONSTRAINTS LOADED: 79 / 79
              </div>
              <div style={{ color: "#E8EAF0" }}>
                <span style={{ color: "#7A8AAA" }}>&gt;</span> RECOMMENDATION:{" "}
                <span style={{ color: GREEN, fontWeight: 700 }}>
                  DEPLOY PARZIVAL
                </span>
              </div>
              <div style={{ color: "#7A8AAA" }}>
                &gt;{" "}
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    times: [0, 0.5, 0.5, 1],
                  }}
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 14,
                    background: GREEN,
                    verticalAlign: "middle",
                  }}
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "center",
              }}
              className="sm:flex-row"
            >
              {/* Primary — Get Started */}
              <a
                href="https://github.com/Hidden-History/ai-memory#installation"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-hover group flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{
                  background: CYAN,
                  color: "#0A0D1A",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "12px 28px",
                  borderRadius: 2,
                  border: "none",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  boxShadow: `0 0 20px rgba(0,245,255,0.25)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 40px rgba(0,245,255,0.45)`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px rgba(0,245,255,0.25)`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Github className="w-4 h-4" />
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Secondary — View Documentation */}
              <a
                href="/parzival"
                className="magnetic-hover group flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{
                  background: "transparent",
                  color: "#E8EAF0",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "11px 28px",
                  borderRadius: 2,
                  border: `1px solid ${VIOLET}55`,
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${VIOLET}12`;
                  e.currentTarget.style.borderColor = `${VIOLET}88`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = `${VIOLET}55`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                View Documentation
              </a>
            </div>

            {/* Footer note */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "#3A4560",
                textAlign: "center",
                marginTop: 16,
                letterSpacing: "0.03em",
              }}
            >
              Parzival ships with AI Memory — install the full stack in one command.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
