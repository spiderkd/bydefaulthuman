"use client";

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/registry/new-york/ui/progress";

export function ProgressDemo() {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const DURATION = 5200; // ms to go 0 → 100

  const runAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setValue(0);
    startTimeRef.current = null;

    const step = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const pct = Math.min(elapsed / DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(eased * 100));
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    runAnimation();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-start gap-4 w-full max-w-md">
      <Progress
        className="w-full max-w-md"
        label="Loading"
        value={value}
        formatValue={(v: number) => `${v}%`}
        showValue
      />
    </div>
  );
}
