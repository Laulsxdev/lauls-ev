import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { TopBar } from "@/components/top-bar";
import { SlideOver } from "@/components/slide-over";
import { Button, Input, Select, Field, Badge } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/trips")({
  component: TripsPage,
});

type TripStatus = "planned" | "ongoing" | "completed";

function tripBadge(s: TripStatus) {
  if (s === "completed") return <Badge variant="green">Completed</Badge>;
  if (s === "ongoing") return <Badge variant="amber">Ongoing</Badge>;
  return <Badge variant="blue">Planned</Badge>;
}

function TripsPage() {
  const trips: Doc<"trips">[] = useQuery(api.trips.list) ?? [];
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const deleteTrip = useMutation(api.trips.remove);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const filtered = useMemo(() => trips.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (driverFilter !== "all" && t.driverId !== driverFilter) return false;
    return `${t.origin} ${t.destination}`.toLowerCase().includes(q.toLowerCase());
  }), [trips, q, statusFilter, driverFilter]);

  return (
    <>
      <TopBar title="Trips" />
      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-[260px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search route…" className="pl-9" />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[160px]">
              <option value="all">All statuses</option>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </Select>
            <Select value={driverFilter} onChange={(e) => setDriverFilter(e.target.value)} className="w-[180px]">
              <option value="all">All drivers</option>
              {drivers.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Select>
          </div>
          <Button onClick={() => setEditing("new")}><Plus size={14} /> Add trip</Button>
        </div>

        <div className="card-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                {["Date", "Driver", "Vehicle", "Route", "Distance", "Energy", "kWh/km", "Status", ""].map((h) => (
                  <th key={h} className="text-left section-label px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center text-sm text-text-muted py-12">No trips found.</td></tr>
              )}
              {filtered.map((t) => {
                const d = drivers.find((x) => x._id === t.driverId);
                const v = vehicles.find((x) => x._id === t.vehicleId);
                return (
                  <tr key={t._id} className="group border-b border-border-default hover:bg-bg-2 transition">
                    <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{t.date}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-primary">{d?.name ?? "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono text-xs">{v?.rcNumber ?? "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-secondary">{t.origin} → {t.destination}</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.distance} km</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.energyConsumed} kWh</td>
                    <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{t.avgConsumption}</td>
                    <td className="px-4 py-3.5">{tripBadge(t.status)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => setEditing(t)} className="w-8 h-8 rounded-md text-text-secondary hover:bg-bg-3 hover:text-text-primary inline-flex items-center justify-center"><Edit2 size={14} /></button>
                        {confirmDel === t._id ? (
                          <div className="inline-flex items-center gap-1.5 bg-status-red-bg border border-status-red-border rounded-md px-2 h-8">
                            <span className="text-[11px] text-status-red">Delete?</span>
                            <button onClick={() => { deleteTrip({ id: t._id }); setConfirmDel(null); }} className="text-[11px] font-semibold text-status-red px-1.5">Yes</button>
                            <button onClick={() => setConfirmDel(null)} className="text-[11px] text-text-muted px-1.5">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDel(t._id)} className="w-8 h-8 rounded-md text-text-secondary hover:bg-status-red-bg hover:text-status-red inline-flex items-center justify-center"><Trash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <TripFormPanel
        open={editing !== null}
        onClose={() => setEditing(null)}
        trip={editing === "new" ? null : editing}
      />
    </>
  );
}

function TripFormPanel({ open, onClose, trip }: { open: boolean; onClose: () => void; trip: any | null }) {
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const createTrip = useMutation(api.trips.create);
  const updateTrip = useMutation(api.trips.update);
  const [driverId, setDriverId] = useState(trip?.driverId ?? drivers[0]?._id ?? "");
  const [vehicleId, setVehicleId] = useState(trip?.vehicleId ?? vehicles[0]?._id ?? "");
  const [date, setDate] = useState(trip?.date ?? new Date().toISOString().slice(0, 10));
  const [origin, setOrigin] = useState(trip?.origin ?? "");
  const [destination, setDestination] = useState(trip?.destination ?? "");
  const [distance, setDistance] = useState(String(trip?.distance ?? ""));
  const [cargoWeight, setW] = useState(String(trip?.cargoWeight ?? ""));
  const [energyConsumed, setE] = useState(String(trip?.energyConsumed ?? ""));
  const [status, setStatus] = useState<TripStatus>(trip?.status ?? "completed");

  useMemo(() => {
    setDriverId(trip?.driverId ?? drivers[0]?._id ?? "");
    setVehicleId(trip?.vehicleId ?? vehicles[0]?._id ?? "");
    setDate(trip?.date ?? new Date().toISOString().slice(0, 10));
    setOrigin(trip?.origin ?? ""); setDestination(trip?.destination ?? "");
    setDistance(String(trip?.distance ?? "")); setW(String(trip?.cargoWeight ?? ""));
    setE(String(trip?.energyConsumed ?? "")); setStatus(trip?.status ?? "completed");
  }, [trip?._id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      driverId, vehicleId, date, origin, destination,
      distance: Number(distance) || 0,
      cargoWeight: Number(cargoWeight) || 0,
      energyConsumed: Number(energyConsumed) || 0,
      idlingEnergy: trip?.idlingEnergy ?? 0,
      estimatedRange: trip?.estimatedRange ?? 0,
      manHours: trip?.manHours ?? 0,
      status,
    };
    if (trip) await updateTrip({ id: trip._id, ...payload });
    else await createTrip(payload);
    onClose();
  };

  return (
    <SlideOver open={open} onClose={onClose} title={trip ? "Edit trip" : "Add trip"}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Driver" required>
            <Select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
              {drivers.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Select>
          </Field>
          <Field label="Vehicle" required>
            <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              {vehicles.map((v) => <option key={v._id} value={v._id}>{v.rcNumber}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Date" required><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Origin" required><Input value={origin} onChange={(e) => setOrigin(e.target.value)} required /></Field>
          <Field label="Destination" required><Input value={destination} onChange={(e) => setDestination(e.target.value)} required /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Distance (km)"><Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} /></Field>
          <Field label="Weight (kg)"><Input type="number" value={cargoWeight} onChange={(e) => setW(e.target.value)} /></Field>
          <Field label="Energy (kWh)"><Input type="number" value={energyConsumed} onChange={(e) => setE(e.target.value)} /></Field>
        </div>
        <Field label="Status" required>
          <Select value={status} onChange={(e) => setStatus(e.target.value as TripStatus)}>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1">{trip ? "Save changes" : "Create trip"}</Button>
        </div>
      </form>
    </SlideOver>
  );
}
