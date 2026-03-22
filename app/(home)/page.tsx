// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { RoughHighlight } from "@/components/primitives/rough-highlight";
// import { RoughLine } from "@/components/primitives/rough-line";

// const componentPreviews = [
//   {
//     name: "Button",
//     slug: "button",
//     desc: "Wobbly border, hover redraw, three variants",
//   },
//   {
//     name: "Card",
//     slug: "card",
//     desc: "Stacked paper effect, resizes with content",
//   },
//   { name: "Input", slug: "input", desc: "Box or underline style, focus state" },
//   {
//     name: "Textarea",
//     slug: "textarea",
//     desc: "Auto-grow, rough border on focus",
//   },
//   { name: "Checkbox", slug: "checkbox", desc: "Rough tick mark, hover redraw" },
//   { name: "Radio", slug: "radio", desc: "Filled inner circle when selected" },
//   { name: "Select", slug: "select", desc: "Hand-drawn chevron indicator" },
//   { name: "Slider", slug: "slider", desc: "Sketchy track and circle thumb" },
//   { name: "Toggle", slug: "toggle", desc: "Thumb slides inside rough track" },
// ];

// export default function Page() {
//   return (
//     <main className="min-h-screen bg-background text-foreground">
//       <section className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
//         <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
//           a shadcn-style component library
//         </p>

//         <h1 className="mb-6 max-w-2xl text-[clamp(40px,7vw,72px)] leading-[1.1] font-medium">
//           UI that looks{" "}
//           <span className="font-[family-name:var(--font-display)] italic">
//             <RoughHighlight
//               type="highlight"
//               color="#fbbf24"
//               opacity={0.35}
//               animate
//             >
//               hand-drawn
//             </RoughHighlight>
//           </span>
//         </h1>

//         <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
//           Wobbly, sketchy React components built on Rough.js. One command
//           installs. You own the code.
//         </p>

//         <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
//           <Link href="/docs/getting-started/introduction">
//             <Button size="lg">Get started</Button>
//           </Link>
//           <Link href="/docs/components/button">
//             <Button size="lg" variant="ghost">
//               Browse components
//             </Button>
//           </Link>
//         </div>

//         <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary px-5 py-2.5">
//           <code className="font-mono text-[13px] text-muted-foreground">
//             npx shadcn add https://crumble.dev/r/button.json
//           </code>
//         </div>
//       </section>

//       <div className="mx-auto max-w-3xl px-6">
//         <RoughLine orientation="horizontal" />
//       </div>

//       <section className="mx-auto max-w-5xl px-6 py-20">
//         <p className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
//           what ships
//         </p>
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
//           {componentPreviews.map((item) => (
//             <Link
//               key={item.slug}
//               href={`/docs/components/${item.slug}`}
//               className="no-underline"
//             >
//               <Card padding={20} className="h-full cursor-pointer">
//                 <p className="mb-1 text-[13px] font-medium text-foreground">
//                   {item.name}
//                 </p>
//                 <p className="text-[12px] leading-relaxed text-muted-foreground">
//                   {item.desc}
//                 </p>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       </section>

//       <section className="bg-secondary/50 px-6 py-20">
//         <div className="mx-auto max-w-xl text-center">
//           <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
//             three themes
//           </p>
//           <h2 className="mb-3 text-3xl font-medium text-foreground">
//             one prop away
//           </h2>
//           <p className="mb-12 text-base leading-relaxed text-muted-foreground">
//             Switch between pencil, ink, and crayon, or set it globally once.
//           </p>
//           <div className="flex flex-wrap justify-center gap-6">
//             {(["pencil", "ink", "crayon"] as const).map((theme) => (
//               <div key={theme} className="flex flex-col items-center gap-2">
//                 <Button theme={theme} size="lg">
//                   {theme}
//                 </Button>
//                 <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
//                   {theme}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <footer className="border-t border-border/30 px-6 py-8 text-center">
//         <p className="text-[13px] text-muted-foreground">
//           crumble - hand-drawn components for React
//         </p>
//       </footer>
//     </main>
//   );
// }

"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CrumbleProvider } from "@/lib/crumble-context";
import type { CrumbleTheme } from "@/lib/rough";
import { cn } from "@/lib/utils";

// Primitives
import { RoughHighlight } from "@/components/primitives/rough-highlight";
import { RoughLine } from "@/components/primitives/rough-line";
import { RoughRect } from "@/components/primitives/rough-rect";

// UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Rating } from "@/components/ui/rating";
import { StatCard } from "@/components/ui/stat-card";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { StickyNote } from "@/components/ui/sticky-note";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BarChart } from "@/components/ui/bar-chart";
import { Annotation } from "@/components/ui/annotation";

