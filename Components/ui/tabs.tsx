"use client";

import React from "react";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used inside <Tabs>");
  return ctx;
};

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

export function Tabs({
  defaultValue = "",
  value,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (typeof value === "string") setInternalValue(value);
  }, [value]);

  const setValue = (next: string) => {
    onValueChange?.(next);
    if (value === undefined) setInternalValue(next);
  };

  return (
    <TabsContext.Provider value={{ value: internalValue, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;
export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full bg-white/5 p-1 ${className || ""}`}
      {...props}
    />
  );
}

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
  const { value: active, setValue } = useTabs();
  const isActive = active === value;

  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive ? "bg-brand-600 text-white shadow-lg" : "text-slate-300 hover:text-white"
      } ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & { value: string };

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const { value: active } = useTabs();
  if (active !== value) return null;
  return (
    <div className={`mt-4 ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
