"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Brain, Github } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-2xl border border-border shadow-2xl shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <a href="/" className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary-light" />
        </div>
        <span className="font-[family-name:var(--font-heading)] font-semibold text-lg tracking-tight">
          AI Memory
        </span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm">
        {["Features", "How it Works", "Docs", "Parzival", "Pricing"].map(
          (item) => (
            <a
              key={item}
              href={
                item === "Docs"
                  ? "/docs"
                  : item === "Parzival"
                    ? "/parzival"
                    : `#${item.toLowerCase().replace(/\s+/g, "-")}`
              }
              className="text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
            >
              {item}
            </a>
          )
        )}
        <a
          href="https://github.com/Hidden-History/ai-memory"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-light rounded-xl hover:bg-primary/20 transition-all duration-200 border border-primary/15 hover:border-primary/30 cursor-pointer"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </motion.nav>
  );
}
