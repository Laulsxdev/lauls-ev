import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as cn } from "./utils-BVScM_NS.mjs";
import { n as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/slide-over-DMycZxwg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SlideOver({ open, onClose, title, children, width = 480 }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none"),
		onClick: onClose
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("fixed top-0 right-0 z-50 h-full bg-bg-1 border-l border-border-default shadow-[-12px_0_48px_rgba(0,0,0,0.6)] transition-transform duration-300 flex flex-col", open ? "translate-x-0" : "translate-x-full"),
		style: { width },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between h-12 px-5 border-b border-border-default shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold text-text-primary flex items-center gap-2",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-text-primary inline-flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-auto",
			children
		})]
	})] });
}
//#endregion
export { SlideOver as t };
