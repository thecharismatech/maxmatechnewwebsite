import {
  ArrowUpRight,
  CalendarCheck,
  Clock3,
  LifeBuoy,
  Mail,
  TicketCheck,
  Zap,
} from "lucide-react";
import { GlassButton, Reveal } from "./ui";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-28 sm:pt-36">
      {/* ------- support ------- */}
      <section id="support" data-scene="support" className="relative">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.35em] text-white/30">04</span>
                  <span className="h-px w-8 bg-gradient-to-r from-cyan-300/60 to-transparent" />
                  <span className="font-mono text-[11px] tracking-[0.35em] text-cyan-300/90 uppercase">
                    Always-on support
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="font-display mt-6 text-4xl leading-[1.02] font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Don't let it
                  <br />
                  <span className="serif-accent text-gradient tracking-normal">amplify.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-white/50 sm:text-lg">
                  Issues grow when they wait. Our ticketing system makes it quick and effortless to
                  fix whatever happens in your system — so small sparks never become fires.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <GlassButton
                    href="https://wa.me/201229303030?text="
                    aria-label="WhatsApp: Book your ticket (message 1)"
                  >
                    <TicketCheck className="h-4 w-4" />
                    Let's Start Our Journey
                  </GlassButton>
                  <GlassButton
                    href="https://wa.me/201229303030?text="
                    aria-label="WhatsApp: Book your ticket (message 2)"
                    variant="ghost"
                  >
                    <TicketCheck className="h-4 w-4" />
                    Support Ticket
                  </GlassButton>
                  <GlassButton href="https://www.maxmatech.com" variant="ghost">
                    maxmatech.com
                    <ArrowUpRight className="h-4 w-4" />
                  </GlassButton>
                </div>
              </Reveal>
            </div>

            {/* ticket mock */}
            <Reveal delay={0.15}>
              <div className="glass-deep glass-sheen relative overflow-hidden rounded-[1.75rem] p-7 sm:p-9">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/15 blur-[70px]" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="glass-chip grid h-11 w-11 place-items-center rounded-xl">
                      <LifeBuoy className="h-5 w-5 text-cyan-300" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Ticket #MAX-2077</p>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                        ERP · automation
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5">
                    <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-medium text-emerald-300">In progress</span>
                  </span>
                </div>

                <div className="mt-7 space-y-3">
                  {[
                    { k: "Priority", v: "High", icon: Zap, c: "text-amber-300" },
                    { k: "First response", v: "< 2 hours", icon: Clock3, c: "text-cyan-300" },
                    { k: "Channel", v: "Portal · Email · App", icon: Mail, c: "text-violet-300" },
                  ].map((r) => (
                    <div
                      key={r.k}
                      className="glass-chip flex items-center justify-between rounded-xl px-4 py-3.5"
                    >
                      <span className="flex items-center gap-2.5 text-[13px] text-white/50">
                        <r.icon className={`h-4 w-4 ${r.c}`} />
                        {r.k}
                      </span>
                      <span className="text-[13px] font-semibold text-white">{r.v}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <div className="mb-2 flex justify-between font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                    <span>Resolution progress</span>
                    <span className="text-cyan-300">82%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-300" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------- contact CTA ------- */}
      <section id="contact" data-scene="cta" className="relative mt-28 sm:mt-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="glass-deep relative overflow-hidden rounded-[2.5rem] px-6 py-20 text-center sm:px-12 sm:py-28">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="animate-aurora-b absolute -top-1/3 left-[8%] h-[30rem] w-[30rem] rounded-full bg-violet-600/20 blur-[130px]" />
              <div className="animate-aurora-c absolute right-[5%] -bottom-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/14 blur-[130px]" />
              <img
                src="/images/glass-orb.png"
                alt=""
                aria-hidden
                className="blend-screen animate-float-slower pointer-events-none absolute -top-24 -right-20 w-80 opacity-60 select-none sm:w-[26rem]"
              />

              <p className="relative font-mono text-[11px] tracking-[0.4em] text-white/40 uppercase">
                05 — Ready when you are
              </p>
              <h2 className="font-display relative mx-auto mt-7 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-white uppercase">
                Let's maximize
                <br />
                <span className="serif-accent text-gradient tracking-normal normal-case">
                  your tech.
                </span>
              </h2>
              <p className="relative mx-auto mt-7 max-w-lg text-base leading-relaxed text-white/50">
                Explore further with Maxmatech — and take your business to the next level with a
                solution tailored for you.
              </p>
              <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <GlassButton
                  href="https://wa.me/201229303030?text=Hi%20Maxmatech%2C%20I%27d%20like%20to%20book%20a%20technical%20discovery%20call.%20My%20business%20need%20is%3A%20%5Bfill%20here%5D.%20Preferred%20time%3A%20%5Bfill%20here%5D.%20Thanks%21"
                  className="border-white/25 bg-white/[0.12] px-8 py-4 text-[15px] shadow-[0_0_60px_-14px_rgba(139,92,246,0.8)]"
                >
                  <CalendarCheck className="h-4.5 w-4.5 text-violet-200" />
                  Book a technical discovery call
                </GlassButton>
                <GlassButton href="https://www.maxmatech.com/industrialsolutions" variant="ghost">
                  Let's do it
                  <ArrowUpRight className="h-4 w-4" />
                </GlassButton>
                <GlassButton href="#top" variant="ghost">
                  Back to top
                </GlassButton>
              </div>
              <p className="relative mt-6 font-mono text-[10px] tracking-[0.22em] text-white/30 uppercase">
                step 01 · map your operation · step 02 · deploy · step 03 · scale
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------- bottom bar ------- */}
      <div className="mx-auto mt-20 max-w-7xl px-5 pb-10 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/[0.07] pt-8 sm:flex-row">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="relative grid h-8 w-8 place-items-center">
              <img
                src="/images/logo.png"
                alt="maxmatech logo"
                className="h-8 w-8 object-contain"
              />
            </span>
            <span className="font-display text-sm font-medium tracking-tight text-white/80">
              maxmatech solutions
            </span>
          </a>
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
            Your Certified Digital Transformation Partner
          </p>

          <div className="flex flex-col items-center gap-1 sm:items-end">
            <a
              href="tel:01229303030"
              className="text-[12px] font-medium text-white/40 transition-colors hover:text-white"
            >
              01229303030
            </a>
            <a
              href="mailto:info@maxmatech.com"
              className="text-[12px] font-medium text-white/40 transition-colors hover:text-white"
            >
              info@maxmatech.com
            </a>
          </div>

          <div className="flex items-center gap-6">
            {["Services", "Industries", "Process", "Support"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-[12px] font-medium text-white/40 transition-colors hover:text-white"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-[11px] text-white/25 sm:text-left">
          © {new Date().getFullYear()} Maxmatech Solutions. Maximizing your tech — engineered with precision.
        </p>
      </div>
    </footer>
  );
}
