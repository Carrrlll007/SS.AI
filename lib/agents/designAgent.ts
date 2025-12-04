"use client";

import type { StudioShapeSite } from "@/lib/types";

export function getDesignSuggestions(site: StudioShapeSite): string[] {
  const preset = site.layoutPreset;
  return [
    `Lean into the ${preset} preset by keeping spacing consistent and limiting section types to what supports that flow.`,
    `Anchor buttons and accents to your primary color (${site.theme.primaryColor}) and reserve the accent for hover or stats.`,
    "Use one font family across the page; reserve bold weights for headings and CTA labels to keep contrast high.",
    "Keep hero background clean; let gradients live in borders or cards to maintain readability on dark surfaces.",
    "Group related stats on a single row so visitors can scan credibility quickly before hitting the CTA.",
  ];
}
