import { Reveal } from "./ui";
import { ScrollWave } from "./editorial";

const pillars = [
  {
    k: "One core",
    v: "Odoo",
    copy: "A single database across sales, stock, accounting and service. No more exports between systems that disagree.",
  },
  {
    k: "One brain",
    v: "AI layer",
    copy: "Automations that read the same records your team reads, and act on them the moment something changes.",
  },
  {
    k: "One partner",
    v: "Maxmatech",
    copy: "Discovery, deployment, training and support under one roof — and one number to call when it matters.",
  },
];

export default function Statement() {
  return (
    <section data-scene="statement" className="section-pad relative">
      <div className="shell">
        <Reveal>
          <div className="flex justify-center">
            <span className="eyebrow ink-42">The thesis</span>
          </div>
        </Reveal>

        <ScrollWave
          as="p"
          className="mx-auto mt-10 max-w-5xl text-center font-display text-[clamp(1.7rem,4.1vw,3.5rem)] leading-[1.14] font-medium tracking-[-0.032em] text-white"
          start="top 82%"
          end="bottom 42%"
        >
          Most businesses do not have a software problem. They have a
          coordination problem. We engineer the layer that fixes it.
        </ScrollWave>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-white/[0.07] md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.v} delay={i * 0.09}>
              <div className="group relative h-full bg-[#08080f]/85 p-8 transition-colors duration-500 hover:bg-[#0b0b16] sm:p-9">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow ink-32">{p.k}</span>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-violet-300/60">
                    0{i + 1}
                  </span>
                </div>
                <p className="font-display mt-6 text-3xl font-medium tracking-tight text-white">
                  {p.v}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-white/55">{p.copy}</p>
                <span className="mt-7 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-violet-400/70 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
