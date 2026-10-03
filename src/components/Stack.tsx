import { useEffect, useRef } from "react";

const ROWS = [
  {
    label: "Languages",
    items: ["TypeScript", "Python", "Go", "SQL", "PHP", "Elixir", "Kotlin", "Swift"],
  },
  {
    label: "Front end",
    items: ["React", "Next.js", "Vue", "Svelte", "Tailwind", "WebGL", "Three.js", "Astro"],
  },
  {
    label: "Back end",
    items: ["Node.js", "Nest", "Django", "FastAPI", "Rails", "Laravel", "gRPC", "Postgres"],
  },
  {
    label: "Operations",
    items: ["Docker", "Kubernetes", "Terraform", "AWS", "GCP", "Grafana", "OpenTelemetry", "GitHub Actions"],
  },
];

/* Two rows, opposite directions, and the speed responds to how fast
   you are actually scrolling. Direction flips on scroll-up so the
   bands read as attached to the page rather than to the screen. */
export default function Stack() {
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const offsets = ROWS.map(() => 0);
    let lastY = window.scrollY;
    let velocity = 0;
    let running = true;

    const loop = (): void => {
      if (!running) return;
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.12;
      lastY = y;

      bandRefs.current.forEach((el, i) => {
        if (!el) return;
        /* Even rows drift left, odd rows right, so the bands read as
           opposing currents rather than four copies of one ticker. */
        const dir = i % 2 === 0 ? 1 : -1;
        offsets[i] -= velocity * 0.3 * dir;

        const half = el.scrollWidth / 2 || 1;
        const x = ((offsets[i] % half) + half) % half;
        el.style.transform = `translate3d(${-x}px, 0, 0)`;
      });

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="stack" data-scene="stacklist" className="shell section-pad overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow ink-42">The stack</p>
          <h2 className="h2-display mt-6 max-w-[14ch] text-white uppercase">
            Boring where it counts.
          </h2>
        </div>
        <p className="max-w-[40ch] text-[14.5px] leading-relaxed text-white/62">
          We pick tools your next engineer already knows. The interesting part of this work
          is the decisions, not the novelty of the stack.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-px border-y border-white/11 py-10">
        {ROWS.map((row, i) => {
          const band = (
            <div className="flex w-max shrink-0 items-center">
              {row.items.map((item) => (
                <span key={item} className="stack-chip">
                  {item}
                </span>
              ))}
            </div>
          );
          return (
            <div key={row.label} className="stack-band">
              <span className="stack-band__label">{row.label}</span>
              <div className="mask-fade-x relative flex-1 overflow-hidden">
                <div
                  ref={(el) => {
                    bandRefs.current[i] = el;
                  }}
                  className="flex w-max"
                >
                  {band}
                  {band}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
