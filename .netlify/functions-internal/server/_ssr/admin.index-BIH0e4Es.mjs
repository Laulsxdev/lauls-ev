import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useQuery } from "../_libs/convex.mjs";
import { i as cn, n as api } from "./utils-BVScM_NS.mjs";
import { C as ArrowDown, S as ArrowUp, a as Truck, h as IndianRupee, l as Route, r as Users, t as Zap, w as TriangleAlert, x as Battery } from "../_libs/lucide-react.mjs";
import { t as TopBar } from "./top-bar-BmO1HveU.mjs";
import { o as SectionLabel, t as Badge } from "./ui-kit-HwiYKmg4.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, i as LineChart, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-BIH0e4Es.js
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ icon, label, value, trend, sparkline, accent = "indigo" }) {
	const accentColors = {
		indigo: {
			text: "text-accent",
			line: "#6366F1"
		},
		green: {
			text: "text-status-green",
			line: "#10B981"
		},
		amber: {
			text: "text-status-amber",
			line: "#F59E0B"
		},
		red: {
			text: "text-status-red",
			line: "#EF4444"
		},
		blue: {
			text: "text-status-blue",
			line: "#3B82F6"
		}
	};
	const sparkData = (sparkline ?? []).map((v, i) => ({
		i,
		v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-panel p-5 border-l-2 border-l-accent hover:border-border-hover transition group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("w-8 h-8 rounded-lg bg-accent-soft inline-flex items-center justify-center", accentColors[accent].text),
					children: icon
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-text-muted",
					children: label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[32px] leading-none font-bold text-text-primary tabular-nums",
					children: value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-5",
				children: sparkData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineChart, {
						data: sparkData,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "v",
							stroke: accentColors[accent].line,
							strokeWidth: 1.5,
							dot: false,
							isAnimationActive: false
						})
					})
				}) : null
			}),
			trend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-2 inline-flex items-center gap-1 text-[11px] font-semibold", trend.positive ? "text-status-green" : "text-status-red"),
				children: [
					trend.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { size: 11 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { size: 11 }),
					Math.abs(trend.value),
					"% vs last period"
				]
			})
		]
	});
}
var tooltipStyle = {
	background: "#141428",
	border: "1px solid rgba(99, 102, 241, 0.12)",
	borderRadius: 8,
	padding: "8px 12px",
	fontSize: 12
};
var ENERGY_COST_PER_KWH = 8;
function Dashboard() {
	const trips = useQuery(api.trips.list) ?? [];
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const drivers = useQuery(api.drivers.list) ?? [];
	const stats = useQuery(api.dashboard.fleetStats);
	const cost = useQuery(api.dashboard.costStats);
	const charging = useQuery(api.dashboard.chargingStats);
	const alerts = useQuery(api.dashboard.alerts) ?? [];
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todayTrips = trips.filter((t) => t.date === today);
	const todayDistance = todayTrips.reduce((a, t) => a + t.distance, 0);
	const todayEnergy = +todayTrips.reduce((a, t) => a + t.energyConsumed, 0).toFixed(1);
	const todayCost = todayTrips.reduce((a, t) => a + Math.round(t.energyConsumed * ENERGY_COST_PER_KWH), 0);
	const days = Array.from({ length: 7 }).map((_, i) => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - (6 - i));
		const ds = d.toISOString().slice(0, 10);
		const dayTrips = trips.filter((t) => t.date === ds);
		return {
			day: format(d, "EEE"),
			distance: dayTrips.reduce((a, t) => a + t.distance, 0),
			energy: +dayTrips.reduce((a, t) => a + t.energyConsumed, 0).toFixed(1)
		};
	});
	vehicles.map((v) => ({
		name: v.rcNumber.split("-").slice(-1)[0],
		energy: +trips.filter((t) => t.vehicleId === v._id).reduce((a, t) => a + t.energyConsumed, 0).toFixed(1)
	}));
	const driverTrips = drivers.map((d) => ({
		name: d.name.split(" ")[0],
		trips: trips.filter((t) => t.driverId === d._id).length
	})).sort((a, b) => b.trips - a.trips).slice(0, 5);
	const statusBreakdown = [
		{
			name: "Active",
			value: vehicles.filter((v) => v.status === "active").length,
			color: "#10B981"
		},
		{
			name: "Maintenance",
			value: vehicles.filter((v) => v.status === "maintenance").length,
			color: "#F59E0B"
		},
		{
			name: "Inactive",
			value: vehicles.filter((v) => v.status === "inactive").length,
			color: "#EF4444"
		}
	].filter((s) => s.value > 0);
	const spark = (key) => days.map((d) => d[key]);
	if (!stats || !cost || !charging) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { title: "Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-text-muted text-sm",
		children: "Loading…"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { title: "Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Today" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-semibold text-text-primary tabular-nums",
							children: todayTrips.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-text-muted",
							children: "trips"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-semibold text-text-primary tabular-nums",
							children: [todayDistance, " km"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-text-muted",
							children: "distance"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-semibold text-text-primary tabular-nums",
							children: [todayEnergy, " kWh"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-text-muted",
							children: "energy"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-semibold text-text-primary tabular-nums",
							children: ["₹", todayCost.toLocaleString()]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-text-muted",
							children: "cost today"
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { size: 16 }),
						label: "Active vehicles",
						value: `${stats.activeVehicles}/${stats.totalVehicles}`,
						trend: {
							value: 4.2,
							positive: true
						},
						sparkline: [
							3,
							4,
							4,
							5,
							5,
							4,
							5
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 16 }),
						label: "Drivers on roster",
						value: String(stats.totalDrivers),
						trend: {
							value: 8.1,
							positive: true
						},
						sparkline: [
							2,
							2,
							3,
							3,
							4,
							4,
							4
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { size: 16 }),
						label: "Trips logged",
						value: String(stats.totalTrips),
						trend: {
							value: 12.3,
							positive: true
						},
						sparkline: spark("distance")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { size: 16 }),
						label: "Energy consumed",
						value: `${stats.totalEnergy.toLocaleString()} kWh`,
						trend: {
							value: 3.4,
							positive: false
						},
						sparkline: spark("energy"),
						accent: "amber"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { size: 16 }),
						label: "Avg battery health",
						value: `${stats.avgBatteryHealth}%`,
						trend: {
							value: 1.1,
							positive: false
						},
						sparkline: [
							88,
							87,
							86,
							85,
							85,
							84,
							stats.avgBatteryHealth
						],
						accent: "green"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { size: 16 }),
						label: "Total spend",
						value: `₹${cost.totalCost.toLocaleString()}`,
						trend: {
							value: 2.1,
							positive: false
						},
						sparkline: [
							1200,
							1350,
							1180,
							1420,
							1390,
							1280,
							cost.totalCost
						],
						accent: "amber"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-panel p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Alerts" }), alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-text-muted mt-3",
						children: "No alerts."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [alerts.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 p-2.5 rounded-lg bg-bg-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
								size: 14,
								className: a.severity === "critical" ? "text-red-400 mt-0.5" : a.severity === "warning" ? "text-amber-400 mt-0.5" : "text-blue-400 mt-0.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-text-primary",
									children: a.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-text-muted truncate",
									children: a.detail
								})]
							})]
						}, a.id)), alerts.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-text-muted text-center",
							children: [alerts.length - 5, " more alerts"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Charging" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-semibold text-text-primary tabular-nums",
								children: charging.available
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-text-muted",
								children: "vehicles active"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-semibold text-amber-400 tabular-nums",
								children: charging.charging
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-text-muted",
								children: "need charging (<80%)"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-border-default",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-text-muted",
									children: "Cost per km"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-lg font-semibold text-text-primary tabular-nums mt-1",
									children: ["₹", cost.costPerKm]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Energy · last 7 days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-text-muted tabular-nums",
							children: [days.reduce((a, d) => a + d.energy, 0).toFixed(1), " kWh"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[220px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: days,
							margin: {
								top: 5,
								right: 5,
								left: -10,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "energyFill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#6366F1",
										stopOpacity: .3
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#6366F1",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#1A1A33",
									strokeDasharray: "3 3",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#475569",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#475569",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: tooltipStyle,
									labelStyle: { color: "#94A3B8" },
									itemStyle: { color: "#F1F5F9" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "energy",
									stroke: "#6366F1",
									strokeWidth: 2,
									fill: "url(#energyFill)"
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Distance · last 7 days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-text-muted tabular-nums",
							children: [days.reduce((a, d) => a + d.distance, 0).toFixed(0), " km"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[220px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: days,
							margin: {
								top: 5,
								right: 5,
								left: -10,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#1A1A33",
									strokeDasharray: "3 3",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#475569",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#475569",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "rgba(99,102,241,0.05)" },
									contentStyle: tooltipStyle,
									labelStyle: { color: "#94A3B8" },
									itemStyle: { color: "#F1F5F9" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "distance",
									fill: "#6366F1",
									radius: [
										4,
										4,
										0,
										0
									],
									fillOpacity: .8
								})
							]
						}) })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-5 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-panel p-5 lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Top drivers · trips logged" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[260px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: driverTrips,
							layout: "vertical",
							margin: {
								top: 5,
								right: 10,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#1A1A33",
									strokeDasharray: "3 3",
									horizontal: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#475569",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									dataKey: "name",
									type: "category",
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#94A3B8",
										fontSize: 12
									},
									width: 80
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "rgba(99,102,241,0.05)" },
									contentStyle: tooltipStyle,
									labelStyle: { color: "#94A3B8" },
									itemStyle: { color: "#F1F5F9" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "trips",
									fill: "#6366F1",
									radius: [
										0,
										4,
										4,
										0
									],
									fillOpacity: .8
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-panel p-5 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Fleet status" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-[200px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: statusBreakdown,
								dataKey: "value",
								innerRadius: "60%",
								outerRadius: "90%",
								paddingAngle: 3,
								stroke: "none",
								children: statusBreakdown.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: s.color }, s.name))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: tooltipStyle,
								labelStyle: { color: "#94A3B8" },
								itemStyle: { color: "#F1F5F9" }
							})] }) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-3 gap-2",
							children: statusBreakdown.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-2 h-2 rounded-sm",
									style: { background: s.color }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-text-muted",
									children: s.name
								})]
							}, s.name))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Recent activity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-text-muted",
					children: "Last 10 trips"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-panel overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b border-border-default",
						children: [
							"Date",
							"Driver",
							"Vehicle",
							"Route",
							"Distance",
							"Energy",
							"Status"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left section-label px-4 py-3",
							children: h
						}, h))
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [trips.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "text-center text-sm text-text-muted py-10",
						children: "No trips yet."
					}) }), [...trips].sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 10).map((t) => {
						const d = drivers.find((x) => x._id === t.driverId);
						const v = vehicles.find((x) => x._id === t.vehicleId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border-default hover:bg-bg-2 transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-[13px] text-text-secondary tabular-nums",
									children: t.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-[13px] text-text-primary",
									children: d?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-[13px] text-text-primary font-mono text-xs",
									children: v?.rcNumber ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3.5 text-[13px] text-text-secondary",
									children: [
										t.origin,
										" → ",
										t.destination
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3.5 text-[13px] text-text-primary tabular-nums",
									children: [t.distance, " km"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3.5 text-[13px] text-text-primary tabular-nums",
									children: [t.energyConsumed, " kWh"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: t.status === "completed" ? "green" : t.status === "ongoing" ? "amber" : "blue",
										children: t.status
									})
								})
							]
						}, t._id);
					})] })]
				})
			})] })
		]
	})] });
}
//#endregion
export { Dashboard as component };
