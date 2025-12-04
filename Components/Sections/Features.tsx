"use client";

import React from "react";
import {
  BarChart,
  CheckCircle,
  Layout,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import type { FeaturesContent, FeaturesItem, Theme } from "@/lib/types";

type FeaturesProps = {
  content?: FeaturesContent;
  theme?: Theme;
  className?: string;
};

const joinClassNames = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

const iconMap = {
  check: CheckCircle,
  zap: Zap,
  shield: Shield,
  globe: Layout,
  chart: BarChart,
  rocket: Rocket,
  sparkles: Sparkles,
  layout: Layout,
};

const fallbackItems: FeaturesItem[] = [
  {
    title: "Drag and drop",
    description: "Reorder sections and preview on every device instantly.",
    icon: "layout",
  },
  {
    title: "Themeable",
    description: "Choose fonts and colors that match your brand in seconds.",
    icon: "sparkles",
  },
  {
    title: "Built to launch",
    description: "Publish quickly with a clean, performant layout.",
    icon: "rocket",
  },
];

const fallbackContent: FeaturesContent = {
  title: "Everything you need",
  subtitle: "Polished components that ship with sensible defaults.",
  items: fallbackItems,
};

const resolveBgClass = (color?: string) => {
  if (!color) return "bg-brand-500/15";
  if (color.startsWith("#") || color.startsWith("rgb")) return "bg-brand-500/15";
  return `${color} bg-opacity-20`;
};

const resolveIconStyle = (color?: string) => {
  if (!color) return undefined;
  if (color.startsWith("#") || color.startsWith("rgb")) {
    return { backgroundColor: color, color: "#0b1727" };
  }
  return undefined;
};

export default function Features({ content, theme, className }: FeaturesProps) {
  const data: FeaturesContent = { ...fallbackContent, ...(content || {}) };
  const items = data.items && data.items.length > 0 ? data.items : fallbackItems;
  const accentClass = resolveBgClass(theme?.primaryColor);
  const accentStyle = resolveIconStyle(theme?.primaryColor);
  const fontClass = theme?.font || "font-sans";

  return (
    <section
      className={joinClassNames("py-24 px-6 bg-transparent", className)}
      aria-label="Features"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">
            Build with confidence
          </p>
          <h2
            className={joinClassNames(
              "text-3xl md:text-4xl font-bold text-slate-50",
              fontClass
            )}
          >
            {data.title || fallbackContent.title}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {data.subtitle || fallbackContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const iconKey = (item.icon as keyof typeof iconMap) || "layout";
            const Icon = iconMap[iconKey] || Layout;
            const Wrapper: any = item.href ? "a" : "div";
            return (
              <Wrapper
                key={`${item.title}-${idx}`}
                className="glass-panel p-8 rounded-2xl transition-transform hover:-translate-y-1 flex flex-col gap-4"
                href={item.href}
              >
                <div
                  className={joinClassNames(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-brand-100 border border-white/10 shadow-sm",
                    accentClass
                  )}
                  style={accentStyle}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-50">
                    {item.title || "Feature"}
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {item.description || "Describe what makes this feature great."}
                  </p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
