"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, Star, ExternalLink } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

export function GitHubCTA() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/Hidden-History/ai-memory")
      .then((r) => r.json())
      .then((data) => {
        if (data.stargazers_count !== undefined)
          setStars(data.stargazers_count);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        <AnimatedSection>
          <div
            className="relative p-14 md:p-20 overflow-hidden rounded-3xl text-center"
            style={{
              background: "rgba(10, 10, 31, 0.8)",
              border: "1px solid rgba(0, 245, 255, 0.1)",
              boxShadow: "0 0 80px rgba(0,245,255,0.05), 0 40px 80px rgba(0,0,0,0.5)"
            }}
          >
            {/* Glow overlay */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)",
                filter: "blur(60px)"
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255,45,106,0.04) 0%, transparent 70%)",
                filter: "blur(80px)"
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* GitHub icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(0, 245, 255, 0.06)",
                  border: "1px solid rgba(0, 245, 255, 0.15)"
                }}
              >
                <Github className="w-8 h-8" style={{ color: "#E8EAF0" }} />
              </motion.div>

              {/* Headline */}
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Open Source &amp;<br />
                <span className="gradient-text-animated">Community Driven</span>
              </h2>

              <p
                className="text-lg mb-10 max-w-lg mx-auto leading-relaxed"
                style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
              >
                AI Memory is MIT licensed. Star the repo, file issues, submit
                PRs — help shape how AI agents remember.
              </p>

              {/* Stars counter */}
              {stars !== null && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-10"
                  style={{
                    background: "rgba(255, 184, 0, 0.06)",
                    border: "1px solid rgba(255, 184, 0, 0.15)"
                  }}
                >
                  <Star className="w-5 h-5" style={{ color: "#FFB800", fill: "#FFB800" }} />
                  <span
                    className="text-base font-semibold"
                    style={{ color: "#FFB800", fontFamily: "var(--font-heading)" }}
                  >
                    {stars.toLocaleString()} stars on GitHub
                  </span>
                </motion.div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/Hidden-History/ai-memory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300"
                  style={{
                    background: "#E8EAF0",
                    color: "#030308",
                    fontFamily: "var(--font-heading)",
                    boxShadow: "0 0 40px rgba(0,245,255,0.15)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 0 60px rgba(0,245,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 0 40px rgba(0,245,255,0.15)";
                  }}
                >
                  <Star className="w-5 h-5" />
                  Star on GitHub
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
