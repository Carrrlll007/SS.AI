"use client";

import React from "react";

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, style, ...props }, ref) => (
    <div
      ref={ref}
      className={`overflow-auto ${className || ""}`}
      style={{ maxHeight: "24rem", ...style }}
      {...props}
    >
      {children}
    </div>
  )
);

ScrollArea.displayName = "ScrollArea";
