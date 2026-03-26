"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import rough from "roughjs";
import { cn } from "@/lib/utils";
import {
  CrumbleContext,
  getRoughOptions,
  randomSeed,
  resolveRoughVars,
  stableSeed,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";

// ─── Context ────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  animateOnHover: boolean;
  multiple: boolean;
  openItems: Set<string>;
  theme: CrumbleTheme;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue>({
  animateOnHover: true,
  multiple: false,
  openItems: new Set(),
  theme: "pencil",
  toggle: () => {},
});

// ─── Accordion (root) ────────────────────────────────────────────────────────

export interface AccordionProps
  extends HTMLAttributes<HTMLDivElement>, CrumbleColorProps {
  animateOnHover?: boolean;
  defaultValue?: string | string[];
  multiple?: boolean;
  onValueChange?: (value: string | string[]) => void;
  theme?: CrumbleTheme;
}

export function Accordion({
  animateOnHover = true,
  children,
  className,
  defaultValue,
  fill,
  multiple = false,
  onValueChange,
  stroke,
  strokeMuted,
  theme: themeProp,
  ...props
}: AccordionProps) {
  const { theme: contextTheme } = useContext(CrumbleContext);
  const theme = themeProp ?? contextTheme;

  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  });

  const toggle = useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (!multiple) next.clear();
          next.add(value);
        }
        onValueChange?.(
          multiple ? Array.from(next) : (Array.from(next)[0] ?? ""),
        );
        return next;
      });
    },
    [multiple, onValueChange],
  );

  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

  return (
    <AccordionContext.Provider
      value={{ animateOnHover, multiple, openItems, theme, toggle }}
    >
      <div
        className={cn("flex flex-col gap-1", className)}
        style={roughStyle}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ─── AccordionItem ───────────────────────────────────────────────────────────
//
// Draws a full rough rectangle border around the entire item (trigger + content).
// The border re-seeds on hover for the "re-sketching" feel.
// When open, a light hachure fill makes the active item visually pop.

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({
  children,
  className,
  value,
  ...props
}: AccordionItemProps) {
  const { openItems, theme } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  const containerRef = useRef<HTMLDivElement>(null);
  const borderSvgRef = useRef<SVGSVGElement>(null);

  const drawBorder = useCallback(
    (reseed = false) => {
      const container = containerRef.current;
      const svg = borderSvgRef.current;
      if (!container || !svg) return;

      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (w === 0 || h === 0) return;

      svg.replaceChildren();
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const rc = rough.svg(svg);

      // Stable seed so the border doesn't jump on every render,
      // but re-seeds on hover for the hand-drawn re-sketch feel.
      const seed = reseed
        ? randomSeed()
        : stableSeed(`accordion-border-${value}-${isOpen ? "open" : "closed"}`);

      // "interactive" variant gives the most aggressive roughness.
      const opts = getRoughOptions(theme, "interactive", {
        seed,
        stroke: "var(--cr-stroke, currentColor)",
        strokeWidth: theme === "crayon" ? 2.5 : theme === "ink" ? 1.8 : 1.5,
        roughness: theme === "crayon" ? 3.2 : theme === "ink" ? 1.0 : 2.0,
        bowing: theme === "crayon" ? 2.5 : theme === "ink" ? 0.8 : 1.6,
        // Hachure fill on the open item so it reads as "active".
        fill: isOpen ? "var(--cr-fill, currentColor)" : "none",
        fillStyle: "hachure",
        fillWeight: theme === "crayon" ? 1.0 : 0.5,
        hachureGap: theme === "pencil" ? 9 : theme === "crayon" ? 7 : 11,
        hachureAngle: -41,
      });

      // Inset so the wobbly stroke doesn't clip at the container edge.
      const pad = theme === "crayon" ? 4 : 3;
      const rect = rc.rectangle(pad, pad, w - pad * 2, h - pad * 2, opts);
      // `fillOpacity` is not in rough's Options type — patch it as an SVG
      // presentation attribute on the generated fill paths after drawing.
      if (isOpen) {
        rect.querySelectorAll("path").forEach((p) => {
          if (p.getAttribute("fill") && p.getAttribute("fill") !== "none") {
            p.setAttribute("fill-opacity", "0.06");
          }
        });
      }
      svg.appendChild(rect);
    },
    [isOpen, theme, value],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => drawBorder());
    return () => cancelAnimationFrame(id);
  }, [drawBorder]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => drawBorder());
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawBorder]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseEnter={() => drawBorder(true)}
      onMouseLeave={() => drawBorder(false)}
      {...props}
    >
      {/* Rough border — sits behind all children */}
      <svg
        ref={borderSvgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-visible"
      />
      {children}
    </div>
  );
}

