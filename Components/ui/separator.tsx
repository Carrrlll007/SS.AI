"use client";

import React from "react";

type SeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      className={`h-px w-full bg-white/10 ${className || ""}`}
      {...props}
    />
  );
}
