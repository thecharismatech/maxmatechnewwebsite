import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { Reveal } from "./ui";
import { ScrollWave } from "./editorial";

const faqs = [
  {
    q: "Does this replace everything we run today?",
    a: "Usually not, and that is deliberate. We start by mapping what you already run and keep the parts that work — an accountant's existing tax tool, a POS that nobody wants to touch. What changes is that the core stops being duplicated across spreadsheets. If something genuinely should be replaced, Discovery will say so with the reason attached.",
  },
  {
    q: "How long before we see anything?",
    a: "You see something inside week one of Build: the system is live for a real workflow with real data, not a sandbox demo. Meaningful throughput change usually shows between week four and month three, once the first automations are running against settled data. The chart above shows the shape we plan against, including the flat part.",
  },
  {
    q: "Do we have to move everything at once?",
    a: "No. A common shape is one core database with the highest-value modules live first — sales and inventory, or service and helpdesk — and the rest migrated module by module after the team has settled. Big-bang migrations fail for reasons that have nothing to do with software.",
  },
  {
    q: "What happens to our data?",
    a: "It ends up in your database, on infrastructure you control, in a documented schema. You own it. We do not hold your operational data hostage behind a subscription, and you can leave with a clean export whenever you want. We will show you exactly where it lives during Discovery, not after a difficult conversation.",
  },
  {
    q: "Can we keep the way we work?",
    a: "Yes — that is the point of Discovery. We have replaced enough rigid processes to know that forcing a company into someone else’s idea of correct is how projects die. Where a process is genuinely the bottleneck we will say so, show you the numbers, and let you decide.",
  },
  {
    q: "What does support actually cover?",
    a: "A real ticket queue with stated response times, infrastructure monitoring, and access to the engineers who built it — not a first line reading from a script. Operate adds a standing seat at your quarterly review so the system is tuned as your operation changes, rather than decaying after month six.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" data-scene="faq" className="section-pad relative">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.35em] text-white/48">—</span>
                <span className="h-px w-8 bg-gradient-to-r from-violet-400/60 to-transparent" />
                <span className="eyebrow text-violet-300/90">Before you ask</span>
              </div>
            </Reveal>
            <ScrollWave
              as="h2"
              className="h2-display mt-7 text-white uppercase"
              start="top 88%"
              end="bottom 55%"
            >
              The questions every serious buyer asks
            </ScrollWave>
            <Reveal delay={0.14}>
              <p className="lede mt-7 max-w-md">
                If the answer you need is not here, ask it on the discovery call — we would
                rather answer it now than after you have committed budget.
              </p>
            </Reveal>
          </div>

          <div className="border-t border-white/[0.13]">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 0.04}>
                  <div className="faq-item border-b border-white/[0.13]" data-open={isOpen}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-start gap-5 py-7 text-left"
                    >
                      <span className="font-mono text-[11px] tracking-[0.2em] text-white/28 pt-1.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display flex-1 text-lg leading-snug font-medium tracking-tight transition-colors duration-400 sm:text-xl",
                          isOpen ? "text-white" : "text-white/72 group-hover:text-white",
                        )}
                      >
                        {f.q}
                      </span>
                      <span className="faq-chevron mt-0.5 shrink-0 text-white/58 transition-transform duration-500 group-hover:text-white">
                        <Plus className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                    </button>
                    <div className="faq-body">
                      <div>
                        <p className="max-w-xl pb-8 pl-10 text-[15px] leading-relaxed text-white/55">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col items-start gap-5 rounded-3xl border border-white/[0.13] bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="font-display text-2xl font-medium tracking-tight text-white">
                Still deciding? Start with the question, not the quote.
              </p>
              <p className="mt-2 text-[14.5px] text-white/66">
                A 30-minute call, mapped to your operation, with nothing to buy at the end.
              </p>
            </div>
            <a
              href="https://wa.me/201229303030?text=Hi%20Maxmatech%2C%20I%27d%20like%20to%20book%20a%20technical%20discovery%20call.%20My%20business%20need%20is%3A%20%5Bfill%20here%5D.%20Preferred%20time%3A%20%5Bfill%20here%5D.%20Thanks%21"
              className="btn-magnetic glass-sheen inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.1] px-7 py-3.5 text-[13px] font-medium tracking-wide text-white hover:border-white/35 hover:shadow-[0_0_50px_-8px_rgba(139,92,246,0.6)]"
            >
              Book the discovery call
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
