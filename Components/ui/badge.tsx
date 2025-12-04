"use client";

import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

const cx = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(" ");

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100",
        className
      )}
      {...props}
    />
  );
}
