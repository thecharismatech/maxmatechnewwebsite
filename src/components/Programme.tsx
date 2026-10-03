import { useCallback, useState } from "react";
import { JourneyRail, Seam, ScrollDraw } from "./scrollkit";
import { Reveal } from "./ui";

/* Five stages, in the only order that works. Each stage produces what
   the next one needs. Duration is deliberately absent: we do not quote
   a timeline we have not held across repeated engagements. */
const STAGES = [
  {
    n: "01",
    name: "Diagnose",
    tagline: "Finding the fracture before touching anything",
    open:
      "Most systems were never designed to be changed. They were assembled under deadline, by people who had already left.",
    method: "We agree what is actually broken before anyone opens a design file.",
    points: [
      {
        t: "The systems audit",
        d: "Every tool, every integration, every manual step nobody wrote down. We map the whole thing, not the part that is broken today.",
      },
      {
        t: "The cost of the gap",
        d: "Hours lost per week, errors that reach the client, revenue that never gets claimed. Written down, so it can be argued with.",
      },
      {
        t: "A ranked plan",
        d: "What to fix first, what to leave, what to retire. A list you can hand to any engineer, including ours.",
      },
      {
        t: "Definition of done",
        d: "The measurable conditions for success, agreed in writing before any spend. Not a mood, a number.",
      },
    ],
  },
  {
    n: "02",
    name: "Build",
    tagline: "One core, everything wired into it",
    open:
      "A stack held together by glue fails at the first change. Every integration is also a place the next thing can go wrong.",
    method: "We consolidate onto a core, then build outward from what is already running.",
    points: [
      {
        t: "The core",
        d: "One system of record. Everything else reads from it or writes to it. No parallel truths.",
      },
      {
        t: "Integration, not duplication",
        d: "Data moves once, in one direction, on an event. Nothing is re-keyed by a person.",
      },
      {
        t: "Migration without a freeze",
        d: "Cutover staged and reversible. If a step fails, you fall back to the old path, not to nothing.",
      },
      {
        t: "Documented as we go",
        d: "The system is built to be handed over. If you leave us, you keep everything that makes sense to keep.",
      },
    ],
  },
  {
    n: "03",
    name: "Launch",
    tagline: "Shipping in slices, not in a big reveal",
    open:
      "A launch is not a date. It is the point where the work actually becomes yours to depend on.",
    method: "Thin slices, each one useful on its own, each one live before the next starts.",
    points: [
      {
        t: "Slices, not phases",
        d: "Every two weeks something real is in production and being used. There is no long tail of work after go-live.",
      },
      {
        t: "Reversible by design",
        d: "Feature flags, staged rollouts, kept rollback. Risk is bounded at every step rather than at the end.",
      },
      {
        t: "Adoption before completion",
        d: "We sit with the people who will use it. If they do not adopt it, the build is not finished.",
      },
      {
        t: "Handover on the record",
        d: "Written runbooks, recorded walkthroughs, named owners. The system outlives the project.",
      },
    ],
  },
  {
    n: "04",
    name: "Operate",
    tagline: "Running it, watching it, changing what does not work",
    open:
      "The interesting failures happen in month seven, not in week two. The stack is rarely the problem by then.",
    method: "Continuous stewardship with thresholds we agree up front, not renegotiate afterwards.",
    points: [
      {
        t: "Instrumented from day one",
        d: "Errors, latency, cost and adoption are visible without asking anyone. If it cannot be seen, it cannot be steered.",
      },
      {
        t: "A monthly written review",
        d: "What changed, what it cost, what to stop. Minutes go out. Nobody has to remember a phone call six months later.",
      },
      {
        t: "Thresholds set in advance",
        d: "The response time, the error rate, the unit cost above which we act. Agreed in the contract, not argued after.",
      },
      {
        t: "Roadmap you own",
        d: "The backlog is yours. We maintain it and propose from it, but you decide what ships.",
      },
    ],
  },
  {
    n: "05",
    name: "Compound",
    tagline: "The work that makes the next year cheaper",
    open:
      "A system that runs itself is a finished system. The one that gets better is the one worth owning.",
    method: "We remove the recurring work and put the saved capacity back into the product.",
    points: [
      {
        t: "Automate the recurring, not the interesting",
        d: "The reports nobody reads, the reconciliations nobody trusts, the alerts nobody acts on. Those go first.",
      },
      {
        t: "Performance as a feature",
        d: "Latency and cost reviewed like a product surface, with a budget that ratchets down over time.",
      },
      {
        t: "Deliberately retired",
        d: "Systems earn their place every quarter. We kill them, including the ones we built.",
      },
      {
        t: "The next version is smaller",
        d: "Because the foundation is settled, the next release is a change rather than a rebuild.",
      },
    ],
    openEnded: true,
  },
] as const;

