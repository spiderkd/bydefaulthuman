// // // // "use client";

// // // // import { useCallback, useContext, useEffect, useRef, useState } from "react";
// // // // import rough from "roughjs";
// // // // import {
// // // //   CrumbleContext,
// // // //   getRoughOptions,
// // // //   resolveRoughVars,
// // // //   stableSeed,
// // // //   type CrumbleColorProps,
// // // //   type CrumbleTheme,
// // // // } from "@/lib/rough";
// // // // import { cn } from "@/lib/utils";

// // // // export interface ToggleProps extends CrumbleColorProps {
// // // //   checked?: boolean;
// // // //   className?: string;
// // // //   defaultChecked?: boolean;
// // // //   disabled?: boolean;
// // // //   id?: string;
// // // //   label?: string;
// // // //   onChange?: (checked: boolean) => void;
// // // //   theme?: CrumbleTheme;
// // // // }

// // // // const HEIGHT = 24;
// // // // const WIDTH = 44;

// // // // export function Toggle({
// // // //   checked,
// // // //   className,
// // // //   defaultChecked = false,
// // // //   disabled,
// // // //   fill,
// // // //   id,
// // // //   label,
// // // //   onChange,
// // // //   stroke,
// // // //   strokeMuted,
// // // //   theme: themeProp,
// // // // }: ToggleProps) {
// // // //   const [internalValue, setInternalValue] = useState(defaultChecked);
// // // //   const svgRef = useRef<SVGSVGElement>(null);
// // // //   const toggleId =
// // // //     id ?? `toggle-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;
// // // //   const currentValue = checked ?? internalValue;
// // // //   const { theme: contextTheme } = useContext(CrumbleContext);
// // // //   const theme = themeProp ?? contextTheme;
// // // //   const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

// // // //   const draw = useCallback(
// // // //     (isOn: boolean) => {
// // // //       const svg = svgRef.current;
// // // //       if (!svg) return;

// // // //       svg.replaceChildren();

// // // //       const renderer = rough.svg(svg);
// // // //       const options = getRoughOptions(theme, "interactive", {
// // // //         seed: stableSeed(toggleId),
// // // //         stroke: disabled ? "var(--cr-stroke-muted)" : "var(--cr-stroke)",
// // // //       });

// // // //       svg.appendChild(
// // // //         renderer.rectangle(1, 1, WIDTH - 2, HEIGHT - 2, {
// // // //           ...options,
// // // //           fill: isOn ? "var(--cr-stroke)" : "none",
// // // //           fillStyle: "solid",
// // // //           roughness: 0.8,
// // // //         }),
// // // //       );

// // // //       const thumbX = isOn ? WIDTH - HEIGHT / 2 - 2 : HEIGHT / 2 + 2;
// // // //       svg.appendChild(
// // // //         renderer.circle(thumbX, HEIGHT / 2, HEIGHT - 6, {
// // // //           ...options,
// // // //           fill: isOn
// // // //             ? "hsl(var(--background))"
// // // //             : disabled
// // // //               ? "var(--cr-stroke-muted)"
// // // //               : "var(--cr-stroke)",
// // // //           fillStyle: "solid",
// // // //           seed: stableSeed(`${toggleId}-thumb`),
// // // //           stroke: isOn ? "hsl(var(--background))" : "var(--cr-stroke)",
// // // //         }),
// // // //       );
// // // //     },
// // // //     [disabled, theme, toggleId],
// // // //   );

// // // //   useEffect(() => {
// // // //     draw(currentValue);
// // // //   }, [currentValue, draw]);

// // // //   const handleClick = () => {
// // // //     if (disabled) return;

// // // //     const nextValue = !currentValue;
// // // //     setInternalValue(nextValue);
// // // //     onChange?.(nextValue);
// // // //   };

