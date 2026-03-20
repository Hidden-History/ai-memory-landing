import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

const footerLinks: Record<string, Array<{ label: string; href: string; external?: boolean }>> = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Architecture", href: "/#architecture" },
    { label: "Integrations", href: "/#integrations" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
  ],
  Community: [
    { label: "GitHub", href: "https://github.com/Hidden-History/ai-memory", external: true },
  ],
  Parzival: [
    { label: "About", href: "/parzival" },
  ],
};

export function Footer() {
  return (
    <footer
      className="relative py-20 px-6 overflow-hidden"
      style={{
        borderTop: "1px solid rgba(0,245,255,0.08)",
        background: "linear-gradient(to bottom, rgba(5,7,18,0.98), rgba(8,10,26,0.99))",
        zIndex: 10,
      }}
    >
      {/* Neural grid background */}
      <div className="absolute inset-0 neural-grid opacity-20" />
      {/* Glowing horizon line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.3), rgba(139,92,246,0.2), rgba(0,245,255,0.3), transparent)",
          boxShadow: "0 0 20px rgba(0,245,255,0.2)",
        }}
      />

      {/* Background accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,245,255,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Top section: Logo + tagline + social */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-5">
              {/* Logo */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(0,245,255,0.06)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  boxShadow: "0 0 25px rgba(0,245,255,0.08) inset",
                }}
              >
                <Image
                  src="/ai-memory-mark.png"
                  alt="AI Memory"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <div>
                <div
                  className="font-bold text-xl tracking-tight font-heading text-text"
                >
                  AI Memory
                </div>
                <div
                  className="text-[11px] tracking-[0.2em] uppercase text-primary font-mono"
                >
                  Neural Memory System
                </div>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-6 font-body"
              style={{ color: "#6B7D99" }}
            >
              Persistent context layer for AI agents. Built on Qdrant vector
              search with semantic decay, 3-layer security, and cross-session memory.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: "https://github.com/Hidden-History/ai-memory", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 text-text-subtle hover:text-primary focus-visible:text-primary hover:bg-primary/8 focus-visible:bg-primary/8 hover:border-primary/30 focus-visible:border-primary/30"
                  style={{
                    background: "rgba(0,245,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.1)",
                  }}
                  aria-label={label}
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h4
                  className="text-[10px] font-bold uppercase tracking-[0.15em] mb-5 text-text font-mono"
                >
                  {group}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-sm transition-colors duration-200 inline-flex items-center gap-1 font-body text-text-subtle hover:text-primary focus-visible:text-primary"
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
          style={{ borderTop: "1px solid rgba(0,245,255,0.05)" }}
        >
          <p
            className="text-xs font-body text-text-dim"
          >
            &copy; 2024-{new Date().getFullYear()} Hidden History. MIT Licensed.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-text-dim">
              Built with
            </span>
            <div className="flex items-center gap-2">
              {[
                { name: "Qdrant", color: "#00F5FF" },
                { name: "Python", color: "#8B5CF6" },
                { name: "Claude", color: "#FF2D6A" },
              ].map(({ name, color }) => (
                <span
                  key={name}
                  className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono"
                  style={{
                    background: `${color}0A`,
                    border: `1px solid ${color}20`,
                    color: color,
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
