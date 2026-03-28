"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRough } from "@/hooks/use-rough";
import {
  randomSeed,
  resolveRoughVars,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";
import { cn } from "@/lib/utils";

export interface RadioOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface RadioGroupProps extends CrumbleColorProps {
  className?: string;
  defaultValue?: string;
  name: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  orientation?: "vertical" | "horizontal";
  theme?: CrumbleTheme;
  value?: string;
}

const SIZE = 20;

function RadioItem({
  checked,
  name,
  onChange,
  option,
  theme: themeProp,
}: {
  checked: boolean;
  name: string;
  onChange: (value: string) => void;
  option: RadioOption;
  theme?: CrumbleTheme;
}) {
  const id = `radio-${name}-${option.value}`;
  const { animateOnHover, drawCircle, svgRef } = useRough({
    stableId: id,
    theme: themeProp,
    variant: "interactive",
  });

  const draw = useCallback(
    (isOn: boolean, reseed = false) => {
      const svg = svgRef.current;
      if (!svg) return;

      svg.replaceChildren();

      const stroke = option.disabled ? "var(--cr-stroke-muted)" : "var(--cr-stroke)";
      const outer = drawCircle(SIZE / 2, SIZE / 2, SIZE - 2, {
        fill: "none",
        seed: reseed ? randomSeed() : undefined,
        stroke,
      });
      if (outer) svg.appendChild(outer);

      if (isOn) {
        const inner = drawCircle(SIZE / 2, SIZE / 2, SIZE / 2, {
          fill: stroke,
          fillStyle: "solid",
          seed: reseed ? randomSeed() : undefined,
          stroke: "none",
        });
        if (inner) svg.appendChild(inner);
      }
    },
    [drawCircle, option.disabled, svgRef],
  );

  useEffect(() => {
    draw(checked);
  }, [checked, draw]);

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2.5",
        option.disabled && "cursor-not-allowed opacity-40",
      )}
      onMouseEnter={() => {
        if (!option.disabled && animateOnHover) draw(checked, true);
      }}
      onMouseLeave={() => {
        if (!option.disabled && animateOnHover) draw(checked, false);
      }}
    >
      <div className="relative h-5 w-5 shrink-0">
        <input
          checked={checked}
          disabled={option.disabled}
          id={id}
          name={name}
          onChange={() => onChange(option.value)}
          className={cn(
            "absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0",
            option.disabled && "cursor-not-allowed",
          )}
          type="radio"
          value={option.value}
        />
        <svg
          ref={svgRef}
          aria-hidden="true"
          height={SIZE}
          width={SIZE}
          className="pointer-events-none overflow-visible"
        />
      </div>
      <span className="text-sm text-foreground">{option.label}</span>
    </label>
  );
}

export function RadioGroup({
  className,
  defaultValue,
  fill,
  name,
  onChange,
  options,
  orientation = "vertical",
  stroke,
  strokeMuted,
  theme,
  value,
}: RadioGroupProps) {
  const [selected, setSelected] = useState(defaultValue ?? value ?? "");
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

  const handleChange = (nextValue: string) => {
    setSelected(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col gap-3" : "flex-row gap-5",
        className,
      )}
      style={roughStyle}
      role="radiogroup"
    >
      {options.map((option) => (
        <RadioItem
          key={option.value}
          checked={(value ?? selected) === option.value}
          name={name}
          onChange={handleChange}
          option={option}
          theme={theme}
        />
      ))}
    </div>
  );
}
