import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("geofenceLogs").collect();
  },
});

export const get = query({
  args: { id: v.id("geofenceLogs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    tripId: v.string(),
    vehicleId: v.string(),
    tripStart: v.string(),
    tripEnd: v.string(),
    idleMinutes: v.number(),
    idleActive: v.boolean(),
    breached: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("geofenceLogs", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("geofenceLogs"),
    tripId: v.optional(v.string()),
    vehicleId: v.optional(v.string()),
    tripStart: v.optional(v.string()),
    tripEnd: v.optional(v.string()),
    idleMinutes: v.optional(v.number()),
    idleActive: v.optional(v.boolean()),
    breached: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("geofenceLogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
