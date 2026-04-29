"use client";

import { useState } from "react";

export default function BillingPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    setMsg(null);
    const r = await fetch("/api/billing/checkout", { method: "POST" });
    const j = (await r.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
    };
    setLoading(false);
    if (!r.ok || !j.url) {
      setMsg(
        j.error ??
          "Billing is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_CREDITS.",
      );
      return;
    }
    window.location.href = j.url;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="glass-card relative overflow-hidden rounded-[2rem] p-8">
        <div className="absolute -right-6 top-6 h-40 w-40 rounded-full bg-amber-300/20 blur-xl pulse-glow" />
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-100">
          Credits wallet
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Buy credits. Keep agents running.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
          Purchase automation credits with Stripe Checkout. Webhooks top up your
          tenant wallet when payment succeeds.
        </p>
      </section>
      {msg && (
        <p className="glass-card rounded-2xl px-4 py-3 text-sm text-amber-100">
          {msg}
        </p>
      )}
      <section className="grid gap-6 md:grid-cols-[1fr_0.85fr]">
        <article className="glass-card relative overflow-hidden rounded-[2rem] p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/12 via-transparent to-fuchsia-300/12" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
              Starter pack
            </p>
            <div className="mt-6 flex items-end gap-2">
              <span className="font-mono text-6xl font-black gradient-text">
                5,000
              </span>
              <span className="pb-2 text-sm font-bold text-white/50">
                credits
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/58">
              Good for testing replies, connected-tool calls, and early customer
              workflows before you tune pricing.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={() => void checkout()}
              className="glow-button mt-6 rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 px-7 py-3 text-sm font-black text-zinc-950 transition hover:scale-[1.03] disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "Buy credits pack"}
            </button>
          </div>
        </article>
        <article className="glass-card rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
            Setup checklist
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            {[
              "Set STRIPE_SECRET_KEY on the server",
              "Set STRIPE_PRICE_ID_CREDITS for this pack",
              "Point Stripe webhook to /api/webhooks/stripe",
              "Store STRIPE_WEBHOOK_SECRET securely",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

