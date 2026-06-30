import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useQuery, i as useMutation } from "../_libs/convex.mjs";
import { i as cn, n as api } from "./utils-BVScM_NS.mjs";
import { _ as Download, c as Search, g as FileSpreadsheet, i as Upload, o as Trash2, v as Check } from "../_libs/lucide-react.mjs";
import { t as TopBar } from "./top-bar-BmO1HveU.mjs";
import { a as Input, o as SectionLabel, r as Button, t as Badge } from "./ui-kit-HwiYKmg4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.bulk-oPgTbLPB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BulkOperationsPage() {
	const [tab, setTab] = (0, import_react.useState)("drivers");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { title: "Bulk Operations" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border-default",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-6 overflow-x-auto",
					children: [
						{
							key: "drivers",
							label: "Drivers"
						},
						{
							key: "vehicles",
							label: "Vehicles"
						},
						{
							key: "trips",
							label: "Trips"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(t.key),
						className: cn("py-3 text-xs font-semibold uppercase tracking-wider transition border-b-2", tab === t.key ? "text-text-primary border-accent" : "text-text-muted border-transparent hover:text-text-secondary"),
						children: t.label
					}, t.key))
				})
			}),
			tab === "drivers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriversBulk, {}),
			tab === "vehicles" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehiclesBulk, {}),
			tab === "trips" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripsBulk, {})
		]
	})] });
}
function DriversBulk() {
	const drivers = useQuery(api.drivers.list) ?? [];
	const deleteDrivers = useMutation(api.bulk.removeDrivers);
	const importDrivers = useMutation(api.bulk.importDrivers);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [q, setQ] = (0, import_react.useState)("");
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(false);
	const [importPreview, setImportPreview] = (0, import_react.useState)(null);
	const [importError, setImportError] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const filtered = drivers.filter((d) => `${d.name} ${d.phone} ${d.aadhar}`.toLowerCase().includes(q.toLowerCase()));
	const toggleAll = () => {
		if (selected.size === filtered.length) setSelected(/* @__PURE__ */ new Set());
		else setSelected(new Set(filtered.map((d) => d._id)));
	};
	const toggle = (id) => {
		const s = new Set(selected);
		if (s.has(id)) s.delete(id);
		else s.add(id);
		setSelected(s);
	};
	const handleDelete = async () => {
		if (selected.size === 0) return;
		await deleteDrivers({ ids: Array.from(selected) });
		setSelected(/* @__PURE__ */ new Set());
		setConfirmDel(false);
	};
	const downloadTemplate = () => {
		const blob = new Blob(["name,phone,address,aadhar,dlNumber,dlExpiry,vehicles\nRajesh Kumar,+91 98765 43210,Sector 21 Gurugram,1234 5678 9012,DL-0420180012345,2028-06-12,KA01-EV-1024, KA01-EV-2048"], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "drivers-template.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	const downloadAll = () => {
		if (drivers.length === 0) return;
		const rows = drivers.map((d) => [
			d.name,
			d.phone,
			d.address,
			d.aadhar,
			d.dlNumber,
			d.dlExpiry,
			d.vehicles.join(", ")
		].join(","));
		const blob = new Blob(["name,phone,address,aadhar,dlNumber,dlExpiry,vehicles\n" + rows.join("\n")], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "drivers-export.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	const parseCSV = (text) => {
		const lines = text.trim().split("\n");
		if (lines.length < 2) throw new Error("CSV must have header + at least 1 row");
		const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
		for (const r of [
			"name",
			"phone",
			"aadhar",
			"dlnumber"
		]) if (!headers.includes(r)) throw new Error(`Missing required column: ${r}`);
		return lines.slice(1).map((line) => {
			const cols = line.split(",").map((c) => c.trim());
			const row = {};
			headers.forEach((h, i) => {
				row[h] = cols[i] ?? "";
			});
			return {
				name: row.name || "",
				phone: row.phone || "",
				address: row.address || "",
				aadhar: row.aadhar || "",
				dlNumber: row.dlnumber || row.dlNumber || "",
				dlExpiry: row.dlexpiry || row.dlExpiry || "",
				vehicles: row.vehicles || ""
			};
		});
	};
	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImportError(null);
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				setImportPreview(parseCSV(ev.target?.result));
			} catch (err) {
				setImportError(err.message);
			}
		};
		reader.readAsText(file);
		e.target.value = "";
	};
	const confirmImport = async () => {
		if (!importPreview) return;
		await importDrivers({ rows: importPreview });
		setImportPreview(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-[260px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							size: 14,
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search drivers…",
							className: "pl-9"
						})]
					}), selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-accent",
						children: [selected.size, " selected"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: downloadTemplate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 14 }), " Template"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: downloadAll,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { size: 14 }), " Export all"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 14 }), " Import CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: ".csv",
							className: "hidden",
							onChange: handleFileUpload
						}),
						selected.size > 0 && (confirmDel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 bg-status-red-bg border border-status-red-border rounded-lg px-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-status-red",
									children: [
										"Delete ",
										selected.size,
										"?"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleDelete,
									className: "text-xs font-semibold text-status-red px-2",
									children: "Yes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setConfirmDel(false),
									className: "text-xs text-text-muted px-2",
									children: "No"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							onClick: () => setConfirmDel(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 }), " Delete selected"]
						}))
					]
				})]
			}),
			importError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2",
				children: importError
			}),
			importPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-panel p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
						"Import Preview — ",
						importPreview.length,
						" rows"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[300px] overflow-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-b border-border-default",
								children: [
									"#",
									"Name",
									"Phone",
									"Aadhar",
									"DL Number",
									"DL Expiry",
									"Vehicles"
								].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 text-text-muted font-medium",
									children: h
								}, h))
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: importPreview.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-default",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-muted",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-primary",
										children: r.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-secondary",
										children: r.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-secondary font-mono",
										children: r.aadhar
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-secondary",
										children: r.dlNumber
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-secondary",
										children: r.dlExpiry
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-secondary",
										children: r.vehicles
									})
								]
							}, i)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: confirmImport,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), " Confirm import"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setImportPreview(null),
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-panel overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border-default",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 w-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: selected.size === filtered.length && filtered.length > 0,
								onChange: toggleAll,
								className: "accent-accent"
							})
						}), [
							"Name",
							"Phone",
							"Aadhar",
							"DL Expiry",
							"Vehicles"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left section-label px-4 py-3",
							children: h
						}, h))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "text-center text-sm text-text-muted py-12",
						children: "No drivers."
					}) }), filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border-default hover:bg-bg-2 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selected.has(d._id),
									onChange: () => toggle(d._id),
									className: "accent-accent"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-primary font-medium",
								children: d.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary tabular-nums",
								children: d.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary font-mono",
								children: d.aadhar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary",
								children: d.dlExpiry
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary",
								children: d.vehicles.length
							})
						]
					}, d._id))] })]
				})
			})
		]
	});
}
function VehiclesBulk() {
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const deleteVehicles = useMutation(api.bulk.removeVehicles);
	const importVehicles = useMutation(api.bulk.importVehicles);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [q, setQ] = (0, import_react.useState)("");
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(false);
	const [importPreview, setImportPreview] = (0, import_react.useState)(null);
	const [importError, setImportError] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const filtered = vehicles.filter((v) => `${v.rcNumber} ${v.manufacturer} ${v.trailerType}`.toLowerCase().includes(q.toLowerCase()));
	const toggleAll = () => {
		if (selected.size === filtered.length) setSelected(/* @__PURE__ */ new Set());
		else setSelected(new Set(filtered.map((v) => v._id)));
	};
	const toggle = (id) => {
		const s = new Set(selected);
		if (s.has(id)) s.delete(id);
		else s.add(id);
		setSelected(s);
	};
	const handleDelete = async () => {
		await deleteVehicles({ ids: Array.from(selected) });
		setSelected(/* @__PURE__ */ new Set());
		setConfirmDel(false);
	};
	const downloadTemplate = () => {
		const blob = new Blob(["rcNumber,registrationDate,trailerType,manufacturer,manufactureDate,purchaseDate,batteryHealth,batteryCapacity,status\nKA01-EV-1024,2023-03-15,Refrigerated 20ft,Tata Motors,2023-01-10,2023-03-15,92,240,active"], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "vehicles-template.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	const downloadAll = () => {
		if (vehicles.length === 0) return;
		const rows = vehicles.map((v) => [
			v.rcNumber,
			v.registrationDate,
			v.trailerType,
			v.manufacturer,
			v.manufactureDate,
			v.purchaseDate,
			v.batteryHealth,
			v.batteryCapacity,
			v.status
		].join(","));
		const blob = new Blob(["rcNumber,registrationDate,trailerType,manufacturer,manufactureDate,purchaseDate,batteryHealth,batteryCapacity,status\n" + rows.join("\n")], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "vehicles-export.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	const parseCSV = (text) => {
		const lines = text.trim().split("\n");
		if (lines.length < 2) throw new Error("CSV must have header + at least 1 row");
		const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
		for (const r of [
			"rcnumber",
			"trailertype",
			"manufacturer",
			"status"
		]) if (!headers.includes(r)) throw new Error(`Missing required column: ${r}`);
		return lines.slice(1).map((line) => {
			const cols = line.split(",").map((c) => c.trim());
			const row = {};
			headers.forEach((h, i) => {
				row[h] = cols[i] ?? "";
			});
			return {
				rcNumber: row.rcnumber || row.rcNumber || "",
				registrationDate: row.registrationdate || row.registrationDate || "",
				trailerType: row.trailertype || row.trailerType || "",
				manufacturer: row.manufacturer || "",
				manufactureDate: row.manufacturedate || row.manufactureDate || "",
				purchaseDate: row.purchasedate || row.purchaseDate || "",
				batteryHealth: Number(row.batteryhealth || row.batteryHealth || 0),
				batteryCapacity: Number(row.batterycapacity || row.batteryCapacity || 0),
				status: row.status || "active"
			};
		});
	};
	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImportError(null);
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				setImportPreview(parseCSV(ev.target?.result));
			} catch (err) {
				setImportError(err.message);
			}
		};
		reader.readAsText(file);
		e.target.value = "";
	};
	const confirmImport = async () => {
		if (!importPreview) return;
		await importVehicles({ rows: importPreview });
		setImportPreview(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-[260px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							size: 14,
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search vehicles…",
							className: "pl-9"
						})]
					}), selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-accent",
						children: [selected.size, " selected"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: downloadTemplate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 14 }), " Template"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: downloadAll,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { size: 14 }), " Export all"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 14 }), " Import CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: ".csv",
							className: "hidden",
							onChange: handleFileUpload
						}),
						selected.size > 0 && (confirmDel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 bg-status-red-bg border border-status-red-border rounded-lg px-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-status-red",
									children: [
										"Delete ",
										selected.size,
										"?"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleDelete,
									className: "text-xs font-semibold text-status-red px-2",
									children: "Yes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setConfirmDel(false),
									className: "text-xs text-text-muted px-2",
									children: "No"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							onClick: () => setConfirmDel(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 }), " Delete selected"]
						}))
					]
				})]
			}),
			importError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2",
				children: importError
			}),
			importPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-panel p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
						"Import Preview — ",
						importPreview.length,
						" rows"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[300px] overflow-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-b border-border-default",
								children: [
									"#",
									"RC Number",
									"Manufacturer",
									"Trailer",
									"Battery",
									"Status"
								].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 text-text-muted font-medium",
									children: h
								}, h))
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: importPreview.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-default",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-muted",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-primary font-mono",
										children: r.rcNumber
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-secondary",
										children: r.manufacturer
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-text-secondary",
										children: r.trailerType
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-2 text-text-secondary",
										children: [r.batteryHealth, "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: r.status === "active" ? "green" : r.status === "maintenance" ? "amber" : "red",
											children: r.status
										})
									})
								]
							}, i)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: confirmImport,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), " Confirm import"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setImportPreview(null),
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-panel overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border-default",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 w-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: selected.size === filtered.length && filtered.length > 0,
								onChange: toggleAll,
								className: "accent-accent"
							})
						}), [
							"RC Number",
							"Manufacturer",
							"Trailer",
							"Battery",
							"Status"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left section-label px-4 py-3",
							children: h
						}, h))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "text-center text-sm text-text-muted py-12",
						children: "No vehicles."
					}) }), filtered.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border-default hover:bg-bg-2 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selected.has(v._id),
									onChange: () => toggle(v._id),
									className: "accent-accent"
								})
							}),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-primary tabular-nums",
								children: [v.batteryHealth, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: v.status === "active" ? "green" : v.status === "maintenance" ? "amber" : "red",
									children: v.status
								})
							})
						]
					}, v._id))] })]
				})
			})
		]
	});
}
function TripsBulk() {
	const trips = useQuery(api.trips.list) ?? [];
	const drivers = useQuery(api.drivers.list) ?? [];
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const deleteTrips = useMutation(api.bulk.removeTrips);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [q, setQ] = (0, import_react.useState)("");
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(false);
	const filtered = trips.filter((t) => `${t.origin} ${t.destination}`.toLowerCase().includes(q.toLowerCase()));
	const toggleAll = () => {
		if (selected.size === filtered.length) setSelected(/* @__PURE__ */ new Set());
		else setSelected(new Set(filtered.map((t) => t._id)));
	};
	const toggle = (id) => {
		const s = new Set(selected);
		if (s.has(id)) s.delete(id);
		else s.add(id);
		setSelected(s);
	};
	const handleDelete = async () => {
		await deleteTrips({ ids: Array.from(selected) });
		setSelected(/* @__PURE__ */ new Set());
		setConfirmDel(false);
	};
	const downloadTemplate = () => {
		const blob = new Blob(["driverId,vehicleId,date,origin,destination,distance,cargoWeight,energyConsumed,idlingEnergy,estimatedRange,manHours,status\nDRIVER_ID_HERE,VEHICLE_ID_HERE,2026-01-15,Bengaluru Depot,Hyderabad,280,3500,75.2,6.0,380,5.1,completed"], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "trips-template.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	const downloadAll = () => {
		if (trips.length === 0) return;
		const rows = trips.map((t) => [
			t.driverId,
			t.vehicleId,
			t.date,
			t.origin,
			t.destination,
			t.distance,
			t.cargoWeight,
			t.energyConsumed,
			t.idlingEnergy,
			t.estimatedRange,
			t.manHours,
			t.status
		].join(","));
		const blob = new Blob(["driverId,vehicleId,date,origin,destination,distance,cargoWeight,energyConsumed,idlingEnergy,estimatedRange,manHours,status\n" + rows.join("\n")], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "trips-export.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-[260px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search trips…",
						className: "pl-9"
					})]
				}), selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-accent",
					children: [selected.size, " selected"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: downloadTemplate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 14 }), " Template"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: downloadAll,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { size: 14 }), " Export all"]
					}),
					selected.size > 0 && (confirmDel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 bg-status-red-bg border border-status-red-border rounded-lg px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-status-red",
								children: [
									"Delete ",
									selected.size,
									"?"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleDelete,
								className: "text-xs font-semibold text-status-red px-2",
								children: "Yes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setConfirmDel(false),
								className: "text-xs text-text-muted px-2",
								children: "No"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						onClick: () => setConfirmDel(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 }), " Delete selected"]
					}))
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-panel overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border-default",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 w-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: selected.size === filtered.length && filtered.length > 0,
							onChange: toggleAll,
							className: "accent-accent"
						})
					}), [
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
					}, h))]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 8,
					className: "text-center text-sm text-text-muted py-12",
					children: "No trips."
				}) }), filtered.map((t) => {
					const d = drivers.find((x) => x._id === t.driverId);
					const v = vehicles.find((x) => x._id === t.vehicleId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border-default hover:bg-bg-2 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selected.has(t._id),
									onChange: () => toggle(t._id),
									className: "accent-accent"
								})
							}),
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
		})]
	});
}
//#endregion
export { BulkOperationsPage as component };
