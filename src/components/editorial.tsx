import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion, splitChars, splitWords } from "../effects/textSplit";

gsap.registerPlugin(ScrollTrigger);

const DIM = "rgba(255,255,255,0.2)";
const ACCENT = "#c4b5fd";
const LIT = "#ffffff";

/* ------------------------------------------------------------------
   ScrollWave — a highlight sweeps across the text in reading order
   as the block crosses the viewport. Each character moves dim ->
   accent -> lit, so the accent band travels through the sentence.
------------------------------------------------------------------ */
export function ScrollWave({
  children,
  as: Tag = "h2",
  className = "h2-display",
  dim = DIM,
  accent = ACCENT,
  lit = LIT,
  start = "top 86%",
  end = "bottom 45%",
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  dim?: string;
  accent?: string;
  lit?: string;
  start?: string;
  end?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = splitChars(el);
    if (chars.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(chars, { color: lit });
      return;
    }

    gsap.set(chars, { color: dim, display: "inline-block" });

    const each = 1 / chars.length;
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: 0.25,
        invalidateOnRefresh: true,
      },
    });

    timeline.fromTo(
      chars,
      { color: dim },
      {
        keyframes: [
          { color: dim, duration: 0 },
          { color: accent, duration: 0.34 },
          { color: lit, duration: 0.66 },
        ],
        ease: "none",
        stagger: { each: each * 0.85 },
      },
    );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [accent, dim, end, lit, start]);

  return (
    <Tag ref={ref as never} id={id} className={className}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   SplitReveal — words rise out of an overflow mask, staggered.
------------------------------------------------------------------ */
export function SplitReveal({
  children,
  className = "h2-display",
  as: Tag = "h2",
  delay = 0,
  each = 0.045,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  each?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = splitWords(el);
    if (words.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }

    words.forEach((word) => {
      const mask = document.createElement("span");
      mask.className = "word-mask";
      word.parentNode?.insertBefore(mask, word);
      mask.appendChild(word);
    });

    gsap.set(words, { yPercent: 110 });

    const animation = gsap.to(words, {
      yPercent: 0,
      duration: 1,
      ease: "power4.out",
      stagger: each,
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [delay, each]);

  return (
    <Tag ref={ref as never} id={id} className={className}>
      {children}
    </Tag>
  );
}
