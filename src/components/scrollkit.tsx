import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

/* Same easing profile as cubic-bezier(.16,1,.3,1), approached. */
export function doux(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/* ------------------------------------------------------------------
   Seam — a pinned statement that tears in half and hands off.

   The track is 240vh; the sticky scene is 100vh, so there are 140vh
   of scroll to spend. The wheel is never captured: the first 16% only
   draws the thread, so the reader gets the sensation of a pause
   without losing the scrollbar, the keyboard or Lenis.

   Progress is partitioned, in order:
     0.00 - 0.16  thread draws, panels shut
     0.16 - 0.46  panels part, statement tears down the middle
     0.16 - 0.58  the payload scales up behind the seam
     0.46 - 0.64  the payload's own caption resolves

   Each panel carries a full copy of the statement in a 200%-wide
   inner box, so when the panels part the words appear to rip apart
   rather than slide away.
------------------------------------------------------------------ */
export function Seam({
  statement,
  kicker,
  children,
  className = "",
  trackVh = 240,
}: {
  statement: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
  trackVh?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    if (!track || !scene) return;

    if (prefersReducedMotionStatic()) {
      applySeam(scene, 1);
      return;
    }

    let frame = false;
    const update = (): void => {
      frame = false;
      const rect = track.getBoundingClientRect();
      const run = rect.height - scene.getBoundingClientRect().height;
      if (run <= 0) return;
      applySeam(scene, clamp01(-rect.top / run));
    };
    const onScroll = (): void => {
      if (frame) return;
      frame = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={trackRef} className={`seam-track ${className}`} style={{ height: `${trackVh}vh` }}>
      <div ref={sceneRef} className="seam-scene">
        <div className="seam-window">
          <div className="seam-payload">{children}</div>
          <div className="seam-panel seam-panel--l">
            <div className="seam-half seam-half--l">
              <p className="seam-statement">
                {kicker ? <span className="seam-kicker">{kicker}</span> : null}
                {statement}
              </p>
            </div>
            <span className="seam-thread seam-thread--l" />
          </div>
          <div className="seam-panel seam-panel--r">
            <div className="seam-half seam-half--r">
              <p className="seam-statement" aria-hidden="true">
                {kicker ? <span className="seam-kicker">{kicker}</span> : null}
                {statement}
              </p>
            </div>
            <span className="seam-thread seam-thread--r" />
          </div>
        </div>
      </div>
    </div>
  );
}

function applySeam(scene: HTMLElement, p: number): void {
  const s = scene.style;
  s.setProperty("--sc", clamp01(p / 0.16).toFixed(4));
  s.setProperty("--ouv", doux(clamp01((p - 0.16) / 0.3)).toFixed(4));
  s.setProperty("--ech", (0.9 + 0.1 * doux(clamp01((p - 0.16) / 0.42))).toFixed(4));
  s.setProperty("--dit", clamp01((p - 0.46) / 0.18).toFixed(4));
}

function prefersReducedMotionStatic(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ------------------------------------------------------------------
   ScrollDraw — a thread that fills as the block crosses the viewport.
   Shared timing profile: starts at 80% of the viewport height and
   completes by 34%.
------------------------------------------------------------------ */
export function ScrollDraw({
  children,
  className = "",
  horizontal = false,
}: {
  children: ReactNode;
  className?: string;
  horizontal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotionStatic()) {
      el.style.setProperty("--draw", "1");
      return;
    }

    let frame = false;
    const update = (): void => {
      frame = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const high = vh * 0.8;
      const low = vh * 0.34;
      el.style.setProperty("--draw", clamp01((high - rect.top) / (high - low)).toFixed(4));
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
    <div ref={ref} className={`draw ${horizontal ? "draw--x" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   JourneyRail — a fixed rail that tracks the current stage.
   Position fixed, not sticky, so each stage does not need a wrapper.
   The rail shows only while the journey is in frame. Below 992px the
   rail would eat the gutter, so a hairline progress bar takes over
   and says the same thing without occupying anything.
------------------------------------------------------------------ */
export function JourneyRail({
  items,
  onActive,
}: {
  items: string[];
  onActive?: (index: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(-1);

  useEffect(() => {
    const targets = items
      .map((_, i) => document.querySelector<HTMLElement>(`[data-journey-step="${i}"]`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length < 2) return;

    const rail = railRef.current;
    const bar = barRef.current;

    let frame = false;
    let last = -2;

    const update = (): void => {
      frame = false;
      const vh = window.innerHeight || 800;
      const mark = vh * 0.34;

      const first = targets[0].getBoundingClientRect();
      const lastBox = targets[targets.length - 1].getBoundingClientRect();
      const inside = first.top < vh * 0.6 && lastBox.bottom > vh * 0.15;

      rail?.classList.toggle("is-live", inside);
      if (bar) bar.style.opacity = inside ? "1" : "0";

      let active = -1;
      for (let i = 0; i < targets.length; i += 1) {
        if (targets[i].getBoundingClientRect().top <= mark) active = i;
      }

      if (bar) {
        const from = first.top + window.scrollY;
        const span = Math.max(1, lastBox.bottom + window.scrollY - from);
        const scrolled = clamp01((window.scrollY + vh * 0.34 - from) / span);
        bar.style.width = `${(scrolled * 100).toFixed(2)}%`;
      }

      if (active !== last) {
        last = active;
        setCurrent(active);
        onActive?.(active);
      }
    };

    const onScroll = (): void => {
      if (frame) return;
      frame = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, onActive]);

  return (
    <>
      <div ref={railRef} className="jrail" aria-hidden="true">
        {items.map((label, i) => (
          <div key={label} className={`jrail__i${i === current ? " is-here" : ""}${i < current ? " is-done" : ""}`}>
            <span className="jrail__dot" />
            <span className="jrail__label">{label}</span>
          </div>
        ))}
      </div>
      <span ref={barRef} className="jrail__bar" aria-hidden="true" />
    </>
  );
}

/* ------------------------------------------------------------------
   Counter — a number that counts up once, on entry.
------------------------------------------------------------------ */
export function Counter({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.9,
  className = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (v: number): string =>
      `${prefix}${v.toFixed(decimals)}${suffix}`;

    if (prefersReducedMotionStatic()) {
      el.textContent = format(to);
      return;
    }

    const state = { v: 0 };
    const animation = gsap.to(state, {
      v: to,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(state.v);
      },
      onComplete: () => {
        el.textContent = format(to);
      },
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [decimals, duration, prefix, suffix, to]);

  return <span ref={ref} className={className}>{`${prefix}0${suffix}`}</span>;
}

/* ------------------------------------------------------------------
   StickySteps — a sticky rail whose active step is written into
   state, so the right column can cross-fade between steps.
------------------------------------------------------------------ */
export function useStepHandoff(ids: string[], onChange: (index: number) => void): void {
  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length < 2) return;

    let frame = false;
    let last = -1;

    const update = (): void => {
      frame = false;
      const vh = window.innerHeight || 800;
      const mark = vh * 0.5;
      let active = 0;
      for (let i = 0; i < targets.length; i += 1) {
        if (targets[i].getBoundingClientRect().top <= mark) active = i;
      }
      if (active !== last) {
        last = active;
        onChange(active);
      }
    };

    const onScroll = (): void => {
      if (frame) return;
      frame = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, onChange]);
}
