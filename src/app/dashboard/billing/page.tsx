"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

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
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="surface relative overflow-hidden p-7 sm:p-9">
        <div className="aurora-bg absolute inset-0 -z-10 opacity-40" />
        <span className="pill pill-accent mb-4">Credits wallet</span>
        <h1 className="headline text-3xl sm:text-5xl">
          Buy credits.<br />
          <span className="text-[var(--accent)]">Keep agents running.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--fg-muted)] leading-relaxed">
          Purchase automation credits with Stripe Checkout. Your wallet tops up
          automatically when payment succeeds.
        </p>
      </section>

      {msg && (
        <p className="surface px-4 py-3 text-sm text-amber-300 border-amber-500/30">
          {msg}
        </p>
      )}

      <section className="grid gap-5 md:grid-cols-[1fr_0.85fr]">
        <article className="surface p-7">
          <p className="text-xs uppercase tracking-wider text-[var(--fg-dim)]">
            Starter pack
          </p>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-mono text-6xl headline tabular-nums">
              5,000
            </span>
            <span className="pb-2 text-sm text-[var(--fg-muted)]">credits</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--fg-muted)]">
            Good for testing replies, connected-tool calls, and early customer
            workflows before you tune pricing.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={() => void checkout()}
            className="btn btn-accent mt-6"
          >
            {loading ? "Redirecting…" : (<>Buy credits pack <ArrowUpRight size={14} /></>)}
          </button>
        </article>

        <article className="surface p-7">
          <p className="text-xs uppercase tracking-wider text-[var(--fg-dim)]">
            Setup checklist
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Set STRIPE_SECRET_KEY on the server",
              "Set STRIPE_PRICE_ID_CREDITS for this pack",
              "Point Stripe webhook to /api/webhooks/stripe",
              "Store STRIPE_WEBHOOK_SECRET securely",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg-muted)]"
              >
                <Check size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
