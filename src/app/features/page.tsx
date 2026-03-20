"use client";

import { Sparkles, Layers, SplitSquareHorizontal, Zap, Clock, Github, BarChart3, Shield, Target } from "lucide-react";
import { FeaturesHero } from "@/components/sections/features/features-hero";
import { CoreArchitecture } from "@/components/sections/features/core-architecture";
import { SmartChunking } from "@/components/sections/features/smart-chunking";
import { ContextInjection } from "@/components/sections/features/context-injection";
import { TemporalAwareness } from "@/components/sections/features/temporal-awareness";
import { GitHubIntegration } from "@/components/sections/features/github-integration";
import { Observability } from "@/components/sections/features/observability";
import { SecurityPipeline } from "@/components/sections/features/security-pipeline";
import { FeaturesCTA } from "@/components/sections/features/features-cta";
import { SectionNav } from "@/components/shared/section-nav";

const FEATURES_SECTIONS = [
  { id: "hero", label: "Overview", icon: Sparkles },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "chunking", label: "Chunking", icon: SplitSquareHorizontal },
  { id: "injection", label: "Injection", icon: Zap },
  { id: "temporal", label: "Temporal", icon: Clock },
  { id: "github", label: "GitHub", icon: Github },
  { id: "observability", label: "Observability", icon: BarChart3 },
  { id: "security", label: "Security", icon: Shield },
  { id: "cta", label: "Get Started", icon: Target },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-mesh" style={{ zIndex: 0 }} />

      {/* Section nav */}
      <SectionNav sections={FEATURES_SECTIONS} />

      <main className="relative z-10">
        <FeaturesHero />
        <CoreArchitecture />
        <SmartChunking />
        <ContextInjection />
        <TemporalAwareness />
        <GitHubIntegration />
        <Observability />
        <SecurityPipeline />
        <FeaturesCTA />
      </main>
    </>
  );
}
