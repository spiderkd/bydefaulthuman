"use client";

import Link from "next/link";
import { Card } from "@/registry/new-york/ui/card";
import { StatCard } from "@/registry/new-york/ui/stat-card";
import { StickyNote } from "@/registry/new-york/ui/sticky-note";
import { Sparkline } from "@/registry/new-york/ui/sparkline";
import { BarChart } from "@/registry/new-york/ui/bar-chart";
import { LineChart } from "@/registry/new-york/ui/line-chart";
import { PieChart } from "@/registry/new-york/ui/pie-chart";

// ─── data ─────────────────────────────────────────────────────────────────────

const barData = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 55 },
  { label: "Thu", value: 91 },
  { label: "Fri", value: 73 },
  { label: "Sat", value: 38 },
];

const lineSeries = [
  {
    id: "rev",
    label: "Revenue",
    color: "oklch(0.62 0.18 55)",
    data: [12, 28, 22, 45, 38, 60, 52, 71],
  },
  {
    id: "usr",
    label: "Users",
    color: "oklch(0.55 0.18 260)",
    data: [8, 15, 30, 25, 42, 35, 58, 65],
  },
];
const lineLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const pieData = [
  { label: "Direct", value: 38, color: "oklch(0.62 0.18 55)" },
  { label: "Organic", value: 27, color: "oklch(0.55 0.18 260)" },
  { label: "Referral", value: 21, color: "oklch(0.60 0.16 145)" },
  { label: "Social", value: 14, color: "oklch(0.63 0.22 25)" },
];

