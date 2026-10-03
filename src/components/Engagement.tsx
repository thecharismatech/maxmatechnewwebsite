import { ArrowUpRight, Compass, Hammer, RadioTower } from "lucide-react";
import { Reveal, SectionHeader, SpotlightCard } from "./ui";

const tiers = [
  {
    icon: Compass,
    tag: "Phase 01",
    title: "Discovery",
    lead: "We read your operation before we quote a line of it.",
    copy: "Two weeks of read-only access to your processes, spreadsheets and bottlenecks. You get a costed roadmap you own — whether or not you continue with us.",
    items: [
      "Process and data-flow map",
      "Data quality audit",
      "Risk and integration register",
      "Costed roadmap with options",
      "Fixed-scope proposal",
    ],
    span: "",
    glow: "rgba(34,211,238,0.16)",
  },
  {
    icon: Hammer,
    tag: "Phase 02",
    title: "Build",
    lead: "One core. The modules you need. Nothing you don't.",
    copy: "The deployment itself — configured, migrated, integrated, and handed over with your team trained on the parts they actually touch.",
    items: [
      "Odoo install and configuration",
      "Historical data migration",
      "Custom development and API",
      "AI automations wired to live data",
      "Team training and go-live",
    ],
    span: "lg:col-span-2",
    glow: "rgba(139,92,246,0.18)",
  },
  {
    icon: RadioTower,
    tag: "Phase 03",
    title: "Operate",
    lead: "Go-live is the start of the relationship, not the end.",
    copy: "Monitoring, a real ticket queue, and a standing seat at your quarterly review so the system keeps earning its place.",
    items: [
      "24/7 infrastructure monitoring",
      "Ticket queue with response SLAs",
      "Quarterly tuning reviews",
      "Priority change budget",
      "Next-module roadmap",
    ],
    span: "",
    glow: "rgba(240,171,252,0.14)",
  },
];

export default function Engagement() {
  return (
    <section id="engagement" data-scene="engagement" className="section-pad relative">
      <div className="shell">
        <SectionHeader
          index="—"
          eyebrow="How we engage"
          title={
            <>
              Three phases.
              <br />
              <span className="serif-accent text-gradient tracking-normal normal-case">
                No surprises.
              </span>
            </>
          }
          copy="Every engagement starts with a phase you can stop after. Scope, sequence and investment are agreed in writing before anything is built — and you keep the database, the code and the roadmap either way."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08} className={t.span}>
              <SpotlightCard
                glow={t.glow}
                className="flex h-full flex-col rounded-3xl p-7 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="glass-chip grid h-12 w-12 place-items-center rounded-2xl">
                    <t.icon className="h-5 w-5 text-white/85" strokeWidth={1.6} />
                  </span>
                  <span className="eyebrow text-white/66">{t.tag}</span>
                </div>

                <h3 className="font-display mt-7 text-3xl font-medium tracking-tight text-white">
                  {t.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/80">{t.lead}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/62">{t.copy}</p>

                <ul className="mt-7 space-y-2.5 border-t border-white/[0.11] pt-6">
                  {t.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-white/60">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-violet-300/70" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center gap-2 text-[12px] font-medium tracking-wide text-white/66 transition-colors duration-300 group-hover:text-white/85">
                  <span className="font-mono tracking-[0.2em] uppercase">
                    {i === 0 ? "Start here" : i === 1 ? "Most engagements" : "Included"}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="mt-10 text-center text-[12.5px] text-white/66">
            Investment is scoped after Discovery and agreed in writing. No day-rate clock, no
            surprise invoices, and no lock-in on your data.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
