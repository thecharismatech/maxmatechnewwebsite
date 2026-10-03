import {
  CheckCircle2,
  Compass,
  Gauge,
  Infinity as InfinityIcon,
  Route,
  Timer,
  Users,
  Warehouse,
  Wrench,
  Zap,
} from "lucide-react";
import { Counter, Reveal, SectionHeader, SpotlightCard } from "./ui";

const baselines = [
  { icon: Timer, k: "Order-to-cash", v: "cycle time", c: "text-violet-300" },
  { icon: Warehouse, k: "Stock accuracy", v: "across branches", c: "text-cyan-300" },
  { icon: Users, k: "Admin effort", v: "manual hours", c: "text-fuchsia-300" },
  { icon: Gauge, k: "Reporting", v: "data latency", c: "text-emerald-300" },
];

const supportLoop = [
  { icon: Zap, k: "Raise", v: "Portal · email · app" },
  { icon: Route, k: "Triage", v: "Priority routed automatically" },
  { icon: Wrench, k: "Resolve", v: "Engineer assigned and working" },
  { icon: CheckCircle2, k: "Verify", v: "Confirmed, then closed" },
];

const steps = [
  {
    icon: Compass,
    num: "01",
    title: "Discover",
    copy: "We assess your needs, map every workflow and define what 'scaled' means for your operation.",
  },
  {
    icon: Wrench,
    num: "02",
    title: "Engineer",
    copy: "Odoo is implemented and customized around your exact processes — never the other way around.",
  },
  {
    icon: Zap,
    num: "03",
    title: "Automate",
    copy: "AI automations and integrations connect your branches so data flows freely, everywhere.",
  },
  {
    icon: Gauge,
    num: "04",
    title: "Scale",
    copy: "Hardened infrastructure, security and 24/7 ticketing keep you reliable while you grow.",
  },
];

const metrics = [
  { value: 77, suffix: "%", label: "Avg. efficiency gain", hint: "across deployments" },
  { value: 6, suffix: "", label: "Industry verticals", hint: "retail to construction" },
  { value: 24, suffix: "/7", label: "Ticket response", hint: "always-on support" },
  { value: 360, suffix: "°", label: "Coverage", hint: "ERP to brand identity" },
];

export default function Experience() {
  return (
    <section id="process" data-scene="proof" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          index="03"
          eyebrow="The Process"
          title={
            <>
              Engineered momentum,
              <br />
              <span className="serif-accent text-gradient tracking-normal">start to scale.</span>
            </>
          }
          copy="A proven four-phase method refined over years as a trusted Odoo partner — no endpoints, no dead ends, just forward."
        />

        {/* steps rail */}
        <div className="relative mt-16">
          <div className="absolute top-24 right-[6%] left-[6%] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1}>
                <SpotlightCard className="group h-full rounded-3xl p-7">
                  <div className="flex items-center justify-between">
                    <span className="glass-chip grid h-11 w-11 place-items-center rounded-xl transition-all duration-500 group-hover:border-violet-300/30 group-hover:bg-violet-400/10">
                      <s.icon
                        className="h-5 w-5 text-white/75 transition-colors group-hover:text-violet-300"
                        strokeWidth={1.6}
                      />
                    </span>
                    <span className="font-display text-outline text-4xl font-semibold">{s.num}</span>
                  </div>
                  <h3 className="font-display mt-8 text-xl font-medium tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/62">{s.copy}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* metrics band */}
        <Reveal delay={0.1} className="mt-20">
          <div className="glass-deep relative overflow-hidden rounded-[2rem]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
            <div className="absolute top-0 left-1/4 h-40 w-72 rounded-full bg-violet-600/15 blur-[90px]" />
            <div className="absolute right-1/5 bottom-0 h-40 w-72 rounded-full bg-cyan-500/10 blur-[90px]" />

            <div className="grid divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              {metrics.map((m) => (
                <div key={m.label} className="relative px-8 py-10 text-center sm:py-12">
                  <p className="font-display text-5xl font-medium tracking-tight text-white sm:text-6xl">
                    <Counter value={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-3 text-sm font-semibold text-white/80">{m.label}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-white/48 uppercase">
                    {m.hint}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-white/[0.13] px-6 py-5">
              <InfinityIcon className="h-4 w-4 text-violet-300" />
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/58 uppercase">
                Your journey to the digital world — without endpoints
              </p>
            </div>
          </div>
        </Reveal>

        {/* evidence + always-on loop */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <Reveal delay={0.06}>
            <div className="glass-panel panel-edge h-full rounded-[2rem] p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.3em] text-violet-300/90 uppercase">
                  Social proof
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-violet-400/40 to-transparent" />
              </div>
              <h3 className="font-display mt-5 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                What the <span className="text-gradient">+77%</span> is actually measured on
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/62">
                Every deployment is baselined against the process you run today, then re-measured
                after go-live. No vanity metrics — four operational baselines, signed off with you.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {baselines.map((b) => (
                  <div key={b.k} className="glass-chip rounded-2xl px-4 py-4">
                    <b.icon className={`h-4 w-4 ${b.c}`} strokeWidth={1.7} />
                    <p className="mt-2.5 text-[13px] font-semibold text-white">{b.k}</p>
                    <p className="mt-0.5 text-[11px] text-white/58">{b.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="glass-deep h-full rounded-[2rem] p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-300/90 uppercase">
                  Always-on support
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
                <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>

              <div className="scan-rail relative mt-7 space-y-3">
                {supportLoop.map((s, i) => (
                  <div
                    key={s.k}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.13] bg-white/[0.02] px-4 py-3.5"
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <s.icon className="h-4 w-4 shrink-0 text-cyan-300" strokeWidth={1.7} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white">{s.k}</p>
                      <p className="text-[11px] text-white/58">{s.v}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-white/52 uppercase">
                24/7 · first response &lt; 2 hours · defined path to resolution
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