// // // //   return (
// // // //     <label
// // // //       className={cn(
// // // //         "inline-flex cursor-pointer select-none items-center gap-2.5",
// // // //         disabled && "cursor-not-allowed opacity-40",
// // // //         className,
// // // //       )}
// // // //       htmlFor={toggleId}
// // // //       style={roughStyle}
// // // //     >
// // // //       <div onClick={handleClick} className="relative h-6 w-11 shrink-0">
// // // //         <input
// // // //           checked={currentValue}
// // // //           disabled={disabled}
// // // //           id={toggleId}
// // // //           onChange={() => {}}
// // // //           className="absolute h-0 w-0 opacity-0"
// // // //           type="checkbox"
// // // //         />
// // // //         <svg
// // // //           ref={svgRef}
// // // //           aria-checked={currentValue}
// // // //           aria-hidden="true"
// // // //           height={HEIGHT}
// // // //           width={WIDTH}
// // // //           role="switch"
// // // //           className={cn(
// // // //             "overflow-visible",
// // // //             disabled ? "cursor-not-allowed" : "cursor-pointer",
// // // //           )}
// // // //         />
// // // //       </div>
// // // //       {label ? <span className="text-sm text-foreground">{label}</span> : null}
// // // //     </label>
// // // //   );
// // // // }

// // // "use client";

// // // import { useCallback, useContext, useEffect, useRef, useState } from "react";
// // // import rough from "roughjs";
// // // import {
// // //   CrumbleContext,
// // //   getRoughOptions,
// // //   resolveRoughVars,
// // //   stableSeed,
// // //   type CrumbleColorProps,
// // //   type CrumbleTheme,
// // // } from "@/lib/rough";
// // // import { cn } from "@/lib/utils";

// // // export interface ToggleProps extends CrumbleColorProps {
// // //   checked?: boolean;
// // //   className?: string;
// // //   defaultChecked?: boolean;
// // //   disabled?: boolean;
// // //   id?: string;
// // //   label?: string;
// // //   onChange?: (checked: boolean) => void;
// // //   theme?: CrumbleTheme;
// // // }

// // // const HEIGHT = 24;
// // // const WIDTH = 44;
// // // // Thumb radius (circle diameter passed to rough is HEIGHT - 6 = 18, so r = 9)
// // // const THUMB_R = 9;
// // // const THUMB_OFF_X = 2 + THUMB_R; // 11  — left position when off
// // // const THUMB_ON_X = WIDTH - 2 - THUMB_R; // 33  — left position when on

// // // export function Toggle({
// // //   checked,
// // //   className,
// // //   defaultChecked = false,
// // //   disabled = false,
// // //   fill,
// // //   id,
// // //   label,
// // //   onChange,
// // //   stroke,
// // //   strokeMuted,
// // //   theme: themeProp,
// // // }: ToggleProps) {
// // //   const isControlled = checked !== undefined;
// // //   const [internalValue, setInternalValue] = useState(defaultChecked);
// // //   const svgRef = useRef<SVGSVGElement>(null);

// // //   const toggleId =
// // //     id ?? `toggle-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;

// // //   // Derive the single source of truth for display
// // //   const currentValue = isControlled ? checked : internalValue;

// // //   const { theme: contextTheme } = useContext(CrumbleContext);
// // //   const theme = themeProp ?? contextTheme;
// // //   const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

// // //   const draw = useCallback(
// // //     (isOn: boolean) => {
// // //       const svg = svgRef.current;
// // //       if (!svg) return;

// // //       svg.replaceChildren();
// // //       svg.setAttribute("width", String(WIDTH));
// // //       svg.setAttribute("height", String(HEIGHT));
// // //       svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

// // //       const rc = rough.svg(svg);

// // //       const trackOpts = getRoughOptions(theme, "interactive", {
// // //         seed: stableSeed(toggleId),
// // //         stroke: disabled ? "var(--cr-stroke-muted)" : "var(--cr-stroke)",
// // //         fill: isOn ? "var(--cr-stroke)" : "none",
// // //         // fillStyle: "solid",
// // //         roughness: theme === "crayon" ? 2.0 : theme === "ink" ? 0.5 : 0.9,
// // //         bowing: theme === "crayon" ? 1.5 : theme === "ink" ? 0.3 : 0.8,
// // //         strokeWidth: theme === "crayon" ? 2.0 : theme === "ink" ? 1.5 : 1.2,
// // //       });

// // //       // Track rectangle
// // //       svg.appendChild(rc.rectangle(1, 1, WIDTH - 2, HEIGHT - 2, trackOpts));

