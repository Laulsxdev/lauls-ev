import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Truck, Route as RouteIcon, MapPin, Bot, LogOut, Zap, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout, useStore } from "@/lib/mock-store";

const nav = [
  { group: "Operations", items: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/trips", label: "Trips", icon: RouteIcon },
    { to: "/admin/geofence", label: "Geofence", icon: MapPin },
  ]},
  { group: "Fleet", items: [
    { to: "/admin/vehicles", label: "Vehicles", icon: Truck },
    { to: "/admin/drivers", label: "Drivers", icon: Users },
  ]},
];

export function Sidebar({ onOpenAI }: { onOpenAI: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profile = useStore((s) => s.profile);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate({ to: "/auth" }); };
  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const initials = profile ? profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "?";

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 transition-[width] duration-200"
      style={{ width: collapsed ? 64 : 240, background: "#08081A", boxShadow: "4px 0 24px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-accent-soft border border-border-default flex items-center justify-center shrink-0">
          <Zap size={18} className="text-accent" fill="currentColor" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-text-primary leading-tight">LAULS</div>
            <div className="text-[11px] text-text-muted leading-tight">EV Fleet</div>
          </div>
        )}
        <button onClick={() => setCollapsed((v) => !v)} className="text-text-muted hover:text-text-primary w-7 h-7 rounded inline-flex items-center justify-center">
          <Menu size={14} />
        </button>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto pb-4 space-y-5">
        {nav.map((group) => (
          <div key={group.group}>
            {!collapsed && <div className="section-label px-2 mb-2">{group.group}</div>}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 h-10 px-2.5 rounded-lg text-sm transition relative",
                      active
                        ? "bg-accent-soft text-text-primary border-l-2 border-accent"
                        : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary",
                    )}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        <div>
          {!collapsed && <div className="section-label px-2 mb-2">AI</div>}
          <button
            onClick={onOpenAI}
            className="w-full flex items-center gap-2 h-10 px-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/[0.03] hover:text-text-primary"
          >
            <Bot size={18} className="shrink-0" />
            {!collapsed && <span>Lev-AI</span>}
            {!collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: "live-pulse 1.6s infinite" }} />}
          </button>
        </div>
      </nav>

      <div className="border-t border-border-default p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-accent-soft border border-border-default flex items-center justify-center text-xs font-semibold text-accent shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text-primary truncate">{profile?.name}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{profile?.role}</div>
            </div>
          )}
          <button onClick={handleLogout} className="w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-status-red inline-flex items-center justify-center" title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
