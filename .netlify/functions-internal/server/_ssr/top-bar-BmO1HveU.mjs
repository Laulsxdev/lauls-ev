import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as getProfile } from "./utils-BVScM_NS.mjs";
import { b as Bell, c as Search } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/top-bar-BmO1HveU.js
var import_jsx_runtime = require_jsx_runtime();
function TopBar({ title }) {
	const profile = getProfile();
	const initials = profile ? profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "h-12 px-6 flex items-center justify-between border-b border-border-default bg-bg-0 sticky top-0 z-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-[18px] font-semibold text-text-primary",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative hidden md:block w-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						placeholder: "Search…",
						className: "w-full h-8 pl-8 pr-3 bg-transparent border border-transparent hover:border-border-default focus:border-border-focus rounded-md text-xs text-text-primary placeholder:text-text-disabled outline-none transition"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-text-primary inline-flex items-center justify-center relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 15 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-status-amber" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-8 rounded-full bg-accent-soft border border-border-default flex items-center justify-center text-[11px] font-semibold text-accent",
					children: initials
				})
			]
		})]
	});
}
//#endregion
export { TopBar as t };
