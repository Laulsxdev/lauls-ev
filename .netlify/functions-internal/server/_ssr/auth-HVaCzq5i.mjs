import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useQuery, i as useMutation } from "../_libs/convex.mjs";
import { a as getProfile, i as cn, n as api, o as setProfile } from "./utils-BVScM_NS.mjs";
import { t as Zap } from "../_libs/lucide-react.mjs";
import { a as Input, i as Field, r as Button } from "./ui-kit-HwiYKmg4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-HVaCzq5i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_CREDS = {
	email: "admin@lauls.dev",
	password: "admin123",
	name: "Admin"
};
var WORKER_CREDS = {
	email: "worker@lauls.dev",
	password: "worker123",
	name: "Field Worker"
};
function AuthPage() {
	const navigate = useNavigate();
	const profile = getProfile();
	const [role, setRole] = (0, import_react.useState)("admin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const createProfile = useMutation(api.profiles.create);
	const existingProfile = useQuery(api.profiles.getByEmail, email ? { email } : "skip");
	(0, import_react.useEffect)(() => {
		if (profile) navigate({ to: profile.role === "admin" ? "/admin" : "/manual-fill" });
	}, [profile, navigate]);
	const submit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const cred = role === "admin" ? ADMIN_CREDS : WORKER_CREDS;
		if (email !== cred.email || password !== cred.password) {
			setError(`Invalid credentials. Use ${cred.email} / ${cred.password}`);
			setLoading(false);
			return;
		}
		try {
			await new Promise((r) => setTimeout(r, 200));
			const p = existingProfile;
			if (p) {
				setProfile({
					_id: p._id,
					name: p.name,
					email: p.email,
					role
				});
				navigate({ to: role === "admin" ? "/admin" : "/manual-fill" });
				return;
			}
			setProfile({
				_id: await createProfile({
					name: cred.name,
					email: cred.email,
					role
				}),
				name: cred.name,
				email: cred.email,
				role
			});
			navigate({ to: role === "admin" ? "/admin" : "/manual-fill" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign in failed");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen flex items-center justify-center px-4 bg-bg-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-panel w-full max-w-[420px] p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center mb-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-xl bg-accent-soft border border-border-default flex items-center justify-center mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
								size: 22,
								className: "text-accent",
								fill: "currentColor"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-bold text-text-primary tracking-tight",
							children: "LAULS EV Fleet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-text-muted mt-1",
							children: "Mission control for your electric fleet"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex p-1 bg-bg-3 rounded-full mb-6",
					children: ["admin", "worker"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setRole(r);
							setEmail("");
							setPassword("");
							setError(null);
						},
						className: cn("flex-1 h-9 rounded-full text-xs font-semibold transition", role === r ? "bg-accent text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)]" : "text-text-secondary hover:text-text-primary"),
						children: r === "admin" ? "Admin" : "Worker"
					}, r))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								placeholder: role === "admin" ? "admin@lauls.dev" : "worker@lauls.dev"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Password",
							required: true,
							hint: role === "admin" ? "Hint: admin123" : "Hint: worker123",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								placeholder: "Enter password"
							})
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							loading,
							className: "w-full h-11",
							children: ["Sign in as ", role]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 text-center space-y-1 text-[11px] text-text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-text-secondary font-semibold",
						children: "Admin"
					}), " admin@lauls.dev / admin123"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-text-secondary font-semibold",
						children: "Worker"
					}), " worker@lauls.dev / worker123"] })]
				})
			]
		})
	});
}
//#endregion
export { AuthPage as component };
