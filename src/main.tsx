import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App";
import { mountImmersiveScene, refreshImmersiveScene } from "./effects/immersive";

const immersive = mountImmersiveScene();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);

requestAnimationFrame(() => {
  immersive?.refresh();
  requestAnimationFrame(() => immersive?.refresh());
});

if (document.fonts?.ready) {
  document.fonts.ready.then(() => refreshImmersiveScene());
}
