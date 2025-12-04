"use client";

import type { StudioShapeSite } from "@/lib/types";

export function getStrategySuggestions(site: StudioShapeSite): string[] {
  const primaryCta = site.sections.hero.primaryCtaLabel;
  return [
    `Make the primary CTA "${primaryCta}" visible in hero and again after the features grid to catch scanners.`,
    "Pair one stat with each CTA (e.g., time to launch, results, or social proof) to reduce friction.",
    "If the goal is leads, add a short lead capture block under the story; if portfolio, link directly to 2-3 highlights.",
    "Use the secondary CTA for a lower-commitment action like “Learn more” or “Contact” to support hesitant visitors.",
    "Revisit the layout preset after publishing: minimal for clarity, product for launches, portfolio for credibility, dark for bold campaigns.",
  ];
}
