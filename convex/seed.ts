import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("vehicles").collect();
    if (existing.length > 0) return "already seeded";

    const drivers = [
      { name: "Rajesh Kumar", phone: "+91 98765 43210", address: "Sector 21, Gurugram", aadhar: "1234 5678 9012", dlNumber: "DL-0420180012345", dlExpiry: "2028-06-12", vehicles: ["KA01-EV-1024", "KA01-EV-2048"] },
      { name: "Anita Sharma", phone: "+91 91234 56789", address: "Whitefield, Bengaluru", aadhar: "2345 6789 0123", dlNumber: "KA-0520190023456", dlExpiry: "2027-11-03", vehicles: ["KA01-EV-3072"] },
      { name: "Mohammed Faiz", phone: "+91 99887 76655", address: "Andheri East, Mumbai", aadhar: "3456 7890 1234", dlNumber: "MH-0220200034567", dlExpiry: "2026-04-19", vehicles: ["MH01-EV-4096"] },
      { name: "Priya Nair", phone: "+91 90909 80808", address: "Kakkanad, Kochi", aadhar: "4567 8901 2345", dlNumber: "KL-0720210045678", dlExpiry: "2029-02-28", vehicles: ["KL07-EV-5120"] },
    ];
    const driverIds = [];
    for (const d of drivers) {
      driverIds.push(await ctx.db.insert("drivers", d));
    }

    const vehicles = [
      { rcNumber: "KA01-EV-1024", registrationDate: "2023-03-15", trailerType: "Refrigerated 20ft", manufacturer: "Tata Motors", manufactureDate: "2023-01-10", purchaseDate: "2023-03-15", batteryHealth: 92, batteryCapacity: 240, status: "active" as const, soc: 78, soh: 92 },
      { rcNumber: "KA01-EV-2048", registrationDate: "2023-06-22", trailerType: "Flatbed 28ft", manufacturer: "Ashok Leyland", manufactureDate: "2023-04-02", purchaseDate: "2023-06-22", batteryHealth: 81, batteryCapacity: 280, status: "active" as const, soc: 62, soh: 81 },
      { rcNumber: "KA01-EV-3072", registrationDate: "2024-01-08", trailerType: "Box 24ft", manufacturer: "Mahindra", manufactureDate: "2023-11-12", purchaseDate: "2024-01-08", batteryHealth: 64, batteryCapacity: 220, status: "maintenance" as const, soc: 12, soh: 64 },
      { rcNumber: "MH01-EV-4096", registrationDate: "2024-04-30", trailerType: "Tanker 30ft", manufacturer: "BYD", manufactureDate: "2024-02-18", purchaseDate: "2024-04-30", batteryHealth: 96, batteryCapacity: 320, status: "active" as const, soc: 88, soh: 96 },
      { rcNumber: "KL07-EV-5120", registrationDate: "2024-08-12", trailerType: "Refrigerated 28ft", manufacturer: "Tata Motors", manufactureDate: "2024-06-05", purchaseDate: "2024-08-12", batteryHealth: 38, batteryCapacity: 240, status: "inactive" as const, soc: undefined, soh: 38 },
    ];
    const vehicleIds = [];
    for (const v of vehicles) {
      vehicleIds.push(await ctx.db.insert("vehicles", v));
    }

    const origins = ["Bengaluru Depot", "Mumbai Hub", "Chennai Port", "Pune Center", "Kochi Yard"];
    const destinations = ["Hyderabad", "Nashik", "Coimbatore", "Mangalore", "Trivandrum"];
    const tripIds = [];
    for (let i = 0; i < 18; i++) {
      const driverId = driverIds[i % driverIds.length];
      const vehicleId = vehicleIds[i % vehicleIds.length];
      const distance = 80 + Math.round(Math.random() * 320);
      const weight = 800 + Math.round(Math.random() * 6000);
      const energy = +(distance * 0.25 * (1 + weight / 10000)).toFixed(1);
      const avgConsumption = +(energy / distance).toFixed(3);
      const date = new Date(Date.now() - i * 86400000 * 1.2).toISOString().slice(0, 10);
      const status = i < 2 ? "ongoing" as const : i < 4 ? "planned" as const : "completed" as const;
      const id = await ctx.db.insert("trips", {
        driverId, vehicleId, date,
        origin: origins[i % 5], destination: destinations[i % 5],
        distance, cargoWeight: weight, energyConsumed: energy, avgConsumption,
        idlingEnergy: +(energy * 0.08).toFixed(1),
        estimatedRange: Math.round(vehicles[i % 5].batteryCapacity / (energy / distance)),
        manHours: +(distance / 55).toFixed(1),
        status,
      });
      tripIds.push(id);
    }

    for (let i = 0; i < 10; i++) {
      const tId = tripIds[i];
      const tDate = new Date(Date.now() - i * 86400000 * 1.2).toISOString().slice(0, 10);
      await ctx.db.insert("geofenceLogs", {
        tripId: tId,
        vehicleId: vehicleIds[i % vehicleIds.length],
        tripStart: `${tDate}T08:${10 + i}:00`,
        tripEnd: `${tDate}T${14 + (i % 4)}:30:00`,
        idleMinutes: Math.round(Math.random() * 90),
        idleActive: i === 0,
        breached: i % 4 === 0,
      });
    }

    return "seeded";
  },
});
