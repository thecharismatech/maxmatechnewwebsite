import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../effects/textSplit";
import { Reveal } from "./ui";
import { Eyebrow } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const W = 900;
const H = 430;
const L = 66;
const R = 872;
const T = 34;
const B = 356;

const X_LABELS = ["Baseline", "Week 4", "Month 3", "Month 6", "Month 12"];

type Series = {
  key: string;
  label: string;
  color: string;
  glow: string;
  values: number[];
  note: string;
};

const SERIES: Series[] = [
  {
    key: "throughput",
    label: "Operational throughput",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.55)",
    values: [100, 114, 141, 166, 178],
    note: "×1.8",
  },
  {
    key: "manual",
    label: "Manual effort removed",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.5)",
    values: [100, 131, 158, 186, 205],
    note: "×2.0",
  },
  {
    key: "sameDay",
    label: "Work closed same day",
    color: "#f0abfc",
    glow: "rgba(240,171,252,0.45)",
    values: [100, 138, 176, 219, 241],
    note: "×2.4",
  },
];

const MAXI = 260;

function xAt(i: number, count: number): number {
  return L + ((R - L) * i) / (count - 1);
}

function yAt(v: number): number {
  return B - ((v - 100) / (MAXI - 100)) * (B - T);
}

function smoothPath(values: number[], count: number): string {
  const pts = values.map((v, i) => ({ x: xAt(i, count), y: yAt(v) }));
  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const lo = Math.min(p1.y, p2.y);
    const hi = Math.max(p1.y, p2.y);

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = Math.min(hi, Math.max(lo, p1.y + (p2.y - p0.y) / 6));
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = Math.min(hi, Math.max(lo, p2.y - (p3.y - p1.y) / 6));

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function areaPath(values: number[], count: number): string {
  const pts = values.map((v, i) => ({ x: xAt(i, count), y: yAt(v) }));
  return `${smoothPath(values, count)} L ${pts[pts.length - 1].x} ${B} L ${pts[0].x} ${B} Z`;
}

export default function Outcomes() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [focus, setFocus] = useState<string | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-draw]"));
    if (paths.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(paths, { strokeDasharray: "none", strokeDashoffset: 0 });
      return;
    }

    const context = gsap.context(() => {
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.1,
          delay: i * 0.22,
          ease: "power3.inOut",
          scrollTrigger: { trigger: svg, start: "top 82%", once: true },
        });
      });

      gsap.from("[data-dot]", {
        scale: 0,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        delay: 1.5,
        ease: "back.out(2)",
        transformOrigin: "center",
        scrollTrigger: { trigger: svg, start: "top 82%", once: true },
      });

      gsap.from("[data-endlabel]", {
        opacity: 0,
        x: -14,
        duration: 0.8,
        stagger: 0.1,
        delay: 1.9,
        ease: "power3.out",
        scrollTrigger: { trigger: svg, start: "top 82%", once: true },
      });
    }, svg);

    return () => context.revert();
  }, []);

  const count = X_LABELS.length;

  return (
    <section id="outcomes" data-scene="outcomes" className="section-pad relative">
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="—" accent="cyan">
                Before / after
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="h2-display mt-7 text-white uppercase">
                The curve bends
                <br />
                <span className="serif-accent text-gradient tracking-normal normal-case">
                  on go-live.
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14}>
            <p className="lede max-w-md lg:pb-3">
              Nothing changes on day one. The plateau is the honest part: mapping, data
              cleansing, and the first automation cycle. Then throughput compounds.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass-panel mt-14 overflow-hidden rounded-[2rem] p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2.5">
              {SERIES.map((s) => {
                const dim = focus !== null && focus !== s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onMouseEnter={() => setFocus(s.key)}
                    onMouseLeave={() => setFocus(null)}
                    onFocus={() => setFocus(s.key)}
                    onBlur={() => setFocus(null)}
                    aria-pressed={focus === s.key}
                    className={`chart-series flex items-center gap-2.5 rounded-full border px-4 py-2 ${
                      dim ? "chart-dim" : ""
                    } ${
                      focus === s.key
                        ? "border-white/25 bg-white/[0.08]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: s.color, boxShadow: `0 0 10px ${s.glow}` }}
                    />
                    <span className="text-[12.5px] text-white/70">{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mask-fade-x -mx-2 mt-8 overflow-x-auto px-2 pb-2">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full min-w-[620px]"
                role="img"
                aria-label="Indexed operational metrics rising over twelve months after go-live"
              >
              {[100, 140, 180, 220, 260].map((v) => (
                <g key={v}>
                  <line
                    x1={L}
                    y1={yAt(v)}
                    x2={R}
                    y2={yAt(v)}
                    stroke="rgba(255,255,255,0.09)"
                    strokeWidth="1"
                  />
                  <text
                    x={L - 14}
                    y={yAt(v) + 4}
                    textAnchor="end"
                    className="fill-white/30"
                    style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}
                  >
                    {v}
                  </text>
                </g>
              ))}

              <line
                x1={L}
                y1={B}
                x2={R}
                y2={B}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
              />

              {SERIES.map((s) => {
                const dim = focus !== null && focus !== s.key;
                return (
                  <g key={s.key} className={`chart-series ${dim ? "chart-dim" : ""}`}>
                    <path d={areaPath(s.values, count)} fill={s.glow} opacity="0.1" />
                    <path
                      data-draw
                      d={smoothPath(s.values, count)}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: `drop-shadow(0 0 7px ${s.glow})` }}
                    />
                  </g>
                );
              })}

              {SERIES.map((s) => (
                <circle
                  key={`${s.key}-dot`}
                  data-dot
                  cx={xAt(count - 1, count)}
                  cy={yAt(s.values[count - 1])}
                  r="5"
                  fill="#05050a"
                  stroke={s.color}
                  strokeWidth="2.4"
                />
              ))}

              {SERIES.map((s, i) => (
                <text
                  key={`${s.key}-end`}
                  data-endlabel
                  x={xAt(count - 1, count) + 14}
                  y={yAt(s.values[count - 1]) + 4 - i * 1}
                  style={{ fontSize: "15px", fontFamily: "var(--font-display)", fontWeight: 600 }}
                  fill={s.color}
                >
                  {s.note}
                </text>
              ))}

              {X_LABELS.map((label, i) => (
                <text
                  key={label}
                  x={xAt(i, count)}
                  y={B + 30}
                  textAnchor={i === 0 ? "start" : i === count - 1 ? "end" : "middle"}
                  className="fill-white/42"
                  style={{ fontSize: "11.5px", fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </text>
              ))}
              </svg>
            </div>

            <div className="mt-6 grid gap-5 border-t border-white/[0.11] pt-6 md:grid-cols-[1.2fr_1fr]">
              <p className="text-[12.5px] leading-relaxed text-white/60">
                Indexed to 100 at the start of an engagement. These are the trajectories we plan
                against, not a promise: the level you reach depends on process maturity, data
                quality, and how much of your operation you bring into scope.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
                {SERIES.map((s) => (
                  <div key={s.key} className="flex items-baseline gap-2">
                    <span
                      className="h-2 w-2 translate-y-[-1px] rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="font-mono text-[13px] text-white/80">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
