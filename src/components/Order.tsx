import { useEffect, useRef } from "react";
import { clamp01, doux } from "./scrollkit";

/* Four statements that replace one another while the frame stays put.
   The wheel is never captured: each statement simply holds until the
   next one has taken enough of the screen to be worth reading. */
const FRAMES = [
  {
    kicker: "The first thing to accept",
    line: "A stack assembled under deadline was never meant to be changed.",
    note: "Most estates are a record of decisions nobody is still around to explain.",
  },
  {
    kicker: "Then the second",
    line: "Adding to it does not compound. It accumulates the cost of every previous addition.",
    note: "Each integration is also a new place for the next change to fail.",
  },
  {
    kicker: "And the third",
    line: "The expensive work is almost never the part that looks expensive.",
    note: "It is the reconciliation, the re-keying, the report nobody trusts twice.",
  },
  {
    kicker: "So the order",
    line: "Consolidate first. Everything after that is cheaper than it looks.",
    note: "This is the whole programme, stated in four lines.",
  },
];

export default function Order() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(-1);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    if (!track || !scene) return;

    const paint = (p: number): void => {
      const n = FRAMES.length;
      const f = p * n;
      const idx = Math.min(n - 1, Math.floor(f));
      const local = clamp01(f - idx);

      /* Each frame holds at full opacity for most of its slot and only
         hands over at the edges. A symmetric cross-fade would put both
         frames at 25% in the middle, which is unreadable over the
         lattice. Here at least one frame is always fully opaque. */
      frameRefs.current.forEach((el, i) => {
        if (!el) return;
        let opacity = 0;
        let shift = 0;

        if (i === idx) {
          opacity = local < 0.72 ? 1 : 1 - (local - 0.72) / 0.28;
          shift = -local * 40;
        } else if (i === idx + 1) {
          const t = local < 0.28 ? 0 : (local - 0.28) / 0.4;
          opacity = t > 1 ? 1 : t;
          shift = (1 - t) * 40;
        }

        const settled = opacity > 0.98;
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
        el.style.filter = settled ? "none" : `blur(${((1 - opacity) * 5).toFixed(2)}px)`;
      });

      const shown = Math.min(n - 1, Math.round(f));
      if (shown !== activeRef.current) {
        activeRef.current = shown;
        railRefs.current.forEach((el, i) => {
          el?.classList.toggle("is-here", i === shown);
          el?.classList.toggle("is-done", i < shown);
        });
      }
      scene.style.setProperty("--p", clamp01(p).toFixed(4));
      scene.style.setProperty("--sweep", doux(clamp01(p)).toFixed(4));
    };

    if (reduced) {
      paint(0);
      return;
    }

    let frame = false;    const update = (): void => {
      frame = false;
      const rect = track.getBoundingClientRect();
      const run = rect.height - scene.getBoundingClientRect().height;
      if (run <= 0) return;
      paint(clamp01(-rect.top / run));
    };
    const onScroll = (): void => {
      if (frame) return;
      frame = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="order" data-scene="order" className="relative">
      <div ref={trackRef} className="order-track" data-static={reduced ? "true" : undefined} style={{ height: "320vh" }}>
        <div ref={sceneRef} className="order-scene">
          <div className="order-progress" aria-hidden="true">
            <span className="order-progress__fill" />
          </div>

          <div className="order-stage">
            {FRAMES.map((f, i) => (
              <div
                key={f.line}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                className="order-frame"
              >
                <p className="eyebrow ink-42">{f.kicker}</p>
                <h2 className="order-line">{f.line}</h2>
                <p className="mt-8 max-w-[46ch] text-[15px] leading-relaxed text-white/66">
                  {f.note}
                </p>
              </div>
            ))}
          </div>

          <ol className="order-rail" aria-hidden="true">
            {FRAMES.map((f, i) => (
              <li key={f.line}>
                <button
                  type="button"
                  tabIndex={-1}
                  ref={(el) => {
                    railRefs.current[i] = el;
                  }}
                  className="order-rail__item"
                >
                  <span className="order-rail__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="order-rail__label">{f.kicker}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
