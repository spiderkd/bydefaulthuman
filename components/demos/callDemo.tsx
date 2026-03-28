// // "use client";

// // import { useRef, useState, useEffect } from "react";
// // import { CalloutArrow } from "@/registry/new-york/ui/callout-arrow";

// // interface CalloutDemoProps {
// //   curvature?: number;
// //   label?: string;
// //   color?: string;
// // }

// // export function CalloutDemo({
// //   curvature = 80,
// //   label = "Check this out",
// //   color,
// // }: CalloutDemoProps) {
// //   const fromRef = useRef<HTMLDivElement>(null);
// //   const toRef = useRef<HTMLDivElement>(null);
// //   const [isMounted, setIsMounted] = useState(false);

// //   // We wait for mount to ensure refs are assigned to DOM elements
// //   // and to avoid hydration mismatch in SSR environments.
// //   useEffect(() => {
// //     setIsMounted(true);
// //   }, []);

// //   return (
// //     <div className="flex flex-col items-center gap-16 py-10 w-full relative">
// //       <div
// //         ref={fromRef}
// //         className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
// //       >
// //         Annotation Start
// //       </div>

// //       <div
// //         ref={toRef}
// //         className="rounded-lg border-2 border-dashed p-6 px-10 bg-card/50 backdrop-blur-sm"
// //       >
// //         Main Content Area
// //       </div>

// //       {isMounted && (
// //         <CalloutArrow
// //           fromRef={fromRef}
// //           toRef={toRef}
// //           label={label}
// //           curvature={curvature}
// //           color={color}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useRef, useState, useEffect } from "react";
// import { CalloutArrow } from "@/registry/new-york/ui/callout-arrow";

// interface CalloutDemoProps {
//   curvature?: number;
//   label?: string;
//   color?: string;
// }

// export function CalloutDemo({
//   curvature = 80,
//   label = "Check this out",
//   color,
// }: CalloutDemoProps) {
//   const fromRef = useRef<HTMLDivElement>(null);
//   const toRef = useRef<HTMLDivElement>(null);
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   return (
//     // position: relative is required so that the absolute-positioned SVG
//     // is anchored to this container rather than the document root
//     <div className="relative flex flex-col items-center gap-16 py-10 w-full">
//       <div
//         ref={fromRef}
//         className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//       >
//         Annotation Start
//       </div>

//       <div
//         ref={toRef}
//         className="rounded-lg border-2 border-dashed p-6 px-10 bg-card/50 backdrop-blur-sm"
//       >
//         Main Content Area
//       </div>

//       {isMounted && (
//         <CalloutArrow
//           fromRef={fromRef}
//           toRef={toRef}
//           label={label}
//           curvature={curvature}
//           color={color}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useRef, useState, useEffect } from "react";
import { CalloutArrow } from "@/registry/new-york/ui/callout-arrow";

interface CalloutDemoProps {
  curvature?: number;
  label?: string;
  color?: string;
  duration?: number;
}

export function CalloutDemo({
  curvature = 80,
  label = "Check this out",
  duration,
  color,
}: CalloutDemoProps) {
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    // No special positioning needed here anymore —
    // CalloutArrow finds the common ancestor itself and
    // sets position: relative on it if needed
    <div className="flex flex-col items-center gap-16 py-10 w-full">
      <div
        ref={fromRef}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Annotation Start
      </div>

      <div
        ref={toRef}
        className="rounded-lg border-2 border-dashed p-6 px-10 bg-card/50 backdrop-blur-sm"
      >
        Main Content Area
      </div>

      {isMounted && (
        <CalloutArrow
          fromRef={fromRef}
          duration={duration}
          toRef={toRef}
          label={label}
          curvature={curvature}
          color={color}
        />
      )}
    </div>
  );
}
