"use client";

import { useState } from "react";
import { WhatsAppQrPoller } from "@/components/dashboard/WhatsAppQrPoller";

export default function ConnectionsPage() {
  const [busy, setBusy] = useState<string | null>(null);
  const [pairingId, setPairingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function connectGmail() {
    setBusy("gmail");
    setMessage(null);
    const r = await fetch("/api/integrations/composio/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolkitSlug: "gmail" }),
    });
    const j = (await r.json().catch(() => ({}))) as {
      redirectUrl?: string;
      error?: string;
    };
    setBusy(null);
    if (!r.ok || !j.redirectUrl) {
      setMessage(
        j.error ??
          "Integration sign-in is unavailable. Add COMPOSIO_API_KEY on the server.",
      );
      return;
    }
    window.location.href = j.redirectUrl;
  }

  async function startWhatsApp() {
    setBusy("whatsapp");
    setMessage(null);
    const r = await fetch("/api/whatsapp/pairings", { method: "POST" });
    const j = (await r.json().catch(() => ({}))) as {
      pairingId?: string;
      error?: string;
    };
    setBusy(null);
    if (!r.ok || !j.pairingId) {
      setMessage(j.error ?? "Could not create a link session.");
      return;
    }
    setPairingId(j.pairingId);
    setMessage(
      "Keep this page open while the worker pushes the QR — run npm run worker:wa beside the Next server.",
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div className="glass-card relative overflow-hidden rounded-[2rem] p-8">
        <div className="absolute right-10 top-8 h-28 w-28 rounded-full bg-emerald-300/20 blur-xl pulse-glow" />
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
          App router
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">
          Connections
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Link productivity tools through Composio and connect chat with the
          guided scan flow. Backend implementation details stay off this
          screen.
        </p>
      </div>

      {message && (
        <p className="glass-card rounded-2xl px-4 py-3 text-sm text-amber-100">
          {message}
        </p>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <article className="glass-card group relative overflow-hidden rounded-[2rem] p-6 transition hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-300/15 to-transparent opacity-70" />
          <div className="relative space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-100">
            OAuth
          </p>
          <h2 className="text-2xl font-black">Gmail</h2>
          <p className="text-sm leading-6 text-white/60">
            OAuth sign-in opens Composio&apos;s hosted authorization. When the
            toolkit is connected, your assistants can use Gmail during
            automation once you enable them in the assistant settings.
          </p>
          <button
            type="button"
            disabled={busy === "gmail"}
            onClick={() => void connectGmail()}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-zinc-950 transition hover:scale-[1.03] disabled:opacity-50"
          >
            {busy === "gmail" ? "Opening…" : "Connect Gmail"}
          </button>
          </div>
        </article>

        <article className="glass-card group relative overflow-hidden rounded-[2rem] p-6 transition hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/15 via-transparent to-fuchsia-300/15 opacity-80" />
          <div className="relative space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
            Chat
          </p>
          <h2 className="text-2xl font-black">Link chat</h2>
          <p className="text-sm leading-6 text-white/60">
            Start a session, then scan the QR with your phone. Keep the page
            open while the QR appears; a small worker process pushes updates
            securely to this dashboard.
          </p>
          <button
            type="button"
            disabled={busy === "whatsapp"}
            onClick={() => void startWhatsApp()}
            className="glow-button rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 px-5 py-2.5 text-sm font-black text-zinc-950 transition hover:scale-[1.03] disabled:opacity-50"
          >
            {busy === "whatsapp" ? "Starting…" : "Start link session"}
          </button>
          <WhatsAppQrPoller pairingId={pairingId} />
          </div>
        </article>
      </section>
    </div>
  );
}

