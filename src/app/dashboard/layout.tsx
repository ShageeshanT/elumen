import Link from "next/link";
import { DashboardNav } from "./nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animated-mesh relative flex min-h-screen overflow-hidden text-white">
      <div className="aurora opacity-70" />
      <div className="noise-overlay absolute inset-0 opacity-50" />
      <aside className="glass-card relative z-10 m-4 hidden w-64 flex-col rounded-[2rem] p-4 md:flex">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-sm font-black text-zinc-950 shadow-lg">
            E
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">
              Elumen
            </span>
            <span className="text-xs text-white/45">agent control room</span>
          </span>
        </Link>
        <nav className="mt-8 flex flex-col gap-2 text-sm font-semibold">
          <Link
            className="rounded-2xl px-4 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            href="/dashboard"
          >
            Overview
          </Link>
          <Link
            className="rounded-2xl px-4 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            href="/dashboard/connections"
          >
            Connections
          </Link>
          <Link
            className="rounded-2xl px-4 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            href="/dashboard/billing"
          >
            Billing
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <DashboardNav />
        </div>
      </aside>
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <header className="glass-card m-4 flex items-center justify-between rounded-3xl px-4 py-3 md:hidden">
          <Link href="/dashboard" className="font-black text-white">
            Elumen
          </Link>
          <DashboardNav compact />
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

