import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../effects/textSplit";
import { cn } from "../utils/cn";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Order", href: "#order" },
  { label: "Services", href: "#services" },
  { label: "Programme", href: "#programme" },
  { label: "Outcomes", href: "#outcomes" },
  { label: "Scope", href: "#scope" },
  { label: "FAQ", href: "#faq" },
];

const MOBILE_LINKS = [
  ...links,
  { label: "Connect", href: "#connect" },
  { label: "Industries", href: "#industries" },
  { label: "Stack", href: "#stack" },
  { label: "Engagement", href: "#engagement" },
  { label: "Support", href: "#support" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (prefersReducedMotion()) {
      gsap.set(bar, { clearProps: "all" });
      return;
    }

    const target = getComputedStyle(bar).maxWidth;
    const logo = bar.querySelector<HTMLElement>("[data-nav-logo]");
    const rest = bar.querySelectorAll<HTMLElement>("[data-nav-rest]");

    gsap.set(bar, { maxWidth: 62, transition: "none" });
    gsap.set(logo, { autoAlpha: 0, scale: 0.5 });
    gsap.set(rest, { autoAlpha: 0, y: 14 });

    const timeline = gsap
      .timeline({ delay: 0.35 })
      .fromTo(
        bar,
        { y: -30, scale: 0.88, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.75, ease: "back.out(1.5)" },
      )
      .to(logo, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.45")
      .to(bar, { maxWidth: target, duration: 0.9, ease: "expo.out" }, "-=0.25")
      .to(rest, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" })
      .set(bar, { clearProps: "maxWidth,transform,transition" });

    return () => {
      timeline.kill();
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflowY = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflowY = "";
    };
  }, [open]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
        <nav
          ref={barRef}
          className={cn(
            "pointer-events-auto relative flex w-full max-w-[860px] items-center justify-between overflow-hidden rounded-full py-2 pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-700",
            scrolled
              ? "border border-white/12 bg-[#06060d]/85 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
              : "border border-white/[0.11] bg-[#06060d]/45 backdrop-blur-xl",
          )}
        >
          <a href="#top" className="group flex items-center gap-2.5">
            <span data-nav-logo className="relative grid h-8 w-8 place-items-center">
              <img
                src="/images/logo.png"
                alt="maxmatech logo"
                className="h-8 w-8 object-contain transition-transform duration-500 ease-[cubic-bezier(0.34,1.35,0.64,1)] group-hover:scale-110 group-hover:rotate-[14deg]"
              />
            </span>
            <span className="font-display text-[15px] font-medium tracking-tight text-white">
              MAXMATECH
            </span>
          </a>

          <div data-nav-rest className="nav-row hidden items-center lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav-pill-item text-[13px] font-medium text-white/62">
                {l.label}
              </a>
            ))}
          </div>

          <div data-nav-rest className="flex items-center gap-2">
            <a
              href="#contact"
              className="btn-magnetic group hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#05050a] hover:shadow-[0_0_36px_-6px_rgba(196,181,253,0.65)] sm:inline-flex"
            >
              Start your journey
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-white/85 transition-colors duration-400 hover:bg-white/[0.08] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[70] flex flex-col bg-[#05050a]/94 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-6 pt-7">
              <span className="font-display text-lg font-medium text-white">maxmatech</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-start justify-center gap-1 px-6 sm:px-8">
              {MOBILE_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 + i * 0.045,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-display flex w-full items-baseline gap-4 border-b border-white/[0.11] py-3 text-3xl font-medium tracking-tight text-white/75 transition-colors duration-300 hover:text-white sm:text-4xl"
                >
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </motion.a>
              ))}

              <div className="mt-8 flex flex-col gap-2 text-white/70">
                <a
                  href="tel:01229303030"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[13px] underline-offset-4 hover:underline"
                >
                  01229303030
                </a>
                <a
                  href="mailto:info@maxmatech.com"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[13px] underline-offset-4 hover:underline"
                >
                  info@maxmatech.com
                </a>
              </div>
            </div>

            <p className="px-6 pb-10 font-mono text-[10px] tracking-[0.3em] text-white/48 uppercase sm:px-8">
              Your Certified Digital Transformation Partner
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
