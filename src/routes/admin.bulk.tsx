import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { Trash2, Download, Upload, FileSpreadsheet, Check, Search } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { TopBar } from "@/components/top-bar";
import { Button, Input, Select, Field, Badge, SectionLabel } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/bulk")({
  component: BulkOperationsPage,
});

type Tab = "drivers" | "vehicles" | "trips";

function BulkOperationsPage() {
  const [tab, setTab] = useState<Tab>("drivers");
  const tabs: { key: Tab; label: string }[] = [
    { key: "drivers", label: "Drivers" },
    { key: "vehicles", label: "Vehicles" },
    { key: "trips", label: "Trips" },
  ];

  return (
    <>
      <TopBar title="Bulk Operations" />
      <div className="p-6 space-y-5">
        <div className="border-b border-border-default">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "py-3 text-xs font-semibold uppercase tracking-wider transition border-b-2",
                  tab === t.key ? "text-text-primary border-accent" : "text-text-muted border-transparent hover:text-text-secondary",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

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
  const importDrivers = useMutation(api.bulk.importDrivers);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [importPreview, setImportPreview] = useState<any[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const downloadTemplate = () => {
    const headers = "name,phone,address,aadhar,dlNumber,dlExpiry,vehicles";
    const example = "Rajesh Kumar,+91 98765 43210,Sector 21 Gurugram,1234 5678 9012,DL-0420180012345,2028-06-12,KA01-EV-1024, KA01-EV-2048";
    const blob = new Blob([headers + "\n" + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "drivers-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (drivers.length === 0) return;
    const headers = "name,phone,address,aadhar,dlNumber,dlExpiry,vehicles";
    const rows = drivers.map((d) =>
      [d.name, d.phone, d.address, d.aadhar, d.dlNumber, d.dlExpiry, d.vehicles.join(", ")].join(",")
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "drivers-export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have header + at least 1 row");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const required = ["name", "phone", "aadhar", "dlnumber"];
    for (const r of required) {
      if (!headers.includes(r)) throw new Error(`Missing required column: ${r}`);
    }
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const row: any = {};
      headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });
      return {
        name: row.name || "",
        phone: row.phone || "",
        address: row.address || "",
        aadhar: row.aadhar || "",
        dlNumber: row.dlnumber || row.dlNumber || "",
        dlExpiry: row.dlexpiry || row.dlExpiry || "",
        vehicles: row.vehicles || "",
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCSV(ev.target?.result as string);
        setImportPreview(rows);
      } catch (err: any) {
        setImportError(err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    await importDrivers({ rows: importPreview });
    setImportPreview(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drivers…" className="pl-9" />
          </div>
          {selected.size > 0 && (
            <span className="text-xs text-accent">{selected.size} selected</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={downloadTemplate}><Download size={14} /> Template</Button>
          <Button variant="ghost" onClick={downloadAll}><FileSpreadsheet size={14} /> Export all</Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import CSV</Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
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

      {importError && (
        <div className="text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2">{importError}</div>
      )}

      {importPreview && (
        <div className="card-panel p-5 space-y-4">
          <SectionLabel>Import Preview — {importPreview.length} rows</SectionLabel>
          <div className="max-h-[300px] overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border-default">
                {["#", "Name", "Phone", "Aadhar", "DL Number", "DL Expiry", "Vehicles"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-text-muted font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {importPreview.map((r, i) => (
                  <tr key={i} className="border-b border-border-default">
                    <td className="px-3 py-2 text-text-muted">{i + 1}</td>
                    <td className="px-3 py-2 text-text-primary">{r.name}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.phone}</td>
                    <td className="px-3 py-2 text-text-secondary font-mono">{r.aadhar}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.dlNumber}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.dlExpiry}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.vehicles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <Button onClick={confirmImport}><Check size={14} /> Confirm import</Button>
            <Button variant="ghost" onClick={() => setImportPreview(null)}>Cancel</Button>
          </div>
        </div>
      )}

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
              {["Name", "Phone", "Aadhar", "DL Expiry", "Vehicles"].map((h) => (
                <th key={h} className="text-left section-label px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-sm text-text-muted py-12">No drivers.</td></tr>
            )}
            {filtered.map((d) => (
              <tr key={d._id} className="border-b border-border-default hover:bg-bg-2 transition">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(d._id)} onChange={() => toggle(d._id)} className="accent-accent" />
                </td>
                <td className="px-4 py-3.5 text-[13px] text-text-primary font-medium">{d.name}</td>
                <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{d.phone}</td>
                <td className="px-4 py-3.5 text-[13px] text-text-secondary font-mono">{d.aadhar}</td>
                <td className="px-4 py-3.5 text-[13px] text-text-secondary">{d.dlExpiry}</td>
                <td className="px-4 py-3.5 text-[13px] text-text-secondary">{d.vehicles.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VehiclesBulk() {
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const deleteVehicles = useMutation(api.bulk.removeVehicles);
  const importVehicles = useMutation(api.bulk.importVehicles);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);
  const [importPreview, setImportPreview] = useState<any[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const downloadTemplate = () => {
    const headers = "rcNumber,registrationDate,trailerType,manufacturer,manufactureDate,purchaseDate,batteryHealth,batteryCapacity,status";
    const example = "KA01-EV-1024,2023-03-15,Refrigerated 20ft,Tata Motors,2023-01-10,2023-03-15,92,240,active";
    const blob = new Blob([headers + "\n" + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vehicles-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (vehicles.length === 0) return;
    const headers = "rcNumber,registrationDate,trailerType,manufacturer,manufactureDate,purchaseDate,batteryHealth,batteryCapacity,status";
    const rows = vehicles.map((v) =>
      [v.rcNumber, v.registrationDate, v.trailerType, v.manufacturer, v.manufactureDate, v.purchaseDate, v.batteryHealth, v.batteryCapacity, v.status].join(",")
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vehicles-export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have header + at least 1 row");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const required = ["rcnumber", "trailertype", "manufacturer", "status"];
    for (const r of required) {
      if (!headers.includes(r)) throw new Error(`Missing required column: ${r}`);
    }
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const row: any = {};
      headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });
      return {
        rcNumber: row.rcnumber || row.rcNumber || "",
        registrationDate: row.registrationdate || row.registrationDate || "",
        trailerType: row.trailertype || row.trailerType || "",
        manufacturer: row.manufacturer || "",
        manufactureDate: row.manufacturedate || row.manufactureDate || "",
        purchaseDate: row.purchasedate || row.purchaseDate || "",
        batteryHealth: Number(row.batteryhealth || row.batteryHealth || 0),
        batteryCapacity: Number(row.batterycapacity || row.batteryCapacity || 0),
        status: (row.status || "active") as "active" | "maintenance" | "inactive",
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCSV(ev.target?.result as string);
        setImportPreview(rows);
      } catch (err: any) {
        setImportError(err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    await importVehicles({ rows: importPreview });
    setImportPreview(null);
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
          <Button variant="ghost" onClick={downloadTemplate}><Download size={14} /> Template</Button>
          <Button variant="ghost" onClick={downloadAll}><FileSpreadsheet size={14} /> Export all</Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import CSV</Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
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

      {importError && (
        <div className="text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2">{importError}</div>
      )}

      {importPreview && (
        <div className="card-panel p-5 space-y-4">
          <SectionLabel>Import Preview — {importPreview.length} rows</SectionLabel>
          <div className="max-h-[300px] overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border-default">
                {["#", "RC Number", "Manufacturer", "Trailer", "Battery", "Status"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-text-muted font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {importPreview.map((r, i) => (
                  <tr key={i} className="border-b border-border-default">
                    <td className="px-3 py-2 text-text-muted">{i + 1}</td>
                    <td className="px-3 py-2 text-text-primary font-mono">{r.rcNumber}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.manufacturer}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.trailerType}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.batteryHealth}%</td>
                    <td className="px-3 py-2"><Badge variant={r.status === "active" ? "green" : r.status === "maintenance" ? "amber" : "red"}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <Button onClick={confirmImport}><Check size={14} /> Confirm import</Button>
            <Button variant="ghost" onClick={() => setImportPreview(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="card-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-accent" />
              </th>
              {["RC Number", "Manufacturer", "Trailer", "Battery", "Status"].map((h) => (
                <th key={h} className="text-left section-label px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-sm text-text-muted py-12">No vehicles.</td></tr>
            )}
            {filtered.map((v) => (
              <tr key={v._id} className="border-b border-border-default hover:bg-bg-2 transition">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(v._id)} onChange={() => toggle(v._id)} className="accent-accent" />
                </td>
                <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono">{v.rcNumber}</td>
                <td className="px-4 py-3.5 text-[13px] text-text-secondary">{v.manufacturer}</td>
                <td className="px-4 py-3.5 text-[13px] text-text-secondary">{v.trailerType}</td>
                <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{v.batteryHealth}%</td>
                <td className="px-4 py-3.5"><Badge variant={v.status === "active" ? "green" : v.status === "maintenance" ? "amber" : "red"}>{v.status}</Badge></td>
              </tr>
            ))}
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

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

  const downloadTemplate = () => {
    const headers = "driverId,vehicleId,date,origin,destination,distance,cargoWeight,energyConsumed,idlingEnergy,estimatedRange,manHours,status";
    const example = "DRIVER_ID_HERE,VEHICLE_ID_HERE,2026-01-15,Bengaluru Depot,Hyderabad,280,3500,75.2,6.0,380,5.1,completed";
    const blob = new Blob([headers + "\n" + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "trips-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (trips.length === 0) return;
    const headers = "driverId,vehicleId,date,origin,destination,distance,cargoWeight,energyConsumed,idlingEnergy,estimatedRange,manHours,status";
    const rows = trips.map((t) =>
      [t.driverId, t.vehicleId, t.date, t.origin, t.destination, t.distance, t.cargoWeight, t.energyConsumed, t.idlingEnergy, t.estimatedRange, t.manHours, t.status].join(",")
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "trips-export.csv"; a.click();
    URL.revokeObjectURL(url);
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
          <Button variant="ghost" onClick={downloadTemplate}><Download size={14} /> Template</Button>
          <Button variant="ghost" onClick={downloadAll}><FileSpreadsheet size={14} /> Export all</Button>
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
              {["Date", "Driver", "Vehicle", "Route", "Distance", "Energy", "Status"].map((h) => (
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
              return (
                <tr key={t._id} className="border-b border-border-default hover:bg-bg-2 transition">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(t._id)} onChange={() => toggle(t._id)} className="accent-accent" />
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{t.date}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-primary">{d?.name ?? "—"}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-primary font-mono text-xs">{v?.rcNumber ?? "—"}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary">{t.origin} → {t.destination}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.distance} km</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-primary tabular-nums">{t.energyConsumed} kWh</td>
                  <td className="px-4 py-3.5"><Badge variant={t.status === "completed" ? "green" : t.status === "ongoing" ? "amber" : "blue"}>{t.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