// // //       // Thumb circle — centre x flips between off and on positions
// // //       const thumbX = isOn ? THUMB_ON_X : THUMB_OFF_X;
// // //       const thumbOpts = getRoughOptions(theme, "interactive", {
// // //         seed: stableSeed(`${toggleId}-thumb`),
// // //         fill: isOn
// // //           ? "hsl(var(--background))"
// // //           : disabled
// // //             ? "var(--cr-stroke-muted)"
// // //             : "var(--cr-stroke)",
// // //         fillStyle: "solid",
// // //         stroke: isOn
// // //           ? "hsl(var(--background))"
// // //           : disabled
// // //             ? "var(--cr-stroke-muted)"
// // //             : "var(--cr-stroke)",
// // //         roughness: theme === "crayon" ? 2.2 : theme === "ink" ? 0.4 : 1.0,
// // //         bowing: theme === "crayon" ? 1.8 : theme === "ink" ? 0.3 : 1.0,
// // //         strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.2 : 1.0,
// // //       });

// // //       svg.appendChild(rc.circle(thumbX, HEIGHT / 2, HEIGHT - 6, thumbOpts));
// // //     },
// // //     [disabled, theme, toggleId],
// // //   );

// // //   // Redraw whenever the visible value or draw function changes
// // //   useEffect(() => {
// // //     draw(currentValue);
// // //   }, [currentValue, draw]);

// // //   const handleChange = () => {
// // //     if (disabled) return;
// // //     const next = !currentValue;
// // //     if (!isControlled) setInternalValue(next);
// // //     onChange?.(next);
// // //   };

// // //   return (
// // //     <label
// // //       className={cn(
// // //         "inline-flex cursor-pointer select-none items-center gap-2.5",
// // //         disabled && "cursor-not-allowed opacity-40",
// // //         className,
// // //       )}
// // //       htmlFor={toggleId}
// // //       style={roughStyle}
// // //     >
// // //       <div
// // //         className="relative shrink-0"
// // //         style={{ width: WIDTH, height: HEIGHT }}
// // //       >
// // //         {/*
// // //           Real checkbox drives accessibility and keyboard support.
// // //           It's visually hidden but still in the tab order.
// // //         */}
// // //         <input
// // //           type="checkbox"
// // //           id={toggleId}
// // //           checked={currentValue}
// // //           disabled={disabled}
// // //           onChange={handleChange}
// // //           className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
// // //         />
// // //         <svg
// // //           ref={svgRef}
// // //           aria-hidden="true"
// // //           width={WIDTH}
// // //           height={HEIGHT}
// // //           className="pointer-events-none overflow-visible"
// // //         />
// // //       </div>
// // //       {label ? <span className="text-sm text-foreground">{label}</span> : null}
// // //     </label>
// // //   );
// // // }

// // "use client";

// // import { useCallback, useContext, useEffect, useRef, useState } from "react";
// // import rough from "roughjs";
// // import {
// //   CrumbleContext,
// //   getRoughOptions,
// //   resolveRoughVars,
// //   stableSeed,
// //   type CrumbleColorProps,
// //   type CrumbleTheme,
// // } from "@/lib/rough";
// // import { cn } from "@/lib/utils";

// // export interface ToggleProps extends CrumbleColorProps {
// //   checked?: boolean;
// //   className?: string;
// //   defaultChecked?: boolean;
// //   disabled?: boolean;
// //   id?: string;
// //   label?: string;
// //   onChange?: (checked: boolean) => void;
// //   theme?: CrumbleTheme;
// // }

// // const HEIGHT = 24;
// // const WIDTH = 44;
// // // Thumb radius (circle diameter passed to rough is HEIGHT - 6 = 18, so r = 9)
// // const THUMB_R = 9;
// // const THUMB_OFF_X = 2 + THUMB_R; // 11  — left position when off
// // const THUMB_ON_X = WIDTH - 2 - THUMB_R; // 33  — left position when on

// // export function Toggle({
// //   checked,
// //   className,
// //   defaultChecked = false,
// //   disabled = false,
// //   fill,
// //   id,
// //   label,
// //   onChange,
// //   stroke,
// //   strokeMuted,
// //   theme: themeProp,
// // }: ToggleProps) {
// //   const isControlled = checked !== undefined;
// //   const [internalValue, setInternalValue] = useState(defaultChecked);
// //   const svgRef = useRef<SVGSVGElement>(null);

