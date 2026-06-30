import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { F as useRouter, O as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ConvexReactClient, t as ConvexProvider } from "../_libs/convex.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BfdbTNK_.js
var import_jsx_runtime = require_jsx_runtime();
var convex = new ConvexReactClient("https://vivid-monitor-607.convex.cloud");
var styles_default = "/assets/styles-DfrBjMb9.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lauls EV Fleet — Mission Control" },
			{
				name: "description",
				content: "Premium operations dashboard for electric fleet management."
			},
			{
				name: "author",
				content: "Lauls"
			},
			{
				property: "og:title",
				content: "Lauls EV Fleet"
			},
			{
				property: "og:description",
				content: "Premium operations dashboard for electric fleet management."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "theme-color",
				content: "#06060F"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConvexProvider, {
		client: convex,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
			client: queryClient,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
var $$splitComponentImporter$8 = () => import("./manual-fill-CsuILJGe.mjs");
var Route$9 = createFileRoute("/manual-fill")({
	head: () => ({ meta: [{ title: "Manual Fill — Lauls EV Fleet" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./auth-HVaCzq5i.mjs");
var Route$8 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — Lauls EV Fleet" }, {
		name: "description",
		content: "Sign in to Lauls EV Fleet operations dashboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin-BzzkB_bE.mjs");
var Route$7 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin — Lauls EV Fleet" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var Route$6 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/auth" });
} });
var $$splitComponentImporter$5 = () => import("./admin.index-BIH0e4Es.mjs");
var Route$5 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.vehicles-rS-atXs6.mjs");
var Route$4 = createFileRoute("/admin/vehicles")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.trips-Cpku5FHu.mjs");
var Route$3 = createFileRoute("/admin/trips")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.geofence-BszjT_wd.mjs");
var Route$2 = createFileRoute("/admin/geofence")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.drivers-BoMKsbkF.mjs");
var Route$1 = createFileRoute("/admin/drivers")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.bulk-oPgTbLPB.mjs");
var Route = createFileRoute("/admin/bulk")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var ManualFillRoute = Route$9.update({
	id: "/manual-fill",
	path: "/manual-fill",
	getParentRoute: () => Route$10
});
var AuthRoute = Route$8.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$10
});
var AdminRoute = Route$7.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$10
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var AdminIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminVehiclesRoute = Route$4.update({
	id: "/vehicles",
	path: "/vehicles",
	getParentRoute: () => AdminRoute
});
var AdminTripsRoute = Route$3.update({
	id: "/trips",
	path: "/trips",
	getParentRoute: () => AdminRoute
});
var AdminGeofenceRoute = Route$2.update({
	id: "/geofence",
	path: "/geofence",
	getParentRoute: () => AdminRoute
});
var AdminDriversRoute = Route$1.update({
	id: "/drivers",
	path: "/drivers",
	getParentRoute: () => AdminRoute
});
var AdminRouteChildren = {
	AdminBulkRoute: Route.update({
		id: "/bulk",
		path: "/bulk",
		getParentRoute: () => AdminRoute
	}),
	AdminDriversRoute,
	AdminGeofenceRoute,
	AdminTripsRoute,
	AdminVehiclesRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AuthRoute,
	ManualFillRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
