"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AgentComposer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, instructions }),
    });
    if (r.ok) {
      setName("");
      setInstructions("");
      router.refresh();
    }
  }

  return (
    <section className="glass-card rounded-[2rem] p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-100">
            Studio
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Create assistant
          </h3>
        </div>
        <p className="max-w-sm text-sm text-white/50">
          Write simple rules. The runtime, model, and tooling stay hidden.
        </p>
      </div>
      <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="font-semibold text-white/70">Name</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-200/70 focus:bg-white/15"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Reception bot"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold text-white/70">
            Behaviour & boundaries
          </span>
          <textarea
            rows={5}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-200/70 focus:bg-white/15"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe tone, escalation, and topics to avoid."
          />
        </label>
        <button
          type="submit"
          className="glow-button rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 px-7 py-3 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
        >
          Save assistant
        </button>
      </form>
    </section>
  );
}

