// // "use client";

// // import {
// //   useCallback,
// //   useEffect,
// //   useRef,
// //   useState,
// //   type ChangeEvent,
// //   type TextareaHTMLAttributes,
// // } from "react";
// // import { cn } from "@/lib/utils";
// // import { type CrumbleTheme } from "@/lib/rough";
// // import { useRough } from "@/hooks/use-rough";

// // export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
// //   autoGrow?: boolean;
// //   error?: string;
// //   label?: string;
// //   theme?: CrumbleTheme;
// // }

// // export function Textarea({
// //   autoGrow = false,
// //   className,
// //   error,
// //   id,
// //   label,
// //   onBlur,
// //   onChange,
// //   onFocus,
// //   theme: themeProp,
// //   ...props
// // }: TextareaProps) {
// //   const [focused, setFocused] = useState(false);
// //   const wrapperRef = useRef<HTMLDivElement>(null);
// //   const textareaRef = useRef<HTMLTextAreaElement>(null);
// //   const svgRef = useRef<SVGSVGElement>(null);
// //   const textareaId =
// //     id ?? `textarea-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;
// //   const { drawRect, theme } = useRough({
// //     stableId: textareaId,
// //     svgRef,
// //     theme: themeProp,
// //     variant: "border",
// //   });

// //   const draw = useCallback(() => {
// //     const svg = svgRef.current;
// //     const wrapper = wrapperRef.current;

// //     if (!svg || !wrapper) return;

// //     svg.replaceChildren();

// //     const width = wrapper.offsetWidth;
// //     const height = wrapper.offsetHeight;
// //     svg.setAttribute("width", String(width));
// //     svg.setAttribute("height", String(height));
// //     svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

// //     const stroke = error
// //       ? "color-mix(in srgb, currentColor 10%, red)"
// //       : focused
// //         ? "currentColor"
// //         : "color-mix(in srgb, currentColor 40%, transparent)";

// //     const node = drawRect(1, 1, width - 2, height - 2, {
// //       fill: "none",
// //       stroke,
// //     });

// //     if (node) {
// //       svg.appendChild(node);
// //     }
// //   }, [drawRect, error, focused]);

// //   useEffect(() => {
// //     draw();
// //   }, [draw, focused, theme]);

// //   useEffect(() => {
// //     const wrapper = wrapperRef.current;
// //     if (!wrapper) return;

// //     const observer = new ResizeObserver(() => draw());
// //     observer.observe(wrapper);

// //     return () => observer.disconnect();
// //   }, [draw]);

// //   const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
// //     if (autoGrow && textareaRef.current) {
// //       textareaRef.current.style.height = "auto";
// //       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
// //       draw();
// //     }

// //     onChange?.(event);
// //   };

// //   return (
// //     <div className={cn("flex flex-col gap-1.5", className)}>
// //       {label ? (
// //         <label
// //           htmlFor={textareaId}
// //           className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
// //         >
// //           {label}
// //         </label>
// //       ) : null}
// //       <div ref={wrapperRef} className="relative min-h-24">
// //         <svg
// //           ref={svgRef}
// //           aria-hidden="true"
// //           className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
// //         />
// //         <textarea
// //           ref={textareaRef}
// //           id={textareaId}
// //           onBlur={(event) => {
// //             setFocused(false);
// //             onBlur?.(event);
// //           }}
// //           onChange={handleChange}
// //           onFocus={(event) => {
// //             setFocused(true);
// //             onFocus?.(event);
// //           }}
// //           className={cn(
// //             "absolute inset-0 h-full w-full border-none bg-transparent px-3 py-2.5 font-[inherit] text-sm text-foreground outline-none",
// //             autoGrow ? "resize-none" : "resize-y",
// //           )}
// //           {...props}
// //         />
// //       </div>
// //       {error ? <span className="text-xs text-destructive">{error}</span> : null}
// //     </div>
// //   );
// // }

// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   type ChangeEvent,
//   type TextareaHTMLAttributes,
// } from "react";
// import { cn } from "@/lib/utils";
// import { type CrumbleTheme } from "@/lib/rough";
// import { useRough } from "@/hooks/use-rough";

// export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
//   autoGrow?: boolean;
//   error?: string;
//   label?: string;
//   theme?: CrumbleTheme;
// }

// export function Textarea({
//   autoGrow = false,
//   className,
//   error,
//   id,
//   label,
//   onBlur,
//   onChange,
//   onFocus,
//   theme: themeProp,
//   ...props
// }: TextareaProps) {
//   const [focused, setFocused] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const svgRef = useRef<SVGSVGElement>(null);
//   const textareaId =
//     id ?? `textarea-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;

//   const { drawRect, theme } = useRough({
//     stableId: textareaId,
//     svgRef,
//     theme: themeProp,
//     variant: "border",
//   });

//   const draw = useCallback(() => {
//     const svg = svgRef.current;
//     const wrapper = wrapperRef.current;
//     if (!svg || !wrapper) return;

//     svg.replaceChildren();

//     const width = wrapper.offsetWidth;
//     const height = wrapper.offsetHeight;
//     svg.setAttribute("width", String(width));
//     svg.setAttribute("height", String(height));
//     svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

//     const stroke = error
//       ? "color-mix(in srgb, currentColor 10%, red)"
//       : focused
//         ? "currentColor"
//         : "color-mix(in srgb, currentColor 40%, transparent)";

//     const node = drawRect(1, 1, width - 2, height - 2, {
//       fill: "none",
//       stroke,
//     });

//     if (node) svg.appendChild(node);
//   }, [drawRect, error, focused, theme]);

//   useEffect(() => {
//     draw();
//   }, [draw, focused, theme]);

//   // ResizeObserver covers manual resize (non-autoGrow) and window resize
//   useEffect(() => {
//     const wrapper = wrapperRef.current;
//     if (!wrapper) return;
//     const observer = new ResizeObserver(() => draw());
//     observer.observe(wrapper);
//     return () => observer.disconnect();
//   }, [draw]);

//   const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
//     if (autoGrow && textareaRef.current && wrapperRef.current) {
//       // Reset to auto so scrollHeight reflects actual content height
//       textareaRef.current.style.height = "auto";
//       const next = textareaRef.current.scrollHeight;
//       textareaRef.current.style.height = `${next}px`;
//       // Drive wrapper height so SVG border tracks the textarea
//       wrapperRef.current.style.height = `${next}px`;
//       // draw() fires via ResizeObserver, but call directly for instant response
//       draw();
//     }
//     onChange?.(event);
//   };

//   return (
//     <div className={cn("flex flex-col gap-1.5", className)}>
//       {label ? (
//         <label
//           htmlFor={textareaId}
//           className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
//         >
//           {label}
//         </label>
//       ) : null}

//       {autoGrow ? (
//         // autoGrow layout: textarea is IN FLOW, wrapper wraps around it
//         // SVG is absolute and sized to match wrapper via ResizeObserver
//         <div ref={wrapperRef} className="relative min-h-24">
//           <svg
//             ref={svgRef}
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 overflow-visible"
//           />
//           <textarea
//             ref={textareaRef}
//             id={textareaId}
//             rows={3}
//             onBlur={(e) => {
//               setFocused(false);
//               onBlur?.(e);
//             }}
//             onChange={handleChange}
//             onFocus={(e) => {
//               setFocused(true);
//               onFocus?.(e);
//             }}
//             className="w-full resize-none border-none bg-transparent px-3 py-2.5 font-[inherit] text-sm text-foreground outline-none"
//             style={{ display: "block" }}
//             {...props}
//           />
//         </div>
//       ) : (
//         // Fixed/manual-resize layout: textarea is absolute inset-0
//         // wrapper height is fixed (min-h-24) or set by user drag via resize handle
//         <div ref={wrapperRef} className="relative min-h-24">
//           <svg
//             ref={svgRef}
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
//           />
//           <textarea
//             ref={textareaRef}
//             id={textareaId}
//             onBlur={(e) => {
//               setFocused(false);
//               onBlur?.(e);
//             }}
//             onChange={handleChange}
//             onFocus={(e) => {
//               setFocused(true);
//               onFocus?.(e);
//             }}
//             className="absolute inset-0 h-full w-full resize-y border-none bg-transparent px-3 py-2.5 font-[inherit] text-sm text-foreground outline-none"
//             {...props}
//           />
//         </div>
//       )}

