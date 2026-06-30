import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("trips").collect();
  },
});

export const get = query({
  args: { id: v.id("trips") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const avg = args.distance > 0 && args.energyConsumed > 0
      ? +(args.energyConsumed / args.distance).toFixed(3)
      : 0;
    return await ctx.db.insert("trips", { ...args, avgConsumption: avg });
  },
});

export const update = mutation({
  args: {
    id: v.id("trips"),
    driverId: v.optional(v.string()),
    vehicleId: v.optional(v.string()),
    date: v.optional(v.string()),
    origin: v.optional(v.string()),
    destination: v.optional(v.string()),
    distance: v.optional(v.number()),
    cargoWeight: v.optional(v.number()),
    energyConsumed: v.optional(v.number()),
    idlingEnergy: v.optional(v.number()),
    estimatedRange: v.optional(v.number()),
    manHours: v.optional(v.number()),
    status: v.optional(v.union(v.literal("planned"), v.literal("ongoing"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    if (typeof filtered.distance === "number" && typeof filtered.energyConsumed === "number") {
      (filtered as any).avgConsumption = +(filtered.energyConsumed / filtered.distance).toFixed(3);
    }
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("trips") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
