// "use client";

// import { useState } from "react";
// import {
//   Drawer,
//   DrawerBody,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/registry/new-york/ui/drawer";
// import { Button } from "@/registry/new-york/ui/button";
// import type { DrawerSide } from "@/registry/new-york/ui/drawer";
// import type { CrumbleTheme } from "@/lib/rough";

// // ---------- RightDrawerDemo ----------

// export function RightDrawerDemo({ theme }: { theme?: CrumbleTheme }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <Button theme={theme} onClick={() => setOpen(true)}>
//         Open drawer
//       </Button>
//       <Drawer open={open} onOpenChange={setOpen} side="right" theme={theme}>
//         <DrawerContent>
//           <DrawerHeader>
//             <DrawerTitle>Settings</DrawerTitle>
//             <DrawerDescription>Adjust your preferences.</DrawerDescription>
//           </DrawerHeader>
//           <DrawerBody>
//             <p className="text-sm text-muted-foreground">
//               Your content goes here. The drawer slides in from the right.
//             </p>
//           </DrawerBody>
//           <DrawerFooter>
//             <Button
//               variant="ghost"
//               theme={theme}
//               onClick={() => setOpen(false)}
//             >
//               Close
//             </Button>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// }

// // ---------- LeftDrawerDemo ----------

// export function LeftDrawerDemo({ theme }: { theme?: CrumbleTheme }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <Button theme={theme} onClick={() => setOpen(true)}>
//         Open left drawer
//       </Button>
//       <Drawer open={open} onOpenChange={setOpen} side="left" theme={theme}>
//         <DrawerContent>
//           <DrawerHeader>
//             <DrawerTitle>Navigation</DrawerTitle>
//             <DrawerDescription>Main menu</DrawerDescription>
//           </DrawerHeader>
//           <DrawerBody>
//             <div className="flex flex-col">
//               {["Dashboard", "Projects", "Settings", "Help"].map((item) => (
//                 <div
//                   key={item}
//                   onClick={() => setOpen(false)}
//                   className="py-3 border-b border-border text-sm font-medium cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
//                 >
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// }

// // ---------- DrawerSidesDemo ----------

// export function DrawerSidesDemo({ theme }: { theme?: CrumbleTheme }) {
//   const [side, setSide] = useState<DrawerSide | null>(null);
//   return (
//     <div className="flex flex-wrap gap-3">
//       {(["left", "right", "top", "bottom"] as const).map((s) => (
//         <Button key={s} size="sm" theme={theme} onClick={() => setSide(s)}>
//           {s}
//         </Button>
//       ))}
//       <Drawer
//         open={side !== null}
//         onOpenChange={(o) => !o && setSide(null)}
//         side={side ?? "right"}
//         theme={theme}
//       >
//         <DrawerContent
//           size={side === "top" || side === "bottom" ? "200px" : "320px"}
//         >
//           <DrawerHeader>
//             <DrawerTitle>Side: {side}</DrawerTitle>
//             <DrawerDescription>Slides in from the {side}.</DrawerDescription>
//           </DrawerHeader>
//           <DrawerBody>
//             <p className="text-sm text-muted-foreground">Content area.</p>
//           </DrawerBody>
//           <DrawerFooter>
//             <Button size="sm" theme={theme} onClick={() => setSide(null)}>
//               Close
//             </Button>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </div>
//   );
// }

// // ---------- DrawerThemesDemo ----------

// export function DrawerThemesDemo() {
//   const [openTheme, setOpenTheme] = useState<CrumbleTheme | null>(null);
//   return (
//     <div className="flex flex-wrap gap-3">
//       {(["pencil", "ink", "crayon"] as const).map((t) => (
//         <Button key={t} size="sm" theme={t} onClick={() => setOpenTheme(t)}>
//           {t}
//         </Button>
//       ))}
//       <Drawer
//         open={openTheme !== null}
//         onOpenChange={(o) => !o && setOpenTheme(null)}
//         theme={openTheme ?? "pencil"}
//       >
//         <DrawerContent>
//           <DrawerHeader>
//             <DrawerTitle>Theme: {openTheme}</DrawerTitle>
//             <DrawerDescription>
//               Rough edge drawn in {openTheme} style.
//             </DrawerDescription>
//           </DrawerHeader>
//           <DrawerBody>
//             <p className="text-sm text-muted-foreground">Content area.</p>
//           </DrawerBody>
//           <DrawerFooter>
//             <Button
//               size="sm"
//               theme={openTheme ?? "pencil"}
//               onClick={() => setOpenTheme(null)}
//             >
//               Close
//             </Button>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/registry/new-york/ui/drawer";
import { Button } from "@/registry/new-york/ui/button";
import type { DrawerSide } from "@/registry/new-york/ui/drawer";
import type { CrumbleTheme } from "@/lib/rough";

export function DrawerDemo({ theme }: { theme?: CrumbleTheme }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button theme={theme} onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onOpenChange={setOpen} theme={theme}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>Adjust your preferences.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              Your content goes here. The drawer slides in from the right.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="ghost"
              theme={theme}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function DrawerSidesDemo({ theme }: { theme?: CrumbleTheme }) {
  const [side, setSide] = useState<DrawerSide | null>(null);
  return (
    <div className="flex flex-wrap gap-3">
      {(["left", "right", "top", "bottom"] as const).map((s) => (
        <Button key={s} size="sm" theme={theme} onClick={() => setSide(s)}>
          {s}
        </Button>
      ))}
      <Drawer
        open={side !== null}
        onOpenChange={(o) => !o && setSide(null)}
        side={side ?? "right"}
        theme={theme}
      >
        <DrawerContent
          size={side === "top" || side === "bottom" ? "200px" : "320px"}
        >
          <DrawerHeader>
            <DrawerTitle>Side: {side}</DrawerTitle>
            <DrawerDescription>Slides in from the {side}.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">Content area.</p>
          </DrawerBody>
          <DrawerFooter>
            <Button size="sm" theme={theme} onClick={() => setSide(null)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
