"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRough } from "@/hooks/use-rough";
import { cn } from "@/lib/utils";
import {
  resolveRoughVars,
  stableSeed,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";

export interface ProgressProps extends CrumbleColorProps {
  className?: string;
  id?: string;
  label?: string;
  max?: number;
  showValue?: boolean;
  theme?: CrumbleTheme;
  value?: number;
  formatValue?: (value: number, max: number) => string;
}

const TRACK_H = 16;

export function Progress({
  className,
  fill,
  id,
  label,
  max = 100,
  showValue = false,
  stroke,
  strokeMuted,
  theme: themeProp,
  value = 0,
  formatValue,
}: ProgressProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const externalSvgRef = useRef<SVGSVGElement>(null);
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });
  const progressId =
    id ?? `progress-${label?.toLowerCase().replace(/\s+/g, "-") ?? "bar"}`;
  const pct = Math.min(Math.max(value / max, 0), 1);
  const { drawRect, svgRef, theme } = useRough({
    stableId: progressId,
    svgRef: externalSvgRef,
    theme: themeProp,
    variant: "fill",
  });

  const draw = useCallback(() => {
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    svg.replaceChildren();
    const w = wrapper.offsetWidth;
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(TRACK_H));
    svg.setAttribute("viewBox", `0 0 ${w} ${TRACK_H}`);

    const track = drawRect(1, 1, w - 2, TRACK_H - 2, {
      fill: "none",
      seed: stableSeed(`${progressId}-track`),
      stroke: "var(--cr-stroke-muted)",
    });
    if (track) svg.appendChild(track);

    if (pct > 0) {
      const fillW = Math.max((w - 4) * pct, 4);
      const bar = drawRect(2, 2, fillW, TRACK_H - 4, {
        seed: stableSeed(`${progressId}-fill`),
        fill: "currentColor",
        fillStyle: theme === "ink" ? "solid" : "hachure",
        stroke: "none",
      });
      if (bar) svg.appendChild(bar);
    }
  }, [drawRect, pct, progressId, svgRef, theme]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)} style={roughStyle}>
      {label || showValue ? (
        <div className="flex justify-between">
          {label ? (
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          ) : null}
          {showValue ? (
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {formatValue ? formatValue(value, max) : `${Math.round(pct * 100)}%`}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        ref={wrapperRef}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="relative"
        style={{ height: TRACK_H }}
      >
        <svg
          ref={externalSvgRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible"
        />
      </div>
    </div>
  );
}
