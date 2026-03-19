"use client";

import React from "react";
import { Check, Github, Zap, Shield, Database, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Community",
    tagline: "Self-hosted, MIT licensed",
    price: "Free",
    period: "",
    description: "Run it yourself. Full source on GitHub, no limits on collections or memories.",
    features: [
      { text: "Unlimited collections", color: "#00F5FF" },
      { text: "3-layer security pipeline", color: "#00FF88" },
      { text: "Dual embedding routing", color: "#8B5CF6" },
      { text: "GitHub / Jira sync", color: "#FF2D6A" },
      { text: "Self-hosted Qdrant", color: "#FFB800" },
    ],
    cta: "View on GitHub",
    ctaHref: "https://github.com/Hidden-History/ai-memory",
    ctaIcon: Github,
    highlight: false,
    cardBg: "rgba(10, 10, 31, 0.6)",
    border: "rgba(0, 245, 255, 0.1)",
    accentColor: "#00F5FF",
  },
  {
    name: "Cloud",
    tagline: "Managed infrastructure",
    price: "$29",
    period: "/ month",
    description: "Zero setup. Connect your API keys and start building. We handle the vector DB.",
    features: [
      { text: "Unlimited collections", color: "#00F5FF" },
      { text: "3-layer security pipeline", color: "#00FF88" },
      { text: "Dual embedding routing", color: "#8B5CF6" },
      { text: "GitHub / Jira sync", color: "#FF2D6A" },
      { text: "Hosted Qdrant cluster", color: "#FFB800" },
    ],
    cta: "Start Building",
    ctaHref: "#",
    ctaIcon: ArrowRight,
    highlight: true,
    cardBg: "rgba(0, 245, 255, 0.03)",
    border: "rgba(0, 245, 255, 0.25)",
    accentColor: "#00F5FF",
  },
  {
    name: "Enterprise",
    tagline: "Custom deployments",
    price: "Custom",
    period: "",
    description: "On-prem or private cloud. SSO, audit logs, and dedicated support for your team.",
    features: [
      { text: "Unlimited collections", color: "#00F5FF" },
      { text: "3-layer security pipeline", color: "#00FF88" },
      { text: "Dual embedding routing", color: "#8B5CF6" },
      { text: "GitHub / Jira sync", color: "#FF2D6A" },
      { text: "On-prem / private cloud", color: "#FFB800" },
    ],
    cta: "Talk to Us",
    ctaHref: "#",
    ctaIcon: ArrowRight,
    highlight: false,
    cardBg: "rgba(10, 10, 31, 0.6)",
    border: "rgba(139, 92, 246, 0.1)",
    accentColor: "#8B5CF6",
  },
];

export function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="relative flex flex-col p-8 rounded-2xl transition-all duration-400"
            style={{
              background: tier.cardBg,
              border: `1px solid ${tier.border}`,
              boxShadow: tier.highlight
                ? `0 0 60px ${tier.accentColor}10, 0 20px 60px rgba(0,0,0,0.4)`
                : "0 4px 20px rgba(0,0,0,0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 0 50px ${tier.accentColor}15, 0 16px 50px rgba(0,0,0,0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = tier.highlight
                ? `0 0 60px ${tier.accentColor}10, 0 20px 60px rgba(0,0,0,0.4)`
                : "0 4px 20px rgba(0,0,0,0.3)";
            }}
          >
            {/* Popular badge */}
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: `${tier.accentColor}`,
                    color: "#030308",
                    fontFamily: "var(--font-mono)",
                    boxShadow: `0 0 20px ${tier.accentColor}40`
                  }}
                >
                  <Zap className="w-3 h-3" />
                  Most Popular
                </span>
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <h3
                className="text-xl font-semibold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "#E8EAF0" }}
              >
                {tier.name}
              </h3>
              <p className="text-sm" style={{ color: "#4A5068", fontFamily: "var(--font-body)" }}>
                {tier.tagline}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span
                className="text-5xl font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: tier.highlight ? tier.accentColor : "#E8EAF0"
                }}
              >
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-sm ml-1" style={{ color: "#4A5068" }}>
                  {tier.period}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}
            >
              {tier.description}
            </p>

            {/* CTA */}
            <a
              href={tier.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 mb-8"
              style={{
                background: tier.highlight ? tier.accentColor : "transparent",
                color: tier.highlight ? "#030308" : tier.accentColor,
                border: `1px solid ${tier.border}`,
                fontFamily: "var(--font-heading)"
              }}
              onMouseEnter={(e) => {
                if (tier.highlight) {
                  e.currentTarget.style.filter = "brightness(1.1)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${tier.accentColor}40`;
                } else {
                  e.currentTarget.style.background = `${tier.accentColor}10`;
                  e.currentTarget.style.borderColor = `${tier.accentColor}40`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                if (tier.highlight) {
                  e.currentTarget.style.background = tier.accentColor;
                } else {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = tier.border;
                }
              }}
            >
              <tier.ctaIcon className="w-4 h-4" />
              {tier.cta}
            </a>

            {/* Features */}
            <div className="space-y-3">
              {tier.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${feature.color}12`,
                      border: `1px solid ${feature.color}25`
                    }}
                  >
                    <Check className="w-3 h-3" style={{ color: feature.color }} />
                  </div>
                  <span className="text-sm" style={{ color: "#8892A8", fontFamily: "var(--font-body)" }}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