const THEMES: CrumbleTheme[] = ["pencil", "ink", "crayon"];

// ─── Demo card wrapper ────────────────────────────────────────────────────────

function DemoCard({
  children,
  label,
  className,
  href,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  href?: string;
}) {
  const inner = (
    <Card padding={20} className={cn("h-full flex flex-col gap-3", className)}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {inner}
      </Link>
    );
  }
  return <div>{inner}</div>;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function ShowcaseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {children}
      </div>
    </section>
  );
}

// ─── Bar chart data ───────────────────────────────────────────────────────────

const chartData = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 67 },
  { label: "Wed", value: 53 },
  { label: "Thu", value: 81 },
  { label: "Fri", value: 61 },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [theme, setTheme] = useState<CrumbleTheme>("pencil");

  return (
    <CrumbleProvider theme={theme}>
      <main className="min-h-screen bg-background text-foreground">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            a shadcn-style component library
          </p>

          <h1 className="mb-6 max-w-2xl text-[clamp(40px,7vw,72px)] leading-[1.1] font-medium">
            UI that looks{" "}
            <span className="font-[family-name:var(--font-display)] italic">
              <RoughHighlight
                type="highlight"
                color="#fbbf24"
                opacity={0.35}
                animate
              >
                hand-drawn
              </RoughHighlight>
            </span>
          </h1>

          <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
            Wobbly, sketchy React components built on Rough.js. One command
            installs. You own the code.
          </p>

          {/* Global theme switcher */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              theme
            </span>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  theme={t}
                  variant={theme === t ? "default" : "ghost"}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs/getting-started/introduction">
              <Button size="lg">Get started</Button>
            </Link>
            <Link href="/docs/components/button">
              <Button size="lg" variant="ghost">
                Browse components
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary px-5 py-2.5">
            <code className="font-mono text-[13px] text-muted-foreground">
              npx shadcn add https://crumble.dev/r/button.json
            </code>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-6">
          <RoughLine orientation="horizontal" />
        </div>

        {/* ── Form controls ───────────────────────────────────────────── */}
        <ShowcaseSection title="form controls">
          <DemoCard label="Button" href="/docs/components/button">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button size="sm">Default</Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </div>
          </DemoCard>

          <DemoCard label="Input" href="/docs/components/input">
            <div className="w-full">
              <Input label="Name" placeholder="Ada Lovelace" />
            </div>
          </DemoCard>

          <DemoCard label="Checkbox" href="/docs/components/checkbox">
            <div className="flex flex-col gap-2">
              <Checkbox label="Remember me" defaultChecked />
              <Checkbox label="Send updates" />
            </div>
          </DemoCard>

          <DemoCard label="Toggle" href="/docs/components/toggle">
            <div className="flex items-center gap-3">
              <Toggle defaultChecked />
              <span className="text-sm text-muted-foreground">Enabled</span>
            </div>
          </DemoCard>

          <DemoCard label="Slider" href="/docs/components/slider">
            <div className="w-full px-2">
              <Slider defaultValue={65} />
            </div>
          </DemoCard>

          <DemoCard label="Rating" href="/docs/components/rating">
            <Rating defaultValue={3} max={5} />
          </DemoCard>
        </ShowcaseSection>

        <div className="mx-auto max-w-3xl px-6">
          <RoughLine orientation="horizontal" />
        </div>

        {/* ── Data display ────────────────────────────────────────────── */}
        <ShowcaseSection title="data display">
          <DemoCard label="Badge" href="/docs/components/badge">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge>default</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="destructive">error</Badge>
            </div>
          </DemoCard>

          <DemoCard label="Stat card" href="/docs/components/stat-card">
            <StatCard
              label="Revenue"
              value="$42.1k"
              trend="up"
              trendLabel="+12% this week"
            />
          </DemoCard>

          <DemoCard label="Avatar group" href="/docs/components/avatar">
            <AvatarGroup
              avatars={[
                { fallback: "AB" },
                { fallback: "CD" },
                { fallback: "EF" },
                { fallback: "GH" },
              ]}
              max={3}
            />
          </DemoCard>

          <DemoCard label="Progress" href="/docs/components/progress">
            <div className="flex flex-col gap-3 w-full">
              <Progress value={72} label="Design" showValue />
              <Progress value={48} label="Dev" showValue />
              <Progress value={91} label="QA" showValue />
            </div>
          </DemoCard>

          <DemoCard label="Accordion" href="/docs/components/accordion">
            <div className="w-full">
              <Accordion defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger value="item-1">
                    What is Crumble?
                  </AccordionTrigger>
                  <AccordionContent value="item-1">
                    Hand-drawn React components.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger value="item-2">
                    How do I install it?
                  </AccordionTrigger>
                  <AccordionContent value="item-2">
                    npx shadcn add crumble.dev/r/*.json
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DemoCard>

          <DemoCard label="Tabs" href="/docs/components/tabs">
            <div className="w-full">
              <Tabs defaultValue="design">
                <TabsList>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="design">
                  <p className="text-sm text-muted-foreground mt-2">
                    Design tools go here.
                  </p>
                </TabsContent>
                <TabsContent value="code">
                  <p className="text-sm text-muted-foreground mt-2">
                    Code editor here.
                  </p>
                </TabsContent>
                <TabsContent value="preview">
                  <p className="text-sm text-muted-foreground mt-2">
                    Live preview here.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </DemoCard>
        </ShowcaseSection>

        <div className="mx-auto max-w-3xl px-6">
          <RoughLine orientation="horizontal" />
        </div>

        {/* ── Charts ──────────────────────────────────────────────────── */}
        <ShowcaseSection title="charts">
          {/* Bar chart spans 2 columns */}
          <div className="col-span-full lg:col-span-2">
            <DemoCard label="Bar chart" href="/docs/components/bar-chart">
              <div className="w-full">
                <BarChart data={chartData} height={180} showGrid showValues />
              </div>
            </DemoCard>
          </div>

          <DemoCard label="Separator" href="/docs/components/separator">
            <div className="flex flex-col gap-3 w-full">
              <Separator />
              <Separator label="or" />
              <Separator orientation="horizontal" />
            </div>
          </DemoCard>

          <DemoCard label="Sticky note" href="/docs/components/sticky-note">
            <div className="flex gap-3">
              <StickyNote color="yellow" rotate={-2} className="w-24">
                <p className="text-xs">Don't forget milk 🥛</p>
              </StickyNote>
              <StickyNote color="pink" rotate={1.5} className="w-24">
                <p className="text-xs">Ship it! 🚀</p>
              </StickyNote>
            </div>
          </DemoCard>
        </ShowcaseSection>

        <div className="mx-auto max-w-3xl px-6">
          <RoughLine orientation="horizontal" />
        </div>

        {/* ── Primitives ──────────────────────────────────────────────── */}
        <ShowcaseSection title="primitives">
          <DemoCard
            label="RoughHighlight"
            href="/docs/primitives/rough-highlight"
          >
            <p className="text-base leading-loose text-center">
              Mark{" "}
              <RoughHighlight type="highlight" color="#fbbf24" opacity={0.4}>
                important
              </RoughHighlight>{" "}
              text or{" "}
              <RoughHighlight type="underline" color="currentColor">
                underline
              </RoughHighlight>{" "}
              it
            </p>
          </DemoCard>

          <DemoCard label="RoughRect" href="/docs/primitives/rough-rect">
            <RoughRect padding={16} className="w-full">
              <p className="text-sm text-center text-muted-foreground">
                Wrap any content with a sketchy border
              </p>
            </RoughRect>
          </DemoCard>

          <DemoCard label="Annotation" href="/docs/components/annotation">
            <div className="flex items-center gap-6">
              <Annotation type="circle" color="currentColor">
                <span className="text-sm font-medium">circle</span>
              </Annotation>
              <Annotation type="box" color="currentColor">
                <span className="text-sm font-medium">box</span>
              </Annotation>
            </div>
          </DemoCard>

          <DemoCard label="RoughLine" href="/docs/primitives/rough-line">
            <div className="flex flex-col gap-3 w-full">
              <RoughLine orientation="horizontal" />
              <RoughLine orientation="horizontal" />
              <RoughLine orientation="horizontal" />
            </div>
          </DemoCard>
        </ShowcaseSection>

        <div className="mx-auto max-w-3xl px-6">
          <RoughLine orientation="horizontal" />
        </div>

        {/* ── Three themes section ─────────────────────────────────────── */}
        <section className="bg-secondary/50 px-6 py-20">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              three themes
            </p>
            <h2 className="mb-3 text-3xl font-medium text-foreground">
              one prop away
            </h2>
            <p className="mb-12 text-base leading-relaxed text-muted-foreground">
              Switch between pencil, ink, and crayon — or set it globally once.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {THEMES.map((t) => (
                <div key={t} className="flex flex-col items-center gap-2">
                  <Button theme={t} size="lg" onClick={() => setTheme(t)}>
                    {t}
                  </Button>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-border/30 px-6 py-8 text-center">
          <p className="text-[13px] text-muted-foreground">
            crumble — hand-drawn components for React
          </p>
        </footer>
      </main>
    </CrumbleProvider>
  );
}