// //   const toggleId =
// //     id ?? `toggle-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;

// //   // Derive the single source of truth for display
// //   const currentValue = isControlled ? checked : internalValue;

// //   const { theme: contextTheme } = useContext(CrumbleContext);
// //   const theme = themeProp ?? contextTheme;
// //   const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

// //   const draw = useCallback(
// //     (isOn: boolean) => {
// //       const svg = svgRef.current;
// //       if (!svg) return;

// //       svg.replaceChildren();
// //       svg.setAttribute("width", String(WIDTH));
// //       svg.setAttribute("height", String(HEIGHT));
// //       svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

// //       const rc = rough.svg(svg);

// //       // ── Track ──────────────────────────────────────────────────────────────
// //       // hachure fill so the lines don't flood the bounding box and bury the thumb.
// //       const trackOpts = getRoughOptions(theme, "interactive", {
// //         seed: stableSeed(toggleId),
// //         stroke: disabled ? "var(--cr-stroke-muted)" : "var(--cr-stroke)",
// //         fill: isOn ? "var(--cr-stroke)" : "none",
// //         fillStyle: "hachure",
// //         fillWeight: theme === "crayon" ? 2.5 : theme === "ink" ? 2.0 : 1.8,
// //         hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2 : 2.5,
// //         roughness: theme === "crayon" ? 2.0 : theme === "ink" ? 0.5 : 0.9,
// //         bowing: theme === "crayon" ? 1.5 : theme === "ink" ? 0.3 : 0.8,
// //         strokeWidth: theme === "crayon" ? 2.0 : theme === "ink" ? 1.5 : 1.2,
// //       });

// //       svg.appendChild(rc.rectangle(1, 1, WIDTH - 2, HEIGHT - 2, trackOpts));

// //       // ── Thumb ──────────────────────────────────────────────────────────────
// //       // Two layers: a plain <circle> for an opaque background (masks the
// //       // hachure lines behind it), then a rough circle outline on top.
// //       // We avoid relying on rough's solid fill because CSS var() colours don't
// //       // always resolve inside SVG paint context — causing the black flood.
// //       const thumbX = isOn ? THUMB_ON_X : THUMB_OFF_X;
// //       const thumbY = HEIGHT / 2;
// //       const thumbR = THUMB_R - 1;

// //       // Opaque bg disc masks hachure lines from the track behind the thumb.
// //       const bgDisc = document.createElementNS(
// //         "http://www.w3.org/2000/svg",
// //         "circle",
// //       );
// //       bgDisc.setAttribute("cx", String(thumbX));
// //       bgDisc.setAttribute("cy", String(thumbY));
// //       bgDisc.setAttribute("r", String(thumbR));
// //       bgDisc.setAttribute("fill", "var(--background, white)");
// //       bgDisc.setAttribute("stroke", "none");
// //       svg.appendChild(bgDisc);

// //       // Hachure fill in both states — stroke color when off, background when on
// //       // so the lines are always visible, just inverting against the track fill.
// //       const thumbOpts = getRoughOptions(theme, "interactive", {
// //         seed: stableSeed(`${toggleId}-thumb`),
// //         fill: isOn
// //           ? "var(--background, white)"
// //           : disabled
// //             ? "var(--cr-stroke-muted)"
// //             : "var(--cr-stroke)",
// //         fillStyle: "hachure",
// //         fillWeight: theme === "crayon" ? 2.0 : theme === "ink" ? 1.8 : 1.5,
// //         hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2.5 : 3,
// //         hachureAngle: 41,
// //         stroke: disabled ? "var(--cr-stroke-muted)" : "var(--cr-stroke)",
// //         roughness: theme === "crayon" ? 2.2 : theme === "ink" ? 0.4 : 1.0,
// //         bowing: theme === "crayon" ? 1.8 : theme === "ink" ? 0.3 : 1.0,
// //         strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.2 : 1.0,
// //       });

// //       svg.appendChild(rc.circle(thumbX, thumbY, thumbR * 2, thumbOpts));
// //     },
// //     [disabled, theme, toggleId],
// //   );

