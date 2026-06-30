import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useQuery, i as useMutation } from "../_libs/convex.mjs";
import { n as api } from "./utils-BVScM_NS.mjs";
import { E as Pen, c as Search, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { t as SlideOver } from "./slide-over-DMycZxwg.mjs";
import { t as TopBar } from "./top-bar-BmO1HveU.mjs";
import { a as Input, i as Field, r as Button, s as Select, t as Badge } from "./ui-kit-HwiYKmg4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.trips-Cpku5FHu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function tripBadge(s) {
	if (s === "completed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "green",
		children: "Completed"
	});
	if (s === "ongoing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "amber",
		children: "Ongoing"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "blue",
		children: "Planned"
	});
}
function TripsPage() {
	const trips = useQuery(api.trips.list) ?? [];
	const drivers = useQuery(api.drivers.list) ?? [];
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const deleteTrip = useMutation(api.trips.remove);
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [driverFilter, setDriverFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => trips.filter((t) => {
		if (statusFilter !== "all" && t.status !== statusFilter) return false;
		if (driverFilter !== "all" && t.driverId !== driverFilter) return false;
		return `${t.origin} ${t.destination}`.toLowerCase().includes(q.toLowerCase());
	}), [
		trips,
		q,
		statusFilter,
		driverFilter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { title: "Trips" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-[260px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								size: 14,
								className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search route…",
								className: "pl-9"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onChange: (e) => setStatusFilter(e.target.value),
							className: "w-[160px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All statuses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "planned",
									children: "Planned"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ongoing",
									children: "Ongoing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "completed",
									children: "Completed"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: driverFilter,
							onChange: (e) => setDriverFilter(e.target.value),
							className: "w-[180px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All drivers"
							}), drivers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d._id,
								children: d.name
							}, d._id))]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing("new"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), " Add trip"]
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
							"kWh/km",
							"Status",
							""
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left section-label px-4 py-3",
							children: h
						}, h))
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 9,
						className: "text-center text-sm text-text-muted py-12",
						children: "No trips found."
					}) }), filtered.map((t) => {
						const d = drivers.find((x) => x._id === t.driverId);
						const v = vehicles.find((x) => x._id === t.vehicleId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "group border-b border-border-default hover:bg-bg-2 transition",
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
									className: "px-4 py-3.5 text-[13px] text-text-secondary tabular-nums",
									children: t.avgConsumption
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: tripBadge(t.status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex gap-1 opacity-0 group-hover:opacity-100 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setEditing(t),
											className: "w-8 h-8 rounded-md text-text-secondary hover:bg-bg-3 hover:text-text-primary inline-flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { size: 14 })
										}), confirmDel === t._id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1.5 bg-status-red-bg border border-status-red-border rounded-md px-2 h-8",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-status-red",
													children: "Delete?"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														deleteTrip({ id: t._id });
														setConfirmDel(null);
													},
													className: "text-[11px] font-semibold text-status-red px-1.5",
													children: "Yes"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setConfirmDel(null),
													className: "text-[11px] text-text-muted px-1.5",
													children: "No"
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setConfirmDel(t._id),
											className: "w-8 h-8 rounded-md text-text-secondary hover:bg-status-red-bg hover:text-status-red inline-flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
										})]
									})
								})
							]
						}, t._id);
					})] })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripFormPanel, {
			open: editing !== null,
			onClose: () => setEditing(null),
			trip: editing === "new" ? null : editing
		})
	] });
}
function TripFormPanel({ open, onClose, trip }) {
	const drivers = useQuery(api.drivers.list) ?? [];
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const createTrip = useMutation(api.trips.create);
	const updateTrip = useMutation(api.trips.update);
	const [driverId, setDriverId] = (0, import_react.useState)(trip?.driverId ?? drivers[0]?._id ?? "");
	const [vehicleId, setVehicleId] = (0, import_react.useState)(trip?.vehicleId ?? vehicles[0]?._id ?? "");
	const [date, setDate] = (0, import_react.useState)(trip?.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [origin, setOrigin] = (0, import_react.useState)(trip?.origin ?? "");
	const [destination, setDestination] = (0, import_react.useState)(trip?.destination ?? "");
	const [distance, setDistance] = (0, import_react.useState)(String(trip?.distance ?? ""));
	const [cargoWeight, setW] = (0, import_react.useState)(String(trip?.cargoWeight ?? ""));
	const [energyConsumed, setE] = (0, import_react.useState)(String(trip?.energyConsumed ?? ""));
	const [status, setStatus] = (0, import_react.useState)(trip?.status ?? "completed");
	(0, import_react.useMemo)(() => {
		setDriverId(trip?.driverId ?? drivers[0]?._id ?? "");
		setVehicleId(trip?.vehicleId ?? vehicles[0]?._id ?? "");
		setDate(trip?.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
		setOrigin(trip?.origin ?? "");
		setDestination(trip?.destination ?? "");
		setDistance(String(trip?.distance ?? ""));
		setW(String(trip?.cargoWeight ?? ""));
		setE(String(trip?.energyConsumed ?? ""));
		setStatus(trip?.status ?? "completed");
	}, [trip?._id]);
	const submit = async (e) => {
		e.preventDefault();
		const payload = {
			driverId,
			vehicleId,
			date,
			origin,
			destination,
			distance: Number(distance) || 0,
			cargoWeight: Number(cargoWeight) || 0,
			energyConsumed: Number(energyConsumed) || 0,
			idlingEnergy: trip?.idlingEnergy ?? 0,
			estimatedRange: trip?.estimatedRange ?? 0,
			manHours: trip?.manHours ?? 0,
			status
		};
		if (trip) await updateTrip({
			id: trip._id,
			...payload
		});
		else await createTrip(payload);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlideOver, {
		open,
		onClose,
		title: trip ? "Edit trip" : "Add trip",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Driver",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: driverId,
							onChange: (e) => setDriverId(e.target.value),
							children: drivers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d._id,
								children: d.name
							}, d._id))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Vehicle",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: vehicleId,
							onChange: (e) => setVehicleId(e.target.value),
							children: vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v._id,
								children: v.rcNumber
							}, v._id))
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Origin",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: origin,
							onChange: (e) => setOrigin(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Destination",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: destination,
							onChange: (e) => setDestination(e.target.value),
							required: true
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Distance (km)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: distance,
								onChange: (e) => setDistance(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Weight (kg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cargoWeight,
								onChange: (e) => setW(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Energy (kWh)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: energyConsumed,
								onChange: (e) => setE(e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "planned",
								children: "Planned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ongoing",
								children: "Ongoing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "completed",
								children: "Completed"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						className: "flex-1",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "flex-1",
						children: trip ? "Save changes" : "Create trip"
					})]
				})
			]
		})
	});
}
//#endregion
export { TripsPage as component };
