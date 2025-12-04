"use client";

import React from "react";

type SelectContextValue = {
  open: boolean;
  value?: string;
  label?: string;
  placeholder?: string;
  setOpen: (value: boolean) => void;
  setSelection: (value: string, label?: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelect = () => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used inside <Select>");
  return ctx;
};

type SelectProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

export function Select({
  value,
  defaultValue,
  placeholder,
  onValueChange,
  children,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    value ?? defaultValue
  );
  const [label, setLabel] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const setSelection = (next: string, nextLabel?: string) => {
    onValueChange?.(next);
    if (value === undefined) setInternalValue(next);
    setLabel(nextLabel);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        open,
        value: internalValue,
        label,
        placeholder,
        setOpen,
        setSelection,
      }}
    >
      <div className={`relative ${className || ""}`}>{children}</div>
    </SelectContext.Provider>
  );
}

type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export function SelectTrigger({ className, children, ...props }: TriggerProps) {
  const { open, setOpen } = useSelect();
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/60 ${className || ""}`}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <span className="ml-2 text-xs text-slate-400">{open ? "▲" : "▼"}</span>
    </button>
  );
}

type ValueProps = { placeholder?: string; className?: string };
export function SelectValue({ placeholder, className }: ValueProps) {
  const ctx = useSelect();
  const display = ctx.label ?? ctx.value ?? placeholder ?? ctx.placeholder ?? "Select";
  return <span className={className}>{display}</span>;
}

type ContentProps = React.HTMLAttributes<HTMLDivElement>;
export function SelectContent({ className, children, ...props }: ContentProps) {
  const { open } = useSelect();
  if (!open) return null;
  return (
    <div
      className={`absolute z-30 mt-2 w-full rounded-xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-lg ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

type ItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string };
export function SelectItem({ className, value, children, ...props }: ItemProps) {
  const { setSelection, value: active } = useSelect();
  const isActive = active === value;

  const childLabel =
    typeof children === "string" ? children : props["aria-label"]?.toString();

  return (
    <button
      type="button"
      className={`w-full rounded-lg px-3 py-2 text-left text-sm text-slate-100 transition ${
        isActive ? "bg-brand-600/80" : "hover:bg-white/10"
      } ${className || ""}`}
      onClick={() => setSelection(value, childLabel)}
      {...props}
    >
      {children}
    </button>
  );
}
