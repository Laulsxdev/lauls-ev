import { Search, Bell } from "lucide-react";
import { getProfile } from "@/lib/auth-guard";

export function TopBar({ title }: { title: string }) {
  const profile = getProfile();
  const initials = profile ? profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "?";
  return (
    <header className="h-12 px-6 flex items-center justify-between border-b border-border-default bg-bg-0 sticky top-0 z-20">
      <h1 className="text-[18px] font-semibold text-text-primary">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            placeholder="Search…"
            className="w-full h-8 pl-8 pr-3 bg-transparent border border-transparent hover:border-border-default focus:border-border-focus rounded-md text-xs text-text-primary placeholder:text-text-disabled outline-none transition"
          />
        </div>
        <button className="w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-text-primary inline-flex items-center justify-center relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-status-amber" />
        </button>
        <div className="w-8 h-8 rounded-full bg-accent-soft border border-border-default flex items-center justify-center text-[11px] font-semibold text-accent">
          {initials}
        </div>
      </div>
    </header>
  );
}
