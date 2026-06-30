// In-memory mock store with localStorage persistence and external subscriber API.
// All entities use string ids. Designed so a real backend can swap in later
// without changing component code.

import { useSyncExternalStore } from "react";

export type Role = "admin" | "worker";

export interface Profile {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  address: string;
  aadhar: string;
  dlNumber: string;
  dlExpiry: string; // ISO date
  vehicles: string[]; // RC numbers
  createdAt: number;
  updatedAt: number;
}

export interface Vehicle {
  id: string;
  rcNumber: string;
  registrationDate: string;
  trailerType: string;
  manufacturer: string;
  manufactureDate: string;
  purchaseDate: string;
  batteryHealth: number; // %
  batteryCapacity: number; // kWh
  status: "active" | "maintenance" | "inactive";
  soc: number | null;
  soh: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface Trip {
  id: string;
  driverId: string;
  vehicleId: string;
  date: string;
  origin: string;
  destination: string;
  distance: number; // km
  cargoWeight: number; // kg
  energyConsumed: number; // kWh
  avgConsumption: number; // kWh/km
  idlingEnergy: number;
  estimatedRange: number;
  manHours: number;
  status: "planned" | "ongoing" | "completed";
  createdAt: number;
  updatedAt: number;
}

export interface GeofenceLog {
  id: string;
  tripId: string;
  vehicleId: string;
  tripStart: string;
  tripEnd: string;
  idleMinutes: number;
  idleActive: boolean;
  breached: boolean;
  createdAt: number;
  updatedAt: number;
}

interface State {
  profile: Profile | null;
  drivers: Driver[];
  vehicles: Vehicle[];
  trips: Trip[];
  geofence: GeofenceLog[];
}

const STORAGE_KEY = "lauls-ev-fleet-v1";
const isBrowser = typeof window !== "undefined";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seed(): State {
  const now = Date.now();
  const drivers: Driver[] = [
    {
      id: "d1", name: "Rajesh Kumar", phone: "+91 98765 43210", address: "Sector 21, Gurugram",
      aadhar: "1234 5678 9012", dlNumber: "DL-0420180012345", dlExpiry: "2028-06-12",
      vehicles: ["KA01-EV-1024", "KA01-EV-2048"], createdAt: now - 86400000 * 30, updatedAt: now,
    },
    {
      id: "d2", name: "Anita Sharma", phone: "+91 91234 56789", address: "Whitefield, Bengaluru",
      aadhar: "2345 6789 0123", dlNumber: "KA-0520190023456", dlExpiry: "2027-11-03",
      vehicles: ["KA01-EV-3072"], createdAt: now - 86400000 * 22, updatedAt: now,
    },
    {
      id: "d3", name: "Mohammed Faiz", phone: "+91 99887 76655", address: "Andheri East, Mumbai",
      aadhar: "3456 7890 1234", dlNumber: "MH-0220200034567", dlExpiry: "2026-04-19",
      vehicles: ["MH01-EV-4096"], createdAt: now - 86400000 * 14, updatedAt: now,
    },
    {
      id: "d4", name: "Priya Nair", phone: "+91 90909 80808", address: "Kakkanad, Kochi",
      aadhar: "4567 8901 2345", dlNumber: "KL-0720210045678", dlExpiry: "2029-02-28",
      vehicles: ["KL07-EV-5120"], createdAt: now - 86400000 * 9, updatedAt: now,
    },
  ];
  const vehicles: Vehicle[] = [
    { id: "v1", rcNumber: "KA01-EV-1024", registrationDate: "2023-03-15", trailerType: "Refrigerated 20ft", manufacturer: "Tata Motors", manufactureDate: "2023-01-10", purchaseDate: "2023-03-15", batteryHealth: 92, batteryCapacity: 240, status: "active", soc: 78, soh: 92, createdAt: now, updatedAt: now },
    { id: "v2", rcNumber: "KA01-EV-2048", registrationDate: "2023-06-22", trailerType: "Flatbed 28ft", manufacturer: "Ashok Leyland", manufactureDate: "2023-04-02", purchaseDate: "2023-06-22", batteryHealth: 81, batteryCapacity: 280, status: "active", soc: 62, soh: 81, createdAt: now, updatedAt: now },
    { id: "v3", rcNumber: "KA01-EV-3072", registrationDate: "2024-01-08", trailerType: "Box 24ft", manufacturer: "Mahindra", manufactureDate: "2023-11-12", purchaseDate: "2024-01-08", batteryHealth: 64, batteryCapacity: 220, status: "maintenance", soc: 12, soh: 64, createdAt: now, updatedAt: now },
    { id: "v4", rcNumber: "MH01-EV-4096", registrationDate: "2024-04-30", trailerType: "Tanker 30ft", manufacturer: "BYD", manufactureDate: "2024-02-18", purchaseDate: "2024-04-30", batteryHealth: 96, batteryCapacity: 320, status: "active", soc: 88, soh: 96, createdAt: now, updatedAt: now },
    { id: "v5", rcNumber: "KL07-EV-5120", registrationDate: "2024-08-12", trailerType: "Refrigerated 28ft", manufacturer: "Tata Motors", manufactureDate: "2024-06-05", purchaseDate: "2024-08-12", batteryHealth: 38, batteryCapacity: 240, status: "inactive", soc: null, soh: 38, createdAt: now, updatedAt: now },
  ];
  const trips: Trip[] = Array.from({ length: 18 }).map((_, i) => {
    const driver = drivers[i % drivers.length];
    const vehicle = vehicles[i % vehicles.length];
    const distance = 80 + Math.round(Math.random() * 320);
    const weight = 800 + Math.round(Math.random() * 6000);
    const energy = +(distance * 0.25 * (1 + weight / 10000)).toFixed(1);
    const date = new Date(now - i * 86400000 * 1.2).toISOString().slice(0, 10);
    return {
      id: `t${i + 1}`,
      driverId: driver.id,
      vehicleId: vehicle.id,
      date,
      origin: ["Bengaluru Depot", "Mumbai Hub", "Chennai Port", "Pune Center", "Kochi Yard"][i % 5],
      destination: ["Hyderabad", "Nashik", "Coimbatore", "Mangalore", "Trivandrum"][i % 5],
      distance,
      cargoWeight: weight,
      energyConsumed: energy,
      avgConsumption: +(energy / distance).toFixed(3),
      idlingEnergy: +(energy * 0.08).toFixed(1),
      estimatedRange: Math.round(vehicle.batteryCapacity / (energy / distance)),
      manHours: +(distance / 55).toFixed(1),
      status: i < 2 ? "ongoing" : i < 4 ? "planned" : "completed",
      createdAt: now - i * 86400000,
      updatedAt: now - i * 86400000,
    };
  });
  const geofence: GeofenceLog[] = trips.slice(0, 10).map((t, i) => ({
    id: `g${i + 1}`,
    tripId: t.id,
    vehicleId: t.vehicleId,
    tripStart: `${t.date}T08:${10 + i}:00`,
    tripEnd: `${t.date}T${14 + (i % 4)}:30:00`,
    idleMinutes: Math.round(Math.random() * 90),
    idleActive: i === 0,
    breached: i % 4 === 0,
    createdAt: now - i * 86400000,
    updatedAt: now - i * 86400000,
  }));
  return { profile: null, drivers, vehicles, trips, geofence };
}

let state: State = (() => {
  if (!isBrowser) return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  const s = seed();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  return s;
})();

const listeners = new Set<() => void>();

function persist() {
  if (!isBrowser) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function setState(next: Partial<State> | ((s: State) => Partial<State>)) {
  const patch = typeof next === "function" ? next(state) : next;
  state = { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}

export function getState(): State {
  return state;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

// === Auth ===
export function login(email: string, password: string, role: Role, name?: string) {
  if (password !== "123") throw new Error("Invalid credentials. Use password: 123");
  const profile: Profile = {
    userId: uid(),
    name: name || (email.split("@")[0] || "User").replace(/^\w/, (c) => c.toUpperCase()),
    email,
    role,
  };
  setState({ profile });
  return profile;
}

export function logout() {
  setState({ profile: null });
}

// === Drivers ===
export function createDriver(input: Omit<Driver, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();
  const d: Driver = { ...input, id: uid(), createdAt: now, updatedAt: now };
  setState((s) => ({ drivers: [d, ...s.drivers] }));
  return d;
}
export function updateDriver(id: string, patch: Partial<Driver>) {
  setState((s) => ({ drivers: s.drivers.map((d) => d.id === id ? { ...d, ...patch, updatedAt: Date.now() } : d) }));
}
export function deleteDriver(id: string) {
  setState((s) => ({ drivers: s.drivers.filter((d) => d.id !== id) }));
}
export function aadharExists(aadhar: string, excludeId?: string) {
  return state.drivers.find((d) => d.aadhar === aadhar && d.id !== excludeId) || null;
}

// === Vehicles ===
export function createVehicle(input: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();
  const v: Vehicle = { ...input, id: uid(), createdAt: now, updatedAt: now };
  setState((s) => ({ vehicles: [v, ...s.vehicles] }));
  return v;
}
export function updateVehicle(id: string, patch: Partial<Vehicle>) {
  setState((s) => ({ vehicles: s.vehicles.map((v) => v.id === id ? { ...v, ...patch, updatedAt: Date.now() } : v) }));
}
export function deleteVehicle(id: string) {
  setState((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) }));
}
export function rcExists(rc: string, excludeId?: string) {
  return state.vehicles.find((v) => v.rcNumber === rc && v.id !== excludeId) || null;
}

// === Trips ===
export function createTrip(input: Omit<Trip, "id" | "createdAt" | "updatedAt" | "avgConsumption"> & { avgConsumption?: number }) {
  const now = Date.now();
  const avg = input.distance > 0 && input.energyConsumed > 0
    ? +(input.energyConsumed / input.distance).toFixed(3)
    : 0;
  const t: Trip = { ...input, avgConsumption: avg, id: uid(), createdAt: now, updatedAt: now };
  setState((s) => ({ trips: [t, ...s.trips] }));
  return t;
}
export function updateTrip(id: string, patch: Partial<Trip>) {
  setState((s) => ({ trips: s.trips.map((t) => t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t) }));
}
export function deleteTrip(id: string) {
  setState((s) => ({ trips: s.trips.filter((t) => t.id !== id) }));
}
export function getAllLocations(): string[] {
  const set = new Set<string>();
  state.trips.forEach((t) => { if (t.origin) set.add(t.origin); if (t.destination) set.add(t.destination); });
  return Array.from(set).sort();
}

// === Geofence ===
export function createGeofence(input: Omit<GeofenceLog, "id" | "createdAt" | "updatedAt">) {
  const now = Date.now();
  const g: GeofenceLog = { ...input, id: uid(), createdAt: now, updatedAt: now };
  setState((s) => ({ geofence: [g, ...s.geofence] }));
  return g;
}
export function updateGeofence(id: string, patch: Partial<GeofenceLog>) {
  setState((s) => ({ geofence: s.geofence.map((g) => g.id === id ? { ...g, ...patch, updatedAt: Date.now() } : g) }));
}

// === Derived helpers (ponytail: simple filters, no abstraction needed until Convex replaces this) ===
export function getTodayTrips(): Trip[] {
  const today = new Date().toISOString().slice(0, 10);
  return state.trips.filter((t) => t.date === today);
}

export type AlertSeverity = "warning" | "critical" | "info";
export interface Alert {
  id: string;
  title: string;
  detail: string;
  severity: AlertSeverity;
}

export function getAlerts(): Alert[] {
  const alerts: Alert[] = [];
  for (const v of state.vehicles) {
    if (v.status === "maintenance") {
      alerts.push({ id: `maint-${v.id}`, title: "Maintenance", detail: `${v.rcNumber} — ${v.trailerType}`, severity: "warning" });
    }
    if (v.soc !== null && v.soc < 20) {
      alerts.push({ id: `low-${v.id}`, title: "Low battery", detail: `${v.rcNumber} — ${v.soc}% SOC`, severity: "critical" });
    }
  }
  for (const g of state.geofence.filter((g) => g.breached)) {
    alerts.push({ id: `gf-${g.id}`, title: "Geofence breach", detail: `Vehicle ${g.vehicleId} — ${new Date(g.tripStart).toLocaleDateString()}`, severity: "critical" });
  }
  for (const d of state.drivers) {
    const expiry = new Date(d.dlExpiry);
    const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
    if (daysLeft > 0 && daysLeft <= 30) {
      alerts.push({ id: `dl-${d.id}`, title: "DL expiring", detail: `${d.name} — ${daysLeft}d left`, severity: "info" });
    }
  }
  return alerts;
}

// ponytail: energyCost per kWh — swap for real rate when backend lands
const ENERGY_COST_PER_KWH = 8; // ₹
export function tripCost(t: Trip): number {
  return Math.round(t.energyConsumed * ENERGY_COST_PER_KWH);
}
export function getCostStats(): { totalCost: number; costPerKm: number } {
  const totalCost = state.trips.reduce((a, t) => a + tripCost(t), 0);
  const totalKm = state.trips.reduce((a, t) => a + t.distance, 0);
  return { totalCost, costPerKm: totalKm > 0 ? Math.round(totalCost / totalKm) : 0 };
}
export function getChargingStats(): { charging: number; available: number } {
  const charging = state.vehicles.filter((v) => v.status === "active" && v.soc !== null && v.soc < 80).length;
  const available = state.vehicles.filter((v) => v.status === "active").length;
  return { charging, available };
}

// === Aggregate stats (admin dashboard) ===
export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  totalTrips: number;
  completedTrips: number;
  ongoingTrips: number;
  totalDistance: number;
  totalEnergy: number;
  avgConsumption: number;
  avgBatteryHealth: number;
  geofenceBreaches: number;
  totalIdleHours: number;
}

export function getFleetStats(): FleetStats {
  const s = state;
  const totalDistance = s.trips.reduce((a, t) => a + t.distance, 0);
  const totalEnergy = s.trips.reduce((a, t) => a + t.energyConsumed, 0);
  return {
    totalVehicles: s.vehicles.length,
    activeVehicles: s.vehicles.filter((v) => v.status === "active").length,
    totalDrivers: s.drivers.length,
    totalTrips: s.trips.length,
    completedTrips: s.trips.filter((t) => t.status === "completed").length,
    ongoingTrips: s.trips.filter((t) => t.status === "ongoing").length,
    totalDistance,
    totalEnergy: +totalEnergy.toFixed(1),
    avgConsumption: totalDistance > 0 ? +(totalEnergy / totalDistance).toFixed(3) : 0,
    avgBatteryHealth: s.vehicles.length > 0
      ? Math.round(s.vehicles.reduce((a, v) => a + v.batteryHealth, 0) / s.vehicles.length)
      : 0,
    geofenceBreaches: s.geofence.filter((g) => g.breached).length,
    totalIdleHours: +(s.geofence.reduce((a, g) => a + g.idleMinutes, 0) / 60).toFixed(1),
  };
}
