import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { P as useNavigate, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as componentsGeneric, s as anyApi } from "../_libs/convex.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-BVScM_NS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Generated `api` utility.
*
* THIS CODE IS AUTOMATICALLY GENERATED.
*
* To regenerate, run `npx convex dev`.
* @module
*/
/**
* A utility for referencing Convex functions in your app's API.
*
* Usage:
* ```js
* const myFunctionReference = api.myModule.myFunction;
* ```
*/
var api = anyApi;
componentsGeneric();
var STORAGE_KEY = "lauls-ev-profile";
function getProfile() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setProfile(p) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function clearProfile() {
	localStorage.removeItem(STORAGE_KEY);
}
function AuthGuard({ children, role }) {
	const profile = getProfile();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!mounted) return;
		if (!profile) {
			navigate({ to: "/auth" });
			return;
		}
		if (role && profile.role !== role) navigate({ to: profile.role === "admin" ? "/admin" : "/manual-fill" });
	}, [
		profile,
		role,
		mounted,
		navigate,
		pathname
	]);
	if (!mounted || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-bg-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-text-muted text-sm",
			children: "Loading…"
		})
	});
	if (role && profile.role !== role) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
export { getProfile as a, cn as i, api as n, setProfile as o, clearProfile as r, AuthGuard as t };
