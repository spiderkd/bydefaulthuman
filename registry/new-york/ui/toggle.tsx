"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRough } from "@/hooks/use-rough";
import {
  resolveRoughVars,
  stableSeed,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";
import { cn } from "@/lib/utils";

export type ToggleVariant = "filled" | "hybrid" | "ball";

export interface ToggleProps extends CrumbleColorProps {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  onChange?: (checked: boolean) => void;
  theme?: CrumbleTheme;
  variant?: ToggleVariant;
}

const HEIGHT = 24;
const WIDTH = 44;
const THUMB_R = 8;
const THUMB_OFF_X = 2 + THUMB_R;
const THUMB_ON_X = WIDTH - 2 - THUMB_R;

export function Toggle({
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  fill,
  id,
  label,
  onChange,
  stroke,
  strokeMuted,
  theme: themeProp,
  variant = "ball",
}: ToggleProps) {
  const isControlled = checked !== undefined;
  const [internalValue, setInternalValue] = useState(defaultChecked);
  const svgRef = useRef<SVGSVGElement>(null);
  const toggleId =
    id ?? `toggle-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;
  const currentValue = isControlled ? checked : internalValue;
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });
  const { drawCircle, drawRect, theme } = useRough({
    stableId: toggleId,
    svgRef,
    theme: themeProp,
    variant: "interactive",
  });

  const draw = useCallback(
    (isOn: boolean) => {
      const svg = svgRef.current;
      if (!svg) return;

      svg.replaceChildren();
      svg.setAttribute("width", String(WIDTH));
      svg.setAttribute("height", String(HEIGHT));
      svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

      const strokeColor = disabled ? "var(--cr-stroke-muted)" : "var(--cr-stroke)";
      let trackFill = "none";
      let trackFillStyle: "solid" | "hachure" = "hachure";

      if (variant === "filled" && isOn) {
        trackFill = strokeColor;
        trackFillStyle = "solid";
      } else if (variant === "hybrid" && isOn) {
        trackFill = strokeColor;
        trackFillStyle = "hachure";
      }

      const track = drawRect(1, 1, WIDTH - 2, HEIGHT - 2, {
        seed: stableSeed(`${toggleId}-track`),
        fill: trackFill,
        fillStyle: trackFillStyle,
        fillWeight: theme === "crayon" ? 2.2 : theme === "ink" ? 1.8 : 1.6,
        hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2 : 2.5,
        hachureAngle: -41,
        stroke: strokeColor,
        roughness: theme === "crayon" ? 2.0 : theme === "ink" ? 0.5 : 0.9,
        bowing: theme === "crayon" ? 1.5 : theme === "ink" ? 0.3 : 0.8,
        strokeWidth: theme === "crayon" ? 2.0 : theme === "ink" ? 1.5 : 1.2,
      });
      if (track) svg.appendChild(track);

      const thumbX = isOn ? THUMB_ON_X : THUMB_OFF_X;
      const thumbY = HEIGHT / 2;
      const bgDisc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      bgDisc.setAttribute("cx", String(thumbX));
      bgDisc.setAttribute("cy", String(thumbY));
      bgDisc.setAttribute("r", String(THUMB_R));
      bgDisc.setAttribute("fill", "var(--background, white)");
      bgDisc.setAttribute("stroke", "none");
      svg.appendChild(bgDisc);

      const thumbStroke = variant === "hybrid" && isOn ? "none" : strokeColor;
      const useThumbFill = variant === "hybrid" || variant === "ball";
      const thumb = drawCircle(thumbX, thumbY, THUMB_R * 2, {
        seed: stableSeed(`${toggleId}-thumb`),
        stroke: thumbStroke,
        fill: useThumbFill ? strokeColor : "none",
        fillStyle: "hachure",
        fillWeight: theme === "crayon" ? 2.0 : theme === "ink" ? 1.6 : 1.4,
        hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2.5 : 3,
        hachureAngle: 41,
        roughness: theme === "crayon" ? 2.2 : theme === "ink" ? 0.4 : 1.0,
        bowing: theme === "crayon" ? 1.8 : theme === "ink" ? 0.3 : 1.0,
        strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.2 : 1.0,
      });
      if (thumb) svg.appendChild(thumb);
    },
    [disabled, drawCircle, drawRect, theme, toggleId, variant],
  );

  useEffect(() => {
    draw(currentValue);
  }, [currentValue, draw]);

  const handleChange = () => {
    if (disabled) return;
    const next = !currentValue;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2.5",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      htmlFor={toggleId}
      style={roughStyle}
    >
      <div className="relative shrink-0" style={{ width: WIDTH, height: HEIGHT }}>
        <input
          type="checkbox"
          id={toggleId}
          checked={currentValue}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <svg
          ref={svgRef}
          aria-hidden="true"
          width={WIDTH}
          height={HEIGHT}
          className="pointer-events-none overflow-visible"
        />
      </div>
      {label ? <span className="text-sm text-foreground">{label}</span> : null}
    </label>
  );
}
