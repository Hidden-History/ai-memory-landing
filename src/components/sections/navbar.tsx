"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Github, Menu, X, Zap } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Architecture", href: "/docs/architecture" },
    { label: "Docs", href: "/docs" },
    { label: "Parzival", href: "/parzival" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl transition-all duration-500 ${
        scrolled ? "nav-blur rounded-2xl" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 cursor-pointer group">
          {/* Logo icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,245,255,0.3)]"
            style={{
              background: "rgba(0,245,255,0.06)",
              border: "1px solid rgba(0,245,255,0.2)",
              boxShadow: "0 0 20px rgba(0,245,255,0.08) inset",
            }}
          >
            <img
              src="/ai-memory-mark.png"
              alt="AI Memory"
              className="w-6 h-6 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Logo text */}
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
            >
              AI Memory
            </span>
            {/* Live dot */}
            <span
              className="relative flex h-2 w-2"
              title="System Online"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                color: "#7A8AAA",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#00F5FF";
                e.currentTarget.style.background = "rgba(0,245,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#7A8AAA";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/Hidden-History/ai-memory"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-hover flex items-center gap-2 ml-3 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              background: "rgba(0,245,255,0.08)",
              border: "1px solid rgba(0,245,255,0.2)",
              color: "#00F5FF",
              boxShadow: "0 0 20px rgba(0,245,255,0.06) inset",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,245,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.35)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(0,245,255,0.15) inset, 0 0 20px rgba(0,245,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,245,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0,245,255,0.06) inset";
            }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl transition-colors duration-200"
          style={{ color: "#7A8AAA", background: "rgba(0,245,255,0.04)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mx-4 mb-4 p-5 rounded-2xl"
          style={{
            background: "rgba(10,13,26,0.98)",
            border: "1px solid rgba(0,245,255,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-3 text-sm rounded-xl transition-colors duration-200 cursor-pointer"
                style={{ color: "#7A8AAA", fontFamily: "var(--font-body)" }}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#00F5FF";
                  e.currentTarget.style.background = "rgba(0,245,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#7A8AAA";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/Hidden-History/ai-memory"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 mt-2 rounded-xl text-sm"
              style={{
                background: "rgba(0,245,255,0.06)",
                border: "1px solid rgba(0,245,255,0.15)",
                color: "#00F5FF",
                fontFamily: "var(--font-body)",
              }}
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
