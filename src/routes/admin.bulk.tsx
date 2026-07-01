import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { Trash2, Download, Upload, Check, Search, Pencil } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { TopBar } from "@/components/top-bar";
import { Button, Input, Select, Badge, SectionLabel } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/bulk")({
  component: BulkOperationsPage,
});

type Tab = "drivers" | "vehicles" | "trips";

// ponytail: one combined template instead of 3 separate ones. Upload once, route by type column.
const ALL_HEADERS = ["type","name","phone","address","aadhar","dlNumber","dlExpiry","vehicles","rcNumber","registrationDate","trailerType","manufacturer","manufactureDate","purchaseDate","batteryHealth","batteryCapacity","vehicleStatus","driverName","vehicleRC","date","origin","destination","distance","cargoWeight","energyConsumed","idlingEnergy","estimatedRange","manHours","tripStatus"];

function makeRow(fill: Record<string, string | number>) {
  return ALL_HEADERS.map((h) => String(fill[h] ?? "")).join(",");
}

const TEMPLATE_ROWS = [
  makeRow({ type: "driver", name: "Rajesh Kumar", phone: "+91 98765 43210", address: "Sector 21 Gurugram", aadhar: "1234 5678 9012", dlNumber: "DL-0420180012345", dlExpiry: "2028-06-12", vehicles: "KA01-EV-1024" }),
  makeRow({ type: "vehicle", rcNumber: "RC-001", registrationDate: "2023-03-15", trailerType: "Refrigerated 20ft", manufacturer: "Tata Motors", manufactureDate: "2023-01-10", purchaseDate: "2023-03-15", batteryHealth: 92, batteryCapacity: 240, vehicleStatus: "active" }),
  makeRow({ type: "trip", driverName: "Rajesh Kumar", vehicleRC: "RC-001", date: "2026-01-15", origin: "Bengaluru Depot", destination: "Hyderabad", distance: 280, cargoWeight: 3500, energyConsumed: 75.2, idlingEnergy: 6.0, estimatedRange: 380, manHours: 5.1, tripStatus: "completed" }),
];

function parseCombinedCSV(text: string) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV must have header + at least 1 row");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  if (!headers.includes("type")) throw new Error("Missing required column: type (driver/vehicle/trip)");
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row: any = {};
    headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });
    return row;
  });
}

