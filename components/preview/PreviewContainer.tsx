// // "use client";

// // import { useState, type ReactNode } from "react";
// // import { CrumbleProvider } from "@/lib/crumble-context";
// // import type { CrumbleTheme } from "@/lib/rough";

// // interface PreviewContainerProps {
// //   children: ReactNode;
// //   code?: string;
// //   componentName?: string;
// //   defaultTheme?: CrumbleTheme;
// // }

// // type Tab = "preview" | "code";

// // export function PreviewContainer({
// //   children,
// //   code,
// //   componentName,
// //   defaultTheme = "pencil",
// // }: PreviewContainerProps) {
// //   const [theme, setTheme] = useState<CrumbleTheme>(defaultTheme);
// //   const [tab, setTab] = useState<Tab>("preview");

// //   const installCommand = componentName
// //     ? `npx shadcn add https://crumble.dev/r/${componentName}.json`
// //     : null;

// //   return (
// //     <div className="my-6 overflow-hidden rounded-xl border border-border">
// //       <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
// //         <div className="flex gap-1">
// //           {(["preview", "code"] as Tab[]).map((value) => (
// //             <button
// //               key={value}
// //               onClick={() => setTab(value)}
// //               className={[
// //                 "rounded-md px-3 py-1 text-xs font-medium transition-colors",
// //                 tab === value
// //                   ? "bg-background text-foreground shadow-sm"
// //                   : "text-muted-foreground hover:text-foreground",
// //               ].join(" ")}
// //             >
// //               {value}
// //             </button>
// //           ))}
// //         </div>

// //         <div className="flex gap-1">
// //           {(["pencil", "ink", "crayon"] as CrumbleTheme[]).map((value) => (
// //             <button
// //               key={value}
// //               onClick={() => setTheme(value)}
// //               className={[
// //                 "rounded-full border px-2 py-0.5 text-[11px] transition-colors",
// //                 theme === value
// //                   ? "border-foreground/40 font-medium text-foreground"
// //                   : "border-transparent text-muted-foreground hover:text-foreground",
// //               ].join(" ")}
// //             >
// //               {value}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {tab === "preview" ? (
// //         <CrumbleProvider theme={theme}>
// //           <div className="flex min-h-[120px] items-center justify-center bg-background p-8">
// //             {children}
// //           </div>
// //         </CrumbleProvider>
// //       ) : (
// //         <div className="overflow-x-auto bg-muted/30 p-4">
// //           <pre className="font-mono text-sm leading-relaxed text-foreground">
// //             <code>{code ?? "// no code provided"}</code>
// //           </pre>
// //         </div>
// //       )}

// //       {installCommand ? (
// //         <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/50 px-3 py-2">
// //           <code className="font-mono text-xs text-muted-foreground">
// //             {installCommand}
// //           </code>
// //           <button
// //             onClick={() => navigator.clipboard.writeText(installCommand)}
// //             className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
// //           >
// //             copy
// //           </button>
// //         </div>
// //       ) : null}
// //     </div>
// //   );
// // }
// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";
// import rough from "roughjs";
// import { cn } from "@/lib/utils";
// import { CrumbleProvider } from "@/lib/crumble-context";
// import { getRoughOptions, randomSeed, stableSeed } from "@/lib/rough";
// import type { CrumbleTheme } from "@/lib/rough";

// interface PreviewContainerProps {
//   children: ReactNode;
//   codeBlock?: ReactNode;
//   componentName?: string;
//   defaultTheme?: CrumbleTheme;
// }

// type Tab = "preview" | "code";

// // A single tab button with a rough box drawn around it when active
// function RoughTab({
//   active,
//   label,
//   onClick,
// }: {
//   active: boolean;
//   label: string;
//   onClick: () => void;
// }) {
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const svgRef = useRef<SVGSVGElement>(null);

//   const draw = useCallback(
//     (reseed = false) => {
//       const btn = btnRef.current;
//       const svg = svgRef.current;
//       if (!btn || !svg) return;

//       svg.replaceChildren();

//       if (!active) return; // nothing drawn when inactive

//       const w = btn.offsetWidth;
//       const h = btn.offsetHeight;
//       svg.setAttribute("width", String(w));
//       svg.setAttribute("height", String(h));
//       svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

//       const rc = rough.svg(svg);
//       const node = rc.rectangle(
//         1,
//         1,
//         w - 2,
//         h - 2,
//         getRoughOptions("pencil", "border", {
//           fill: "none",
//           seed: reseed ? randomSeed() : stableSeed(`tab-${label}`),
//           stroke: "currentColor",
//           strokeWidth: 1.2,
//         }),
//       );
//       svg.appendChild(node);
//     },
//     [active, label],
//   );

//   useEffect(() => {
//     // Small delay so btn dimensions are available after layout
//     const id = requestAnimationFrame(() => draw());
//     return () => cancelAnimationFrame(id);
//   }, [draw]);

