import { ThreeScene } from "./threeScene";
import { initScrollEngine } from "./scrollEngine";

export interface ImmersiveHandle {
  refresh: () => void;
  destroy: () => void;
}

let handle: ImmersiveHandle | null = null;

export function mountImmersiveScene(canvasId = "webgl-canvas"): ImmersiveHandle | null {
  if (handle) return handle;

  const canvas = document.getElementById(canvasId);
  if (!(canvas instanceof HTMLCanvasElement)) return null;

  const scene = new ThreeScene(canvas);
  const mounted = scene.mount();
  document.documentElement.classList.add(mounted ? "webgl-ready" : "webgl-unavailable");

  if (!mounted) {
    handle = {
      refresh: () => undefined,
      destroy: () => {
        scene.dispose();
        handle = null;
      },
    };
    return handle;
  }

  const engine = initScrollEngine({ state: scene.state });

  handle = {
    refresh: () => {
      scene.syncViewport();
      engine.refresh();
    },
    destroy: () => {
      engine.destroy();
      scene.dispose();
      handle = null;
    },
  };

  window.addEventListener("load", () => handle?.refresh(), { once: true });

  return handle;
}

export function refreshImmersiveScene(): void {
  handle?.refresh();
}

export function destroyImmersiveScene(): void {
  handle?.destroy();
}
