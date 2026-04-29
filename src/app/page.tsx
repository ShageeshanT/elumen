import Link from "next/link";

const productCards = [
  {
    eyebrow: "Build",
    title: "No-code agent studio",
    body: "Create support, lead capture, booking, and internal ops agents with plain-language rules.",
    color: "from-cyan-400/30 to-blue-500/20",
  },
  {
    eyebrow: "Connect",
    title: "Tools and WhatsApp",
    body: "Link chat, Gmail, Sheets, CRMs, calendars, and more while hiding the technical stack.",
    color: "from-fuchsia-400/30 to-purple-500/20",
  },
  {
    eyebrow: "Monetize",
    title: "Credits that make sense",
    body: "Users top up from the dashboard and see automation usage without model-provider jargon.",
    color: "from-amber-300/30 to-pink-500/20",
  },
];

const marqueeItems = [
  "WhatsApp replies",
  "Gmail workflows",
  "Lead capture",
  "Human handoff",
  "Credit wallet",
  "Tool permissions",
  "Hidden runtime",
  "Agent templates",
];

export default function Home() {
  return (
    <main className="animated-mesh relative min-h-screen overflow-hidden text-white">
      <div className="aurora" />
      <div className="noise-overlay absolute inset-0 opacity-60" />
      <div className="absolute left-8 top-28 h-32 w-32 rounded-full bg-cyan-300/25 blur-xl pulse-glow" />
      <div className="absolute bottom-24 right-8 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-xl pulse-glow" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-8 sm:px-10 lg:px-12">
        <nav className="glass-card flex items-center justify-between rounded-full px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-zinc-950">
              E
            </span>
            <span className="font-semibold tracking-tight">Elumen</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <span>Agents</span>
            <span>Connections</span>
            <span>Credits</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
              href="/login"
            >
              Log in
            </Link>
            <Link
              className="glow-button rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-950 transition hover:scale-[1.03]"
              href="/register"
            >
              Get started
            </Link>
          </div>
        </nav>

        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-100 ">
              All-in-one agent platform
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
                Build your own <span className="gradient-text">AI bot</span>{" "}
                without touching code.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                Non-technical users can launch agents, link WhatsApp and other
                tools, buy credits, and run everything from one loud, simple,
                beautiful dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="glow-button rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 px-7 py-3 text-sm font-black text-zinc-950 transition hover:scale-[1.03]"
                href="/register"
              >
                Create your first agent
              </Link>
              <Link
                className="rounded-full border border-white/15 bg-white/10 px-7 py-3 text-sm font-bold text-white shadow-2xl  transition hover:bg-white/15"
                href="/login"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div className="float-soft glass-card absolute right-0 top-0 w-full max-w-md rounded-[2rem] p-5">
              <div className="rounded-[1.5rem] bg-zinc-950/70 p-4 shadow-inner">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Agent live
                    </p>
                    <h2 className="text-xl font-bold">Reception Bot</h2>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                    Active
                  </span>
                </div>
                {[
                  ["WhatsApp", "42 chats handled", "bg-emerald-400"],
                  ["Gmail", "12 leads summarized", "bg-sky-400"],
                  ["Credits", "4,928 remaining", "bg-fuchsia-400"],
                ].map(([title, body, color]) => (
                  <div
                    key={title}
                    className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3"
                  >
                    <span className={`h-3 w-3 rounded-full ${color}`} />
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-white/50">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card absolute bottom-6 left-0 w-[78%] rounded-[1.7rem] p-5 float-soft [animation-delay:1.2s]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-100">
                User prompt
              </p>
              <p className="mt-3 text-2xl font-black tracking-tight">
                &ldquo;Reply to every new buyer, save details to Sheets, and
                ping me only when it is urgent.&rdquo;
              </p>
            </div>
          </div>
        </section>

        <div className="-mx-6 overflow-hidden border-y border-white/10 bg-white/[0.06] py-4  sm:-mx-10 lg:-mx-12">
          <div className="marquee-track flex gap-3 px-3">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-bold text-white/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <section className="grid gap-5 pb-20 md:grid-cols-3">
          {productCards.map((card) => (
            <article
              key={card.title}
              className="group glass-card relative overflow-hidden rounded-[1.7rem] p-6 transition duration-300 hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-70 transition group-hover:opacity-100`}
              />
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/55">
                  {card.eyebrow}
                </p>
                <h2 className="mt-8 text-2xl font-black tracking-tight">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

