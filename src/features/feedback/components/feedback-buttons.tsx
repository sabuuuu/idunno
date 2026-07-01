"use client";

import * as React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import toast from "react-hot-toast";
import { useFeedback } from "~/features/feedback/hooks/use-feedback";
import { useQuery } from "@tanstack/react-query";
import { getSessionUserServerFn } from "~/server/auth";
import { useWindowManager } from "~/components/desktop/useWindowManager";
import { Button } from "~/components/ui/button";

interface FeedbackButtonsProps {
  sessionId: string;
  initialFeedback?: number | null;
  onFeedbackSubmitted?: () => void;
}

export function FeedbackButtons({ sessionId, initialFeedback, onFeedbackSubmitted }: FeedbackButtonsProps) {
  const { mutate, data, isPending } = useFeedback();
  const submitted = data?.ok === true || (initialFeedback !== null && initialFeedback !== undefined);

  const { data: user } = useQuery({
    queryKey: ["session-user"],
    queryFn: () => getSessionUserServerFn(),
  });
  const { openWindow } = useWindowManager();

  function handleFeedback(value: 1 | -1) {
    if (!user) {
      openWindow({ id: "login-window", title: "LOGIN.EXE", componentType: "login", x: typeof window !== "undefined" ? window.innerWidth / 2 - 175 : 200, y: typeof window !== "undefined" ? window.innerHeight / 2 - 150 : 200, width: 350, height: 300 });
      return;
    }
    mutate(
      { sessionId, value },
      {
        onSuccess: () => {
          toast.success("Thanks for the feedback.");
          onFeedbackSubmitted?.();
        },
        onError:   (err) => toast.error(err.message),
      },
    );
  }

  if (submitted) {
    return (
      <p
        className="font-mono text-[10px] text-vapor-dark opacity-80 tracking-widest uppercase"
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
        <Button
          key={value}
          variant="outline"
          aria-label={ariaLabel}
          disabled={isPending}
          onClick={() => handleFeedback(value)}
          className={`w-12 h-12 p-0 flex items-center justify-center border-2 border-vapor-rose bg-white shadow-[4px_4px_0_0_var(--color-vapor-rose)] transition-all duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-vapor-cream ${isPending ? 'opacity-50' : 'opacity-100'}`}
        >
          <Icon size={20} className="text-vapor-rose-dark" strokeWidth={1.75} />
        </Button>
      ))}
    </div>
  );
}
