import { Counter, ScrollDraw } from "./scrollkit";
import { Reveal } from "./ui";

const DELIVERABLES = [
  ["Architecture decision record", "Every choice, the reason, and what would reverse it."],
  ["Source, in your repository", "The code is yours from the first commit, not on handover."],
  ["Infrastructure as code", "Reproducible from nothing, on any account you hold."],
  ["Migration and rollback plan", "Staged, reversible, with the cutover rehearsed."],
  ["Instrumentation and alerting", "Errors, latency, cost and adoption visible without asking."],
  ["Runbooks and recorded walkthroughs", "Written for the person who inherits it, not for us."],
  ["Security and access review", "Who can reach what, and what that grants."],
  ["Cost model", "What it runs at, and what happens as volume triples."],
] as const;

const FIGURES = [
  { to: 5, suffix: "", label: "Stages, in a fixed order" },
  { to: 100, suffix: "%", label: "Source handed over" },
  { to: 0, suffix: "", label: "Licences held hostage", invert: true },
  { to: 1, suffix: "", label: "Written record of every decision" },
] as const;

export default function Scope() {
  return (
    <section id="scope" data-scene="scope" className="shell section-pad">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow ink-42">The scope</p>
          <h2 className="h2-display mt-6 max-w-[15ch] text-white uppercase">
            What you receive, line by line.
          </h2>
          <p className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-white/66">
            No retained dependency, no per-seat surprise in month nine. The list below is the
            default shape of an engagement, not an upsell menu.
          </p>
        </div>

        <div>
          <ScrollDraw className="readout rounded-[22px] p-[clamp(1.4rem,3.4vw,2.6rem)]">
            <dl className="grid gap-0">
              {DELIVERABLES.map(([term, detail], i) => (
                <div
                  key={term}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-t border-white/11 py-5 first:border-t-0 first:pt-0 md:grid-cols-[1fr_1.15fr] md:gap-x-10"
                >
                  <dt className="flex items-start gap-4">
                    <span className="mt-1 font-mono text-[10.5px] tracking-[0.16em] text-white/46">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14.5px] leading-snug font-medium text-white">
                      {term}
                    </span>
                  </dt>
                  <dd className="col-start-2 text-[13.5px] leading-relaxed text-white/62 md:col-start-auto">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollDraw>
        </div>
      </div>

      <div className="mt-[clamp(3.5rem,7vw,6rem)] grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-white/11 bg-white/[0.07] lg:grid-cols-4">
        {FIGURES.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.06}>
            <div className="h-full bg-[#08080f] px-[clamp(1.1rem,2.4vw,2rem)] py-[clamp(1.6rem,3.4vw,2.6rem)]">
              <p className="font-display text-[clamp(2.2rem,4.6vw,3.4rem)] leading-none text-white">
                <Counter to={f.to} suffix={f.suffix} />
              </p>
              <p className="mt-4 max-w-[22ch] text-[12.5px] leading-relaxed text-white/58">
                {f.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
