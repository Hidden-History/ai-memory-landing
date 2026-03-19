"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Github, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
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
        scrolled
          ? "nav-blur rounded-2xl"
          : "bg-transparent"
      }`}
      style={{
        boxShadow: scrolled ? "0 0 40px rgba(0,245,255,0.05)" : "none",
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <div
            className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center"
            style={{
              background: "rgba(0, 245, 255, 0.08)",
              border: "1px solid rgba(0, 245, 255, 0.2)",
              boxShadow: "0 0 20px rgba(0,245,255,0.1)"
            }}
          >
            <img
              src="/ai-memory-mark.png"
              alt="AI Memory"
              className="w-6 h-6 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <span
            className="font-semibold text-lg tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
          >
            AI Memory
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm transition-colors duration-200 cursor-pointer"
              style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#00F5FF"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#8892A8"}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/Hidden-History/ai-memory"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              background: "rgba(0, 245, 255, 0.06)",
              border: "1px solid rgba(0, 245, 255, 0.15)",
              color: "#00F5FF",
              fontFamily: "var(--font-body)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 245, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0, 245, 255, 0.06)";
              e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.15)";
            }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "#8892A8" }}
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
          className="md:hidden px-6 pb-4 flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm py-2 cursor-pointer"
              style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/Hidden-History/ai-memory"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{
              background: "rgba(0, 245, 255, 0.06)",
              border: "1px solid rgba(0, 245, 255, 0.15)",
              color: "#00F5FF",
              fontFamily: "var(--font-body)"
            }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
