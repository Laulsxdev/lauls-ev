import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, HardHat, Shield } from "lucide-react";
import { Button, Input, Field } from "@/components/ui-kit";
import { login, useStore } from "@/lib/mock-store";
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

function AuthPage() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"worker" | "admin">("admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("root@lauls.dev");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) navigate({ to: profile.role === "admin" ? "/admin" : "/manual-fill" });
  }, [profile, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const p = login(email, password, role, mode === "signup" ? name : undefined);
      navigate({ to: p.role === "admin" ? "/admin" : "/manual-fill" });
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
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 h-9 rounded-full text-xs font-semibold transition",
                mode === m ? "bg-accent text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)]" : "text-text-secondary hover:text-text-primary",
              )}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <>
              <Field label="Full name" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Operator" required />
              </Field>
              <div>
                <div className="text-xs font-medium text-text-secondary mb-2">
                  <span className="text-accent mr-1">·</span>Role
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: "worker", label: "Worker", icon: HardHat, desc: "Field data entry" },
                    { key: "admin", label: "Admin", icon: Shield, desc: "Full dashboard" },
                  ] as const).map((opt) => {
                    const active = role === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setRole(opt.key)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition",
                          active
                            ? "border-accent bg-accent-soft text-text-primary"
                            : "border-border-default text-text-secondary hover:border-border-hover",
                        )}
                      >
                        <opt.icon size={18} className={active ? "text-accent" : "text-text-muted"} />
                        <div className="text-xs font-semibold mt-1.5">{opt.label}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{opt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {mode === "signin" && (
            <div className="grid grid-cols-2 gap-2">
              {(["admin", "worker"] as const).map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "h-9 rounded-lg border text-xs font-semibold capitalize transition",
                      active ? "border-accent bg-accent-soft text-text-primary" : "border-border-default text-text-secondary hover:border-border-hover",
                    )}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          )}

          <Field label="Email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@lauls.dev" />
          </Field>
          <Field label="Password" required hint="Mock auth — password is 123 for any account.">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>

          {error && (
            <div className="text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full h-11">
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="mt-5 text-center text-[11px] text-text-muted">
          Demo credentials: any email · password <span className="text-text-secondary font-semibold">123</span>
        </div>
      </div>
    </main>
  );
}
