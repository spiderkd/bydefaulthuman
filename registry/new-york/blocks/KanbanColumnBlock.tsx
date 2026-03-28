// "use client";

// import { StatCard } from "@/registry/new-york/ui/stat-card";
// import { Sparkline } from "@/registry/new-york/ui/sparkline";
// import { BarChart } from "@/registry/new-york/ui/bar-chart";
// import { Card } from "@/registry/new-york/ui/card";

// const sparkRows = [
//   {
//     label: "Revenue",
//     data: [18, 22, 19, 30, 28, 35, 32, 42, 38, 50],
//     color: "oklch(0.62 0.18 55)",
//     type: "area" as const,
//     last: "$50k",
//   },
//   {
//     label: "Users",
//     data: [120, 135, 128, 160, 155, 172, 168, 190],
//     color: "oklch(0.55 0.18 260)",
//     type: "line" as const,
//     last: "190",
//   },
//   {
//     label: "Churn",
//     data: [4.2, 3.8, 4.5, 3.2, 2.9, 3.1, 2.7, 2.4],
//     color: "oklch(0.63 0.22 25)",
//     type: "bar" as const,
//     last: "2.4%",
//   },
// ];

// const barData = [
//   { label: "Mon", value: 42 },
//   { label: "Tue", value: 68 },
//   { label: "Wed", value: 55 },
//   { label: "Thu", value: 91 },
//   { label: "Fri", value: 73 },
//   { label: "Sat", value: 38 },
// ];

// export function DashboardBlock() {
//   return (
//     <div className="flex flex-col gap-6 w-full">
//       {/* Stat cards row */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         <StatCard
//           label="Revenue"
//           value="$48,200"
//           trend="up"
//           trendLabel="+12% this month"
//           description="vs last month"
//         />
//         <StatCard
//           label="Active Users"
//           value="3,840"
//           trend="up"
//           trendLabel="+7%"
//           description="vs last month"
//         />
//         <StatCard
//           label="Churn Rate"
//           value="2.4%"
//           trend="down"
//           trendLabel="-0.8%"
//           description="vs last month"
//         />
//         <StatCard
//           label="Sessions"
//           value="21.5k"
//           trend="flat"
//           trendLabel="no change"
//           description="vs last month"
//         />
//       </div>

//       {/* Sparklines + Bar chart row */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <Card padding={20} style={{ overflow: "visible" }}>
//           <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
//             Trends
//           </p>
//           <div className="flex flex-col gap-3">
//             {sparkRows.map((row) => (
//               <div key={row.label} className="flex items-center gap-3">
//                 <span className="w-16 shrink-0 text-xs text-muted-foreground">
//                   {row.label}
//                 </span>
//                 <div className="flex-1">
//                   <Sparkline
//                     data={row.data}
//                     color={row.color}
//                     type={row.type}
//                     height={28}
//                   />
//                 </div>
//                 <span className="w-10 text-right text-xs font-medium tabular-nums">
//                   {row.last}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </Card>

//         <Card padding={20} style={{ overflow: "visible" }}>
//           <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
//             Weekly Visitors
//           </p>
//           <BarChart data={barData} color="oklch(0.62 0.18 55)" height={120} />
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Timeline,
  TimelineItem,
  type TimelineStatus,
} from "@/registry/new-york/ui/timeline";
import { Avatar } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Card } from "@/registry/new-york/ui/card";

interface FeedEvent {
  user: string;
  fallback: string;
  action: string;
  target: string;
  time: string;
  tag: string;
  tagVariant: "default" | "success" | "warning" | "destructive" | "outline";
}

const EVENTS: FeedEvent[] = [
  {
    user: "Alice Chen",
    fallback: "AC",
    action: "merged pull request",
    target: "feat/rough-tooltip",
    time: "2 min ago",
    tag: "merge",
    tagVariant: "success",
  },
  {
    user: "Bob Marsh",
    fallback: "BM",
    action: "opened issue",
    target: "Button hover flicker on Safari",
    time: "14 min ago",
    tag: "bug",
    tagVariant: "destructive",
  },
  {
    user: "Carol Dana",
    fallback: "CD",
    action: "commented on",
    target: "StatCard trend arrow alignment",
    time: "1 hr ago",
    tag: "comment",
    tagVariant: "outline",
  },
  {
    user: "Dev Patel",
    fallback: "DP",
    action: "deployed",
    target: "production v0.4.2",
    time: "3 hr ago",
    tag: "deploy",
    tagVariant: "warning",
  },
];

export function ActivityFeedBlock() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runAnimation = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setActiveIdx(-1);
    EVENTS.forEach((_, i) => {
      const t = setTimeout(() => setActiveIdx(i), (i + 1) * 700);
      timersRef.current.push(t);
    });
  };

  useEffect(() => {
    runAnimation();
    return () => timersRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatus = (i: number): TimelineStatus => {
    if (i < activeIdx) return "complete";
    if (i === activeIdx) return "active";
    return "pending";
  };

  return (
    <Card
      padding={24}
      style={{ overflow: "visible" }}
      className="w-full max-w-md"
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold">Activity Feed</p>
        <Badge variant="outline" animateOnHover>
          Live
        </Badge>
      </div>

      <Timeline>
        {EVENTS.map((event, i) => (
          <TimelineItem
            key={event.target}
            status={getStatus(i)}
            isLast={i === EVENTS.length - 1}
            title={
              <span className="flex items-center gap-2 flex-wrap">
                <Avatar fallback={event.fallback} size={22} />
                <span className="text-xs font-medium">{event.user}</span>
                <span className="text-xs text-muted-foreground">
                  {event.action}
                </span>
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {event.target}
                </span>
              </span>
            }
            description={
              <span className="flex items-center gap-2 mt-1">
                <Badge variant={event.tagVariant} className="text-[10px]">
                  {event.tag}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {event.time}
                </span>
              </span>
            }
          />
        ))}
      </Timeline>

      <button
        onClick={runAnimation}
        className="mt-4 self-start rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
      >
        Replay ↺
      </button>
    </Card>
  );
}