//   // Redraw if button resizes
//   useEffect(() => {
//     const btn = btnRef.current;
//     if (!btn) return;
//     const ro = new ResizeObserver(() => draw());
//     ro.observe(btn);
//     return () => ro.disconnect();
//   }, [draw]);

//   return (
//     <button
//       ref={btnRef}
//       onClick={onClick}
//       className={cn(
//         "relative rounded-md px-3 py-1 text-xs font-medium transition-colors outline-none",
//         active
//           ? "text-foreground"
//           : "text-muted-foreground hover:text-foreground",
//       )}
//       onMouseEnter={() => {
//         if (active) draw(true);
//       }}
//       onMouseLeave={() => {
//         if (active) draw(false);
//       }}
//     >
//       <svg
//         ref={svgRef}
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 overflow-visible"
//       />
//       <span className="relative">{label}</span>
//     </button>
//   );
// }

// // Theme pill button — rough underline when active
// function ThemePill({
//   active,
//   label,
//   onClick,
// }: {
//   active: boolean;
//   label: string;
//   onClick: () => void;
// }) {
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const svgRef = useRef<SVGSVGElement>(null);

//   const draw = useCallback(
//     (reseed = false) => {
//       const btn = btnRef.current;
//       const svg = svgRef.current;
//       if (!btn || !svg) return;

//       svg.replaceChildren();

//       if (!active) return;

//       const w = btn.offsetWidth;
//       const h = btn.offsetHeight;
//       svg.setAttribute("width", String(w));
//       svg.setAttribute("height", String(h));
//       svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

//       const rc = rough.svg(svg);
//       // Draw a rough underline beneath the text
//       const node = rc.line(
//         2,
//         h - 2,
//         w - 2,
//         h - 2,
//         getRoughOptions("pencil", "border", {
//           seed: reseed ? randomSeed() : stableSeed(`theme-pill-${label}`),
//           stroke: "currentColor",
//           strokeWidth: 1.5,
//         }),
//       );
//       svg.appendChild(node);
//     },
//     [active, label],
//   );

//   useEffect(() => {
//     const id = requestAnimationFrame(() => draw());
//     return () => cancelAnimationFrame(id);
//   }, [draw]);

//   useEffect(() => {
//     const btn = btnRef.current;
//     if (!btn) return;
//     const ro = new ResizeObserver(() => draw());
//     ro.observe(btn);
//     return () => ro.disconnect();
//   }, [draw]);

//   return (
//     <button
//       ref={btnRef}
//       onClick={onClick}
//       className={cn(
//         "relative px-2 py-0.5 text-[11px] transition-colors outline-none",
//         active
//           ? "font-medium text-foreground"
//           : "text-muted-foreground hover:text-foreground",
//       )}
//       onMouseEnter={() => {
//         if (active) draw(true);
//       }}
//       onMouseLeave={() => {
//         if (active) draw(false);
//       }}
//     >
//       <svg
//         ref={svgRef}
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 overflow-visible"
//       />
//       <span className="relative">{label}</span>
//     </button>
//   );
// }

// export function PreviewContainer({
//   children,
//   codeBlock,
//   componentName,
//   defaultTheme = "pencil",
// }: PreviewContainerProps) {
//   const [theme, setTheme] = useState<CrumbleTheme>(defaultTheme);
//   const [tab, setTab] = useState<Tab>("preview");
//   const [copied, setCopied] = useState(false);

//   const installCommand = componentName
//     ? `npx shadcn add https://crumble.dev/r/${componentName}.json`
//     : null;

//   const handleCopy = async () => {
//     if (!installCommand) return;
//     await navigator.clipboard.writeText(installCommand);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <div className="my-6 overflow-hidden rounded-xl border border-border">
//       {/* Toolbar */}
//       <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
//         <div className="flex gap-1">
//           {(["preview", "code"] as Tab[]).map((value) => (
//             <RoughTab
//               key={value}
//               label={value}
//               active={tab === value}
//               onClick={() => setTab(value)}
//             />
//           ))}
//         </div>

//         <div className="flex gap-1">
//           {(["pencil", "ink", "crayon"] as CrumbleTheme[]).map((value) => (
//             <ThemePill
//               key={value}
//               label={value}
//               active={theme === value}
//               onClick={() => setTheme(value)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Preview — always mounted so ResizeObserver stays active */}
//       <div className={tab === "preview" ? "block" : "hidden"}>
//         <CrumbleProvider theme={theme}>
//           <div className="flex min-h-[120px] items-center justify-center bg-background p-8">
//             {children}
//           </div>
//         </CrumbleProvider>
//       </div>

//       {/* Code */}
//       {codeBlock ? (
//         <div className={tab === "code" ? "block" : "hidden"}>{codeBlock}</div>
//       ) : null}

