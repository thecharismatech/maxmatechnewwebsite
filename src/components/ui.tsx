import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { prefersReducedMotion } from "../effects/textSplit";
import { cn } from "../utils/cn";
import { SplitReveal } from "./editorial";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Spotlight glass card ---------------- */
export function SpotlightCard({
  children,
  className,
  glow = "rgba(139, 92, 246, 0.16)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("glass glass-sheen group relative", className)}
      style={{ ["--glow" as string]: glow }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHeader({
  index,
  eyebrow,
  title,
  copy,
  align = "center",
  accent = "violet",
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "center" | "left";
  accent?: "violet" | "cyan" | "amber";
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "relative z-10",
        centered ? "mx-auto max-w-4xl text-center" : "max-w-3xl",
      )}
    >
      <Reveal>
        <div className={cn("flex items-center gap-3", centered && "justify-center")}>
          <Eyebrow index={index} accent={accent}>
            {eyebrow}
          </Eyebrow>
        </div>
      </Reveal>
      <SplitReveal className="h2-display mt-7 text-white uppercase" as="h2">
        {title}
      </SplitReveal>
      {copy && (
        <Reveal delay={0.16}>
          <p className={cn("lede mt-7", centered && "mx-auto max-w-2xl")}>{copy}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- Animated counter ---------------- */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 45, damping: 18 });
  const text = useTransform(spring, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

/* ---------------- Glass pill button ---------------- */
export function GlassButton({
  children,
  href,
  variant = "primary",
  className,
  ...rest
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
} & Record<string, unknown>) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      className={cn(
        "glass-sheen group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-500",
        variant === "primary"
          ? "border border-white/20 bg-white/10 text-white backdrop-blur-xl hover:border-white/35 hover:bg-white/15 hover:shadow-[0_0_50px_-8px_rgba(139,92,246,0.55)]"
          : "border border-white/10 bg-white/[0.03] text-white/70 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Roll button ----------------
   Two labels stacked in one grid cell. On hover the outgoing label
   rolls up letter by letter while the incoming rolls in beneath it.
   Focus does the same, so keyboard users get the same affordance. */
export function RollButton({
  label,
  href,
  tone = "accent",
  icon,
  className,
}: {
  label: string;
  href: string;
  tone?: "accent" | "solid" | "ghost";
  icon?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const labels = Array.from(root.querySelectorAll<HTMLElement>("[data-roll-label]"));
    const series = labels.map((labelEl) => {
      const text = labelEl.textContent ?? "";
      labelEl.textContent = "";
      const letters = text.split("").map((c) => {
        const s = document.createElement("span");
        s.textContent = c === " " ? "\u00a0" : c;
        s.style.display = "inline-block";
        s.style.willChange = "transform";
        labelEl.appendChild(s);
        return s;
      });
      return letters;
    });

    if (series.length < 2 || prefersReducedMotion()) return;

    gsap.set(series[0], { yPercent: 0 });
    gsap.set(series[1], { yPercent: 110 });

    const timeline = gsap
      .timeline({ paused: true })
      .to(series[0], { yPercent: -110, duration: 0.4, stagger: 0.02, ease: "power3.inOut" }, 0)
      .to(series[1], { yPercent: 0, duration: 0.4, stagger: 0.02, ease: "power3.inOut" }, 0.05);

    const play = (): void => {
      timeline.play();
    };
    const back = (): void => {
      timeline.reverse();
    };

    root.addEventListener("mouseenter", play);
    root.addEventListener("mouseleave", back);
    root.addEventListener("focus", play);
    root.addEventListener("blur", back);

    return () => {
      root.removeEventListener("mouseenter", play);
      root.removeEventListener("mouseleave", back);
      root.removeEventListener("focus", play);
      root.removeEventListener("blur", back);
      timeline.kill();
    };
  }, []);

  const tones = {
    accent:
      "border border-white/20 bg-white/[0.1] text-white hover:border-white/35 hover:shadow-[0_0_54px_-10px_rgba(139,92,246,0.7)]",
    solid: "border border-transparent bg-white text-[#05050a] hover:shadow-[0_0_44px_-8px_rgba(196,181,253,0.6)]",
    ghost:
      "border border-white/12 bg-transparent text-white/75 hover:border-white/28 hover:bg-white/[0.06] hover:text-white",
  } as const;

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "btn-magnetic glass-sheen group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-[13px] font-medium tracking-wide backdrop-blur-xl",
        tones[tone],
        className,
      )}
    >
      <span className="relative grid place-items-center overflow-hidden">
        <span data-roll-label className="col-start-1 row-start-1 block whitespace-nowrap">
          {label}
        </span>
        <span
          data-roll-label
          aria-hidden
          className="col-start-1 row-start-1 block whitespace-nowrap opacity-0"
        >
          {label}
        </span>
      </span>
      {icon ? (
        <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      ) : null}
    </a>
  );
}

/* ---------------- Eyebrow rail ---------------- */
export function Eyebrow({
  index,
  children,
  accent = "violet",
}: {
  index?: string;
  children: ReactNode;
  accent?: "violet" | "cyan" | "amber";
}) {
  const bar = {
    violet: "from-violet-400/70",
    cyan: "from-cyan-300/70",
    amber: "from-amber-300/70",
  }[accent];
  const text = {
    violet: "text-violet-300/90",
    cyan: "text-cyan-300/90",
    amber: "text-amber-300/90",
  }[accent];

  return (
    <div className="flex items-center gap-3">
      {index ? (
        <>
          <span className="font-mono text-[11px] tracking-[0.35em] text-white/48">{index}</span>
          <span className={cn("h-px w-8 bg-gradient-to-r", bar, "to-transparent")} />
        </>
      ) : null}
      <span className={cn("eyebrow", text)}>{children}</span>
    </div>
  );
}
