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
    <section className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <div className="gradient-border p-14 md:p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-surface border border-border flex items-center justify-center">
                <Github className="w-8 h-8 text-foreground" />
              </div>

              <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                Open Source &<br />
                <span className="gradient-text">Community Driven</span>
              </h2>

              <p className="text-muted text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                AI Memory is MIT licensed. Star the repo, file issues, submit
                PRs &mdash; help shape how AI agents remember.
              </p>

              {stars !== null && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-surface/80 border border-border text-sm mb-10"
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-[family-name:var(--font-mono)] font-medium">
                    {stars.toLocaleString()} stars on GitHub
                  </span>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/Hidden-History/ai-memory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-8 py-4 bg-foreground text-background rounded-2xl font-[family-name:var(--font-heading)] font-semibold text-lg hover:bg-foreground/90 transition-all duration-300 cursor-pointer"
                >
                  <Star className="w-5 h-5" />
                  Star on GitHub
                  <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
