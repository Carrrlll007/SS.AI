"use client";

import React from "react";
import type { TextContent, Theme } from "@/lib/types";

type TextProps = {
  content?: TextContent;
  theme?: Theme;
  className?: string;
};

const joinClassNames = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

const fallbackContent: Required<TextContent> = {
  title: "Add a headline",
  body: "Share your story, outline your product, or add any long-form copy here. The text section keeps things simple so your words stay front and center.",
};

export default function Text({ content, theme, className }: TextProps) {
  const data = { ...fallbackContent, ...(content || {}) };
  const fontClass = theme?.font || "font-sans";

  return (
    <section className={joinClassNames("py-16 px-6", className)}>
      <div className="max-w-3xl mx-auto space-y-4 text-slate-300">
        <h2
          className={joinClassNames(
            "text-3xl font-bold text-slate-50 mb-4",
            fontClass
          )}
        >
          {data.title}
        </h2>
        <div className="whitespace-pre-wrap leading-relaxed">
          {data.body}
        </div>
      </div>
    </section>
  );
}
