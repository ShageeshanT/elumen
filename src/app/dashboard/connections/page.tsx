"use client";

import { useState } from "react";
import { WhatsAppQrPoller } from "@/components/dashboard/WhatsAppQrPoller";
import { Mail, MessageSquare, ArrowUpRight } from "lucide-react";

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
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="surface relative overflow-hidden p-7 sm:p-9">
        <div className="aurora-bg absolute inset-0 -z-10 opacity-40" />
        <span className="pill pill-accent mb-4">App router</span>
        <h1 className="headline text-3xl sm:text-5xl">
          Connect your tools
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--fg-muted)] leading-relaxed">
          Link the apps you already use. Sign in once and your assistants take it
          from there — backend details stay tucked away.
        </p>
      </section>

      {message && (
        <p className="surface px-4 py-3 text-sm text-amber-300 border-amber-500/30">
          {message}
        </p>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <article className="surface p-7">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-rose-500/15 text-rose-400">
            <Mail size={18} />
          </span>
          <h2 className="mt-5 text-xl headline">Gmail</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
            OAuth sign-in opens Composio&apos;s hosted authorization. Once
            connected, your assistants can use Gmail during automation.
          </p>
          <button
            type="button"
            disabled={busy === "gmail"}
            onClick={() => void connectGmail()}
            className="btn btn-primary mt-5"
          >
            {busy === "gmail" ? "Opening…" : (<>Connect Gmail <ArrowUpRight size={14} /></>)}
          </button>
        </article>

        <article className="surface p-7">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <MessageSquare size={18} />
          </span>
          <h2 className="mt-5 text-xl headline">Link chat</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
            Start a session, then scan the QR with your phone. Keep the page
            open while the QR appears; a small worker pushes updates securely
            here.
          </p>
          <button
            type="button"
            disabled={busy === "whatsapp"}
            onClick={() => void startWhatsApp()}
            className="btn btn-accent mt-5"
          >
            {busy === "whatsapp" ? "Starting…" : (<>Start link session <ArrowUpRight size={14} /></>)}
          </button>
          <div className="mt-5">
            <WhatsAppQrPoller pairingId={pairingId} />
          </div>
        </article>
      </section>
    </div>
  );
}