function BulkOperationsPage() {
  const [tab, setTab] = useState<Tab>("drivers");
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const importDrivers = useMutation(api.bulk.importDrivers);
  const importVehicles = useMutation(api.bulk.importVehicles);
  const importTrips = useMutation(api.bulk.importTrips);
  const [importPreview, setImportPreview] = useState<{ drivers: any[]; vehicles: any[]; trips: any[] } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: "drivers", label: "Drivers" },
    { key: "vehicles", label: "Vehicles" },
    { key: "trips", label: "Trips" },
  ];

  const downloadTemplate = () => {
    const blob = new Blob([ALL_HEADERS.join(",") + "\n" + TEMPLATE_ROWS.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "fleet-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCombinedCSV(ev.target?.result as string);
        const dRows: any[] = [], vRows: any[] = [], tRows: any[] = [];
        for (const r of rows) {
          const t = (r.type || "").toLowerCase();
          if (t === "driver") {
            dRows.push({ name: r.name || "", phone: r.phone || "", address: r.address || "", aadhar: r.aadhar || "", dlNumber: r.dlnumber || r.dlNumber || "", dlExpiry: r.dlexpiry || r.dlExpiry || "", vehicles: r.vehicles || "" });
          } else if (t === "vehicle") {
            vRows.push({ rcNumber: r.rcnumber || r.rcNumber || "", registrationDate: r.registrationdate || r.registrationDate || "", trailerType: r.trailertype || r.trailerType || "", manufacturer: r.manufacturer || "", manufactureDate: r.manufacturedate || r.manufactureDate || "", purchaseDate: r.purchasedate || r.purchaseDate || "", batteryHealth: Number(r.batteryhealth || r.batteryHealth || 0), batteryCapacity: Number(r.batterycapacity || r.batteryCapacity || 0), status: (r.vehiclestatus || r.status || "active") as "active" | "maintenance" | "inactive" });
          } else if (t === "trip") {
            tRows.push({ driverName: r.drivername || r.driverName || "", vehicleRC: r.vehiclerc || r.vehicleRC || "", date: r.date || "", origin: r.origin || "", destination: r.destination || "", distance: Number(r.distance || 0), cargoWeight: Number(r.cargoweight || r.cargoWeight || 0), energyConsumed: Number(r.energyconsumed || r.energyConsumed || 0), idlingEnergy: Number(r.idlingenergy || r.idlingEnergy || 0), estimatedRange: Number(r.estimatedrange || r.estimatedRange || 0), manHours: Number(r.manhours || r.manHours || 0), status: (r.tripstatus || r.status || "completed") as "planned" | "ongoing" | "completed" });
          }
        }
        setImportPreview({ drivers: dRows, vehicles: vRows, trips: tRows });
      } catch (err: any) { setImportError(err.message); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    if (importPreview.drivers.length > 0) await importDrivers({ rows: importPreview.drivers });
    if (importPreview.vehicles.length > 0) await importVehicles({ rows: importPreview.vehicles });
    if (importPreview.trips.length > 0) {
      const driverMap = new Map(drivers.map((d) => [d.name.toLowerCase(), d._id]));
      const vehicleMap = new Map(vehicles.map((v) => [v.rcNumber.toLowerCase(), v._id]));
      const resolved = importPreview.trips.map((t) => ({ ...t, driverId: driverMap.get(t.driverName.toLowerCase()) ?? "", vehicleId: vehicleMap.get(t.vehicleRC.toLowerCase()) ?? "" }));
      const missing = resolved.filter((t) => !t.driverId || !t.vehicleId);
      if (missing.length > 0) { setImportError(`Cannot find driver/vehicle for ${missing.length} trip(s): ${missing.slice(0, 3).map((m) => `${m.driverName}/${m.vehicleRC}`).join(", ")}`); return; }
      await importTrips({ rows: resolved });
    }
    setImportPreview(null);
  };

  return (
    <>
      <TopBar title="Bulk Operations" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-6 overflow-x-auto border-b border-border-default flex-1">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={cn("py-3 text-xs font-semibold uppercase tracking-wider transition border-b-2", tab === t.key ? "text-text-primary border-accent" : "text-text-muted border-transparent hover:text-text-secondary")}>{t.label}</button>
            ))}
          </div>
          <div className="flex gap-2 ml-4 shrink-0">
            <Button variant="ghost" onClick={downloadTemplate}><Download size={14} /> Template</Button>
            <Button variant="ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import CSV</Button>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        {importError && <div className="text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2">{importError}</div>}

        {importPreview && (
          <div className="card-panel p-5 space-y-4">
            <SectionLabel>Import Preview — {importPreview.drivers.length} drivers, {importPreview.vehicles.length} vehicles, {importPreview.trips.length} trips</SectionLabel>
            <div className="max-h-[300px] overflow-auto text-xs">
              {importPreview.drivers.length > 0 && <div className="mb-2 text-text-muted font-medium">Drivers: {importPreview.drivers.map((r) => r.name).join(", ")}</div>}
              {importPreview.vehicles.length > 0 && <div className="mb-2 text-text-muted font-medium">Vehicles: {importPreview.vehicles.map((r) => r.rcNumber).join(", ")}</div>}
              {importPreview.trips.length > 0 && <div className="mb-2 text-text-muted font-medium">Trips: {importPreview.trips.map((r) => `${r.driverName} (${r.date})`).join(", ")}</div>}
            </div>
            <div className="flex gap-2">
              <Button onClick={confirmImport}><Check size={14} /> Confirm import</Button>
              <Button variant="ghost" onClick={() => setImportPreview(null)}>Cancel</Button>
            </div>
          </div>
        )}

        {tab === "drivers" && <DriversBulk />}
        {tab === "vehicles" && <VehiclesBulk />}
        {tab === "trips" && <TripsBulk />}
      </div>
    </>
  );
}

