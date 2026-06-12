"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { useFeedback } from "~/features/feedback/hooks/use-feedback";
import { cn } from "~/lib/utils";

interface FeedbackButtonsProps {
  sessionId: string;
}

export function FeedbackButtons({ sessionId }: FeedbackButtonsProps) {
  const { mutate, data, isPending } = useFeedback();

  const submitted = data?.ok === true;

  function handleFeedback(value: 1 | -1) {
    mutate(
      { sessionId, value },
      {
        onSuccess: () => toast.success("Thanks for the feedback."),
        onError: (err) => toast.error(err.message),
      },
    );
  }

  if (submitted) {
    return (
      <p className="text-sm text-muted-foreground">Thanks for the feedback.</p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-muted-foreground">Was this a good pick?</p>
      <Button
        variant="outline"
        size="icon"
        disabled={isPending}
        onClick={() => handleFeedback(1)}
        aria-label="Thumbs up"
      >
        <ThumbsUp className={cn("size-4", isPending && "opacity-50")} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={isPending}
        onClick={() => handleFeedback(-1)}
        aria-label="Thumbs down"
      >
        <ThumbsDown className={cn("size-4", isPending && "opacity-50")} />
      </Button>
    </div>
  );
}
