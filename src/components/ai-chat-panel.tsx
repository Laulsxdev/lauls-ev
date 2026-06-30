import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useQuery, useAction } from "convex/react";
import { api } from "@convex/_generated/api";
import Markdown from "react-markdown";
import { SlideOver } from "./slide-over";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; text: string; }

const suggestions = [
  "Fleet summary this week",
  "Which vehicle needs service?",
  "Top idling drivers",
  "Energy report",
  "Compare driver efficiency",
  "Geofence breach report",
];

export function AIChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chat = useAction(api.chat.chat);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t) return;
    const userMsg = { role: "user" as const, text: t };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    try {
      const history = [...messages, userMsg].slice(-10).map((m) => ({
        role: m.role,
        content: m.text,
      }));
      const reply = await chat({ message: t, history });
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Error connecting to AI. Try again." }]);
    }
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
                <Markdown components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  table: ({ children }) => <div className="overflow-x-auto my-2"><table className="w-full text-xs border-collapse">{children}</table></div>,
                  thead: ({ children }) => <thead className="border-b border-border-default">{children}</thead>,
                  th: ({ children }) => <th className="text-left px-2 py-1 text-text-muted font-medium">{children}</th>,
                  td: ({ children }) => <td className="px-2 py-1 text-text-primary border-b border-border-default">{children}</td>,
                  strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
                  code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-bg-3 text-[12px] font-mono">{children}</code>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                  h1: ({ children }) => <h1 className="text-base font-bold text-text-primary mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold text-text-primary mb-1 mt-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xs font-bold text-text-primary mb-1 mt-2">{children}</h3>,
                }}>{m.text}</Markdown>
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
