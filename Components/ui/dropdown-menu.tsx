"use client";

import React from "react";

type DropdownContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

const useDropdown = () => {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) {
    throw new Error("DropdownMenu components must be wrapped in <DropdownMenu />");
  }
  return ctx;
};

type DropdownMenuProps = {
  children: React.ReactNode;
};

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

type TriggerProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  children: React.ReactNode;
};

export const DropdownMenuTrigger = React.forwardRef<HTMLElement, TriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const { open, setOpen } = useDropdown();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      props.onClick?.(event);
      if (!event.defaultPrevented) setOpen(!open);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onClick: handleClick,
      });
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

type ContentProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "end";
};

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, align = "start", style, children, ...props }, ref) => {
    const { open, setOpen } = useDropdown();
    if (!open) return null;

    const alignment = align === "end" ? "right-0" : "left-0";

    return (
      <div
        ref={ref}
        className={`absolute ${alignment} mt-2 min-w-[180px] rounded-xl bg-slate-900/95 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl p-1 ${className || ""}`}
        style={style}
        {...props}
      >
        <div onClick={() => setOpen(false)}>{children}</div>
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

type ItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, ItemProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`w-full text-left rounded-lg px-3 py-2 text-sm text-slate-100 hover:bg-white/10 transition ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";
