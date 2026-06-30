import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useQuery, i as useMutation } from "../_libs/convex.mjs";
import { n as api } from "./utils-BVScM_NS.mjs";
import { E as Pen, c as Search, o as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { t as SlideOver } from "./slide-over-DMycZxwg.mjs";
import { t as TopBar } from "./top-bar-BmO1HveU.mjs";
import { a as Input, c as Textarea, i as Field, r as Button } from "./ui-kit-HwiYKmg4.mjs";
import { t as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.drivers-BoMKsbkF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DriversPage() {
	const drivers = useQuery(api.drivers.list) ?? [];
	const deleteDriver = useMutation(api.drivers.remove);
	const [q, setQ] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => drivers.filter((d) => `${d.name} ${d.phone} ${d.aadhar}`.toLowerCase().includes(q.toLowerCase())), [drivers, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { title: "Drivers" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-[320px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search drivers…",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing("new"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), " Add driver"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-panel overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b border-border-default",
						children: [
							"Name",
							"Phone",
							"Aadhar",
							"DL Expiry",
							"Vehicles",
							""
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left section-label px-4 py-3",
							children: h
						}, h))
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "text-center text-sm text-text-muted py-12",
						children: "No drivers found."
					}) }), filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "group border-b border-border-default hover:bg-bg-2 transition",
						children: [
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
								className: "px-4 py-3.5 text-[13px] text-text-secondary tabular-nums",
								children: d.dlExpiry ? format(new Date(d.dlExpiry), "dd MMM yyyy") : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary",
								children: [d.vehicles.length, " assigned"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex gap-1 opacity-0 group-hover:opacity-100 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setEditing(d),
										className: "w-8 h-8 rounded-md text-text-secondary hover:bg-bg-3 hover:text-text-primary inline-flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { size: 14 })
									}), confirmDel === d._id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 bg-status-red-bg border border-status-red-border rounded-md px-2 h-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-status-red",
												children: "Delete?"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													deleteDriver({ id: d._id });
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
										onClick: () => setConfirmDel(d._id),
										className: "w-8 h-8 rounded-md text-text-secondary hover:bg-status-red-bg hover:text-status-red inline-flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
									})]
								})
							})
						]
					}, d._id))] })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriverFormPanel, {
			open: editing !== null,
			onClose: () => setEditing(null),
			driver: editing === "new" ? null : editing
		})
	] });
}
function DriverFormPanel({ open, onClose, driver }) {
	const createDriver = useMutation(api.drivers.create);
	const updateDriver = useMutation(api.drivers.update);
	const [name, setName] = (0, import_react.useState)(driver?.name ?? "");
	const [phone, setPhone] = (0, import_react.useState)(driver?.phone ?? "");
	const [address, setAddress] = (0, import_react.useState)(driver?.address ?? "");
	const [aadhar, setAadhar] = (0, import_react.useState)(driver?.aadhar ?? "");
	const [dlNumber, setDl] = (0, import_react.useState)(driver?.dlNumber ?? "");
	const [dlExpiry, setDlExpiry] = (0, import_react.useState)(driver?.dlExpiry ?? "");
	const [vehicles, setVehicles] = (0, import_react.useState)(driver?.vehicles?.join(", ") ?? "");
	(0, import_react.useMemo)(() => {
		setName(driver?.name ?? "");
		setPhone(driver?.phone ?? "");
		setAddress(driver?.address ?? "");
		setAadhar(driver?.aadhar ?? "");
		setDl(driver?.dlNumber ?? "");
		setDlExpiry(driver?.dlExpiry ?? "");
		setVehicles(driver?.vehicles?.join(", ") ?? "");
	}, [driver?._id]);
	const submit = async (e) => {
		e.preventDefault();
		const payload = {
			name,
			phone,
			address,
			aadhar,
			dlNumber,
			dlExpiry,
			vehicles: vehicles.split(",").map((x) => x.trim()).filter(Boolean)
		};
		if (driver) await updateDriver({
			id: driver._id,
			...payload
		});
		else await createDriver(payload);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlideOver, {
		open,
		onClose,
		title: driver ? "Edit driver" : "Add driver",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Full name",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: address,
						onChange: (e) => setAddress(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Aadhar",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: aadhar,
						onChange: (e) => setAadhar(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "DL number",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: dlNumber,
							onChange: (e) => setDl(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "DL expiry",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: dlExpiry,
							onChange: (e) => setDlExpiry(e.target.value),
							required: true
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Assigned vehicles",
					hint: "Comma-separated RC numbers.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: vehicles,
						onChange: (e) => setVehicles(e.target.value)
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
						children: driver ? "Save changes" : "Create driver"
					})]
				})
			]
		})
	});
}
//#endregion
export { DriversPage as component };
