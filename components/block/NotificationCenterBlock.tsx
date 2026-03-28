"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Card } from "@/registry/new-york/ui/card";
import { Separator } from "@/registry/new-york/ui/separator";
import { Toggle } from "@/registry/new-york/ui/toggle";

export interface Notification {
  body: string;
  fallback: string;
  id: number | string;
  read: boolean;
  time: string;
  title: string;
  type: "mention" | "deploy" | "comment" | "alert";
}

export interface NotificationCenterBlockProps {
  markAllReadLabel?: string;
  muteLabel?: string;
  notifications?: Notification[];
  onDismiss?: (id: Notification["id"]) => void;
  onMarkAllRead?: () => void;
  onMuteChange?: (muted: boolean) => void;
  title?: string;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    fallback: "AC",
    title: "Alice mentioned you",
    body: "Can you review the rough tabs refactor before lunch?",
    time: "Just now",
    read: false,
    type: "mention",
  },
  {
    id: 2,
    fallback: "DP",
    title: "Production deploy finished",
    body: "Version 0.4.2 reached production without rollout errors.",
    time: "18 min ago",
    read: false,
    type: "deploy",
  },
  {
    id: 3,
    fallback: "CD",
    title: "New comment on stat-card",
    body: "The trend icon alignment is still off at smaller widths.",
    time: "1 hr ago",
    read: true,
    type: "comment",
  },
  {
    id: 4,
    fallback: "!",
    title: "Build warning detected",
    body: "A type mismatch appeared in the chart package after the last merge.",
    time: "3 hr ago",
    read: true,
    type: "alert",
  },
];

const TYPE_VARIANT: Record<Notification["type"], "default" | "success" | "warning" | "outline"> =
  {
    mention: "default",
    deploy: "success",
    comment: "outline",
    alert: "warning",
  };

export function NotificationCenterBlock({
  markAllReadLabel = "Mark all read",
  muteLabel = "Mute",
  notifications = DEFAULT_NOTIFICATIONS,
  onDismiss,
  onMarkAllRead,
  onMuteChange,
  title = "Notifications",
}: NotificationCenterBlockProps) {
  const [items, setItems] = useState(notifications);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <Card padding={24} style={{ overflow: "visible" }} className="w-full max-w-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{title}</p>
          {unreadCount > 0 ? <Badge variant="destructive">{unreadCount}</Badge> : null}
        </div>
        <Toggle
          checked={muted}
          label={muteLabel}
          onChange={(nextMuted) => {
            setMuted(nextMuted);
            onMuteChange?.(nextMuted);
          }}
        />
      </div>

      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setItems((current) => current.map((item) => ({ ...item, read: true })));
            onMarkAllRead?.();
          }}
          size="sm"
          variant="ghost"
        >
          {markAllReadLabel}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-start gap-3">
              <Avatar fallback={item.fallback} size={34} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={item.read ? "text-sm font-medium opacity-70" : "text-sm font-medium"}>
                      {item.title}
                    </p>
                    <Badge variant={TYPE_VARIANT[item.type]}>{item.type}</Badge>
                  </div>
                  <button
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => {
                      setItems((current) => current.filter((notification) => notification.id !== item.id));
                      onDismiss?.(item.id);
                    }}
                    type="button"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
                  {item.time}
                </p>
              </div>
            </div>
            {index < items.length - 1 ? <Separator className="mt-3" /> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
