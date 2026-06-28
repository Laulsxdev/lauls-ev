import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-panel p-5", className)} {...props} />;
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("section-label", className)}>{children}</div>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "destructive" | "icon";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { className, variant = "primary", loading, children, disabled, ...rest }, ref,
) {
  const base = "inline-flex items-center justify-center gap-2 font-medium text-sm rounded-lg transition active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary: "bg-accent text-white hover:bg-accent-hover h-[38px] px-4",
    ghost: "bg-transparent border border-border-default text-text-secondary hover:bg-bg-2 hover:text-text-primary h-[38px] px-4",
    destructive: "bg-transparent border border-status-red/30 text-status-red hover:bg-status-red/[0.08] h-[38px] px-4",
    icon: "bg-transparent text-text-secondary hover:bg-bg-2 hover:text-text-primary w-9 h-9",
  };
  return (
    <button ref={ref} className={cn(base, variants[variant], className)} disabled={disabled || loading} {...rest}>
      {loading && <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />}
      {children}
    </button>
  );
});

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  function Input({ className, error, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "input-base placeholder:text-text-disabled focus:border-border-focus focus:shadow-[0_0_0_3px_var(--color-accent-glow)]",
          error && "border-status-red focus:border-status-red focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "input-base placeholder:text-text-disabled focus:border-border-focus focus:shadow-[0_0_0_3px_var(--color-accent-glow)] py-2 min-h-[80px] resize-y",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "input-base appearance-none pr-8 bg-no-repeat focus:border-border-focus focus:shadow-[0_0_0_3px_var(--color-accent-glow)]",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394A3B8%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px] bg-[position:right_12px_center]",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

export function Field({ label, required, error, children, hint }: {
  label: string; required?: boolean; error?: string; children: ReactNode; hint?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary">
        {required && <span className="text-accent mr-1">·</span>}
        {label}
      </label>
      {children}
      {hint && !error && <div className="text-[11px] text-text-muted">{hint}</div>}
      {error && <div className="text-[11px] text-status-red">{error}</div>}
    </div>
  );
}

export function Badge({ variant, children }: {
  variant: "green" | "amber" | "red" | "blue" | "muted";
  children: ReactNode;
}) {
  const styles: Record<string, string> = {
    green: "bg-status-green-bg border-status-green-border text-status-green",
    amber: "bg-status-amber-bg border-status-amber-border text-status-amber",
    red: "bg-status-red-bg border-status-red-border text-status-red",
    blue: "bg-status-blue-bg border-status-blue-border text-status-blue",
    muted: "bg-bg-2 border-border-default text-text-secondary",
  };
  const dot: Record<string, string> = {
    green: "bg-status-green",
    amber: "bg-status-amber",
    red: "bg-status-red",
    blue: "bg-status-blue",
    muted: "bg-text-muted",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full border text-[11px] font-semibold", styles[variant])}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot[variant])} />
      {children}
    </span>
  );
}

export function BatteryBar({ value }: { value: number }) {
  const color = value > 70 ? "bg-status-green" : value > 40 ? "bg-status-amber" : "bg-status-red";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-[5px] rounded-full bg-bg-3 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      </div>
      <span className="text-xs tabular-nums text-text-primary">{value}%</span>
    </div>
  );
}
