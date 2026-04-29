import { readSession } from "@/lib/auth/session";
import { getTenantForUser } from "@/lib/tenant";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AgentComposer } from "./ui";

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

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="glass-card relative overflow-hidden rounded-[2rem] p-8">
          <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-cyan-300/25 blur-xl pulse-glow" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
            Control room
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Launch agents, connect tools, and watch credits move.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
            The dashboard keeps everything product-friendly: assistants,
            connections, activity, and billing without exposing the backend
            stack.
          </p>
        </section>
        <section className="glass-card rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
            Credits available
          </p>
          <p className="mt-4 font-mono text-5xl font-black tabular-nums gradient-text">
            {w?.balanceCents ?? 0}
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200" />
          </div>
        </section>
      </div>

      <AgentComposer />

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
              Workspace
            </p>
            <h2 className="text-2xl font-black tracking-tight">Assistants</h2>
          </div>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {agents.length === 0 ? (
            <li className="glass-card rounded-[1.5rem] px-6 py-10 text-center text-sm text-white/55 md:col-span-2">
              Create your first assistant with the form above — no technical
              setup exposed here.
            </li>
          ) : (
            agents.map((a) => (
              <li
                key={a.id}
                className="glass-card group relative overflow-hidden rounded-[1.5rem] p-5 transition hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-fuchsia-400/10 opacity-0 transition group-hover:opacity-100" />
                <div className="relative">
                  <p className="text-lg font-black">{a.name}</p>
                  <p className="mt-1 text-sm text-white/55">
                    Active: {a.isActive ? "yes" : "no"}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

