// "use client";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import rough from "roughjs";
// import type { PageTree } from "fumadocs-core/server";
// import { getRoughOptions, stableSeed, randomSeed } from "@/lib/rough";
// import { useCrumble } from "@/lib/crumble-context";
// import { cn } from "@/lib/utils";

// // ─── Rough vertical border on left edge of sidebar ───────────────────────────

// function SidebarBorder() {
//   const { theme } = useCrumble();
//   const svgRef = useRef<SVGSVGElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const draw = useCallback(() => {
//     const svg = svgRef.current;
//     const container = containerRef.current;
//     if (!svg || !container) return;
//     const h = container.offsetHeight;
//     svg.replaceChildren();
//     svg.setAttribute("width", "8");
//     svg.setAttribute("height", String(h));
//     svg.setAttribute("viewBox", `0 0 8 ${h}`);
//     const rc = rough.svg(svg);
//     svg.appendChild(
//       rc.line(
//         4,
//         0,
//         4,
//         h,
//         getRoughOptions(theme, "border", {
//           seed: stableSeed("sidebar-border"),
//           stroke: "currentColor",
//           strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.2 : 0.9,
//         }),
//       ),
//     );
//   }, [theme]);

//   useEffect(() => {
//     const id = requestAnimationFrame(() => draw());
//     return () => cancelAnimationFrame(id);
//   }, [draw]);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     const ro = new ResizeObserver(() => draw());
//     ro.observe(container);
//     return () => ro.disconnect();
//   }, [draw]);

//   return (
//     <div ref={containerRef} className="absolute right-0 top-0 bottom-0 w-2">
//       <svg
//         ref={svgRef}
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 overflow-visible opacity-20"
//       />
//     </div>
//   );
// }

// // ─── Section heading with a rough underline ───────────────────────────────────

// function SectionHeading({ label }: { label: string }) {
//   const { theme } = useCrumble();
//   const svgRef = useRef<SVGSVGElement>(null);
//   const spanRef = useRef<HTMLSpanElement>(null);

//   const draw = useCallback(() => {
//     const svg = svgRef.current;
//     const span = spanRef.current;
//     if (!svg || !span) return;
//     const w = span.offsetWidth + 8;
//     svg.replaceChildren();
//     svg.setAttribute("width", String(w));
//     svg.setAttribute("height", "6");
//     svg.setAttribute("viewBox", `0 0 ${w} 6`);
//     const rc = rough.svg(svg);
//     svg.appendChild(
//       rc.line(
//         0,
//         3,
//         w,
//         3,
//         getRoughOptions(theme, "border", {
//           seed: stableSeed(`section-${label}`),
//           stroke: "currentColor",
//           strokeWidth: 0.7,
//         }),
//       ),
//     );
//   }, [label, theme]);

//   useEffect(() => {
//     const id = requestAnimationFrame(() => draw());
//     return () => cancelAnimationFrame(id);
//   }, [draw]);

//   return (
//     <div className="mb-2 mt-6 flex flex-col gap-0.5 px-3 first:mt-2">
//       <span
//         ref={spanRef}
//         className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-muted-foreground"
//       >
//         {label}
//       </span>
//       <svg
//         ref={svgRef}
//         aria-hidden="true"
//         className="overflow-visible opacity-40"
//       />
//     </div>
//   );
// }

// // ─── Single nav item with rough active indicator ──────────────────────────────

// function NavItem({
//   href,
//   label,
//   active,
//   depth = 0,
// }: {
//   href: string;
//   label: string;
//   active: boolean;
//   depth?: number;
// }) {
//   const { theme } = useCrumble();
//   const pillRef = useRef<HTMLAnchorElement>(null);
//   const svgRef = useRef<SVGSVGElement>(null);

//   const draw = useCallback(
//     (reseed = false) => {
//       const svg = svgRef.current;
//       const pill = pillRef.current;
//       if (!svg || !pill) return;

