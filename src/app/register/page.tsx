"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const j = (await r.json().catch(() => ({}))) as {
      error?: string;
    };
    if (!r.ok) {
      setError(j.error ?? "Unable to register");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="animated-mesh relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-white">
      <div className="aurora" />
      <div className="noise-overlay absolute inset-0 opacity-60" />
      <div className="absolute bottom-[15%] right-[12%] h-52 w-52 rounded-full bg-fuchsia-400/20 blur-xl pulse-glow" />
      <div className="glass-card relative w-full max-w-md space-y-7 rounded-[2rem] p-8">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-fuchsia-100">
            Start building
          </p>
          <h1 className="text-3xl font-black tracking-tight">
            Create your <span className="gradient-text">agent studio</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Already onboard?{" "}
            <Link href="/login" className="font-bold text-cyan-200 underline">
              Sign in
            </Link>
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-white/70">Name</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-200/70 focus:bg-white/15"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-white/70">Email</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-200/70 focus:bg-white/15"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-white/70">Password</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-200/70 focus:bg-white/15"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="glow-button w-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 py-3 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
          >
            Start exploring
          </button>
        </form>
      </div>
    </div>
  );
}

