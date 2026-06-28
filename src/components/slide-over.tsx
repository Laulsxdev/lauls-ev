import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SlideOver({ open, onClose, title, children, width = 480 }: {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full bg-bg-1 border-l border-border-default shadow-[-12px_0_48px_rgba(0,0,0,0.6)] transition-transform duration-300 flex flex-col",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ width }}
      >
        <header className="flex items-center justify-between h-12 px-5 border-b border-border-default shrink-0">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-text-primary inline-flex items-center justify-center">
            <X size={16} />
          </button>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </aside>
    </>
  );
}
