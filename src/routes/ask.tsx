import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { FlowController } from "~/features/question-flow/components/flow-controller";
import { getQuestions } from "~/features/question-flow/server/questions";
import { useRecommend } from "~/features/recommendation/hooks/use-recommend";

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
    <main className="relative flex flex-col items-center justify-center py-12 px-4 min-h-full">
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div className="crt-overlay absolute inset-0" aria-hidden="true" />
      <FlowController
        questions={questions}
        onComplete={handleComplete}
        isPending={isPending || isNavigating}
      />
    </main>
  );
}