function DriversBulk() {
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const deleteDrivers = useMutation(api.bulk.removeDrivers);
  const updateDriver = useMutation(api.drivers.update);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "", aadhar: "", dlNumber: "", dlExpiry: "", vehicles: "" });

  const filtered = drivers.filter((d) =>
    `${d.name} ${d.phone} ${d.aadhar}`.toLowerCase().includes(q.toLowerCase())
  );

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((d) => d._id)));
  };

  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    await deleteDrivers({ ids: Array.from(selected) as any });
    setSelected(new Set());
    setConfirmDel(false);
  };

  const startEdit = (d: Doc<"drivers">) => {
    setEditingId(d._id);
    setEditForm({ name: d.name, phone: d.phone, address: d.address, aadhar: d.aadhar, dlNumber: d.dlNumber, dlExpiry: d.dlExpiry, vehicles: d.vehicles.join(", ") });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateDriver({ id: editingId as any, ...editForm, vehicles: editForm.vehicles.split(",").map((v) => v.trim()).filter(Boolean) });
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drivers…" className="pl-9" />
          </div>
          {selected.size > 0 && <span className="text-xs text-accent">{selected.size} selected</span>}
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            confirmDel ? (
              <div className="flex items-center gap-2 bg-status-red-bg border border-status-red-border rounded-lg px-3">
                <span className="text-xs text-status-red">Delete {selected.size}?</span>
                <button onClick={handleDelete} className="text-xs font-semibold text-status-red px-2">Yes</button>
                <button onClick={() => setConfirmDel(false)} className="text-xs text-text-muted px-2">No</button>
              </div>
            ) : (
              <Button variant="destructive" onClick={() => setConfirmDel(true)}><Trash2 size={14} /> Delete selected</Button>
            )
          )}
        </div>
      </div>

      <div className="card-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-accent"
                />
              </th>
              {["Name", "Phone", "Aadhar", "DL Expiry", "Vehicles", ""].map((h) => (
                <th key={h} className="text-left section-label px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-sm text-text-muted py-12">No drivers.</td></tr>
            )}
            {filtered.map((d) => {
              const isEditing = editingId === d._id;
              return (
                <tr key={d._id} className="border-b border-border-default hover:bg-bg-2 transition">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(d._id)} onChange={() => toggle(d._id)} className="accent-accent" />
                  </td>
                  {isEditing ? (
                    <>
                      <td className="px-3 py-1"><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1"><Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1"><Input value={editForm.aadhar} onChange={(e) => setEditForm({ ...editForm, aadhar: e.target.value })} className="h-8 text-[13px] font-mono" /></td>
                      <td className="px-3 py-1"><Input value={editForm.dlExpiry} onChange={(e) => setEditForm({ ...editForm, dlExpiry: e.target.value })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1"><Input value={editForm.vehicles} onChange={(e) => setEditForm({ ...editForm, vehicles: e.target.value })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-2 flex gap-1">
                        <Button onClick={saveEdit} className="h-8 px-2 text-[11px]"><Check size={12} /></Button>
                        <Button variant="ghost" onClick={() => setEditingId(null)} className="h-8 px-2 text-[11px]">Cancel</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary font-medium">{d.name}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{d.phone}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary font-mono">{d.aadhar}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary">{d.dlExpiry}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary">{d.vehicles.length}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => startEdit(d)} className="text-text-muted hover:text-accent transition p-1 rounded-md hover:bg-accent-soft">
                          <Pencil size={13} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VehiclesBulk() {
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const deleteVehicles = useMutation(api.bulk.removeVehicles);
  const updateVehicle = useMutation(api.vehicles.update);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rcNumber: "", registrationDate: "", trailerType: "", manufacturer: "", manufactureDate: "", purchaseDate: "", batteryHealth: 0, batteryCapacity: 0, status: "active" as "active" | "maintenance" | "inactive" });

  const filtered = vehicles.filter((v) =>
    `${v.rcNumber} ${v.manufacturer} ${v.trailerType}`.toLowerCase().includes(q.toLowerCase())
  );

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((v) => v._id)));
  };

  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const handleDelete = async () => {
    await deleteVehicles({ ids: Array.from(selected) as any });
    setSelected(new Set());
    setConfirmDel(false);
  };

  const startEdit = (v: Doc<"vehicles">) => {
    setEditingId(v._id);
    setEditForm({ rcNumber: v.rcNumber, registrationDate: v.registrationDate, trailerType: v.trailerType, manufacturer: v.manufacturer, manufactureDate: v.manufactureDate, purchaseDate: v.purchaseDate, batteryHealth: v.batteryHealth, batteryCapacity: v.batteryCapacity, status: v.status });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateVehicle({ id: editingId as any, ...editForm });
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vehicles…" className="pl-9" />
          </div>
          {selected.size > 0 && <span className="text-xs text-accent">{selected.size} selected</span>}
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            confirmDel ? (
              <div className="flex items-center gap-2 bg-status-red-bg border border-status-red-border rounded-lg px-3">
                <span className="text-xs text-status-red">Delete {selected.size}?</span>
                <button onClick={handleDelete} className="text-xs font-semibold text-status-red px-2">Yes</button>
                <button onClick={() => setConfirmDel(false)} className="text-xs text-text-muted px-2">No</button>
              </div>
            ) : (
              <Button variant="destructive" onClick={() => setConfirmDel(true)}><Trash2 size={14} /> Delete selected</Button>
            )
          )}
        </div>
      </div>

      <div className="card-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-accent" />
              </th>
              {["RC Number", "Manufacturer", "Trailer", "Battery", "Status", ""].map((h) => (
                <th key={h} className="text-left section-label px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-sm text-text-muted py-12">No vehicles.</td></tr>
            )}
            {filtered.map((v) => {
              const isEditing = editingId === v._id;
              return (
                <tr key={v._id} className="border-b border-border-default hover:bg-bg-2 transition">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(v._id)} onChange={() => toggle(v._id)} className="accent-accent" />
                  </td>
                  {isEditing ? (
                    <>
                      <td className="px-3 py-1"><Input value={editForm.rcNumber} onChange={(e) => setEditForm({ ...editForm, rcNumber: e.target.value })} className="h-8 text-[13px] font-mono" /></td>
                      <td className="px-3 py-1"><Input value={editForm.manufacturer} onChange={(e) => setEditForm({ ...editForm, manufacturer: e.target.value })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1"><Input value={editForm.trailerType} onChange={(e) => setEditForm({ ...editForm, trailerType: e.target.value })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1"><Input type="number" value={editForm.batteryHealth} onChange={(e) => setEditForm({ ...editForm, batteryHealth: Number(e.target.value) })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1">
                        <Select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as typeof editForm.status })} className="h-8 text-[13px]">
                          <option value="active">active</option>
                          <option value="maintenance">maintenance</option>
                          <option value="inactive">inactive</option>
                        </Select>
                      </td>
                      <td className="px-3 py-2 flex gap-1">
                        <Button onClick={saveEdit} className="h-8 px-2 text-[11px]"><Check size={12} /></Button>
                        <Button variant="ghost" onClick={() => setEditingId(null)} className="h-8 px-2 text-[11px]">Cancel</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono">{v.rcNumber}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary">{v.manufacturer}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary">{v.trailerType}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{v.batteryHealth}%</td>
                      <td className="px-4 py-3.5"><Badge variant={v.status === "active" ? "green" : v.status === "maintenance" ? "amber" : "red"}>{v.status}</Badge></td>
                      <td className="px-4 py-2">
                        <button onClick={() => startEdit(v)} className="text-text-muted hover:text-accent transition p-1 rounded-md hover:bg-accent-soft">
                          <Pencil size={13} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TripsBulk() {
  const trips: Doc<"trips">[] = useQuery(api.trips.list) ?? [];
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const deleteTrips = useMutation(api.bulk.removeTrips);
  const updateTrip = useMutation(api.trips.update);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ date: "", origin: "", destination: "", distance: 0, energyConsumed: 0, status: "completed" as "planned" | "ongoing" | "completed" });

  const filtered = trips.filter((t) =>
    `${t.origin} ${t.destination}`.toLowerCase().includes(q.toLowerCase())
  );

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((t) => t._id)));
  };

  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const handleDelete = async () => {
    await deleteTrips({ ids: Array.from(selected) as any });
    setSelected(new Set());
    setConfirmDel(false);
  };

  const startEdit = (t: Doc<"trips">) => {
    setEditingId(t._id);
    setEditForm({ date: t.date, origin: t.origin, destination: t.destination, distance: t.distance, energyConsumed: t.energyConsumed, status: t.status });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateTrip({ id: editingId as any, ...editForm });
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trips…" className="pl-9" />
          </div>
          {selected.size > 0 && <span className="text-xs text-accent">{selected.size} selected</span>}
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            confirmDel ? (
              <div className="flex items-center gap-2 bg-status-red-bg border border-status-red-border rounded-lg px-3">
                <span className="text-xs text-status-red">Delete {selected.size}?</span>
                <button onClick={handleDelete} className="text-xs font-semibold text-status-red px-2">Yes</button>
                <button onClick={() => setConfirmDel(false)} className="text-xs text-text-muted px-2">No</button>
              </div>
            ) : (
              <Button variant="destructive" onClick={() => setConfirmDel(true)}><Trash2 size={14} /> Delete selected</Button>
            )
          )}
        </div>
      </div>

      <div className="card-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-accent" />
              </th>
              {["Date", "Driver", "Vehicle", "Route", "Distance", "Energy", "Status", ""].map((h) => (
                <th key={h} className="text-left section-label px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-sm text-text-muted py-12">No trips.</td></tr>
            )}
            {filtered.map((t) => {
              const d = drivers.find((x) => x._id === t.driverId);
              const v = vehicles.find((x) => x._id === t.vehicleId);
              const isEditing = editingId === t._id;
              return (
                <tr key={t._id} className="border-b border-border-default hover:bg-bg-2 transition">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(t._id)} onChange={() => toggle(t._id)} className="accent-accent" />
                  </td>
                  {isEditing ? (
                    <>
                      <td className="px-3 py-1"><Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1" colSpan={2}><div className="flex gap-1"><Input value={editForm.origin} onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })} className="h-8 text-[13px]" placeholder="From" /><Input value={editForm.destination} onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })} className="h-8 text-[13px]" placeholder="To" /></div></td>
                      <td className="px-3 py-1"><Input type="number" value={editForm.distance} onChange={(e) => setEditForm({ ...editForm, distance: Number(e.target.value) })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1"><Input type="number" value={editForm.energyConsumed} onChange={(e) => setEditForm({ ...editForm, energyConsumed: Number(e.target.value) })} className="h-8 text-[13px]" /></td>
                      <td className="px-3 py-1">
                        <Select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as typeof editForm.status })} className="h-8 text-[13px]">
                          <option value="completed">completed</option>
                          <option value="ongoing">ongoing</option>
                          <option value="planned">planned</option>
                        </Select>
                      </td>
                      <td className="px-3 py-2 flex gap-1">
                        <Button onClick={saveEdit} className="h-8 px-2 text-[11px]"><Check size={12} /></Button>
                        <Button variant="ghost" onClick={() => setEditingId(null)} className="h-8 px-2 text-[11px]">Cancel</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{t.date}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary">{d?.name ?? "—"}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono text-xs">{v?.rcNumber ?? "—"}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-secondary">{t.origin} → {t.destination}</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.distance} km</td>
                      <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.energyConsumed} kWh</td>
                      <td className="px-4 py-3.5"><Badge variant={t.status === "completed" ? "green" : t.status === "ongoing" ? "amber" : "blue"}>{t.status}</Badge></td>
                      <td className="px-4 py-2">
                        <button onClick={() => startEdit(t)} className="text-text-muted hover:text-accent transition p-1 rounded-md hover:bg-accent-soft">
                          <Pencil size={13} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
