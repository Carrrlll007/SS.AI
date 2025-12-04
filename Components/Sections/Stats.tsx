"use client";

import React from "react";
import type { StudioShapeTheme } from "@/lib/types";

type StatItem = {
  label: string;
  value: string;
};

type StatsProps = {
  items?: StatItem[];
  theme?: StudioShapeTheme;
  className?: string;
};

const joinClassNames = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

const fallbackItems: StatItem[] = [
  { label: "Projects launched", value: "120+" },
  { label: "Avg. time to publish", value: "< 2 min" },
  { label: "Performance score", value: "96+" },
];

export default function Stats({ items, theme, className }: StatsProps) {
  const data = items && items.length ? items : fallbackItems;
  const accent = theme?.accentColor || theme?.primaryColor || "#8b5cf6";

  return (
    <section className={joinClassNames("py-12 px-4", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((stat) => (
          <div
            key={stat.label}
            className="glass-panel rounded-2xl border border-white/10 px-6 py-5"
            style={{ borderColor: `${accent}33` }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
