"use client";

import { ExternalLink, Github, Twitter, BookOpen } from "lucide-react";

const footerLinks: Record<string, Array<{ label: string; href: string; external?: boolean }>> = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "#" },
    { label: "Examples", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Newsletter", href: "#" },
  ],
  Community: [
    { label: "GitHub", href: "https://github.com/Hidden-History/ai-memory", external: true },
    { label: "Discord", href: "#", external: true },
    { label: "Twitter / X", href: "#", external: true },
    { label: "Contributing", href: "#" },
  ],
  Parzival: [
    { label: "About", href: "/parzival" },
    { label: "Session Guide", href: "#" },
    { label: "Skills Reference", href: "#" },
    { label: "Quality Gates", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="py-16 px-6"
      style={{
        borderTop: "1px solid rgba(0, 245, 255, 0.08)",
        background: "linear-gradient(to bottom, rgba(3, 3, 8, 0.95), rgba(5, 5, 26, 0.98))"
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top section: Logo + tagline + social */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo SVG */}
              <div
                className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  background: "rgba(0, 245, 255, 0.08)",
                  border: "1px solid rgba(0, 245, 255, 0.2)",
                  boxShadow: "0 0 20px rgba(0,245,255,0.1)"
                }}
              >
                <img
                  src="/ai-memory-mark.png"
                  alt="AI Memory"
                  className="w-7 h-7 object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <div>
                <div
                  className="font-bold text-lg tracking-tight"
                  style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
                >
                  AI Memory
                </div>
                <div
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: "#00F5FF", fontFamily: "var(--font-mono)" }}
                >
                  Neural Memory System
                </div>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "#4A5068", fontFamily: "var(--font-body)" }}
            >
              Persistent context layer for AI agents. Built on Qdrant vector
              search with semantic decay, 3-layer security, and cross-session memory.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: "https://github.com/Hidden-History/ai-memory", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(0, 245, 255, 0.04)",
                    border: "1px solid rgba(0, 245, 255, 0.1)",
                    color: "#4A5068"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.3)";
                    e.currentTarget.style.color = "#00F5FF";
                    e.currentTarget.style.background = "rgba(0, 245, 255, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.1)";
                    e.currentTarget.style.color = "#4A5068";
                    e.currentTarget.style.background = "rgba(0, 245, 255, 0.04)";
                  }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h4
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "#E8EAF0", fontFamily: "var(--font-mono)" }}
                >
                  {group}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-sm transition-colors duration-200 inline-flex items-center gap-1"
                        style={{ color: "#4A5068", fontFamily: "var(--font-body)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#00F5FF"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#4A5068"}
                      >
                        {link.label}
                        {link.external && <ExternalLink className="w-3 h-3" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(0, 245, 255, 0.05)" }}
        >
          <p
            className="text-xs"
            style={{ color: "#4A5068", fontFamily: "var(--font-body)" }}
          >
            © 2024-{new Date().getFullYear()} Hidden History. MIT Licensed.
          </p>
          <div className="flex items-center gap-4">
            <span
              className="text-xs"
              style={{ color: "#4A5068", fontFamily: "var(--font-mono)" }}
            >
              Built with
            </span>
            <div className="flex items-center gap-2">
              {/* Tech stack icons */}
              {[
                { name: "Qdrant", color: "#00F5FF" },
                { name: "Python", color: "#8B5CF6" },
                { name: "Claude", color: "#FF2D6A" },
              ].map(({ name, color }) => (
                <span
                  key={name}
                  className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    background: `${color}10`,
                    border: `1px solid ${color}25`,
                    color: color,
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
