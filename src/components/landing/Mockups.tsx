"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Search,
  FileText,
  Send,
  Sparkles,
  GitBranch,
  Rocket,
  AlertCircle,
  Calendar,
  Mail,
  MessageSquare,
} from "lucide-react";

/* ---------------- WhatsApp-style chat ---------------- */
export function ChatMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const messages = [
    { from: "user", text: "Schedule a meeting with Sarah tomorrow 2pm and send her the Q1 report" },
    { from: "agent", text: "Done. Calendar invite sent. Q1 report attached and delivered." },
    { from: "user", text: "Also remind me 30 min before" },
    { from: "agent", text: "Reminder set for 1:30 PM tomorrow." },
  ];

  return (
    <div ref={ref} className="surface p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
        <div className="h-8 w-8 rounded-full bg-emerald-500/20 grid place-items-center text-emerald-400">
          <MessageSquare size={14} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Elumen</p>
          <p className="text-[10px] text-[var(--fg-dim)] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            online
          </p>
        </div>
      </div>
      <div className="flex-1 space-y-2 py-3 overflow-hidden">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.6, duration: 0.35 }}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                m.from === "user"
                  ? "bg-emerald-500/15 text-emerald-50 rounded-br-sm"
                  : "bg-[var(--bg-elevated)] text-[var(--fg)] rounded-bl-sm border border-[var(--border)]"
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 3, duration: 0.3 }}
          className="flex justify-start"
        >
          <div className="bg-[var(--bg-elevated)] rounded-2xl rounded-bl-sm px-3 py-2.5 border border-[var(--border)]">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Task list ticking off ---------------- */
export function TaskListMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const tasks = [
    "Send Q1 report to Sarah",
    "Book meeting room B-4",
    "Create slide deck from brief",
    "Deploy staging build",
    "Notify #team-eng on Slack",
  ];

  return (
    <div ref={ref} className="surface p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium">Executing tasks</p>
        <p className="text-xs text-[var(--fg-dim)]">3 of 5 done</p>
      </div>
      <div className="space-y-2">
        {tasks.map((t, i) => {
          const done = i < 3;
          return (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.25, duration: 0.3 }}
              className="flex items-center gap-3 rounded-lg bg-[var(--bg-elevated)] px-3 py-2.5 border border-[var(--border)]"
            >
              {done ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Circle size={16} className="text-[var(--fg-dim)] shrink-0" />
              )}
              <span
                className={`text-xs ${
                  done ? "text-[var(--fg-muted)] line-through" : "text-[var(--fg)]"
                }`}
              >
                {t}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Skill chain ---------------- */
export function SkillChainMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { icon: Search, label: "Research", note: "12 sources found" },
    { icon: FileText, label: "Summarize", note: "Key points extracted" },
    { icon: Sparkles, label: "Present", note: "Slide deck created" },
    { icon: Send, label: "Send", note: "Delivered to team" },
  ];

  return (
    <div ref={ref} className="surface p-5 h-full">
      <p className="text-sm font-medium mb-4">Skill chain</p>
      <div className="space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.4, duration: 0.35 }}
              className="flex items-center gap-3 rounded-lg bg-[var(--bg-elevated)] px-3 py-2.5 border border-[var(--border)] relative overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={inView ? { x: "100%" } : {}}
                transition={{ delay: 0.3 + i * 0.4, duration: 0.8 }}
                className="absolute inset-0 shimmer"
              />
              <div className="relative h-7 w-7 rounded-md bg-[var(--accent-soft)] grid place-items-center text-[var(--accent)] shrink-0">
                <Icon size={13} />
              </div>
              <div className="relative flex-1">
                <p className="text-xs font-medium">{s.label}</p>
                <p className="text-[10px] text-[var(--fg-dim)]">{s.note}</p>
              </div>
              <CheckCircle2 size={14} className="relative text-emerald-400" />
            </motion.div>
          );
        })}
      </div>
      <p className="text-[10px] text-[var(--fg-dim)] mt-4 text-center">
        All 4 skills completed in 8s
      </p>
    </div>
  );
}

/* ---------------- Calendar slot finder ---------------- */
export function CalendarMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const slots = [
    { time: "9:00", label: "Available", state: "free" },
    { time: "10:00", label: "Design Review", state: "busy" },
    { time: "11:00", label: "Available", state: "free" },
    { time: "12:00", label: "Lunch", state: "busy" },
    { time: "1:00", label: "Sprint Planning", state: "busy" },
    { time: "2:00", label: "✓ Best slot — invite sent", state: "picked" },
    { time: "3:00", label: "Available", state: "free" },
  ];

  return (
    <div ref={ref} className="surface p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium flex items-center gap-2">
          <Calendar size={14} className="text-[var(--accent)]" /> Finding a slot
        </p>
        <p className="text-[10px] text-[var(--fg-dim)]">Tue, Mar 31</p>
      </div>
      <div className="space-y-1.5">
        {slots.map((s, i) => (
          <motion.div
            key={s.time}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`flex items-center gap-3 rounded-md px-2.5 py-1.5 text-xs border ${
              s.state === "picked"
                ? "bg-[var(--accent-soft)] border-[var(--accent)]/40 text-[var(--accent)]"
                : s.state === "busy"
                ? "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--fg-muted)]"
                : "bg-transparent border-[var(--border)] text-[var(--fg-dim)]"
            }`}
          >
            <span className="font-mono w-10 text-[10px]">{s.time}</span>
            <span className="flex-1">{s.label}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] text-emerald-400 mt-3 font-medium">
        Meeting booked with Sarah · 2:00–2:30 PM
      </p>
    </div>
  );
}

