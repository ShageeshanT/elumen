"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function DashboardNav({ compact }: { compact?: boolean }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link className="text-[var(--fg-muted)] hover:text-[var(--fg)]" href="/dashboard/connections">
          Menu
        </Link>
        <button
          type="button"
          className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
          onClick={() => void logout()}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="w-full flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-left text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] transition"
    >
      <LogOut size={14} />
      Log out
    </button>
  );
}
