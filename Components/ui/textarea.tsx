"use client";

import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const cx = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(" ");

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cx(
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/60",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
