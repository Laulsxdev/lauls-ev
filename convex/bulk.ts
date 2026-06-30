import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const removeDrivers = mutation({
  args: { ids: v.array(v.id("drivers")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) await ctx.db.delete(id);
    return args.ids.length;
  },
});

export const removeVehicles = mutation({
  args: { ids: v.array(v.id("vehicles")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) await ctx.db.delete(id);
    return args.ids.length;
  },
});

export const removeTrips = mutation({
  args: { ids: v.array(v.id("trips")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) await ctx.db.delete(id);
    return args.ids.length;
  },
});

export const removeGeofenceLogs = mutation({
  args: { ids: v.array(v.id("geofenceLogs")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) await ctx.db.delete(id);
    return args.ids.length;
  },
});

export const importDrivers = mutation({
  args: {
    rows: v.array(v.object({
      name: v.string(),
      phone: v.string(),
      address: v.string(),
      aadhar: v.string(),
      dlNumber: v.string(),
      dlExpiry: v.string(),
      vehicles: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const r of args.rows) {
      await ctx.db.insert("drivers", {
        name: r.name,
        phone: r.phone,
        address: r.address,
        aadhar: r.aadhar,
        dlNumber: r.dlNumber,
        dlExpiry: r.dlExpiry,
        vehicles: r.vehicles.split(",").map((v) => v.trim()).filter(Boolean),
      });
      count++;
    }
    return count;
  },
});

export const importVehicles = mutation({
  args: {
    rows: v.array(v.object({
      rcNumber: v.string(),
      registrationDate: v.string(),
      trailerType: v.string(),
      manufacturer: v.string(),
      manufactureDate: v.string(),
      purchaseDate: v.string(),
      batteryHealth: v.number(),
      batteryCapacity: v.number(),
      status: v.union(v.literal("active"), v.literal("maintenance"), v.literal("inactive")),
      soc: v.optional(v.number()),
      soh: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const r of args.rows) {
      await ctx.db.insert("vehicles", r);
      count++;
    }
    return count;
  },
});

export const importTrips = mutation({
  args: {
    rows: v.array(v.object({
      driverId: v.string(),
      vehicleId: v.string(),
      date: v.string(),
      origin: v.string(),
      destination: v.string(),
      distance: v.number(),
      cargoWeight: v.number(),
      energyConsumed: v.number(),
      idlingEnergy: v.number(),
      estimatedRange: v.number(),
      manHours: v.number(),
      status: v.union(v.literal("planned"), v.literal("ongoing"), v.literal("completed")),
    })),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const r of args.rows) {
      const avg = r.distance > 0 && r.energyConsumed > 0
        ? +(r.energyConsumed / r.distance).toFixed(3)
        : 0;
      await ctx.db.insert("trips", { ...r, avgConsumption: avg });
      count++;
    }
    return count;
  },
});
