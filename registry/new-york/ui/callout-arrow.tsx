// // "use client";

// // /**
// //  * CalloutArrow
// //  *
// //  * A hand-drawn curved arrow connecting two DOM elements.
// //  * Renders into a fixed SVG overlay so it works across any layout.
// //  *
// //  * Usage:
// //  *   const buttonRef = useRef(null)
// //  *   const labelRef  = useRef(null)
// //  *
// //  *   <button ref={buttonRef}>Click me</button>
// //  *   <p ref={labelRef}>This button does something</p>
// //  *   <CalloutArrow fromRef={labelRef} toRef={buttonRef} label="→ over here" />
// //  */

// // import {
// //   useCallback,
// //   useContext,
// //   useEffect,
// //   useRef,
// //   useState,
// //   type CSSProperties,
// //   type ReactNode,
// //   type RefObject,
// // } from "react";
// // import rough from "roughjs";
// // import { cn } from "@/lib/utils";
// // import {
// //   CrumbleContext,
// //   getRoughOptions,
// //   stableSeed,
// //   type CrumbleTheme,
// // } from "@/lib/rough";

// // export interface CalloutArrowProps {
// //   className?: string;
// //   color?: string;
// //   /**
// //    * How much the arc bows. Positive = curves toward the left/up perpendicular.
// //    * 0 = straight line. 80 is a nice default.
// //    */
// //   curvature?: number;
// //   /** Element the tail starts from */
// //   fromRef: RefObject<HTMLElement | null>;
// //   id?: string;
// //   /** Optional label near the tail */
// //   label?: ReactNode;
// //   style?: CSSProperties;
// //   theme?: CrumbleTheme;
// //   /** Element the head points at */
// //   toRef: RefObject<HTMLElement | null>;
// //   withHead?: boolean;
// // }

// // function ensureKeyframes() {
// //   if (typeof window === "undefined") return;
// //   if ((window as any).__crumble_ann_kf) return;
// //   const s = document.createElement("style");
// //   s.textContent = `@keyframes crumble-annotation-dash { to { stroke-dashoffset: 0; } }`;
// //   document.head.appendChild(s);
// //   (window as any).__crumble_ann_kf = true;
// // }

// // function animateGroup(node: Element, duration: number, delay = 0) {
// //   node.querySelectorAll("path").forEach((path) => {
// //     const len = path.getTotalLength();
// //     path.style.strokeDasharray = String(len);
// //     path.style.strokeDashoffset = String(len);
// //     path.style.animation = `crumble-annotation-dash ${duration}ms ease-out ${delay}ms forwards`;
// //   });
// // }

// // export function CalloutArrow({
// //   className,
// //   color = "currentColor",
// //   curvature = 80,
// //   fromRef,
// //   id,
// //   label,
// //   style,
// //   theme: themeProp,
// //   toRef,
// //   withHead = true,
// // }: CalloutArrowProps) {
// //   const svgRef = useRef<SVGSVGElement>(null);
// //   const [labelPos, setLabelPos] = useState<{ x: number; y: number } | null>(null);

// //   const seed = stableSeed(id ?? "callout-arrow");
// //   const { theme: contextTheme } = useContext(CrumbleContext);
// //   const theme = themeProp ?? contextTheme;

// //   const duration = theme === "ink" ? 450 : theme === "crayon" ? 750 : 580;
// //   const strokeW  = theme === "crayon" ? 2.5 : theme === "ink" ? 2 : 1.5;

// //   const draw = useCallback(() => {
// //     const svg    = svgRef.current;
// //     const fromEl = fromRef.current;
// //     const toEl   = toRef.current;
// //     if (!svg || !fromEl || !toEl) return;

// //     ensureKeyframes();
// //     svg.replaceChildren();

// //     const vw = window.innerWidth;
// //     const vh = window.innerHeight;
// //     svg.setAttribute("width",   String(vw));
// //     svg.setAttribute("height",  String(vh));
// //     svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);

// //     const fr = fromEl.getBoundingClientRect();
// //     const tr = toEl.getBoundingClientRect();

// //     // Tail: edge of 'from' element closest to 'to' element
// //     const x1 = fr.left + fr.width  / 2;
// //     const y1 = fr.top  + fr.height / 2;
// //     const x2 = tr.left + tr.width  / 2;
// //     const y2 = tr.top  + tr.height / 2;

// //     // Control point: perpendicular offset from the midpoint
// //     const dx  = x2 - x1, dy = y2 - y1;
// //     const mag = Math.sqrt(dx * dx + dy * dy) || 1;
// //     const cpx = (x1 + x2) / 2 - (dy / mag) * curvature;
// //     const cpy = (y1 + y2) / 2 + (dx / mag) * curvature;

