import * as THREE from "three";

export interface SceneState {
  assemble: number;
  turbulence: number;
  linkOpacity: number;
  moduleAlign: number;
  spin: number;
  cameraZ: number;
  nodeGlow: number;
  moduleGlow: number;
  exposure: number;
  scrollVelocity: number;
}

export function createSceneState(): SceneState {
  return {
    assemble: 0,
    turbulence: 1,
    linkOpacity: 0,
    moduleAlign: 0,
    spin: -0.2,
    cameraZ: 28,
    nodeGlow: 0.6,
    moduleGlow: 0.5,
    exposure: 1,
    scrollVelocity: 0,
  };
}

const GRID_X = 8;
const GRID_Y = 4;
const GRID_Z = 4;
const NODE_COUNT = GRID_X * GRID_Y * GRID_Z;
const MODULE_COUNT = 6;
const SPACING = 2.45;
const LATTICE_CENTER = new THREE.Vector3(0, 0.4, 0);
const MODULE_RING = 13.4;

const VIOLET = new THREE.Color("#4b3c86");
const CYAN = new THREE.Color("#175e6d");
const FUCHSIA = new THREE.Color("#d946ef");
const PALETTE = [VIOLET, CYAN, FUCHSIA];

const GLOW_VERTEX = `
attribute float aAlpha;
attribute float aScale;
attribute vec3 aColor;
uniform float uSize;
uniform float uRatio;
uniform float uTime;
uniform float uDrift;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vColor = aColor;
  vAlpha = aAlpha;
  vec3 pos = position;
  pos.y += sin(uTime * 0.22 + position.x * 0.08 + position.z * 0.05) * uDrift;
  pos.x += cos(uTime * 0.17 + position.z * 0.07) * uDrift * 0.6;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float atten = 1.0 / max(-mv.z, 2.0);
  gl_PointSize = min(uSize * aScale * uRatio * atten, 320.0);
  gl_Position = projectionMatrix * mv;
}
`;

const GLOW_FRAGMENT = `
uniform float uIntensity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;
  float f = max(0.0, 1.0 - d * 2.0);
  float core = pow(f, 3.0);
  float halo = pow(f, 1.1) * 0.32;
  float a = (core + halo) * vAlpha * uIntensity;
  if (a < 0.002) discard;
  gl_FragColor = vec4(vColor, a);
  #include <colorspace_fragment>
}
`;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = t - 1;
  return 1 + c3 * x * x * x + c1 * x * x;
}

function supportsWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    return false;
  }
}

function buildEdges(): number[] {
  const idx = (x: number, y: number, z: number) => x + y * GRID_X + z * GRID_X * GRID_Y;
  const list: number[] = [];
  for (let z = 0; z < GRID_Z; z++) {
    for (let y = 0; y < GRID_Y; y++) {
      for (let x = 0; x < GRID_X; x++) {
        if (x + 1 < GRID_X) list.push(idx(x, y, z), idx(x + 1, y, z));
        if (y + 1 < GRID_Y) list.push(idx(x, y, z), idx(x, y + 1, z));
        if (z + 1 < GRID_Z) list.push(idx(x, y, z), idx(x, y, z + 1));
      }
    }
  }
  return list;
}

export class ThreeScene {
  readonly state: SceneState = createSceneState();

