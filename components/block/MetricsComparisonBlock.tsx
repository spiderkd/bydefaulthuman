"use client";

import { Card } from "@/registry/new-york/ui/card";
import { LineChart } from "@/registry/new-york/ui/line-chart";
import { PieChart } from "@/registry/new-york/ui/pie-chart";
import { StatCard } from "@/registry/new-york/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export interface DashboardStat {
  description?: string;
  label: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  value: string;
}

export interface LineSeries {
  color?: string;
  data: number[];
  id: string;
  label: string;
}

export interface PieSlice {
  color?: string;
  label: string;
  value: number;
}

export interface MetricsComparisonBlockProps {
  lineLabels?: string[];
  lineSeries?: LineSeries[];
  pieData?: PieSlice[];
  stats?: DashboardStat[];
  tab1Label?: string;
  tab2Label?: string;
  title?: string;
}

const DEFAULT_STATS: DashboardStat[] = [
  {
    label: "Revenue",
    value: "$84k",
    trend: "up",
    trendLabel: "+11%",
    description: "month over month",
  },
  {
    label: "Costs",
    value: "$29k",
    trend: "down",
    trendLabel: "-4%",
    description: "month over month",
  },
  {
    label: "Conversion",
    value: "6.8%",
    trend: "up",
    trendLabel: "+0.9%",
    description: "vs prior period",
  },
  {
    label: "Bounce",
    value: "18%",
    trend: "flat",
    trendLabel: "stable",
    description: "vs prior period",
  },
];

const DEFAULT_LINE_SERIES: LineSeries[] = [
  {
    id: "revenue",
    label: "Revenue",
    data: [24, 29, 31, 39, 41, 48, 55, 63],
    color: "oklch(0.62 0.18 55)",
  },
  {
    id: "cost",
    label: "Cost",
    data: [18, 19, 21, 24, 22, 23, 25, 29],
    color: "oklch(0.55 0.18 260)",
  },
];

const DEFAULT_LINE_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const DEFAULT_PIE_DATA: PieSlice[] = [
  { label: "Organic", value: 38, color: "oklch(0.62 0.18 55)" },
  { label: "Referral", value: 24, color: "oklch(0.62 0.16 145)" },
  { label: "Direct", value: 21, color: "oklch(0.55 0.18 260)" },
  { label: "Paid", value: 17, color: "oklch(0.63 0.22 25)" },
];

export function MetricsComparisonBlock({
  lineLabels = DEFAULT_LINE_LABELS,
  lineSeries = DEFAULT_LINE_SERIES,
  pieData = DEFAULT_PIE_DATA,
  stats = DEFAULT_STATS,
  tab1Label = "Revenue vs Cost",
  tab2Label = "Traffic sources",
  title = "Metrics comparison",
}: MetricsComparisonBlockProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            description={stat.description}
            label={stat.label}
            trend={stat.trend}
            trendLabel={stat.trendLabel}
            value={stat.value}
          />
        ))}
      </div>

      <Card padding={20} style={{ overflow: "visible" }}>
        <div className="mb-4">
          <p className="text-sm font-semibold">{title}</p>
        </div>
        <Tabs defaultValue="line">
          <TabsList>
            <TabsTrigger value="line">{tab1Label}</TabsTrigger>
            <TabsTrigger value="pie">{tab2Label}</TabsTrigger>
          </TabsList>
          <TabsContent value="line">
            <LineChart height={280} labels={lineLabels} series={lineSeries} />
          </TabsContent>
          <TabsContent value="pie">
            <PieChart data={pieData} donut height={320} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
