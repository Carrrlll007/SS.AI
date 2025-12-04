"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import type { HeroContent, Theme } from "@/lib/types";

type HeroProps = {
  content?: HeroContent;
  theme?: Theme;
  className?: string;
};

const joinClassNames = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

const fallbackContent: Required<HeroContent> = {
  headline: "Launch beautiful pages fast",
  subheadline:
    "Build, edit, and publish without touching code. Keep everything on-brand with a flexible theme system.",
  ctaText: "Get Started",
  secondaryCtaText: "View demo",
  primaryHref: "#",
  secondaryHref: "#",
};

const resolveBgClass = (color?: string) => {
  if (!color) return "bg-indigo-600";
  if (color.startsWith("#") || color.startsWith("rgb")) return "bg-indigo-600";
  return color;
};

const resolveBgStyle = (color?: string) => {
  if (!color) return undefined;
  if (color.startsWith("#") || color.startsWith("rgb")) {
    return { backgroundColor: color };
  }
  return undefined;
};

export default function Hero({ content, theme, className }: HeroProps) {
  const data = { ...fallbackContent, ...(content || {}) };
  const fontClass = theme?.font || "font-sans";
  const primaryClass = resolveBgClass(theme?.primaryColor);
  const primaryStyle = resolveBgStyle(theme?.primaryColor);
  const primaryHref = content?.primaryHref;
  const secondaryHref = content?.secondaryHref;

  return (
    <section
      className={joinClassNames(
        "relative overflow-hidden py-20 px-6 md:px-12 lg:px-20 text-center text-slate-100 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/30",
        className
      )}
    >
      <div className="absolute inset-0 bg-hero-glow opacity-60 pointer-events-none" />
      <div className="absolute left-1/3 top-6 h-48 w-48 rounded-full bg-brand-500/30 blur-[120px]" />
      <div className="absolute right-1/4 -bottom-16 h-64 w-64 rounded-full bg-cyan-400/25 blur-[140px]" />

      <div className="relative max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <p className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            No-code builder
          </p>
          <h1
            className={joinClassNames(
              "text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl",
              fontClass
            )}
          >
            {data.headline}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {data.subheadline}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className={joinClassNames(
              "text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-white",
              primaryClass
            )}
            style={primaryStyle}
            asChild={Boolean(primaryHref)}
            href={primaryHref}
          >
            {data.ctaText}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 border-white/30 bg-white/5 hover:bg-white/10"
            asChild={Boolean(secondaryHref)}
            href={secondaryHref}
          >
            {data.secondaryCtaText || "Learn more"}
          </Button>
        </div>
      </div>
    </section>
  );
}
