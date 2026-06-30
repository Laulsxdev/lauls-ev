import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("vehicles").collect();
  },
});

export const get = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vehicles", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("vehicles"),
    rcNumber: v.optional(v.string()),
    registrationDate: v.optional(v.string()),
    trailerType: v.optional(v.string()),
    manufacturer: v.optional(v.string()),
    manufactureDate: v.optional(v.string()),
    purchaseDate: v.optional(v.string()),
    batteryHealth: v.optional(v.number()),
    batteryCapacity: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("maintenance"), v.literal("inactive"))),
    soc: v.optional(v.number()),
    soh: v.optional(v.number()),
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
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
