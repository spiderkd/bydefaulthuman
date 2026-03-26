"use client";

/**
 * Scribble
 *
 * A rough freehand scribble drawn over content — like a redaction mark,
 * a "wrong answer" cross-out, or an emphasis blob.
 *
 * Unlike rough-notation's `crossed-off` (just two diagonal lines),
 * Scribble fills a wobbly polygon over the content using rough.js's
 * polygon renderer with noise-distorted vertices.
 *
 * Types:
 *   "redact"   — dense filled blob, like a marker redaction
 *   "scrawl"   — loose irregular X shape drawn with 3–4 passes
 *   "circle"   — wobbly filled circle / "wrong" emphasis ring
 *   "blob"     — organic filled shape for highlighting a region
 */

import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import rough from "roughjs";
import { cn } from "@/lib/utils";
import {
  CrumbleContext,
  getRoughOptions,
  stableSeed,
  type CrumbleTheme,
} from "@/lib/rough";

export type ScribbleType = "redact" | "scrawl" | "circle" | "blob";

export interface ScribbleProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  color?: string;
  id?: string;
  opacity?: number;
  padding?: number;
  theme?: CrumbleTheme;
  type?: ScribbleType;
}

function ensureKeyframes() {
  if (typeof window === "undefined") return;
  if ((window as any).__crumble_ann_kf) return;
  const s = document.createElement("style");
  s.textContent = `@keyframes crumble-annotation-dash { to { stroke-dashoffset: 0; } }`;
  document.head.appendChild(s);
  (window as any).__crumble_ann_kf = true;
}