//       svg.replaceChildren();
//       const w = pill.offsetWidth;
//       const h = pill.offsetHeight;
//       svg.setAttribute("width", String(w));
//       svg.setAttribute("height", String(h));
//       svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

//       if (!active) return;

//       const rc = rough.svg(svg);
//       // Active: rough rectangle background
//       svg.appendChild(
//         rc.rectangle(
//           1,
//           1,
//           w - 2,
//           h - 2,
//           getRoughOptions(theme, "border", {
//             fill: "currentColor",
//             fillStyle: theme === "ink" ? "solid" : "hachure",
//             fillWeight: theme === "pencil" ? 0.4 : 0.7,
//             hachureGap: theme === "pencil" ? 5 : 3,
//             seed: reseed ? randomSeed() : stableSeed(`nav-item-${label}`),
//             stroke: "currentColor",
//             strokeWidth: theme === "crayon" ? 1.8 : theme === "ink" ? 1.2 : 0.9,
//           }),
//         ),
//       );
//     },
//     [active, label, theme],
//   );

//   useEffect(() => {
//     const id = requestAnimationFrame(() => draw());
//     return () => cancelAnimationFrame(id);
//   }, [draw]);

//   useEffect(() => {
//     const pill = pillRef.current;
//     if (!pill) return;
//     const ro = new ResizeObserver(() => draw());
//     ro.observe(pill);
//     return () => ro.disconnect();
//   }, [draw]);

//   return (
//     <Link
//       ref={pillRef}
//       href={href}
//       className={cn(
//         "relative flex items-center rounded-sm px-3 py-1.5 text-[13px] no-underline transition-colors",
//         depth > 0 && "ml-3",
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
//       {/* Rough bg sits behind text */}
//       <svg
//         ref={svgRef}
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 overflow-visible opacity-[0.07]"
//       />
//       <span className="relative">{label}</span>
//     </Link>
//   );
// }

// // ─── Folder group with rough separator ────────────────────────────────────────

// function FolderGroup({
//   node,
//   pathname,
// }: {
//   node: PageTree.Root | PageTree.Folder;
//   pathname: string;
// }) {
//   // Determine if any child is active to auto-open
//   const hasActiveChild = (n: PageTree.Node): boolean => {
//     if (n.type === "page") return pathname === n.url;
//     if (n.type === "folder") return n.children?.some(hasActiveChild) ?? false;
//     return false;
//   };

//   const [open, setOpen] = useState(() =>
//     "children" in node ? (node.children?.some(hasActiveChild) ?? false) : true,
//   );

//   const { theme } = useCrumble();
//   const svgRef = useRef<SVGSVGElement>(null);
//   const btnRef = useRef<HTMLButtonElement>(null);

//   const drawChevron = useCallback(
//     (reseed = false) => {
//       const svg = svgRef.current;
//       if (!svg) return;
//       svg.replaceChildren();
//       svg.setAttribute("width", "12");
//       svg.setAttribute("height", "12");
//       svg.setAttribute("viewBox", "0 0 12 12");
//       const rc = rough.svg(svg);
//       const opts = getRoughOptions(theme, "border", {
//         seed: reseed
//           ? randomSeed()
//           : stableSeed(
//               `chevron-${node.type === "folder" ? node.name : "root"}`,
//             ),
//         stroke: "currentColor",
//         strokeWidth: theme === "crayon" ? 1.8 : 1.1,
//       });
//       if (open) {
//         svg.appendChild(rc.line(2, 4, 6, 8, opts));
//         svg.appendChild(
//           rc.line(6, 8, 10, 4, {
//             ...opts,
//             seed: stableSeed(
//               `chevron-r-${node.type === "folder" ? node.name : "root"}`,
//             ),
//           }),
//         );
//       } else {
//         svg.appendChild(rc.line(2, 8, 6, 4, opts));
//         svg.appendChild(
//           rc.line(6, 4, 10, 8, {
//             ...opts,
//             seed: stableSeed(
//               `chevron-r2-${node.type === "folder" ? node.name : "root"}`,
//             ),
//           }),
//         );
//       }
//     },
//     [node, open, theme],
//   );

