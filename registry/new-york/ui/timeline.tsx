"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useRough } from "@/hooks/use-rough";
import { cn } from "@/lib/utils";
import {
  CrumbleContext,
  resolveRoughVars,
  stableSeed,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";

// ---------- context ----------

interface TimelineContextValue {
  theme: CrumbleTheme;
}

const TimelineThemeContext = createContext<TimelineContextValue>({
  theme: "pencil",
});

// ---------- root ----------

export interface TimelineProps
  extends HTMLAttributes<HTMLOListElement>, CrumbleColorProps {
  theme?: CrumbleTheme;
}

export function Timeline({
  children,
  className,
  fill,
  stroke,
  strokeMuted,
  theme: themeProp,
  ...props
}: TimelineProps) {
  const { theme: contextTheme } = useContext(CrumbleContext);
  const theme = themeProp ?? contextTheme;
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });
  return (
    <TimelineThemeContext.Provider value={{ theme }}>
      <ol
        className={cn("relative flex flex-col", className)}
        style={roughStyle}
        {...(props as object)}
      >
        {children}
      </ol>
    </TimelineThemeContext.Provider>
  );
}

// ---------- item ----------

export type TimelineStatus = "complete" | "active" | "pending";

export interface TimelineItemProps extends Omit<
  HTMLAttributes<HTMLLIElement>,
  "title"
> {
  description?: ReactNode;
  id?: string;
  isLast?: boolean;
  status?: TimelineStatus;
  time?: ReactNode;
  title: ReactNode;
}

const NODE_SIZE = 20;
const LINE_X = NODE_SIZE / 2;

export function TimelineItem({
  className,
  description,
  id,
  isLast = false,
  status = "pending",
  time,
  title,
  ...props
}: TimelineItemProps) {
  const { theme } = useContext(TimelineThemeContext);
  const nodeSvgRef = useRef<SVGSVGElement>(null);
  const lineSvgRef = useRef<SVGSVGElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);

  const itemId =
    id ??
    `timeline-${typeof title === "string" ? title.toLowerCase().replace(/\s+/g, "-") : "item"}`;
  const { drawCircle: drawNodeCircle, drawLine: drawNodeLine } = useRough({
    variant: "interactive",
    stableId: itemId,
    svgRef: nodeSvgRef,
    theme,
  });
  const { drawLine: drawConnectorLine } = useRough({
    variant: "border",
    stableId: `${itemId}-line`,
    svgRef: lineSvgRef,
    theme,
  });

  const drawNode = useCallback(() => {
    const svg = nodeSvgRef.current;
    if (!svg) return;

    svg.replaceChildren();
    svg.setAttribute("width", String(NODE_SIZE));
    svg.setAttribute("height", String(NODE_SIZE));
    svg.setAttribute("viewBox", `0 0 ${NODE_SIZE} ${NODE_SIZE}`);

    const cx = NODE_SIZE / 2;
    const cy = NODE_SIZE / 2;
    const stroke =
      status === "pending" ? "var(--cr-stroke-muted)" : "var(--cr-stroke)";

    if (status === "complete") {
      // Filled circle
      const circleEl = drawNodeCircle(cx, cy, NODE_SIZE - 4, {
        fill: "currentColor",
        fillStyle: theme === "ink" ? "solid" : "hachure",
        fillWeight: 0.8,
        stroke,
      });
      if (circleEl) svg.appendChild(circleEl);

      // Tick mark
      const tick1 = drawNodeLine(5, cy + 1, cx - 1, NODE_SIZE - 4, {
        stroke: "hsl(var(--background))",
        strokeWidth: 1.5,
      });
      const tick2 = drawNodeLine(cx - 1, NODE_SIZE - 4, NODE_SIZE - 4, 4, {
        seed: stableSeed(`${itemId}-tick`),
        stroke: "hsl(var(--background))",
        strokeWidth: 1.5,
      });
      if (tick1) svg.appendChild(tick1);
      if (tick2) svg.appendChild(tick2);
    } else if (status === "active") {
      // Outlined circle with inner dot
      const outer = drawNodeCircle(cx, cy, NODE_SIZE - 4, {
        fill: "none",
        stroke,
      });
      const inner = drawNodeCircle(cx, cy, NODE_SIZE / 2 - 2, {
        fill: "currentColor",
        fillStyle: "solid",
        seed: stableSeed(`${itemId}-dot`),
        stroke: "none",
      });
      if (outer) svg.appendChild(outer);
      if (inner) svg.appendChild(inner);
    } else {
      // Empty circle
      const pending = drawNodeCircle(cx, cy, NODE_SIZE - 4, {
        fill: "none",
        stroke,
      });
      if (pending) svg.appendChild(pending);
    }
  }, [drawNodeCircle, drawNodeLine, itemId, status, theme]);

  const drawLine = useCallback(() => {
    const container = lineContainerRef.current;
    const svg = lineSvgRef.current;
    if (!container || !svg || isLast) return;

    const h = container.offsetHeight;
    svg.replaceChildren();
    svg.setAttribute("width", String(NODE_SIZE));
    svg.setAttribute("height", String(h));
    svg.setAttribute("viewBox", `0 0 ${NODE_SIZE} ${h}`);

    const lineEl = drawConnectorLine(LINE_X, 0, LINE_X, h, {
      stroke:
        status === "pending"
          ? "var(--cr-stroke-muted)"
          : "var(--cr-stroke-muted)",
      strokeWidth: 1,
    });
    if (lineEl) svg.appendChild(lineEl);
  }, [drawConnectorLine, isLast, status]);

  useEffect(() => {
    const id1 = requestAnimationFrame(() => {
      drawNode();
      drawLine();
    });
    return () => cancelAnimationFrame(id1);
  }, [drawLine, drawNode]);

  useEffect(() => {
    const container = lineContainerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => drawLine());
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawLine]);

  return (
    <li
      className={cn("relative flex gap-4", !isLast && "pb-8", className)}
      {...(props as object)}
    >
      {/* Left column: node + connector line */}
      <div
        className="relative flex flex-col items-center flex-shrink-0"
        style={{ width: NODE_SIZE }}
      >
        <svg
          ref={nodeSvgRef}
          aria-hidden="true"
          className="overflow-visible flex-shrink-0"
          width={NODE_SIZE}
          height={NODE_SIZE}
        />
        {!isLast ? (
          <div
            ref={lineContainerRef}
            className="flex-1 w-full relative"
            style={{ minHeight: 24 }}
          >
            <svg
              ref={lineSvgRef}
              aria-hidden="true"
              className="overflow-visible absolute inset-0"
            />
          </div>
        ) : null}
      </div>

      {/* Right column: content */}
      <div className="flex flex-col gap-0.5 min-w-0 pt-0.5">
        <div className="flex items-baseline justify-between gap-4">
          <span
            className={cn(
              "text-sm font-medium",
              status === "pending"
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            {title}
          </span>
          {time ? (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {time}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </li>
  );
}
