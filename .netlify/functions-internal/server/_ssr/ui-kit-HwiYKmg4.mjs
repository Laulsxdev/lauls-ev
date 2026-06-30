import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as cn } from "./utils-BVScM_NS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-kit-HwiYKmg4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SectionLabel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("section-label", className),
		children
	});
}
var Button = (0, import_react.forwardRef)(function Button({ className, variant = "primary", loading, children, disabled, ...rest }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref,
		className: cn("inline-flex items-center justify-center gap-2 font-medium text-sm rounded-lg transition active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none", {
			primary: "bg-accent text-white hover:bg-accent-hover h-[38px] px-4",
			ghost: "bg-transparent border border-border-default text-text-secondary hover:bg-bg-2 hover:text-text-primary h-[38px] px-4",
			destructive: "bg-transparent border border-status-red/30 text-status-red hover:bg-status-red/[0.08] h-[38px] px-4",
			icon: "bg-transparent text-text-secondary hover:bg-bg-2 hover:text-text-primary w-9 h-9"
		}[variant], className),
		disabled: disabled || loading,
		...rest,
		children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" }), children]
	});
});
var Input = (0, import_react.forwardRef)(function Input({ className, error, ...rest }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref,
		className: cn("input-base placeholder:text-text-disabled focus:border-border-focus focus:shadow-[0_0_0_3px_var(--color-accent-glow)]", error && "border-status-red focus:border-status-red focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]", className),
		...rest
	});
});
var Textarea = (0, import_react.forwardRef)(function Textarea({ className, ...rest }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		ref,
		className: cn("input-base placeholder:text-text-disabled focus:border-border-focus focus:shadow-[0_0_0_3px_var(--color-accent-glow)] py-2 min-h-[80px] resize-y", className),
		...rest
	});
});
var Select = (0, import_react.forwardRef)(function Select({ className, children, ...rest }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		ref,
		className: cn("input-base appearance-none pr-8 bg-no-repeat focus:border-border-focus focus:shadow-[0_0_0_3px_var(--color-accent-glow)]", "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394A3B8%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px] bg-[position:right_12px_center]", className),
		...rest,
		children
	});
});
function Field({ label, required, error, children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs font-medium text-text-secondary",
				children: [required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-accent mr-1",
					children: "·"
				}), label]
			}),
			children,
			hint && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-text-muted",
				children: hint
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-status-red",
				children: error
			})
		]
	});
}
function Badge({ variant, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full border text-[11px] font-semibold", {
			green: "bg-status-green-bg border-status-green-border text-status-green",
			amber: "bg-status-amber-bg border-status-amber-border text-status-amber",
			red: "bg-status-red-bg border-status-red-border text-status-red",
			blue: "bg-status-blue-bg border-status-blue-border text-status-blue",
			muted: "bg-bg-2 border-border-default text-text-secondary"
		}[variant]),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-1.5 h-1.5 rounded-full", {
			green: "bg-status-green",
			amber: "bg-status-amber",
			red: "bg-status-red",
			blue: "bg-status-blue",
			muted: "bg-text-muted"
		}[variant]) }), children]
	});
}
function BatteryBar({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-20 h-[5px] rounded-full bg-bg-3 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full rounded-full transition-all", value > 70 ? "bg-status-green" : value > 40 ? "bg-status-amber" : "bg-status-red"),
				style: { width: `${Math.max(2, Math.min(100, value))}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs tabular-nums text-text-primary",
			children: [value, "%"]
		})]
	});
}
//#endregion
export { Input as a, Textarea as c, Field as i, BatteryBar as n, SectionLabel as o, Button as r, Select as s, Badge as t };
