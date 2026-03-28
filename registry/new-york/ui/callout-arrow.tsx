"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { useRough } from "@/hooks/use-rough";
import { cn } from "@/lib/utils";
import { stableSeed, type CrumbleTheme } from "@/lib/rough";

export interface CalloutArrowProps {
  className?: string;
  color?: string;
  curvature?: number;
  duration?: number;
  fromRef: RefObject<HTMLElement | null>;
  id?: string;
  label?: ReactNode;
  style?: CSSProperties;
  theme?: CrumbleTheme;
  toRef: RefObject<HTMLElement | null>;
  withHead?: boolean;
}

function ensureKeyframes() {
  if (typeof window === "undefined") return;
  if ((window as any).__crumble_ann_kf) return;
  const s = document.createElement("style");
  s.textContent = `@keyframes crumble-annotation-dash { to { stroke-dashoffset: 0; } }`;
  document.head.appendChild(s);
  (window as any).__crumble_ann_kf = true;
}

function animateGroup(node: Element, duration: number, delay = 0) {
  node.querySelectorAll("path").forEach((path) => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.style.animation = `crumble-annotation-dash ${duration}ms ease-out ${delay}ms forwards`;
  });
}

function getClosestCommonAncestor(a: HTMLElement, b: HTMLElement): HTMLElement {
  const parentsA = new Set<HTMLElement>();
  let node: HTMLElement | null = a;
  while (node) {
    parentsA.add(node);
    node = node.parentElement;
  }
  let node2: HTMLElement | null = b;
  while (node2) {
    if (parentsA.has(node2)) return node2;
    node2 = node2.parentElement;
  }
  return document.body;
}

export function CalloutArrow({
  className,
  color = "currentColor",
  curvature = 80,
  duration: durationProp,
  fromRef,
  id,
  label,
  style,
  theme: themeProp,
  toRef,
  withHead = true,
}: CalloutArrowProps) {
  const externalSvgRef = useRef<SVGSVGElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ancestorRef = useRef<HTMLElement | null>(null);
  const restoredPositionRef = useRef<string | null>(null); // ← track original position
  const lastDrawKey = useRef<string>(""); // ← cache key to skip redundant draws

  const stableId = id ?? "callout-arrow";
  const baseSeed = stableSeed(stableId);
  const { drawLine, drawPath, svgRef, theme } = useRough({
    variant: "border",
    stableId,
    svgRef: externalSvgRef,
    theme: themeProp,
  });

  const themeDuration = theme === "ink" ? 450 : theme === "crayon" ? 750 : 580;
  const duration = durationProp ?? themeDuration;
  const strokeW = theme === "crayon" ? 2.5 : theme === "ink" ? 2 : 1.5;

  const draw = useCallback(() => {
    const svg = svgRef.current;
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    if (!svg || !fromEl || !toEl) return;

    ensureKeyframes();

    const ancestor = getClosestCommonAncestor(fromEl, toEl);

    // ── Batch all DOM reads first ──────────────────────────────────────────
    const base = ancestor.getBoundingClientRect();
    const fr = fromEl.getBoundingClientRect();
    const tr = toEl.getBoundingClientRect();

    // Build a cheap cache key — skip redraw if nothing moved
    const drawKey = `${fr.left},${fr.top},${tr.left},${tr.top},${base.width},${base.height}`;
    if (drawKey === lastDrawKey.current) return;
    lastDrawKey.current = drawKey;

    // ── DOM writes after all reads ─────────────────────────────────────────
    if (ancestorRef.current !== ancestor) {
      ancestorRef.current = ancestor;
      const existingPosition = window.getComputedStyle(ancestor).position;
      if (existingPosition === "static") {
        restoredPositionRef.current = ""; // was static, restore to ""
        ancestor.style.position = "relative";
      } else {
        restoredPositionRef.current = null; // don't touch it
      }
      if (svg.parentElement !== ancestor) ancestor.appendChild(svg);
      if (labelRef.current?.parentElement !== ancestor)
        ancestor.appendChild(labelRef.current!);
    }

    const w = base.width;
    const h = base.height;
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.replaceChildren();

    // Coords
    const x1 = fr.left - base.left + fr.width / 2;
    const y1 = fr.top - base.top + fr.height / 2;
    const x2 = tr.left - base.left + tr.width / 2;
    const y2 = tr.top - base.top + tr.height / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
    const cpx = (x1 + x2) / 2 - (dy / mag) * curvature;
    const cpy = (y1 + y2) / 2 + (dx / mag) * curvature;

    const curve = drawPath(`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`, {
      fill: "none",
      seed: baseSeed,
      stroke: color,
      strokeWidth: strokeW,
    }) as SVGGElement | null;
    if (!curve) return;
    svg.appendChild(curve);
    animateGroup(curve, duration * 0.8);

    if (withHead) {
      const tx = x2 - cpx;
      const ty = y2 - cpy;
      const tl = Math.sqrt(tx * tx + ty * ty) || 1;
      const angle = Math.atan2(ty / tl, tx / tl);
      const hs = theme === "crayon" ? 14 : 11;

      const h1 = drawLine(
        x2,
        y2,
        x2 - Math.cos(angle - 0.48) * hs,
        y2 - Math.sin(angle - 0.48) * hs,
        { seed: baseSeed + 1, stroke: color, strokeWidth: strokeW },
      ) as SVGGElement | null;
      const h2 = drawLine(
        x2,
        y2,
        x2 - Math.cos(angle + 0.48) * hs,
        y2 - Math.sin(angle + 0.48) * hs,
        { seed: baseSeed + 2, stroke: color, strokeWidth: strokeW },
      ) as SVGGElement | null;

      if (h1) {
        svg.appendChild(h1);
        animateGroup(h1, duration * 0.15, duration * 0.8);
      }
      if (h2) {
        svg.appendChild(h2);
        animateGroup(h2, duration * 0.15, duration * 0.8);
      }
    }

    if (labelRef.current) {
      labelRef.current.style.left = `${x1}px`;
      labelRef.current.style.top = `${y1 - 14}px`;
    }
  }, [
    color,
    curvature,
    baseSeed,
    duration,
    drawLine,
    drawPath,
    fromRef,
    strokeW,
    theme,
    toRef,
    withHead,
  ]);

  // ── ResizeObserver instead of window resize ────────────────────────────
  useEffect(() => {
    const raf = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    // Observe both elements for size/position changes — much cheaper than window resize
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => draw());
    });
    if (fromRef.current) ro.observe(fromRef.current);
    if (toRef.current) ro.observe(toRef.current);
    // Also observe ancestor container if available
    if (ancestorRef.current) ro.observe(ancestorRef.current);
    return () => ro.disconnect();
  }, [draw, fromRef, toRef]);

  // ── Cleanup: restore ancestor styles ──────────────────────────────────
  useEffect(() => {
    return () => {
      svgRef.current?.remove();
      labelRef.current?.remove();
      if (restoredPositionRef.current !== null && ancestorRef.current) {
        ancestorRef.current.style.position = restoredPositionRef.current;
      }
    };
  }, []);

  return (
    <>
      <svg
        ref={externalSvgRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 overflow-visible z-50",
          className,
        )}
        style={style}
      />
      {label ? (
        <span
          ref={labelRef}
          aria-hidden="true"
          className="pointer-events-none absolute z-50 whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-medium select-none"
          style={{ color, transform: "translate(-50%, -100%)" }}
        >
          {label}
        </span>
      ) : null}
    </>
  );
}
