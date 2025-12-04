"use client";

import type { StudioShapeSite } from "@/lib/types";

export function getSeoSuggestions(site: StudioShapeSite): string[] {
  return [
    `Set a meta title like "${site.name} | ${site.sections.hero.title}" and a 150-character description that mirrors the hero.`,
    "Add alt text to any imagery or illustrations you include in hero and feature callouts.",
    "Use semantic headings: H1 for the hero title, H2 for features/story, and keep CTAs as buttons or links.",
    "Link the primary CTA to your lead or booking destination and repeat that link in the footer for crawlability.",
    "Keep copy scannable: short paragraphs, bullet points in features, and one keyword per section.",
  ];
}
