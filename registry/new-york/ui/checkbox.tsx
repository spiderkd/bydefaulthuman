"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
} from "react";
import { useRough } from "@/hooks/use-rough";
import {
  randomSeed,
  resolveRoughVars,
  stableSeed,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends CrumbleColorProps {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  onChange?: (checked: boolean) => void;
  theme?: CrumbleTheme;
}

const SIZE = 20;

export function Checkbox({
  checked,
  className,
  defaultChecked,
  disabled,
  fill,
  id,
  label,
  onChange,
  stroke,
  strokeMuted,
  theme: themeProp,
}: CheckboxProps) {
  const internalChecked = useRef(defaultChecked ?? false);
  const inputId =
    id ?? `checkbox-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });
  const {
    animateOnHover,
    drawLine,
    drawRect,
    svgRef,
  } = useRough({
    stableId: inputId,
    theme: themeProp,
    variant: "interactive",
  });

  const draw = useCallback(
    (isOn: boolean, reseed = false) => {
      const svg = svgRef.current;
      if (!svg) return;

      svg.replaceChildren();

      const baseOptions = {
        fill: "none",
        seed: reseed ? randomSeed() : undefined,
        stroke: disabled ? "var(--cr-stroke-muted)" : "var(--cr-stroke)",
      };

      const box = drawRect(1, 1, SIZE - 2, SIZE - 2, baseOptions);
      if (box) svg.appendChild(box);

      if (isOn) {
        const tickOptions = {
          ...baseOptions,
          seed: reseed ? randomSeed() : stableSeed(`${inputId}-tick`),
          strokeWidth: 1.8,
        };
        const left = drawLine(3, SIZE / 2 + 1, SIZE / 2 - 1, SIZE - 4, tickOptions);
        const right = drawLine(
          SIZE / 2 - 1,
          SIZE - 4,
          SIZE - 3,
          3,
          {
            ...tickOptions,
            seed: reseed ? randomSeed() : stableSeed(`${inputId}-tick-r`),
          },
        );
        if (left) svg.appendChild(left);
        if (right) svg.appendChild(right);
      }
    },
    [disabled, drawLine, drawRect, inputId, svgRef],
  );

  useEffect(() => {
    draw(checked ?? internalChecked.current);
  }, [checked, draw]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    internalChecked.current = event.target.checked;
    draw(event.target.checked);
    onChange?.(event.target.checked);
  };

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2.5",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      style={roughStyle}
      onMouseEnter={() => {
        if (!disabled && animateOnHover) {
          draw(checked ?? internalChecked.current, true);
        }
      }}
      onMouseLeave={() => {
        if (!disabled && animateOnHover) {
          draw(checked ?? internalChecked.current, false);
        }
      }}
    >
      <div className="relative h-5 w-5 shrink-0">
        <input
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          className={cn(
            "absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0",
            disabled && "cursor-not-allowed",
          )}
          type="checkbox"
        />
        <svg
          ref={svgRef}
          aria-hidden="true"
          height={SIZE}
          width={SIZE}
          className="pointer-events-none overflow-visible"
        />
      </div>
      {label ? <span className="text-sm text-foreground">{label}</span> : null}
    </label>
  );
}
