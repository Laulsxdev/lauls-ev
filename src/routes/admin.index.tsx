import { createFileRoute } from "@tanstack/react-router";
import { Truck, Users, Route as RouteIcon, Battery, Zap, AlertOctagon } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { TopBar } from "@/components/top-bar";
import { KpiCard } from "@/components/kpi-card";
import { Badge, SectionLabel } from "@/components/ui-kit";
import { getFleetStats, useStore } from "@/lib/mock-store";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const tooltipStyle = {
  background: "#141428",
  border: "1px solid rgba(99, 102, 241, 0.12)",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 12,
};

function Dashboard() {
  const trips = useStore((s) => s.trips);
  const vehicles = useStore((s) => s.vehicles);
  const drivers = useStore((s) => s.drivers);
  const stats = getFleetStats();

  // Build a 7-day series from trips
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    const dayTrips = trips.filter((t) => t.date === ds);
    return {
      day: format(d, "EEE"),
      distance: dayTrips.reduce((a, t) => a + t.distance, 0),
      energy: +dayTrips.reduce((a, t) => a + t.energyConsumed, 0).toFixed(1),
    };
  });

  const vehicleEnergy = vehicles.map((v) => ({
    name: v.rcNumber.split("-").slice(-1)[0],
    energy: +trips.filter((t) => t.vehicleId === v.id).reduce((a, t) => a + t.energyConsumed, 0).toFixed(1),
  }));

  const driverTrips = drivers.map((d) => ({
    name: d.name.split(" ")[0],
    trips: trips.filter((t) => t.driverId === d.id).length,
  })).sort((a, b) => b.trips - a.trips).slice(0, 5);

  const statusBreakdown = [
    { name: "Active", value: vehicles.filter((v) => v.status === "active").length, color: "#10B981" },
    { name: "Maintenance", value: vehicles.filter((v) => v.status === "maintenance").length, color: "#F59E0B" },
    { name: "Inactive", value: vehicles.filter((v) => v.status === "inactive").length, color: "#EF4444" },
  ].filter((s) => s.value > 0);

  const recent = [...trips].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  const spark = (key: "distance" | "energy") => days.map((d) => d[key]);

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard icon={<Truck size={16} />} label="Active vehicles" value={`${stats.activeVehicles}/${stats.totalVehicles}`} trend={{ value: 4.2, positive: true }} sparkline={[3, 4, 4, 5, 5, 4, 5]} />
          <KpiCard icon={<Users size={16} />} label="Drivers on roster" value={String(stats.totalDrivers)} trend={{ value: 8.1, positive: true }} sparkline={[2, 2, 3, 3, 4, 4, 4]} />
          <KpiCard icon={<RouteIcon size={16} />} label="Trips logged" value={String(stats.totalTrips)} trend={{ value: 12.3, positive: true }} sparkline={spark("distance")} />
          <KpiCard icon={<Zap size={16} />} label="Energy consumed" value={`${stats.totalEnergy.toLocaleString()} kWh`} trend={{ value: 3.4, positive: false }} sparkline={spark("energy")} accent="amber" />
          <KpiCard icon={<Battery size={16} />} label="Avg battery health" value={`${stats.avgBatteryHealth}%`} trend={{ value: 1.1, positive: false }} sparkline={[88, 87, 86, 85, 85, 84, stats.avgBatteryHealth]} accent="green" />
          <KpiCard icon={<AlertOctagon size={16} />} label="Geofence breaches" value={String(stats.geofenceBreaches)} trend={{ value: 18.0, positive: false }} sparkline={[0, 1, 1, 2, 1, 2, stats.geofenceBreaches]} accent="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Energy · last 7 days</SectionLabel>
              <span className="text-xs text-text-muted tabular-nums">{days.reduce((a, d) => a + d.energy, 0).toFixed(1)} kWh</span>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer>
                <AreaChart data={days} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1A1A33" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#F1F5F9" }} />
                  <Area type="monotone" dataKey="energy" stroke="#6366F1" strokeWidth={2} fill="url(#energyFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Distance · last 7 days</SectionLabel>
              <span className="text-xs text-text-muted tabular-nums">{days.reduce((a, d) => a + d.distance, 0).toFixed(0)} km</span>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer>
                <BarChart data={days} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#1A1A33" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "rgba(99,102,241,0.05)" }} contentStyle={tooltipStyle} labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#F1F5F9" }} />
                  <Bar dataKey="distance" fill="#6366F1" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="card-panel p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Top drivers · trips logged</SectionLabel>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <BarChart data={driverTrips} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#1A1A33" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} width={80} />
                  <Tooltip cursor={{ fill: "rgba(99,102,241,0.05)" }} contentStyle={tooltipStyle} labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#F1F5F9" }} />
                  <Bar dataKey="trips" fill="#6366F1" radius={[0, 4, 4, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-panel p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Fleet status</SectionLabel>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" innerRadius="60%" outerRadius="90%" paddingAngle={3} stroke="none">
                    {statusBreakdown.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#F1F5F9" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {statusBreakdown.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
                  <span className="text-[11px] text-text-muted">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Recent activity</SectionLabel>
            <span className="text-xs text-text-muted">Last 10 trips</span>
          </div>
          <div className="card-panel overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default">
                  {["Date", "Driver", "Vehicle", "Route", "Distance", "Energy", "Status"].map((h) => (
                    <th key={h} className="text-left section-label px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-sm text-text-muted py-10">No trips yet.</td></tr>
                )}
                {recent.map((t) => {
                  const d = drivers.find((x) => x.id === t.driverId);
                  const v = vehicles.find((x) => x.id === t.vehicleId);
                  return (
                    <tr key={t.id} className="border-b border-border-default hover:bg-bg-2 transition">
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{t.date}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary">{d?.name ?? "—"}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono text-xs">{v?.rcNumber ?? "—"}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary">{t.origin} → {t.destination}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.distance} km</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.energyConsumed} kWh</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={t.status === "completed" ? "green" : t.status === "ongoing" ? "amber" : "blue"}>
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
