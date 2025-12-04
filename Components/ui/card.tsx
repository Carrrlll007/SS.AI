"use client";

import React from "react";

const cx = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(" ");

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cx(
        "glass-panel rounded-2xl border border-white/10 text-slate-100 shadow-xl",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cx("p-6 pb-2", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cx("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={cx("p-6 pt-0 flex items-center gap-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3 className={cx("text-lg font-semibold leading-tight", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p className={cx("text-sm text-slate-400 leading-relaxed", className)} {...props} />
  );
}
