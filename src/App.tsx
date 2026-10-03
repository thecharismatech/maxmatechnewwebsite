import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import Connect from "./components/Connect";
import Engagement from "./components/Engagement";
import Experience from "./components/Experience";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Industries from "./components/Industries";
import Navbar from "./components/Navbar";
import Order from "./components/Order";
import Outcomes from "./components/Outcomes";
import Problem from "./components/Problem";
import Programme from "./components/Programme";
import Scope from "./components/Scope";
import Services from "./components/Services";
import Stack from "./components/Stack";
import Statement from "./components/Statement";
import { refreshImmersiveScene } from "./effects/immersive";

export default function App() {
  const cx = useMotionValue(-400);
  const cy = useMotionValue(-400);
  const sx = useSpring(cx, { stiffness: 90, damping: 22 });
  const sy = useSpring(cy, { stiffness: 90, damping: 22 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      cx.set(e.clientX - 350);
      cy.set(e.clientY - 350);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [cx, cy]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => refreshImmersiveScene());
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div className="noise relative min-h-screen text-white antialiased selection:bg-violet-500/40">
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="blend-screen pointer-events-none fixed top-0 left-0 z-[5] hidden h-[700px] w-[700px] rounded-full lg:block"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.10)_0%,rgba(34,211,238,0.05)_35%,transparent_65%)]" />
      </motion.div>

      <Navbar />
      <main>
        <Hero />
        <Statement />
        <Problem />
        <Order />
        <Connect />
        <Services />
        <Industries />
        <Programme />
        <Outcomes />
        <Scope />
        <Stack />
        <Experience />
        <Engagement />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
