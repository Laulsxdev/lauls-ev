import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useStore } from "./mock-store";

export function AuthGuard({ children, role }: { children: ReactNode; role?: "admin" | "worker" }) {
  const profile = useStore((s) => s.profile);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!profile) {
      navigate({ to: "/auth" });
      return;
    }
    if (role && profile.role !== role) {
      navigate({ to: profile.role === "admin" ? "/admin" : "/manual-fill" });
    }
  }, [profile, role, mounted, navigate, pathname]);

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-0">
        <div className="text-text-muted text-sm">Loading…</div>
      </div>
    );
  }
  if (role && profile.role !== role) return null;
  return <>{children}</>;
}