// ─── AccordionTrigger ────────────────────────────────────────────────────────
//
// Larger chevron (24×24) with "interactive" roughness.
// A small left-side tick mark gives a hand-annotated margin feel.

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function AccordionTrigger({
  children,
  className,
  value,
  ...props
}: AccordionTriggerProps) {
  const { animateOnHover, openItems, theme, toggle } =
    useContext(AccordionContext);
  const isOpen = openItems.has(value);

  const chevronRef = useRef<SVGSVGElement>(null);
  const tickRef = useRef<SVGSVGElement>(null);

  // ── Chevron ──────────────────────────────────────────────────────────────

  const drawChevron = useCallback(
    (reseed = false) => {
      const svg = chevronRef.current;
      if (!svg) return;

      svg.replaceChildren();
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("viewBox", "0 0 24 24");

      const rc = rough.svg(svg);
      const mkSeed = (suffix: string) =>
        reseed ? randomSeed() : stableSeed(`chev-${suffix}-${value}`);

      const baseOpts = getRoughOptions(theme, "interactive", {
        stroke: "currentColor",
        strokeWidth: theme === "crayon" ? 2.4 : theme === "ink" ? 2.0 : 1.6,
        roughness: theme === "crayon" ? 3.0 : theme === "ink" ? 0.9 : 2.2,
        bowing: theme === "crayon" ? 2.8 : theme === "ink" ? 0.7 : 1.8,
      });

      if (isOpen) {
        svg.appendChild(
          rc.line(3, 16, 12, 7, { ...baseOpts, seed: mkSeed("ul") }),
        );
        svg.appendChild(
          rc.line(12, 7, 21, 16, {
            ...baseOpts,
            seed: mkSeed("ur"),
            strokeWidth: (baseOpts.strokeWidth ?? 1.6) * 0.9,
          }),
        );
      } else {
        svg.appendChild(
          rc.line(3, 8, 12, 17, { ...baseOpts, seed: mkSeed("dl") }),
        );
        svg.appendChild(
          rc.line(12, 17, 21, 8, {
            ...baseOpts,
            seed: mkSeed("dr"),
            strokeWidth: (baseOpts.strokeWidth ?? 1.6) * 0.9,
          }),
        );
      }
    },
    [isOpen, theme, value],
  );

  // ── Left tick mark ────────────────────────────────────────────────────────
  // A rough vertical bar on the left edge — like a pencil annotation in a
  // notebook margin. Brighter when the item is open.

  const drawTick = useCallback(
    (reseed = false) => {
      const svg = tickRef.current;
      if (!svg) return;

      svg.replaceChildren();
      svg.setAttribute("width", "6");
      svg.setAttribute("height", "22");
      svg.setAttribute("viewBox", "0 0 6 22");

      const rc = rough.svg(svg);
      const tickEl = rc.line(
        3,
        1,
        3,
        21,
        getRoughOptions(theme, "border", {
          seed: reseed ? randomSeed() : stableSeed(`tick-${value}-${isOpen}`),
          stroke: isOpen
            ? "var(--cr-stroke, currentColor)"
            : "var(--cr-stroke-muted, currentColor)",
          strokeWidth: theme === "crayon" ? 2.0 : theme === "ink" ? 1.4 : 1.2,
          roughness: theme === "crayon" ? 2.8 : theme === "ink" ? 0.8 : 2.0,
        }),
      );
      // `opacity` is not in rough's Options type — set it on the element directly.
      tickEl.setAttribute("opacity", isOpen ? "1" : "0.4");
      svg.appendChild(tickEl);
    },
    [isOpen, theme, value],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      drawChevron();
      drawTick();
    });
    return () => cancelAnimationFrame(id);
  }, [drawChevron, drawTick]);

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      className={cn(
        "flex w-full items-center gap-3 py-4 pr-4 pl-3",
        "text-sm font-medium text-left outline-none",
        "transition-colors hover:text-foreground",
        className,
      )}
      onClick={() => toggle(value)}
      onMouseEnter={() => {
        if (animateOnHover) {
          drawChevron(true);
          drawTick(true);
        }
      }}
      onMouseLeave={() => {
        if (animateOnHover) {
          drawChevron(false);
          drawTick(false);
        }
      }}
      {...(props as HTMLAttributes<HTMLButtonElement>)}
    >
      {/* Margin tick */}
      <svg
        ref={tickRef}
        aria-hidden="true"
        width="6"
        height="22"
        className="flex-shrink-0 overflow-visible opacity-70"
      />

      <span className="flex-1">{children}</span>

      {/* Chevron */}
      <svg
        ref={chevronRef}
        aria-hidden="true"
        width="24"
        height="24"
        className="flex-shrink-0 overflow-visible"
      />
    </button>
  );
}

// ─── AccordionContent ────────────────────────────────────────────────────────
//
// The content area is indented to align with the trigger label (past the tick).
// A short inset rough underline at the bottom acts as a "end of section" stroke.

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionContent({
  children,
  className,
  value,
  ...props
}: AccordionContentProps) {
  const { openItems, theme } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  const containerRef = useRef<HTMLDivElement>(null);
  const underlineSvgRef = useRef<SVGSVGElement>(null);

  const drawUnderline = useCallback(() => {
    const container = containerRef.current;
    const svg = underlineSvgRef.current;
    if (!container || !svg) return;

    const w = container.offsetWidth;
    svg.replaceChildren();
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", "8");
    svg.setAttribute("viewBox", `0 0 ${w} 8`);

    const rc = rough.svg(svg);

    // Short inset line so it reads as an annotation, not a full-width divider.
    const inset = Math.min(32, w * 0.08);
    const lineEl = rc.line(
      inset,
      4,
      w - inset,
      4,
      getRoughOptions(theme, "border", {
        seed: stableSeed(`accordion-underline-${value}`),
        stroke: "var(--cr-stroke-muted, currentColor)",
        strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.4 : 1.0,
        roughness: theme === "crayon" ? 2.4 : theme === "ink" ? 0.6 : 1.6,
      }),
    );
    // `opacity` is not in rough's Options type — set it on the element directly.
    lineEl.setAttribute("opacity", "0.45");
    svg.appendChild(lineEl);
  }, [theme, value]);

  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => drawUnderline());
    return () => cancelAnimationFrame(id);
  }, [drawUnderline, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => drawUnderline());
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawUnderline, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      // pl-6 aligns with the trigger label (3 gap + 6 tick + 3 gap ≈ pl-6)
      className={cn(
        "relative pb-5 pl-6 pr-4 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {/* Rough "end of section" underline */}
      <svg
        ref={underlineSvgRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-visible"
      />
    </div>
  );
}
