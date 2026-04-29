"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AgentComposer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const r = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, instructions }),
    });
    setSaving(false);
    if (r.ok) {
      setName("");
      setInstructions("");
      router.refresh();
    }
  }

  return (
    <section className="surface p-6 sm:p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="pill mb-2">Studio</span>
          <h3 className="text-2xl headline mt-2">Create an assistant</h3>
        </div>
        <p className="max-w-sm text-sm text-[var(--fg-muted)]">
          Write simple rules. The runtime, model, and tooling stay hidden.
        </p>
      </div>
      <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
            Name
          </span>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Reception bot"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
            Behaviour & boundaries
          </span>
          <textarea
            rows={5}
            className="input resize-none"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe tone, escalation, and topics to avoid."
          />
        </label>
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving…" : "Save assistant"}
        </button>
      </form>
    </section>
  );
}
