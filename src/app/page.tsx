import Link from "next/link";
import { HeroScape } from "@/components/landing/HeroScape";
import { CalendarMockup, ChatMockup, TaskListMockup } from "@/components/landing/Mockups";
import { FAQ, Marquee, Reveal } from "@/components/landing/Sections";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const tools = [
  "WhatsApp", "Gmail", "Slack", "Calendar", "Notion",
  "Linear", "GitHub", "Stripe", "HubSpot", "Sheets",
];

const features = [
  {
    title: "Text it like a teammate",
    body: "Users message the assistant in plain language through WhatsApp. No command syntax, no setup screens.",
    Mockup: ChatMockup,
  },
  {
    title: "It actually does the work",
    body: "Your agent can follow up, draft, schedule, summarize, and trigger actions across connected tools.",
    Mockup: TaskListMockup,
  },
  {
    title: "Calendar and coordination",
    body: "Find open slots, send invites, remind people, and keep tasks moving without exposing the tech stack.",
    Mockup: CalendarMockup,
  },
];

const planHighlights = [
  "WhatsApp connection",
  "Tool integrations",
  "Credit wallet",
  "Private backend stack",
];

export default function Home() {
  return (
    <>
      <HeroScape />

      <main className="grain relative z-10 min-h-screen overflow-hidden bg-[var(--bg)]">
        <div className="relative">
          <div
            className="aurora-bg pointer-events-none absolute inset-0 -z-10 opacity-50"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-24">
            <Reveal>
              <section className="mx-auto max-w-2xl text-center">
                <p className="pill mb-5">How it works</p>
                <h2 className="headline text-4xl sm:text-6xl">
                  Simple on the outside.
                  <br />
                  Powerful underneath.
                </h2>
                <p className="mt-5 text-[var(--fg-muted)] leading-relaxed">
                  Elumen hides the backend complexity and gives non-technical
                  users one clean way to launch, connect, and manage agents.
                </p>
              </section>
            </Reveal>

            <section id="features" className="mt-14 grid gap-5 lg:grid-cols-3">
            {features.map((f, i) => {
              const M = f.Mockup;
              return (
                <Reveal key={f.title} delay={i * 0.05}>
                  <article className="surface flex h-full flex-col overflow-hidden p-5 sm:p-6">
                    <div className="mb-5">
                      <h3 className="text-2xl headline mb-3">{f.title}</h3>
                      <p className="text-[var(--fg-muted)] leading-relaxed">
                        {f.body}
                      </p>
                    </div>
                    <div className="mt-auto min-h-[280px]">
                      <M />
                    </div>
                  </article>
                </Reveal>
              );
            })}
            </section>

            <Reveal>
              <section id="integrations" className="py-20 sm:py-28">
                <div className="surface overflow-hidden p-7 sm:p-10">
                  <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                    <div>
                      <p className="pill mb-5">Integrations</p>
                      <h2 className="headline text-3xl sm:text-5xl">
                        Connect the tools people already use.
                      </h2>
                      <p className="mt-5 text-[var(--fg-muted)] leading-relaxed">
                        WhatsApp, email, calendars, docs, CRMs, payments, and
                        project tools — connected through one product experience.
                      </p>
                    </div>
                    <div>
                      <Marquee items={tools} />
                      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {tools.slice(0, 6).map((tool) => (
                          <div
                            key={tool}
                            className="surface-soft px-4 py-3 text-sm text-[var(--fg-muted)]"
                          >
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section id="pricing" className="pb-20 sm:pb-28">
                <div className="surface grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                  <div>
                    <p className="pill mb-5">Pricing</p>
                    <h2 className="headline text-3xl sm:text-5xl">
                      Start small.
                      <br />
                      Scale with credits.
                    </h2>
                    <p className="mt-5 max-w-xl text-[var(--fg-muted)] leading-relaxed">
                      Keep it simple for non-technical users: one workspace, a
                      credit wallet, and optional paid upgrades when usage grows.
                    </p>
                  </div>
                  <div className="surface-soft p-6">
                    <p className="text-sm text-[var(--fg-muted)]">Starter</p>
                    <p className="mt-2 text-5xl headline">$0</p>
                    <p className="mt-3 text-sm text-[var(--fg-muted)]">
                      Launch your first agent and test WhatsApp workflows.
                    </p>
                    <ul className="mt-6 space-y-3">
                      {planHighlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-[var(--fg-muted)]"
                      >
                        <CheckCircle2 size={15} className="text-[var(--accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                    <Link href="/register" className="btn btn-primary mt-7 w-full">
                      Get started <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </section>
            </Reveal>

            <section id="faq" className="pb-20 sm:pb-28">
              <Reveal>
                <div className="mx-auto mb-10 max-w-2xl text-center">
                  <p className="pill mb-5">FAQ</p>
                  <h2 className="headline text-4xl sm:text-5xl">
                    Quick answers.
                  </h2>
                </div>
              </Reveal>
              <Reveal>
                <FAQ />
              </Reveal>
            </section>

            <Reveal>
              <section className="surface relative overflow-hidden p-8 text-center sm:p-14">
                <div className="aurora-bg absolute inset-0 -z-10 opacity-60" />
                <h2 className="headline text-4xl sm:text-6xl">
                  Launch your first agent.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-[var(--fg-muted)] leading-relaxed">
                  Keep the product beautiful and the complicated backend hidden.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/register" className="btn btn-primary">
                    Start free <ArrowUpRight size={14} />
                  </Link>
                  <Link href="/login" className="btn btn-ghost">
                    Sign in
                  </Link>
                </div>
              </section>
            </Reveal>

        <footer className="mt-20 py-10 border-t border-[var(--border)] text-sm text-[var(--fg-dim)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-[var(--bg)] font-bold text-xs">
                E
              </span>
              <span>Elumen</span>
              <span>·</span>
              <span>© 2026</span>
            </div>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-[var(--fg)]">Privacy</a>
              <a href="#" className="hover:text-[var(--fg)]">Terms</a>
              <a href="#" className="hover:text-[var(--fg)]">Status</a>
            </div>
          </div>
        </footer>
      </div>
      </div>
    </main>
    </>
  );
}
