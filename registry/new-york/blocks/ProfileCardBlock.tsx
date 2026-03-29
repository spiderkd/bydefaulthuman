"use client";

import { RoughLine } from "@/components/primitives/rough-line";
import { Avatar, AvatarGroup } from "@/components/crumble/ui/avatar";
import { Badge } from "@/components/crumble/ui/badge";
import { Button } from "@/components/crumble/ui/button";
import { Card } from "@/components/crumble/ui/card";
import { Tooltip } from "@/components/crumble/ui/tooltip";

export interface MutualFollower {
  fallback: string;
  src?: string;
}

export interface ProfileCardBlockProps {
  avatarFallback?: string;
  avatarSrc?: string;
  bio?: string;
  followers?: number;
  following?: number;
  messageLabel?: string;
  mutualFollowers?: MutualFollower[];
  mutualFollowersLabel?: string;
  name?: string;
  onFollow?: (following: boolean) => void;
  onMessage?: () => void;
  role?: string;
  username?: string;
}

const DEFAULT_MUTUAL_FOLLOWERS: MutualFollower[] = [
  { fallback: "AC" },
  { fallback: "BM" },
  { fallback: "CD" },
  { fallback: "DP" },
];

export function ProfileCardBlock({
  avatarFallback = "GL",
  avatarSrc,
  bio = "Designing systems that feel playful without losing the sharp edges needed for production.",
  followers = 1420,
  following = 318,
  messageLabel = "Message",
  mutualFollowers = DEFAULT_MUTUAL_FOLLOWERS,
  mutualFollowersLabel = "Mutual followers",
  name = "Grace Liu",
  onFollow,
  onMessage,
  role = "Design Engineer",
  username = "@graceliu",
}: ProfileCardBlockProps) {
  return (
    <Card padding={24} style={{ overflow: "visible" }} className="w-full max-w-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar fallback={avatarFallback} size={64} src={avatarSrc} />
            <div>
              <p className="text-lg font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{username}</p>
              <div className="mt-2">
                <Badge variant="outline">{role}</Badge>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">{bio}</p>

        <RoughLine className="opacity-50" />

        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-lg font-semibold tabular-nums">{followers}</p>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
              Followers
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">{following}</p>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
              Following
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
              {mutualFollowersLabel}
            </p>
            <AvatarGroup
              avatars={mutualFollowers.map((follower) => ({
                fallback: follower.fallback,
                src: follower.src,
              }))}
              size={28}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => onFollow?.(true)} size="sm" variant="default">
              Follow
            </Button>
            <Tooltip content={messageLabel}>
              <span>
                <Button onClick={() => onMessage?.()} size="sm" variant="ghost">
                  {messageLabel}
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
}
