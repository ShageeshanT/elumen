import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowUpRight } from "lucide-react";

export function HeroScape() {
  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-[#050814]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero/elumen-hero-scene.svg')" }}
        aria-hidden
      />

      {/* Readability: top shade for nav + title */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-transparent"
        aria-hidden
      />
      {/* Blend into rest of site */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(42vh,28rem)] bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/88 to-transparent"
        aria-hidden
      />

      {/* Fixed glass nav — visible while scrolling */}
      <header className="fixed left-0 right-0 top-0 z-[60] px-4 pt-5 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2.5 pl-4 pr-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span
              className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 shadow-lg shadow-purple-900/50"
              aria-hidden
            />
            <span className="truncate text-[15px] font-semibold tracking-tight text-white">
              Elumen
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/88 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#integrations" className="transition hover:text-white">
              Integrations
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-[13px] font-medium text-white/80 transition hover:text-white sm:inline"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-zinc-950 shadow-sm transition hover:bg-white/95 sm:px-4"
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </header>

      {/* Hero copy — sits above the scene like the reference */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-4 pb-36 pt-28 text-center sm:px-6 sm:pb-44 sm:pt-32">
        <h1 className="max-w-[14ch] text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-white sm:max-w-none sm:text-6xl sm:leading-[1.02] md:text-7xl md:leading-[1.01]">
          Get things done.
          <br />
          Automatically.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/82 sm:text-lg sm:leading-relaxed">
          An AI teammate that handles coordination, research, scheduling, and
          execution. All via your favourite channel.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition hover:bg-white/95"
          >
            Talk to sales
            <ArrowUpRight size={16} strokeWidth={2} />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/[0.06] px-6 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition hover:bg-white/[0.1]"
          >
            See how it works
          </Link>
        </div>
      </div>
    </div>
  );
}