/** Distort a rectangle into a noisy polygon */
function noisyRect(
  x: number, y: number, w: number, h: number,
  jitter: number, seed: number, steps = 5,
): [number, number][] {
  const points: [number, number][] = [];
  const rng = mulberry32(seed);

  // Top edge
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push([x + t * w + (rng() - 0.5) * jitter, y + (rng() - 0.5) * jitter]);
  }
  // Right edge
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    points.push([x + w + (rng() - 0.5) * jitter, y + t * h + (rng() - 0.5) * jitter]);
  }
  // Bottom edge (reversed)
  for (let i = steps - 1; i >= 0; i--) {
    const t = i / steps;
    points.push([x + t * w + (rng() - 0.5) * jitter, y + h + (rng() - 0.5) * jitter]);
  }
  // Left edge (reversed)
  for (let i = steps - 1; i >= 1; i--) {
    const t = i / steps;
    points.push([x + (rng() - 0.5) * jitter, y + t * h + (rng() - 0.5) * jitter]);
  }
  return points;
}

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function Scribble({
  children,
  className,
  color = "currentColor",
  id,
  opacity = 0.85,
  padding = 4,
  style,
  theme: themeProp,
  type = "scrawl",
  ...props
}: ScribbleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const seed = stableSeed(id ?? `scribble-${type}`);

  const { theme: contextTheme } = useContext(CrumbleContext);
  const theme = themeProp ?? contextTheme;

  const strokeW = theme === "crayon" ? 3 : theme === "ink" ? 2.2 : 1.8;
  const jitter  = theme === "crayon" ? 6  : theme === "ink" ? 2   : 3;

  const draw = useCallback(() => {
    const container = containerRef.current;
    const svg       = svgRef.current;
    if (!container || !svg) return;

    ensureKeyframes();
    svg.replaceChildren();

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const pad = padding;

    const svgW = w + pad * 2 + 8;
    const svgH = h + pad * 2 + 8;
    svg.setAttribute("width",   String(svgW));
    svg.setAttribute("height",  String(svgH));
    svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);

    const rc   = rough.svg(svg);
    const cx   = pad + 4;
    const cy   = pad + 4;

    const baseOpts = getRoughOptions(theme, "border", {
      seed,
      stroke: color,
      strokeWidth: strokeW,
    });

    switch (type) {
      case "redact": {
        // Dense filled blob — 2 passes of noisy polygon
        const pts1 = noisyRect(cx - pad, cy - pad, w + pad * 2, h + pad * 2, jitter, seed);
        const pts2 = noisyRect(cx - pad, cy - pad, w + pad * 2, h + pad * 2, jitter, seed + 7);
        const node1 = rc.polygon(pts1, {
          ...baseOpts,
          fill: color,
          fillStyle: "solid",
          roughness: 2,
          stroke: color,
          strokeWidth: strokeW * 0.5,
        }) as SVGGElement;
        const node2 = rc.polygon(pts2, {
          ...baseOpts,
          fill: color,
          fillStyle: "hachure",
          hachureGap: 3,
          roughness: 2.5,
          stroke: color,
          strokeWidth: strokeW * 0.3,
        }) as SVGGElement;
        node1.style.opacity = String(opacity);
        node2.style.opacity = String(opacity * 0.6);
        svg.appendChild(node1);
        svg.appendChild(node2);
        break;
      }

      case "scrawl": {
        // Loose X with 2 diagonal lines each drawn twice, rough jitter
        const lines = [
          [cx - pad, cy - pad, cx + w + pad, cy + h + pad],
          [cx + w + pad, cy - pad, cx - pad, cy + h + pad],
        ];
        lines.forEach((l, li) => {
          for (let pass = 0; pass < 2; pass++) {
            const node = rc.line(l[0], l[1], l[2], l[3], {
              ...baseOpts,
              roughness: theme === "crayon" ? 3 : 2,
              seed: seed + li * 10 + pass,
              strokeWidth: strokeW * (pass === 0 ? 1 : 0.7),
            }) as SVGGElement;
            svg.appendChild(node);
            // Animate each pass: proportional to path length
            node.querySelectorAll("path").forEach((path) => {
              const len = path.getTotalLength();
              const dur = 200;
              const delay = (li * 2 + pass) * 120;
              path.style.strokeDasharray = String(len);
              path.style.strokeDashoffset = String(len);
              path.style.animation = `crumble-annotation-dash ${dur}ms ease-out ${delay}ms forwards`;
            });
          }
        });
        break;
      }

      case "circle": {
        // Wobbly filled ring — ellipse with hachure fill
        const cxe = cx + w / 2;
        const cye = cy + h / 2;
        const ew  = w + pad * 3.5;
        const eh  = h + pad * 3.5;

        // Two passes: fill then stroke
        const fillNode = rc.ellipse(cxe, cye, ew, eh, {
          ...baseOpts,
          fill: color,
          fillStyle: "hachure",
          hachureGap: 4,
          roughness: 2.5,
          stroke: "none",
        }) as SVGGElement;
        const strokeNode = rc.ellipse(cxe, cye, ew, eh, {
          ...baseOpts,
          fill: "none",
          roughness: 2,
          strokeWidth: strokeW * 1.2,
        }) as SVGGElement;

        fillNode.style.opacity   = String(opacity * 0.35);
        strokeNode.style.opacity = String(opacity);
        svg.appendChild(fillNode);
        svg.appendChild(strokeNode);

        // Animate stroke
        strokeNode.querySelectorAll("path").forEach((path) => {
          const len = path.getTotalLength();
          path.style.strokeDasharray = String(len);
          path.style.strokeDashoffset = String(len);
          path.style.animation = `crumble-annotation-dash 500ms ease-out 0ms forwards`;
        });
        break;
      }

      case "blob": {
        // Organic filled blob for emphasis — noisy polygon with low roughness
        const blobPts = noisyRect(
          cx - pad * 1.5, cy - pad * 1.5,
          w + pad * 3, h + pad * 3,
          jitter * 1.5, seed, 8,
        );
        const node = rc.polygon(blobPts, {
          ...baseOpts,
          fill: color,
          fillStyle: "solid",
          roughness: 1.5,
          stroke: color,
          strokeWidth: strokeW * 0.6,
        }) as SVGGElement;
        node.style.opacity = String(opacity * 0.28);
        svg.appendChild(node);

        // Stroke outline
        const outline = rc.polygon(blobPts, {
          ...baseOpts,
          fill: "none",
          roughness: 2,
          seed: seed + 3,
          stroke: color,
          strokeWidth: strokeW,
        }) as SVGGElement;
        outline.style.opacity = String(opacity * 0.7);
        svg.appendChild(outline);
        break;
      }
    }
  }, [color, jitter, opacity, padding, seed, strokeW, theme, type]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <span
      ref={containerRef}
      className={cn("relative inline-block", className)}
      style={style}
      {...props}
    >
      {children}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute overflow-visible"
        style={{ top: -(padding + 4), left: -(padding + 4) }}
      />
    </span>
  );
}