// //   // Redraw whenever the visible value or draw function changes
// //   useEffect(() => {
// //     draw(currentValue);
// //   }, [currentValue, draw]);

// //   const handleChange = () => {
// //     if (disabled) return;
// //     const next = !currentValue;
// //     if (!isControlled) setInternalValue(next);
// //     onChange?.(next);
// //   };

// //   return (
// //     <label
// //       className={cn(
// //         "inline-flex cursor-pointer select-none items-center gap-2.5",
// //         disabled && "cursor-not-allowed opacity-40",
// //         className,
// //       )}
// //       htmlFor={toggleId}
// //       style={roughStyle}
// //     >
// //       <div
// //         className="relative shrink-0"
// //         style={{ width: WIDTH, height: HEIGHT }}
// //       >
// //         {/*
// //           Real checkbox drives accessibility and keyboard support.
// //           It's visually hidden but still in the tab order.
// //         */}
// //         <input
// //           type="checkbox"
// //           id={toggleId}
// //           checked={currentValue}
// //           disabled={disabled}
// //           onChange={handleChange}
// //           className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
// //         />
// //         <svg
// //           ref={svgRef}
// //           aria-hidden="true"
// //           width={WIDTH}
// //           height={HEIGHT}
// //           className="pointer-events-none overflow-visible"
// //         />
// //       </div>
// //       {label ? <span className="text-sm text-foreground">{label}</span> : null}
// //     </label>
// //   );
// // }

// "use client";

// import { useCallback, useContext, useEffect, useRef, useState } from "react";
// import rough from "roughjs";
// import {
//   CrumbleContext,
//   getRoughOptions,
//   resolveRoughVars,
//   stableSeed,
//   type CrumbleColorProps,
//   type CrumbleTheme,
// } from "@/lib/rough";
// import { cn } from "@/lib/utils";

// // ─── Variants ────────────────────────────────────────────────────────────────
// //
// // "outline"  — track border + ball outline only, no fill anywhere (default)
// // "filled"   — track fills solid when on, ball stays outline
// // "hybrid"   — track hachure when on, ball hachure always (opposite angles)
// // "ball"     — no track fill ever, ball hachure always

// export type ToggleVariant = "outline" | "filled" | "hybrid" | "ball";

// export interface ToggleProps extends CrumbleColorProps {
//   checked?: boolean;
//   className?: string;
//   defaultChecked?: boolean;
//   disabled?: boolean;
//   id?: string;
//   label?: string;
//   onChange?: (checked: boolean) => void;
//   theme?: CrumbleTheme;
//   variant?: ToggleVariant;
// }

// const HEIGHT = 24;
// const WIDTH = 44;
// const THUMB_R = 8;
// const THUMB_OFF_X = 2 + THUMB_R; // 10
// const THUMB_ON_X = WIDTH - 2 - THUMB_R; // 34

// export function Toggle({
//   checked,
//   className,
//   defaultChecked = false,
//   disabled = false,
//   fill,
//   id,
//   label,
//   onChange,
//   stroke,
//   strokeMuted,
//   theme: themeProp,
//   variant = "outline",
// }: ToggleProps) {
//   const isControlled = checked !== undefined;
//   const [internalValue, setInternalValue] = useState(defaultChecked);
//   const svgRef = useRef<SVGSVGElement>(null);

//   const toggleId =
//     id ?? `toggle-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;

//   const currentValue = isControlled ? checked : internalValue;
//   const { theme: contextTheme } = useContext(CrumbleContext);
//   const theme = themeProp ?? contextTheme;
//   const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

//   const draw = useCallback(
//     (isOn: boolean) => {
//       const svg = svgRef.current;
//       if (!svg) return;

//       svg.replaceChildren();
//       svg.setAttribute("width", String(WIDTH));
//       svg.setAttribute("height", String(HEIGHT));
//       svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

//       const rc = rough.svg(svg);

//       const strokeColor = disabled
//         ? "var(--cr-stroke-muted)"
//         : "var(--cr-stroke)";

//       const baseOpts = getRoughOptions(theme, "interactive", {
//         seed: stableSeed(toggleId),
//         stroke: strokeColor,
//         roughness: theme === "crayon" ? 2.0 : theme === "ink" ? 0.5 : 0.9,
//         bowing: theme === "crayon" ? 1.5 : theme === "ink" ? 0.3 : 0.8,
//         strokeWidth: theme === "crayon" ? 2.0 : theme === "ink" ? 1.5 : 1.2,
//       });

