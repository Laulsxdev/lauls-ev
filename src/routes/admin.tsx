import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGuard } from "@/lib/auth-guard";
import { Sidebar } from "@/components/sidebar";
import { AIChatPanel } from "@/components/ai-chat-panel";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Lauls EV Fleet" }] }),
  component: () => (<AuthGuard role="admin"><AdminLayout /></AuthGuard>),
});

function AdminLayout() {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-bg-0">
      <Sidebar onOpenAI={() => setAiOpen(true)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Outlet />
      </div>
      <AIChatPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
