import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Connect", href: "#connect" },
  { label: "Services", href: "#services" },
  { label: "Industries", href: "#industries" },
  { label: "Process", href: "#process" },
  { label: "Support", href: "#support" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6"
      >
        <nav
          className={cn(
            "flex w-full max-w-5xl items-center justify-between rounded-full py-3 pr-3 pl-5 transition-all duration-700",
            scrolled ? "glass-deep" : "border border-transparent",
          )}
        >
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center">
              <img
                src="/images/logo.png"
                alt="maxmatech logo"
                className="h-9 w-9 object-contain"
              />
            </span>
            <span className="font-display text-[15px] font-medium tracking-tight text-white">
              maxmatech
            </span>
          </a>

          <div className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-glow rounded-full px-3 py-2 text-[13px] font-medium text-white/55 transition-colors duration-300 hover:text-white xl:px-4"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="glass-sheen group hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_36px_-8px_rgba(139,92,246,0.6)] sm:inline-flex"
            >
              Start your journey
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 backdrop-blur-md lg:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* scroll progress */}
          <motion.div
            className="absolute -bottom-px left-6 h-px origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300"
            style={{ scaleX: progress, width: "calc(100% - 3rem)" }}
          />
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-deep fixed inset-0 z-[70] flex flex-col bg-[#05050a]/80"
          >
            <div className="flex items-center justify-between px-6 pt-7">
              <span className="font-display text-lg font-medium text-white">maxmatech</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col items-start justify-center gap-2 px-8">
              {[...links, { label: "Contact", href: "#contact" }].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-5xl font-medium tracking-tight text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </motion.a>
              ))}

              <div className="mt-6 flex flex-col gap-2 text-white/70">
                <a
                  href="tel:01229303030"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[13px] tracking-[0.02em] underline-offset-4 hover:underline"
                >
                  01229303030
                </a>
                <a
                  href="mailto:info@maxmatech.com"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[13px] tracking-[0.02em] underline-offset-4 hover:underline"
                >
                  info@maxmatech.com
                </a>
              </div>
            </div>
            <p className="px-8 pb-10 font-mono text-[11px] tracking-[0.3em] text-white/30 uppercase">
              Your Certified Digital Transformation Partner
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
