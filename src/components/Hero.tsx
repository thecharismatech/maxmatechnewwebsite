import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Boxes,
  BrainCircuit,
  CalendarCheck,
  ChartLine,
  CircleDollarSign,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  Users,
  Warehouse,
} from "lucide-react";
import type { MouseEvent } from "react";
import { GlassButton } from "./ui";

const modules = [
  { icon: Users, label: "CRM", active: false },
  { icon: Warehouse, label: "Inventory", active: false },
  { icon: CircleDollarSign, label: "Accounting", active: false },
  { icon: Boxes, label: "POS", active: false },
  { icon: BrainCircuit, label: "AI Core", active: true },
  { icon: LifeBuoy, label: "Helpdesk", active: false },
];

const bars = [34, 52, 40, 68, 46, 74, 58, 86, 64, 92, 78, 100];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const orbX = useTransform(sx, (v) => v * 46);
  const orbY = useTransform(sy, (v) => v * 30);
  const dashX = useTransform(sx, (v) => v * -14);
  const dashY = useTransform(sy, (v) => v * -10);
  const chipX = useTransform(sx, (v) => v * 60);
  const chipY = useTransform(sy, (v) => v * 40);

  function onMove(e: MouseEvent<HTMLElement>) {
    const { innerWidth, innerHeight } = window;
    mx.set((e.clientX / innerWidth - 0.5) * 2);
    my.set((e.clientY / innerHeight - 0.5) * 2);
  }

  return (
    <section
      id="top"
      data-scene="hero"
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-36 sm:pt-40"
    >
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0" />
        <div className="animate-aurora-a absolute top-[-18%] left-[-12%] h-[62vmax] w-[62vmax] rounded-full bg-violet-600/22 blur-[130px]" />
        <div className="animate-aurora-b absolute top-[6%] right-[-18%] h-[54vmax] w-[54vmax] rounded-full bg-cyan-500/14 blur-[140px]" />
        <div className="animate-aurora-c absolute bottom-[-30%] left-[22%] h-[48vmax] w-[48vmax] rounded-full bg-fuchsia-600/12 blur-[150px]" />
      </div>

      {/* floating glass orb */}
      <motion.img
        src="/images/glass-orb.png"
        alt=""
        aria-hidden
        style={{ x: orbX, y: orbY }}
        className="blend-screen animate-float-slower pointer-events-none absolute top-[4%] -right-[8%] -z-[5] w-[46rem] max-w-none opacity-70 select-none sm:top-[2%] sm:right-[2%] sm:w-[38rem] lg:opacity-90"
      />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="flex justify-center"
        >
          <div className="glass-chip flex items-center gap-2.5 rounded-full px-4 py-2">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] tracking-[0.28em] text-white/65 uppercase">
              Your Certified Digital Transformation Partner — ERP · AI · Software
            </span>
          </div>
        </motion.div>

        {/* headline */}
        <div className="mt-9 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.28, ease }}
            className="font-display mx-auto max-w-6xl text-[clamp(3.2rem,10.5vw,8.5rem)] leading-[0.92] font-medium tracking-[-0.04em] text-white uppercase"
          >
            Maximizing
            <br />
            <span className="text-outline">your</span>{" "}
            <span className="serif-accent text-gradient tracking-normal normal-case">tech.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease }}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
          >
            We engineer high-performance <span className="text-white/90">Odoo ERP</span> systems &{" "}
            <span className="text-white/90">AI automations</span> that scale your operations.
            Your journey to the digital world starts here.
          </motion.p>

<motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.58, ease }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <GlassButton href="#services">
              Explore the stack
              <ArrowDown className="h-4 w-4" />
            </GlassButton>
            <GlassButton
              href="https://wa.me/201229303030?text=Hi%20Maxmatech%2C%20I%E2%80%99d%20like%20to%20book%20a%20support%20ticket%20for%20KYC%3A%20%5Bfill%20here%5D.%20My%20business%20need%20is%3A%20%5Bfill%20here%5D.%20Please%20assist.%20"
              variant="ghost"
            >
              <LifeBuoy className="h-4 w-4 text-cyan-300" />
              Book your ticket
            </GlassButton>
            <GlassButton
              href="https://wa.me/201229303030?text=Hello%20Maxmatech%2C%20I%E2%80%99d%20like%20to%20schedule%20support%20for%20KYC%3A%20%5Bfill%20here%5D.%20Preferred%20time%3A%20%5Bfill%20here%5D.%20Thanks"
              variant="ghost"
            >
              <LifeBuoy className="h-4 w-4 text-cyan-300" />
              Support Ticket
            </GlassButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.72, ease }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="relative">
              <span className="animate-pulse-ring absolute -inset-4 rounded-[2.25rem] border border-violet-300/35" />
              <span className="animate-pulse-ring absolute -inset-4 rounded-[2.25rem] border border-cyan-300/25 [animation-delay:1.4s]" />
              <GlassButton
                href="https://wa.me/201229303030?text=Hi%20Maxmatech%2C%20I%27d%20like%20to%20book%20a%20technical%20discovery%20call.%20My%20business%20need%20is%3A%20%5Bfill%20here%5D.%20Preferred%20time%3A%20%5Bfill%20here%5D.%20Thanks%21"
                className="border-white/25 bg-white/[0.12] px-9 py-5 text-[15px] shadow-[0_0_70px_-16px_rgba(139,92,246,0.85)] hover:shadow-[0_0_90px_-10px_rgba(139,92,246,0.95)]"
              >
                <CalendarCheck className="h-5 w-5 text-violet-200" />
                Book a technical discovery call
                <ArrowUpRight className="h-4.5 w-4.5" />
              </GlassButton>
            </div>
            <p className="mt-5 font-mono text-[10px] tracking-[0.22em] text-white/35 uppercase">
              no commitment · 30 minutes · mapped to your operation
            </p>
          </motion.div>
        </div>
      </div>

      {/* ---- glass command center ---- */}
      <div className="relative mx-auto mt-16 w-full max-w-6xl px-5 pb-24 sm:mt-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 90, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.75, ease }}
          style={{ x: dashX, y: dashY }}
          className="relative"
        >
          {/* glow under panel */}
          <div className="absolute -inset-x-8 -bottom-10 h-40 bg-violet-600/25 blur-[80px]" />

          <div className="glass-deep relative overflow-hidden rounded-[1.75rem]">
            {/* window chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400/70" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">
                maxmatech os — unified operations
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-400/80" />
            </div>

            <div className="grid md:grid-cols-[220px_1fr]">
              {/* modules rail */}
              <div className="hidden border-r border-white/[0.07] p-5 md:block">
                <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
                  Modules
                </p>
                <div className="space-y-1.5">
                  {modules.map((m) => (
                    <div
                      key={m.label}
                      className={
                        m.active
                          ? "flex items-center gap-3 rounded-xl border border-violet-300/25 bg-violet-400/10 px-3.5 py-2.5 text-[13px] font-medium text-white"
                          : "flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
                      }
                    >
                      <m.icon className={`h-4 w-4 ${m.active ? "text-violet-300" : ""}`} />
                      {m.label}
                      {m.active && (
                        <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* main panel */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
                      Operational throughput
                    </p>
                    <p className="font-display mt-2 text-4xl font-medium tracking-tight text-white sm:text-5xl">
                      +77<span className="text-gradient">%</span>
                    </p>
                  </div>
                  <div className="glass-chip flex items-center gap-2 rounded-full px-4 py-2">
                    <ChartLine className="h-3.5 w-3.5 text-cyan-300" />
                    <span className="text-[12px] font-medium text-cyan-200">
                      avg. efficiency gain across deployments
                    </span>
                  </div>
                </div>

                {/* chart */}
                <div className="mt-8 flex h-32 items-end gap-2 sm:h-40 sm:gap-3">
                  {bars.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${h}%`, opacity: 1 }}
                      transition={{ duration: 1.1, delay: 1 + i * 0.05, ease }}
                      className="relative flex-1 overflow-hidden rounded-t-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-violet-500/50 via-fuchsia-400/25 to-cyan-300/40" />
                      <div className="absolute inset-x-0 top-0 h-px bg-white/50" />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Bot, k: "AI automations", v: "Live 24/7", c: "text-violet-300" },
                    { icon: Sparkles, k: "Custom flows", v: "Tailored", c: "text-fuchsia-300" },
                    { icon: ShieldCheck, k: "Infra & security", v: "Hardened", c: "text-cyan-300" },
                  ].map((s) => (
                    <div key={s.k} className="glass-chip rounded-2xl px-4 py-3.5">
                      <s.icon className={`h-4 w-4 ${s.c}`} />
                      <p className="mt-2 text-[13px] font-semibold text-white">{s.v}</p>
                      <p className="text-[11px] text-white/40">{s.k}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* floating chips */}
          <motion.div
            style={{ x: chipX, y: chipY }}
            className="animate-float-slow glass absolute -top-7 -right-3 hidden items-center gap-3 rounded-2xl px-5 py-4 lg:flex"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/15">
              <Bot className="h-4.5 w-4.5 text-cyan-300" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-white">AI Supercharged</p>
              <p className="text-[11px] text-white/45">Odoo ecosystem, automated</p>
            </div>
          </motion.div>

          <motion.div
            style={{ x: chipX, y: chipY }}
            className="animate-float-slower glass absolute -bottom-8 -left-3 hidden items-center gap-3 rounded-2xl px-5 py-4 lg:flex"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-400/15">
              <Sparkles className="h-4.5 w-4.5 text-violet-300" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-white">Tailored for you</p>
              <p className="text-[11px] text-white/45">Built around your workflow</p>
            </div>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.a
          href="#problem"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="group mx-auto mt-14 flex w-fit flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">
            Scroll
          </span>
          <span className="glass-chip grid h-9 w-9 place-items-center rounded-full">
            <ArrowUpRight className="h-4 w-4 rotate-135 text-white/60 transition-transform duration-300 group-hover:translate-y-0.5" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
