"use client";

import React from "react";

type DialogContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

const useDialog = () => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used inside <Dialog>");
  return ctx;
};

type DialogProps = {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(Boolean(open));

  React.useEffect(() => {
    if (typeof open === "boolean") setInternalOpen(open);
  }, [open]);

  const setOpen = (value: boolean) => {
    onOpenChange?.(value);
    if (open === undefined) {
      setInternalOpen(value);
    }
  };

  return (
    <DialogContext.Provider value={{ open: internalOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useDialog();
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          ref={ref}
          className={`relative w-[90vw] max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 text-slate-100 shadow-2xl ${className || ""}`}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
DialogContent.displayName = "DialogContent";

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-1.5 ${className || ""}`} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`text-xl font-semibold leading-tight ${className || ""}`} {...props} />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-slate-400 ${className || ""}`} {...props} />
  );
}
