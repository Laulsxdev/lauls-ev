import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { SlideOver } from "./slide-over";
import { getFleetStats } from "@/lib/mock-store";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; text: string; }

const suggestions = [
  "Fleet summary this week",
  "Which vehicle needs service?",
  "Top idling drivers",
  "Energy report",
];

// Mock AI — backend can replace with a Convex action calling OpenRouter.
function mockReply(q: string): string {
  const s = getFleetStats();
  const ql = q.toLowerCase();
  if (ql.includes("summary") || ql.includes("week")) {
    return `Current fleet snapshot: ${s.activeVehicles}/${s.totalVehicles} vehicles active, ${s.totalDrivers} drivers, ${s.totalTrips} trips logged. Total distance ${s.totalDistance.toLocaleString()} km consuming ${s.totalEnergy} kWh (avg ${s.avgConsumption} kWh/km). Average battery health across the fleet is ${s.avgBatteryHealth}%.`;
  }
  if (ql.includes("service") || ql.includes("maintenance")) {
    return `Vehicles flagged for attention are those with battery health under 70%. Fleet-wide health is ${s.avgBatteryHealth}%. Check the Vehicles page for units in "maintenance" status — there is currently ${s.totalVehicles - s.activeVehicles} non-active unit(s).`;
  }
  if (ql.includes("idl")) {
    return `Total idling time recorded: ${s.totalIdleHours} hours across all logged trips. Idle energy averages roughly 8% of trip energy. Drivers consistently above this baseline should be coached on stop-and-go behaviour.`;
  }
  if (ql.includes("energy") || ql.includes("report")) {
    return `Energy report — ${s.totalEnergy} kWh consumed across ${s.totalDistance.toLocaleString()} km, giving a fleet average of ${s.avgConsumption} kWh/km. Cargo-weight-adjusted estimate matches actuals within ~5%, suggesting healthy driving behaviour.`;
  }
  return `I can pull live numbers from your fleet. ${s.totalTrips} trips, ${s.totalVehicles} vehicles, ${s.totalDrivers} drivers right now. Ask me about consumption, idling, geofence breaches, or specific drivers.`;
}

export function AIChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setThinking(true);
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    setMessages((m) => [...m, { role: "assistant", text: mockReply(t) }]);
    setThinking(false);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      width={480}
      title={
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-accent" />
          <span>Lev-AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: "live-pulse 1.6s infinite" }} />
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="text-xs text-text-muted leading-relaxed">
                Ask the assistant about live fleet performance. Suggestions:
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-3 h-8 rounded-full text-xs text-accent border border-border-default hover:border-border-hover hover:bg-accent-soft transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed",
                m.role === "user" ? "bg-accent text-white" : "bg-bg-2 text-text-primary border border-border-default",
              )}>
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-bg-2 border border-border-default rounded-xl px-3.5 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-text-secondary"
                    style={{ animation: `typing-dot 1.2s infinite ${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="border-t border-border-default p-3 flex gap-2 shrink-0"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your fleet…"
            className="input-base flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="w-[38px] h-[38px] rounded-lg bg-accent text-white inline-flex items-center justify-center disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </SlideOver>
  );
}
