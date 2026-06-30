import { query } from "./_generated/server";

const ENERGY_COST_PER_KWH = 8;

export const fleetStats = query({
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    const drivers = await ctx.db.query("drivers").collect();
    const trips = await ctx.db.query("trips").collect();
    const geofence = await ctx.db.query("geofenceLogs").collect();

    const totalDistance = trips.reduce((a, t) => a + t.distance, 0);
    const totalEnergy = trips.reduce((a, t) => a + t.energyConsumed, 0);

    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter((v) => v.status === "active").length,
      totalDrivers: drivers.length,
      totalTrips: trips.length,
      completedTrips: trips.filter((t) => t.status === "completed").length,
      ongoingTrips: trips.filter((t) => t.status === "ongoing").length,
      totalDistance,
      totalEnergy: +totalEnergy.toFixed(1),
      avgConsumption: totalDistance > 0 ? +(totalEnergy / totalDistance).toFixed(3) : 0,
      avgBatteryHealth: vehicles.length > 0
        ? Math.round(vehicles.reduce((a, v) => a + v.batteryHealth, 0) / vehicles.length)
        : 0,
      geofenceBreaches: geofence.filter((g) => g.breached).length,
      totalIdleHours: +(geofence.reduce((a, g) => a + g.idleMinutes, 0) / 60).toFixed(1),
    };
  },
});

export const alerts = query({
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    const drivers = await ctx.db.query("drivers").collect();
    const geofence = await ctx.db.query("geofenceLogs").collect();

    const result: { id: string; title: string; detail: string; severity: "warning" | "critical" | "info" }[] = [];

    for (const v of vehicles) {
      if (v.status === "maintenance") {
        result.push({ id: `maint-${v._id}`, title: "Maintenance", detail: `${v.rcNumber} — ${v.trailerType}`, severity: "warning" });
      }
      if (v.soc !== undefined && v.soc < 20) {
        result.push({ id: `low-${v._id}`, title: "Low battery", detail: `${v.rcNumber} — ${v.soc}% SOC`, severity: "critical" });
      }
    }
    for (const g of geofence.filter((g) => g.breached)) {
      result.push({ id: `gf-${g._id}`, title: "Geofence breach", detail: `Vehicle ${g.vehicleId} — ${new Date(g.tripStart).toLocaleDateString()}`, severity: "critical" });
    }
    for (const d of drivers) {
      const expiry = new Date(d.dlExpiry);
      const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
      if (daysLeft > 0 && daysLeft <= 30) {
        result.push({ id: `dl-${d._id}`, title: "DL expiring", detail: `${d.name} — ${daysLeft}d left`, severity: "info" });
      }
    }
    return result;
  },
});

export const costStats = query({
  handler: async (ctx) => {
    const trips = await ctx.db.query("trips").collect();
    const totalCost = trips.reduce((a, t) => a + Math.round(t.energyConsumed * ENERGY_COST_PER_KWH), 0);
    const totalKm = trips.reduce((a, t) => a + t.distance, 0);
    return { totalCost, costPerKm: totalKm > 0 ? Math.round(totalCost / totalKm) : 0 };
  },
});

export const chargingStats = query({
  handler: async (ctx) => {
    const vehicles = await ctx.db.query("vehicles").collect();
    const charging = vehicles.filter((v) => v.status === "active" && v.soc !== undefined && v.soc < 80).length;
    const available = vehicles.filter((v) => v.status === "active").length;
    return { charging, available };
  },
});
