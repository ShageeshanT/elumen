"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setNotice("Check your email to confirm your account, then sign in.");
        setLoading(false);
        return;
      }

      await fetch("/api/onboarding/bootstrap", { method: "POST" });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to register. Check Supabase configuration.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="grain relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="aurora-bg absolute inset-0 -z-10" />
      <div className="absolute inset-0 dot-grid opacity-40 -z-10" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          <ArrowLeft size={14} /> Back home
        </Link>

        <div className="surface p-8">
          <div className="flex items-center gap-3 mb-7">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--accent)] text-[var(--bg)] text-sm font-bold">
              E
            </span>
            <div>
              <h1 className="text-2xl headline">Create your account</h1>
              <p className="text-sm text-[var(--fg-dim)]">
                Free to start, no card required
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                Your name
              </span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                Email
              </span>
              <input
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                Password
              </span>
              <input
                className="input"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </label>
            {error && (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {notice}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent w-full"
            >
              {loading ? "Creating account…" : (<>Get started <ArrowUpRight size={14} /></>)}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--fg-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
