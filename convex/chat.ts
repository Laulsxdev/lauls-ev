import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const chat = action({
  args: {
    message: v.string(),
    history: v.optional(v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args): Promise<string> => {
    const [stats, drivers, vehicles, trips, logs] = await Promise.all([
      ctx.runQuery(api.dashboard.fleetStats),
      ctx.runQuery(api.drivers.list),
      ctx.runQuery(api.vehicles.list),
      ctx.runQuery(api.trips.list),
      ctx.runQuery(api.geofenceLogs.list),
    ]);

    const systemPrompt = `You are Lev-AI, the fleet management assistant for Lauls EV Fleet. You have FULL access to the live database below. Answer questions using ONLY this data. Be concise, precise, and data-driven. When asked for reports, format them clearly with tables or bullet points. When data is insufficient, say so.

## Fleet Overview
${JSON.stringify(stats)}

## Drivers (${drivers.length})
${JSON.stringify(drivers)}

## Vehicles (${vehicles.length})
${JSON.stringify(vehicles)}

## Trips (${trips.length})
${JSON.stringify(trips)}

## Geofence Logs (${logs.length})
${JSON.stringify(logs)}

## Rules
- Always reference specific numbers from the data.
- For comparisons, calculate percentages and differences.
- For reports, use markdown-style formatting.
- If asked about data not in the tables above, say "I don't have that data yet."
- Never fabricate data. Use only what's provided.`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return `Fleet snapshot: ${stats.activeVehicles}/${stats.totalVehicles} vehicles active, ${stats.totalDrivers} drivers, ${stats.totalTrips} trips. ${stats.totalDistance.toLocaleString()} km total, ${stats.totalEnergy} kWh consumed (avg ${stats.avgConsumption} kWh/km). Battery health avg ${stats.avgBatteryHealth}%.`;
    }

    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...(args.history ?? []).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: args.message },
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "openrouter/free",
        messages,
        max_tokens: 1024,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "No response.";
  },
});
