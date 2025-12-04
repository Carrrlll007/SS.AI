"use client";

import React from "react";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
  };

const cx = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(" ");

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-900/40",
  outline:
    "border border-white/20 text-white hover:border-white/40 hover:bg-white/5 shadow-sm",
  ghost: "text-slate-200 hover:bg-white/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
  icon: "p-2 w-10 h-10",
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, ...props }, ref) => {
    const Component: any = asChild ? "a" : "button";
    return (
      <Component
        ref={ref as any}
        className={cx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
