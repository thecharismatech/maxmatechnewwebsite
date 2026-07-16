import {
  ArrowUpRight,
  Bot,
  Boxes,
  CloudCog,
  Code2,
  Globe2,
  Megaphone,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { Reveal, SectionHeader, SpotlightCard } from "./ui";

const stack = [
  "Odoo ERP",
  "CRM",
  "Sales",
  "Inventory",
  "Accounting",
  "POS",
  "Helpdesk",
  "Studio",
  "HR & Payroll",
  "Project",
  "Timesheet",
  "E-Commerce",
  "AI Automation",
  "Marketing",
];

const services = [
  {
    icon: Boxes,
    title: "Odoo ERP Implementation",
    copy: "Years of trusted partnership delivering end-to-end ERP deployments — streamlining processes, enhancing efficiency, and optimizing every resource you own.",
    tag: "Flagship",
    span: "lg:col-span-2",
    glow: "rgba(139, 92, 246, 0.18)",
  },
  {
    icon: Bot,
    title: "AI Automations",
    copy: "Autonomous workflows that supercharge the Odoo ecosystem — routine tasks routed, resolved, and reported without human touch.",
    span: "",
    glow: "rgba(34, 211, 238, 0.16)",
  },
  {
    icon: Code2,
    title: "Custom Software",
    copy: "Bespoke, robust and scalable platforms engineered with an agile approach around your exact logic.",
    span: "",
    glow: "rgba(217, 70, 239, 0.15)",
  },
  {
    icon: Globe2,
    title: "Web & Mobile Apps",
    copy: "Mesmerizing websites, e-commerce and apps that showcase your brand worldwide.",
    span: "",
    glow: "rgba(139, 92, 246, 0.16)",
  },
  {
    icon: CloudCog,
    title: "Cloud & Infrastructure",
    copy: "From cloud migration to branch-wide connectivity — installation is the easy part, and our maintenance keeps it reliable. Free-flowing data, everywhere.",
    span: "lg:col-span-2",
    glow: "rgba(34, 211, 238, 0.14)",
  },
  {
    icon: ShieldCheck,
    title: "Digital Security",
    copy: "Your digital bodyguard — hardened systems for the digital age.",
    span: "",
    glow: "rgba(52, 211, 153, 0.14)",
  },
  {
    icon: Megaphone,
    title: "Multichannel Marketing",
    copy: "Let the people know you right — campaigns engineered across every channel.",
    span: "",
    glow: "rgba(251, 146, 60, 0.14)",
  },
  {
    icon: Palette,
    title: "Brand Identity",
    copy: "From logo to invoice to packaging — your brand says a lot, we make it speak.",
    span: "",
    glow: "rgba(244, 114, 182, 0.14)",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-28 sm:py-36">
      {/* module marquee */}
      <div className="mask-fade-x mb-24 overflow-hidden border-y border-white/[0.06] py-5">
        <div className="animate-marquee flex w-max items-center gap-0">
          {[...stack, ...stack].map((item, i) => (
            <span key={i} className="flex items-center">
              <span
                className={`font-display text-sm tracking-[0.3em] uppercase ${
                  i % 2 === 0 ? "text-white/45" : "text-white/20"
                }`}
              >
                {item}
              </span>
              <span className="mx-6 h-1 w-1 rounded-full bg-violet-400/50" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          index="01"
          eyebrow="The Stack"
          title={
            <>
              One partner.
              <br />
              <span className="serif-accent text-gradient tracking-normal">Every capability.</span>
            </>
          }
          copy="From prospecting and demos to deployment and maintenance — we guide you through the competition race with tailored solutions across your entire digital operation."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08} className={s.span}>
              <SpotlightCard
                glow={s.glow}
                className="flex h-full flex-col justify-between rounded-3xl p-7 sm:p-8"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="glass-chip grid h-12 w-12 place-items-center rounded-2xl">
                      <s.icon className="h-5 w-5 text-white/85" strokeWidth={1.6} />
                    </span>
                    {s.tag && (
                      <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-violet-200 uppercase">
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display mt-6 text-xl font-medium tracking-tight text-white sm:text-[1.35rem]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{s.copy}</p>
                </div>
                <div className="mt-7 flex items-center gap-2 text-[12px] font-medium text-white/30 transition-colors duration-300 group-hover:text-white/80">
                  <span className="font-mono tracking-[0.2em] uppercase">Deploy</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
