import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneState } from "./threeScene";

export type SceneKeyframe = Pick<
  SceneState,
  | "assemble"
  | "turbulence"
  | "linkOpacity"
  | "moduleAlign"
  | "spin"
  | "cameraZ"
  | "nodeGlow"
  | "moduleGlow"
  | "exposure"
>;

export const SCENE_KEYFRAMES: Record<string, SceneKeyframe> = {
  hero: {
    assemble: 0,
    turbulence: 1,
    linkOpacity: 0,
    moduleAlign: 0,
    spin: -0.22,
    cameraZ: 29,
    nodeGlow: 0.55,
    moduleGlow: 0.42,
    exposure: 1,
  },
  problem: {
    assemble: 0.05,
    turbulence: 1,
    linkOpacity: 0,
    moduleAlign: 0.04,
    spin: -0.04,
    cameraZ: 32,
    nodeGlow: 0.32,
    moduleGlow: 0.3,
    exposure: 0.95,
  },
  connect: {
    assemble: 0.58,
    turbulence: 0.42,
    linkOpacity: 0.5,
    moduleAlign: 0.92,
    spin: 0.06,
    cameraZ: 25.5,
    nodeGlow: 1.15,
    moduleGlow: 1,
    exposure: 1.05,
  },
  stack: {
    assemble: 0.84,
    turbulence: 0.2,
    linkOpacity: 0.85,
    moduleAlign: 1,
    spin: 0.15,
    cameraZ: 23,
    nodeGlow: 1.05,
    moduleGlow: 0.9,
    exposure: 1.06,
  },
  industries: {
    assemble: 0.93,
    turbulence: 0.11,
    linkOpacity: 1,
    moduleAlign: 1,
    spin: 0.21,
    cameraZ: 22,
    nodeGlow: 0.95,
    moduleGlow: 0.82,
    exposure: 1.04,
  },
  proof: {
    assemble: 1,
    turbulence: 0.05,
    linkOpacity: 1,
    moduleAlign: 1,
    spin: 0.27,
    cameraZ: 20.5,
    nodeGlow: 1.25,
    moduleGlow: 0.95,
    exposure: 1.08,
  },
  support: {
    assemble: 1,
    turbulence: 0.04,
    linkOpacity: 0.88,
    moduleAlign: 1,
    spin: 0.32,
    cameraZ: 21.5,
    nodeGlow: 1.1,
    moduleGlow: 1.05,
    exposure: 1.06,
  },
  cta: {
    assemble: 1,
    turbulence: 0.02,
    linkOpacity: 0.45,
    moduleAlign: 1,
    spin: 0.38,
    cameraZ: 18.5,
    nodeGlow: 1.5,
    moduleGlow: 1.25,
    exposure: 1.12,
  },
};

const FALLBACK: SceneKeyframe = SCENE_KEYFRAMES.hero;

const INITIAL: SceneKeyframe = {
  assemble: 0,
  turbulence: 1,
  linkOpacity: 0,
  moduleAlign: 0,
  spin: -0.2,
  cameraZ: 28,
  nodeGlow: 0.6,
  moduleGlow: 0.5,
  exposure: 1,
};

interface Anchor {
  scene: string;
  at: number;
}

export interface ScrollEngineHandle {
  lenis: Lenis;
  refresh: () => void;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  destroy: () => void;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function readAnchors(): Anchor[] {
  const maxScroll = Math.max(ScrollTrigger.maxScroll(window), 1);
  const viewport = window.innerHeight;
  const anchors: Anchor[] = [];

  document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
    const scene = el.dataset.scene;
    if (!scene) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + window.scrollY + rect.height / 2 - viewport / 2;
    anchors.push({ scene, at: clamp01(center / maxScroll) });
  });

  anchors.sort((a, b) => a.at - b.at);

  let previous = -Infinity;
  return anchors.map((anchor) => {
    const at = Math.max(anchor.at, previous + 0.0005);
    previous = at;
    return { scene: anchor.scene, at };
  });
}

export interface ScrollEngineOptions {
  state: SceneState;
  onFrame?: (velocity: number) => void;
}

export function initScrollEngine({ state, onFrame }: ScrollEngineOptions): ScrollEngineHandle {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    wheelMultiplier: 1,
    touchMultiplier: 1.7,
    smoothWheel: true,
    syncTouch: true,
    syncTouchLerp: 0.09,
    overscroll: false,
    anchors: { offset: -104 },
    respectReducedMotion: true,
  });

  const master = gsap.timeline({ defaults: { ease: "power2.inOut" } });

  const buildMaster = (): void => {
    master.clear();
    const anchors = readAnchors();
    if (anchors.length === 0) {
      master.fromTo(state, { ...INITIAL }, { ...FALLBACK, duration: 1 }, 0);
      return;
    }

    let previous: SceneKeyframe = INITIAL;

    for (let i = 0; i < anchors.length; i++) {
      const keyframe = SCENE_KEYFRAMES[anchors[i].scene] ?? FALLBACK;
      const start = anchors[i].at;
      const end = i + 1 < anchors.length ? anchors[i + 1].at : 1;
      const duration = Math.max(0.001, end - start);
      master.fromTo(
        state,
        { ...previous },
        { ...keyframe, duration, immediateRender: false },
        start,
      );
      previous = keyframe;
    }
  };

  const trigger = ScrollTrigger.create({
    animation: master,
    trigger: document.documentElement,
    start: 0,
    end: () => ScrollTrigger.maxScroll(window),
    scrub: 0.45,
    invalidateOnRefresh: true,
  });

  const onRefreshInit = (): void => buildMaster();
  ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
  buildMaster();

  const tick = (time: number): void => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);

  const onLenisScroll = (instance: Lenis): void => {
    ScrollTrigger.update();
    const velocity = clamp01(Math.abs(instance.velocity) / 90);
    state.scrollVelocity = velocity;
    onFrame?.(velocity);
  };
  lenis.on("scroll", onLenisScroll);

  const refresh = (): void => {
    lenis.resize();
    buildMaster();
    ScrollTrigger.refresh();
  };

  const scrollTo = (target: string | number | HTMLElement, offset = -104): void => {
    lenis.scrollTo(target, { offset, duration: 1.35 });
  };

  const destroy = (): void => {
    gsap.ticker.remove(tick);
    ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
    lenis.off("scroll", onLenisScroll);
    trigger.kill();
    master.kill();
    lenis.destroy();
  };

  return { lenis, refresh, scrollTo, destroy };
}
