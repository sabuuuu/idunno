"use client";

import * as React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import toast from "react-hot-toast";
import { useFeedback } from "~/features/feedback/hooks/use-feedback";

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
        onError:   (err) => toast.error(err.message),
      },
    );
  }

  if (submitted) {
    return (
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          color: "#857374",
          letterSpacing: "0.05em",
        }}
      >
        THANKS FOR THE FEEDBACK.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {(
        [
          { value: 1  as const, Icon: ThumbsUp,   ariaLabel: "Thumbs up"   },
          { value: -1 as const, Icon: ThumbsDown,  ariaLabel: "Thumbs down" },
        ] as const
      ).map(({ value, Icon, ariaLabel }) => (
        <button
          key={value}
          aria-label={ariaLabel}
          disabled={isPending}
          onClick={() => handleFeedback(value)}
          className="pixel-shadow-active group"
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #B76E79",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            boxShadow: "4px 4px 0px 0px #B76E79",
            opacity: isPending ? 0.5 : 1,
            transition: "transform 80ms, box-shadow 80ms",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(4px,4px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px 0px #B76E79";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px 0px #B76E79";
          }}
        >
          <Icon size={20} color="#8a4853" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
