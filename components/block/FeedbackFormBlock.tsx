"use client";

import { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { Card } from "@/registry/new-york/ui/card";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Input } from "@/registry/new-york/ui/input";
import { Rating } from "@/registry/new-york/ui/rating";
import { Textarea } from "@/registry/new-york/ui/textarea";

export interface FeedbackData {
  email: string;
  message: string;
  rating: number;
  subscribe: boolean;
}

export interface FeedbackFormBlockProps {
  emailLabel?: string;
  emailPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  onSubmit?: (data: FeedbackData) => void | Promise<void>;
  ratingLabel?: string;
  ratingLabels?: string[];
  submitLabel?: string;
  subscribeLabel?: string;
  successBody?: string;
  successTitle?: string;
  title?: string;
}

const DEFAULT_RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export function FeedbackFormBlock({
  emailLabel = "Email",
  emailPlaceholder = "name@example.com",
  messageLabel = "Tell us more",
  messagePlaceholder = "What worked well? What felt rough?",
  onSubmit,
  ratingLabel = "How would you rate your experience?",
  ratingLabels = DEFAULT_RATING_LABELS,
  submitLabel = "Send feedback",
  subscribeLabel = "Keep me updated on new components",
  successBody = "Your note is in. We will use it to shape the next round of improvements.",
  successTitle = "Thanks for the feedback!",
  title = "Share your feedback",
}: FeedbackFormBlockProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (submitted) {
    return (
      <Card padding={24} style={{ overflow: "visible" }} className="w-full max-w-md">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">{successTitle}</p>
          <p className="text-sm leading-6 text-muted-foreground">{successBody}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding={24} style={{ overflow: "visible" }} className="w-full max-w-md">
      <form
        className="flex flex-col gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setSubmitting(true);
          try {
            await onSubmit?.({ email, message, rating, subscribe });
            setSubmitted(true);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <p className="text-lg font-semibold">{title}</p>

        <div className="flex flex-col gap-2">
          <Rating label={ratingLabel} onChange={setRating} value={rating} />
          <span className="text-xs text-muted-foreground">
            {ratingLabels[rating] ?? ""}
          </span>
        </div>

        <Textarea
          autoGrow
          label={messageLabel}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={messagePlaceholder}
          value={message}
        />

        <Input
          label={emailLabel}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={emailPlaceholder}
          type="email"
          value={email}
        />

        <Checkbox checked={subscribe} label={subscribeLabel} onChange={setSubscribe} />

        <Button disabled={submitting} type="submit">
          {submitting ? "Sending..." : submitLabel}
        </Button>
      </form>
    </Card>
  );
}
