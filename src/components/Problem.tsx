import { motion } from "framer-motion";
import {
  Boxes,
  CircleDollarSign,
  Clock3,
  PlugZap,
  RefreshCw,
  TriangleAlert,
  Unplug,
  Users,
  Warehouse,
} from "lucide-react";
import { Reveal, SectionHeader } from "./ui";

const fragments = [
  {
    icon: Users,
    label: "CRM",
    status: "Offline",
    detail: "No shared pipeline",
    drift: ["-4%", "-9%"],
    delay: 0,
    tone: "amber",
  },
  {
    icon: Warehouse,
    label: "Inventory",
    status: "Drifting",
    detail: "Branch stock unseen",
    drift: ["5%", "-6%"],
    delay: 0.08,
    tone: "amber",
  },
  {
    icon: CircleDollarSign,
    label: "Accounting",
    status: "Reconciling",
    detail: "Manual month-end",
    drift: ["-6%", "7%"],
    delay: 0.16,
    tone: "rose",
  },
  {
    icon: Boxes,
    label: "POS",
    status: "Disconnected",
    detail: "Isolated registers",
    drift: ["7%", "5%"],
    delay: 0.24,
    tone: "rose",
  },
  {
    icon: PlugZap,
    label: "Integrations",
    status: "Failing",
    detail: "3 broken syncs",
    drift: ["-5%", "8%"],
    delay: 0.32,
    tone: "rose",
  },
];

const costs = [
  {
    icon: Unplug,
    title: "Six systems, zero single source of truth",
    copy: "POS registers, CRM, accounting, stock and payroll each hold their own version of the truth. Every handoff is a manual export, a re-key, or a phone call.",
  },
  {
    icon: Clock3,
    title: "Your team absorbs the gluework",
    copy: "Hours vanish into re-typing the same record, chasing mismatched reports and reconciling branches that were never designed to talk to each other.",
  },
  {
    icon: RefreshCw,
    title: "Growth multiplies the mess",
    copy: "Every new branch, channel or vertical adds another silo. Complexity compounds faster than the business can absorb it.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const toneStyles: Record<string, string> = {
  amber: "border-amber-300/25 bg-amber-400/[0.07] text-amber-200",
  rose: "border-rose-300/25 bg-rose-400/[0.07] text-rose-200",
};

export default function Problem() {
  return (
    <section id="problem" data-scene="problem" className="relative py-28 sm:py-36">
      <div className="absolute top-1/3 -left-52 -z-10 h-[36rem] w-[36rem] rounded-full bg-rose-600/8 blur-[150px]" />
      <div className="absolute -right-52 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-amber-500/6 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          index="00"
          eyebrow="The Problem"
          title={
            <>
              Your stack is
              <br />
              <span className="serif-accent tracking-normal text-rose-200/90">fractured.</span>
            </>
          }
          copy="Most businesses don't lack software — they lack one system. Until every module shares the same record, the operation runs on copy-paste and goodwill."
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <Reveal delay={0.05}>
            <div className="glass-panel panel-edge relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
              <div className="scan-rail pointer-events-none absolute inset-0" />

              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">
                  module health — no core
                </span>
                <span className="animate-link-pulse flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-rose-200 uppercase">
                  <TriangleAlert className="h-3 w-3" />
                  5 disconnected
                </span>
              </div>

              <div className="relative mt-8 space-y-3">
                {fragments.map((f) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -28, scale: 0.97 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.85, delay: f.delay, ease }}
                    className="fractured rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5"
                  >
                    <motion.div
                      animate={{
                        y: [f.drift[0], f.drift[1], f.drift[0]],
                        rotate: [0, 1.6, 0],
                      }}
                      transition={{
                        duration: 5 + f.delay * 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex items-center gap-4"
                    >
                      <span className="glass-chip grid h-10 w-10 shrink-0 place-items-center rounded-xl">
                        <f.icon className="h-4.5 w-4.5 text-white/60" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-white/85">{f.label}</p>
                        <p className="text-[11px] text-white/35">{f.detail}</p>
                      </div>
                      <span
                        className={`ml-auto shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] uppercase ${toneStyles[f.tone]}`}
                      >
                        {f.status}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <div className="relative mt-6 flex items-center gap-2.5 rounded-xl border border-dashed border-white/10 px-4 py-3">
                <Unplug className="h-4 w-4 shrink-0 text-white/25" />
                <p className="font-mono text-[10px] tracking-[0.18em] text-white/30 uppercase">
                  no shared record · no live ledger · no single dashboard
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {costs.map((c, i) => (
              <Reveal key={c.title} delay={0.08 + i * 0.08}>
                <div className="glass flex items-start gap-4 rounded-2xl p-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-rose-300/20 bg-rose-400/[0.07]">
                    <c.icon className="h-4.5 w-4.5 text-rose-200/90" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-[15px] font-medium tracking-tight text-white">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/45">{c.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