// //     const rc   = rough.svg(svg);
// //     const opts = getRoughOptions(theme, "border", {
// //       seed,
// //       stroke: color,
// //       strokeWidth: strokeW,
// //     });

// //     // Curved body
// //     const curve = rc.path(`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`, {
// //       ...opts, fill: "none",
// //     }) as SVGGElement;
// //     svg.appendChild(curve);
// //     animateGroup(curve, duration * 0.8);

// //     // Arrowhead — tangent at t=1 of quadratic bezier = direction(end - control)
// //     if (withHead) {
// //       const tx = x2 - cpx, ty = y2 - cpy;
// //       const tl = Math.sqrt(tx * tx + ty * ty) || 1;
// //       const angle = Math.atan2(ty / tl, tx / tl);
// //       const hs = theme === "crayon" ? 14 : 11;

// //       const h1 = rc.line(x2, y2,
// //         x2 - Math.cos(angle - 0.48) * hs,
// //         y2 - Math.sin(angle - 0.48) * hs,
// //         { ...opts, seed: seed + 1 }) as SVGGElement;
// //       const h2 = rc.line(x2, y2,
// //         x2 - Math.cos(angle + 0.48) * hs,
// //         y2 - Math.sin(angle + 0.48) * hs,
// //         { ...opts, seed: seed + 2 }) as SVGGElement;

// //       svg.appendChild(h1);
// //       svg.appendChild(h2);
// //       animateGroup(h1, duration * 0.15, duration * 0.8);
// //       animateGroup(h2, duration * 0.15, duration * 0.8);
// //     }

// //     // Label anchors near tail
// //     setLabelPos({ x: x1, y: y1 - 14 });
// //   }, [color, curvature, duration, fromRef, seed, strokeW, theme, toRef, withHead]);

// //   useEffect(() => {
// //     const raf = requestAnimationFrame(() => draw());
// //     return () => cancelAnimationFrame(raf);
// //   }, [draw]);

// //   useEffect(() => {
// //     const onResize = () => draw();
// //     window.addEventListener("resize", onResize, { passive: true });
// //     return () => window.removeEventListener("resize", onResize);
// //   }, [draw]);

// //   return (
// //     <>
// //       <svg
// //         ref={svgRef}
// //         aria-hidden="true"
// //         className={cn("pointer-events-none fixed inset-0 overflow-visible z-50", className)}
// //         style={style}
// //       />
// //       {label && labelPos ? (
// //         <span
// //           aria-hidden="true"
// //           className="pointer-events-none fixed z-50 whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-medium select-none"
// //           style={{ left: labelPos.x, top: labelPos.y, color, transform: "translate(-50%, -100%)" }}
// //         >
// //           {label}
// //         </span>
// //       ) : null}
// //     </>
// //   );
// // }

// "use client";

// import {
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   type CSSProperties,
//   type ReactNode,
//   type RefObject,
// } from "react";
// import rough from "roughjs";
// import { cn } from "@/lib/utils";
// import {
//   CrumbleContext,
//   getRoughOptions,
//   stableSeed,
//   type CrumbleTheme,
// } from "@/lib/rough";

// export interface CalloutArrowProps {
//   className?: string;
//   color?: string;
//   curvature?: number;
//   fromRef: RefObject<HTMLElement | null>;
//   id?: string;
//   label?: ReactNode;
//   style?: CSSProperties;
//   theme?: CrumbleTheme;
//   toRef: RefObject<HTMLElement | null>;
//   withHead?: boolean;
// }

// function ensureKeyframes() {
//   if (typeof window === "undefined") return;
//   if ((window as any).__crumble_ann_kf) return;
//   const s = document.createElement("style");
//   s.textContent = `@keyframes crumble-annotation-dash { to { stroke-dashoffset: 0; } }`;
//   document.head.appendChild(s);
//   (window as any).__crumble_ann_kf = true;
// }

// function animateGroup(node: Element, duration: number, delay = 0) {
//   node.querySelectorAll("path").forEach((path) => {
//     const len = path.getTotalLength();
//     path.style.strokeDasharray = String(len);
//     path.style.strokeDashoffset = String(len);
//     path.style.animation = `crumble-annotation-dash ${duration}ms ease-out ${delay}ms forwards`;
//   });
// }

// export function CalloutArrow({
//   className,
//   color = "currentColor",
//   curvature = 80,
//   fromRef,
//   id,
//   label,
//   style,
//   theme: themeProp,
//   toRef,
//   withHead = true,
// }: CalloutArrowProps) {
//   const svgRef = useRef<SVGSVGElement>(null);
//   const [labelPos, setLabelPos] = useState<{ x: number; y: number } | null>(
//     null,
//   );

