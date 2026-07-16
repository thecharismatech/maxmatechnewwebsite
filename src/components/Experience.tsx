import { Compass, Gauge, Infinity as InfinityIcon, Wrench, Zap } from "lucide-react";
import { Counter, Reveal, SectionHeader, SpotlightCard } from "./ui";

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
    <section id="process" className="relative py-28 sm:py-36">
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
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{s.copy}</p>
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
                  <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase">
                    {m.hint}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-white/[0.06] px-6 py-5">
              <InfinityIcon className="h-4 w-4 text-violet-300" />
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                Your journey to the digital world — without endpoints
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
