import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { TopBar } from "@/components/top-bar";
import { Input, Select, Badge } from "@/components/ui-kit";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/geofence")({
  component: GeofencePage,
});

function GeofencePage() {
  const logs: Doc<"geofenceLogs">[] = useQuery(api.geofenceLogs.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const trips: Doc<"trips">[] = useQuery(api.trips.list) ?? [];
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => logs.filter((g) => {
    if (filter === "breached" && !g.breached) return false;
    if (filter === "idle" && !g.idleActive) return false;
    const t = trips.find((x) => x._id === g.tripId);
    const v = vehicles.find((x) => x._id === g.vehicleId);
    const search = `${t?.origin ?? ""} ${t?.destination ?? ""} ${v?.rcNumber ?? ""}`.toLowerCase();
    return search.includes(q.toLowerCase());
  }), [logs, q, filter, trips, vehicles]);

  return (
    <>
      <TopBar title="Geofence Logs" />
      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[280px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trips, vehicles…" className="pl-9" />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-[180px]">
            <option value="all">All logs</option>
            <option value="breached">Breached only</option>
            <option value="idle">Currently idle</option>
          </Select>
        </div>

        <div className="card-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                {["Vehicle", "Trip", "Start", "End", "Idle (min)", "Idle state", "Geofence", ""].map((h) => (
                  <th key={h} className="text-left section-label px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-sm text-text-muted py-12">No geofence logs.</td></tr>
              )}
              {filtered.map((g) => {
                const v = vehicles.find((x) => x._id === g.vehicleId);
                const t = trips.find((x) => x._id === g.tripId);
                return (
                  <tr key={g._id} className="border-b border-border-default hover:bg-bg-2 transition">
                    <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono text-xs">{v?.rcNumber ?? "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-secondary">{t ? `${t.origin} → ${t.destination}` : "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{g.tripStart ? format(new Date(g.tripStart), "dd MMM HH:mm") : "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{g.tripEnd ? format(new Date(g.tripEnd), "dd MMM HH:mm") : "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{g.idleMinutes}</td>
                    <td className="px-4 py-3.5">
                      {g.idleActive ? <Badge variant="amber">Idle now</Badge> : <Badge variant="muted">Moving</Badge>}
                    </td>
                    <td className="px-4 py-3.5">
                      {g.breached ? <Badge variant="red">Breached</Badge> : <Badge variant="green">Within</Badge>}
                    </td>
                    <td />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