//       {/* Install command */}
//       {installCommand ? (
//         <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/50 px-3 py-2">
//           <code className="font-mono text-xs text-muted-foreground">
//             {installCommand}
//           </code>
//           <button
//             onClick={handleCopy}
//             className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
//           >
//             {copied ? "copied!" : "copy"}
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );
// }

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import rough from "roughjs";
import { cn } from "@/lib/utils";
import { CrumbleProvider } from "@/lib/crumble-context";
import { getRoughOptions, randomSeed, stableSeed } from "@/lib/rough";
import type { CrumbleTheme } from "@/lib/rough";

interface PreviewContainerProps {
  children: ReactNode;
  codeBlock?: ReactNode;
  componentName?: string;
  defaultTheme?: CrumbleTheme;
}

type Tab = "preview" | "code";

function RoughTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const draw = useCallback(
    (reseed = false) => {
      const btn = btnRef.current;
      const svg = svgRef.current;
      if (!btn || !svg) return;

      svg.replaceChildren();
      if (!active) return;

      const w = btn.offsetWidth;
      const h = btn.offsetHeight;
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const rc = rough.svg(svg);
      svg.appendChild(
        rc.rectangle(
          1,
          1,
          w - 2,
          h - 2,
          getRoughOptions("pencil", "border", {
            fill: "none",
            seed: reseed ? randomSeed() : stableSeed(`tab-${label}`),
            stroke: "currentColor",
            strokeWidth: 1.2,
          }),
        ),
      );
    },
    [active, label],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(id);
  }, [draw]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(btn);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={cn(
        "relative rounded-md px-3 py-1 text-xs font-medium outline-none transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
      onMouseEnter={() => {
        if (active) draw(true);
      }}
      onMouseLeave={() => {
        if (active) draw(false);
      }}
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-visible"
      />
      <span className="relative">{label}</span>
    </button>
  );
}

function ThemePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const draw = useCallback(
    (reseed = false) => {
      const btn = btnRef.current;
      const svg = svgRef.current;
      if (!btn || !svg) return;

      svg.replaceChildren();
      if (!active) return;

      const w = btn.offsetWidth;
      const h = btn.offsetHeight;
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const rc = rough.svg(svg);
      svg.appendChild(
        rc.line(
          2,
          h - 2,
          w - 2,
          h - 2,
          getRoughOptions("pencil", "border", {
            seed: reseed ? randomSeed() : stableSeed(`theme-pill-${label}`),
            stroke: "currentColor",
            strokeWidth: 1.5,
          }),
        ),
      );
    },
    [active, label],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(id);
  }, [draw]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(btn);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={cn(
        "relative px-2 py-0.5 text-[11px] outline-none transition-colors",
        active
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
      onMouseEnter={() => {
        if (active) draw(true);
      }}
      onMouseLeave={() => {
        if (active) draw(false);
      }}
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-visible"
      />
      <span className="relative">{label}</span>
    </button>
  );
}

export function PreviewContainer({
  children,
  codeBlock,
  componentName,
  defaultTheme = "pencil",
}: PreviewContainerProps) {
  const [theme, setTheme] = useState<CrumbleTheme>(defaultTheme);
  const [tab, setTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  const installCommand = componentName
    ? `npx shadcn add https://crumble.dev/r/${componentName}.json`
    : null;

  const handleCopy = async () => {
    if (!installCommand) return;
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    // No overflow-hidden here — lets dropdowns/popovers escape the container
    <div className="my-6 rounded-xl border border-border">
      {/* Toolbar — overflow-hidden to clip rounded top corners */}
      <div className="flex items-center justify-between overflow-hidden rounded-t-xl border-b border-border bg-muted/50 px-3 py-2">
        <div className="flex gap-1">
          {(["preview", "code"] as Tab[]).map((value) => (
            <RoughTab
              key={value}
              label={value}
              active={tab === value}
              onClick={() => setTab(value)}
            />
          ))}
        </div>
        <div className="flex gap-1">
          {(["pencil", "ink", "crayon"] as CrumbleTheme[]).map((value) => (
            <ThemePill
              key={value}
              label={value}
              active={theme === value}
              onClick={() => setTheme(value)}
            />
          ))}
        </div>
      </div>

      {/* Preview — overflow-hidden clips preview content to rounded corners */}
      <div className={tab === "preview" ? "block" : "hidden"}>
        <CrumbleProvider theme={theme}>
          <div className="flex min-h-[120px] items-center justify-center overflow-visible bg-background p-8">
            {children}
          </div>
        </CrumbleProvider>
      </div>

      {/* Code */}
      {codeBlock ? (
        <div
          className={cn(
            tab === "code" ? "block" : "hidden",
            "overflow-hidden rounded-b-xl",
          )}
        >
          {codeBlock}
        </div>
      ) : null}

      {/* Install command */}
      {installCommand ? (
        <div className="flex items-center justify-between gap-2 overflow-hidden rounded-b-xl border-t border-border bg-muted/50 px-3 py-2">
          <code className="font-mono text-xs text-muted-foreground">
            {installCommand}
          </code>
          <button
            onClick={handleCopy}
            className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? "copied!" : "copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
