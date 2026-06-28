import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { SlideOver } from "@/components/slide-over";
import { Button, Input, Field, Textarea } from "@/components/ui-kit";
import {
  createDriver, deleteDriver, updateDriver, useStore,
  type Driver,
} from "@/lib/mock-store";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/drivers")({
  component: DriversPage,
});

function DriversPage() {
  const drivers = useStore((s) => s.drivers);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Driver | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const filtered = useMemo(
    () => drivers.filter((d) => `${d.name} ${d.phone} ${d.aadhar}`.toLowerCase().includes(q.toLowerCase())),
    [drivers, q],
  );

  return (
    <>
      <TopBar title="Drivers" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-[320px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drivers…" className="pl-9" />
          </div>
          <Button onClick={() => setEditing("new")}><Plus size={14} /> Add driver</Button>
        </div>

        <div className="card-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                {["Name", "Phone", "Aadhar", "DL Expiry", "Vehicles", ""].map((h) => (
                  <th key={h} className="text-left section-label px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-sm text-text-muted py-12">No drivers found.</td></tr>
              )}
              {filtered.map((d) => (
                <tr key={d.id} className="group border-b border-border-default hover:bg-bg-2 transition">
                  <td className="px-4 py-3.5 text-[13px] text-text-primary font-medium">{d.name}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">{d.phone}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary font-mono">{d.aadhar}</td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary tabular-nums">
                    {d.dlExpiry ? format(new Date(d.dlExpiry), "dd MMM yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-text-secondary">{d.vehicles.length} assigned</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setEditing(d)} className="w-8 h-8 rounded-md text-text-secondary hover:bg-bg-3 hover:text-text-primary inline-flex items-center justify-center"><Edit2 size={14} /></button>
                      {confirmDel === d.id ? (
                        <div className="inline-flex items-center gap-1.5 bg-status-red-bg border border-status-red-border rounded-md px-2 h-8">
                          <span className="text-[11px] text-status-red">Delete?</span>
                          <button onClick={() => { deleteDriver(d.id); setConfirmDel(null); }} className="text-[11px] font-semibold text-status-red px-1.5">Yes</button>
                          <button onClick={() => setConfirmDel(null)} className="text-[11px] text-text-muted px-1.5">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDel(d.id)} className="w-8 h-8 rounded-md text-text-secondary hover:bg-status-red-bg hover:text-status-red inline-flex items-center justify-center"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DriverFormPanel
        open={editing !== null}
        onClose={() => setEditing(null)}
        driver={editing === "new" ? null : editing}
      />
    </>
  );
}

function DriverFormPanel({ open, onClose, driver }: { open: boolean; onClose: () => void; driver: Driver | null }) {
  const [name, setName] = useState(driver?.name ?? "");
  const [phone, setPhone] = useState(driver?.phone ?? "");
  const [address, setAddress] = useState(driver?.address ?? "");
  const [aadhar, setAadhar] = useState(driver?.aadhar ?? "");
  const [dlNumber, setDl] = useState(driver?.dlNumber ?? "");
  const [dlExpiry, setDlExpiry] = useState(driver?.dlExpiry ?? "");
  const [vehicles, setVehicles] = useState(driver?.vehicles.join(", ") ?? "");

  // Reset on driver change
  useMemo(() => {
    setName(driver?.name ?? "");
    setPhone(driver?.phone ?? "");
    setAddress(driver?.address ?? "");
    setAadhar(driver?.aadhar ?? "");
    setDl(driver?.dlNumber ?? "");
    setDlExpiry(driver?.dlExpiry ?? "");
    setVehicles(driver?.vehicles.join(", ") ?? "");
  }, [driver?.id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name, phone, address, aadhar, dlNumber, dlExpiry,
      vehicles: vehicles.split(",").map((v) => v.trim()).filter(Boolean),
    };
    if (driver) updateDriver(driver.id, payload);
    else createDriver(payload);
    onClose();
  };

  return (
    <SlideOver open={open} onClose={onClose} title={driver ? "Edit driver" : "Add driver"}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="Full name" required><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="Phone" required><Input value={phone} onChange={(e) => setPhone(e.target.value)} required /></Field>
        <Field label="Address"><Textarea value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
        <Field label="Aadhar" required><Input value={aadhar} onChange={(e) => setAadhar(e.target.value)} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="DL number" required><Input value={dlNumber} onChange={(e) => setDl(e.target.value)} required /></Field>
          <Field label="DL expiry" required><Input type="date" value={dlExpiry} onChange={(e) => setDlExpiry(e.target.value)} required /></Field>
        </div>
        <Field label="Assigned vehicles" hint="Comma-separated RC numbers.">
          <Input value={vehicles} onChange={(e) => setVehicles(e.target.value)} />
        </Field>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1">{driver ? "Save changes" : "Create driver"}</Button>
        </div>
      </form>
    </SlideOver>
  );
}
