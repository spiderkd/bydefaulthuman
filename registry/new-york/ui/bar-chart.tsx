"use client";

import { useCallback, useEffect, useRef, type HTMLAttributes } from "react";
import { useRough } from "@/hooks/use-rough";
import { cn } from "@/lib/utils";
import {
  resolveRoughVars,
  stableSeed,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";

export interface BarChartDataPoint {
  color?: string;
  label: string;
  value: number;
}

export interface BarChartProps
  extends HTMLAttributes<HTMLDivElement>, CrumbleColorProps {
  animateOnMount?: boolean;
  axisLabel?: string;
  data: BarChartDataPoint[];
  formatValue?: (v: number) => string;
  height?: number;
  id?: string;
  showGrid?: boolean;
  showValues?: boolean;
  theme?: CrumbleTheme;
}

const PAD = { top: 20, right: 16, bottom: 40, left: 48 };
const GRID_LINES = 4;

export function BarChart({
  animateOnMount = true,
  axisLabel,
  className,
  data,
  fill,
  formatValue = (v) => String(v),
  height = 240,
  id,
  showGrid = true,
  showValues = true,
  stroke,
  strokeMuted,
  theme: themeProp,
  ...props
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = id ?? "bar-chart";
  const { drawLine, drawRect, svgRef, theme } = useRough({
    variant: "chart",
    stableId: chartId,
    theme: themeProp,
  });
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

  // Linear scale helper
  const scale = (
    value: number,
    domainMin: number,
    domainMax: number,
    rangeMin: number,
    rangeMax: number,
  ) =>
    domainMax === domainMin
      ? rangeMin
      : rangeMin +
        ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);

  const draw = useCallback(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg || data.length === 0) return;

    svg.replaceChildren();

    const W = container.offsetWidth;
    const H = height;
    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    const maxVal = Math.max(...data.map((d) => d.value), 0);
    const niceMax = Math.ceil(maxVal / GRID_LINES) * GRID_LINES || 1;

    // Grid lines + Y axis labels
    if (showGrid) {
      for (let i = 0; i <= GRID_LINES; i++) {
        const val = (niceMax / GRID_LINES) * i;
        const y = PAD.top + plotH - scale(val, 0, niceMax, 0, plotH);

        const gridLine = drawLine(PAD.left, y, PAD.left + plotW, y, {
          seed: stableSeed(`${chartId}-grid-${i}`),
          stroke: "var(--cr-stroke-muted)",
          strokeWidth: theme === "crayon" ? 1.5 : 0.8,
        });
        if (gridLine) svg.appendChild(gridLine);

        // Y label
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        text.setAttribute("x", String(PAD.left - 8));
        text.setAttribute("y", String(y + 4));
        text.setAttribute("text-anchor", "end");
        text.setAttribute("fill", "currentColor");
        text.setAttribute("font-size", "11");
        text.setAttribute("opacity", "0.5");
        text.textContent = formatValue(val);
        svg.appendChild(text);
      }
    }

    // Axes
    const yAxis = drawLine(PAD.left, PAD.top, PAD.left, PAD.top + plotH, {
      seed: stableSeed(`${chartId}-yaxis`),
      stroke: "var(--cr-stroke-muted)",
      strokeWidth: theme === "crayon" ? 2 : 1,
    });
    const xAxis = drawLine(
      PAD.left,
      PAD.top + plotH,
      PAD.left + plotW,
      PAD.top + plotH,
      {
        seed: stableSeed(`${chartId}-xaxis`),
        stroke: "var(--cr-stroke-muted)",
        strokeWidth: theme === "crayon" ? 2 : 1,
      },
    );
    if (yAxis) svg.appendChild(yAxis);
    if (xAxis) svg.appendChild(xAxis);

    // Bars
    const barW = Math.max(4, (plotW / data.length) * 0.6);
    const gap = plotW / data.length;

    data.forEach((d, i) => {
      const barH = scale(d.value, 0, niceMax, 0, plotH);
      const x = PAD.left + gap * i + (gap - barW) / 2;
      const y = PAD.top + plotH - barH;

      const barNode = drawRect(x, y, barW, barH, {
        fill: d.color ?? "currentColor",
        fillStyle: theme === "ink" ? "solid" : "hachure",
        fillWeight: theme === "pencil" ? 0.8 : 1.2,
        hachureGap: theme === "crayon" ? 4 : 6,
        seed: stableSeed(`${chartId}-bar-${i}`),
        stroke: d.color ?? "currentColor",
        strokeWidth: theme === "crayon" ? 2 : theme === "ink" ? 1.5 : 1,
      }) as SVGGElement | null;
      if (!barNode) return;

      // Animate on mount: bars grow from bottom using clipPath on the group
      if (animateOnMount) {
        const clipId = `${chartId}-clip-${i}`;
        const defs =
          svg.querySelector("defs") ??
          svg.insertBefore(
            document.createElementNS("http://www.w3.org/2000/svg", "defs"),
            svg.firstChild,
          );

        const clipPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "clipPath",
        );
        clipPath.setAttribute("id", clipId);
        const clipRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        clipRect.setAttribute("x", String(x - 4));
        clipRect.setAttribute("y", String(PAD.top + plotH));
        clipRect.setAttribute("width", String(barW + 8));
        clipRect.setAttribute("height", String(barH + 4));
        clipPath.appendChild(clipRect);
        defs.appendChild(clipPath);

        barNode.setAttribute("clip-path", `url(#${clipId})`);

        // Animate clip rect upward
        const delay = i * 60;
        const dur = theme === "crayon" ? 600 : theme === "ink" ? 350 : 500;
        const anim = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "animate",
        );
        anim.setAttribute("attributeName", "y");
        anim.setAttribute("from", String(PAD.top + plotH));
        anim.setAttribute("to", String(y - 4));
        anim.setAttribute("dur", `${dur}ms`);
        anim.setAttribute("begin", `${delay}ms`);
        anim.setAttribute("fill", "freeze");
        anim.setAttribute("calcMode", "spline");
        anim.setAttribute("keySplines", "0.16 1 0.3 1");
        clipRect.appendChild(anim);
      }

      svg.appendChild(barNode);

      // Value label above bar
      if (showValues && d.value > 0) {
        const label = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        label.setAttribute("x", String(x + barW / 2));
        label.setAttribute("y", String(y - 4));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("fill", "currentColor");
        label.setAttribute("font-size", "11");
        label.setAttribute("opacity", "0.7");
        label.textContent = formatValue(d.value);
        svg.appendChild(label);
      }

      // X axis label
      const xlabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      xlabel.setAttribute("x", String(x + barW / 2));
      xlabel.setAttribute("y", String(PAD.top + plotH + 16));
      xlabel.setAttribute("text-anchor", "middle");
      xlabel.setAttribute("fill", "currentColor");
      xlabel.setAttribute("font-size", "11");
      xlabel.setAttribute("opacity", "0.6");
      xlabel.textContent = d.label;
      svg.appendChild(xlabel);
    });

    // Optional axis label
    if (axisLabel) {
      const al = document.createElementNS("http://www.w3.org/2000/svg", "text");
      al.setAttribute("x", String(PAD.left + plotW / 2));
      al.setAttribute("y", String(H - 4));
      al.setAttribute("text-anchor", "middle");
      al.setAttribute("fill", "currentColor");
      al.setAttribute("font-size", "11");
      al.setAttribute("opacity", "0.5");
      al.textContent = axisLabel;
      svg.appendChild(al);
    }
  }, [
    animateOnMount,
    axisLabel,
    chartId,
    data,
    drawLine,
    drawRect,
    formatValue,
    height,
    showGrid,
    showValues,
    svgRef,
    theme,
  ]);

  useEffect(() => {
    const id = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(id);
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ ...roughStyle, height }}
      {...props}
    >
      <svg
        ref={svgRef}
        aria-label="Bar chart"
        role="img"
        className="overflow-visible"
      />
    </div>
  );
}
