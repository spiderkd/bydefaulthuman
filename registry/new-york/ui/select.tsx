// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   type SelectHTMLAttributes,
// } from "react";
// import { cn } from "@/lib/utils";
// import { type CrumbleTheme } from "@/lib/rough";
// import { useRough } from "@/hooks/use-rough";

// export interface SelectOption {
//   disabled?: boolean;
//   label: string;
//   value: string;
// }

// export interface SelectProps extends Omit<
//   SelectHTMLAttributes<HTMLSelectElement>,
//   "children"
// > {
//   error?: string;
//   label?: string;
//   options: SelectOption[];
//   placeholder?: string;
//   theme?: CrumbleTheme;
// }

// const HEIGHT = 40;

// export function Select({
//   className,
//   error,
//   id,
//   label,
//   onBlur,
//   onFocus,
//   options,
//   placeholder,
//   theme: themeProp,
//   ...props
// }: SelectProps) {
//   const [focused, setFocused] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const svgRef = useRef<SVGSVGElement>(null);
//   const arrowRef = useRef<SVGSVGElement>(null);
//   const selectId =
//     id ?? `select-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;
//   const { drawLine, drawRect, theme } = useRough({
//     stableId: selectId,
//     svgRef,
//     theme: themeProp,
//     variant: "border",
//   });

//   const draw = useCallback(() => {
//     const arrow = arrowRef.current;
//     const svg = svgRef.current;
//     const wrapper = wrapperRef.current;

//     if (!svg || !wrapper) return;

//     svg.replaceChildren();

//     const width = wrapper.offsetWidth;
//     svg.setAttribute("width", String(width));
//     svg.setAttribute("height", String(HEIGHT));
//     svg.setAttribute("viewBox", `0 0 ${width} ${HEIGHT}`);

//     const stroke = error
//       ? "color-mix(in srgb, currentColor 10%, red)"
//       : focused
//         ? "currentColor"
//         : "color-mix(in srgb, currentColor 40%, transparent)";

//     const box = drawRect(1, 1, width - 2, HEIGHT - 2, {
//       fill: "none",
//       stroke,
//     });

//     if (box) {
//       svg.appendChild(box);
//     }

//     if (!arrow) return;

//     arrow.replaceChildren();

//     const leftLine = drawLine(2, 4, 8, 10, { stroke, strokeWidth: 1.5 });
//     const rightLine = drawLine(8, 10, 14, 4, { stroke, strokeWidth: 1.5 });

//     if (leftLine) {
//       arrow.appendChild(leftLine);
//     }

//     if (rightLine) {
//       arrow.appendChild(rightLine);
//     }
//   }, [drawLine, drawRect, error, focused]);

//   useEffect(() => {
//     draw();
//   }, [draw, focused, theme]);

//   useEffect(() => {
//     const wrapper = wrapperRef.current;
//     if (!wrapper) return;

//     const observer = new ResizeObserver(() => draw());
//     observer.observe(wrapper);

//     return () => observer.disconnect();
//   }, [draw]);

//   return (
//     <div className={cn("flex flex-col gap-1.5", className)}>
//       {label ? (
//         <label
//           htmlFor={selectId}
//           className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
//         >
//           {label}
//         </label>
//       ) : null}
//       <div ref={wrapperRef} className="relative h-10">
//         <svg
//           ref={svgRef}
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-0 overflow-visible"
//         />
//         <svg
//           ref={arrowRef}
//           aria-hidden="true"
//           height={14}
//           width={16}
//           className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 overflow-visible"
//         />
//         <select
//           id={selectId}
//           onBlur={(event) => {
//             setFocused(false);
//             onBlur?.(event);
//           }}
//           onFocus={(event) => {
//             setFocused(true);
//             onFocus?.(event);
//           }}
//           className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-none bg-transparent py-0 pl-3 pr-9 text-sm text-foreground outline-none"
//           {...props}
//         >
//           {placeholder ? (
//             <option value="" disabled>
//               {placeholder}
//             </option>
//           ) : null}
//           {options.map((option) => (
//             <option
//               key={option.value}
//               disabled={option.disabled}
//               value={option.value}
//             >
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       {error ? <span className="text-xs text-destructive">{error}</span> : null}
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { randomSeed, stableSeed, type CrumbleTheme } from "@/lib/rough";
import { useRough } from "@/hooks/use-rough";
import rough from "roughjs";
import { getRoughOptions } from "@/lib/rough";

export interface SelectOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface SelectProps {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  options: SelectOption[];
  placeholder?: string;
  theme?: CrumbleTheme;
  value?: string;
}

const TRIGGER_HEIGHT = 40;
const OPTION_HEIGHT = 36;

