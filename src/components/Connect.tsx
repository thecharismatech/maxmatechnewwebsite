import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Bot,
  BrainCircuit,
  CircleDollarSign,
  GitBranch,
  LifeBuoy,
  Network,
  Sparkles,
  Users,
  Warehouse,
} from "lucide-react";
import { GlassButton, Reveal, SectionHeader } from "./ui";

const modules = [
  { icon: Users, label: "CRM" },
  { icon: Warehouse, label: "Inventory" },
  { icon: CircleDollarSign, label: "Accounting" },
  { icon: Boxes, label: "POS" },
  { icon: BrainCircuit, label: "AI Core" },
  { icon: LifeBuoy, label: "Helpdesk" },
];

const automation = [
  {
    n: "01",
    title: "One record, every module",
    copy: "A sale at the counter creates the customer, the stock movement and the ledger entry — instantly, in one database.",
  },
  {
    n: "02",
    title: "Branches on a single spine",
    copy: "Multi-branch POS, stock and reporting resolve against the same truth, so head office sees the operation as it happens.",
  },
  {
    n: "03",
    title: "AI clears the routine",
    copy: "Automations route approvals, chase payments, reconcile stock and raise the ticket before your team has to ask.",
  },
  {
    n: "04",
    title: "Always-on technical cover",
    copy: "24/7 ticketing with a defined response path keeps issues contained instead of compounding into an outage.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Connect() {
  return (
    <section id="connect" data-scene="connect" className="relative py-28 sm:py-36">
      <div className="absolute top-0 left-1/2 -z-10 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-violet-600/12 blur-[170px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="The Connect"
          title={
            <>
              One core.
              <br />
              <span className="serif-accent text-gradient tracking-normal">Everything in sync.</span>
            </>
          }
          copy="We collapse the silos into a single Odoo core, then let AI automations carry the work between them — chaos becomes a straight line from sale to ledger."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          <Reveal delay={0.05}>
            <div className="glass-panel panel-edge relative h-full overflow-hidden rounded-[2rem] p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">
                  Odoo core — shared record
                </span>
                <span className="flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-emerald-300 uppercase">
                  <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  live
                </span>
              </div>

              <div className="relative mx-auto mt-12 h-80 w-full max-w-md">
                <span className="absolute top-1/2 left-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.1]" />
                <span className="animate-spin-slow absolute top-1/2 left-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(139,92,246,0.24),rgba(34,211,238,0.14),rgba(217,70,239,0.2),rgba(139,92,246,0.24))] blur-2xl" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="animate-pulse-ring absolute -inset-6 rounded-full border border-violet-300/40" />
                  <span
                    className="animate-pulse-ring absolute -inset-6 rounded-full border border-cyan-300/30"
                    style={{ animationDelay: "1.2s" }}
                  />
                  <span className="glass-deep grid h-24 w-24 place-items-center rounded-full">
                    <Network className="h-8 w-8 text-violet-200" strokeWidth={1.3} />
                  </span>
                  <span className="absolute inset-0 -z-10 rounded-full bg-violet-500/25 blur-2xl" />
                </div>

                {modules.map((m, i) => {
                  const angle = (i / modules.length) * 360;
                  return (
                    <div
                      key={m.label}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div
                        style={{
                          transform: `rotate(${angle}deg) translateX(6.5rem) rotate(${-angle}deg)`,
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.55, y: 22 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.85, delay: 0.18 + i * 0.08, ease }}
                          className="glass-chip group flex w-20 flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-center"
                        >
                          <m.icon
                            className="h-4 w-4 text-violet-200 transition-colors duration-300 group-hover:text-cyan-300"
                            strokeWidth={1.6}
                          />
                          <span className="font-mono text-[9px] tracking-[0.1em] text-white/60 uppercase">
                            {m.label}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-6 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <Sparkles className="h-4 w-4 shrink-0 text-cyan-300" />
                <p className="shimmer-text font-mono text-[10px] font-medium tracking-[0.16em] uppercase">
                  snapped into place · 6 modules · 1 database
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {automation.map((a, i) => (
              <Reveal key={a.n} delay={0.06 + i * 0.07}>
                <div className="glass glass-sheen group relative flex items-start gap-5 rounded-2xl p-6 sm:p-7">
                  <div className="flex flex-col items-center">
                    <span className="font-display text-outline text-3xl font-semibold">{a.n}</span>
                    {i < automation.length - 1 && (
                      <span className="mt-3 h-full w-px bg-gradient-to-b from-violet-300/40 to-transparent" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-[15px] font-medium tracking-tight text-white">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/45">{a.copy}</p>
                  </div>
                  <GitBranch className="mt-1 h-4 w-4 shrink-0 text-white/15 transition-colors duration-300 group-hover:text-violet-300" />
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.36}>
              <div className="glass-deep relative overflow-hidden rounded-2xl p-6 sm:p-7">
                <div className="absolute -top-14 -right-10 h-40 w-40 rounded-full bg-cyan-500/15 blur-[70px]" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10">
                      <Bot className="h-5 w-5 text-cyan-300" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-white">
                        See it mapped to your operation
                      </p>
                      <p className="text-[12px] text-white/40">
                        A technical discovery call — no commitment, just the blueprint.
                      </p>
                    </div>
                  </div>
                  <GlassButton href="#contact" className="shrink-0">
                    Book a discovery call
                    <ArrowUpRight className="h-4 w-4" />
                  </GlassButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
