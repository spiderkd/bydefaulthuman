"use client";

import { RoughHighlight } from "@/components/primitives/rough-highlight";
import { Badge } from "@/components/crumble/ui/badge";
import { Button } from "@/components/crumble/ui/button";
import { Card } from "@/components/crumble/ui/card";
import { Separator } from "@/components/crumble/ui/separator";

export interface PricingTier {
  badge?: string;
  cta: string;
  description: string;
  features: string[];
  highlight?: boolean;
  id: string;
  name: string;
  period: string;
  price: string;
}

export interface PricingCardBlockProps {
  eyebrow?: string;
  heading?: string;
  headingHighlight?: string;
  highlightColor?: string;
  onSelect?: (tier: PricingTier) => void;
  tiers?: PricingTier[];
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Great for personal projects and tinkering.",
    features: ["5 components", "Pencil theme only", "Community support", "MIT license"],
    cta: "Get started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Everything you need to ship polished products.",
    features: ["All 40+ components", "3 sketch themes", "Priority support", "Early access"],
    cta: "Start free trial",
    highlight: true,
    badge: "Most popular",
  },
  {
    id: "team",
    name: "Team",
    price: "$39",
    period: "per month",
    description: "For teams that move fast and build together.",
    features: ["Everything in Pro", "Up to 10 seats", "Private Slack channel", "Custom theme generator"],
    cta: "Contact sales",
  },
];

export function PricingCardBlock({
  eyebrow = "Pricing",
  heading = "Simple,",
  headingHighlight = "honest",
  highlightColor = "oklch(0.92 0.18 85)",
  onSelect,
  tiers = DEFAULT_TIERS,
}: PricingCardBlockProps) {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold">
          {heading}{" "}
          <RoughHighlight color={highlightColor} type="highlight">
            {headingHighlight}
          </RoughHighlight>{" "}
          pricing
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className="relative"
            padding={24}
            stacked={Boolean(tier.highlight)}
            style={{ overflow: "visible" }}
          >
            {tier.badge ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" animateOnHover>
                  {tier.badge}
                </Badge>
              </div>
            ) : null}

            <p className="mb-3 text-sm font-semibold">{tier.name}</p>

            <div className="mb-1 flex items-end gap-1">
              <span className="text-3xl font-bold">{tier.price}</span>
              <span className="mb-1 text-xs text-muted-foreground">/ {tier.period}</span>
            </div>

            <p className="mb-4 text-xs text-muted-foreground">{tier.description}</p>

            <Separator className="mb-4" />

            <ul className="mb-6 flex flex-col gap-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">*</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              onClick={() => onSelect?.(tier)}
              variant={tier.highlight ? "default" : "ghost"}
            >
              {tier.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
