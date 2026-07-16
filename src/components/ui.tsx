import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "../utils/cn";

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
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={cn("relative z-10", centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl")}>
      <Reveal>
        <div className={cn("flex items-center gap-3", centered && "justify-center")}>
          <span className="font-mono text-[11px] tracking-[0.35em] text-white/30">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-violet-400/60 to-transparent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-violet-300/90">
            {eyebrow}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display mt-6 text-4xl leading-[1.02] font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>
      {copy && (
        <Reveal delay={0.16}>
          <p className="mt-6 text-base leading-relaxed text-white/50 sm:text-lg">{copy}</p>
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
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
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
    >
      {children}
    </Tag>
  );
}
