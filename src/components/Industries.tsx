import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Car,
  Construction,
  Factory,
  HardHat,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { Reveal, SectionHeader } from "./ui";
import { cn } from "../utils/cn";

const industries = [
  {
    icon: ShoppingBag,
    name: "Retail",
    copy: "Inventory, sales, CRM and point-of-sale unified — streamlined operations and customer experiences that let retailers thrive in a competitive market.",
  },
  {
    icon: Car,
    name: "Automotive",
    copy: "Seamlessly integrated systems delivering real-time data, optimized workflows and elevated customer satisfaction — driving growth and operational excellence.",
  },
  {
    icon: Factory,
    name: "Manufacturing",
    copy: "Customized systems that improve efficiency, cut production costs and guarantee high-quality output to meet market demand and business goals.",
  },
  {
    icon: HardHat,
    name: "Contractors",
    copy: "Projects completed on time, within budget, to the highest standards — improving overall project efficiency and profitability.",
  },
  {
    icon: Building2,
    name: "Real Estate",
    copy: "Streamlined property management, enhanced customer interactions and sharper sales efficiency — maximizing potential for sustainable growth.",
  },
  {
    icon: Construction,
    name: "Construction",
    copy: "Enhanced project visibility, tighter collaboration and efficient resource use — so construction companies deliver on time and on budget.",
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);

  return (
    <section id="industries" className="relative py-28 sm:py-36">
      <div className="absolute top-1/4 -left-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-violet-600/12 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              align="left"
              index="02"
              eyebrow="Industries"
              title={
                <>
                  A solution
                  <br />
                  for every <span className="serif-accent text-gradient tracking-normal">need.</span>
                </>
              }
              copy="We recognize the uniqueness of your business — just like Odoo. Maxmatech customizes the platform to fit your industry's exact shape, and our innovative solutions empower you to thrive."
            />
            <Reveal delay={0.2}>
              <div className="glass-chip mt-10 hidden w-fit items-center gap-4 rounded-2xl px-5 py-4 lg:flex">
                <span className="font-display text-4xl font-medium text-white">06</span>
                <span className="text-[13px] leading-snug text-white/50">
                  industry verticals,
                  <br />
                  one tailored platform
                </span>
              </div>
            </Reveal>
          </div>

          {/* rows */}
          <div className="flex flex-col gap-3">
            {industries.map((ind, i) => {
              const isActive = active === i;
              return (
                <Reveal key={ind.name} delay={i * 0.05}>
                  <div
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={cn(
                      "glass glass-sheen group cursor-pointer rounded-3xl transition-all duration-500",
                      isActive
                        ? "border-white/20 shadow-[0_0_70px_-18px_rgba(139,92,246,0.5)]"
                        : "hover:border-white/15",
                    )}
                  >
                    <div className="flex items-center gap-5 px-6 py-5 sm:px-8 sm:py-6">
                      <span className="font-mono text-xs text-white/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "glass-chip grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-all duration-500",
                          isActive && "border-violet-300/30 bg-violet-400/10",
                        )}
                      >
                        <ind.icon
                          className={cn(
                            "h-5 w-5 transition-colors duration-500",
                            isActive ? "text-violet-300" : "text-white/60",
                          )}
                          strokeWidth={1.6}
                        />
                      </span>
                      <h3
                        className={cn(
                          "font-display text-xl font-medium tracking-tight transition-colors duration-500 sm:text-2xl",
                          isActive ? "text-white" : "text-white/60",
                        )}
                      >
                        {ind.name}
                      </h3>
                      <ArrowUpRight
                        className={cn(
                          "ml-auto h-5 w-5 shrink-0 transition-all duration-500",
                          isActive
                            ? "rotate-0 text-cyan-300"
                            : "rotate-45 text-white/20 group-hover:text-white/40",
                        )}
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 pl-[4.75rem] text-sm leading-relaxed text-white/50 sm:px-8 sm:pl-[6rem]">
                            {ind.copy}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