export function Select({
  className,
  defaultValue,
  disabled,
  error,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  theme: themeProp,
  value: controlledValue,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const value = controlledValue ?? internalValue;
  const selectedOption = options.find((o) => o.value === value);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionSvgRefs = useRef<Map<string, SVGSVGElement>>(new Map());

  const selectId =
    id ?? `select-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;

  const { drawLine, drawRect, animateOnHover, theme } = useRough({
    stableId: selectId,
    svgRef,
    theme: themeProp,
    variant: "border",
  });

  // Draw trigger box + chevron
  const drawTrigger = useCallback(
    (reseed = false) => {
      const svg = svgRef.current;
      const arrow = arrowRef.current;
      const wrapper = wrapperRef.current;
      if (!svg || !wrapper) return;

      svg.replaceChildren();
      const width = wrapper.offsetWidth;
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(TRIGGER_HEIGHT));
      svg.setAttribute("viewBox", `0 0 ${width} ${TRIGGER_HEIGHT}`);
      const stroke = error
        ? "color-mix(in srgb, currentColor 10%, red)"
        : focused
          ? "currentColor"
          : "color-mix(in srgb, currentColor 40%, transparent)";

      const box = drawRect(1, 1, width - 2, TRIGGER_HEIGHT - 2, {
        fill: "none",
        seed: reseed ? randomSeed() : stableSeed(selectId),
        stroke,
      });
      if (box) svg.appendChild(box);

      if (!arrow) return;
      arrow.replaceChildren();
      const chevronStroke = disabled ? "var(--cr-stroke-muted)" : stroke;
      const leftLine = drawLine(2, open ? 10 : 4, 8, open ? 4 : 10, {
        stroke: chevronStroke,
        strokeWidth: 1.5,
      });
      const rightLine = drawLine(8, open ? 4 : 10, 14, open ? 10 : 4, {
        stroke: chevronStroke,
        strokeWidth: 1.5,
      });
      if (leftLine) arrow.appendChild(leftLine);
      if (rightLine) arrow.appendChild(rightLine);
    },
    [drawLine, drawRect, error, focused, open, disabled, selectId],
  );

  // Draw a single option row background
  const drawOption = useCallback(
    (
      svg: SVGSVGElement,
      width: number,
      isHighlighted: boolean,
      isSelected: boolean,
      optionId: string,
    ) => {
      svg.replaceChildren();
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(OPTION_HEIGHT));
      svg.setAttribute("viewBox", `0 0 ${width} ${OPTION_HEIGHT}`);

      if (!isHighlighted && !isSelected) return;

      const rc = rough.svg(svg);
      const opts = getRoughOptions(theme, "fill", {
        fill: isHighlighted ? "currentColor" : "none",
        fillStyle: "hachure",
        fillWeight: isSelected ? 1.5 : 1,
        seed: stableSeed(optionId),
        stroke: isHighlighted ? "currentColor" : "none",
        strokeWidth: 0,
      });

      svg.appendChild(rc.rectangle(2, 2, width - 4, OPTION_HEIGHT - 4, opts));
    },
    [theme],
  );

  // Draw the dropdown panel border
  const drawDropdown = useCallback(
    (svg: SVGSVGElement, width: number, height: number) => {
      svg.replaceChildren();
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const rc = rough.svg(svg);
      const opts = getRoughOptions(theme, "border", {
        fill: "none",
        seed: stableSeed(`${selectId}-dropdown`),
        stroke: "var(--cr-stroke)",
      });
      svg.appendChild(rc.rectangle(1, 1, width - 2, height - 2, opts));
    },
    [theme, selectId],
  );

  useEffect(() => {
    drawTrigger();
  }, [drawTrigger, theme, open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setFocused(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onBlur]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Resize observer on trigger
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(() => drawTrigger());
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [drawTrigger]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
    setFocused(false);
    onBlur?.();
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={selectId}
          className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
      ) : null}

      <div ref={wrapperRef} className="relative">
        {/* Trigger */}
        <div
          ref={triggerRef}
          id={selectId}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "relative h-10 cursor-pointer select-none outline-none",
            disabled && "cursor-not-allowed opacity-40",
          )}
          onClick={() => {
            if (disabled) return;
            setOpen((o) => !o);
            setFocused(true);
            onFocus?.();
          }}
          onFocus={() => {
            if (!disabled) {
              setFocused(true);
              onFocus?.();
            }
          }}
          onBlur={() => {
            if (!open) {
              setFocused(false);
              onBlur?.();
            }
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((o) => !o);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          onMouseEnter={() => {
            if (!disabled && animateOnHover) drawTrigger(true);
          }}
          onMouseLeave={() => {
            if (!disabled && animateOnHover) drawTrigger(false);
          }}
        >
          <svg
            ref={svgRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-visible"
          />
          <span
            className={cn(
              "absolute inset-0 flex items-center pl-3 pr-9 text-sm",
              !selectedOption && "text-muted-foreground",
            )}
          >
            {selectedOption?.label ?? placeholder ?? ""}
          </span>
          <svg
            ref={arrowRef}
            aria-hidden="true"
            height={14}
            width={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 overflow-visible"
          />
        </div>

        {/* Dropdown panel */}
        {open ? (
          <div
            ref={dropdownRef}
            role="listbox"
            aria-label={label}
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-background"
            style={{ minWidth: "100%" }}
          >
            {/* Rough border around the whole dropdown */}
            {(() => {
              const totalHeight = options.length * OPTION_HEIGHT;
              return (
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-visible"
                  ref={(el) => {
                    if (el) {
                      const width = el.parentElement?.offsetWidth ?? 200;
                      drawDropdown(el, width, totalHeight);
                    }
                  }}
                />
              );
            })()}

            {/* Options */}
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  className={cn(
                    "relative flex cursor-pointer items-center px-3 text-sm",
                    "hover:text-background",
                    option.disabled && "cursor-not-allowed opacity-40",
                    isSelected && "font-medium",
                  )}
                  style={{ height: OPTION_HEIGHT }}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={(e) => {
                    const svg = optionSvgRefs.current.get(option.value);
                    if (svg) {
                      const width = (e.currentTarget as HTMLElement)
                        .offsetWidth;
                      drawOption(svg, width, true, isSelected, option.value);
                    }
                  }}
                  onMouseLeave={(e) => {
                    const svg = optionSvgRefs.current.get(option.value);
                    if (svg) {
                      const width = (e.currentTarget as HTMLElement)
                        .offsetWidth;
                      drawOption(svg, width, false, isSelected, option.value);
                    }
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-visible"
                    ref={(el) => {
                      if (el) optionSvgRefs.current.set(option.value, el);
                      else optionSvgRefs.current.delete(option.value);
                    }}
                  />
                  <span className="relative z-10">{option.label}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