//       // ── Track fill logic per variant ──────────────────────────────────────

//       let trackFill = "none";
//       let trackFStyle = "hachure";

//       if (variant === "filled" && isOn) {
//         trackFill = strokeColor;
//         trackFStyle = "solid";
//       } else if (variant === "hybrid" && isOn) {
//         trackFill = strokeColor;
//         trackFStyle = "hachure";
//       }

//       const trackOpts = {
//         ...baseOpts,
//         fill: trackFill,
//         fillStyle: trackFStyle,
//         fillWeight: theme === "crayon" ? 2.2 : theme === "ink" ? 1.8 : 1.6,
//         hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2 : 2.5,
//         hachureAngle: -41,
//       };

//       svg.appendChild(rc.rectangle(1, 1, WIDTH - 2, HEIGHT - 2, trackOpts));

//       // ── Thumb ─────────────────────────────────────────────────────────────
//       // Always just an outline circle — position is the only thing that changes.
//       // For "hybrid" and "ball" variants the circle gets a hachure fill too.

//       const thumbX = isOn ? THUMB_ON_X : THUMB_OFF_X;
//       const thumbY = HEIGHT / 2;

//       // Opaque background disc so track hachure doesn't bleed through the thumb.
//       const bgDisc = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "circle",
//       );
//       bgDisc.setAttribute("cx", String(thumbX));
//       bgDisc.setAttribute("cy", String(thumbY));
//       bgDisc.setAttribute("r", String(THUMB_R));
//       bgDisc.setAttribute("fill", "var(--background, white)");
//       bgDisc.setAttribute("stroke", "none");
//       svg.appendChild(bgDisc);

//       const useThumbFill = variant === "hybrid" || variant === "ball";

//       const thumbOpts = getRoughOptions(theme, "interactive", {
//         seed: stableSeed(`${toggleId}-thumb`),
//         stroke: strokeColor,
//         fill: useThumbFill ? strokeColor : "none",
//         fillStyle: "hachure",
//         fillWeight: theme === "crayon" ? 2.0 : theme === "ink" ? 1.6 : 1.4,
//         hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2.5 : 3,
//         hachureAngle: 41, // opposite to track so they visually separate
//         roughness: theme === "crayon" ? 2.2 : theme === "ink" ? 0.4 : 1.0,
//         bowing: theme === "crayon" ? 1.8 : theme === "ink" ? 0.3 : 1.0,
//         strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.2 : 1.0,
//       });

//       svg.appendChild(rc.circle(thumbX, thumbY, THUMB_R * 2, thumbOpts));
//     },
//     [disabled, theme, toggleId, variant],
//   );

//   useEffect(() => {
//     draw(currentValue);
//   }, [currentValue, draw]);

//   const handleChange = () => {
//     if (disabled) return;
//     const next = !currentValue;
//     if (!isControlled) setInternalValue(next);
//     onChange?.(next);
//   };

//   return (
//     <label
//       className={cn(
//         "inline-flex cursor-pointer select-none items-center gap-2.5",
//         disabled && "cursor-not-allowed opacity-40",
//         className,
//       )}
//       htmlFor={toggleId}
//       style={roughStyle}
//     >
//       <div
//         className="relative shrink-0"
//         style={{ width: WIDTH, height: HEIGHT }}
//       >
//         <input
//           type="checkbox"
//           id={toggleId}
//           checked={currentValue}
//           disabled={disabled}
//           onChange={handleChange}
//           className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
//         />
//         <svg
//           ref={svgRef}
//           aria-hidden="true"
//           width={WIDTH}
//           height={HEIGHT}
//           className="pointer-events-none overflow-visible"
//         />
//       </div>
//       {label ? <span className="text-sm text-foreground">{label}</span> : null}
//     </label>
//   );
// }

