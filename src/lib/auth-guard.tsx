import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export type Role = "admin" | "worker";

export interface LocalProfile {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

const STORAGE_KEY = "lauls-ev-profile";

export function getProfile(): LocalProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setProfile(p: LocalProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useProfile() {
  const [profile, setP] = useState<LocalProfile | null>(getProfile);
  useEffect(() => {
    const handler = () => setP(getProfile());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  return profile;
}

export function AuthGuard({ children, role }: { children: ReactNode; role?: Role }) {
  const profile = getProfile();
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
