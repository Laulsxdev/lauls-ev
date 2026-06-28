import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { SlideOver } from "@/components/slide-over";
import { Button, Input, Select, Field, Badge, BatteryBar } from "@/components/ui-kit";
import {
  createVehicle, deleteVehicle, updateVehicle, useStore,
  type Vehicle,
} from "@/lib/mock-store";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/vehicles")({
  component: VehiclesPage,
});

function statusBadge(s: Vehicle["status"]) {
  if (s === "active") return <Badge variant="green">Active</Badge>;
  if (s === "maintenance") return <Badge variant="amber">Maintenance</Badge>;
  return <Badge variant="red">Inactive</Badge>;
}

function VehiclesPage() {
  const vehicles = useStore((s) => s.vehicles);
  const trips = useStore((s) => s.trips);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Vehicle | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const lastTrip = (vid: string) => {
    const ts = trips.filter((t) => t.vehicleId === vid).sort((a, b) => (b.date > a.date ? 1 : -1));
    return ts[0]?.date;
  };

  const filtered = useMemo(() => vehicles.filter((v) => {
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    return `${v.rcNumber} ${v.manufacturer} ${v.trailerType}`.toLowerCase().includes(q.toLowerCase());
  }), [vehicles, q, statusFilter]);

  return (
    <>
      <TopBar title="Vehicles" />
      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-[280px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search RC, manufacturer…" className="pl-9" />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[180px]">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          <Button onClick={() => setEditing("new")}><Plus size={14} /> Add vehicle</Button>
        </div>

        <div className="card-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                {["RC number", "Manufacturer", "Trailer", "Battery", "Status", "Last trip", ""].map((h) => (
                  <th key={h} className="text-left section-label px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-sm text-text-muted py-12">No vehicles found.</td></tr>
              )}
              {filtered.map((v) => (
                <tr key={v.id} className="group border-b border-border-default hover:bg-bg-2 transition">
                  <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono">{v.rcNumber}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary">{v.manufacturer}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary">{v.trailerType}</td>
                  <td className="px-4 py-3.5"><BatteryBar value={v.batteryHealth} /></td>
                  <td className="px-4 py-3.5">{statusBadge(v.status)}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{lastTrip(v.id) ?? "—"}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setEditing(v)} className="w-8 h-8 rounded-md text-text-secondary hover:bg-bg-3 hover:text-text-primary inline-flex items-center justify-center"><Edit2 size={14} /></button>
                      {confirmDel === v.id ? (
                        <div className="inline-flex items-center gap-1.5 bg-status-red-bg border border-status-red-border rounded-md px-2 h-8">
                          <span className="text-[11px] text-status-red">Delete?</span>
                          <button onClick={() => { deleteVehicle(v.id); setConfirmDel(null); }} className="text-[11px] font-semibold text-status-red px-1.5">Yes</button>
                          <button onClick={() => setConfirmDel(null)} className="text-[11px] text-text-muted px-1.5">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDel(v.id)} className="w-8 h-8 rounded-md text-text-secondary hover:bg-status-red-bg hover:text-status-red inline-flex items-center justify-center"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleFormPanel
        open={editing !== null}
        onClose={() => setEditing(null)}
        vehicle={editing === "new" ? null : editing}
      />
    </>
  );
}

function VehicleFormPanel({ open, onClose, vehicle }: { open: boolean; onClose: () => void; vehicle: Vehicle | null }) {
  const [rcNumber, setRc] = useState(vehicle?.rcNumber ?? "");
  const [registrationDate, setReg] = useState(vehicle?.registrationDate ?? "");
  const [trailerType, setTr] = useState(vehicle?.trailerType ?? "");
  const [manufacturer, setMf] = useState(vehicle?.manufacturer ?? "");
  const [manufactureDate, setMfd] = useState(vehicle?.manufactureDate ?? "");
  const [purchaseDate, setPd] = useState(vehicle?.purchaseDate ?? "");
  const [batteryHealth, setBh] = useState(String(vehicle?.batteryHealth ?? 95));
  const [batteryCapacity, setBc] = useState(String(vehicle?.batteryCapacity ?? 240));
  const [status, setStatus] = useState<Vehicle["status"]>(vehicle?.status ?? "active");

  useMemo(() => {
    setRc(vehicle?.rcNumber ?? ""); setReg(vehicle?.registrationDate ?? "");
    setTr(vehicle?.trailerType ?? ""); setMf(vehicle?.manufacturer ?? "");
    setMfd(vehicle?.manufactureDate ?? ""); setPd(vehicle?.purchaseDate ?? "");
    setBh(String(vehicle?.batteryHealth ?? 95)); setBc(String(vehicle?.batteryCapacity ?? 240));
    setStatus(vehicle?.status ?? "active");
  }, [vehicle?.id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      rcNumber, registrationDate, trailerType, manufacturer, manufactureDate, purchaseDate,
      batteryHealth: Number(batteryHealth), batteryCapacity: Number(batteryCapacity),
      status, soc: vehicle?.soc ?? null, soh: vehicle?.soh ?? null,
    };
    if (vehicle) updateVehicle(vehicle.id, payload);
    else createVehicle(payload);
    onClose();
  };

  return (
    <SlideOver open={open} onClose={onClose} title={vehicle ? "Edit vehicle" : "Add vehicle"}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="RC number" required><Input value={rcNumber} onChange={(e) => setRc(e.target.value)} required /></Field>
          <Field label="Registration date" required><Input type="date" value={registrationDate} onChange={(e) => setReg(e.target.value)} required /></Field>
        </div>
        <Field label="Trailer type" required><Input value={trailerType} onChange={(e) => setTr(e.target.value)} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Manufacturer" required><Input value={manufacturer} onChange={(e) => setMf(e.target.value)} required /></Field>
          <Field label="Manufacture date"><Input type="date" value={manufactureDate} onChange={(e) => setMfd(e.target.value)} /></Field>
        </div>
        <Field label="Purchase date"><Input type="date" value={purchaseDate} onChange={(e) => setPd(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Battery health (%)" required><Input type="number" min={0} max={100} value={batteryHealth} onChange={(e) => setBh(e.target.value)} required /></Field>
          <Field label="Battery capacity (kWh)" required><Input type="number" min={0} value={batteryCapacity} onChange={(e) => setBc(e.target.value)} required /></Field>
        </div>
        <Field label="Status" required>
          <Select value={status} onChange={(e) => setStatus(e.target.value as Vehicle["status"])}>
            <option value="active">Active</option>
            <option value="maintenance">Under maintenance</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Field>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1">{vehicle ? "Save changes" : "Create vehicle"}</Button>
        </div>
      </form>
    </SlideOver>
  );
}
