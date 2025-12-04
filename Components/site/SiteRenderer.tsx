"use client";

import React from "react";
import Hero from "@/Components/Sections/Hero";
import Features from "@/Components/Sections/Features";
import Text from "@/Components/Sections/Text";
import Stats from "@/Components/Sections/Stats";
import type {
  FeaturesContent,
  HeroContent,
  TextContent,
  Theme,
  StudioShapeSite,
} from "@/lib/types";

type SiteRendererProps = {
  site: StudioShapeSite;
  className?: string;
};

const join = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(" ");

const toHeroContent = (site: StudioShapeSite): HeroContent => ({
  headline: site.sections.hero.title,
  subheadline: site.sections.hero.subtitle,
  ctaText: site.sections.hero.primaryCtaLabel,
  secondaryCtaText: site.sections.hero.secondaryCtaLabel,
});

const toFeaturesContent = (site: StudioShapeSite): FeaturesContent => ({
  title: "Highlights",
  subtitle: "Built with StudioShape",
  items: site.sections.features.items || [],
});

const toTextContent = (site: StudioShapeSite): TextContent => ({
  title: site.sections.story.heading,
  body: site.sections.story.paragraphs.join("\n\n"),
});

const mapTheme = (site: StudioShapeSite): Theme => ({
  primaryColor: site.theme.primaryColor,
  font: "font-display",
});

const presetWrapper = (preset: StudioShapeSite["layoutPreset"]) => {
  if (preset === "dark") {
    return "bg-[#030712]";
  }
  return "bg-transparent";
};

export default function SiteRenderer({ site, className }: SiteRendererProps) {
  const sectionTheme = mapTheme(site);
  const heroContent = toHeroContent(site);
  const featuresContent = toFeaturesContent(site);
  const textContent = toTextContent(site);
  const statsItems = site.sections.stats.items || [];

  const sharedBg = {
    background: site.theme.background || "#050914",
    color: site.theme.textColor || "#e2e8f0",
    fontFamily: site.theme.fontFamily || "Space Grotesk, Inter, system-ui, sans-serif",
  };

  const LayoutMinimal = () => (
    <div className="space-y-10">
      <Hero content={heroContent} theme={sectionTheme} />
      <Features content={featuresContent} theme={sectionTheme} className="bg-transparent" />
      <Stats items={statsItems} theme={site.theme} />
      <div className="glass-panel rounded-3xl border border-white/10">
        <Text content={textContent} theme={sectionTheme} className="pt-10" />
      </div>
    </div>
  );

  const LayoutProduct = () => (
    <div className="space-y-12">
      <Hero
        content={{
          ...heroContent,
          subheadline: `${heroContent.subheadline} Perfect for product teams shipping fast.`,
        }}
        theme={sectionTheme}
        className="rounded-[28px] border border-white/10 shadow-2xl"
      />
      <div className="glass-panel rounded-3xl border border-white/10 p-6">
        <Features content={featuresContent} theme={sectionTheme} className="bg-transparent" />
      </div>
      <Stats items={statsItems} theme={site.theme} />
      <Text
        content={{
          ...textContent,
          title: `${textContent.title} - product focus`,
        }}
        theme={sectionTheme}
        className="pt-6"
      />
    </div>
  );

  const LayoutPortfolio = () => (
    <div className="space-y-12">
      <Hero
        content={{
          headline: site.sections.hero.title || `${site.name}`,
          subheadline:
            site.sections.hero.subtitle ||
            "Designer / Builder crafting simple, expressive landing pages.",
          ctaText: site.sections.hero.primaryCtaLabel || "View work",
          secondaryCtaText: site.sections.hero.secondaryCtaLabel || "Contact",
        }}
        theme={sectionTheme}
        className="rounded-[28px] border border-white/10"
      />
      <div className="glass-panel rounded-3xl border border-white/10 p-6">
        <Features
          content={{
            title: "Highlights",
            subtitle: "Selected work and wins.",
            items: (featuresContent.items || []).slice(0, 4),
          }}
          theme={sectionTheme}
          className="bg-transparent"
        />
      </div>
      <Text
        content={{
          title: "About",
          body: textContent.body,
        }}
        theme={sectionTheme}
      />
      <Stats items={statsItems} theme={site.theme} />
    </div>
  );

  const renderLayout = () => {
    switch (site.layoutPreset) {
      case "product":
        return <LayoutProduct />;
      case "portfolio":
        return <LayoutPortfolio />;
      case "dark":
        return <LayoutMinimal />;
      default:
        return <LayoutMinimal />;
    }
  };

  return (
    <div
      className={join(
        "relative overflow-hidden",
        presetWrapper(site.layoutPreset),
        className
      )}
      style={sharedBg}
    >
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[200px]" />
      <div className="relative mx-auto max-w-6xl px-6 py-10">{renderLayout()}</div>
    </div>
  );
}

