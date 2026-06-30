import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, HardHat, Shield } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button, Input, Field } from "@/components/ui-kit";
import { setProfile, type LocalProfile, getProfile } from "@/lib/auth-guard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Lauls EV Fleet" },
      { name: "description", content: "Sign in to Lauls EV Fleet operations dashboard." },
    ],
  }),
  component: AuthPage,
});

const ADMIN_CREDS = { email: "admin@lauls.dev", password: "admin123", name: "Admin" };
const WORKER_CREDS = { email: "worker@lauls.dev", password: "worker123", name: "Field Worker" };

function AuthPage() {
  const navigate = useNavigate();
  const profile = getProfile();
  const [role, setRole] = useState<"worker" | "admin">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createProfile = useMutation(api.profiles.create);
  const existingProfile = useQuery(
    api.profiles.getByEmail,
    email ? { email } : "skip"
  );

  useEffect(() => {
    if (profile) navigate({ to: profile.role === "admin" ? "/admin" : "/manual-fill" });
  }, [profile, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cred = role === "admin" ? ADMIN_CREDS : WORKER_CREDS;

    if (email !== cred.email || password !== cred.password) {
      setError(`Invalid credentials. Use ${cred.email} / ${cred.password}`);
      setLoading(false);
      return;
    }

    try {
      await new Promise((r) => setTimeout(r, 200));
      const p = existingProfile;
      if (p) {
        const lp: LocalProfile = { _id: p._id, name: p.name, email: p.email, role };
        setProfile(lp);
        navigate({ to: role === "admin" ? "/admin" : "/manual-fill" });
        return;
      }
      const profileId = await createProfile({
        name: cred.name,
        email: cred.email,
        role,
      });
      const lp: LocalProfile = {
        _id: profileId,
        name: cred.name,
        email: cred.email,
        role,
      };
      setProfile(lp);
      navigate({ to: role === "admin" ? "/admin" : "/manual-fill" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-bg-0">
      <div className="card-panel w-full max-w-[420px] p-8">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-accent-soft border border-border-default flex items-center justify-center mb-3">
            <Zap size={22} className="text-accent" fill="currentColor" />
          </div>
          <div className="text-base font-bold text-text-primary tracking-tight">LAULS EV Fleet</div>
          <div className="text-[11px] text-text-muted mt-1">Mission control for your electric fleet</div>
        </div>

        <div className="flex p-1 bg-bg-3 rounded-full mb-6">
          {(["admin", "worker"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setEmail(""); setPassword(""); setError(null); }}
              className={cn(
                "flex-1 h-9 rounded-full text-xs font-semibold transition",
                role === r ? "bg-accent text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)]" : "text-text-secondary hover:text-text-primary",
              )}
            >
              {r === "admin" ? "Admin" : "Worker"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={role === "admin" ? "admin@lauls.dev" : "worker@lauls.dev"} />
          </Field>
          <Field label="Password" required hint={role === "admin" ? "Hint: admin123" : "Hint: worker123"}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
          </Field>

          {error && (
            <div className="text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full h-11">
            Sign in as {role}
          </Button>
        </form>

        <div className="mt-5 text-center space-y-1 text-[11px] text-text-muted">
          <div><span className="text-text-secondary font-semibold">Admin</span> admin@lauls.dev / admin123</div>
          <div><span className="text-text-secondary font-semibold">Worker</span> worker@lauls.dev / worker123</div>
        </div>
      </div>
    </main>
  );
}
