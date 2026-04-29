import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AgentComposer } from "./ui";
import { Sparkles, Activity, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const s = await readSession();
  if (!s) redirect("/login");
  const tenant = await getTenantForUser(s.userId);
  if (!tenant) redirect("/login");

  const agents = await db
    .select()
    .from(schema.agents)
    .where(eq(schema.agents.tenantId, tenant.tenantId));

  const [w] = await db
    .select({ balanceCents: schema.wallets.balanceCents })
    .from(schema.wallets)
    .where(eq(schema.wallets.tenantId, tenant.tenantId))
    .limit(1);

  const balance = w?.balanceCents ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero strip */}
      <section className="surface relative overflow-hidden p-7 sm:p-9">
        <div className="aurora-bg absolute inset-0 -z-10 opacity-50" />
        <span className="pill pill-accent mb-4">
          <Sparkles size={11} /> Control room
        </span>
        <h1 className="headline text-3xl sm:text-5xl">
          Welcome back.
        </h1>
        <p className="mt-3 text-[var(--fg-muted)] max-w-xl leading-relaxed">
          Spin up assistants, link tools, top up credits — everything from one place.
        </p>
      </section>

      {/* Stat row */}
      <section className="grid gap-4 md:grid-cols-3">
        <Stat icon={<Wallet size={16} />} label="Credits available" value={balance.toLocaleString()} note="Top up in Billing" />
        <Stat icon={<Activity size={16} />} label="Active assistants" value={agents.filter((a) => a.isActive).length.toString()} note={`${agents.length} total`} />
        <Stat icon={<Sparkles size={16} />} label="This month" value="—" note="Activity feed coming soon" />
      </section>

      <AgentComposer />

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--fg-dim)]">
              Workspace
            </p>
            <h2 className="text-2xl headline">Your assistants</h2>
          </div>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {agents.length === 0 ? (
            <li className="surface flex flex-col items-center justify-center gap-2 px-6 py-12 text-center md:col-span-2">
              <Sparkles size={22} className="text-[var(--accent)]" />
              <p className="text-sm font-medium">No assistants yet</p>
              <p className="max-w-sm text-sm text-[var(--fg-muted)]">
                Create your first assistant with the form above — no technical
                setup, just plain English.
              </p>
            </li>
          ) : (
            agents.map((a) => (
              <li key={a.id} className="surface p-5 transition hover:border-[var(--border-strong)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-medium">{a.name}</p>
                    <p className="mt-1 text-xs text-[var(--fg-dim)]">
                      {a.isActive ? "Active" : "Paused"}
                    </p>
                  </div>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-md text-base ${
                      a.isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-[var(--bg-elevated)] text-[var(--fg-dim)]"
                    }`}
                  >
                    ✦
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 text-[var(--fg-dim)] text-xs uppercase tracking-wider">
        {icon} {label}
      </div>
      <p className="mt-3 font-mono text-3xl headline tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-[var(--fg-muted)]">{note}</p>
    </div>
  );
}
