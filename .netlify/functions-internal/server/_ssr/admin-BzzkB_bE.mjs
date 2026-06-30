import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { P as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useAction } from "../_libs/convex.mjs";
import { a as getProfile, i as cn, n as api, r as clearProfile, t as AuthGuard } from "./utils-BVScM_NS.mjs";
import { T as Sparkles, a as Truck, d as Menu, f as MapPin, l as Route, m as LayoutDashboard, p as LogOut, r as Users, s as Send, t as Zap, y as Bot } from "../_libs/lucide-react.mjs";
import { t as SlideOver } from "./slide-over-DMycZxwg.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BzzkB_bE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = [{
	group: "Operations",
	items: [
		{
			to: "/admin",
			label: "Dashboard",
			icon: LayoutDashboard,
			exact: true
		},
		{
			to: "/admin/trips",
			label: "Trips",
			icon: Route
		},
		{
			to: "/admin/geofence",
			label: "Geofence",
			icon: MapPin
		}
	]
}, {
	group: "Fleet",
	items: [{
		to: "/admin/vehicles",
		label: "Vehicles",
		icon: Truck
	}, {
		to: "/admin/drivers",
		label: "Drivers",
		icon: Users
	}]
}];
function Sidebar({ onOpenAI }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const profile = getProfile();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const handleLogout = () => {
		clearProfile();
		navigate({ to: "/auth" });
	};
	const isActive = (to, exact) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
	const initials = profile ? profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden md:flex flex-col h-screen sticky top-0 shrink-0 transition-[width] duration-200",
		style: {
			width: collapsed ? 64 : 240,
			background: "#08081A",
			boxShadow: "4px 0 24px rgba(0,0,0,0.4)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-4 h-16 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-lg bg-accent-soft border border-border-default flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
							size: 18,
							className: "text-accent",
							fill: "currentColor"
						})
					}),
					!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-bold text-text-primary leading-tight",
							children: "LAULS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-text-muted leading-tight",
							children: "EV Fleet"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCollapsed((v) => !v),
						className: "text-text-muted hover:text-text-primary w-7 h-7 rounded inline-flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 14 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 px-3 overflow-y-auto pb-4 space-y-5",
				children: [nav.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "section-label px-2 mb-2",
					children: group.group
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-0.5",
					children: group.items.map((item) => {
						const active = isActive(item.to, item.exact);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex items-center gap-2 h-10 px-2.5 rounded-lg text-sm transition relative", active ? "bg-accent-soft text-text-primary border-l-2 border-accent" : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								size: 18,
								className: "shrink-0"
							}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: item.label
							})]
						}, item.to);
					})
				})] }, group.group)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "section-label px-2 mb-2",
					children: "AI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onOpenAI,
					className: "w-full flex items-center gap-2 h-10 px-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/[0.03] hover:text-text-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, {
							size: 18,
							className: "shrink-0"
						}),
						!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lev-AI" }),
						!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto w-1.5 h-1.5 rounded-full bg-accent",
							style: { animation: "live-pulse 1.6s infinite" }
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border-default p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-full bg-accent-soft border border-border-default flex items-center justify-center text-xs font-semibold text-accent shrink-0",
							children: initials
						}),
						!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-text-primary truncate",
								children: profile?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-text-muted uppercase tracking-wider",
								children: profile?.role
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleLogout,
							className: "w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-status-red inline-flex items-center justify-center",
							title: "Logout",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 14 })
						})
					]
				})
			})
		]
	});
}
var suggestions = [
	"Fleet summary this week",
	"Which vehicle needs service?",
	"Top idling drivers",
	"Energy report",
	"Compare driver efficiency",
	"Geofence breach report"
];
function AIChatPanel({ open, onClose }) {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [thinking, setThinking] = (0, import_react.useState)(false);
	const scrollRef = (0, import_react.useRef)(null);
	const chat = useAction(api.chat.chat);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, thinking]);
	const send = async (text) => {
		const t = text.trim();
		if (!t) return;
		const userMsg = {
			role: "user",
			text: t
		};
		setMessages((m) => [...m, userMsg]);
		setInput("");
		setThinking(true);
		try {
			const reply = await chat({
				message: t,
				history: [...messages, userMsg].slice(-10).map((m) => ({
					role: m.role,
					content: m.text
				}))
			});
			setMessages((m) => [...m, {
				role: "assistant",
				text: reply
			}]);
		} catch {
			setMessages((m) => [...m, {
				role: "assistant",
				text: "Error connecting to AI. Try again."
			}]);
		}
		setThinking(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlideOver, {
		open,
		onClose,
		width: 480,
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					size: 14,
					className: "text-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lev-AI" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-1.5 h-1.5 rounded-full bg-accent",
					style: { animation: "live-pulse 1.6s infinite" }
				})
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scrollRef,
				className: "flex-1 overflow-y-auto px-5 py-4 space-y-3",
				children: [
					messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-text-muted leading-relaxed",
							children: "Ask the assistant about live fleet performance. Suggestions:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => send(s),
								className: "px-3 h-8 rounded-full text-xs text-accent border border-border-default hover:border-border-hover hover:bg-accent-soft transition",
								children: s
							}, s))
						})]
					}),
					messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex", m.role === "user" ? "justify-end" : "justify-start"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed", m.role === "user" ? "bg-accent text-white" : "bg-bg-2 text-text-primary border border-border-default"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
								components: {
									p: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 last:mb-0",
										children
									}),
									table: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto my-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
											className: "w-full text-xs border-collapse",
											children
										})
									}),
									thead: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "border-b border-border-default",
										children
									}),
									th: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-2 py-1 text-text-muted font-medium",
										children
									}),
									td: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1 text-text-primary border-b border-border-default",
										children
									}),
									strong: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-text-primary font-semibold",
										children
									}),
									code: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "px-1.5 py-0.5 rounded bg-bg-3 text-[12px] font-mono",
										children
									}),
									ul: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "list-disc list-inside mb-2 space-y-0.5",
										children
									}),
									h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-base font-bold text-text-primary mb-2",
										children
									}),
									h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-bold text-text-primary mb-1 mt-3",
										children
									}),
									h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold text-text-primary mb-1 mt-2",
										children
									})
								},
								children: m.text
							})
						})
					}, i)),
					thinking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-bg-2 border border-border-default rounded-xl px-3.5 py-3 flex items-center gap-1",
							children: [
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-1.5 h-1.5 rounded-full bg-text-secondary",
								style: { animation: `typing-dot 1.2s infinite ${i * .15}s` }
							}, i))
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					send(input);
				},
				className: "border-t border-border-default p-3 flex gap-2 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Ask about your fleet…",
					className: "input-base flex-1",
					onKeyDown: (e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							send(input);
						}
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: !input.trim() || thinking,
					className: "w-[38px] h-[38px] rounded-lg bg-accent text-white inline-flex items-center justify-center disabled:opacity-50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 14 })
				})]
			})]
		})
	});
}
function AdminLayout() {
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-bg-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { onOpenAI: () => setAiOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-w-0 flex flex-col",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIChatPanel, {
				open: aiOpen,
				onClose: () => setAiOpen(false)
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGuard, {
	role: "admin",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {})
});
//#endregion
export { SplitComponent as component };