export default function Programme() {
  const [active, setActive] = useState(0);
  const handleActive = useCallback((i: number) => setActive(i), []);

  return (
    <section id="programme" data-scene="programme" className="relative">
      <JourneyRail items={STAGES.map((s) => s.name)} onActive={handleActive} />

      <div className="shell pt-[clamp(4rem,9vw,8rem)] pb-16">
        <p className="eyebrow ink-42">The programme</p>
        <h2 className="h1-display mt-6 max-w-[16ch] text-white uppercase">
          Five stages. One purpose: a system that runs itself.
        </h2>
        <p className="lede mt-7 max-w-[62ch] ink-70">
          Each stage produces what the next one needs. That chaining is what separates a
          programme from a list of services invoiced separately. Take them in order, or take
          one alone and accept the ceiling it comes with.
        </p>
      </div>

      <Seam
        kicker="Stage one"
        statement="Most systems were never designed to be changed."
      >
        <StageDetail index={0} />
      </Seam>

      {STAGES.slice(1).map((stage, i) => (
        <StageDetail key={stage.n} index={i + 1} stage={stage} />
      ))}

      <div className="shell section-pad">
        <ScrollDraw className="readout rounded-[22px] p-[clamp(1.5rem,4vw,3rem)]">
          <p className="eyebrow ink-42">Where this leaves you</p>
          <div className="mt-7 grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-start">
            <p className="text-[clamp(1rem,1.6vw,1.35rem)] leading-[1.45] text-white">
              Stage five has no end date on purpose. The line below goes dotted there, and
              the only honest way to price the rest is in conversation.
            </p>
            <div className="grid gap-3 text-[14px] leading-relaxed ink-55">
              <p>
                The dotted line is not a sales device. It marks the point where a programme
                stops being a project and becomes a relationship with a running system
                behind it.
              </p>
              <p>
                We will not quote a duration for stage four before we have run stage one.
                Anyone who will is guessing at your estate.
              </p>
            </div>
          </div>
          <p className="mt-8 border-t border-white/11 pt-5 font-mono text-[11px] tracking-[0.14em] text-white/58 uppercase">
            Stage 05 runs indefinitely by design
          </p>
        </ScrollDraw>
      </div>

      <div className="shell pb-[clamp(4rem,9vw,8rem)]" aria-hidden="true">
        <p className="sr-only">Programme progress: stage {active + 1} of {STAGES.length}</p>
      </div>
    </section>
  );
}

function StageDetail({
  index,
  stage,
}: {
  index: number;
  stage?: (typeof STAGES)[number];
}) {
  const s = stage ?? STAGES[index];
  const isLast = index === STAGES.length - 1;

  return (
    <article
      data-journey-step={index}
      id={index === 0 ? undefined : `stage-${index + 1}`}
      className="shell section-pad"
    >
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-baseline gap-5">
            <span className="font-mono text-[clamp(2.5rem,5vw,4rem)] leading-none text-white/[0.16]">
              {s.n}
            </span>
            <div>
              <h3 className="h3-display uppercase text-white">{s.name}</h3>
              <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-white/58 uppercase">
                Stage {s.n}
              </p>
            </div>
          </div>
          <p className="mt-7 max-w-[30ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.32] text-white">
            {s.tagline}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <span
              className={`h-px w-8 ${isLast ? "border-t border-dashed border-white/30" : "bg-white/22"}`}
            />
            {isLast ? (
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/48 uppercase">
                No end date
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <Reveal>
            <blockquote className="text-[clamp(1.15rem,2vw,1.6rem)] leading-[1.34] font-medium text-white">
              {s.open}
            </blockquote>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-10 text-[15px] leading-relaxed text-white/70">{s.method}</p>
          </Reveal>

          <div className="mt-12 grid gap-0 sm:grid-cols-2 sm:gap-x-10">
            {s.points.map((p, i) => (
              <Reveal key={p.t} delay={0.05 + i * 0.05}>
                <div className="border-t border-white/11 py-6">
                  <span className="font-mono text-[10.5px] tracking-[0.16em] text-white/46">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-3 text-[15px] font-medium text-white">{p.t}</h4>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/66">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
