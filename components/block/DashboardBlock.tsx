"use client";

import { Card } from "@/registry/new-york/ui/card";
import { BarChart } from "@/registry/new-york/ui/bar-chart";
import { Sparkline } from "@/registry/new-york/ui/sparkline";
import { StatCard } from "@/registry/new-york/ui/stat-card";

export interface DashboardStat {
  description?: string;
  label: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  value: string;
}

export interface SparkRow {
  color?: string;
  data: number[];
  label: string;
  last: string;
  type?: "line" | "area" | "bar";
}

export interface BarPoint {
  color?: string;
  label: string;
  value: number;
}

export interface DashboardBlockProps {
  barColor?: string;
  barData?: BarPoint[];
  barLabel?: string;
  sparkLabel?: string;
  sparkRows?: SparkRow[];
  stats?: DashboardStat[];
}

const DEFAULT_STATS: DashboardStat[] = [
  {
    label: "Revenue",
    value: "$48,200",
    trend: "up",
    trendLabel: "+12%",
    description: "vs last month",
  },
  {
    label: "Active Users",
    value: "3,840",
    trend: "up",
    trendLabel: "+7%",
    description: "vs last month",
  },
  {
    label: "Churn Rate",
    value: "2.4%",
    trend: "down",
    trendLabel: "-0.8%",
    description: "vs last month",
  },
  {
    label: "Sessions",
    value: "21.5k",
    trend: "flat",
    trendLabel: "no change",
    description: "vs last month",
  },
];

const DEFAULT_SPARK_ROWS: SparkRow[] = [
  {
    label: "Revenue",
    data: [18, 22, 19, 30, 28, 35, 32, 42, 38, 50],
    color: "oklch(0.62 0.18 55)",
    type: "area",
    last: "$50k",
  },
  {
    label: "Users",
    data: [120, 135, 128, 160, 155, 172, 168, 190],
    color: "oklch(0.55 0.18 260)",
    type: "line",
    last: "190",
  },
  {
    label: "Churn",
    data: [4.2, 3.8, 4.5, 3.2, 2.9, 3.1, 2.7, 2.4],
    color: "oklch(0.63 0.22 25)",
    type: "bar",
    last: "2.4%",
  },
];

const DEFAULT_BAR_DATA: BarPoint[] = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 55 },
  { label: "Thu", value: 91 },
  { label: "Fri", value: 73 },
  { label: "Sat", value: 38 },
];

export function DashboardBlock({
  barColor = "oklch(0.62 0.18 55)",
  barData = DEFAULT_BAR_DATA,
  barLabel = "Weekly Visitors",
  sparkLabel = "Trends",
  sparkRows = DEFAULT_SPARK_ROWS,
  stats = DEFAULT_STATS,
}: DashboardBlockProps) {
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card padding={20} style={{ overflow: "visible" }}>
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
            {sparkLabel}
          </p>
          <div className="flex flex-col gap-3">
            {sparkRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs text-muted-foreground">
                  {row.label}
                </span>
                <div className="flex-1">
                  <Sparkline
                    color={row.color}
                    data={row.data}
                    height={28}
                    type={row.type ?? "line"}
                    width={120}
                  />
                </div>
                <span className="w-12 text-right text-xs font-medium tabular-nums">
                  {row.last}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={20} style={{ overflow: "visible" }}>
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
            {barLabel}
          </p>
          <BarChart color={barColor} data={barData} height={160} showValues={false} />
        </Card>
      </div>
    </div>
  );
}
