import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { Zap, LogOut, Check, Sparkles, AlertTriangle, Download, Upload, FileSpreadsheet, Search } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { AuthGuard } from "@/lib/auth-guard";
import { Button, Input, Textarea, Select, Field, Badge, SectionLabel } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manual-fill")({
  head: () => ({ meta: [{ title: "Manual Fill — Lauls EV Fleet" }] }),
  component: () => (<AuthGuard role="worker"><ManualFillPage /></AuthGuard>),
});

type Tab = "driver" | "vehicle" | "trip" | "geofence" | "import" | "export";

function ManualFillPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("driver");

  const tabs: { key: Tab; label: string }[] = [
    { key: "driver", label: "Driver" },
    { key: "vehicle", label: "Vehicle" },
    { key: "trip", label: "Trip" },
    { key: "geofence", label: "Geofence" },
    { key: "import", label: "Import CSV" },
    { key: "export", label: "Export Data" },
  ];

  return (
    <div className="min-h-screen bg-bg-0">
      <header className="h-14 px-6 flex items-center justify-between border-b border-border-default bg-bg-0 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-soft border border-border-default flex items-center justify-center">
            <Zap size={16} className="text-accent" fill="currentColor" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-bold text-text-primary">LAULS</div>
            <div className="text-[10px] text-text-muted">EV Fleet · Field Worker</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="blue">worker</Badge>
          <button
            onClick={() => { localStorage.removeItem("lauls-ev-profile"); navigate({ to: "/auth" }); }}
            className="w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-status-red inline-flex items-center justify-center"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="border-b border-border-default px-6">
        <div className="max-w-[680px] mx-auto flex gap-6 overflow-x-auto">
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

      <main className="max-w-[680px] mx-auto px-6 py-8">
        {tab === "driver" && <DriverForm />}
        {tab === "vehicle" && <VehicleForm />}
        {tab === "trip" && <TripForm />}
        {tab === "geofence" && <GeofenceForm />}
        {tab === "import" && <CSVImport />}
        {tab === "export" && <CSVExport />}
      </main>
    </div>
  );
}

