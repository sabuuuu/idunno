import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { FlowController } from "~/features/question-flow/components/flow-controller";
import { getQuestions } from "~/features/question-flow/server/questions";
import { useRecommend } from "~/features/recommendation/hooks/use-recommend";
import { WindowPortal } from "~/components/desktop/WindowPortal";

export const Route = createFileRoute("/ask")({
  loader: () => getQuestions(),
  component: AskPage,
});

function AskPage() {
  const questions = Route.useLoaderData();
  const navigate = useNavigate();
  const { mutate: submitAnswers, isPending } = useRecommend();
  // Keeps the loading screen visible while the result route's loader is running
  const [isNavigating, setIsNavigating] = useState(false);

  function handleComplete(answers: Record<string, string>) {
    submitAnswers(answers, {
      onSuccess: ({ sessionId }) => {
        setIsNavigating(true);
        navigate({ to: "/result/$sessionId", params: { sessionId } });
      },
      onError: (err) => {
        setIsNavigating(false);
        toast.error(err.message);
      },
    });
  }

  return (
    <WindowPortal
      id="ask-window"
      title="QUEST.EXE"
      componentType="ask"
      x={typeof window !== "undefined" ? Math.max(0, (window.innerWidth - 700) / 2) : 100}
      y={typeof window !== "undefined" ? Math.max(0, (window.innerHeight - 750) / 2) : 50}
      width={700}
      height={750}
    >
      <main className="relative flex flex-col items-center justify-center p-4 min-h-full">
        <FlowController
          questions={questions}
          onComplete={handleComplete}
          isPending={isPending || isNavigating}
        />
      </main>
    </WindowPortal>
  );
}