const sparkRows = [
  {
    label: "Revenue",
    data: [18, 22, 19, 30, 28, 35, 32, 42, 38, 50],
    color: "oklch(0.62 0.18 55)",
    type: "area" as const,
    last: "50",
  },
  {
    label: "Users",
    data: [120, 135, 128, 160, 155, 172, 168, 190],
    color: "oklch(0.55 0.18 260)",
    type: "line" as const,
    last: "190",
  },
  {
    label: "Churn",
    data: [4.2, 3.8, 4.5, 3.2, 2.9, 3.1, 2.7, 2.4],
    color: "oklch(0.63 0.22 25)",
    type: "bar" as const,
    last: "2.4",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function Label({ children }: { children: string }) {
  return (
    <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
      {children}
    </p>
  );
}

function Cell({
  children,
  href,
  className = "",
  cardClassName = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  cardClassName?: string;
}) {
  return (
    <div className={`group relative ${className}`}>
      <Card
        padding={20}
        className={`h-full w-full   ${cardClassName}`}
        style={{ overflow: "visible" }}
      >
        {children}
      </Card>
      <Link
        href={href}
        className="pointer-events-none absolute bottom-3 right-3 z-10 rounded border border-border/50 bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
      >
        docs →
      </Link>
    </div>
  );
}

// ─── StatCards container — shares the Cell hover pill pattern ─────────────────

function StatCardsCell() {
  return (
    <div className="group relative col-span-1 md:col-span-2">
      <div className="flex h-full flex-col gap-5 rounded-sm border border-border/30 p-5">
        {/* <Label>stat cards</Label> */}
        <StatCard
          label="Revenue"
          value="$48,200"
          trend="up"
          trendLabel="+12.5% this month"
          theme="pencil"
          id="stat-rev"
          className="w-full"
        />
        <StatCard
          label="Active users"
          value="3,841"
          trend="up"
          trendLabel="+8.1% vs last week"
          theme="pencil"
          id="stat-usr"
          className="w-full"
        />
        <StatCard
          label="Churn rate"
          value="2.4%"
          trend="down"
          trendLabel="−0.3% improvement"
          theme="pencil"
          id="stat-churn"
          className="w-full"
        />
      </div>
      <Link
        href="/docs/components/stat-card"
        className="pointer-events-none absolute bottom-3 right-3 z-10 rounded border border-border/50 bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
      >
        docs →
      </Link>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════

export function BentoGrid() {
  return (
    /*
     * Breakpoint strategy:
     *   mobile  (< sm)  → 1 column  — every cell stacks full-width
     *   tablet  (sm–lg) → 2 columns — charts pair up, stat cards span full
     *   desktop (≥ lg)  → 3 columns — original layout
     *
     * We use Tailwind's grid-cols-* classes so the browser handles everything.
     * The `col-span-*` on individual cells controls spanning at each breakpoint.
     */
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {/* ── Row 1: charts ─────────────────────────────────────────────────── */}

      {/* Bar chart: full width on mobile, 1 col on sm+, 1 col on lg */}
      <Cell
        href="/docs/components/bar-chart"
        className="flex items-center justify-center"
      >
        <Label>bar chart</Label>
        <BarChart
          data={barData}
          height={220}
          theme="pencil"
          animateOnMount
          showValues
          id="bento-bar"
        />
      </Cell>

      {/* Line chart: full width on mobile, 1 col on sm+, 1 col on lg */}
      <Cell
        href="/docs/components/line-chart"
        className="flex items-center justify-center"
      >
        <Label>line chart</Label>
        <LineChart
          series={lineSeries}
          labels={lineLabels}
          height={220}
          theme="pencil"
          animateOnMount
          showDots
          id="bento-line"
        />
      </Cell>

      {/* Pie chart: full width on mobile, spans both cols on sm (so it's
          centred below the pair above), back to 1 col on lg */}
      <Cell
        href="/docs/components/pie-chart"
        className="sm:col-span-2 lg:col-span-1 flex items-center justify-center"
      >
        <Label>pie chart</Label>
        <PieChart
          data={pieData}
          height={220}
          theme="pencil"
          animateOnMount
          donut
          showLegend
          id="bento-pie"
        />
      </Cell>

      {/* ── Row 2: data display ───────────────────────────────────────────── */}

      {/*
        Stat cards:
          mobile → full width (col-span-1, grid is 1-col so it fills)
          sm     → col-span-2 (fills the 2-col grid)
          lg     → col-span-2 (fills 2 of 3 cols, sparklines take the 3rd)
      */}
      <StatCardsCell />

      {/* Sparklines: full width on mobile, 1 col on sm+, 1 col on lg */}
      <Cell
        href="/docs/components/sparkline"
        cardClassName="px-10 py-12"
        className="flex  items-center justify-center"
      >
        <Label>sparklines</Label>
        <div className="w-full">
          {sparkRows.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="w-14 shrink-0 text-[12px] text-muted-foreground">
                {s.label}
              </span>
              <div className="flex-1">
                <Sparkline
                  data={s.data}
                  color={s.color}
                  type={s.type}
                  width={120}
                  height={34}
                  theme="pencil"
                  id={`spark-${s.label}`}
                  animateOnMount
                  className="w-full"
                />
              </div>
              <span className="w-8 shrink-0 text-right text-[12px] tabular-nums text-foreground">
                {s.last}
              </span>
            </div>
          ))}
        </div>
      </Cell>

      {/* ── Row 3: cards + sticky + distribution ─────────────────────────── */}

      {/* Stacked cards: full width on mobile, 1 col on sm+, 1 col on lg */}
      <Cell
        href="/docs/components/card"
        cardClassName="p-2"
        className="flex items-center justify-center"
      >
        <Label>card · stacked paper</Label>
        <div className="flex w-full flex-col gap-8 py-2">
          <Card stacked padding={16} className="w-full">
            <p className="text-[13px] font-medium">Q2 roadmap</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
              Finalise component API, ship docs site, open beta.
            </p>
          </Card>
          <Card stacked padding={16} className="w-full">
            <p className="text-[13px] font-medium">Design review</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
              Walk through new specs with the team on Thursday.
            </p>
          </Card>
        </div>
      </Cell>

      {/* Sticky notes: full width on mobile, 1 col on sm+, 1 col on lg */}
      <Cell
        href="/docs/components/sticky-note"
        className="flex items-center justify-center"
      >
        <Label>sticky notes</Label>
        <div className="grid w-full grid-cols-2 gap-3">
          <StickyNote
            color="yellow"
            title="Ship it"
            theme="pencil"
            id="sticky-a"
            rotate={-2}
            className="w-full"
          >
            Launch v0.1 by end of sprint
          </StickyNote>
          <StickyNote
            color="pink"
            title="Bug"
            theme="pencil"
            id="sticky-b"
            rotate={1.5}
            className="w-full"
          >
            SVG clips on resize
          </StickyNote>
          <StickyNote
            color="blue"
            title="Idea"
            theme="pencil"
            id="sticky-c"
            rotate={-1}
            className="w-full"
          >
            Theme playground in docs
          </StickyNote>
          <StickyNote
            color="green"
            title="Done ✓"
            theme="pencil"
            id="sticky-d"
            rotate={2}
            className="w-full"
          >
            Rough.js primitives shipped
          </StickyNote>
        </div>
      </Cell>

      {/* Distribution pie: full width on mobile, spans 2 cols on sm
          (fills the row neatly), 1 col on lg */}
      <Cell
        href="/docs/components/pie-chart"
        cardClassName="p-2 py-4"
        className="flex items-center justify-center sm:col-span-2 lg:col-span-1"
      >
        <Label>distribution</Label>
        <PieChart
          data={[
            { label: "Components", value: 45, color: "oklch(0.55 0.18 260)" },
            { label: "Primitives", value: 25, color: "oklch(0.62 0.16 145)" },
            { label: "Charts", value: 20, color: "oklch(0.62 0.18 55)" },
            { label: "Utils", value: 10, color: "oklch(0.60 0.16 300)" },
          ]}
          height={220}
          theme="pencil"
          animateOnMount
          donut={false}
          showLegend
          id="bento-pie-2"
        />
      </Cell>
    </div>
  );
}
