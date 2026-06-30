import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useQuery, i as useMutation } from "../_libs/convex.mjs";
import { n as api } from "./utils-BVScM_NS.mjs";
import { E as Pen, c as Search, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { t as SlideOver } from "./slide-over-DMycZxwg.mjs";
import { t as TopBar } from "./top-bar-BmO1HveU.mjs";
import { a as Input, i as Field, n as BatteryBar, r as Button, s as Select, t as Badge } from "./ui-kit-HwiYKmg4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.vehicles-rS-atXs6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function statusBadge(s) {
	if (s === "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "green",
		children: "Active"
	});
	if (s === "maintenance") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "amber",
		children: "Maintenance"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "red",
		children: "Inactive"
	});
}
function VehiclesPage() {
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const trips = useQuery(api.trips.list) ?? [];
	const deleteVehicle = useMutation(api.vehicles.remove);
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const lastTrip = (vid) => {
		return trips.filter((t) => t.vehicleId === vid).sort((a, b) => b.date > a.date ? 1 : -1)[0]?.date;
	};
	const filtered = (0, import_react.useMemo)(() => vehicles.filter((v) => {
		if (statusFilter !== "all" && v.status !== statusFilter) return false;
		return `${v.rcNumber} ${v.manufacturer} ${v.trailerType}`.toLowerCase().includes(q.toLowerCase());
	}), [
		vehicles,
		q,
		statusFilter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { title: "Vehicles" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-[280px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							size: 14,
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search RC, manufacturer…",
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onChange: (e) => setStatusFilter(e.target.value),
						className: "w-[180px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "maintenance",
								children: "Maintenance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "inactive",
								children: "Inactive"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing("new"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), " Add vehicle"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-panel overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b border-border-default",
						children: [
							"RC number",
							"Manufacturer",
							"Trailer",
							"Battery",
							"Status",
							"Last trip",
							""
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left section-label px-4 py-3",
							children: h
						}, h))
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "text-center text-sm text-text-muted py-12",
						children: "No vehicles found."
					}) }), filtered.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "group border-b border-border-default hover:bg-bg-2 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-primary font-mono",
								children: v.rcNumber
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary",
								children: v.manufacturer
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary",
								children: v.trailerType
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatteryBar, { value: v.batteryHealth })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5",
								children: statusBadge(v.status)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary tabular-nums",
								children: lastTrip(v._id) ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex gap-1 opacity-0 group-hover:opacity-100 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setEditing(v),
										className: "w-8 h-8 rounded-md text-text-secondary hover:bg-bg-3 hover:text-text-primary inline-flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { size: 14 })
									}), confirmDel === v._id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 bg-status-red-bg border border-status-red-border rounded-md px-2 h-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-status-red",
												children: "Delete?"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													deleteVehicle({ id: v._id });
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
										onClick: () => setConfirmDel(v._id),
										className: "w-8 h-8 rounded-md text-text-secondary hover:bg-status-red-bg hover:text-status-red inline-flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
									})]
								})
							})
						]
					}, v._id))] })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleFormPanel, {
			open: editing !== null,
			onClose: () => setEditing(null),
			vehicle: editing === "new" ? null : editing
		})
	] });
}
function VehicleFormPanel({ open, onClose, vehicle }) {
	const createVehicle = useMutation(api.vehicles.create);
	const updateVehicle = useMutation(api.vehicles.update);
	const [rcNumber, setRc] = (0, import_react.useState)(vehicle?.rcNumber ?? "");
	const [registrationDate, setReg] = (0, import_react.useState)(vehicle?.registrationDate ?? "");
	const [trailerType, setTr] = (0, import_react.useState)(vehicle?.trailerType ?? "");
	const [manufacturer, setMf] = (0, import_react.useState)(vehicle?.manufacturer ?? "");
	const [manufactureDate, setMfd] = (0, import_react.useState)(vehicle?.manufactureDate ?? "");
	const [purchaseDate, setPd] = (0, import_react.useState)(vehicle?.purchaseDate ?? "");
	const [batteryHealth, setBh] = (0, import_react.useState)(String(vehicle?.batteryHealth ?? 95));
	const [batteryCapacity, setBc] = (0, import_react.useState)(String(vehicle?.batteryCapacity ?? 240));
	const [status, setStatus] = (0, import_react.useState)(vehicle?.status ?? "active");
	(0, import_react.useMemo)(() => {
		setRc(vehicle?.rcNumber ?? "");
		setReg(vehicle?.registrationDate ?? "");
		setTr(vehicle?.trailerType ?? "");
		setMf(vehicle?.manufacturer ?? "");
		setMfd(vehicle?.manufactureDate ?? "");
		setPd(vehicle?.purchaseDate ?? "");
		setBh(String(vehicle?.batteryHealth ?? 95));
		setBc(String(vehicle?.batteryCapacity ?? 240));
		setStatus(vehicle?.status ?? "active");
	}, [vehicle?._id]);
	const submit = async (e) => {
		e.preventDefault();
		const payload = {
			rcNumber,
			registrationDate,
			trailerType,
			manufacturer,
			manufactureDate,
			purchaseDate,
			batteryHealth: Number(batteryHealth),
			batteryCapacity: Number(batteryCapacity),
			status,
			soc: vehicle?.soc,
			soh: vehicle?.soh
		};
		if (vehicle) await updateVehicle({
			id: vehicle._id,
			...payload
		});
		else await createVehicle(payload);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlideOver, {
		open,
		onClose,
		title: vehicle ? "Edit vehicle" : "Add vehicle",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "RC number",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: rcNumber,
							onChange: (e) => setRc(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Registration date",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: registrationDate,
							onChange: (e) => setReg(e.target.value),
							required: true
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Trailer type",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: trailerType,
						onChange: (e) => setTr(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Manufacturer",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: manufacturer,
							onChange: (e) => setMf(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Manufacture date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: manufactureDate,
							onChange: (e) => setMfd(e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Purchase date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: purchaseDate,
						onChange: (e) => setPd(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Battery health (%)",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 100,
							value: batteryHealth,
							onChange: (e) => setBh(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Battery capacity (kWh)",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: batteryCapacity,
							onChange: (e) => setBc(e.target.value),
							required: true
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "maintenance",
								children: "Under maintenance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "inactive",
								children: "Inactive"
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
						children: vehicle ? "Save changes" : "Create vehicle"
					})]
				})
			]
		})
	});
}
//#endregion
export { VehiclesPage as component };