"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import rough from "roughjs";
import {
  CrumbleContext,
  getRoughOptions,
  resolveRoughVars,
  stableSeed,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";
import { cn } from "@/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────
//
// "filled"  — track fills solid when on, ball outline only
// "hybrid"  — track hachure when on, ball hachure always; ball stroke hidden when on
// "ball"    — no track fill, ball hachure always (default)

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
const THUMB_OFF_X = 2 + THUMB_R; // 10
const THUMB_ON_X = WIDTH - 2 - THUMB_R; // 34

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
  const { theme: contextTheme } = useContext(CrumbleContext);
  const theme = themeProp ?? contextTheme;
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });

  const draw = useCallback(
    (isOn: boolean) => {
      const svg = svgRef.current;
      if (!svg) return;

      svg.replaceChildren();
      svg.setAttribute("width", String(WIDTH));
      svg.setAttribute("height", String(HEIGHT));
      svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

      const rc = rough.svg(svg);

      const strokeColor = disabled
        ? "var(--cr-stroke-muted)"
        : "var(--cr-stroke)";

      const baseOpts = getRoughOptions(theme, "interactive", {
        seed: stableSeed(toggleId),
        stroke: strokeColor,
        roughness: theme === "crayon" ? 2.0 : theme === "ink" ? 0.5 : 0.9,
        bowing: theme === "crayon" ? 1.5 : theme === "ink" ? 0.3 : 0.8,
        strokeWidth: theme === "crayon" ? 2.0 : theme === "ink" ? 1.5 : 1.2,
      });

      // ── Track fill logic per variant ──────────────────────────────────────

      let trackFill = "none";
      let trackFStyle = "hachure";

      if (variant === "filled" && isOn) {
        trackFill = strokeColor;
        trackFStyle = "solid";
      } else if (variant === "hybrid" && isOn) {
        trackFill = strokeColor;
        trackFStyle = "hachure";
      }

      const trackOpts = {
        ...baseOpts,
        fill: trackFill,
        fillStyle: trackFStyle,
        fillWeight: theme === "crayon" ? 2.2 : theme === "ink" ? 1.8 : 1.6,
        hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2 : 2.5,
        hachureAngle: -41,
      };

      svg.appendChild(rc.rectangle(1, 1, WIDTH - 2, HEIGHT - 2, trackOpts));

      // ── Thumb ─────────────────────────────────────────────────────────────
      // Always just an outline circle — position is the only thing that changes.
      // For "hybrid" and "ball" variants the circle gets a hachure fill too.

      const thumbX = isOn ? THUMB_ON_X : THUMB_OFF_X;
      const thumbY = HEIGHT / 2;

      // Opaque background disc so track hachure doesn't bleed through the thumb.
      const bgDisc = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      bgDisc.setAttribute("cx", String(thumbX));
      bgDisc.setAttribute("cy", String(thumbY));
      bgDisc.setAttribute("r", String(THUMB_R));
      bgDisc.setAttribute("fill", "var(--background, white)");
      bgDisc.setAttribute("stroke", "none");
      svg.appendChild(bgDisc);

      // hybrid+on: ball loses its stroke so only the hachure lines show through
      // the hatched track — the absence of an outline reads clearly as "active".
      const thumbStroke = variant === "hybrid" && isOn ? "none" : strokeColor;
      const useThumbFill = variant === "hybrid" || variant === "ball";

      const thumbOpts = getRoughOptions(theme, "interactive", {
        seed: stableSeed(`${toggleId}-thumb`),
        stroke: thumbStroke,
        fill: useThumbFill ? strokeColor : "none",
        fillStyle: "hachure",
        fillWeight: theme === "crayon" ? 2.0 : theme === "ink" ? 1.6 : 1.4,
        hachureGap: theme === "crayon" ? 3 : theme === "ink" ? 2.5 : 3,
        hachureAngle: 41, // opposite to track so they visually separate
        roughness: theme === "crayon" ? 2.2 : theme === "ink" ? 0.4 : 1.0,
        bowing: theme === "crayon" ? 1.8 : theme === "ink" ? 0.3 : 1.0,
        strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.2 : 1.0,
      });

      svg.appendChild(rc.circle(thumbX, thumbY, THUMB_R * 2, thumbOpts));
    },
    [disabled, theme, toggleId, variant],
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
      <div
        className="relative shrink-0"
        style={{ width: WIDTH, height: HEIGHT }}
      >
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