  private readonly canvas: HTMLCanvasElement;
  private readonly root = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 260);
  private readonly structure = new THREE.Group();
  private readonly modulePivot = new THREE.Group();
  private readonly dummy = new THREE.Object3D();
  private readonly tmpColor = new THREE.Color();
  private lastTime = 0;

  private renderer: THREE.WebGLRenderer | null = null;

  private nodes: THREE.InstancedMesh | null = null;
  private nodeMaterial: THREE.MeshStandardMaterial | null = null;
  private nodeGlow: THREE.Points | null = null;
  private nodeGlowMaterial: THREE.ShaderMaterial | null = null;
  private links: THREE.LineSegments | null = null;
  private linkMaterial: THREE.LineBasicMaterial | null = null;
  private dust: THREE.Points | null = null;
  private dustMaterial: THREE.ShaderMaterial | null = null;
  private moduleGlow: THREE.Points | null = null;
  private moduleGlowMaterial: THREE.ShaderMaterial | null = null;
  private moduleShards: THREE.Mesh[] = [];
  private moduleMaterials: THREE.MeshStandardMaterial[] = [];
  private linkLight: THREE.PointLight | null = null;
  private linkRim: THREE.PointLight | null = null;

  private readonly chaosPos = new Float32Array(NODE_COUNT * 3);
  private readonly gridPos = new Float32Array(NODE_COUNT * 3);
  private readonly livePos = new Float32Array(NODE_COUNT * 3);
  private readonly chaosRot = new Float32Array(NODE_COUNT * 3);
  private readonly chaosScale = new Float32Array(NODE_COUNT);
  private readonly gridScale = new Float32Array(NODE_COUNT);
  private readonly delay = new Float32Array(NODE_COUNT);
  private readonly phase = new Float32Array(NODE_COUNT);
  private readonly progress = new Float32Array(NODE_COUNT);
  private readonly edges: number[];
  private readonly linkPositions: Float32Array;
  private readonly linkColors: Float32Array;
  private readonly glowPositions: Float32Array;
  private readonly glowAlphas: Float32Array;

  private readonly moduleChaos = new Float32Array(MODULE_COUNT * 3);
  private readonly moduleChaosRot = new Float32Array(MODULE_COUNT * 3);
  private readonly moduleGrid = new Float32Array(MODULE_COUNT * 3);
  private readonly moduleDelay = new Float32Array(MODULE_COUNT);
  private readonly moduleProgress = new Float32Array(MODULE_COUNT);
  private readonly moduleGlowPositions = new Float32Array(MODULE_COUNT * 3);
  private readonly moduleGlowAlphas = new Float32Array(MODULE_COUNT);

  private rafId = 0;
  private elapsed = 0;
  private pixelRatio = 1;
  private quality = 2;
  private running = false;
  private disposed = false;
  private reducedMotion = false;
  private contextLost = false;

  private pointerX = 0;
  private pointerY = 0;
  private smoothX = 0;
  private smoothY = 0;

  private readonly frameSamples: number[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private resizeQueued = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.edges = buildEdges();
    this.linkPositions = new Float32Array(this.edges.length * 3);
    this.linkColors = new Float32Array(this.edges.length * 3);
    this.glowPositions = new Float32Array(NODE_COUNT * 3);
    this.glowAlphas = new Float32Array(NODE_COUNT);
  }

  mount(): boolean {
    if (this.disposed) return false;
    if (!supportsWebGL()) {
      document.documentElement.classList.add("webgl-unavailable");
      return false;
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 820px)").matches;
    this.quality = narrow || coarse ? 1 : 2;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.quality === 2 ? 2 : 1.5);

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: this.quality === 2,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      document.documentElement.classList.add("webgl-unavailable");
      return false;
    }

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.setClearColor(0x000000, 0);

    this.root.add(this.structure);
    this.structure.add(this.modulePivot);

    this.layoutData();
    this.buildLights();
    this.buildLattice();
    this.buildNetwork();
    this.buildModules();
    this.buildDust();

    this.bindEvents();
    this.syncViewport();

    document.documentElement.classList.add("webgl-ready");

    if (this.reducedMotion) {
      this.state.assemble = 1;
      this.state.linkOpacity = 0.9;
      this.state.moduleAlign = 1;
      this.state.spin = 0.22;
      this.state.cameraZ = 22;
      this.state.nodeGlow = 1;
      this.state.moduleGlow = 1;
      this.step(0);
      this.renderer.render(this.root, this.camera);
    } else {
      this.start();
    }
    return true;
  }

  private layoutData(): void {
    const rnd = mulberry32(0x9e3779b9);
    const hx = (GRID_X - 1) / 2;
    const hy = (GRID_Y - 1) / 2;
    const hz = (GRID_Z - 1) / 2;

    for (let z = 0; z < GRID_Z; z++) {
      for (let y = 0; y < GRID_Y; y++) {
        for (let x = 0; x < GRID_X; x++) {
          const i = x + y * GRID_X + z * GRID_X * GRID_Y;
          const o = i * 3;

          this.gridPos[o] = LATTICE_CENTER.x + (x - hx) * SPACING;
          this.gridPos[o + 1] = LATTICE_CENTER.y + (y - hy) * SPACING;
          this.gridPos[o + 2] = LATTICE_CENTER.z + (z - hz) * SPACING;

          const radius = 7 + rnd() * 13;
          const theta = rnd() * Math.PI * 2;
          const phi = Math.acos(2 * rnd() - 1);
          this.chaosPos[o] = radius * Math.sin(phi) * Math.cos(theta);
          this.chaosPos[o + 1] = (rnd() - 0.5) * 20;
          this.chaosPos[o + 2] = radius * Math.sin(phi) * Math.sin(theta);

          this.chaosRot[o] = rnd() * Math.PI * 2;
          this.chaosRot[o + 1] = rnd() * Math.PI * 2;
          this.chaosRot[o + 2] = rnd() * Math.PI * 2;

          this.chaosScale[i] = 0.22 + rnd() * 0.62;
          this.gridScale[i] = 0.3 + (1 - Math.abs(z - hz) / GRID_Z) * 0.16;
          this.delay[i] = rnd() * 0.62;
          this.phase[i] = rnd() * Math.PI * 2;
          this.progress[i] = 0;
          this.glowAlphas[i] = 0;
        }
      }
    }

    const mrnd = mulberry32(0x51ed270b);
    for (let m = 0; m < MODULE_COUNT; m++) {
      const o = m * 3;
      const angle = (m / MODULE_COUNT) * Math.PI * 2;
      this.moduleGrid[o] = Math.cos(angle) * MODULE_RING;
      this.moduleGrid[o + 1] = LATTICE_CENTER.y;
      this.moduleGrid[o + 2] = Math.sin(angle) * MODULE_RING;

      const far = 19 + mrnd() * 12;
      const theta = mrnd() * Math.PI * 2;
      this.moduleChaos[o] = Math.cos(theta) * far;
      this.moduleChaos[o + 1] = (mrnd() - 0.5) * 22;
      this.moduleChaos[o + 2] = Math.sin(theta) * far;

      this.moduleChaosRot[o] = mrnd() * Math.PI * 2;
      this.moduleChaosRot[o + 1] = mrnd() * Math.PI * 2;
      this.moduleChaosRot[o + 2] = mrnd() * Math.PI * 2;
      this.moduleDelay[m] = mrnd() * 0.45;
      this.moduleProgress[m] = 0;
      this.moduleGlowAlphas[m] = 0;
    }
  }

  private buildLights(): void {
    this.root.add(new THREE.AmbientLight(0x1c1c30, 1.35));

    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(6, 11, 9);
    this.root.add(key);

    const fill = new THREE.DirectionalLight(0x4b3c86, 1.1);
    fill.position.set(-9, -4, 6);
    this.root.add(fill);

    this.linkLight = new THREE.PointLight(0x4b3c86, 600, 70, 2);
    this.linkLight.position.set(-11, 6, 7);
    this.root.add(this.linkLight);

    this.linkRim = new THREE.PointLight(0x175e6d, 460, 70, 2);
    this.linkRim.position.set(11, -5, 6);
    this.root.add(this.linkRim);
  }

  private buildLattice(): void {
    const geometry = new THREE.OctahedronGeometry(1, 0);
    this.nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color("#2a1257"),
      emissiveIntensity: 0.85,
      metalness: 0.86,
      roughness: 0.24,
      flatShading: true,
    });

    const mesh = new THREE.InstancedMesh(geometry, this.nodeMaterial, NODE_COUNT);
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const rnd = mulberry32(0x2545f491);
    for (let i = 0; i < NODE_COUNT; i++) {
      const mix = 0.25 + rnd() * 0.75;
      this.tmpColor.copy(VIOLET).lerp(CYAN, mix);
      if (rnd() > 0.86) this.tmpColor.lerp(FUCHSIA, 0.5);
      mesh.setColorAt(i, this.tmpColor);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    this.nodes = mesh;
    this.structure.add(mesh);

    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute("position", new THREE.BufferAttribute(this.glowPositions, 3));
    glowGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(this.glowAlphas, 1));
    const scales = new Float32Array(NODE_COUNT);
    const colors = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      scales[i] = 0.5 + rnd() * 0.7;
      this.tmpColor.copy(VIOLET).lerp(CYAN, 0.25 + rnd() * 0.75);
      this.tmpColor.toArray(colors, i * 3);
    }
    glowGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    glowGeometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    (glowGeometry.getAttribute("position") as THREE.BufferAttribute).setUsage(
      THREE.DynamicDrawUsage,
    );
    (glowGeometry.getAttribute("aAlpha") as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

    this.nodeGlowMaterial = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: GLOW_FRAGMENT,
      uniforms: {
        uSize: { value: 300 },
        uRatio: { value: this.pixelRatio },
        uTime: { value: 0 },
        uDrift: { value: 0 },
        uIntensity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.nodeGlow = new THREE.Points(glowGeometry, this.nodeGlowMaterial);
    this.nodeGlow.frustumCulled = false;
    this.nodeGlow.renderOrder = 6;
    this.structure.add(this.nodeGlow);
  }

  private buildNetwork(): void {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.linkPositions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(this.linkColors, 3));
    (geometry.getAttribute("position") as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    (geometry.getAttribute("color") as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

    this.linkMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.links = new THREE.LineSegments(geometry, this.linkMaterial);
    this.links.frustumCulled = false;
    this.links.renderOrder = 4;
    this.structure.add(this.links);
  }

  private buildModules(): void {
    const geometry = new THREE.OctahedronGeometry(0.72, 0);
    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute("position", new THREE.BufferAttribute(this.moduleGlowPositions, 3));
    glowGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(this.moduleGlowAlphas, 1));
    const scales = new Float32Array(MODULE_COUNT).fill(1.5);
    const colors = new Float32Array(MODULE_COUNT * 3);
    (glowGeometry.getAttribute("position") as THREE.BufferAttribute).setUsage(
      THREE.DynamicDrawUsage,
    );
    (glowGeometry.getAttribute("aAlpha") as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

    for (let m = 0; m < MODULE_COUNT; m++) {
      const tint = PALETTE[m % PALETTE.length].clone().lerp(CYAN, m === 0 ? 0.15 : 0.35);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: tint.clone().multiplyScalar(0.42),
        emissiveIntensity: 1.1,
        metalness: 0.9,
        roughness: 0.18,
        flatShading: true,
      });
      this.moduleMaterials.push(material);

      const shard = new THREE.Mesh(geometry, material);
      shard.scale.set(0.82, 1.72, 0.82);
      shard.frustumCulled = false;
      this.moduleShards.push(shard);
      this.modulePivot.add(shard);

      tint.toArray(colors, m * 3);
    }

    glowGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    glowGeometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    this.moduleGlowMaterial = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: GLOW_FRAGMENT,
      uniforms: {
        uSize: { value: 340 },
        uRatio: { value: this.pixelRatio },
        uTime: { value: 0 },
        uDrift: { value: 0 },
        uIntensity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.moduleGlow = new THREE.Points(glowGeometry, this.moduleGlowMaterial);
    this.moduleGlow.frustumCulled = false;
    this.moduleGlow.renderOrder = 7;
    this.modulePivot.add(this.moduleGlow);
  }

  private buildDust(): void {
    const count = this.quality === 2 ? 900 : 380;
    const rnd = mulberry32(0x1b873593);
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 18 + rnd() * 52;
      const theta = rnd() * Math.PI * 2;
      const y = (rnd() - 0.5) * 46;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius - 10;
      alphas[i] = 0.08 + rnd() * 0.2;
      scales[i] = 0.4 + rnd() * 0.9;
      this.tmpColor.copy(PALETTE[i % 3]).lerp(new THREE.Color(1, 1, 1), 0.35);
      this.tmpColor.toArray(colors, i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    this.dustMaterial = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: GLOW_FRAGMENT,
      uniforms: {
        uSize: { value: 150 },
        uRatio: { value: this.pixelRatio },
        uTime: { value: 0 },
        uDrift: { value: 1.4 },
        uIntensity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    });

    this.dust = new THREE.Points(geometry, this.dustMaterial);
    this.dust.frustumCulled = false;
    this.dust.renderOrder = 2;
    this.structure.add(this.dust);
  }

  private step(dt: number): void {
    const state = this.state;
    this.elapsed += dt;

    const damp = 1 - Math.pow(0.0016, dt);
    this.smoothX += (this.pointerX - this.smoothX) * damp;
    this.smoothY += (this.pointerY - this.smoothY) * damp;

    this.updateLattice();
    this.updateModules();

    const velocity = state.scrollVelocity;
    this.structure.rotation.y = state.spin + this.elapsed * 0.014 + velocity * 0.06;
    this.structure.rotation.x = this.smoothY * 0.09 + Math.sin(this.elapsed * 0.11) * 0.018;
    this.structure.rotation.z = this.smoothX * 0.05;
    this.structure.position.x = this.smoothX * 0.7;
    this.structure.position.y = -this.smoothY * 0.5;

    this.modulePivot.rotation.y = -this.elapsed * 0.055;

    const targetZ = state.cameraZ - Math.abs(velocity) * 3.4;
    this.camera.position.z += (targetZ - this.camera.position.z) * (1 - Math.pow(0.002, dt));
    this.camera.position.x += this.smoothX * 1.4 - this.camera.position.x * damp;
    this.camera.position.y += -this.smoothY * 0.9 - this.camera.position.y * damp;
    this.camera.lookAt(LATTICE_CENTER.x, LATTICE_CENTER.y, LATTICE_CENTER.z);

    if (this.nodeGlowMaterial) {
      this.nodeGlowMaterial.uniforms.uTime.value = this.elapsed;
      this.nodeGlowMaterial.uniforms.uIntensity.value = state.nodeGlow;
    }
    if (this.moduleGlowMaterial) {
      this.moduleGlowMaterial.uniforms.uTime.value = this.elapsed;
      this.moduleGlowMaterial.uniforms.uIntensity.value = state.moduleGlow;
    }
    if (this.dustMaterial) this.dustMaterial.uniforms.uTime.value = this.elapsed;
    if (this.linkMaterial) this.linkMaterial.opacity = state.linkOpacity;
    if (this.nodeMaterial) this.nodeMaterial.emissiveIntensity = 0.55 + state.assemble * 0.8;
    if (this.renderer) this.renderer.toneMappingExposure = state.exposure;
    if (this.linkLight) this.linkLight.intensity = 500 + state.assemble * 900;
    if (this.linkRim) this.linkRim.intensity = 400 + state.assemble * 700;
  }

  private updateLattice(): void {
    const nodes = this.nodes;
    if (!nodes) return;
    const state = this.state;
    const wobble = state.turbulence;

    for (let i = 0; i < NODE_COUNT; i++) {
      const o = i * 3;
      const span = 1 - this.delay[i];
      const local = clamp01((state.assemble - this.delay[i]) / span);
      const eased = clamp01(easeOutBack(local));
      const settle = smoothstep(local);
      const t = local > 0 ? eased : 0;

      const drift = (1 - settle) * wobble;
      const bobX = Math.sin(this.elapsed * 0.7 + this.phase[i]) * 1.15 * drift;
      const bobY = Math.cos(this.elapsed * 0.61 + this.phase[i] * 1.7) * 1.35 * drift;
      const bobZ = Math.sin(this.elapsed * 0.53 + this.phase[i] * 2.3) * 1.05 * drift;

      const cx = this.chaosPos[o] + bobX;
      const cy = this.chaosPos[o + 1] + bobY;
      const cz = this.chaosPos[o + 2] + bobZ;

      const px = lerp(cx, this.gridPos[o], t);
      const py = lerp(cy, this.gridPos[o + 1], t);
      const pz = lerp(cz, this.gridPos[o + 2], t);
      this.livePos[o] = px;
      this.livePos[o + 1] = py;
      this.livePos[o + 2] = pz;

      const tumble = (1 - settle) * (0.55 + this.delay[i]);
      const spin = this.elapsed * (0.25 + this.delay[i] * 0.6) * tumble;

      this.dummy.position.set(px, py, pz);
      this.dummy.rotation.set(
        this.chaosRot[o] * tumble + spin * 0.6,
        this.chaosRot[o + 1] * tumble + spin,
        this.chaosRot[o + 2] * tumble - spin * 0.4,
      );

      const breathe = 1 + Math.sin(this.elapsed * 1.5 + this.phase[i]) * 0.05;
      const size = lerp(this.chaosScale[i], this.gridScale[i], settle) * breathe;
      this.dummy.scale.setScalar(size);
      this.dummy.updateMatrix();
      nodes.setMatrixAt(i, this.dummy.matrix);

      this.progress[i] = t;
      this.glowPositions[o] = px;
      this.glowPositions[o + 1] = py;
      this.glowPositions[o + 2] = pz;

      const snap = Math.exp(-Math.pow((local - 0.88) / 0.19, 2));
      const idle = 0.3 + 0.16 * Math.sin(this.elapsed * 1.2 + this.phase[i] * 2.1);
      this.glowAlphas[i] = clamp01(t * idle + snap * 0.95 * (0.35 + settle * 0.65));
    }

    nodes.instanceMatrix.needsUpdate = true;

    const glowGeometry = this.nodeGlow?.geometry;
    if (glowGeometry) {
      (glowGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (glowGeometry.getAttribute("aAlpha") as THREE.BufferAttribute).needsUpdate = true;
    }

    this.updateLinks();

    if (this.nodeGlow) this.nodeGlow.visible = this.quality > 0;
  }

  private updateLinks(): void {
    const links = this.links;
    if (!links) return;
    const positions = links.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colors = links.geometry.getAttribute("color") as THREE.BufferAttribute;

    for (let e = 0; e < this.edges.length; e++) {
      const nodeIndex = this.edges[e];
      const o = nodeIndex * 3;
      const v = e * 3;
      this.linkPositions[v] = this.livePos[o];
      this.linkPositions[v + 1] = this.livePos[o + 1];
      this.linkPositions[v + 2] = this.livePos[o + 2];

      const gate = Math.min(this.progress[nodeIndex], this.progress[this.edges[e ^ 1]]);
      const lift = 0.55 + 0.45 * gate;
      this.tmpColor.copy(VIOLET).lerp(CYAN, 0.35 + gate * 0.5);
      this.tmpColor.multiplyScalar(gate * lift);
      this.tmpColor.toArray(this.linkColors, v);
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
    links.visible = this.state.linkOpacity > 0.01 && this.quality > 0;
  }

  private updateModules(): void {
    const align = this.state.moduleAlign;
    for (let m = 0; m < MODULE_COUNT; m++) {
      const o = m * 3;
      const span = 1 - this.moduleDelay[m];
      const local = clamp01((align - this.moduleDelay[m]) / span);
      const settle = smoothstep(local);
      const t = clamp01(easeOutBack(local));

      const drift = (1 - settle) * this.state.turbulence;
      const spin = this.elapsed * 1.1 * drift;
      const px = lerp(this.moduleChaos[o] + Math.sin(this.elapsed * 0.8 + m) * drift * 2.2, this.moduleGrid[o], t);
      const py = lerp(
        this.moduleChaos[o + 1] + Math.cos(this.elapsed * 0.7 + m * 1.4) * drift * 2.6,
        this.moduleGrid[o + 1],
        t,
      );
      const pz = lerp(
        this.moduleChaos[o + 2] + Math.sin(this.elapsed * 0.6 + m * 2.1) * drift * 2.2,
        this.moduleGrid[o + 2],
        t,
      );

      const shard = this.moduleShards[m];
      shard.position.set(px, py, pz);
      shard.rotation.set(
        this.moduleChaosRot[o] * (1 - settle) + spin,
        this.moduleChaosRot[o + 1] * (1 - settle) - spin * 0.5 + Math.atan2(this.moduleGrid[o], this.moduleGrid[o + 2]) * settle,
        this.moduleChaosRot[o + 2] * (1 - settle),
      );
      const pulse = 1 + Math.sin(this.elapsed * 1.3 + m * 1.9) * 0.06;
      const size = lerp(0.72 + Math.abs(this.moduleChaos[o]) * 0.012, 1, settle) * pulse;
      shard.scale.set(0.82 * size, 1.72 * size, 0.82 * size);

      const material = this.moduleMaterials[m];
      if (material) material.emissiveIntensity = 0.7 + settle * 0.9;

      this.moduleProgress[m] = t;
      this.moduleGlowPositions[o] = px;
      this.moduleGlowPositions[o + 1] = py;
      this.moduleGlowPositions[o + 2] = pz;
      const snap = Math.exp(-Math.pow((local - 0.86) / 0.2, 2));
      this.moduleGlowAlphas[m] = clamp01(t * 0.42 + snap * 0.9 * (0.3 + settle * 0.7));
    }

    const glowGeometry = this.moduleGlow?.geometry;
    if (glowGeometry) {
      (glowGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (glowGeometry.getAttribute("aAlpha") as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  private readonly tick = (): void => {
    if (!this.running || this.disposed) return;
    this.rafId = window.requestAnimationFrame(this.tick);
    const now = performance.now();
    const dt = this.lastTime === 0 ? 1 / 60 : Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.step(dt);
    if (this.renderer) this.renderer.render(this.root, this.camera);
    this.sample(dt);
  };

  private resetClock(): void {
    this.lastTime = performance.now();
  }

  private sample(dt: number): void {
    if (dt <= 0) return;
    this.frameSamples.push(dt);
    if (this.frameSamples.length < 90) return;
    const avg = this.frameSamples.reduce((a, b) => a + b, 0) / this.frameSamples.length;
    this.frameSamples.length = 0;

    if (avg > 1 / 42 && this.pixelRatio > 1) {
      this.pixelRatio = Math.max(1, this.pixelRatio - 0.5);
      this.applyPixelRatio();
      return;
    }
    if (avg > 1 / 32 && this.quality > 0) {
      this.quality -= 1;
      if (this.quality < 2 && this.dust) this.dust.visible = false;
      if (this.quality < 1) {
        if (this.nodeGlow) this.nodeGlow.visible = false;
        if (this.moduleGlow) this.moduleGlow.visible = false;
      }
      if (this.quality < 2 && this.links) this.links.visible = this.state.linkOpacity > 0.01;
    }
  }

  private applyPixelRatio(): void {
    if (!this.renderer) return;
    this.renderer.setPixelRatio(this.pixelRatio);
    if (this.nodeGlowMaterial) this.nodeGlowMaterial.uniforms.uRatio.value = this.pixelRatio;
    if (this.moduleGlowMaterial) this.moduleGlowMaterial.uniforms.uRatio.value = this.pixelRatio;
    if (this.dustMaterial) this.dustMaterial.uniforms.uRatio.value = this.pixelRatio;
    this.syncViewport();
  }

  isRunning(): boolean {
  return this.running;
}

syncViewport(): void {
    if (!this.renderer) return;
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;
    this.renderer.setSize(width, height, false);
    if (this.camera.aspect !== width / height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  private readonly queueResize = (): void => {
    if (this.resizeQueued) return;
    this.resizeQueued = true;
    window.requestAnimationFrame(() => {
      this.resizeQueued = false;
      this.syncViewport();
    });
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.reducedMotion) return;
    this.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  private readonly onVisibility = (): void => {
    if (this.reducedMotion || this.contextLost) return;
    if (document.hidden) this.stop();
    else this.start();
  };

  private readonly onContextLost = (event: Event): void => {
    event.preventDefault();
    this.contextLost = true;
    this.stop();
    document.documentElement.classList.add("webgl-unavailable");
  };

  private readonly onContextRestored = (): void => {
    this.contextLost = false;
    document.documentElement.classList.remove("webgl-unavailable");
    if (this.reducedMotion) return;
    this.resetClock();
    this.start();
  };

  private bindEvents(): void {
    window.addEventListener("resize", this.queueResize, { passive: true });
    window.addEventListener("orientationchange", this.queueResize, { passive: true });
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    this.canvas.addEventListener("webglcontextlost", this.onContextLost, false);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored, false);

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.queueResize);
      this.resizeObserver.observe(this.canvas);
    }
  }

  private unbindEvents(): void {
    window.removeEventListener("resize", this.queueResize);
    window.removeEventListener("orientationchange", this.queueResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  start(): void {
    if (this.running || this.disposed || this.reducedMotion || this.contextLost) return;
    this.running = true;
    this.resetClock();
    this.rafId = window.requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) window.cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.unbindEvents();

    this.nodes?.geometry.dispose();
    this.nodeGlow?.geometry.dispose();
    this.links?.geometry.dispose();
    this.dust?.geometry.dispose();
    this.moduleGlow?.geometry.dispose();

    for (const material of this.moduleMaterials) material.dispose();
    this.moduleMaterials.length = 0;
    const shardGeometry = this.moduleShards[0]?.geometry;
    if (shardGeometry) shardGeometry.dispose();
    this.moduleShards.length = 0;

    this.nodeMaterial?.dispose();
    this.linkMaterial?.dispose();
    this.nodeGlowMaterial?.dispose();
    this.moduleGlowMaterial?.dispose();
    this.dustMaterial?.dispose();

    this.root.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    this.renderer = null;

    document.documentElement.classList.remove("webgl-ready");
  }
}