function DriverForm() {
  const createDriver = useMutation(api.drivers.create);
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dlNumber, setDlNumber] = useState("");
  const [dlExpiry, setDlExpiry] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [saved, setSaved] = useState(false);

  const existingDriver = drivers.find((d) => d.aadhar === aadhar);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDriver({
      name, phone, address, aadhar, dlNumber, dlExpiry,
      vehicles: vehicles.split(",").map((v) => v.trim()).filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setName(""); setPhone(""); setAddress(""); setAadhar(""); setDlNumber(""); setDlExpiry(""); setVehicles("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <FormSection label="Personal Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Phone" required>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
        </div>
        <Field label="Address">
          <Textarea value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
      </FormSection>

      <FormSection label="Identification">
        <Field label="Aadhar number" required>
          <Input value={aadhar} onChange={(e) => setAadhar(e.target.value)} required />
        </Field>
        {aadhar && existingDriver && (
          <div className="flex items-start gap-2 text-[12px] text-status-amber bg-status-amber-bg border border-status-amber-border rounded-md px-3 py-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>This Aadhar is already registered to <strong>{existingDriver.name}</strong>.</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Field label="DL number" required>
            <Input value={dlNumber} onChange={(e) => setDlNumber(e.target.value)} required />
          </Field>
          <Field label="DL expiry" required>
            <Input type="date" value={dlExpiry} onChange={(e) => setDlExpiry(e.target.value)} required />
          </Field>
        </div>
      </FormSection>

      <FormSection label="Assigned Vehicles">
        <Field label="RC numbers" hint="Comma-separated list of vehicles driven.">
          <Input value={vehicles} onChange={(e) => setVehicles(e.target.value)} placeholder="KA01-EV-1024, KA01-EV-2048" />
        </Field>
      </FormSection>

      <SubmitButton saved={saved}>Save driver</SubmitButton>
    </form>
  );
}

function VehicleForm() {
  const createVehicle = useMutation(api.vehicles.create);
  const [rcNumber, setRc] = useState("");
  const [registrationDate, setRegDate] = useState("");
  const [trailerType, setTrailer] = useState("");
  const [manufacturer, setMfr] = useState("");
  const [manufactureDate, setMfrDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [batteryHealth, setBh] = useState("95");
  const [batteryCapacity, setBc] = useState("240");
  const [status, setStatus] = useState<"active" | "maintenance" | "inactive">("active");
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVehicle({
      rcNumber, registrationDate, trailerType, manufacturer, manufactureDate, purchaseDate,
      batteryHealth: Number(batteryHealth), batteryCapacity: Number(batteryCapacity),
      status, soc: undefined, soh: undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setRc(""); setRegDate(""); setTrailer(""); setMfr(""); setMfrDate(""); setPurchaseDate("");
    setBh("95"); setBc("240"); setStatus("active");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <FormSection label="Registration">
        <div className="grid grid-cols-2 gap-4">
          <Field label="RC number" required>
            <Input value={rcNumber} onChange={(e) => setRc(e.target.value)} required placeholder="KA01-EV-1024" />
          </Field>
          <Field label="Registration date" required>
            <Input type="date" value={registrationDate} onChange={(e) => setRegDate(e.target.value)} required />
          </Field>
        </div>
      </FormSection>

      <FormSection label="Specifications">
        <Field label="Trailer type" required>
          <Input value={trailerType} onChange={(e) => setTrailer(e.target.value)} required placeholder="Refrigerated 20ft" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Manufacturer" required>
            <Input value={manufacturer} onChange={(e) => setMfr(e.target.value)} required />
          </Field>
          <Field label="Manufacture date">
            <Input type="date" value={manufactureDate} onChange={(e) => setMfrDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Purchase date">
          <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
        </Field>
      </FormSection>

      <FormSection label="Battery & Status">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Battery health (%)" required>
            <Input type="number" min={0} max={100} value={batteryHealth} onChange={(e) => setBh(e.target.value)} required />
          </Field>
          <Field label="Battery capacity (kWh)" required>
            <Input type="number" min={0} value={batteryCapacity} onChange={(e) => setBc(e.target.value)} required />
          </Field>
        </div>
        <Field label="Status" required>
          <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="active">Active</option>
            <option value="maintenance">Under maintenance</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Field>
      </FormSection>

      <SubmitButton saved={saved}>Save vehicle</SubmitButton>
    </form>
  );
}

function TripForm() {
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const trips: Doc<"trips">[] = useQuery(api.trips.list) ?? [];
  const createTrip = useMutation(api.trips.create);

  const allLocations = useMemo(() => {
    const set = new Set<string>();
    trips.forEach((t) => { if (t.origin) set.add(t.origin); if (t.destination) set.add(t.destination); });
    return Array.from(set).sort();
  }, [trips]);

  const [driverId, setDriverId] = useState(drivers[0]?._id ?? "");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?._id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [cargoWeight, setWeight] = useState("");
  const [energyConsumed, setEnergy] = useState("");
  const [idlingEnergy, setIdling] = useState("");
  const [estimatedRange, setRange] = useState("");
  const [manHours, setManHours] = useState("");
  const [status, setStatus] = useState<"planned" | "ongoing" | "completed">("completed");
  const [saved, setSaved] = useState(false);

  const distNum = parseFloat(distance) || 0;
  const weightNum = parseFloat(cargoWeight) || 0;
  const estEnergy = distNum > 0 && weightNum > 0 ? +(distNum * 0.25 * (1 + weightNum / 10000)).toFixed(1) : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTrip({
      driverId, vehicleId, date, origin, destination,
      distance: distNum,
      cargoWeight: weightNum,
      energyConsumed: parseFloat(energyConsumed) || 0,
      idlingEnergy: parseFloat(idlingEnergy) || 0,
      estimatedRange: parseFloat(estimatedRange) || 0,
      manHours: parseFloat(manHours) || 0,
      status,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setOrigin(""); setDestination(""); setDistance(""); setWeight(""); setEnergy("");
    setIdling(""); setRange(""); setManHours("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <FormSection label="Assignment">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Driver" required>
            <Select value={driverId} onChange={(e) => setDriverId(e.target.value as Id<"drivers">)} required>
              {drivers.length === 0 && <option value="">No drivers yet</option>}
              {drivers.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Select>
          </Field>
          <Field label="Vehicle" required>
            <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value as Id<"vehicles">)} required>
              {vehicles.length === 0 && <option value="">No vehicles yet</option>}
              {vehicles.map((v) => <option key={v._id} value={v._id}>{v.rcNumber}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Trip date" required>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Field>
      </FormSection>

      <FormSection label="Route">
        <AutoCompleteField label="Origin" value={origin} onChange={setOrigin} options={allLocations} required />
        <AutoCompleteField label="Destination" value={destination} onChange={setDestination} options={allLocations} required />
      </FormSection>

      <FormSection label="Trip Data">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Distance (km)" required>
            <Input type="number" min={0} step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} required />
          </Field>
          <Field label="Cargo weight (kg)">
            <Input type="number" min={0} value={cargoWeight} onChange={(e) => setWeight(e.target.value)} />
          </Field>
        </div>
        <Field
          label="Energy consumed (kWh)"
          hint={estEnergy != null ? (
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={11} className="text-accent" /> Estimated <span className="text-text-secondary font-semibold tabular-nums">{estEnergy} kWh</span> based on distance and weight.
            </span>
          ) : undefined}
        >
          <div className="relative">
            <Input type="number" min={0} step="0.1" value={energyConsumed} onChange={(e) => setEnergy(e.target.value)} className="pr-24" />
            {estEnergy != null && (
              <button
                type="button"
                onClick={() => setEnergy(String(estEnergy))}
                className="absolute right-1 top-1 h-[30px] px-2 text-[11px] font-semibold text-accent hover:bg-accent-soft rounded-md inline-flex items-center gap-1"
              >
                <Sparkles size={11} /> Use estimate
              </button>
            )}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Idling energy (kWh)">
            <Input type="number" min={0} step="0.1" value={idlingEnergy} onChange={(e) => setIdling(e.target.value)} />
          </Field>
          <Field label="Estimated range (km)">
            <Input type="number" min={0} value={estimatedRange} onChange={(e) => setRange(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Man hours">
            <Input type="number" min={0} step="0.1" value={manHours} onChange={(e) => setManHours(e.target.value)} />
          </Field>
          <Field label="Status" required>
            <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>
        </div>
      </FormSection>

      <SubmitButton saved={saved}>Save trip</SubmitButton>
    </form>
  );
}

function GeofenceForm() {
  const trips: Doc<"trips">[] = useQuery(api.trips.list) ?? [];
  const createGeofence = useMutation(api.geofenceLogs.create);
  const [tripId, setTripId] = useState(trips[0]?._id ?? "");
  const [tripStart, setStart] = useState("");
  const [tripEnd, setEnd] = useState("");
  const [idleMinutes, setIdle] = useState("");
  const [idleActive, setIdleActive] = useState(false);
  const [breached, setBreached] = useState(false);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trip = trips.find((t) => t._id === tripId);
    if (!trip) return;
    await createGeofence({
      tripId, vehicleId: trip.vehicleId,
      tripStart, tripEnd,
      idleMinutes: Number(idleMinutes) || 0,
      idleActive, breached,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setStart(""); setEnd(""); setIdle(""); setIdleActive(false); setBreached(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <FormSection label="Trip Reference">
        <Field label="Trip" required>
          <Select value={tripId} onChange={(e) => setTripId(e.target.value as Id<"trips">)} required>
            {trips.length === 0 && <option value="">No trips yet</option>}
            {trips.map((t) => {
              const route = [t.origin, t.destination].filter(Boolean).join(" → ");
              return <option key={t._id} value={t._id}>{t.date}{route ? ` · ${route}` : ""}</option>;
            })}
          </Select>
        </Field>
      </FormSection>

      <FormSection label="Timing">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Trip start" required>
            <Input type="datetime-local" value={tripStart} onChange={(e) => setStart(e.target.value)} required />
          </Field>
          <Field label="Trip end" required>
            <Input type="datetime-local" value={tripEnd} onChange={(e) => setEnd(e.target.value)} required />
          </Field>
        </div>
        <Field label="Idle duration (minutes)">
          <Input type="number" min={0} value={idleMinutes} onChange={(e) => setIdle(e.target.value)} />
        </Field>
      </FormSection>

      <FormSection label="Status Flags">
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={idleActive} onChange={(e) => setIdleActive(e.target.checked)} className="accent-accent w-4 h-4" />
            <span className="text-sm text-text-primary">Idle state currently active</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={breached} onChange={(e) => setBreached(e.target.checked)} className="accent-accent w-4 h-4" />
            <span className="text-sm text-text-primary">Geofence was breached</span>
          </label>
        </div>
      </FormSection>

      <SubmitButton saved={saved}>Save geofence log</SubmitButton>
    </form>
  );
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SectionLabel>{label}</SectionLabel>
        <div className="flex-1 h-px bg-border-default" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SubmitButton({ saved, children }: { saved: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" className={cn("w-full h-11", saved && "bg-status-green hover:bg-status-green")}>
      {saved ? (<><Check size={14} /> Saved</>) : children}
    </Button>
  );
}

function AutoCompleteField({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const filtered = options.filter((o) => o.toLowerCase().includes(value.toLowerCase())).slice(0, 5);

  return (
    <Field label={label} required={required}>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          required={required}
        />
        {open && value && filtered.length > 0 && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-bg-2 border border-border-default rounded-lg overflow-hidden shadow-lg">
            {filtered.map((o) => (
              <button
                key={o}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onChange(o); setOpen(false); }}
                className="block w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-accent-soft transition"
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
}

type ImportTable = "drivers" | "vehicles" | "trips";

// ponytail: one combined template, same as bulk page
const CSV_HEADERS = ["type","name","phone","address","aadhar","dlNumber","dlExpiry","vehicles","rcNumber","registrationDate","trailerType","manufacturer","manufactureDate","purchaseDate","batteryHealth","batteryCapacity","vehicleStatus","driverName","vehicleRC","date","origin","destination","distance","cargoWeight","energyConsumed","idlingEnergy","estimatedRange","manHours","tripStatus"];
const CSV_P = "0";
const CSV_TEMPLATE_ROWS = [
  ["driver","Rajesh Kumar","+91 98765 43210","Sector 21 Gurugram","1234 5678 9012","DL-0420180012345","2028-06-12","KA01-EV-1024",CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P].join(","),
  ["vehicle",CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,"RC-001","2023-03-15","Refrigerated 20ft","Tata Motors","2023-01-10","2023-03-15","92","240","active",CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P].join(","),
  ["trip",CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,CSV_P,"Rajesh Kumar","RC-001","2026-01-15","Bengaluru Depot","Hyderabad","280","3500","75.2","6.0","380","5.1","completed"].join(","),
];

function CSVImport() {
  const importDrivers = useMutation(api.bulk.importDrivers);
  const importVehicles = useMutation(api.bulk.importVehicles);
  const importTrips = useMutation(api.bulk.importTrips);
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const [preview, setPreview] = useState<{ drivers: any[]; vehicles: any[]; trips: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csv = CSV_HEADERS.join(",") + "\n" + CSV_TEMPLATE_ROWS.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `fleet-template-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have header + at least 1 data row");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    if (!headers.includes("type")) throw new Error("Missing required column: type (driver/vehicle/trip)");
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const row: any = {};
      headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });
      return row;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); setDone(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = parseCSV(ev.target?.result as string);
        const dRows: any[] = [], vRows: any[] = [], tRows: any[] = [];
        for (const r of raw) {
          const t = (r.type || "").toLowerCase();
          if (t === "driver") {
            dRows.push({ name: r.name || "", phone: r.phone || "", address: r.address || "", aadhar: r.aadhar || "", dlNumber: r.dlnumber || r.dlNumber || "", dlExpiry: r.dlexpiry || r.dlExpiry || "", vehicles: r.vehicles || "" });
          } else if (t === "vehicle") {
            vRows.push({ rcNumber: r.rcnumber || r.rcNumber || "", registrationDate: r.registrationdate || r.registrationDate || "", trailerType: r.trailertype || r.trailerType || "", manufacturer: r.manufacturer || "", manufactureDate: r.manufacturedate || r.manufactureDate || "", purchaseDate: r.purchasedate || r.purchaseDate || "", batteryHealth: Number(r.batteryhealth || r.batteryHealth || 0), batteryCapacity: Number(r.batterycapacity || r.batteryCapacity || 0), status: (r.vehiclestatus || r.status || "active") as "active" | "maintenance" | "inactive" });
          } else if (t === "trip") {
            tRows.push({ driverName: r.drivername || r.driverName || "", vehicleRC: r.vehiclerc || r.vehicleRC || "", date: r.date || "", origin: r.origin || "", destination: r.destination || "", distance: Number(r.distance || 0), cargoWeight: Number(r.cargoweight || r.cargoWeight || 0), energyConsumed: Number(r.energyconsumed || r.energyConsumed || 0), idlingEnergy: Number(r.idlingenergy || r.idlingEnergy || 0), estimatedRange: Number(r.estimatedrange || r.estimatedRange || 0), manHours: Number(r.manhours || r.manHours || 0), status: (r.tripstatus || r.status || "completed") as "planned" | "ongoing" | "completed" });
          }
        }
        setPreview({ drivers: dRows, vehicles: vRows, trips: tRows });
      } catch (err: any) { setError(err.message); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmImport = async () => {
    if (!preview) return;
    try {
      if (preview.drivers.length > 0) await importDrivers({ rows: preview.drivers });
      if (preview.vehicles.length > 0) await importVehicles({ rows: preview.vehicles });
      if (preview.trips.length > 0) {
        const driverMap = new Map(drivers.map((d) => [d.name.toLowerCase(), d._id]));
        const vehicleMap = new Map(vehicles.map((v) => [v.rcNumber.toLowerCase(), v._id]));
        const resolved = preview.trips.map((t) => ({ ...t, driverId: driverMap.get(t.driverName.toLowerCase()) ?? "", vehicleId: vehicleMap.get(t.vehicleRC.toLowerCase()) ?? "" }));
        const missing = resolved.filter((t) => !t.driverId || !t.vehicleId);
        if (missing.length > 0) { setError(`Cannot find driver/vehicle for ${missing.length} trip(s): ${missing.slice(0, 3).map((m) => `${m.driverName}/${m.vehicleRC}`).join(", ")}`); return; }
        await importTrips({ rows: resolved });
      }
      setPreview(null); setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div className="space-y-6">
      <FormSection label="Import data from CSV">
        <p className="text-[13px] text-text-secondary">Download a template, fill it with your data, then upload it here. You'll see a preview before anything is saved.</p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={downloadTemplate}><Download size={14} /> Download template</Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> Upload CSV</Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </div>
        {done && (
          <div className="text-[12px] text-status-green bg-status-green-bg border border-status-green-border rounded-md px-3 py-2 flex items-center gap-2">
            <Check size={14} /> Data imported successfully.
          </div>
        )}
      </FormSection>

      {error && (
        <div className="text-[12px] text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2">{error}</div>
      )}

      {preview && (
        <div className="space-y-4">
          <SectionLabel>Preview — {preview.drivers.length} drivers, {preview.vehicles.length} vehicles, {preview.trips.length} trips</SectionLabel>

          {preview.drivers.length > 0 && (
            <div className="max-h-[200px] overflow-auto bg-bg-3 border border-border-default rounded-xl">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border-default bg-bg-2">
                  {["Name", "Phone", "Aadhar", "DL Number", "DL Expiry", "Vehicles"].map((h) => <th key={h} className="text-left px-3 py-2 text-text-muted font-medium">{h}</th>)}
                </tr></thead>
                <tbody>{preview.drivers.map((r, i) => <tr key={i} className="border-b border-border-default">
                  <td className="px-3 py-2 text-text-primary">{r.name}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.phone}</td>
                  <td className="px-3 py-2 text-text-secondary font-mono">{r.aadhar}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.dlNumber}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.dlExpiry}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.vehicles}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}

          {preview.vehicles.length > 0 && (
            <div className="max-h-[200px] overflow-auto bg-bg-3 border border-border-default rounded-xl">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border-default bg-bg-2">
                  {["RC Number", "Manufacturer", "Trailer", "Battery", "Capacity", "Status"].map((h) => <th key={h} className="text-left px-3 py-2 text-text-muted font-medium">{h}</th>)}
                </tr></thead>
                <tbody>{preview.vehicles.map((r, i) => <tr key={i} className="border-b border-border-default">
                  <td className="px-3 py-2 text-text-primary font-mono">{r.rcNumber}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.manufacturer}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.trailerType}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.batteryHealth}%</td>
                  <td className="px-3 py-2 text-text-secondary">{r.batteryCapacity} kWh</td>
                  <td className="px-3 py-2"><Badge variant={r.status === "active" ? "green" : r.status === "maintenance" ? "amber" : "red"}>{r.status}</Badge></td>
                </tr>)}</tbody>
              </table>
            </div>
          )}

          {preview.trips.length > 0 && (
            <div className="max-h-[200px] overflow-auto bg-bg-3 border border-border-default rounded-xl">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border-default bg-bg-2">
                  {["Driver", "Vehicle", "Date", "Route", "Distance", "Energy", "Status"].map((h) => <th key={h} className="text-left px-3 py-2 text-text-muted font-medium">{h}</th>)}
                </tr></thead>
                <tbody>{preview.trips.map((r, i) => <tr key={i} className="border-b border-border-default">
                  <td className="px-3 py-2 text-text-primary">{r.driverName}</td>
                  <td className="px-3 py-2 text-text-secondary font-mono">{r.vehicleRC}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.date}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.origin} → {r.destination}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.distance} km</td>
                  <td className="px-3 py-2 text-text-secondary">{r.energyConsumed} kWh</td>
                  <td className="px-3 py-2"><Badge variant={r.status === "completed" ? "green" : r.status === "ongoing" ? "amber" : "blue"}>{r.status}</Badge></td>
                </tr>)}</tbody>
              </table>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={confirmImport}><Check size={14} /> Confirm & save</Button>
            <Button variant="ghost" onClick={() => setPreview(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CSVExport() {
  const drivers: Doc<"drivers">[] = useQuery(api.drivers.list) ?? [];
  const vehicles: Doc<"vehicles">[] = useQuery(api.vehicles.list) ?? [];
  const trips: Doc<"trips">[] = useQuery(api.trips.list) ?? [];
  const [exportType, setExportType] = useState<"drivers" | "vehicles" | "trips">("drivers");

  const download = () => {
    let headers: string;
    let rows: string[];
    if (exportType === "drivers") {
      headers = "name,phone,address,aadhar,dlNumber,dlExpiry,vehicles";
      rows = drivers.map((d) => [d.name, d.phone, d.address, d.aadhar, d.dlNumber, d.dlExpiry, d.vehicles.join(", ")].join(","));
    } else if (exportType === "vehicles") {
      headers = "rcNumber,registrationDate,trailerType,manufacturer,manufactureDate,purchaseDate,batteryHealth,batteryCapacity,status";
      rows = vehicles.map((v) => [v.rcNumber, v.registrationDate, v.trailerType, v.manufacturer, v.manufactureDate, v.purchaseDate, v.batteryHealth, v.batteryCapacity, v.status].join(","));
    } else {
      headers = "driverId,vehicleId,date,origin,destination,distance,cargoWeight,energyConsumed,idlingEnergy,estimatedRange,manHours,status";
      rows = trips.map((t) => [t.driverId, t.vehicleId, t.date, t.origin, t.destination, t.distance, t.cargoWeight, t.energyConsumed, t.idlingEnergy, t.estimatedRange, t.manHours, t.status].join(","));
    }
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${exportType}-export.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FormSection label="Export data as CSV">
        <p className="text-[13px] text-text-secondary">Download your fleet data as a CSV file for offline use or reporting.</p>
        <Field label="What to export">
          <Select value={exportType} onChange={(e) => setExportType(e.target.value as typeof exportType)}>
            <option value="drivers">Drivers ({drivers.length})</option>
            <option value="vehicles">Vehicles ({vehicles.length})</option>
            <option value="trips">Trips ({trips.length})</option>
          </Select>
        </Field>
        <Button onClick={download}><Download size={14} /> Download CSV</Button>
      </FormSection>
    </div>
  );
}
