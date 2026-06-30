import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("drivers").collect();
  },
});

export const get = query({
  args: { id: v.id("drivers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    aadhar: v.string(),
    dlNumber: v.string(),
    dlExpiry: v.string(),
    vehicles: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("drivers", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("drivers"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    aadhar: v.optional(v.string()),
    dlNumber: v.optional(v.string()),
    dlExpiry: v.optional(v.string()),
    vehicles: v.optional(v.array(v.string())),
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
  args: { id: v.id("drivers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
