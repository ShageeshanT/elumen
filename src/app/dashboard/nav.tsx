"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardNav({ compact }: { compact?: boolean }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (compact) {
    return (
      <div className="flex gap-3 text-sm font-bold">
        <Link className="text-white/75 underline decoration-white/30" href="/dashboard/connections">
          Menu
        </Link>
        <button
          type="button"
          className="text-white/75 underline decoration-white/30"
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
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      Log out
    </button>
  );
}

