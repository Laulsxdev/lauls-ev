import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("worker")),
  }).index("by_email", ["email"]),

  drivers: defineTable({
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    aadhar: v.string(),
    dlNumber: v.string(),
    dlExpiry: v.string(),
    vehicles: v.array(v.string()),
  }).index("by_aadhar", ["aadhar"]),

  vehicles: defineTable({
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
  }).index("by_rcNumber", ["rcNumber"]),

  trips: defineTable({
    driverId: v.string(),
    vehicleId: v.string(),
    date: v.string(),
    origin: v.string(),
    destination: v.string(),
    distance: v.number(),
    cargoWeight: v.number(),
    energyConsumed: v.number(),
    avgConsumption: v.number(),
    idlingEnergy: v.number(),
    estimatedRange: v.number(),
    manHours: v.number(),
    status: v.union(v.literal("planned"), v.literal("ongoing"), v.literal("completed")),
  }).index("by_driver", ["driverId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_date", ["date"]),

  geofenceLogs: defineTable({
    tripId: v.string(),
    vehicleId: v.string(),
    tripStart: v.string(),
    tripEnd: v.string(),
    idleMinutes: v.number(),
    idleActive: v.boolean(),
    breached: v.boolean(),
  }).index("by_trip", ["tripId"])
    .index("by_vehicle", ["vehicleId"]),
});
