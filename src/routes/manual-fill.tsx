import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Zap, LogOut, Check, Sparkles, AlertTriangle } from "lucide-react";
import { AuthGuard } from "@/lib/auth-guard";
import { Button, Input, Textarea, Select, Field, Badge, SectionLabel } from "@/components/ui-kit";
import {
  aadharExists, createDriver, createGeofence, createTrip, createVehicle,
  getAllLocations, logout, rcExists, useStore,
} from "@/lib/mock-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/manual-fill")({
  head: () => ({ meta: [{ title: "Manual Fill — Lauls EV Fleet" }] }),
  component: () => (<AuthGuard role="worker"><ManualFillPage /></AuthGuard>),
});

type Tab = "driver" | "vehicle" | "trip" | "geofence";

function ManualFillPage() {
  const profile = useStore((s) => s.profile);
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("driver");

  const tabs: { key: Tab; label: string }[] = [
    { key: "driver", label: "Driver" },
    { key: "vehicle", label: "Vehicle" },
    { key: "trip", label: "Trip" },
    { key: "geofence", label: "Geofence" },
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
          <span className="text-xs text-text-secondary hidden sm:inline">{profile?.name}</span>
          <Badge variant="blue">{profile?.role}</Badge>
          <button
            onClick={() => { logout(); navigate({ to: "/auth" }); }}
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
      </main>
    </div>
  );
}

// === Driver form ===
function DriverForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dlNumber, setDlNumber] = useState("");
  const [dlExpiry, setDlExpiry] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [aadharWarning, setAadharWarning] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDriver({
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
        <Field label="Aadhar number" required hint={aadharWarning ?? undefined}>
          <Input
            value={aadhar}
            onChange={(e) => { setAadhar(e.target.value); setAadharWarning(null); }}
            onBlur={() => {
              const e = aadharExists(aadhar);
              setAadharWarning(e ? null : null);
              if (e) setAadharWarning(null);
            }}
            required
          />
        </Field>
        {aadhar && (() => {
          const existing = aadharExists(aadhar);
          if (!existing) return null;
          return (
            <div className="flex items-start gap-2 text-[12px] text-status-amber bg-status-amber-bg border border-status-amber-border rounded-md px-3 py-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>This Aadhar is already registered to <strong>{existing.name}</strong>.</span>
            </div>
          );
        })()}
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

// === Vehicle form ===
function VehicleForm() {
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicle({
      rcNumber, registrationDate, trailerType, manufacturer, manufactureDate, purchaseDate,
      batteryHealth: Number(batteryHealth), batteryCapacity: Number(batteryCapacity),
      status, soc: null, soh: null,
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
        {rcNumber && (() => {
          const existing = rcExists(rcNumber);
          if (!existing) return null;
          return (
            <div className="flex items-start gap-2 text-[12px] text-status-amber bg-status-amber-bg border border-status-amber-border rounded-md px-3 py-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>RC <strong>{rcNumber}</strong> already exists in fleet.</span>
            </div>
          );
        })()}
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

// === Trip form ===
function TripForm() {
  const drivers = useStore((s) => s.drivers);
  const vehicles = useStore((s) => s.vehicles);
  const allLocations = useMemo(() => getAllLocations(), [useStore((s) => s.trips)]);

  const [driverId, setDriverId] = useState(drivers[0]?.id ?? "");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrip({
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
            <Select value={driverId} onChange={(e) => setDriverId(e.target.value)} required>
              {drivers.length === 0 && <option value="">No drivers yet</option>}
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </Field>
          <Field label="Vehicle" required>
            <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
              {vehicles.length === 0 && <option value="">No vehicles yet</option>}
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.rcNumber}</option>)}
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

// === Geofence form ===
function GeofenceForm() {
  const trips = useStore((s) => s.trips);
  const [tripId, setTripId] = useState(trips[0]?.id ?? "");
  const [tripStart, setStart] = useState("");
  const [tripEnd, setEnd] = useState("");
  const [idleMinutes, setIdle] = useState("");
  const [idleActive, setIdleActive] = useState(false);
  const [breached, setBreached] = useState(false);
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    createGeofence({
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
          <Select value={tripId} onChange={(e) => setTripId(e.target.value)} required>
            {trips.length === 0 && <option value="">No trips yet</option>}
            {trips.map((t) => <option key={t.id} value={t.id}>{t.date} · {t.origin} → {t.destination}</option>)}
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