//   const seed = stableSeed(id ?? "callout-arrow");
//   const { theme: contextTheme } = useContext(CrumbleContext);
//   const theme = themeProp ?? contextTheme;

//   const duration = theme === "ink" ? 450 : theme === "crayon" ? 750 : 580;
//   const strokeW = theme === "crayon" ? 2.5 : theme === "ink" ? 2 : 1.5;

//   const draw = useCallback(() => {
//     const svg = svgRef.current;
//     const fromEl = fromRef.current;
//     const toEl = toRef.current;
//     if (!svg || !fromEl || !toEl) return;

//     ensureKeyframes();
//     svg.replaceChildren();

//     // Use full document dimensions so the SVG covers the entire page
//     const vw = document.documentElement.scrollWidth;
//     const vh = document.documentElement.scrollHeight;
//     svg.setAttribute("width", String(vw));
//     svg.setAttribute("height", String(vh));
//     svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);

//     const fr = fromEl.getBoundingClientRect();
//     const tr = toEl.getBoundingClientRect();

//     // Add scroll offsets so coordinates are document-relative, not viewport-relative
//     const x1 = fr.left + fr.width / 2 + window.scrollX;
//     const y1 = fr.top + fr.height / 2 + window.scrollY;
//     const x2 = tr.left + tr.width / 2 + window.scrollX;
//     const y2 = tr.top + tr.height / 2 + window.scrollY;

//     const dx = x2 - x1,
//       dy = y2 - y1;
//     const mag = Math.sqrt(dx * dx + dy * dy) || 1;
//     const cpx = (x1 + x2) / 2 - (dy / mag) * curvature;
//     const cpy = (y1 + y2) / 2 + (dx / mag) * curvature;

//     const rc = rough.svg(svg);
//     const opts = getRoughOptions(theme, "border", {
//       seed,
//       stroke: color,
//       strokeWidth: strokeW,
//     });

//     const curve = rc.path(`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`, {
//       ...opts,
//       fill: "none",
//     }) as SVGGElement;
//     svg.appendChild(curve);
//     animateGroup(curve, duration * 0.8);

//     if (withHead) {
//       const tx = x2 - cpx,
//         ty = y2 - cpy;
//       const tl = Math.sqrt(tx * tx + ty * ty) || 1;
//       const angle = Math.atan2(ty / tl, tx / tl);
//       const hs = theme === "crayon" ? 14 : 11;

//       const h1 = rc.line(
//         x2,
//         y2,
//         x2 - Math.cos(angle - 0.48) * hs,
//         y2 - Math.sin(angle - 0.48) * hs,
//         { ...opts, seed: seed + 1 },
//       ) as SVGGElement;
//       const h2 = rc.line(
//         x2,
//         y2,
//         x2 - Math.cos(angle + 0.48) * hs,
//         y2 - Math.sin(angle + 0.48) * hs,
//         { ...opts, seed: seed + 2 },
//       ) as SVGGElement;

//       svg.appendChild(h1);
//       svg.appendChild(h2);
//       animateGroup(h1, duration * 0.15, duration * 0.8);
//       animateGroup(h2, duration * 0.15, duration * 0.8);
//     }

//     // Label position is also document-relative now
//     setLabelPos({ x: x1, y: y1 - 14 });
//   }, [
//     color,
//     curvature,
//     duration,
//     fromRef,
//     seed,
//     strokeW,
//     theme,
//     toRef,
//     withHead,
//   ]);

//   useEffect(() => {
//     const raf = requestAnimationFrame(() => draw());
//     return () => cancelAnimationFrame(raf);
//   }, [draw]);

//   useEffect(() => {
//     const onResize = () => draw();
//     window.addEventListener("resize", onResize, { passive: true });
//     return () => window.removeEventListener("resize", onResize);
//   }, [draw]);

//   // Redraw when user scrolls so coordinates stay in sync
//   useEffect(() => {
//     const onScroll = () => draw();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, [draw]);

//   return (
//     <>
//       <svg
//         ref={svgRef}
//         aria-hidden="true"
//         // Changed from fixed to absolute so it scrolls with the page
//         className={cn(
//           "pointer-events-none absolute inset-0 overflow-visible z-50",
//           className,
//         )}
//         style={style}
//       />
//       {label && labelPos ? (
//         <span
//           aria-hidden="true"
//           // Changed from fixed to absolute so it scrolls with the page
//           className="pointer-events-none absolute z-50 whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-medium select-none"
//           style={{
//             left: labelPos.x,
//             top: labelPos.y,
//             color,
//             transform: "translate(-50%, -100%)",
//           }}
//         >
//           {label}
//         </span>
//       ) : null}
//     </>
//   );
// }