//   useEffect(() => {
//     const id = requestAnimationFrame(() => drawChevron());
//     return () => cancelAnimationFrame(id);
//   }, [drawChevron]);

//   const isFolder = node.type === "folder";
//   const name = isFolder ? node.name : "";

//   return (
//     <div className="flex flex-col">
//       {isFolder && name ? (
//         <button
//           ref={btnRef}
//           onClick={() => setOpen((v) => !v)}
//           onMouseEnter={() => drawChevron(true)}
//           onMouseLeave={() => drawChevron(false)}
//           className="mb-0.5 flex w-full items-center justify-between px-3 py-1 text-left"
//           aria-expanded={open}
//         >
//           <SectionHeading label={name} />
//           <svg
//             ref={svgRef}
//             aria-hidden="true"
//             width="12"
//             height="12"
//             className="-mt-1 flex-shrink-0 overflow-visible opacity-50"
//           />
//         </button>
//       ) : (
//         isFolder && <SectionHeading label={name ?? ""} />
//       )}

//       {open && (
//         <div className="flex flex-col gap-0.5">
//           {("children" in node ? node.children : [])?.map((child, i) => (
//             <SidebarNode key={i} node={child} pathname={pathname} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Recursive node renderer ──────────────────────────────────────────────────

// function SidebarNode({
//   node,
//   depth = 0,
//   pathname,
// }: {
//   node: PageTree.Node;
//   depth?: number;
//   pathname: string;
// }) {
//   if (node.type === "separator") {
//     return (
//       <div className="px-3 pb-1 pt-4">
//         <SectionHeading
//           label={typeof node.name === "string" ? node.name : ""}
//         />
//       </div>
//     );
//   }

//   if (node.type === "folder") {
//     return (
//       <div className="flex flex-col">
//         {node.name ? <SectionHeading label={String(node.name)} /> : null}
//         <div className="flex flex-col gap-0.5">
//           {node.children?.map((child, i) => (
//             <SidebarNode
//               key={i}
//               node={child}
//               depth={depth + 1}
//               pathname={pathname}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // page
//   return (
//     <NavItem
//       href={node.url}
//       label={typeof node.name === "string" ? node.name : ""}
//       active={pathname === node.url}
//       depth={depth}
//     />
//   );
// }

// // ─── CrumbleSidebar ───────────────────────────────────────────────────────────

// export function CrumbleSidebar({ tree }: { tree: PageTree.Root }) {
//   const pathname = usePathname();

//   return (
//     <aside
//       className="relative flex h-full flex-col overflow-y-auto px-3 py-4"
//       style={{
//         scrollbarWidth: "thin",
//         scrollbarColor: "var(--border) transparent",
//       }}
//     >
//       {/* Hand-drawn right border */}
//       <SidebarBorder />

//       {/* Sidebar title */}
//       <div className="mb-4 px-3">
//         <span className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground">
//           docs
//         </span>
//       </div>

//       {/* Nav tree */}
//       <nav
//         aria-label="Documentation navigation"
//         className="flex flex-col gap-0.5"
//       >
//         {tree.children.map((node, i) => (
//           <SidebarNode key={i} node={node} pathname={pathname} />
//         ))}
//       </nav>
//     </aside>
//   );
// }

// Server component — no "use client" directive.
// Receives the page tree (server data) and passes it to the client inner.
import type { PageTree } from "fumadocs-core/server";
import { CrumbleSidebarInner } from "./CrumbleSidebarClien";

export function CrumbleSidebar({ tree }: { tree: PageTree.Root }) {
  return <CrumbleSidebarInner tree={tree} />;
}