//       {error ? <span className="text-xs text-destructive">{error}</span> : null}
//     </div>
//   );
// }

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { type CrumbleTheme } from "@/lib/rough";
import { useRough } from "@/hooks/use-rough";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoGrow?: boolean;
  error?: string;
  label?: string;
  theme?: CrumbleTheme;
}

export function Textarea({
  autoGrow = false,
  className,
  error,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  theme: themeProp,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textareaId =
    id ?? `textarea-${label?.toLowerCase().replace(/\s+/g, "-") ?? "field"}`;

  const { drawRect, theme } = useRough({
    stableId: textareaId,
    svgRef,
    theme: themeProp,
    variant: "border",
  });

  const draw = useCallback(() => {
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    svg.replaceChildren();

    const width = wrapper.offsetWidth;
    const height = wrapper.offsetHeight;
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const stroke = error
      ? "color-mix(in srgb, currentColor 10%, red)"
      : focused
        ? "currentColor"
        : "color-mix(in srgb, currentColor 40%, transparent)";

    const node = drawRect(1, 1, width - 2, height - 2, {
      fill: "none",
      stroke,
    });

    if (node) svg.appendChild(node);
  }, [drawRect, error, focused, theme]);

  useEffect(() => {
    draw();
  }, [draw, focused, theme]);

  // autoGrow: observe wrapper (textarea is in-flow, wrapper grows with it)
  // manual resize: observe the textarea itself — it grows when dragged but is
  // absolutely positioned so the wrapper won't grow on its own. Sync wrapper
  // height to textarea height so draw() reads the correct dimensions.
  useEffect(() => {
    const target = autoGrow ? wrapperRef.current : textareaRef.current;
    if (!target) return;

    const observer = new ResizeObserver(() => {
      if (!autoGrow && textareaRef.current && wrapperRef.current) {
        // Sync wrapper to textarea so draw() reads the right height
        wrapperRef.current.style.height = `${textareaRef.current.offsetHeight}px`;
      }
      draw();
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [autoGrow, draw]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (autoGrow && textareaRef.current && wrapperRef.current) {
      // Reset to auto so scrollHeight reflects actual content height
      textareaRef.current.style.height = "auto";
      const next = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${next}px`;
      // Drive wrapper height so SVG border tracks the textarea
      wrapperRef.current.style.height = `${next}px`;
      // draw() fires via ResizeObserver, but call directly for instant response
      draw();
    }
    onChange?.(event);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
      ) : null}

      {autoGrow ? (
        // autoGrow layout: textarea is IN FLOW, wrapper wraps around it
        // SVG is absolute and sized to match wrapper via ResizeObserver
        <div ref={wrapperRef} className="relative min-h-24">
          <svg
            ref={svgRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-visible"
          />
          <textarea
            ref={textareaRef}
            id={textareaId}
            rows={3}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            className="w-full resize-none border-none bg-transparent px-3 py-2.5 font-[inherit] text-sm text-foreground outline-none"
            style={{ display: "block" }}
            {...props}
          />
        </div>
      ) : (
        // Fixed/manual-resize layout: textarea is absolute inset-0
        // wrapper height is fixed (min-h-24) or set by user drag via resize handle
        <div ref={wrapperRef} className="relative min-h-24">
          <svg
            ref={svgRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          />
          <textarea
            ref={textareaRef}
            id={textareaId}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            className="absolute inset-0 h-full w-full resize-y border-none bg-transparent px-3 py-2.5 font-[inherit] text-sm text-foreground outline-none"
            {...props}
          />
        </div>
      )}

      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
