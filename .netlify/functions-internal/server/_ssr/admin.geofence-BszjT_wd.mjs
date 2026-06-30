import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useQuery } from "../_libs/convex.mjs";
import { n as api } from "./utils-BVScM_NS.mjs";
import { c as Search } from "../_libs/lucide-react.mjs";
import { t as TopBar } from "./top-bar-BmO1HveU.mjs";
import { a as Input, s as Select, t as Badge } from "./ui-kit-HwiYKmg4.mjs";
import { t as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.geofence-BszjT_wd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GeofencePage() {
	const logs = useQuery(api.geofenceLogs.list) ?? [];
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const trips = useQuery(api.trips.list) ?? [];
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const filtered = (0, import_react.useMemo)(() => logs.filter((g) => {
		if (filter === "breached" && !g.breached) return false;
		if (filter === "idle" && !g.idleActive) return false;
		const t = trips.find((x) => x._id === g.tripId);
		const v = vehicles.find((x) => x._id === g.vehicleId);
		return `${t?.origin ?? ""} ${t?.destination ?? ""} ${v?.rcNumber ?? ""}`.toLowerCase().includes(q.toLowerCase());
	}), [
		logs,
		q,
		filter,
		trips,
		vehicles
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { title: "Geofence Logs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-5",
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
					placeholder: "Search trips, vehicles…",
					className: "pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: filter,
				onChange: (e) => setFilter(e.target.value),
				className: "w-[180px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All logs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "breached",
						children: "Breached only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "idle",
						children: "Currently idle"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-panel overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-border-default",
					children: [
						"Vehicle",
						"Trip",
						"Start",
						"End",
						"Idle (min)",
						"Idle state",
						"Geofence",
						""
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left section-label px-4 py-3",
						children: h
					}, h))
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 8,
					className: "text-center text-sm text-text-muted py-12",
					children: "No geofence logs."
				}) }), filtered.map((g) => {
					const v = vehicles.find((x) => x._id === g.vehicleId);
					const t = trips.find((x) => x._id === g.tripId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border-default hover:bg-bg-2 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-primary font-mono text-xs",
								children: v?.rcNumber ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary",
								children: t ? `${t.origin} → ${t.destination}` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary tabular-nums",
								children: g.tripStart ? format(new Date(g.tripStart), "dd MMM HH:mm") : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-secondary tabular-nums",
								children: g.tripEnd ? format(new Date(g.tripEnd), "dd MMM HH:mm") : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5 text-[13px] text-text-primary tabular-nums",
								children: g.idleMinutes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5",
								children: g.idleActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "amber",
									children: "Idle now"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "muted",
									children: "Moving"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3.5",
								children: g.breached ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "red",
									children: "Breached"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "green",
									children: "Within"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {})
						]
					}, g._id);
				})] })]
			})
		})]
	})] });
}
//#endregion
export { GeofencePage as component };
