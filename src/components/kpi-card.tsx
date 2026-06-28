import { type ReactNode } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({ icon, label, value, trend, sparkline, accent = "indigo" }: {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: { value: number; positive: boolean };
  sparkline?: number[];
  accent?: "indigo" | "green" | "amber" | "red" | "blue";
}) {
  const accentColors: Record<string, { text: string; line: string }> = {
    indigo: { text: "text-accent", line: "#6366F1" },
    green: { text: "text-status-green", line: "#10B981" },
    amber: { text: "text-status-amber", line: "#F59E0B" },
    red: { text: "text-status-red", line: "#EF4444" },
    blue: { text: "text-status-blue", line: "#3B82F6" },
  };
  const sparkData = (sparkline ?? []).map((v, i) => ({ i, v }));

  return (
    <div className="card-panel p-5 border-l-2 border-l-accent hover:border-border-hover transition group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-8 h-8 rounded-lg bg-accent-soft inline-flex items-center justify-center", accentColors[accent].text)}>
          {icon}
        </div>
        <div className="text-xs text-text-muted">{label}</div>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="text-[32px] leading-none font-bold text-text-primary tabular-nums">{value}</div>
      </div>
      <div className="mt-3 h-5">
        {sparkData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="v" stroke={accentColors[accent].line} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </div>
      {trend && (
        <div className={cn("mt-2 inline-flex items-center gap-1 text-[11px] font-semibold", trend.positive ? "text-status-green" : "text-status-red")}>
          {trend.positive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {Math.abs(trend.value)}% vs last period
        </div>
      )}
    </div>
  );
}
