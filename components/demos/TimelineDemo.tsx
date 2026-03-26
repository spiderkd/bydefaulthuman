"use client";

import { useEffect, useRef, useState } from "react";
import {
  Timeline,
  TimelineItem,
  type TimelineStatus,
} from "@/registry/new-york/ui/timeline";

interface Step {
  title: string;
  description?: string;
  time?: string;
  status: TimelineStatus;
}

const STEPS: Omit<Step, "status">[] = [
  { title: "Order placed", description: "Payment confirmed.", time: "9:00 AM" },
  {
    title: "Processing",
    description: "Items picked and packed.",
    time: "9:15 AM",
  },
  {
    title: "Out for delivery",
    description: "Your driver is on the way.",
    time: "11:30 AM",
  },
  { title: "Delivered", description: "Left at front door.", time: "2:04 PM" },
];

/**
 * Derives the status of every step given the index of the "active" step.
 *   activeIdx < i  → pending
 *   activeIdx === i → active
 *   activeIdx > i  → complete
 * When activeIdx === STEPS.length the animation has fully completed (all done).
 */
function deriveStatuses(activeIdx: number): TimelineStatus[] {
  return STEPS.map((_, i) => {
    if (i < activeIdx) return "complete";
    if (i === activeIdx) return "active";
    return "pending";
  });
}

export function TimelineDemo() {
  // -1 means "not started yet" (all pending)
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runAnimation = () => {
    // Clear any in-flight timers so re-runs are clean
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setActiveIdx(-1);

    // Stagger each step advance by 900 ms
    STEPS.forEach((_, i) => {
      const t = setTimeout(() => setActiveIdx(i), (i + 1) * 900);
      timersRef.current.push(t);
    });
  };

  // Kick off on mount
  useEffect(() => {
    runAnimation();
    return () => timersRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statuses =
    activeIdx === -1
      ? STEPS.map((): TimelineStatus => "pending")
      : deriveStatuses(activeIdx);

  return (
    <div className="flex flex-col items-start gap-4 w-full max-w-xs">
      <Timeline>
        {STEPS.map((step, i) => (
          <TimelineItem
            key={step.title}
            title={step.title}
            description={step.description}
            time={step.time}
            status={statuses[i]}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </Timeline>

      <button
        onClick={runAnimation}
        className="self-start rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
      >
        Replay ↺
      </button>
    </div>
  );
}
