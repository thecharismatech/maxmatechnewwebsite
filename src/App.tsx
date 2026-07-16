import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Industries from "./components/Industries";
import Navbar from "./components/Navbar";
import Services from "./components/Services";

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

  return (
    <div className="noise relative min-h-screen bg-[#05050a] text-white antialiased selection:bg-violet-500/40">
      {/* cursor aura */}
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
        <Services />
        <Industries />
        <Experience />
      </main>
      <Footer />
    </div>
  );
}
