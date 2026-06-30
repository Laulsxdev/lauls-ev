import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useQuery, i as useMutation } from "../_libs/convex.mjs";
import { i as cn, n as api, t as AuthGuard } from "./utils-BVScM_NS.mjs";
import { T as Sparkles, _ as Download, i as Upload, p as LogOut, t as Zap, v as Check, w as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as Input, c as Textarea, i as Field, o as SectionLabel, r as Button, s as Select, t as Badge } from "./ui-kit-HwiYKmg4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/manual-fill-CsuILJGe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ManualFillPage() {
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("driver");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "h-14 px-6 flex items-center justify-between border-b border-border-default bg-bg-0 sticky top-0 z-30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-lg bg-accent-soft border border-border-default flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
							size: 16,
							className: "text-accent",
							fill: "currentColor"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-text-primary",
							children: "LAULS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-text-muted",
							children: "EV Fleet · Field Worker"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "blue",
						children: "worker"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							localStorage.removeItem("lauls-ev-profile");
							navigate({ to: "/auth" });
						},
						className: "w-8 h-8 rounded-md text-text-secondary hover:bg-bg-2 hover:text-status-red inline-flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 14 })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border-default px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-[680px] mx-auto flex gap-6 overflow-x-auto",
					children: [
						{
							key: "driver",
							label: "Driver"
						},
						{
							key: "vehicle",
							label: "Vehicle"
						},
						{
							key: "trip",
							label: "Trip"
						},
						{
							key: "geofence",
							label: "Geofence"
						},
						{
							key: "import",
							label: "Import CSV"
						},
						{
							key: "export",
							label: "Export Data"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(t.key),
						className: cn("py-3 text-xs font-semibold uppercase tracking-wider transition border-b-2", tab === t.key ? "text-text-primary border-accent" : "text-text-muted border-transparent hover:text-text-secondary"),
						children: t.label
					}, t.key))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "max-w-[680px] mx-auto px-6 py-8",
				children: [
					tab === "driver" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriverForm, {}),
					tab === "vehicle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleForm, {}),
					tab === "trip" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripForm, {}),
					tab === "geofence" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeofenceForm, {}),
					tab === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CSVImport, {}),
					tab === "export" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CSVExport, {})
				]
			})
		]
	});
}
function DriverForm() {
	const createDriver = useMutation(api.drivers.create);
	const drivers = useQuery(api.drivers.list) ?? [];
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [aadhar, setAadhar] = (0, import_react.useState)("");
	const [dlNumber, setDlNumber] = (0, import_react.useState)("");
	const [dlExpiry, setDlExpiry] = (0, import_react.useState)("");
	const [vehicles, setVehicles] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const existingDriver = drivers.find((d) => d.aadhar === aadhar);
	const onSubmit = async (e) => {
		e.preventDefault();
		await createDriver({
			name,
			phone,
			address,
			aadhar,
			dlNumber,
			dlExpiry,
			vehicles: vehicles.split(",").map((v) => v.trim()).filter(Boolean)
		});
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
		setName("");
		setPhone("");
		setAddress("");
		setAadhar("");
		setDlNumber("");
		setDlExpiry("");
		setVehicles("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Personal Details",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							required: true
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: address,
						onChange: (e) => setAddress(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Identification",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Aadhar number",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: aadhar,
							onChange: (e) => setAadhar(e.target.value),
							required: true
						})
					}),
					aadhar && existingDriver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-[12px] text-status-amber bg-status-amber-bg border border-status-amber-border rounded-md px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
							size: 14,
							className: "shrink-0 mt-0.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"This Aadhar is already registered to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: existingDriver.name }),
							"."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "DL number",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: dlNumber,
								onChange: (e) => setDlNumber(e.target.value),
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
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, {
				label: "Assigned Vehicles",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "RC numbers",
					hint: "Comma-separated list of vehicles driven.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: vehicles,
						onChange: (e) => setVehicles(e.target.value),
						placeholder: "KA01-EV-1024, KA01-EV-2048"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitButton, {
				saved,
				children: "Save driver"
			})
		]
	});
}
function VehicleForm() {
	const createVehicle = useMutation(api.vehicles.create);
	const [rcNumber, setRc] = (0, import_react.useState)("");
	const [registrationDate, setRegDate] = (0, import_react.useState)("");
	const [trailerType, setTrailer] = (0, import_react.useState)("");
	const [manufacturer, setMfr] = (0, import_react.useState)("");
	const [manufactureDate, setMfrDate] = (0, import_react.useState)("");
	const [purchaseDate, setPurchaseDate] = (0, import_react.useState)("");
	const [batteryHealth, setBh] = (0, import_react.useState)("95");
	const [batteryCapacity, setBc] = (0, import_react.useState)("240");
	const [status, setStatus] = (0, import_react.useState)("active");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		await createVehicle({
			rcNumber,
			registrationDate,
			trailerType,
			manufacturer,
			manufactureDate,
			purchaseDate,
			batteryHealth: Number(batteryHealth),
			batteryCapacity: Number(batteryCapacity),
			status,
			soc: void 0,
			soh: void 0
		});
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
		setRc("");
		setRegDate("");
		setTrailer("");
		setMfr("");
		setMfrDate("");
		setPurchaseDate("");
		setBh("95");
		setBc("240");
		setStatus("active");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, {
				label: "Registration",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "RC number",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: rcNumber,
							onChange: (e) => setRc(e.target.value),
							required: true,
							placeholder: "KA01-EV-1024"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Registration date",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: registrationDate,
							onChange: (e) => setRegDate(e.target.value),
							required: true
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Specifications",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Trailer type",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: trailerType,
							onChange: (e) => setTrailer(e.target.value),
							required: true,
							placeholder: "Refrigerated 20ft"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Manufacturer",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: manufacturer,
								onChange: (e) => setMfr(e.target.value),
								required: true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Manufacture date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: manufactureDate,
								onChange: (e) => setMfrDate(e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Purchase date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: purchaseDate,
							onChange: (e) => setPurchaseDate(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Battery & Status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Battery health (%)",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 100,
							value: batteryHealth,
							onChange: (e) => setBh(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Battery capacity (kWh)",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: batteryCapacity,
							onChange: (e) => setBc(e.target.value),
							required: true
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "maintenance",
								children: "Under maintenance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "inactive",
								children: "Inactive"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitButton, {
				saved,
				children: "Save vehicle"
			})
		]
	});
}
function TripForm() {
	const drivers = useQuery(api.drivers.list) ?? [];
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const trips = useQuery(api.trips.list) ?? [];
	const createTrip = useMutation(api.trips.create);
	const allLocations = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		trips.forEach((t) => {
			if (t.origin) set.add(t.origin);
			if (t.destination) set.add(t.destination);
		});
		return Array.from(set).sort();
	}, [trips]);
	const [driverId, setDriverId] = (0, import_react.useState)(drivers[0]?._id ?? "");
	const [vehicleId, setVehicleId] = (0, import_react.useState)(vehicles[0]?._id ?? "");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [origin, setOrigin] = (0, import_react.useState)("");
	const [destination, setDestination] = (0, import_react.useState)("");
	const [distance, setDistance] = (0, import_react.useState)("");
	const [cargoWeight, setWeight] = (0, import_react.useState)("");
	const [energyConsumed, setEnergy] = (0, import_react.useState)("");
	const [idlingEnergy, setIdling] = (0, import_react.useState)("");
	const [estimatedRange, setRange] = (0, import_react.useState)("");
	const [manHours, setManHours] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("completed");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const distNum = parseFloat(distance) || 0;
	const weightNum = parseFloat(cargoWeight) || 0;
	const estEnergy = distNum > 0 && weightNum > 0 ? +(distNum * .25 * (1 + weightNum / 1e4)).toFixed(1) : null;
	const onSubmit = async (e) => {
		e.preventDefault();
		await createTrip({
			driverId,
			vehicleId,
			date,
			origin,
			destination,
			distance: distNum,
			cargoWeight: weightNum,
			energyConsumed: parseFloat(energyConsumed) || 0,
			idlingEnergy: parseFloat(idlingEnergy) || 0,
			estimatedRange: parseFloat(estimatedRange) || 0,
			manHours: parseFloat(manHours) || 0,
			status
		});
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
		setOrigin("");
		setDestination("");
		setDistance("");
		setWeight("");
		setEnergy("");
		setIdling("");
		setRange("");
		setManHours("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Assignment",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Driver",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: driverId,
							onChange: (e) => setDriverId(e.target.value),
							required: true,
							children: [drivers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "No drivers yet"
							}), drivers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d._id,
								children: d.name
							}, d._id))]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Vehicle",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: vehicleId,
							onChange: (e) => setVehicleId(e.target.value),
							required: true,
							children: [vehicles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "No vehicles yet"
							}), vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v._id,
								children: v.rcNumber
							}, v._id))]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Trip date",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value),
						required: true
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Route",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoCompleteField, {
					label: "Origin",
					value: origin,
					onChange: setOrigin,
					options: allLocations,
					required: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoCompleteField, {
					label: "Destination",
					value: destination,
					onChange: setDestination,
					options: allLocations,
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Trip Data",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Distance (km)",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								step: "0.1",
								value: distance,
								onChange: (e) => setDistance(e.target.value),
								required: true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cargo weight (kg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: cargoWeight,
								onChange: (e) => setWeight(e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Energy consumed (kWh)",
						hint: estEnergy != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									size: 11,
									className: "text-accent"
								}),
								" Estimated ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-text-secondary font-semibold tabular-nums",
									children: [estEnergy, " kWh"]
								}),
								" based on distance and weight."
							]
						}) : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								step: "0.1",
								value: energyConsumed,
								onChange: (e) => setEnergy(e.target.value),
								className: "pr-24"
							}), estEnergy != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setEnergy(String(estEnergy)),
								className: "absolute right-1 top-1 h-[30px] px-2 text-[11px] font-semibold text-accent hover:bg-accent-soft rounded-md inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 11 }), " Use estimate"]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Idling energy (kWh)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								step: "0.1",
								value: idlingEnergy,
								onChange: (e) => setIdling(e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Estimated range (km)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: estimatedRange,
								onChange: (e) => setRange(e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Man hours",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								step: "0.1",
								value: manHours,
								onChange: (e) => setManHours(e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: status,
								onChange: (e) => setStatus(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "planned",
										children: "Planned"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ongoing",
										children: "Ongoing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "completed",
										children: "Completed"
									})
								]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitButton, {
				saved,
				children: "Save trip"
			})
		]
	});
}
function GeofenceForm() {
	const trips = useQuery(api.trips.list) ?? [];
	const createGeofence = useMutation(api.geofenceLogs.create);
	const [tripId, setTripId] = (0, import_react.useState)(trips[0]?._id ?? "");
	const [tripStart, setStart] = (0, import_react.useState)("");
	const [tripEnd, setEnd] = (0, import_react.useState)("");
	const [idleMinutes, setIdle] = (0, import_react.useState)("");
	const [idleActive, setIdleActive] = (0, import_react.useState)(false);
	const [breached, setBreached] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		const trip = trips.find((t) => t._id === tripId);
		if (!trip) return;
		await createGeofence({
			tripId,
			vehicleId: trip.vehicleId,
			tripStart,
			tripEnd,
			idleMinutes: Number(idleMinutes) || 0,
			idleActive,
			breached
		});
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
		setStart("");
		setEnd("");
		setIdle("");
		setIdleActive(false);
		setBreached(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, {
				label: "Trip Reference",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Trip",
					required: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: tripId,
						onChange: (e) => setTripId(e.target.value),
						required: true,
						children: [trips.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "No trips yet"
						}), trips.map((t) => {
							const route = [t.origin, t.destination].filter(Boolean).join(" → ");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: t._id,
								children: [t.date, route ? ` · ${route}` : ""]
							}, t._id);
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Timing",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Trip start",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "datetime-local",
							value: tripStart,
							onChange: (e) => setStart(e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Trip end",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "datetime-local",
							value: tripEnd,
							onChange: (e) => setEnd(e.target.value),
							required: true
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Idle duration (minutes)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: idleMinutes,
						onChange: (e) => setIdle(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, {
				label: "Status Flags",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: idleActive,
							onChange: (e) => setIdleActive(e.target.checked),
							className: "accent-accent w-4 h-4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-text-primary",
							children: "Idle state currently active"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: breached,
							onChange: (e) => setBreached(e.target.checked),
							className: "accent-accent w-4 h-4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-text-primary",
							children: "Geofence was breached"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmitButton, {
				saved,
				children: "Save geofence log"
			})
		]
	});
}
function FormSection({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-border-default" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children
		})]
	});
}
function SubmitButton({ saved, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "submit",
		className: cn("w-full h-11", saved && "bg-status-green hover:bg-status-green"),
		children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), " Saved"] }) : children
	});
}
function AutoCompleteField({ label, value, onChange, options, required }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const filtered = options.filter((o) => o.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		required,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => {
					onChange(e.target.value);
					setOpen(true);
				},
				onFocus: () => setOpen(true),
				onBlur: () => setTimeout(() => setOpen(false), 150),
				required
			}), open && value && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute z-10 left-0 right-0 mt-1 bg-bg-2 border border-border-default rounded-lg overflow-hidden shadow-lg",
				children: filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onMouseDown: (e) => {
						e.preventDefault();
						onChange(o);
						setOpen(false);
					},
					className: "block w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-accent-soft transition",
					children: o
				}, o))
			})]
		})
	});
}
function CSVImport() {
	const importDrivers = useMutation(api.bulk.importDrivers);
	const importVehicles = useMutation(api.bulk.importVehicles);
	const [table, setTable] = (0, import_react.useState)("drivers");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [done, setDone] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const templates = {
		drivers: {
			headers: "name,phone,address,aadhar,dlNumber,dlExpiry,vehicles",
			example: "Rajesh Kumar,+91 98765 43210,Sector 21 Gurugram,1234 5678 9012,DL-0420180012345,2028-06-12,KA01-EV-1024, KA01-EV-2048"
		},
		vehicles: {
			headers: "rcNumber,registrationDate,trailerType,manufacturer,manufactureDate,purchaseDate,batteryHealth,batteryCapacity,status",
			example: "KA01-EV-1024,2023-03-15,Refrigerated 20ft,Tata Motors,2023-01-10,2023-03-15,92,240,active"
		},
		trips: {
			headers: "driverId,vehicleId,date,origin,destination,distance,cargoWeight,energyConsumed,idlingEnergy,estimatedRange,manHours,status",
			example: "DRIVER_ID,VEHICLE_ID,2026-01-15,Bengaluru Depot,Hyderabad,280,3500,75.2,6.0,380,5.1,completed"
		}
	};
	const downloadTemplate = () => {
		const t = templates[table];
		const blob = new Blob([t.headers + "\n" + t.example], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${table}-template.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const parseCSV = (text) => {
		const lines = text.trim().split("\n");
		if (lines.length < 2) throw new Error("CSV must have header + at least 1 data row");
		const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
		return lines.slice(1).map((line) => {
			const cols = line.split(",").map((c) => c.trim());
			const row = {};
			headers.forEach((h, i) => {
				row[h] = cols[i] ?? "";
			});
			return row;
		});
	};
	const handleFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);
		setDone(false);
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const raw = parseCSV(ev.target?.result);
				let rows;
				if (table === "drivers") rows = raw.map((r) => ({
					name: r.name || "",
					phone: r.phone || "",
					address: r.address || "",
					aadhar: r.aadhar || "",
					dlNumber: r.dlnumber || r.dlNumber || "",
					dlExpiry: r.dlexpiry || r.dlExpiry || "",
					vehicles: r.vehicles || ""
				}));
				else if (table === "vehicles") rows = raw.map((r) => ({
					rcNumber: r.rcnumber || r.rcNumber || "",
					registrationDate: r.registrationdate || r.registrationDate || "",
					trailerType: r.trailertype || r.trailerType || "",
					manufacturer: r.manufacturer || "",
					manufactureDate: r.manufacturedate || r.manufactureDate || "",
					purchaseDate: r.purchasedate || r.purchaseDate || "",
					batteryHealth: Number(r.batteryhealth || r.batteryHealth || 0),
					batteryCapacity: Number(r.batterycapacity || r.batteryCapacity || 0),
					status: r.status || "active"
				}));
				else rows = raw.map((r) => ({
					driverId: r.driverid || r.driverId || "",
					vehicleId: r.vehicleid || r.vehicleId || "",
					date: r.date || "",
					origin: r.origin || "",
					destination: r.destination || "",
					distance: Number(r.distance || 0),
					cargoWeight: Number(r.cargoweight || r.cargoWeight || 0),
					energyConsumed: Number(r.energyconsumed || r.energyConsumed || 0),
					idlingEnergy: Number(r.idlingenergy || r.idlingEnergy || 0),
					estimatedRange: Number(r.estimatedrange || r.estimatedRange || 0),
					manHours: Number(r.manhours || r.manHours || 0),
					status: r.status || "completed"
				}));
				setPreview(rows);
			} catch (err) {
				setError(err.message);
			}
		};
		reader.readAsText(file);
		e.target.value = "";
	};
	const confirmImport = async () => {
		if (!preview) return;
		try {
			if (table === "drivers") await importDrivers({ rows: preview.map((r) => ({
				name: r.name,
				phone: r.phone,
				address: r.address,
				aadhar: r.aadhar,
				dlNumber: r.dlNumber,
				dlExpiry: r.dlExpiry,
				vehicles: r.vehicles
			})) });
			else if (table === "vehicles") await importVehicles({ rows: preview });
			setPreview(null);
			setDone(true);
			setTimeout(() => setDone(false), 2e3);
		} catch (err) {
			setError(err.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
				label: "Import data from CSV",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-text-secondary",
						children: "Download a template, fill it with your data, then upload it here. You'll see a preview before anything is saved."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Data type",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: table,
							onChange: (e) => {
								setTable(e.target.value);
								setPreview(null);
								setError(null);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "drivers",
									children: "Drivers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "vehicles",
									children: "Vehicles"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "trips",
									children: "Trips"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: downloadTemplate,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 14 }), " Download template"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 14 }), " Upload CSV"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".csv",
								className: "hidden",
								onChange: handleFile
							})
						]
					}),
					done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[12px] text-status-green bg-status-green-bg border border-status-green-border rounded-md px-3 py-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), " Data imported successfully."]
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] text-status-red bg-status-red-bg border border-status-red-border rounded-md px-3 py-2",
				children: error
			}),
			preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
						"Preview — ",
						preview.length,
						" rows"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[300px] overflow-auto bg-bg-3 border border-border-default rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-default bg-bg-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 text-text-muted font-medium w-8",
									children: "#"
								}), Object.keys(preview[0] || {}).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 text-text-muted font-medium capitalize",
									children: h
								}, h))]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: preview.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-default",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-text-muted",
									children: i + 1
								}), Object.values(r).map((v, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-text-primary",
									children: String(v)
								}, j))]
							}, i)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: confirmImport,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }),
								" Confirm & save ",
								preview.length,
								" rows"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setPreview(null),
							children: "Cancel"
						})]
					})
				]
			})
		]
	});
}
function CSVExport() {
	const drivers = useQuery(api.drivers.list) ?? [];
	const vehicles = useQuery(api.vehicles.list) ?? [];
	const trips = useQuery(api.trips.list) ?? [];
	const [exportType, setExportType] = (0, import_react.useState)("drivers");
	const download = () => {
		let headers;
		let rows;
		if (exportType === "drivers") {
			headers = "name,phone,address,aadhar,dlNumber,dlExpiry,vehicles";
			rows = drivers.map((d) => [
				d.name,
				d.phone,
				d.address,
				d.aadhar,
				d.dlNumber,
				d.dlExpiry,
				d.vehicles.join(", ")
			].join(","));
		} else if (exportType === "vehicles") {
			headers = "rcNumber,registrationDate,trailerType,manufacturer,manufactureDate,purchaseDate,batteryHealth,batteryCapacity,status";
			rows = vehicles.map((v) => [
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
		} else {
			headers = "driverId,vehicleId,date,origin,destination,distance,cargoWeight,energyConsumed,idlingEnergy,estimatedRange,manHours,status";
			rows = trips.map((t) => [
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
		}
		const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${exportType}-export.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
			label: "Export data as CSV",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-text-secondary",
					children: "Download your fleet data as a CSV file for offline use or reporting."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "What to export",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: exportType,
						onChange: (e) => setExportType(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "drivers",
								children: [
									"Drivers (",
									drivers.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "vehicles",
								children: [
									"Vehicles (",
									vehicles.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "trips",
								children: [
									"Trips (",
									trips.length,
									")"
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: download,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 14 }), " Download CSV"]
				})
			]
		})
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGuard, {
	role: "worker",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManualFillPage, {})
});
//#endregion
export { SplitComponent as component };
