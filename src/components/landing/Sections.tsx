"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

/* ---------------- Reveal wrapper ---------------- */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Industry tabs ---------------- */
const industries = [
  {
    key: "agencies",
    label: "Agencies",
    body: "You're managing multiple clients, coordinating freelancers, and pulling together reports that take hours. Elumen automates the operational overhead so your team focuses on strategy and creative.",
  },
  {
    key: "legal",
    label: "Legal & Finance",
    body: "Paralegals and analysts spend hours on scheduling, document prep, and case research. Elumen handles the repetitive coordination so senior staff focus on judgement work.",
  },
  {
    key: "healthcare",
    label: "Healthcare",
    body: "Reduce no-shows, automate appointment reminders, and free up your front desk from constant follow-ups so they can focus on patients in front of them.",
  },
  {
    key: "startups",
    label: "Startups",
    body: "A two-person team can run like ten. Elumen handles the calendars, status updates, and content drafts so you keep momentum without hiring overhead.",
  },
  {
    key: "ecom",
    label: "E-commerce",
    body: "Inventory pings, order updates, customer replies, supplier check-ins — Elumen turns the back office into a calm, automated machine.",
  },
];

export function IndustryTabs() {
  const [active, setActive] = useState(industries[0].key);
  const current = industries.find((i) => i.key === active)!;
  return (
    <div className="surface p-7 sm:p-10">
      <p className="text-sm text-[var(--fg-muted)] mb-5">
        Built for teams that run on coordination.
      </p>
      <div className="flex flex-wrap gap-2 mb-7">
        {industries.map((i) => (
          <button
            key={i.key}
            onClick={() => setActive(i.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
              active === i.key
                ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]"
                : "bg-transparent text-[var(--fg-muted)] border-[var(--border-strong)] hover:text-[var(--fg)]"
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>
      <motion.div
        key={current.key}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl sm:text-3xl headline mb-3">{current.label}</h3>
        <p className="text-[var(--fg-muted)] max-w-2xl leading-relaxed">{current.body}</p>
      </motion.div>
    </div>
  );
}

/* ---------------- Integration tags ---------------- */
const integrations = [
  "WhatsApp", "Gmail", "Outlook", "Slack",
  "Google Calendar", "Calendly", "Google Drive", "Google Docs",
  "Google Sheets", "Notion", "Dropbox", "Linear",
  "Jira", "Asana", "Trello", "GitHub",
  "Railway", "Canva", "DALL-E", "HubSpot",
  "Salesforce", "Stripe", "Xero", "QuickBooks",
];

export function IntegrationsCloud() {
  return (
    <div className="surface p-7 sm:p-10">
      <p className="pill mb-4">Integrations</p>
      <h2 className="headline text-3xl sm:text-5xl mb-3">
        Connects to the tools<br />you already use.
      </h2>
      <p className="text-[var(--fg-muted)] max-w-xl mb-8">
        Communication, calendars, documents, project management, dev tools, and more.
      </p>
      <div className="flex flex-wrap gap-2">
        {integrations.map((i) => (
          <span
            key={i}
            className="rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] transition"
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Testimonials ---------------- */
const testimonials = [
  {
    name: "Bilal Ahmed",
    role: "Operations Manager",
    quote: "Elumen completely transformed how we run our agency. Hours of coordination now happen automatically through WhatsApp.",
  },
  {
    name: "Omar Raza",
    role: "CEO",
    quote: "The onboarding was seamless. Our entire team was up and running within a day — no training sessions needed.",
  },
  {
    name: "Sana Sheikh",
    role: "Business Analyst",
    quote: "Elumen replaced three separate tools for us. Scheduling, reporting, and communication — all from one thread.",
  },
  {
    name: "Farhan Siddiqui",
    role: "Marketing Director",
    quote: "Our marketing output tripled after deploying Elumen. Content briefs, social posts, and reports — all on demand.",
  },
  {
    name: "Zainab Hussain",
    role: "Project Manager",
    quote: "The AI workflows handle our entire client follow-up pipeline. Response times went from 24 hours to under 2 minutes.",
  },
  {
    name: "Hassan Ali",
    role: "E-commerce Manager",
    quote: "Since using Elumen, our store operations run themselves. Inventory, orders, customer replies — all automated.",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.05}>
          <div className="surface p-6 h-full flex flex-col">
            <p className="text-[var(--fg)] leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-[var(--fg-dim)]">{t.role}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------- FAQ accordion ---------------- */
const faqs = [
  {
    q: "What is Elumen?",
    a: "Elumen is an AI teammate platform that handles coordination, communication, research, scheduling, and execution. It works through WhatsApp and connects to your existing tools — no new software to learn.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT answers questions. Elumen does the work — sends emails, books meetings, creates documents, coordinates with your team, and delivers finished outputs. Not just suggestions.",
  },
  {
    q: "Do I need technical expertise?",
    a: "No. You message your assistant in plain language. There are no commands, no syntax, no dashboards to memorize. If you can text a teammate, you can use Elumen.",
  },
  {
    q: "What tools do you integrate with?",
    a: "WhatsApp, Gmail, Google Calendar, Drive, Notion, Slack, Linear, Jira, GitHub, Stripe, HubSpot, and many more — through Composio. If you have a specific tool, we can build the connector.",
  },
  {
    q: "How long does it take to deploy?",
    a: "Most teams are fully operational within 3–5 business days. We handle setup, integrations, and onboarding so no technical team is required on your end.",
  },
  {
    q: "Does it replace my staff?",
    a: "No. Elumen handles the coordination, admin, and repetitive execution that pulls skilled people away from higher-value work. Think of it as adding a highly capable team member.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="surface divide-y divide-[var(--border)]">
      {faqs.map((f, i) => {
        const active = open === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setOpen(active ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--bg-elevated)] transition"
            >
              <span className="text-base sm:text-lg font-medium">{f.q}</span>
              <span className="shrink-0 text-[var(--fg-muted)]">
                {active ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{
                height: active ? "auto" : 0,
                opacity: active ? 1 : 0,
              }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-[var(--fg-muted)] leading-relaxed max-w-2xl">
                {f.a}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Marquee ---------------- */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden mask-fade">
      <div className="marquee-track flex gap-3">
        {[...items, ...items].map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] px-4 py-2 text-sm text-[var(--fg-muted)] whitespace-nowrap"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export { ChevronDown };
