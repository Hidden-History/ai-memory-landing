"use client";

import { PricingPage } from "@/components/ui/animated-pricing-page";
import { AnimatedSection } from "@/components/shared/animated-section";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary-light text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest mb-6">
            Pricing
          </div>
        </AnimatedSection>
        <PricingPage />
      </div>
    </section>
  );
}
