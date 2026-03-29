"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/crumble/ui/avatar";
import { Badge } from "@/components/crumble/ui/badge";
import { Button } from "@/components/crumble/ui/button";
import { Card } from "@/components/crumble/ui/card";
import {
  Timeline,
  TimelineItem,
  type TimelineStatus,
} from "@/components/crumble/ui/timeline";

type TagVariant = "default" | "success" | "warning" | "destructive" | "outline";

export interface FeedEvent {
  action: string;
  id: number | string;
  read?: boolean;
  tag: string;
  tagVariant?: TagVariant;
  target: string;
  time: string;
  userFallback: string;
  userName: string;
}

export interface ActivityFeedBlockProps {
  animate?: boolean;
  animationStaggerMs?: number;
  events?: FeedEvent[];
  onEventClick?: (event: FeedEvent) => void;
  title?: string;
}

const DEFAULT_EVENTS: FeedEvent[] = [
  {
    id: 1,
    userFallback: "AC",
    userName: "Alice Chen",
    action: "merged pull request",
    target: "feat/rough-tooltip",
    time: "2 min ago",
    tag: "merge",
    tagVariant: "success",
    read: false,
  },
  {
    id: 2,
    userFallback: "BM",
    userName: "Bob Marsh",
    action: "opened issue",
    target: "Button hover flicker on Safari",
    time: "14 min ago",
    tag: "bug",
    tagVariant: "destructive",
    read: false,
  },
  {
    id: 3,
    userFallback: "CD",
    userName: "Carol Dana",
    action: "commented on",
    target: "StatCard trend arrow",
    time: "1 hr ago",
    tag: "comment",
    tagVariant: "outline",
    read: true,
  },
  {
    id: 4,
    userFallback: "DP",
    userName: "Dev Patel",
    action: "deployed",
    target: "production v0.4.2",
    time: "3 hr ago",
    tag: "deploy",
    tagVariant: "warning",
    read: true,
  },
];

export function ActivityFeedBlock({
  animate = true,
  animationStaggerMs = 700,
  events = DEFAULT_EVENTS,
  onEventClick,
  title = "Activity Feed",
}: ActivityFeedBlockProps) {
  const [items, setItems] = useState(events);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setItems(events);
  }, [events]);

  const runAnimation = () => {
    if (!animate) return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setActiveIndex(-1);
    items.forEach((_, index) => {
      const timer = setTimeout(
        () => setActiveIndex(index),
        (index + 1) * animationStaggerMs,
      );
      timersRef.current.push(timer);
    });
  };

  useEffect(() => {
    runAnimation();
    return () => timersRef.current.forEach(clearTimeout);
  }, [animate, animationStaggerMs, items]);

  const getStatus = (index: number): TimelineStatus => {
    if (!animate) return "complete";
    if (index < activeIndex) return "complete";
    if (index === activeIndex) return "active";
    return "pending";
  };

  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <Card padding={24} style={{ overflow: "visible" }} className="w-full max-w-md">
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{title}</p>
          {unreadCount > 0 ? <Badge variant="destructive">{unreadCount}</Badge> : null}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}
            >
              Mark all read
            </Button>
          ) : null}
          <Badge variant="outline" animateOnHover>
            Live
          </Badge>
        </div>
      </div>

      <Timeline>
        {items.map((event, index) => (
          <TimelineItem
            key={event.id}
            isLast={index === items.length - 1}
            status={getStatus(index)}
            title={
              <button
                className="flex flex-wrap items-center gap-2 text-left"
                onClick={() => onEventClick?.(event)}
                type="button"
              >
                <Avatar fallback={event.userFallback} size={22} />
                <span className={event.read ? "text-xs font-medium opacity-60" : "text-xs font-medium"}>
                  {event.userName}
                </span>
                <span className="text-xs text-muted-foreground">{event.action}</span>
                <span className="max-w-[120px] truncate text-xs font-medium">
                  {event.target}
                </span>
                {!event.read ? (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                ) : null}
              </button>
            }
            description={
              <span className="mt-1 flex items-center gap-2">
                <Badge variant={event.tagVariant ?? "outline"} className="text-[10px]">
                  {event.tag}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{event.time}</span>
              </span>
            }
          />
        ))}
      </Timeline>

      {animate ? (
        <button
          className="mt-4 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          onClick={runAnimation}
          type="button"
        >
          Replay
        </button>
      ) : null}
    </Card>
  );
}