"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import rough from "roughjs";
import { cn } from "@/lib/utils";
import {
  CrumbleContext,
  getRoughOptions,
  stableSeed,
  type CrumbleTheme,
} from "@/lib/rough";

export interface CalloutArrowProps {
  className?: string;
  color?: string;
  curvature?: number;
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
  fromRef,
  id,
  label,
  style,
  theme: themeProp,
  toRef,
  withHead = true,
}: CalloutArrowProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ancestorRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const seed = stableSeed(id ?? "callout-arrow");
  const { theme: contextTheme } = useContext(CrumbleContext);
  const theme = themeProp ?? contextTheme;

  const duration = theme === "ink" ? 450 : theme === "crayon" ? 750 : 580;
  const strokeW = theme === "crayon" ? 2.5 : theme === "ink" ? 2 : 1.5;

  const draw = useCallback(() => {
    const svg = svgRef.current;
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    if (!svg || !fromEl || !toEl) return;

    ensureKeyframes();
    svg.replaceChildren();

    // Find common ancestor and move SVG inside it
    const ancestor = getClosestCommonAncestor(fromEl, toEl);
    ancestorRef.current = ancestor;

    // Ensure ancestor is a positioning context
    const existingPosition = window.getComputedStyle(ancestor).position;
    if (existingPosition === "static") {
      ancestor.style.position = "relative";
    }

    // Move SVG and label into ancestor if not already there
    if (svg.parentElement !== ancestor) {
      ancestor.appendChild(svg);
    }
    if (labelRef.current && labelRef.current.parentElement !== ancestor) {
      ancestor.appendChild(labelRef.current);
    }

    // All measurements relative to ancestor
    const base = ancestor.getBoundingClientRect();
    const fr = fromEl.getBoundingClientRect();
    const tr = toEl.getBoundingClientRect();

    const w = base.width;
    const h = base.height;

    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    // Coords relative to ancestor — scroll is irrelevant now
    const x1 = fr.left - base.left + fr.width / 2;
    const y1 = fr.top - base.top + fr.height / 2;
    const x2 = tr.left - base.left + tr.width / 2;
    const y2 = tr.top - base.top + tr.height / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
    const cpx = (x1 + x2) / 2 - (dy / mag) * curvature;
    const cpy = (y1 + y2) / 2 + (dx / mag) * curvature;

    const rc = rough.svg(svg);
    const opts = getRoughOptions(theme, "border", {
      seed,
      stroke: color,
      strokeWidth: strokeW,
    });

    const curve = rc.path(`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`, {
      ...opts,
      fill: "none",
    }) as SVGGElement;
    svg.appendChild(curve);
    animateGroup(curve, duration * 0.8);

    if (withHead) {
      const tx = x2 - cpx;
      const ty = y2 - cpy;
      const tl = Math.sqrt(tx * tx + ty * ty) || 1;
      const angle = Math.atan2(ty / tl, tx / tl);
      const hs = theme === "crayon" ? 14 : 11;

      const h1 = rc.line(
        x2,
        y2,
        x2 - Math.cos(angle - 0.48) * hs,
        y2 - Math.sin(angle - 0.48) * hs,
        { ...opts, seed: seed + 1 },
      ) as SVGGElement;
      const h2 = rc.line(
        x2,
        y2,
        x2 - Math.cos(angle + 0.48) * hs,
        y2 - Math.sin(angle + 0.48) * hs,
        { ...opts, seed: seed + 2 },
      ) as SVGGElement;

      svg.appendChild(h1);
      svg.appendChild(h2);
      animateGroup(h1, duration * 0.15, duration * 0.8);
      animateGroup(h2, duration * 0.15, duration * 0.8);
    }

    // Position label relative to ancestor
    if (labelRef.current) {
      labelRef.current.style.left = `${x1}px`;
      labelRef.current.style.top = `${y1 - 14}px`;
    }
  }, [
    color,
    curvature,
    duration,
    fromRef,
    seed,
    strokeW,
    theme,
    toRef,
    withHead,
  ]);

  // Initial draw
  useEffect(() => {
    setIsMounted(true);
    const raf = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // Redraw on resize only — scroll is free since SVG is in document flow
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  // Cleanup: remove SVG and label from ancestor on unmount
  useEffect(() => {
    return () => {
      svgRef.current?.remove();
      labelRef.current?.remove();
    };
  }, []);

  return (
    <>
      {/* SVG is portalled into ancestor by draw(), this is just the ref holder */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 overflow-visible z-50",
          className,
        )}
        style={style}
      />
      {/* Label is also portalled into ancestor by draw() */}
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
