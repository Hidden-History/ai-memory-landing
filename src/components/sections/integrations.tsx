"use client";

import { AnimatedSection } from "@/components/shared/animated-section";

const integrationLogos = [
  { name: "GitHub", slug: "github" },
  { name: "Jira", slug: "jira" },
  { name: "Qdrant", slug: "qdrant" },
  { name: "Prometheus", slug: "prometheus" },
  { name: "Grafana", slug: "grafana" },
  { name: "Docker", slug: "docker" },
  { name: "Python", slug: "python" },
  { name: "TypeScript", slug: "typescript" },
  { name: "OpenAI", slug: "openai" },
  { name: "Anthropic", slug: "anthropic" },
];

export function Integrations() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Ecosystem
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            Integrates with{" "}
            <span className="gradient-text">Everything</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            GitHub, Jira, Langfuse, Qdrant, Prometheus, Grafana &mdash; AI
            Memory plugs into your existing infrastructure.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {integrationLogos.map((item) => (
              <div
                key={item.slug}
                className="gradient-border p-6 flex flex-col items-center gap-3 group cursor-pointer transition-all duration-350 hover:translate-y-[-2px]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                  <span className="text-xl font-[family-name:var(--font-heading)] font-bold text-primary-light/80 group-hover:text-primary-light transition-colors">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-[family-name:var(--font-mono)] text-muted-darker group-hover:text-muted transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