/* ---------------- Daily Brief ---------------- */
export function DailyBriefMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    { icon: Calendar, color: "text-sky-400", text: "3 meetings today — 10am design review, 1pm sprint, 4pm client call" },
    { icon: Mail, color: "text-amber-400", text: "Pending: Sarah hasn't replied to the proposal you sent Friday" },
    { icon: AlertCircle, color: "text-rose-400", text: "Q1 board deck is due tomorrow — draft is 80% complete" },
    { icon: Rocket, color: "text-violet-400", text: "Staging deploy failed last night — DevOps notified" },
  ];

  return (
    <div ref={ref} className="surface p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium">Daily Brief</p>
        <p className="text-[10px] text-[var(--fg-dim)]">Today, 8:00 AM</p>
      </div>
      <div className="space-y-2.5">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.18 }}
              className="flex items-start gap-2.5 text-xs leading-relaxed"
            >
              <Icon size={14} className={`${it.color} shrink-0 mt-0.5`} />
              <span className="text-[var(--fg-muted)]">{it.text}</span>
            </motion.div>
          );
        })}
      </div>
      <p className="text-[10px] text-[var(--fg-dim)] mt-4 pt-3 border-t border-[var(--border)]">
        Based on your calendar, email, Slack, and project context
      </p>
    </div>
  );
}

/* ---------------- Content generated ---------------- */
export function ContentGenMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const files = [
    { icon: "📄", name: "Project_Atlas_Proposal.pdf", note: "12 pages" },
    { icon: "📊", name: "Atlas_Deck.pptx", note: "8 slides" },
    { icon: "📋", name: "Cost_Breakdown.xlsx", note: "3 sheets" },
  ];

  return (
    <div ref={ref} className="surface p-5 h-full">
      <p className="text-sm font-medium mb-3">Content generated</p>
      <div className="rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] p-3 mb-3">
        <p className="text-[10px] text-[var(--fg-dim)] mb-1">Prompt</p>
        <p className="text-xs italic text-[var(--fg-muted)]">
          &ldquo;Create a client proposal for Project Atlas based on last week&rsquo;s meeting notes&rdquo;
        </p>
      </div>
      <div className="space-y-2">
        {files.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 + i * 0.25, type: "spring", stiffness: 220 }}
            className="flex items-center gap-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2.5"
          >
            <span className="text-lg">{f.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-medium">{f.name}</p>
              <p className="text-[10px] text-[var(--fg-dim)]">{f.note}</p>
            </div>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--fg-dim)] mt-3 text-center">
        Generated from meeting notes + project context in 14s
      </p>
    </div>
  );
}

/* ---------------- DevOps mockup ---------------- */
export function DevOpsMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const commits = [
    { hash: "a3f8c21", msg: "fix: resolve auth token refresh", time: "2m ago" },
    { hash: "e7b1d04", msg: "feat: add webhook retry logic", time: "18m ago" },
    { hash: "c92e6fa", msg: "chore: bump deps", time: "1h ago" },
  ];

  return (
    <div ref={ref} className="surface p-5 h-full">
      <p className="text-sm font-medium mb-3 flex items-center gap-2">
        <GitBranch size={14} className="text-[var(--accent)]" />
        Elumen DevOps
      </p>
      <div className="space-y-1.5 mb-4">
        {commits.map((c, i) => (
          <motion.div
            key={c.hash}
            initial={{ opacity: 0, x: -6 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.18 }}
            className="flex items-center gap-2 text-[11px] font-mono"
          >
            <span className="text-[var(--accent)]">{c.hash}</span>
            <span className="text-[var(--fg-muted)] flex-1 truncate">{c.msg}</span>
            <span className="text-[var(--fg-dim)]">{c.time}</span>
          </motion.div>
        ))}
      </div>
      <div className="rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            Production
          </span>
          <span className="text-[var(--fg-dim)] font-mono text-[10px]">live</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 pulse-dot" />
            Staging
          </span>
          <span className="text-[var(--fg-dim)] font-mono text-[10px]">deploying...</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Counter ---------------- */
export function Counter({
  to,
  duration = 1.5,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(eased * to);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}
      {n.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
