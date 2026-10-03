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
import { Reveal, SectionHeader } from "./ui";

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
    <section id="services" data-scene="stack" className="relative py-28 sm:py-36">
      {/* module marquee */}
      <div className="mask-fade-x mb-24 overflow-hidden border-y border-white/[0.13] py-5">
        <div className="animate-marquee flex w-max items-center gap-0">
          {[...stack, ...stack].map((item, i) => (
            <span key={i} className="flex items-center">
              <span
                className={`font-display text-sm tracking-[0.3em] uppercase ${
                  i % 2 === 0 ? "text-white/62" : "text-white/20"
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
          align="left"
          title={
            <>
              Eight capabilities.
              <br />
              <span className="serif-accent text-gradient tracking-normal normal-case">
                One operator.
              </span>
            </>
          }
          copy="From prospecting and demos to deployment and maintenance — one team across your entire digital operation, so nothing falls between vendors."
        />

        <div className="mt-16 border-t border-white/[0.13]">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={0.04}>
              <div className="group relative border-b border-white/[0.13]">
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, ${s.glow.replace(/[\d.]+\)$/, "0.14)")}, transparent 62%)`,
                  }}
                />
                <div className="relative flex items-start gap-5 py-7 sm:gap-8 sm:py-9">
                  <span className="font-display w-12 shrink-0 text-[2.6rem] leading-none font-medium tracking-tighter text-white/12 transition-colors duration-500 group-hover:text-white/62 sm:w-16 sm:text-[3.4rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="glass-chip grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                        <s.icon className="h-4 w-4 text-white/80" strokeWidth={1.6} />
                      </span>
                      <h3 className="font-display text-xl font-medium tracking-tight text-white transition-colors duration-400 group-hover:text-white/70 sm:text-[1.6rem]">
                        {s.title}
                      </h3>
                      {s.tag && (
                        <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-violet-200 uppercase">
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/62">
                      {s.copy}
                    </p>
                  </div>

                  <span className="mt-2 hidden shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-white/28 uppercase transition-colors duration-400 group-hover:text-white/80 sm:flex">
                    Deploy
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { k: "Modules live on day one", v: "Scoped to what you actually use" },
              { k: "Automation included", v: "Not an upsell, not a phase two" },
              { k: "You own the stack", v: "Database, code and documentation" },
            ].map((n) => (
              <div key={n.k} className="glass-chip rounded-2xl px-5 py-4">
                <p className="text-[13.5px] font-semibold text-white">{n.k}</p>
                <p className="mt-1 text-[12.5px] text-white/60">{n.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
