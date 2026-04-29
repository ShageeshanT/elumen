import Link from "next/link";
import { DashboardNav } from "./nav";
import { LayoutDashboard, Plug, CreditCard } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain relative flex min-h-screen overflow-hidden">
      <div className="aurora-bg absolute inset-0 -z-10 opacity-40" />
      <div className="absolute inset-0 dot-grid opacity-30 -z-10" />

      <aside className="relative z-10 hidden w-60 shrink-0 flex-col p-4 md:flex">
        <div className="surface flex h-full flex-col p-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-1 py-1">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-[var(--bg)] text-sm font-bold">
              E
            </span>
            <span>
              <span className="block text-sm font-medium">Elumen</span>
              <span className="text-[10px] text-[var(--fg-dim)] uppercase tracking-wider">
                Control room
              </span>
            </span>
          </Link>
          <nav className="mt-6 flex flex-col gap-1 text-sm">
            <NavItem href="/dashboard" icon={<LayoutDashboard size={15} />} label="Overview" />
            <NavItem href="/dashboard/connections" icon={<Plug size={15} />} label="Connections" />
            <NavItem href="/dashboard/billing" icon={<CreditCard size={15} />} label="Billing" />
          </nav>
          <div className="mt-auto pt-6">
            <DashboardNav />
          </div>
        </div>
      </aside>

      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <header className="surface m-4 flex items-center justify-between rounded-full px-4 py-2.5 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-[var(--bg)] text-xs font-bold">
              E
            </span>
            <span className="text-sm font-medium">Elumen</span>
          </Link>
          <DashboardNav compact />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[var(--fg-muted)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]"
    >
      <span className="text-[var(--fg-dim)]">{icon}</span>
      {label}
    </Link>
  );
}
