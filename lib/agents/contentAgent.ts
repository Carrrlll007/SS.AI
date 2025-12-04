"use client";

import type { StudioShapeSite } from "@/lib/types";

export function getContentSuggestions(site: StudioShapeSite): string[] {
  const featureCount = site.sections.features.items.length;
  const storyParagraphs = site.sections.story.paragraphs.length;
  return [
    `Sharpen the hero into a single outcome and proof point: keep "${site.sections.hero.title}" tight and action oriented.`,
    `Use the subtitle to call out who this is for and why now; connect it to your goal and audience in one sentence.`,
    `Keep ${featureCount <= 4 ? featureCount : "4"} strongest features that show outcomes, not mechanics. Lead with the most valuable one.`,
    storyParagraphs > 1
      ? "Merge the first two story paragraphs into a focused narrative and add one specific example or metric."
      : "Add a short story paragraph that ties the offer to the audience and includes one concrete result.",
    "Match CTA copy to the goal (e.g., leads -> “Get started”, portfolio -> “View work”) and mirror that wording in the first section.",
  ];
}
